import React, { useState } from 'react';
import { Logo, BackButton } from '../components/common.jsx';
import { ACT, curQ, answeredKey } from '../lib/engine.js';

function SurveyMsg({ title, sub, dots, check }) {
  return (
    <div className="survey-card" style={{ textAlign: 'center' }}>
      {check && <div className="big-check">✓</div>}
      <div className="qbig" style={{ marginBottom: 6 }}>
        {title}
        {dots && (
          <>
            {' '}
            <span className="waiting-dot" />
            <span className="waiting-dot" />
            <span className="waiting-dot" />
          </>
        )}
      </div>
      <p style={{ color: 'var(--ink-500)', fontSize: 14.5, margin: 0 }}>{sub}</p>
    </div>
  );
}

export default function Survey({ snap }) {
  const S = snap.S;
  const q = curQ();
  const [answer, setAnswer] = useState('');
  const answered = localStorage.getItem(answeredKey()) === '1';

  const submit = () => {
    if (ACT.submitSurvey(answer)) setAnswer('');
  };

  let card;
  if (!S.questions.length || !q || (S.phase === 'idle' && !S.surveyOpen && !S.history.length && S.qIdx === 0 && !S.board.length)) {
    card = <SurveyMsg title="Survey not started" sub="The host has not opened a question yet. Keep this page open." dots />;
  } else if (S.surveyOpen && !answered) {
    card = (
      <>
        <div className="survey-card">
          <div className="stitle">QUESTION {S.qIdx + 1} — YOUR ANSWER IS ANONYMOUS</div>
          <div className="qbig">{q.text}</div>
          {q.image && (
            <img
              src={q.image}
              alt=""
              style={{ maxWidth: '100%', borderRadius: 10, marginBottom: 12 }}
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
          )}
          <input
            maxLength={60}
            placeholder="Type your answer…"
            autoComplete="off"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
          />
          <button className="btn btn-primary btn-big" style={{ width: '100%', marginTop: 12 }} onClick={submit}>
            Submit answer
          </button>
          <p style={{ fontSize: 12, color: 'var(--ink-400)', textAlign: 'center', margin: '10px 0 0' }}>
            One answer per device · other answers stay hidden
          </p>
        </div>
        <div className="survey-status">
          <span
            className="pill pill-green"
            style={{ background: 'rgba(74,157,92,.2)', color: '#A0D5AB', border: '1px solid rgba(74,157,92,.5)' }}
          >
            Survey open
          </span>
        </div>
      </>
    );
  } else if (S.surveyOpen && answered) {
    card = <SurveyMsg title="Answer submitted ✓" sub="Thanks! Watch the big screen — the survey is still open for your colleagues." check />;
  } else if (S.phase === 'review') {
    card = <SurveyMsg title="Survey closed" sub="The host is reviewing the answers. The board is coming up on the big screen." dots />;
  } else if (S.phase === 'board' || S.phase === 'roundEnd') {
    card = <SurveyMsg title="Round in play" sub="Watch the big screen and cheer for your team. Keep this page open for the next question." dots />;
  } else {
    card = <SurveyMsg title="Waiting for the next question" sub="The host will open the next survey soon." dots />;
  }

  return (
    <div className="survey">
      <BackButton />
      <Logo className="logo" fallbackText />
      {card}
    </div>
  );
}
