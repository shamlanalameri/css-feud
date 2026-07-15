/* ========================= sound ========================= */
// Synthesised game-show sounds via the Web Audio API — no audio files needed.

let MUTED = localStorage.getItem('cf:muted') === '1';
export const isMuted = () => MUTED;
export function setMuted(v) {
  MUTED = !!v;
  localStorage.setItem('cf:muted', MUTED ? '1' : '0');
}
export function toggleMuted() {
  setMuted(!MUTED);
  return MUTED;
}

let AC = null;
function ac() {
  AC = AC || new (window.AudioContext || window.webkitAudioContext)();
  if (AC.state === 'suspended') AC.resume();
  return AC;
}

function tone(f, when, dur, type, vol, slide) {
  if (MUTED) return;
  try {
    const c = ac(),
      o = c.createOscillator(),
      g = c.createGain(),
      t = c.currentTime + when;
    o.type = type || 'sine';
    o.frequency.setValueAtTime(f, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol || 0.18, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g);
    g.connect(c.destination);
    o.start(t);
    o.stop(t + dur + 0.05);
  } catch (e) {}
}

export const SND = {
  buzzer() { tone(170, 0, 0.55, 'sawtooth', 0.22); tone(120, 0, 0.55, 'square', 0.12); },
  correct() { tone(660, 0, 0.14, 'triangle', 0.2); tone(880, 0.13, 0.22, 'triangle', 0.2); },
  points() { tone(523, 0, 0.1, 'triangle', 0.16); tone(659, 0.09, 0.1, 'triangle', 0.16); tone(784, 0.18, 0.18, 'triangle', 0.18); },
  wrong() { tone(160, 0, 0.32, 'sawtooth', 0.2); tone(110, 0.3, 0.5, 'sawtooth', 0.22); },
  reveal() { tone(320, 0, 0.3, 'sine', 0.16, 640); tone(640, 0.22, 0.18, 'triangle', 0.14); },
  round() { [523, 659, 784, 1046].forEach((f, i) => tone(f, i * 0.12, 0.2, 'triangle', 0.17)); },
  win() {
    [523, 659, 784, 1046, 784, 1046, 1318].forEach((f, i) => tone(f, i * 0.15, 0.25, 'triangle', 0.18));
    tone(262, 0, 1.4, 'sine', 0.1);
  },
};
