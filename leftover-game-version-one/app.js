'use strict';
const $ = selector => document.querySelector(selector);
let balance = 1500, entry = '', operation = null, dieValue = 2, rolling = false;
const symbols = {'+': '+', '-': '−', '*': '×', '/': '÷'};
const format = value => String(value);
const status = message => { $('#calculator-status').textContent = message; };
function renderCalculator() {
  $('#balance').textContent = entry || format(balance);
  $('#expression').textContent = operation ? `${format(balance)} ${symbols[operation]}` : 'YOUR BALANCE';
  document.querySelectorAll('.operator').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.key === operation)));
}
function calculate() {
  if (!operation || entry === '') return true;
  const value = Number(entry);
  if (operation === '/' && value === 0) { status('Cannot divide by zero. Press AC to cancel, or enter a new amount.'); entry = ''; renderCalculator(); return false; }
  let next = operation === '+' ? balance + value : operation === '-' ? balance - value : operation === '*' ? balance * value : balance / value;
  next = Math.round((next + Number.EPSILON) * 100) / 100;
  if (!Number.isFinite(next) || Math.abs(next) > 999999999) { status('That result is too large. Press AC to cancel.'); return false; }
  balance = next; entry = ''; operation = null; status('Balance updated. Ready for your next move.'); return true;
}
function press(key) {
  if (/^[0-9]$/.test(key)) {
    if (!operation) { status('Choose +, −, × or ÷ first to change your balance.'); return; }
    if (entry.replace('.', '').length >= 9 || (entry.includes('.') && entry.split('.')[1].length >= 2)) return;
    entry = entry === '0' ? key : entry + key;
  } else if (key === '.') { if (operation && !entry.includes('.')) entry = (entry || '0') + '.';
  } else if (key === 'Backspace') { entry = entry.slice(0, -1);
  } else if (key === 'AC') { entry = ''; operation = null; status('Calculation cleared. Your balance is unchanged.');
  } else if (key === '=') { calculate();
  } else if (Object.hasOwn(symbols, key)) { if (!calculate()) { renderCalculator(); return; } operation = key; status('Enter an amount, then press =.'); }
  renderCalculator();
}
function quickTransaction(amount) {
  const next = Math.round((balance + amount) * 100) / 100;
  if (Math.abs(next) > 999999999) { status('That result is too large.'); return; }
  balance = next; entry = ''; operation = null; renderCalculator();
  status(amount > 0 ? 'Passed GO. Collected 200.' : 'Jail fee paid. Deducted 50.');
}
$('#pass-go').addEventListener('click', () => quickTransaction(200));
$('#jail').addEventListener('click', () => quickTransaction(-50));
document.querySelectorAll('[data-key]').forEach(button => button.addEventListener('click', () => press(button.dataset.key)));
$('#reset').addEventListener('click', () => { if (confirm('Start over with a balance of 1500?')) { balance = 1500; entry = ''; operation = null; renderCalculator(); status('Fresh start. Your balance is 1500.'); } });
document.addEventListener('keydown', event => {
  if ($('#card-dialog').open || event.ctrlKey || event.metaKey || event.altKey) return;
  if (event.key === 'Enter' && event.target.closest('button,a')) return;
  const key = event.key === 'Enter' ? '=' : event.key === 'Escape' || event.key === 'Delete' ? 'AC' : event.key;
  if (/^[0-9.+*/=-]$/.test(key) || ['AC','Backspace'].includes(key)) { event.preventDefault(); press(key); }
});
function randomInt(max) {
  const values = new Uint32Array(1), limit = Math.floor(4294967296 / max) * max;
  do { crypto.getRandomValues(values); } while (values[0] >= limit);
  return values[0] % max;
}
function renderDie(value) {
  const positions = {1:[5],2:[1,9],3:[1,5,9],4:[1,3,7,9],5:[1,3,5,7,9],6:[1,3,4,6,7,9]};
  $('#die').replaceChildren(...positions[value].map(position => { const pip = document.createElement('span'); pip.className = 'pip'; pip.style.gridArea = `${Math.ceil(position / 3)} / ${(position - 1) % 3 + 1}`; return pip; }));
  $('#die').setAttribute('aria-label', `Die showing ${value}`);
}
async function rollDice() {
  if (rolling) throw new Error('A roll is already in progress.');
  rolling = true; $('#roll').disabled = true; $('#die').classList.add('rolling'); $('#roll-result').textContent = 'Rolling…';
  await new Promise(resolve => setTimeout(resolve, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 550));
  dieValue = randomInt(6) + 1; renderDie(dieValue);
  $('#die').classList.remove('rolling'); $('#roll').disabled = false; rolling = false;
  $('#roll-result').textContent = `You rolled ${dieValue}. Move ${dieValue} ${dieValue === 1 ? 'space' : 'spaces'}!`;
  return {value: dieValue};
}
$('#roll').addEventListener('click', () => { void rollDice(); });
const decks = {
  chance: [
    ['A fresh lap', 'Advance to GO. Collect 200.'], ['A lucky payout', 'Your investment pays off. Collect 50 from the bank.'],
    ['Back you go', 'Go back three spaces. Follow the instructions on the space you reach.'], ['An unexpected repair', 'Pay 25 for each house and 100 for each hotel you own.'],
    ['Take a trip', 'Advance to the nearest railroad. If it is owned, pay the usual rent. If you pass GO, collect 200.'], ['Caught speeding', 'Pay a speeding fine of 15 to the bank.'],
    ['A little windfall', 'Collect 150 from the bank.'], ['Straight to jail', 'Go directly to jail. Do not pass GO and do not collect 200.'],
    ['Your lucky break', 'Keep this card: get out of jail free. Remember it at the table until you use it.'], ['Treat the table', 'Pay each other player 50.']
  ],
  community: [
    ['A pleasant surprise', 'A bank error works in your favor. Collect 200.'], ['Doctor’s orders', 'Pay a doctor’s fee of 50.'],
    ['Happy birthday!', 'Collect 10 from each other player.'], ['A helping hand', 'Your holiday fund pays out. Collect 100.'],
    ['Time for tuition', 'Pay school fees of 50.'], ['A small refund', 'Collect a tax refund of 20.'],
    ['Good news in the mail', 'You receive an inheritance. Collect 100.'], ['Hospital visit', 'Pay hospital fees of 100.'],
    ['Community champion', 'You win a local contest. Collect 10.'], ['Back to the beginning', 'Advance to GO. Collect 200.']
  ]
};
const lastCard = {chance:-1, community:-1};
function drawCard(deck) {
  let index; do { index = randomInt(decks[deck].length); } while (index === lastCard[deck]); lastCard[deck] = index;
  const [title, message] = decks[deck][index];
  $('#card-type').textContent = deck === 'chance' ? 'Chance' : 'Community Chest';
  $('#card-title').textContent = title; $('#card-message').textContent = message;
  $('#card-dialog').style.borderTopColor = deck === 'chance' ? 'var(--green)' : 'var(--blue)';
  $('#card-type').style.color = deck === 'chance' ? 'var(--green)' : 'var(--blue)';
  $('#card-dialog').showModal();
}
document.querySelectorAll('[data-deck]').forEach(button => button.addEventListener('click', () => drawCard(button.dataset.deck)));
$('#close-card').addEventListener('click', () => $('#card-dialog').close());
$('#card-done').addEventListener('click', () => $('#card-dialog').close());
renderDie(dieValue);
// Progressive enhancement; browsers without WebMCP use the ordinary controls.
if (document.modelContext?.registerTool) {
  const lifecycle = new AbortController();
  const tools = [
    {name:'read_game_state',description:'Read the current balance and single die value.',annotations:{readOnlyHint:true},execute:() => ({balance,dieValue})},
    {name:'roll_die',description:'Roll one six-sided die and update its visible pips.',annotations:{readOnlyHint:false},execute:rollDice}
  ];
  for (const tool of tools) {
    try { Promise.resolve(document.modelContext.registerTool({...tool,inputSchema:{type:'object',properties:{},additionalProperties:false},execute:input => {
      if (!input || typeof input !== 'object' || Array.isArray(input) || Object.keys(input).length) throw new Error('Expected an empty object.');
      return tool.execute();
    }},{signal:lifecycle.signal})).catch(() => {}); } catch { /* Optional API. */ }
  }
  addEventListener('pagehide', () => lifecycle.abort(), {once:true});
}
