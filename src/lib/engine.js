/* ==========================================================================
   engine.js — the game engine.

   Holds all shared mutable game state and the full set of host/judge actions,
   ported 1:1 from the original single-file prototype. The React layer is a thin
   view over this: components read an immutable snapshot via subscribe()/
   getSnapshot() (useSyncExternalStore) and call ACT.* / setField() to mutate.
   Every mutation ends in persist() -> emit(), which republishes a fresh
   snapshot and re-renders subscribers.
   ========================================================================== */

import { ADMIN_PASSWORD, HAS_FB } from '../config.js';
import { Backend } from './backend.js';
import { uid, param, clone, setPath, fmtT, toast, download, normTxt } from './utils.js';
import { SND, isMuted, toggleMuted } from './sound.js';
import { confetti } from './confetti.js';
import { defaultState, blankQ, demoState, starterQuestions, normalizeState, DEMO_POOLS, parsePre, buildGroups } from './state.js';

/* ========================= app globals ========================= */
export const MODE = param('mode') || 'home';
let GID = '',
  S = null,
  RESPALL = {}, // { qIdx: { deviceKey: {text, ts} } } for every question at once
  BUZZ = [],
  INDEX = {};
let DEVICE = localStorage.getItem('cf:dev');
if (!DEVICE) {
  DEVICE = 'd' + uid();
  localStorage.setItem('cf:dev', DEVICE);
}
let ADMIN_OK = sessionStorage.getItem('cf:admin') === '1';
let ADMIN_TAB = 'live';
let UNDO = [],
  REDO = [];
let lastFxN = 0,
  lastWinner = null,
  BANNER_UNTIL = 0,
  AUTOCLOSED = 0;
let respUnsubs = [],
  respSubCount = -1;
let EDIT_Q = null; // expanded question editor index

/* ========================= derived helpers ========================= */
export const curQ = () => (S && S.questions[S.qIdx]) || null;
export const tname = (i) => (S.teams[i] ? S.teams[i].name || 'Team ' + (i + 1) : '');
export const baseURL = () => location.origin + location.pathname;
export const surveyURL = () => baseURL() + '?mode=survey&game=' + GID;
export const buzzerURL = (t) => baseURL() + '?mode=buzzer&team=' + t + '&game=' + GID;
// One submission per device per survey run (covers all questions at once).
export const answeredAllKey = () => 'cf:answeredall:' + GID + ':' + (S ? S.survey.session : 0);
export const getGID = () => GID;
export const getDevice = () => DEVICE;
export { HAS_FB };

// Response counts across all questions (used by the survey progress display).
export const respMap = (i) => RESPALL[i] || {};
export const respCount = (i) => Object.keys(RESPALL[i] || {}).length;
export function totalRespondents() {
  const set = new Set();
  Object.values(RESPALL).forEach((m) => Object.keys(m || {}).forEach((k) => set.add(k)));
  return set.size;
}

export function validPresses() {
  if (!S || !S.buzz) return [];
  return (BUZZ || []).filter((p) => p.t >= (S.buzz.openedAt || 0)).sort((a, b) => a.t - b.t);
}
export function derivedWinner() {
  if (!S || !S.buzz || !S.buzz.open) return null;
  const ps = validPresses();
  return ps.length ? ps[0].team : null;
}
export function gameProgress() {
  const done = Math.min(S.history.length, S.questions.length);
  return done + ' round' + (done === 1 ? '' : 's') + ' played';
}

/* ========================= subscription / snapshot ========================= */
const listeners = new Set();
let version = 0;
function buildSnapshot() {
  return {
    v: ++version,
    S,
    RESPALL,
    RESP: (S && RESPALL[S.qIdx]) || {},
    BUZZ,
    INDEX,
    GID,
    ADMIN_OK,
    ADMIN_TAB,
    EDIT_Q,
    MUTED: isMuted(),
    BANNER_UNTIL,
    HAS_FB,
  };
}
let snapshot = buildSnapshot();
export function subscribe(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
export function getSnapshot() {
  return snapshot;
}
function emit() {
  snapshot = buildSnapshot();
  listeners.forEach((cb) => cb());
}
export { emit };

/* ========================= persistence / undo / fx ========================= */
function addLog(msg) {
  S.log.unshift({ t: Date.now(), msg });
  if (S.log.length > 250) S.log.length = 250;
}
function pushUndo() {
  UNDO.push(clone(S));
  if (UNDO.length > 40) UNDO.shift();
  REDO = [];
}
function persist() {
  S.rev = (S.rev || 0) + 1;
  S.writer = DEVICE;
  S.updated = Date.now();
  Backend.saveState(S);
  Backend.setIndex(GID, { title: S.title, t: Date.now(), demo: !!S.demo });
  emit();
}
function mutate(fn, logMsg) {
  pushUndo();
  fn();
  if (logMsg) addLog(logMsg);
  persist();
}
function fire(type, team) {
  S.fx = { n: (S.fx ? S.fx.n : 0) + 1, type, team: team ?? null };
  lastFxN = S.fx.n;
  runFx(S.fx);
}
function runFx(fx) {
  if (fx.type === 'wrong') {
    SND.wrong();
    if (MODE === 'game' || MODE === 'buzzer') {
      const layer = document.getElementById('fxlayer');
      if (layer) {
        layer.innerHTML = '<div class="wrongX"><span>✕</span></div>';
        setTimeout(() => (layer.innerHTML = ''), 950);
      }
    }
  } else if (fx.type === 'correct') SND.correct();
  else if (fx.type === 'points') SND.points();
  else if (fx.type === 'reveal') SND.reveal();
  else if (fx.type === 'board') SND.points();
  else if (fx.type === 'round') SND.round();
  else if (fx.type === 'win') {
    SND.win();
    if (MODE !== 'survey') confetti(5000);
  }
}
function handleRemote(st) {
  if (!st) return;
  if (st.writer === DEVICE && st.rev <= (S ? S.rev : 0)) return;
  S = normalizeState(st);
  if (S.fx && S.fx.n !== lastFxN) {
    lastFxN = S.fx.n;
    runFx(S.fx);
  }
  subAllResp();
  emit();
}
// Subscribe to responses for every question at once, so counts and boards work
// no matter which question the host is on. Re-subscribes when the question
// count changes.
function subAllResp() {
  if (!S) return;
  const n = S.questions.length;
  if (respSubCount === n && respUnsubs.length) return;
  respUnsubs.forEach((u) => u && u());
  respUnsubs = [];
  respSubCount = n;
  RESPALL = {};
  for (let i = 0; i < n; i++) {
    const idx = i;
    const un = Backend.onResp(GID, idx, (m) => {
      RESPALL[idx] = m || {};
      emit();
    });
    respUnsubs.push(un);
  }
}
function handleBuzz() {
  const w = derivedWinner();
  if (w !== lastWinner) {
    lastWinner = w;
    if (w !== null) {
      SND.buzzer();
      BANNER_UNTIL = Date.now() + 2400;
      setTimeout(emit, 2500);
      if (MODE === 'admin' && ADMIN_OK && S.phase === 'board' && S.turn === null) {
        mutate(() => {
          S.turn = w;
        }, 'Buzz — ' + tname(w) + ' buzzed first, takes the turn');
        return;
      }
    }
  }
  emit();
}

/* ========================= controlled-input binding ========================= */
// Replaces the prototype's data-bind/innerHTML rebind. Components call this from
// onChange with the dotted state path and the new value.
export function setField(path, value, { num = false } = {}) {
  if (MODE === 'admin' && !ADMIN_OK) return;
  let v = value;
  if (num) v = parseFloat(v) || 0;
  pushUndo();
  try {
    setPath(S, path, v);
  } catch (e) {
    return;
  }
  if (/^teams\.\d\.score$/.test(path)) addLog('Score edited: ' + tname(+path.split('.')[1]) + ' → ' + v);
  if (/^teams\.\d\.playerIdx$/.test(path)) addLog('Current player changed for ' + tname(+path.split('.')[1]));
  persist();
}

/* ========================= buzz ========================= */
export function tryBuzz(team) {
  if (!S || !S.buzz || !S.buzz.open || S.paused) return;
  if (derivedWinner() !== null) return;
  Backend.pressBuzz(GID, team);
  SND.buzzer();
}

/* ========================= actions ========================= */
export const ACT = {
  /* --- auth / nav --- */
  login(pass) {
    if ((pass || '') === ADMIN_PASSWORD) {
      ADMIN_OK = true;
      sessionStorage.setItem('cf:admin', '1');
      emit();
    } else toast('Incorrect password. Please try again.');
  },
  logout() {
    ADMIN_OK = false;
    sessionStorage.removeItem('cf:admin');
    emit();
  },
  tab(t) {
    ADMIN_TAB = t;
    emit();
  },
  fullscreen() {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen().catch(() => toast('Full screen is not available here'));
  },
  mute() {
    const m = toggleMuted();
    toast(m ? 'Sound off' : 'Sound on');
    emit();
  },
  copy(text) {
    navigator.clipboard.writeText(text).then(() => toast('Link copied'));
  },

  /* --- game management --- */
  async newGame() {
    const title = prompt('Title for the new game:', 'CSS Feud');
    if (title === null) return;
    const g = 'g' + Date.now().toString(36);
    const st = defaultState(g, title.trim() || 'CSS Feud');
    st.questions = starterQuestions();
    GID = g;
    S = st;
    UNDO = [];
    REDO = [];
    respSubCount = -1;
    Backend.setActive(g);
    addLog('New game created');
    persist();
    wireGame();
    toast('New game created — game ID ' + g);
  },
  async loadGame(g) {
    GID = g;
    S = normalizeState(await Backend.loadState(GID));
    if (!S) {
      toast('Could not load that game');
      return;
    }
    Backend.setActive(GID);
    UNDO = [];
    REDO = [];
    respSubCount = -1;
    lastFxN = S.fx ? S.fx.n : 0;
    wireGame();
    emit();
    toast('Loaded: ' + S.title);
  },
  saveNow() {
    persist();
    toast('Game saved');
  },
  exportJson() {
    download('css-feud-' + GID + '.json', JSON.stringify(S, null, 2), 'application/json');
  },
  resetQuestion() {
    if (!confirm('Reset the current question? Board, review groups, and round points will be cleared.')) return;
    mutate(() => {
      S.board = [];
      S.review = [];
      S.roundPoints = [0, 0];
      S.turn = null;
      S.phase = 'idle';
      S.buzz = { open: false, openedAt: 0 };
    }, 'Question ' + (S.qIdx + 1) + ' reset');
  },
  resetScores() {
    if (!confirm('Reset both team scores to zero?')) return;
    mutate(() => {
      S.teams.forEach((t) => (t.score = 0));
      S.roundPoints = [0, 0];
      S.history = [];
    }, 'Scores reset');
  },
  resetResponses() {
    if (!confirm('Delete ALL survey responses (every question)?')) return;
    for (let i = 0; i < S.questions.length; i++) Backend.clearResp(GID, i);
    mutate(() => {
      S.survey.session = (S.survey.session || 0) + 1;
    }, 'All survey responses cleared');
  },
  resetAll() {
    if (!confirm('Reset the ENTIRE game? Teams and questions are kept; scores, boards, responses and the log are cleared.')) return;
    for (let i = 0; i < S.questions.length; i++) Backend.clearResp(GID, i);
    Backend.clearBuzz(GID);
    mutate(() => {
      S.teams.forEach((t) => {
        t.score = 0;
        t.playerIdx = 0;
      });
      S.qIdx = 0;
      S.stage = 'setup';
      S.phase = 'idle';
      S.survey = { open: false, endsAt: 0, session: (S.survey.session || 0) + 1 };
      S.review = [];
      S.board = [];
      S.roundPoints = [0, 0];
      S.turn = null;
      S.buzz = { open: false, openedAt: 0 };
      S.history = [];
      S.log = [];
    }, 'Full game reset');
  },
  loadDemo() {
    GID = 'demo';
    S = demoState();
    Backend.setActive('demo');
    DEMO_POOLS[0].forEach((t, i) => Backend.submitResp('demo', 0, 'demo' + i, t));
    UNDO = [];
    REDO = [];
    respSubCount = -1;
    addLog('Demo game loaded (with sample responses for question 1)');
    persist();
    wireGame();
    toast('Demo game loaded');
  },
  removeDemo() {
    if (!confirm('Delete the demo game and all its data?')) return;
    Backend.removeGame('demo');
    if (GID === 'demo') ACT.newGame();
    else emit();
    toast('Demo data removed');
  },

  /* --- questions --- */
  qAdd() {
    mutate(() => {
      S.questions.push(blankQ(''));
      EDIT_Q = S.questions.length - 1;
    }, 'Question added');
  },
  qDel(i) {
    i = +i;
    if (!confirm('Delete question ' + (i + 1) + '?')) return;
    mutate(() => {
      S.questions.splice(i, 1);
      if (S.qIdx >= S.questions.length) S.qIdx = Math.max(0, S.questions.length - 1);
    }, 'Question deleted');
  },
  qDup(i) {
    i = +i;
    mutate(() => {
      const c = clone(S.questions[i]);
      c.id = uid();
      S.questions.splice(i + 1, 0, c);
    }, 'Question duplicated');
  },
  qUp(i) {
    i = +i;
    if (i === 0) return;
    mutate(() => {
      const [q] = S.questions.splice(i, 1);
      S.questions.splice(i - 1, 0, q);
    });
  },
  qDown(i) {
    i = +i;
    if (i >= S.questions.length - 1) return;
    mutate(() => {
      const [q] = S.questions.splice(i, 1);
      S.questions.splice(i + 1, 0, q);
    });
  },
  qEdit(i) {
    EDIT_Q = EDIT_Q === +i ? null : +i;
    emit();
  },
  qMakeCurrent(i) {
    mutate(() => {
      S.qIdx = +i;
      S.phase = 'idle';
      S.review = [];
      S.board = [];
      S.roundPoints = [0, 0];
      S.turn = null;
      S.buzz = { open: false, openedAt: 0 };
    }, 'Jumped to question ' + (+i + 1));
  },

  /* --- live flow --- */
  // Phase 1: open ONE survey covering every question. Employees answer them all.
  openSurvey() {
    const withText = S.questions.filter((q) => q.text.trim()).length;
    if (!withText) {
      toast('Add at least one question with text first (Questions tab)');
      return;
    }
    mutate(() => {
      S.stage = 'survey';
      S.survey = { open: true, endsAt: 0, session: S.survey.session || 0 };
      S.qIdx = 0;
      S.phase = 'idle';
      S.review = [];
      S.board = [];
      S.roundPoints = [0, 0];
      S.turn = null;
      S.buzz = { open: false, openedAt: 0 };
    }, 'Survey opened for all ' + S.questions.length + ' questions');
  },
  // Close the survey and move into the play stage (build boards, buzz, score).
  closeSurvey() {
    mutate(() => {
      S.survey.open = false;
      S.stage = 'play';
      S.qIdx = 0;
      S.phase = 'idle';
    }, 'Survey closed — ' + totalRespondents() + ' people answered');
  },
  // Phase 2, per question: build the answer board from that question's responses.
  buildBoard() {
    mutate(() => {
      S.review = buildGroups(curQ(), RESPALL[S.qIdx] || {});
      S.phase = 'review';
    }, 'Building the board for question ' + (S.qIdx + 1));
  },
  simResponses() {
    // Simulate 14 people, each answering every question once (for rehearsing
    // the flow without real phones).
    for (let d = 0; d < 14; d++) {
      const dev = 'sim' + uid();
      S.questions.forEach((q, qi) => {
        const pool = DEMO_POOLS[qi % DEMO_POOLS.length];
        const t = pool[Math.floor(Math.random() * pool.length)];
        Backend.submitResp(GID, qi, dev, t);
      });
    }
    toast('14 simulated people answered');
  },
  boardFromPre() {
    const q = curQ();
    if (!parsePre(q).length) {
      toast('This question has no pre-approved answers');
      return;
    }
    mutate(() => {
      S.phase = 'review';
      S.review = buildGroups(curQ(), RESPALL[S.qIdx] || {});
    }, 'Review opened from pre-approved answers');
  },
  approveBoard() {
    const inc = (S.review || []).filter((g) => g.include && String(g.name).trim());
    if (!inc.length) {
      toast('Include at least one answer');
      return;
    }
    const q = curQ();
    mutate(() => {
      S.board = inc
        .slice()
        .sort((a, b) => (+b.points || 0) - (+a.points || 0))
        .slice(0, Math.max(1, +q.maxAnswers || 8))
        .map((g) => ({ id: uid(), text: String(g.name).trim(), points: Math.max(0, +g.points || 0), revealed: false, awarded: false, awardedTo: null }));
      S.phase = 'board';
      S.turn = null;
      S.roundPoints = [0, 0];
      fire('board');
    }, 'Board approved — ' + Math.min(inc.length, q.maxAnswers || 8) + ' answers published');
  },

  /* --- review --- */
  grpMerge(ids) {
    if (!ids || ids.length < 2) {
      toast('Tick two or more groups to merge');
      return;
    }
    mutate(() => {
      const groups = ids.map((id) => S.review.find((g) => g.id === id)).filter(Boolean);
      const base = groups[0];
      groups.slice(1).forEach((g) => {
        base.count += g.count;
        base.members = base.members.concat(g.members);
        S.review.splice(S.review.indexOf(g), 1);
      });
      base.points = Math.max(base.count, +base.points || 0);
    }, 'Answer groups merged');
  },
  grpMergePair(a, b) {
    mutate(() => {
      const ga = S.review.find((g) => g.id === a),
        gb = S.review.find((g) => g.id === b);
      if (!ga || !gb) return;
      ga.count += gb.count;
      ga.members = ga.members.concat(gb.members);
      ga.points = Math.max(ga.count, +ga.points || 0);
      S.review.splice(S.review.indexOf(gb), 1);
    }, 'Answer groups merged');
  },
  grpSplit(gid) {
    mutate(() => {
      const g = S.review.find((x) => x.id === gid);
      if (!g) return;
      const uniq = {};
      g.members.forEach((m) => {
        const n = normTxt(m);
        uniq[n] = uniq[n] || { text: m, c: 0 };
        uniq[n].c++;
      });
      const parts = Object.values(uniq);
      if (parts.length < 2) {
        toast('Nothing to separate in this group');
        return;
      }
      const i = S.review.indexOf(g);
      const news = parts.map((p) => ({ id: uid(), name: p.text[0].toUpperCase() + p.text.slice(1), count: p.c, points: p.c, include: true, members: Array(p.c).fill(p.text), pre: false }));
      S.review.splice(i, 1, ...news);
    }, 'Answer group separated');
  },
  grpDel(gid) {
    mutate(() => {
      S.review = S.review.filter((g) => g.id !== gid);
    }, 'Answer removed from review');
  },
  grpUp(gid) {
    const i = S.review.findIndex((g) => g.id === gid);
    if (i > 0)
      mutate(() => {
        const [g] = S.review.splice(i, 1);
        S.review.splice(i - 1, 0, g);
      });
  },
  grpDown(gid) {
    const i = S.review.findIndex((g) => g.id === gid);
    if (i < S.review.length - 1 && i > -1)
      mutate(() => {
        const [g] = S.review.splice(i, 1);
        S.review.splice(i + 1, 0, g);
      });
  },
  grpAdd(text, pts) {
    if (!String(text || '').trim()) {
      toast('Type the answer text first');
      return;
    }
    mutate(() => {
      S.review.push({ id: uid(), name: text.trim(), count: 0, points: Math.max(0, +pts || 0), include: true, members: [], pre: false });
    }, 'Answer added manually: ' + text.trim());
  },
  grpHideLow() {
    mutate(() => {
      S.review.forEach((g) => {
        if (g.count <= 1 && !g.pre) g.include = false;
      });
    }, 'Low-frequency answers hidden');
  },

  /* --- judge --- */
  revealAward(aid) {
    const a = S.board.find((x) => x.id === aid);
    if (!a) return;
    if (S.turn === null) {
      toast('No team has the turn — open the buzzers or transfer the turn first');
      return;
    }
    if (a.awarded && !confirm('This answer was already awarded. Award it again?')) return;
    const t = S.turn;
    mutate(() => {
      a.revealed = true;
      a.awarded = true;
      a.awardedTo = t;
      S.teams[t].score += a.points;
      S.roundPoints[t] += a.points;
      const p = S.teams[t].players[S.teams[t].playerIdx] || 'Player ' + (S.teams[t].playerIdx + 1);
      S.teams[t].playerIdx = (S.teams[t].playerIdx + 1) % 5;
      fire('correct', t);
      addLog(tname(t) + ' · ' + p + ' — correct: "' + a.text + '" (+' + a.points + ' pts)');
    });
  },
  revealOnly(aid) {
    const a = S.board.find((x) => x.id === aid);
    if (!a) return;
    mutate(() => {
      a.revealed = true;
      fire('reveal');
    }, 'Revealed (no points): "' + a.text + '"');
  },
  hideAns(aid) {
    const a = S.board.find((x) => x.id === aid);
    if (!a) return;
    mutate(() => {
      a.revealed = false;
    }, 'Hidden again: "' + a.text + '"');
  },
  removeAns(aid) {
    const a = S.board.find((x) => x.id === aid);
    if (!a) return;
    if (!confirm('Remove "' + a.text + '" from the board?')) return;
    mutate(() => {
      S.board = S.board.filter((x) => x.id !== aid);
    }, 'Removed from board: "' + a.text + '"');
  },
  addAns(text, pts) {
    if (!String(text || '').trim()) {
      toast('Type the answer text first');
      return;
    }
    mutate(() => {
      S.board.push({ id: uid(), text: text.trim(), points: Math.max(0, +pts || 0), revealed: false, awarded: false, awardedTo: null });
    }, 'Answer added to board: "' + text.trim() + '"');
  },
  wrong() {
    mutate(() => {
      const t = S.turn;
      fire('wrong');
      if (t !== null) {
        const p = S.teams[t].players[S.teams[t].playerIdx] || 'Player ' + (S.teams[t].playerIdx + 1);
        S.teams[t].playerIdx = (S.teams[t].playerIdx + 1) % 5;
        S.turn = t === null ? null : 1 - t;
        addLog(tname(t) + ' · ' + p + ' — wrong answer, turn passes to ' + tname(1 - t));
      } else addLog('Wrong answer');
    });
  },
  bonus(team, pts, why) {
    const t = +team;
    const p = +pts;
    why = why || 'judge decision';
    if (!p) {
      toast('Enter a points value (negative to deduct)');
      return;
    }
    mutate(() => {
      S.teams[t].score += p;
      if (S.phase === 'board') S.roundPoints[t] += p;
      fire(p > 0 ? 'points' : 'wrong', t);
      addLog(tname(t) + ' — ' + (p > 0 ? '+' : '') + p + ' pts (' + why + ')');
    });
  },
  transferTurn() {
    mutate(() => {
      S.turn = S.turn === null ? 0 : 1 - S.turn;
    }, 'Turn transferred to ' + tname(S.turn === null ? 0 : 1 - S.turn));
  },
  setTurn(t) {
    mutate(() => {
      S.turn = +t;
    }, 'Turn given to ' + tname(+t));
  },
  revealAll() {
    mutate(() => {
      S.board.forEach((a) => (a.revealed = true));
      fire('reveal');
    }, 'All remaining answers revealed');
  },
  pause() {
    mutate(() => {
      S.paused = !S.paused;
    }, S.paused ? 'Round resumed' : 'Round paused');
  },
  undo() {
    if (!UNDO.length) {
      toast('Nothing to undo');
      return;
    }
    REDO.push(clone(S));
    const prev = UNDO.pop();
    prev.rev = S.rev;
    S = prev;
    addLog('Undo');
    persist();
    toast('Undone');
  },
  redo() {
    if (!REDO.length) {
      toast('Nothing to redo');
      return;
    }
    UNDO.push(clone(S));
    const nxt = REDO.pop();
    nxt.rev = S.rev;
    S = nxt;
    addLog('Redo');
    persist();
    toast('Redone');
  },
  endRound() {
    mutate(() => {
      S.history.push({ q: curQ() ? curQ().text : '', pts: [...S.roundPoints] });
      S.board.forEach((a) => (a.revealed = true));
      S.phase = 'roundEnd';
      S.buzz.open = false;
      fire('round');
    }, 'Round ' + (S.qIdx + 1) + ' ended — ' + tname(0) + ' ' + S.roundPoints[0] + ' / ' + tname(1) + ' ' + S.roundPoints[1]);
  },
  skipQuestion() {
    if (!confirm('Skip this question without playing it?')) return;
    addLog('Question ' + (S.qIdx + 1) + ' skipped');
    ACT.nextQuestion(true);
  },
  nextQuestion(silent) {
    if (S.qIdx >= S.questions.length - 1) {
      ACT.showFinal();
      return;
    }
    mutate(() => {
      S.qIdx++;
      S.phase = 'idle';
      S.review = [];
      S.board = [];
      S.roundPoints = [0, 0];
      S.turn = null;
      S.buzz = { open: false, openedAt: 0 };
    }, silent === true ? null : 'Moved to question ' + (S.qIdx + 1));
  },
  showFinal() {
    mutate(() => {
      S.phase = 'final';
      fire('win');
    }, 'Final leaderboard shown');
  },
  returnToGame() {
    mutate(() => {
      S.phase = S.board.length ? 'board' : 'idle';
    }, 'Returned to game');
  },

  /* --- buzzers --- */
  openBuzzers() {
    Backend.clearBuzz(GID);
    lastWinner = null;
    mutate(() => {
      S.buzz = { open: true, openedAt: Backend.now() };
    }, 'Buzzers opened');
  },
  resetBuzzers() {
    lastWinner = null;
    mutate(() => {
      S.buzz.open = true;
      S.buzz.openedAt = Backend.now();
      S.turn = null;
    }, 'Buzzers reset');
  },
  closeBuzzers() {
    mutate(() => {
      S.buzz.open = false;
    }, 'Buzzers closed');
  },
  mainBuzz(t) {
    tryBuzz(+t);
  },
  buzzPress(t) {
    tryBuzz(+t);
  },

  /* --- results --- */
  downloadCsv() {
    const rows = [['CSS Feud results', S.title], [], ['Question', tname(0), tname(1)]];
    S.history.forEach((h, i) => rows.push(['Q' + (i + 1) + ': ' + h.q, h.pts[0], h.pts[1]]));
    rows.push([], ['Total', S.teams[0].score, S.teams[1].score]);
    rows.push([], ['Winning team', S.teams[0].score === S.teams[1].score ? 'Tie' : tname(S.teams[0].score > S.teams[1].score ? 0 : 1)]);
    rows.push([], ['Activity log']);
    S.log.slice().reverse().forEach((l) => rows.push([fmtT(l.t), l.msg]));
    const csv = rows.map((r) => r.map((c) => '"' + String(c ?? '').replace(/"/g, '""') + '"').join(',')).join('\n');
    download('css-feud-results.csv', csv, 'text/csv');
  },
  printResults() {
    window.print();
  },

  /* --- survey --- */
  // answers: { qIdx: text } — one submission covers every question at once.
  submitSurveyAll(answers) {
    if (!S.survey.open) {
      toast('The survey has closed');
      emit();
      return false;
    }
    const entries = Object.entries(answers || {}).filter(([, t]) => String(t || '').trim());
    if (!entries.length) {
      toast('Please answer at least one question');
      return false;
    }
    const dev = DEVICE + '_' + (S.survey.session || 0);
    entries.forEach(([i, t]) =>
      Backend.submitResp(GID, +i, dev, String(t).replace(/\s+/g, ' ').trim().slice(0, 60))
    );
    localStorage.setItem(answeredAllKey(), '1');
    SND.correct();
    emit();
    return true;
  },
};

/* ========================= import ========================= */
export function importJson(file) {
  const r = new FileReader();
  r.onload = () => {
    try {
      const st = JSON.parse(r.result);
      if (!st.teams || !st.questions) throw new Error('bad');
      st.id = st.id || 'g' + Date.now().toString(36);
      GID = st.id;
      S = normalizeState(st);
      respSubCount = -1;
      Backend.setActive(GID);
      addLog('Game imported from JSON');
      persist();
      wireGame();
      toast('Game imported');
    } catch (e) {
      toast('That file is not a valid CSS Feud export');
    }
  };
  r.readAsText(file);
}

/* ========================= wiring / timers / boot ========================= */
function wireGame() {
  Backend.onState(GID, handleRemote);
  Backend.onBuzz(GID, (list) => {
    BUZZ = (list || []).sort((a, b) => a.t - b.t);
    handleBuzz();
  });
  respSubCount = -1;
  subAllResp();
  refreshIndex();
}
async function refreshIndex() {
  try {
    INDEX = await Backend.getIndex();
  } catch (e) {
    INDEX = {};
  }
  emit();
}

// Optional survey countdown. The all-questions survey is normally closed
// manually by the host, so this only ticks if an end time was ever set.
export function pollTimers() {
  if (!S) return;
  if (S.survey && S.survey.open && S.survey.endsAt) {
    const left = Math.max(0, Math.ceil((S.survey.endsAt - Backend.now()) / 1000));
    if (left <= 0 && MODE === 'admin' && ADMIN_OK && AUTOCLOSED !== S.survey.session + 1) {
      AUTOCLOSED = S.survey.session + 1;
      ACT.closeSurvey();
      toast('Time is up — survey closed automatically');
    } else {
      emit();
    }
  }
}
export function surveySecondsLeft() {
  if (!S || !S.survey || !S.survey.open || !S.survey.endsAt) return null;
  return Math.max(0, Math.ceil((S.survey.endsAt - Backend.now()) / 1000));
}

// Global keyboard shortcuts: 1 / 2 buzz, B resets (game + admin screens).
export function handleKey(e) {
  const tag = (e.target.tagName || '').toLowerCase();
  if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
  if (MODE !== 'game' && MODE !== 'admin') return;
  if (e.key === '1') tryBuzz(0);
  else if (e.key === '2') tryBuzz(1);
  else if (e.key === 'b' || e.key === 'B') {
    if (S && S.buzz && (MODE === 'admin' ? ADMIN_OK : true)) ACT.resetBuzzers();
  }
}

export async function boot() {
  if (MODE === 'home') emit();
  try {
    await Backend.init();
  } catch (e) {
    console.error('Backend init failed', e);
    toast('Could not reach Firebase — check your config');
  }
  try {
    GID = param('game') || (await Backend.getActive()) || 'demo';
    S = normalizeState(await Backend.loadState(GID));
  } catch (e) {
    console.error('Loading game failed', e);
    GID = GID || 'demo';
    S = null;
  }
  if (!S) {
    if (GID === 'demo') {
      // Default landing game: demo teams + questions, but NO pre-filled answers,
      // so the survey counter starts live at 0. The "Load demo game" button in
      // Setup still seeds sample answers for practising the grouping step.
      S = demoState();
      addLog('Demo game created');
    } else S = defaultState(GID);
    S.rev = 1;
    S.writer = DEVICE;
    Backend.saveState(S);
    Backend.setIndex(GID, { title: S.title, t: Date.now(), demo: !!S.demo });
  }
  lastFxN = S.fx ? S.fx.n : 0;
  lastWinner = null;
  wireGame();
  emit();
}
