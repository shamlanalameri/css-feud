import React from 'react';
import { Logo } from '../components/common.jsx';

const CARDS = [
  ['?mode=admin', 'ADMIN', 'Admin portal', 'Setup, host and judge controls'],
  ['?mode=game', 'GAME', 'Main game screen', 'Show this on the big display'],
  ['?mode=survey', 'SURVEY', 'Employee survey', 'Where the QR code leads'],
  ['?mode=buzzer&team=1', 'BUZZER', 'Team 1 buzzer', 'Open on a phone'],
  ['?mode=buzzer&team=2', 'BUZZER', 'Team 2 buzzer', 'Open on a phone'],
  ['?mode=guide', 'GUIDE', 'How to play', 'Rules and flow for players and hosts'],
];

export default function Launcher({ snap }) {
  return (
    <div className="launch">
      <Logo />
      <p>Live employee game show — pick a screen</p>
      <div className="launch-grid">
        {CARDS.map((c) => (
          <a className="launch-card" key={c[0]} href={c[0]}>
            <span className="launch-mode-tag">{c[1]}</span>
            <b>{c[2]}</b>
            <span>{c[3]}</span>
          </a>
        ))}
      </div>
      <p style={{ marginTop: 22 }}>
        {snap.HAS_FB ? (
          <span className="pill pill-green">Firebase connected — live multi-device sync</span>
        ) : (
          <span className="pill pill-gold">Local demo mode — works across tabs of this browser</span>
        )}
      </p>
    </div>
  );
}
