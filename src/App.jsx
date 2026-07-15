import React, { useEffect } from 'react';
import { useStore } from './lib/useStore.js';
import { MODE, ACT, handleKey, pollTimers } from './lib/engine.js';
import Launcher from './modes/Launcher.jsx';
import Login from './modes/Login.jsx';
import Admin from './modes/Admin.jsx';
import Game from './modes/Game.jsx';
import Survey from './modes/Survey.jsx';
import Buzzer from './modes/Buzzer.jsx';
import Guide from './modes/Guide.jsx';

export default function App() {
  const snap = useStore();

  // Global keyboard shortcuts + survey timer polling + confetti canvas resize.
  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    const timer = setInterval(pollTimers, 500);
    const onResize = () => {
      const cv = document.getElementById('confetti');
      if (cv) {
        cv.width = innerWidth;
        cv.height = innerHeight;
      }
    };
    addEventListener('resize', onResize);
    return () => {
      document.removeEventListener('keydown', handleKey);
      clearInterval(timer);
      removeEventListener('resize', onResize);
    };
  }, []);

  const S = snap.S;

  if (!S && MODE !== 'home') {
    return (
      <div className="launch">
        <p>Loading…</p>
      </div>
    );
  }

  if (MODE === 'admin') return snap.ADMIN_OK ? <Admin snap={snap} /> : <Login />;
  if (MODE === 'game') return <Game snap={snap} />;
  if (MODE === 'survey') return <Survey snap={snap} />;
  if (MODE === 'buzzer') return <Buzzer snap={snap} />;
  if (MODE === 'guide') return <Guide />;
  return <Launcher snap={snap} />;
}
