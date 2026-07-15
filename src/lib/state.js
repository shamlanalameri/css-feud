/* ========================= state + review grouping ========================= */
import { uid, normTxt, similar } from './utils.js';

export function defaultState(id, title) {
  return {
    id,
    rev: 0,
    writer: '',
    title: title || 'CSS Feud',
    createdAt: Date.now(),
    demo: false,
    joinCode: id.slice(-4).toUpperCase(),
    teams: [
      { name: 'Team 1', color: '#CBA344', logo: '', players: ['', '', '', '', ''], score: 0, playerIdx: 0 },
      { name: 'Team 2', color: '#4F98FF', logo: '', players: ['', '', '', '', ''], score: 0, playerIdx: 0 },
    ],
    questions: [],
    qIdx: 0,
    // stage drives the whole event: setup -> survey (all questions) -> play (rounds)
    stage: 'setup', // setup | survey | play
    phase: 'idle', // per-round while playing: idle | review | board | roundEnd | final
    survey: { open: false, endsAt: 0, session: 0 }, // the single all-questions survey
    review: [],
    board: [],
    roundPoints: [0, 0],
    turn: null,
    buzz: { open: false, openedAt: 0 },
    paused: false,
    history: [],
    log: [],
    fx: { n: 0, type: '' },
  };
}

// Firebase Realtime Database silently drops empty arrays/objects and turns
// arrays into keyed objects, so a saved game can come back with missing
// `players`, teams as an object, etc. This coerces anything back to an array.
function asArray(v) {
  if (Array.isArray(v)) return v;
  if (v && typeof v === 'object') return Object.values(v);
  return [];
}

// Upgrade + repair a saved game to the current schema. Guarantees exactly two
// well-formed teams (5 players each), valid questions, and the survey/stage
// fields the new UI needs. Idempotent — safe on already-current state.
export function normalizeState(s) {
  if (!s || typeof s !== 'object') return s;

  if (!s.survey) {
    s.survey = { open: !!s.surveyOpen, endsAt: s.surveyEndsAt || 0, session: s.surveySession || 0 };
  }
  if (s.phase === 'survey') s.phase = 'idle'; // old per-question survey phase is gone
  if (!s.stage) {
    if (s.survey.open) s.stage = 'survey';
    else if (['review', 'board', 'roundEnd', 'final'].includes(s.phase)) s.stage = 'play';
    else s.stage = 'setup';
  }

  // Two teams, each with exactly five players — the part that was crashing.
  const teams = asArray(s.teams);
  const dflt = [
    { name: 'Team 1', color: '#CBA344' },
    { name: 'Team 2', color: '#4F98FF' },
  ];
  s.teams = [0, 1].map((i) => {
    const t = teams[i] || {};
    const players = asArray(t.players);
    return {
      name: t.name || dflt[i].name,
      color: t.color || dflt[i].color,
      logo: t.logo || '',
      players: [0, 1, 2, 3, 4].map((j) => (players[j] != null ? String(players[j]) : '')),
      score: +t.score || 0,
      playerIdx: +t.playerIdx || 0,
    };
  });

  s.questions = asArray(s.questions).map((q) => ({
    id: q.id || uid(),
    text: q.text || '',
    category: q.category || '',
    image: q.image || '',
    timeLimit: +q.timeLimit || 0,
    maxAnswers: +q.maxAnswers || 6,
    preRaw: q.preRaw || '',
    notes: q.notes || '',
  }));

  s.review = asArray(s.review);
  s.board = asArray(s.board);
  const rp = asArray(s.roundPoints);
  s.roundPoints = [+rp[0] || 0, +rp[1] || 0];
  s.buzz = s.buzz && typeof s.buzz === 'object' ? s.buzz : { open: false, openedAt: 0 };
  s.history = asArray(s.history);
  s.log = asArray(s.log);
  s.fx = s.fx && typeof s.fx === 'object' ? s.fx : { n: 0, type: '' };
  s.turn = s.turn === 0 || s.turn === 1 ? s.turn : null;
  if (typeof s.qIdx !== 'number' || s.qIdx < 0 || s.qIdx >= s.questions.length) s.qIdx = 0;
  return s;
}

export function blankQ(text) {
  return { id: uid(), text: text || '', category: '', image: '', timeLimit: 0, maxAnswers: 6, preRaw: '', notes: '' };
}

// Starter questions for a freshly created game — ready to edit or delete, so a
// new game has something to advance through instead of a single blank question.
export function starterQuestions() {
  return [
    "What is Fouzia's favourite colour?",
    "What is Ali's favourite football team?",
    'What is the first thing employees do when they arrive at the office?',
    'Name something employees always forget before a meeting.',
    'What is the most popular lunch order in the office?',
  ].map((t) => blankQ(t));
}

export function demoState() {
  const s = defaultState('demo', 'CSS Feud — demo game');
  s.demo = true;
  s.teams[0] = { name: 'Desert Falcons', color: '#CBA344', logo: '', players: ['Fouzia', 'Ali', 'Mariam', 'Omar', 'Huda'], score: 0, playerIdx: 0 };
  s.teams[1] = { name: 'Blue Oryx', color: '#4F98FF', logo: '', players: ['Khalid', 'Sara', 'Yousef', 'Noora', 'Hassan'], score: 0, playerIdx: 0 };
  const q1 = blankQ('What is the first thing employees do when they arrive at the office?');
  q1.category = 'Office life';
  q1.maxAnswers = 6;
  const q2 = blankQ('Name something employees always forget before a meeting.');
  q2.category = 'Meetings';
  q2.maxAnswers = 6;
  q2.preRaw = 'Laptop charger | 12\nNotebook and pen | 9\nJoining the call on time | 7\nAgenda | 5\nCoffee | 3';
  const q3 = blankQ('What is the most popular lunch order in the office?');
  q3.category = 'Food';
  q3.maxAnswers = 5;
  q3.timeLimit = 90;
  s.questions = [q1, q2, q3];
  return s;
}

export const DEMO_POOLS = [
  ['Coffee', 'coffee', 'Make coffee', 'Get coffe', 'Check email', 'check emails', 'Emails', 'Say good morning', 'good morning to everyone', 'Open laptop', 'open the laptop', 'Chat with colleagues', 'Karak', 'karak tea', 'Breakfast', 'Check WhatsApp', 'Coffee', 'check email', 'Coffee', 'Prayer', 'Open Teams', 'coffee first', 'Say hi', 'Check calendar'],
  ['Charger', 'laptop charger', 'Pen', 'a pen', 'Notebook', 'The agenda', 'agenda', 'Coffee', 'Their laptop', 'Meeting room booking', 'To join on time', 'Water', 'charger', 'Pen and paper', 'The meeting link'],
  ['Biryani', 'biryani', 'Shawarma', 'shawerma', 'Burger', 'burgers', 'Sushi', 'Salad', 'salads', 'Pasta', 'Manakish', 'Grilled chicken', 'biryani', 'Shawarma', 'Kebab', 'Poke bowl'],
];

export function parsePre(q) {
  return String(q.preRaw || '')
    .split('\n')
    .map((l) => {
      const m = l.split('|');
      const text = (m[0] || '').trim();
      const pts = parseInt((m[1] || '').trim(), 10);
      return text ? { text, pts: isNaN(pts) ? 0 : pts } : null;
    })
    .filter(Boolean);
}

// Group survey responses: exact/normalised match, then fuzzy (Levenshtein) match,
// seeded with any pre-approved answers. Points default to submission count.
export function buildGroups(q, RESP) {
  const groups = [];
  parsePre(q).forEach((p) => groups.push({ id: uid(), name: p.text, count: 0, points: p.pts, include: true, members: [], pre: true }));
  Object.values(RESP || {})
    .sort((a, b) => (a.ts || 0) - (b.ts || 0))
    .forEach((r) => {
      const raw = String(r.text || '').replace(/\s+/g, ' ').trim().slice(0, 80);
      const n = normTxt(raw);
      if (!n) return;
      let g = groups.find((g) => normTxt(g.name) === n || g.members.some((m) => normTxt(m) === n));
      if (!g) g = groups.find((g) => similar(normTxt(g.name), n));
      if (g) {
        g.count++;
        g.members.push(raw);
      } else groups.push({ id: uid(), name: raw[0].toUpperCase() + raw.slice(1), count: 1, points: 0, include: true, members: [raw], pre: false });
    });
  groups.forEach((g) => {
    if (!g.pre || g.count > 0) g.points = Math.max(g.count, g.pre ? g.points : g.count);
  });
  groups.sort((a, b) => (b.points || b.count) - (a.points || a.count));
  return groups;
}

export function mergeSuggestions(review) {
  const out = [];
  const r = review || [];
  for (let i = 0; i < r.length; i++)
    for (let j = i + 1; j < r.length; j++)
      if (similar(normTxt(r[i].name), normTxt(r[j].name))) out.push([r[i], r[j]]);
  return out.slice(0, 5);
}
