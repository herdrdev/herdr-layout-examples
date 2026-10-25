# Chat

Spaces look like channels and agents look like teammates posting updates.
Open an agent's thread to see its tab's real terminals on the right.

![Chat](preview.png)

## What's in here

- `layouts/chat.json`: a purple sidebar, 440px activity feed and
  the active tab's terminals under a Thread heading.
- `mods/chat/`: one mod; `props().role` picks `top`,
  `sidebar`, `feed`, `thread` or `pane`.

## How it was built

1. `spaces()` becomes the channel list; clicking one runs
   `space.select`. All agents appear as direct messages.
2. The feed filters `agents()` to the active space. It shows one current
   status per agent, not a stored conversation.
3. An in-memory map remembers a local clock time when each agent's
   `seq` changes. There is no polling timer or terminal transcript read.
4. Direct messages and feed links run `agent.focus`.
   `setAgentOrder` follows the full agents list.
5. `panes()` supplies program icons and status dots above live terminals.

## What it assumes

- Only built-in Herdr APIs; no shipped mods, chat server or external CLI.
- `Geist` UI font and `paper` theme with pale purple overrides.
  The mod's purple sidebar and other colors are hardcoded.
- Search, the message box, formatting controls and Send are decoration.
  This mod does not send messages.
- “Launch team” and the “CC” avatar are fixed labels, not account data.
  Sidebar rows do not have a scrolling list.
- No existing `layouts/chat.json` or `mods/chat/`; rename their
  references first if those names are taken.

