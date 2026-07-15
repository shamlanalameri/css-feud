/* ========================= utils ========================= */

// HTML escaping is only needed where we build raw markup strings. React escapes
// by default, so components pass user text as children — but a few helpers and
// the CSV/print paths still use esc().
export const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export const uid = () => Math.random().toString(36).slice(2, 10);

export const param = (k) => new URLSearchParams(location.search).get(k);

export const clone = (o) => JSON.parse(JSON.stringify(o));

export const fmtT = (t) =>
  new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

export function setPath(obj, path, val) {
  const p = path.split('.');
  let o = obj;
  for (let i = 0; i < p.length - 1; i++) o = o[p[i]];
  o[p[p.length - 1]] = val;
}

export function normTxt(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function lev(a, b) {
  if (a === b) return 0;
  const m = a.length,
    n = b.length;
  if (!m || !n) return m + n;
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++)
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[n];
}

export function similar(a, b) {
  if (!a || !b) return false;
  if (a === b) return true;
  const d = lev(a, b);
  return (d <= 1 && a.length > 3) || (d <= 2 && a.length > 6);
}

export function toast(msg) {
  const slot = document.getElementById('toast-slot');
  if (!slot) return;
  const div = document.createElement('div');
  div.className = 'toast';
  div.textContent = msg;
  slot.innerHTML = '';
  slot.appendChild(div);
  clearTimeout(toast._t);
  toast._t = setTimeout(() => (slot.innerHTML = ''), 2600);
}

export function download(name, text, type) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type: type || 'text/plain' }));
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
}
