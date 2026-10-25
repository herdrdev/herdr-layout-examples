// "Code": a layout that looks like a familiar code editor. One mod in roles
// (props.role): bar (title bar), activity (icon column), explorer (the
// space's real file tree), editor (file tabs and a read-only code view),
// panel (the TERMINAL panel's tab strip, the agents' panes sit under it),
// status (the blue status bar). Colors are a dark editor theme.

import { View, div, svg, image } from "gpui-kit";
import { v_flex, h_flex, Editor, EditorState } from "gpui-base";
import { spaces, agents, props, exec, readTextFile, run } from "herdr";

const C = {
  bar: "#3c3c3c", activity: "#333333", side: "#252526", editor: "#1e1e1e", tabs: "#252526",
  tabOff: "#2d2d2d", line: "#1a1a1a", text: "#cccccc", dim: "#8b8b8b", bright: "#ffffff",
  blue: "#007acc", select: "#37373d", accent: "#0e639c", red: "#f14c4c", yellow: "#cca700", green: "#89d185",
};
const ICON = (n) => `mods/workspace-chrome/${n}.svg`;
const OPEN = ["public/css/site.css", "src/pages/index.astro", "README.md"]; // editor tabs
const SHOW = "public/css/site.css";                                         // the active one
const EXPANDED = new Set(["public", "public/css", "src", "src/pages"]);
const EXT = { css: "#56b6c2", astro: "#ff7e33", md: "#519aba", ts: "#3178c6", mjs: "#cbcb41", json: "#cbcb41", html: "#e44d26", lock: "#8b8b8b" };

const space = () => spaces().find((s) => s.active);

class Bar {
  render() {
    const s = space();
    return h_flex().size_full().bg(C.bar).items_center().px(10).text_size(12).text_color(C.text)
      .child(h_flex().gap(14).items_center()
        .child(div().size(12).rounded(6).bg("#ff5f57")).child(div().size(12).rounded(6).bg("#febc2e")).child(div().size(12).rounded(6).bg("#28c840")))
      .child(h_flex().ml(28).gap(16).text_color(C.dim).children(["File", "Edit", "Selection", "View", "Go", "Run", "Terminal", "Help"].map((m) => div().child(m))))
      .child(div().flex_1())
      .child(div().px(90).py(2).rounded(5).bg("#2a2a2a").border_1().border_color("#4a4a4a").text_color(C.dim).child(`${s?.name ?? "website"} — Herdr`))
      .child(div().flex_1());
  }
}

class Activity {
  render() {
    const needs = agents().filter((a) => a.status === "blocked").length;
    const item = (icon, on, badge) => div().relative().w_full().h(48).flex().items_center().justify_center()
      .when(on, (el) => el.child(div().absolute().left(0).top(0).w(2).h_full().bg(C.bright)))
      .child(svg(ICON(icon)).size(24).text_color(on ? C.bright : "#858585"))
      .when(Boolean(badge), (el) => el.child(div().absolute().right(8).bottom(8).min_w(16).h(16).px(4).rounded(8).bg(C.blue)
        .text_size(10).text_color(C.bright).flex().items_center().justify_center().child(String(badge))));
    return v_flex().size_full().bg(C.activity).items_center()
      .child(item("files", true)).child(item("search")).child(item("git-branch", false, 4)).child(item("layers", false, needs || null))
      .child(div().flex_1()).child(item("settings"));
  }
}

class Explorer {
  init(_p, cx) {
    this.tree = new Map();
    this.load("", cx);
    for (const d of EXPANDED) this.load(d, cx);
  }
  load(dir, cx) {
    const root = space()?.folder;
    if (!root) return;
    cx.spawn(async (cx) => {
      const r = await exec("sh", ["-c", 'cd "$1" && for p in * .[!.]*; do [ -e "$p" ] || continue; [ "$p" = .git ] && continue; [ "$p" = node_modules ] && continue; [ -d "$p" ] && echo "d $p" || echo "f $p"; done', "x", `${root}/${dir}`]);
      const list = r.stdout.trim().split("\n").filter(Boolean).map((l) => ({ dir: l[0] === "d", name: l.slice(2) }));
      list.sort((a, b) => (b.dir - a.dir) || a.name.localeCompare(b.name));
      this.tree.set(dir, list);
      cx.notify();
    });
  }
  rows(dir, depth, out) {
    for (const e of this.tree.get(dir) ?? []) {
      const path = dir ? `${dir}/${e.name}` : e.name;
      const open = EXPANDED.has(path), active = path === SHOW;
      const ext = e.name.split(".").pop();
      out.push(h_flex().h(22).flex_none().pl(8 + depth * 12).gap(5).items_center().text_size(13)
        .bg(active ? C.select : "#00000000").text_color(active ? C.bright : C.text)
        .child(e.dir ? svg(ICON(open ? "chevron-down" : "chevron-right")).size(14).text_color(C.text) : div().w(14))
        .when(!e.dir, (el) => el.child(div().w(14).text_size(10).font_weight(700).text_color(EXT[ext] ?? C.dim).child(ext === "md" ? "M↓" : ext === "css" ? "#" : "◆")))
        .child(div().truncate().child(e.name)));
      if (e.dir && open) this.rows(path, depth + 1, out);
      if (out.length > 60) break;
    }
    return out;
  }
  render() {
    return v_flex().size_full().bg(C.side).text_color(C.text).overflow_hidden()
      .child(h_flex().h(35).flex_none().px(20).items_center().text_size(11).text_color(C.dim).child("EXPLORER"))
      .child(h_flex().h(22).flex_none().px(6).gap(4).items_center().text_size(11).font_weight(700)
        .child(svg(ICON("chevron-down")).size(14)).child(div().child((space()?.name ?? "").toUpperCase())))
      .child(v_flex().flex_1().min_h(0).overflow_hidden().children(this.rows("", 0, [])));
  }
}

class EditorPane {
  init(_p, cx) {
    const root = space()?.folder;
    cx.spawn(async (cx) => {
      const text = (await readTextFile(`${root}/${SHOW}`)) ?? "";
      this.code = EditorState.new({
        language: "css", readonly: true, value: text.split("\n").slice(144, 260).join("\n"), font_size: 14,
        font_family: "JetBrains Mono",
        syntax: { keyword: "#569cd6", string: "#ce9178", comment: "#6a9955", function: "#dcdcaa", type: "#d7ba7d",
                  number: "#b5cea8", constant: "#9cdcfe", variable: "#9cdcfe", operator: "#d4d4d4", punctuation: "#d4d4d4" },
      });
      cx.notify();
    });
  }
  render() {
    const tab = (path, on) => {
      const name = path.split("/").pop(), ext = name.split(".").pop();
      return h_flex().h_full().px(12).gap(6).items_center().text_size(13)
        .bg(on ? C.editor : C.tabOff).text_color(on ? C.bright : C.dim).border_r(1).border_color(C.line)
        .when(on, (el) => el.border_t(1).border_color(C.blue))
        .child(div().text_size(10).font_weight(700).text_color(EXT[ext] ?? C.dim).child(ext === "md" ? "M↓" : ext === "css" ? "#" : "◆"))
        .child(div().child(name)).child(div().ml(6).text_color(on ? C.text : "#00000000").child("×"));
    };
    return v_flex().size_full().bg(C.editor)
      .child(h_flex().h(35).flex_none().bg(C.tabs).children(OPEN.map((p) => tab(p, p === SHOW))))
      .child(h_flex().h(22).flex_none().px(16).gap(4).items_center().text_size(12).text_color(C.dim)
        .child(div().child(SHOW.split("/").join("  ›  "))))
      .child(this.code ? Editor.new(this.code).flex_1().min_h(0) : div().flex_1());
  }
}

class Panel {
  render() {
    const t = (name, on) => v_flex().h_full().justify_center().px(10).text_size(11)
      .text_color(on ? C.bright : C.dim).when(on, (el) => el.border_b(1).border_color(C.bright)).child(name);
    return h_flex().size_full().bg(C.editor).border_t(1).border_color("#414141").px(10).items_center()
      .child(h_flex().h_full().gap(6).children(["PROBLEMS", "OUTPUT", "DEBUG CONSOLE"].map((n) => t(n, false))).child(t("TERMINAL", true)).child(t("PORTS", false)))
      .child(div().flex_1())
      .child(h_flex().gap(14).items_center().text_size(12).text_color(C.dim)
        .child(div().child("claude  ·  codex")).child(div().child("+")).child(div().child("⌄")).child(div().child("▢")).child(div().child("×")));
  }
}

class Status {
  render() {
    const s = space(), list = agents();
    const working = list.filter((a) => a.status === "working").length, needs = list.filter((a) => a.status === "blocked").length;
    const item = (text, color) => div().px(6).text_color(color ?? C.bright).child(text);
    return h_flex().size_full().bg(C.blue).items_center().text_size(12)
      .child(div().h_full().px(10).bg("#16825d").flex().items_center().text_color(C.bright).child("><"))
      .child(item(`⎇ ${s?.branch ?? "main"}*`)).child(item("⊗ 0  △ 0"))
      .child(item(`◉ ${working} agents working`))
      .when(needs > 0, (el) => el.child(div().px(6).h_full().flex().items_center().bg("#c72e0f").text_color(C.bright).child(`● ${needs} needs you`)))
      .child(div().flex_1())
      .child(item("Ln 152, Col 7")).child(item("Spaces: 2")).child(item("UTF-8")).child(item("LF")).child(item("CSS")).child(item("Herdr"));
  }
}

const ROLES = { bar: Bar, activity: Activity, explorer: Explorer, editor: EditorPane, panel: Panel, status: Status };

export default class Vsc extends View {
  init(p, cx) {
    const R = ROLES[(props() ?? p ?? {}).role];
    this.role = R ? new R() : null;
    this.role?.init?.(p, cx);
  }
  render(cx) {
    return this.role ? this.role.render(cx) : div();
  }
}
