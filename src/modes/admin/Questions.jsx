import React from 'react';
import { BoundText, BoundTextarea } from '../../components/fields.jsx';
import { ACT } from '../../lib/engine.js';

export default function Questions({ snap }) {
  const S = snap.S;
  const editQ = snap.EDIT_Q;
  return (
    <>
      <div className="panel">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <div>
            <h3>Questions ({S.questions.length})</h3>
            <p className="hint">
              The number of questions in the game is simply the length of this list. Reorder with ↑ ↓.
            </p>
          </div>
          <button className="btn btn-primary" onClick={ACT.qAdd}>
            + Add question
          </button>
        </div>
      </div>

      {S.questions.map((q, i) => {
        const open = editQ === i;
        return (
          <div className={'qitem' + (i === S.qIdx ? ' cur' : '')} key={q.id}>
            <div className="qnum">{i + 1}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <b style={{ flex: 1 }}>
                  {q.text || <i style={{ color: 'var(--ink-300)' }}>Untitled question</i>}
                </b>
                <span className="hint" style={{ margin: 0 }}>
                  {q.category ? q.category + ' · ' : ''}top {q.maxAnswers}
                  {q.timeLimit ? ' · ' + q.timeLimit + 's' : ''}
                  {i === S.qIdx ? ' · current' : ''}
                </span>
              </div>
              {open && (
                <>
                  <label>Question text</label>
                  <BoundText path={`questions.${i}.text`} value={q.text} />
                  <div className="row">
                    <div style={{ flex: 1 }}>
                      <label>Category (optional)</label>
                      <BoundText path={`questions.${i}.category`} value={q.category} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label>Image URL (optional)</label>
                      <BoundText path={`questions.${i}.image`} value={q.image} />
                    </div>
                    <div>
                      <label>Time limit (s, 0 = none)</label>
                      <BoundText type="number" num path={`questions.${i}.timeLimit`} value={q.timeLimit || 0} style={{ width: 120 }} />
                    </div>
                    <div>
                      <label>Max answers on board</label>
                      <BoundText type="number" num path={`questions.${i}.maxAnswers`} value={q.maxAnswers || 6} style={{ width: 120 }} />
                    </div>
                  </div>
                  <label>
                    Pre-approved answers (optional) — one per line, as <i>Answer | points</i>
                  </label>
                  <BoundTextarea rows={3} path={`questions.${i}.preRaw`} value={q.preRaw} />
                  <label>Judge notes (optional, private)</label>
                  <BoundText path={`questions.${i}.notes`} value={q.notes} />
                </>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <button className="icon-btn" onClick={() => ACT.qEdit(i)} title="Edit">
                {open ? '▲' : '✎'}
              </button>
              <button className="icon-btn" onClick={() => ACT.qUp(i)} title="Move up">
                ↑
              </button>
              <button className="icon-btn" onClick={() => ACT.qDown(i)} title="Move down">
                ↓
              </button>
              <button className="icon-btn" onClick={() => ACT.qDup(i)} title="Duplicate">
                ⧉
              </button>
              <button className="icon-btn" onClick={() => ACT.qDel(i)} title="Delete">
                ✕
              </button>
              {i !== S.qIdx && (
                <button className="btn btn-sm btn-outline" onClick={() => ACT.qMakeCurrent(i)}>
                  Play
                </button>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
}
