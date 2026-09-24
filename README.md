# Leftovers!
A responsive, build-free board-game companion. Serve `dist/` with any static HTTP server.

- `dist/index.html`: semantic app layout and native accessible dialogs.
- `dist/style.css`: shared palette, desktop/tablet/mobile layout, reduced-motion support.
- `dist/app.js`: player rendering, dice, shuffled decks, transactions and device-local state.
- `dist/assets/board.jpg`: supplied board reference used for the grocery illustration.

The game starts with two editable players at £1,500 and supports 1–5 players. Dice history, players, deck order and transactions save in localStorage on this device. Games do not sync between devices. New game retains player names and resets all other game state. Negative balances are allowed for house rules. Cards are original companion content and use fictional game money.

Verified in browser: animated rolls/history, collection/payment, player isolation, applying a card, both decks, editing and adding players, reset, refresh persistence, invalid amounts, mobile and tablet layout. WebMCP tools expose reading state and rolling dice when supported.

The single-die edition uses a separate local save key; previous edition saves are retained.

## Deploy with Vercel
Import this GitHub repository in Vercel. The included `vercel.json` selects the Other framework preset, skips the build step, and publishes `dist/`. No environment variables or dependencies are required. Pushes to the production branch trigger new deployments once the GitHub integration is connected.
