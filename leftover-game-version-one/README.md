# Game Night — Monopoly-style companion

A responsive, dependency-free single-page website. Open `index.html` in a modern browser to play. All fonts and assets work offline; no installation or build step is needed.

## Run or deploy

- Open `index.html` directly, or serve this folder with any static web server.
- For a local server: `python3 -m http.server 8000` from this folder, then open http://localhost:8000.
- Upload the entire folder to any static hosting provider. Keep `index.html`, `style.css`, `app.js`, and `assets/` together. There are no environment variables or external services.

## Play

- Start with 1500. Select + or −, type an amount, then = to collect or pay. Multiplication and division also work. Calculations run left to right and round to two decimal places. Negative balances are allowed.
- Pass GO adds 200 immediately. Jail subtracts 50 immediately. Both cancel any unfinished calculation and apply to the current balance.
- AC cancels the pending calculation without deleting your balance. The ↺ control asks before resetting to 1500.
- The keyboard supports digits, operators, Enter (=), Escape/Delete (AC), Backspace, and decimals.
- Chance and Community Chest each have 10 randomized messages. Consecutive draws from a deck will not repeat. Cards do not automatically change your balance; follow the instructions and enter changes once using the calculator.
- Roll Dice gives one random result from 1–6, with matching pips and an accessible announcement.
- State lasts for this page session. Reloading starts fresh at 1500.

The mobile layout follows the supplied reference: two cards, money calculator, then one die. Desktop uses a two-column arrangement. Dialogs support Escape and keyboard focus; controls have visible focus rings; motion respects reduced-motion settings.

This is an unofficial companion with adapted card messages, not a full board-game rules engine. The grocery artwork is reused from the supplied project assets.
