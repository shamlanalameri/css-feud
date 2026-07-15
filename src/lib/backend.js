/* ========================= backends ========================= */
// Two interchangeable sync backends behind one interface. Firebase is used when
// FIREBASE_CONFIG.apiKey is set; otherwise a localStorage/BroadcastChannel
// backend syncs across tabs of the same browser (demo/rehearsal mode).

import { FIREBASE_CONFIG, HAS_FB, APP_ROOT } from '../config.js';
import { uid } from './utils.js';

function makeLocalBackend() {
  const bc = 'BroadcastChannel' in window ? new BroadcastChannel('cssfeud') : null;
  const subs = [];
  const K = {
    state: (g) => 'cf:' + g + ':state',
    resp: (g, q) => 'cf:' + g + ':resp:' + q,
    buzz: (g) => 'cf:' + g + ':buzz',
  };
  const get = (k, d) => {
    try {
      return JSON.parse(localStorage.getItem(k)) ?? d;
    } catch (e) {
      return d;
    }
  };
  const put = (k, v) => {
    localStorage.setItem(k, JSON.stringify(v));
    if (bc) bc.postMessage(k);
    route(k, true);
  };
  function route(k, self) {
    subs.forEach((s) => {
      if (s.k === k && (!self || s.echo)) s.cb(get(k, null));
    });
  }
  addEventListener('storage', (e) => {
    if (e.key && e.key.startsWith('cf:')) route(e.key);
  });
  if (bc) bc.onmessage = (e) => route(e.data);
  return {
    kind: 'local',
    now: () => Date.now(),
    async init() {},
    async getActive() {
      return get('cf:active', null);
    },
    setActive(g) {
      localStorage.setItem('cf:active', g);
    },
    async loadState(g) {
      return get(K.state(g), null);
    },
    saveState(s) {
      put(K.state(s.id), s);
    },
    onState(g, cb) {
      subs.push({ k: K.state(g), cb, echo: false });
    },
    async loadResp(g, q) {
      return get(K.resp(g, q), {});
    },
    submitResp(g, q, dev, text) {
      const m = get(K.resp(g, q), {});
      m[dev] = { text, ts: Date.now() };
      put(K.resp(g, q), m);
    },
    clearResp(g, q) {
      put(K.resp(g, q), {});
    },
    onResp(g, q, cb) {
      const s = { k: K.resp(g, q), cb, echo: true };
      subs.push(s);
      cb(get(s.k, {}));
      return () => subs.splice(subs.indexOf(s), 1);
    },
    pressBuzz(g, team) {
      const l = get(K.buzz(g), []);
      l.push({ team, t: Date.now(), id: uid() });
      put(K.buzz(g), l.slice(-60));
    },
    clearBuzz(g) {
      put(K.buzz(g), []);
    },
    onBuzz(g, cb) {
      const s = { k: K.buzz(g), cb, echo: true };
      subs.push(s);
      cb(get(s.k, []));
    },
    async getIndex() {
      return get('cf:index', {});
    },
    setIndex(g, meta) {
      const i = get('cf:index', {});
      i[g] = meta;
      localStorage.setItem('cf:index', JSON.stringify(i));
    },
    removeGame(g) {
      localStorage.removeItem(K.state(g));
      localStorage.removeItem(K.buzz(g));
      for (let i = 0; i < 60; i++) localStorage.removeItem(K.resp(g, i));
      const idx = get('cf:index', {});
      delete idx[g];
      localStorage.setItem('cf:index', JSON.stringify(idx));
    },
  };
}

function makeFirebaseBackend() {
  let db = null,
    offset = 0;
  const P = (g) => APP_ROOT + '/games/' + g;
  function loadScript(src) {
    return new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = res;
      s.onerror = rej;
      document.head.appendChild(s);
    });
  }
  return {
    kind: 'firebase',
    now: () => Date.now() + offset,
    async init() {
      const v = '10.12.2';
      await loadScript('https://www.gstatic.com/firebasejs/' + v + '/firebase-app-compat.js');
      await loadScript('https://www.gstatic.com/firebasejs/' + v + '/firebase-auth-compat.js');
      await loadScript('https://www.gstatic.com/firebasejs/' + v + '/firebase-database-compat.js');
      // eslint-disable-next-line no-undef
      firebase.initializeApp(FIREBASE_CONFIG);
      // eslint-disable-next-line no-undef
      db = firebase.database();
      try {
        // eslint-disable-next-line no-undef
        await firebase.auth().signInAnonymously();
      } catch (e) {
        console.warn('Anonymous auth unavailable:', e.message);
      }
      db.ref('.info/serverTimeOffset').on('value', (s) => (offset = s.val() || 0));
    },
    async getActive() {
      return (await db.ref(APP_ROOT + '/active').once('value')).val();
    },
    setActive(g) {
      db.ref(APP_ROOT + '/active').set(g);
    },
    async loadState(g) {
      return (await db.ref(P(g) + '/state').once('value')).val();
    },
    saveState(s) {
      db.ref(P(s.id) + '/state').set(JSON.parse(JSON.stringify(s)));
    },
    onState(g, cb) {
      let first = true;
      db.ref(P(g) + '/state').on('value', (s) => {
        if (first) {
          first = false;
          return;
        }
        cb(s.val());
      });
    },
    async loadResp(g, q) {
      return (await db.ref(P(g) + '/resp/' + q).once('value')).val() || {};
    },
    submitResp(g, q, dev, text) {
      // eslint-disable-next-line no-undef
      db.ref(P(g) + '/resp/' + q + '/' + dev).set({ text, ts: firebase.database.ServerValue.TIMESTAMP });
    },
    clearResp(g, q) {
      db.ref(P(g) + '/resp/' + q).remove();
    },
    onResp(g, q, cb) {
      const r = db.ref(P(g) + '/resp/' + q),
        f = (s) => cb(s.val() || {});
      r.on('value', f);
      return () => r.off('value', f);
    },
    pressBuzz(g, team) {
      // eslint-disable-next-line no-undef
      db.ref(P(g) + '/buzz').push({ team, t: firebase.database.ServerValue.TIMESTAMP, id: uid() });
    },
    clearBuzz(g) {
      db.ref(P(g) + '/buzz').remove();
    },
    onBuzz(g, cb) {
      db.ref(P(g) + '/buzz').on('value', (s) => {
        const v = s.val() || {};
        cb(Object.values(v));
      });
    },
    async getIndex() {
      return (await db.ref(APP_ROOT + '/index').once('value')).val() || {};
    },
    setIndex(g, meta) {
      db.ref(APP_ROOT + '/index/' + g).set(meta);
    },
    removeGame(g) {
      db.ref(P(g)).remove();
      db.ref(APP_ROOT + '/index/' + g).remove();
    },
  };
}

export const Backend = HAS_FB ? makeFirebaseBackend() : makeLocalBackend();
