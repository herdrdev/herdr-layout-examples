# Code

A familiar dark editor around your terminals. The explorer lists real
files, but the code view is a fixed, read-only slice of one CSS file.

![Code](preview.png)

## What's in here

- `layouts/code.json`: activity rail, explorer, code view, terminal
  panel and blue status bar.
- `mods/vsc/`: `props().role` picks `bar`, `activity`,
  `explorer`, `editor`, `panel` or `status`.

## How it was built

1. `spaces()` supplies the active folder, title and branch;
   `agents()` supplies working and blocked counts.
2. Explorer initialization runs a `sh -c` directory-listing loop
   through `exec`, skipping `.git` and `node_modules`.
   A fixed set expands `public/css` and `src/pages`.
3. `readTextFile` reads `public/css/site.css` once.
   `EditorState` shows source lines 145–260 read-only, highlighted as CSS.
4. The active tab's real terminals fill the lower panel. Its headers use
   the shipped `pane` mod. There are no timers or click actions in vsc.

## What it assumes

- Shipped `pane` and icons from `workspace-chrome`; a local
  POSIX `sh`. File reads and shell commands do not target remote machines.
- The active folder at initialization contains `public/css/site.css`.
  The other fixed tabs are `src/pages/index.astro` and `README.md`.
  Explorer and editor do not reload when you switch spaces.
- `JetBrains Mono` for the code view. No theme is named in the layout;
  it sets dark backgrounds, borders and blue accent directly.
- Menus, file rows, editor tabs and terminal toolbar are decorative.
  Cursor position, diagnostics, the source-control badge and “claude ·
  codex” are fixed text, not editor state.
- No existing `layouts/code.json` or `mods/vsc/`; rename references
  before copying if taken. The layout name is `code`, not `vsc`.

