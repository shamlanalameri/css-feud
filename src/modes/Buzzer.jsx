import React from 'react';
import { Logo, BackButton } from '../components/common.jsx';
import { ACT, tname, derivedWinner } from '../lib/engine.js';
import { param } from '../lib/utils.js';

export default function Buzzer({ snap }) {
  const S = snap.S;
  const team = Math.max(0, Math.min(1, (+param('team') || 1) - 1));
  const t = S.teams[team];
  const w = derivedWinner();
  const open = S.buzz.open && !S.paused;

  let cls = 'thebuzzer',
    label = 'BUZZ!',
    state = '';
  if (!open) {
    cls += ' locked';
    label = 'WAIT';
    state = 'Buzzers are closed — wait for the host';
  } else if (w === null) {
    state = 'Buzzers are OPEN — be first!';
  } else if (w === team) {
    cls += ' won';
    label = "YOU'RE FIRST!";
    state = 'You buzzed first — answer now!';
  } else {
    cls += ' locked';
    label = 'TOO LATE';
    state = tname(w) + ' buzzed first';
  }

  return (
    <div className="buzzpage">
      <BackButton />
      <div className="head">
        <Logo />
        <div className="tname" style={{ color: t.color }}>
          {tname(team)}
        </div>
      </div>
      <button
        className={cls}
        style={{ background: `radial-gradient(circle at 50% 30%, ${t.color}, rgba(0,0,0,.55) 160%)` }}
        onClick={() => ACT.buzzPress(team)}
      >
        {label}
      </button>
      <div className="buzz-state">{state}</div>
    </div>
  );
}
