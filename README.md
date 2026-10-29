# Herdr layout examples

Layouts made by agents for Herdr's release video. They're examples, not
official layouts: take them apart, copy what you like, expect rough edges.

Each layout folder is laid out like `~/.config/herdr-app`:

```
pasture/
├── RECIPE.md          what it is, how it was built, what it assumes
├── preview.png
├── layouts/pasture.json
└── mods/pasture/
```

Browse them at [herdr.dev/layouts](https://herdr.dev/layouts).

| Layout | |
| --- | --- |
| [Board](board/) | live agent cards in Needs you, Working, Done and Idle columns |
| [Call](call/) | a pretend call with terminal screens and an agent gallery |
| [Chat](chat/) | spaces as channels, agent status as messages, terminals as threads |
| [Code](code/) | an editor look with a fixed read-only CSS view and live terminals |
| [Mission](mission/) | green command feeds, an elapsed clock and agent status tiles |
| [Pasture](pasture/) | an actual herd |
| [Threads](threads/) | tabs as a project inbox with pins, snooze, a composer and diffs |

## Mods

A mod is a piece you add to your layout, not a whole window.

| Mod | |
| --- | --- |
| [Tmux prefix](tmux-prefix/) | Ctrl+B, then a key for tabs, panes and spaces, with a popup hint |

Browse them at [herdr.dev/mods](https://herdr.dev/mods). A mod folder has no
`layouts/` folder:

```
tmux-prefix/
├── RECIPE.md          the brief to build it from scratch
├── preview.png
├── mods/tmux-prefix/
└── keys.json          optional snippet to merge into your existing keys
```

## Share your own

Put a layout or mod in a public repo, one folder per example like these.
Add the GitHub topic `herdr-layout` for layouts or `herdr-mod` for mods.
They show up at herdr.dev/layouts or herdr.dev/mods.
