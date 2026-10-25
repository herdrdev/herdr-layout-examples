# Call

A pretend team call with live terminals as shared screens. Agents in other
tabs sit in the gallery; working ones speak, and blocked ones raise a hand.

![Call](preview.png)

## What's in here

- `layouts/call.json`: a meeting title, active tab's terminals, a
  215px gallery and a bottom toolbar.
- `mods/call/`: `props().role` picks `top`, `gallery`,
  `pane` or `toolbar`. Includes the toolbar icons and preview SVG.

## How it was built

1. `spaces()` supplies the standup title and tab name. A 1s timer
   updates the meeting clock from when the top bar started.
2. The active tab stays a real terminal block, with bottom participant
   labels from `panes()`.
3. The gallery reads `agents()` and excludes `focused().tab`.
   Program icons become avatars; status chooses green borders,
   raised hands and words such as “Camera off.”
4. Clicking a participant runs `agent.focus`.
   `setAgentOrder` records all agents in their model order.

## What it assumes

- Only built-in Herdr APIs; no shipped mods, call service or external CLI.
- `Geist` UI font, `graphite` theme and dark gray/green layout
  overrides. The mod hardcodes its own matching palette.
- This is not a video or audio client. Unmute, video, Chat, Record,
  Reactions, Share screen and Leave are decorative, as is Gallery view.
- Gallery tiles share one row without a scrolling list; many agents
  squeeze into the same space.
- No existing `layouts/call.json` or `mods/call/`; rename
  references and asset paths first if those names are taken.

