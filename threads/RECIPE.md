# Threads

Every tab becomes a thread in a project inbox. Pin, snooze or settle work,
send follow-ups below the live terminal, and open files or diffs on the right.

![Threads](preview.png)

## What's in here

- `layouts/threads.json`: inbox, terminals, composer, floating details
  and a hidden Files/Diff panel.
- `mods/t4-threads/`: inbox and shared SVG icons.
- `t4-head`: brand/crumbs via `props().part`, details/panel toggles
  and a terminal drawer using split/zoom.
- `t4-composer`: sends text; `t4-new`: new-thread dialog.
- `t4-details`: Git actions; `t4-panel-head`: Files/Diff switches;
  `t4-files`: read-only viewer; `t4-diff`: changes against HEAD.

## How it was built

1. `spaces()` and `panes()` become thread rows; `exec("git", ...)`
   groups worktrees by repository. Pins, snoozes, project filter, details
   and colors use shared state. Rows run `tab.select` and `tab.settle`.
2. A 1s timer updates short working durations, otherwise every 30 ticks.
   A 1.5s timer drains PR lookups; `gh pr list` is cached for 180s.
   Default branches skip lookup. PR links use the system opener.
3. Composer uses `agents()`, `focused()` and `hc(["send", ...])`.
   Enter/send clears the box and sends to the focused agent.
4. New threads run `tab.new` or open shipped `worktree`.
   The typed text names the tab/branch; it is not sent as a task.
5. Details polls every 4s when enabled. Commit runs `git add -A`
   then commit; Push runs `git push -u origin HEAD`; PR runs
   `gh pr create --fill --web`.
6. Files polls every 5s using Git or `rg --files`, then
   `readTextFile`/`EditorState`. Diff polls every 3s, includes new
   files and caps the expanded diff at 1,500 lines.

## What it assumes

- Shipped `menu`, `picker`, `worktree` and the
  `workspace-chrome/plus.svg` asset; `git`, optional authenticated
  `gh`, `rg` outside Git, and a local system URL opener.
- Hardcoded launch choices: `claude`, `codex`, `pi`, `grok`
  or shell. Install whichever you choose. `EDITOR = ["code"]` is fixed.
- Details currently references undefined `on` in render; enabling it
  can fail. Its editor button cannot be relied on as supplied.
- `graphite` with blue/black overrides and hardcoded panels; code uses
  the settings font, diffs fall back to JetBrains Mono.
- Access/Plan/attach controls are decoration. Files caps at 5,000 paths
  and 400,000 characters. Shared `t4.*`/`space.colors` keys persist.
- No existing `layouts/threads.json` or eight `mods/t4-*/` folders;
  rename references and asset paths first if taken.

