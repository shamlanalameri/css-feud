import React, { useState } from 'react';
import { Logo, BackButton } from '../components/common.jsx';
import { ACT, answeredAllKey } from '../lib/engine.js';

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

function AllQuestionsForm({ S }) {
  const questions = S.questions.filter((q) => q.text.trim());
  const [answers, setAnswers] = useState({});
  const [done, setDone] = useState(false);

  const setAns = (qid, v) => setAnswers((a) => ({ ...a, [qid]: v }));
  const submit = () => {
    // map by question index (engine stores responses per question index)
    const byIdx = {};
    S.questions.forEach((q, i) => {
      if (answers[q.id] != null) byIdx[i] = answers[q.id];
    });
    if (ACT.submitSurveyAll(byIdx)) setDone(true);
  };

  if (done) {
    return (
      <SurveyMsg
        title="Answers submitted ✓"
        sub="Thanks! Watch the big screen — the game is about to start."
        check
      />
    );
  }

  return (
    <>
      <div className="survey-card">
        <div className="stitle">ANSWER ALL {questions.length} QUESTIONS — ANONYMOUS</div>
        {questions.map((q, n) => (
          <div key={q.id} style={{ marginBottom: 18 }}>
            <div className="qbig" style={{ fontSize: 18, marginBottom: 8 }}>
              {n + 1}. {q.text}
            </div>
            {q.image && (
              <img
                src={q.image}
                alt=""
                style={{ maxWidth: '100%', borderRadius: 10, marginBottom: 8 }}
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            )}
            <input
              maxLength={60}
              placeholder="Type your answer…"
              autoComplete="off"
              value={answers[q.id] || ''}
              onChange={(e) => setAns(q.id, e.target.value)}
            />
          </div>
        ))}
        <button className="btn btn-primary btn-big" style={{ width: '100%', marginTop: 4 }} onClick={submit}>
          Submit my answers
        </button>
        <p style={{ fontSize: 12, color: 'var(--ink-400)', textAlign: 'center', margin: '10px 0 0' }}>
          One submission per device · your answers stay anonymous
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
}

export default function Survey({ snap }) {
  const S = snap.S;
  const answered = localStorage.getItem(answeredAllKey()) === '1';

  let card;
  if (S.survey.open && !answered) {
    card = <AllQuestionsForm S={S} />;
  } else if (S.survey.open && answered) {
    card = (
      <SurveyMsg
        title="Answer submitted ✓"
        sub="Thanks! Watch the big screen — the game is about to start."
        check
      />
    );
  } else if (S.stage === 'play') {
    card = (
      <SurveyMsg
        title="The game has started"
        sub="Watch the big screen and cheer for your team. Thanks for answering!"
        dots
      />
    );
  } else {
    card = (
      <SurveyMsg
        title="Survey not started"
        sub="The host has not opened the survey yet. Keep this page open."
        dots
      />
    );
  }

  return (
    <div className="survey">
      <BackButton />
      <Logo className="logo" fallbackText />
      {card}
    </div>
  );
}
