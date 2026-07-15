import React, { useRef } from 'react';
import { BoundText } from '../../components/fields.jsx';
import { ACT, getGID, importJson } from '../../lib/engine.js';
import { HAS_FB } from '../../config.js';

export default function Setup({ snap }) {
  const S = snap.S;
  const GID = getGID();
  const idx = snap.INDEX || {};
  const games = Object.keys(idx).sort((a, b) => (idx[b].t || 0) - (idx[a].t || 0));
  const fileRef = useRef(null);

  return (
    <div className="grid2">
      <div>
        <div className="panel">
          <h3>This game</h3>
          <label>Game title</label>
          <BoundText path="title" value={S.title} />
          <label>Game ID</label>
          <input value={GID} disabled readOnly />
          <p className="hint">
            Auto-save is on — every change is stored immediately and survives page refreshes. The join code shown to
            employees is <b>{S.joinCode}</b>.
          </p>
          <div className="row">
            <button className="btn btn-primary" onClick={ACT.newGame}>
              Create a new game
            </button>
            <button className="btn btn-outline" onClick={ACT.saveNow}>
              Save now
            </button>
            <button className="btn btn-outline" onClick={ACT.exportJson}>
              Export JSON
            </button>
            <label className="btn btn-outline" style={{ margin: 0 }}>
              Import JSON
              <input
                ref={fileRef}
                type="file"
                accept=".json"
                style={{ display: 'none' }}
                onChange={(e) => {
                  if (e.target.files[0]) importJson(e.target.files[0]);
                  e.target.value = '';
                }}
              />
            </label>
          </div>
        </div>

        <div className="panel">
          <h3>Resume a saved game</h3>
          {games.length ? (
            games.map((g) => (
              <div key={g} className="row" style={{ padding: '7px 0', borderBottom: '1px solid var(--ink-100)' }}>
                <b style={{ flex: 1 }}>{idx[g].title || g}</b>
                <span className="hint" style={{ margin: 0 }}>
                  {g}
                  {g === GID ? ' · open now' : ''}
                </span>
                {g === GID ? null : (
                  <button className="btn btn-sm btn-outline" onClick={() => ACT.loadGame(g)}>
                    Open
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="hint">No other saved games yet.</p>
          )}
        </div>

        <div className="panel">
          <h3>Demo content</h3>
          <p className="hint">
            A ready-made game with two teams, five players each, three questions and sample survey responses.
          </p>
          <div className="row">
            <button className="btn btn-outline" onClick={ACT.loadDemo}>
              Load demo game
            </button>
            <button className="btn btn-outline" onClick={ACT.removeDemo}>
              Remove demo data
            </button>
          </div>
        </div>
      </div>

      <div>
        <div className="panel">
          <h3>Connection</h3>
          {HAS_FB ? (
            <p className="hint">✓ Firebase is configured — all devices sync live through your Realtime Database.</p>
          ) : (
            <p className="hint">
              Running in <b>local demo mode</b>: admin, game screen, survey and buzzers sync across tabs of this browser
              only. To play across phones and laptops, paste your Firebase config into <code>FIREBASE_CONFIG</code> in{' '}
              <code>src/config.js</code> — see the Help tab.
            </p>
          )}
        </div>

        <div className="panel danger-zone">
          <h3>Resets</h3>
          <p className="hint">Each action asks for confirmation.</p>
          <div className="row">
            <button className="btn btn-sm btn-outline" onClick={ACT.resetQuestion}>
              Reset current question
            </button>
            <button className="btn btn-sm btn-outline" onClick={ACT.resetScores}>
              Reset scores only
            </button>
            <button className="btn btn-sm btn-outline" onClick={ACT.resetResponses}>
              Reset survey responses
            </button>
            <button className="btn btn-sm btn-red" onClick={ACT.resetAll}>
              Reset entire game
            </button>
          </div>
        </div>

        <div className="panel">
          <h3>Sound</h3>
          <div className="row">
            <button className="btn btn-outline" onClick={ACT.mute}>
              {snap.MUTED ? 'Unmute sounds' : 'Mute sounds'}
            </button>
            <span className="hint" style={{ margin: 0 }}>
              Applies to this device only.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
