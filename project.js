// trust score calculator: 100 minus 3 per critical, 2 per high and 1 per medium failure, never below 0
const fields = ['c', 'h', 'm'].map(id => document.getElementById(id));
const out = document.getElementById('score');
function calc() {
  const [c, h, m] = fields.map(f => Math.max(0, parseInt(f.value, 10) || 0));
  out.textContent = Math.max(0, 100 - 3 * c - 2 * h - m);
}
fields.forEach(f => f.addEventListener('input', calc));
calc();
