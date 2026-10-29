# Tmux prefix

Ctrl+B, then a key: tmux-style shortcuts for Herdr tabs, panes and spaces. A small hint stays open while you decide. This is an optional mod, not a layout or a terminal multiplexer.

![Tmux prefix hint](preview.png)

## Install

Copy `mods/tmux-prefix/` into your Herdr home's `mods/` folder. The usual home is `~/.config/herdr-app`; Herdr Dev uses `~/.config/herdr-app-dev`. Don't replace your layout.

Merge the entries from this folder's `keys.json` into your home's `keys.json`, keeping the other bindings:

```json
{
  "global": { "ctrl-b": "mod.open:tmux-prefix" },
  "terminal": { "ctrl-b": "mod.open:tmux-prefix" },
  "mod:tmux-prefix": { "ctrl-b": "tmux-prefix.send-prefix" }
}
```

The third section makes the second Ctrl+B send a literal Ctrl+B instead of opening another hint. This takes Ctrl+B away from terminal programs, including tmux itself; use Ctrl+B Ctrl+B to reach them. Remove conflicting `ctrl-b` bindings from the active `layout:<name>` section, if you have any.

Check the installed mod with your matching binary:

```sh
herdr-app check ~/.config/herdr-app/mods/tmux-prefix
# Herdr Dev instead:
herdr-app-dev check ~/.config/herdr-app-dev/mods/tmux-prefix
```

Herdr reloads the mod and keys without restarting. Check `herdr-app status` (or your Dev binary) for errors. To uninstall, remove these key entries and the mod folder.

## Keys after Ctrl+B

| Key | Action |
| --- | --- |
| `c` | New tab |
| `%` / `"` | Split right / down |
| `x` | Close the focused pane and end its terminal |
| `n` / `p` | Next / previous tab |
| `1`–`9`, `0` | Select tab 1–9, 10 (Herdr counts from 1) |
| `h j k l` or arrows | Focus left / down / up / right; repeatable |
| `J` / `K` | Next / previous space; repeatable |
| `z` | Toggle pane zoom |
| `d` | Minimize the window; not a tmux detach |
| `?` | Toggle the full, scrollable binding list |
| Escape | Cancel |
| Ctrl+B | Send a literal Ctrl+B to the focused terminal |

There is **no timeout after the prefix**. After a repeatable action, you have 500 ms to repeat it without pressing Ctrl+B again: Ctrl+B, J, J, K moves two spaces forward, then one back. Each repeat restarts the window. A different bound key runs its usual prefix action and closes the hint unless it is repeatable. `?` returns to waiting without a timeout.

An unbound key after the initial prefix just closes the hint, like tmux. During the repeat window an unbound simple key is forwarded to the now-focused terminal and closes the hint. Forwarding uses `hc keys`: ASCII letters (including uppercase), digits, spaces, unshifted ASCII punctuation, Enter, Tab, Backspace and arrows only. Other shifted symbols (such as `!` or `+`), Unicode, modified shortcuts and composition aren't replayed. Escape always cancels, never forwards. Outside the hint, typing is untouched. Existing app key bindings can still win over the mod's raw key handler.

## Make it yours

Edit `REPEAT_MS` and `BINDINGS` at the top of `mods/tmux-prefix/main.js`. Each binding is `[key, label, command, args, repeatable]`. Use real Herdr command names from `herdr-app commands`; the optional final `true` keeps the repeat window open. Shifted characters come from the key event's `key_char`, so `%`, `"`, `?` and uppercase J/K are distinct from their unshifted keys. There is no pane-resize binding: Herdr doesn't expose a pane-resize command.

The mod uses a focusable popup, `cx.timer.after` only for repeats, and `nextCommand()` for the second Ctrl+B. It has no background listener and adds nothing to the layout. Literal keys go through the existing `herdr.hc` API to the focused terminal, including remote terminal addresses. `d` minimizes rather than quits, leaving programs running. There are no external dependencies beyond Herdr and its core.

For agents rebuilding this example: keep one mod folder, the key snippet and this recipe. Follow the installed `herdr.d.ts` and `gpui-kit.d.ts`, preserve users' other keys, and never modify shipped mods. Verify a long pause after Ctrl+B, new tab, both splits, J J K repeats, Escape, literal Ctrl+B and normal typing in an isolated home. `herdr-app check` must pass.

## Website

This example intentionally has no `layouts/` folder. The website's `scripts/vendor-layouts.mjs` accepts folders with a recipe and preview without requiring a layout JSON, so it can vendor this folder unchanged. It will appear under `/layouts` as an example; the recipe must make clear that installation adds a mod and keys, not a layout. A mods-only gallery would need a separate website change; no dummy layout is needed.
