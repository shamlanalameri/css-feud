import React from 'react';
import { Logo } from '../components/common.jsx';
import { ACT, getGID } from '../lib/engine.js';
import { HAS_FB } from '../config.js';
import Live from './admin/Live.jsx';
import Teams from './admin/Teams.jsx';
import Questions from './admin/Questions.jsx';
import Setup from './admin/Setup.jsx';
import Log from './admin/Log.jsx';
import Help from './admin/Help.jsx';

const TABS = [
  ['live', 'Live controls'],
  ['teams', 'Teams and players'],
  ['questions', 'Questions'],
  ['setup', 'Setup and data'],
  ['log', 'Activity log'],
  ['help', 'Help and checklist'],
];

export default function Admin({ snap }) {
  const S = snap.S;
  const tab = snap.ADMIN_TAB;

  let body;
  if (tab === 'live') body = <Live snap={snap} />;
  else if (tab === 'teams') body = <Teams snap={snap} />;
  else if (tab === 'questions') body = <Questions snap={snap} />;
  else if (tab === 'setup') body = <Setup snap={snap} />;
  else if (tab === 'log') body = <Log snap={snap} />;
  else body = <Help />;

  return (
    <div className="admin">
      <div className="admin-top">
        <Logo />
        <div>
          <div className="ttl">{S.title}</div>
          <div className="sub">
            Admin portal · game ID <b>{getGID()}</b> · {HAS_FB ? 'Firebase live sync' : 'local demo mode'}
            {S.demo ? ' · demo data' : ''}
          </div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button className="btn btn-sm btn-ghost" style={{ color: '#fff' }} onClick={ACT.mute}>
            {snap.MUTED ? 'Unmute' : 'Mute'}
          </button>
          <button className="btn btn-sm btn-outline" onClick={ACT.saveNow}>
            Save
          </button>
          <button className="btn btn-sm btn-ghost" style={{ color: '#fff' }} onClick={ACT.logout}>
            Log out
          </button>
        </div>
      </div>
      <div className="tabs">
        {TABS.map((t) => (
          <button key={t[0]} className={'tab' + (tab === t[0] ? ' on' : '')} onClick={() => ACT.tab(t[0])}>
            {t[1]}
          </button>
        ))}
      </div>
      <div className="admin-body">{body}</div>
    </div>
  );
}
