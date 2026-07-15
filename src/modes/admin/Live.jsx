import React, { useState } from 'react';
import { QR } from '../../components/common.jsx';
import { BoundText, BoundCheckbox, BoundSelect } from '../../components/fields.jsx';
import {
  ACT,
  tname,
  curQ,
  validPresses,
  derivedWinner,
  surveyURL,
  buzzerURL,
  surveySecondsLeft,
  totalRespondents,
  respCount,
} from '../../lib/engine.js';
import { parsePre, mergeSuggestions } from '../../lib/state.js';

function PhasePill({ S }) {
  let m;
  if (S.survey.open) m = ['pill-blue', 'Survey open'];
  else if (S.stage === 'setup') m = ['pill-grey', 'Setup'];
  else {
    const map = {
      idle: ['pill-grey', 'Ready to build board'],
      review: ['pill-gold', 'Reviewing answers (private)'],
      board: ['pill-green', 'Round in play'],
      roundEnd: ['pill-gold', 'Round results'],
      final: ['pill-gold', 'Final leaderboard'],
    };
    m = map[S.phase] || map.idle;
  }
  return (
    <>
      <span className={'pill ' + m[0]}>{m[1]}</span>
      {S.paused && <span className="pill pill-red"> Paused</span>}
    </>
  );
}

function Scores({ S }) {
  const [team, setTeam] = useState('0');
  const [pts, setPts] = useState('');
  const [why, setWhy] = useState('');
  const apply = () => {
    ACT.bonus(team, pts, why);
    setPts('');
    setWhy('');
  };
  return (
    <div className="panel">
      <h3>Scores</h3>
      <div className="grid2">
        {[0, 1].map((i) => {
          const t = S.teams[i];
          return (
            <div key={i} className="row" style={{ border: '1.5px solid var(--ink-100)', borderRadius: 10, padding: '10px 14px' }}>
              <span className="team-dot" style={{ background: t.color, width: 13, height: 13, borderRadius: '50%' }} />
              <b style={{ flex: 1 }}>{tname(i)}</b>
              {S.turn === i ? (
                <span className="pill pill-gold">Turn</span>
              ) : (
                <button className="btn btn-sm btn-ghost" onClick={() => ACT.setTurn(i)}>
                  Give turn
                </button>
              )}
              <span style={{ fontSize: 12, color: 'var(--ink-400)' }}>round {S.roundPoints[i]}</span>
              <BoundText
                type="number"
                num
                path={`teams.${i}.score`}
                value={t.score}
                style={{ width: 86, textAlign: 'center', fontWeight: 800, fontSize: 17 }}
              />
            </div>
          );
        })}
      </div>
      <div className="row" style={{ marginTop: 10 }}>
        <label style={{ margin: 0 }}>Bonus / deduct:</label>
        <select value={team} onChange={(e) => setTeam(e.target.value)} style={{ width: 'auto' }}>
          <option value="0">{tname(0)}</option>
          <option value="1">{tname(1)}</option>
        </select>
        <input type="number" placeholder="Points (± )" value={pts} onChange={(e) => setPts(e.target.value)} style={{ width: 110 }} />
        <input
          type="text"
          placeholder="Reason (for the log)"
          value={why}
          onChange={(e) => setWhy(e.target.value)}
          style={{ width: 210, flex: 1, minWidth: 140 }}
        />
        <button className="btn btn-sm btn-blue" onClick={apply}>
          Apply
        </button>
        <button className="btn btn-sm btn-outline" onClick={ACT.transferTurn}>
          Switch team turn
        </button>
      </div>
    </div>
  );
}

function Review({ S }) {
  const [sel, setSel] = useState(() => new Set());
  const [newText, setNewText] = useState('');
  const [newPts, setNewPts] = useState('');
  const sugg = mergeSuggestions(S.review);
  const groups = S.review || [];
  const included = groups.filter((g) => g.include).length;

  const toggle = (id) => {
    const n = new Set(sel);
    n.has(id) ? n.delete(id) : n.add(id);
    setSel(n);
  };
  const merge = () => {
    ACT.grpMerge([...sel]);
    setSel(new Set());
  };
  const add = () => {
    ACT.grpAdd(newText, newPts);
    setNewText('');
    setNewPts('');
  };

  return (
    <div className="panel">
      <h3>Answer review — private</h3>
      <div className="notice">
        Employees and the main screen cannot see this. Merge, rename, re-point and reorder, then approve. Points default
        to the number of employees who gave that answer.
      </div>
      <div className="row" style={{ marginBottom: 10 }}>
        <button className="btn btn-sm btn-blue" onClick={merge}>
          Merge ticked groups
        </button>
        <button className="btn btn-sm btn-outline" onClick={ACT.grpHideLow}>
          Hide answers with ≤ 1 vote
        </button>
        <span className="hint" style={{ margin: 0 }}>
          {included} included · board shows top {curQ() ? curQ().maxAnswers : 8}
        </span>
      </div>
      {sugg.length > 0 && (
        <div className="hint" style={{ marginBottom: 8 }}>
          Possible duplicates:{' '}
          {sugg.map((p, k) => (
            <button
              key={k}
              className="btn btn-sm btn-outline"
              style={{ margin: 2 }}
              onClick={() => ACT.grpMergePair(p[0].id, p[1].id)}
            >
              merge “{p[0].name}” + “{p[1].name}”
            </button>
          ))}
        </div>
      )}
      {groups.map((g, i) => (
        <div className={'group-row' + (g.include ? '' : ' off')} key={g.id}>
          <input type="checkbox" checked={sel.has(g.id)} onChange={() => toggle(g.id)} style={{ width: 'auto' }} />
          <span className="cnt">{g.count}×</span>
          <BoundText type="text" path={`review.${i}.name`} value={g.name} />
          <BoundText className="pts" type="number" num path={`review.${i}.points`} value={+g.points || 0} title="Points" />
          <label style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
            <BoundCheckbox path={`review.${i}.include`} value={g.include} style={{ width: 'auto' }} />
            show
          </label>
          <button className="icon-btn" onClick={() => ACT.grpUp(g.id)} title="Move up">
            ↑
          </button>
          <button className="icon-btn" onClick={() => ACT.grpDown(g.id)} title="Move down">
            ↓
          </button>
          <button className="icon-btn" onClick={() => ACT.grpSplit(g.id)} title="Separate grouped answers">
            ⑃
          </button>
          <button className="icon-btn" onClick={() => ACT.grpDel(g.id)} title="Delete">
            ✕
          </button>
          {g.members.length ? (
            <div className="members">
              Submitted as: {g.members.slice(0, 10).join(' · ')}
              {g.members.length > 10 ? ' · …' : ''}
            </div>
          ) : g.pre ? (
            <div className="members">Pre-approved answer</div>
          ) : null}
        </div>
      ))}
      <div className="row" style={{ marginTop: 10 }}>
        <input
          type="text"
          placeholder="Add a missing answer"
          style={{ flex: 1, minWidth: 160 }}
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
        />
        <input type="number" placeholder="Points" style={{ width: 90 }} value={newPts} onChange={(e) => setNewPts(e.target.value)} />
        <button className="btn btn-sm btn-outline" onClick={add}>
          Add answer
        </button>
      </div>
      <div className="row" style={{ marginTop: 14 }}>
        <button className="btn btn-green btn-big" onClick={ACT.approveBoard}>
          Approve and create board
        </button>
        <button className="btn btn-outline" onClick={ACT.resetResponses}>
          Delete all responses
        </button>
      </div>
    </div>
  );
}

function Judge({ S }) {
  const [newText, setNewText] = useState('');
  const [newPts, setNewPts] = useState('');
  const add = () => {
    ACT.addAns(newText, newPts);
    setNewText('');
    setNewPts('');
  };
  const turnPlayer =
    S.turn !== null ? S.teams[S.turn].players[S.teams[S.turn].playerIdx] || 'Player ' + (S.teams[S.turn].playerIdx + 1) : '';
  return (
    <div className="panel">
      <h3>Judge console</h3>
      <p className="hint">
        Turn: <b>{S.turn === null ? 'not set — open buzzers or give the turn' : tname(S.turn)}</b>
        {S.turn !== null && (
          <>
            {' '}
            · answering player: <b>{turnPlayer}</b>
          </>
        )}
      </p>
      <div className="row" style={{ marginBottom: 12 }}>
        <button className="btn btn-red btn-big" onClick={ACT.wrong}>
          ✕ Wrong — switch team
        </button>
        <button className="btn btn-outline" onClick={ACT.revealAll}>
          Reveal all remaining
        </button>
        <button className="btn btn-blue" onClick={ACT.endRound}>
          End round
        </button>
        {S.qIdx < S.questions.length - 1 ? (
          <button className="btn btn-outline" onClick={() => ACT.nextQuestion()}>
            Next question
          </button>
        ) : (
          <button className="btn btn-outline" onClick={ACT.showFinal}>
            Final leaderboard
          </button>
        )}
      </div>
      {S.board.map((a, i) => (
        <div className={'judge-answer' + (a.revealed ? ' rev' : '')} key={a.id}>
          <b style={{ color: 'var(--gold-600)', fontFamily: 'Inter' }}>{i + 1}</b>
          <span className="atext">
            {a.text}
            {a.awarded && (
              <span className="pill pill-green" style={{ fontSize: 10.5 }}>
                {' '}
                awarded → {tname(a.awardedTo)}
              </span>
            )}
          </span>
          <BoundText className="pts" type="number" num path={`board.${i}.points`} value={a.points} style={{ width: 70, textAlign: 'center' }} title="Points" />
          <BoundText type="text" path={`board.${i}.text`} value={a.text} style={{ width: 150 }} title="Edit answer text" />
          <button className="btn btn-sm btn-green" onClick={() => ACT.revealAward(a.id)}>
            ✓ Correct
          </button>
          <button
            className="btn btn-sm btn-outline"
            onClick={() => (a.revealed ? ACT.hideAns(a.id) : ACT.revealOnly(a.id))}
          >
            {a.revealed ? 'Hide' : 'Reveal only'}
          </button>
          <button className="icon-btn" onClick={() => ACT.removeAns(a.id)} title="Remove">
            ✕
          </button>
        </div>
      ))}
      <div className="row" style={{ marginTop: 10 }}>
        <input
          type="text"
          placeholder="Add an answer during the round"
          style={{ flex: 1, minWidth: 160 }}
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
        />
        <input type="number" placeholder="Points" style={{ width: 90 }} value={newPts} onChange={(e) => setNewPts(e.target.value)} />
        <button className="btn btn-sm btn-outline" onClick={add}>
          Add to board
        </button>
      </div>
      <p className="hint" style={{ marginTop: 10 }}>
        A spoken answer can be correct even if it is not on the board (for example “Man United” for “Manchester
        United”) — reveal the matching answer with <b>✓ Correct</b>, or use <b>Bonus / deduct</b> above to award custom
        points.
      </p>
      <div className="row" style={{ marginTop: 6 }}>
        <label style={{ margin: 0 }}>Current player:</label>
        {[0, 1].map((t) => (
          <BoundSelect key={t} path={`teams.${t}.playerIdx`} value={S.teams[t].playerIdx} num style={{ width: 'auto' }}>
            {S.teams[t].players.map((p, i) => (
              <option key={i} value={i}>
                {tname(t)}: {p || 'Player ' + (i + 1)}
              </option>
            ))}
          </BoundSelect>
        ))}
      </div>
    </div>
  );
}

function BuzzPanel({ S }) {
  const ps = validPresses();
  const w = derivedWinner();
  const status = !S.buzz.open ? (
    <span className="pill pill-grey">Buzzers closed</span>
  ) : w === null ? (
    <span className="pill pill-green">Buzzers armed — waiting for a press</span>
  ) : (
    <span className="pill pill-gold">Locked — {tname(w)} buzzed first</span>
  );
  return (
    <div className="panel">
      <h3>Buzzers</h3>
      <div className="row" style={{ margin: '8px 0' }}>
        {status}
        <button className="btn btn-sm btn-green" onClick={ACT.openBuzzers}>
          Open buzzers
        </button>
        <button className="btn btn-sm btn-outline" onClick={ACT.resetBuzzers}>
          Reset (B)
        </button>
        <button className="btn btn-sm btn-outline" onClick={ACT.closeBuzzers}>
          Close
        </button>
      </div>
      {ps.length > 0 && (
        <div className="hint">
          Press order: {ps.map((p, i) => tname(p.team) + (i === 0 ? ' (first)' : ' +' + (p.t - ps[0].t) + ' ms')).join(' · ')}
        </div>
      )}
      <div className="row" style={{ marginTop: 10, alignItems: 'flex-start', gap: 22 }}>
        {[1, 2].map((t) => (
          <div key={t} style={{ textAlign: 'center' }}>
            <div className="qrbox-admin">
              <QR text={buzzerURL(t)} size={92} />
            </div>
            <div style={{ fontSize: 12, marginTop: 5 }}>
              <b>{tname(t - 1)}</b> buzzer
            </div>
            <button className="btn btn-sm btn-ghost" onClick={() => ACT.copy(buzzerURL(t))}>
              Copy link
            </button>
          </div>
        ))}
        <p className="hint" style={{ flex: 1, minWidth: 180 }}>
          Each team opens its own buzzer page on a phone. The main screen also has on-screen buzzers, and keys <b>1</b> /{' '}
          <b>2</b> buzz, <b>B</b> resets.
        </p>
      </div>
    </div>
  );
}

function FinalTable({ S }) {
  const order = S.teams[0].score >= S.teams[1].score ? [0, 1] : [1, 0];
  const distinct = S.teams[order[0]].score !== S.teams[order[1]].score;
  return (
    <div className="print-area" style={{ marginTop: 14 }}>
      <table className="scores-t">
        <tbody>
          <tr>
            <th>Place</th>
            <th>Team</th>
            <th>Players</th>
            <th>Score</th>
          </tr>
          {order.map((t, i) => (
            <tr key={t}>
              <td>
                {i + 1}
                {i === 0 && distinct ? ' 🏆' : ''}
              </td>
              <td>
                <b>{tname(t)}</b>
              </td>
              <td>{S.teams[t].players.filter(Boolean).join(', ')}</td>
              <td>
                <b>{S.teams[t].score}</b>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SurveyProgress({ S, RESPALL }) {
  const rows = [];
  S.questions.forEach((q, idx) => {
    if (!q.text.trim()) return;
    rows.push(
      <div
        key={q.id}
        className="row"
        style={{ justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid var(--ink-100)' }}
      >
        <span style={{ fontSize: 13, flex: 1 }}>
          {rows.length + 1}. {q.text}
        </span>
        <span className="cnt">{Object.keys(RESPALL[idx] || {}).length}</span>
      </div>
    );
  });
  return <div style={{ marginTop: 12 }}>{rows}</div>;
}

export default function Live({ snap }) {
  const S = snap.S;
  const q = curQ();
  const people = totalRespondents();
  const secs = surveySecondsLeft();
  const nQ = S.questions.filter((x) => x.text.trim()).length;
  const playing = S.stage === 'play';

  return (
    <>
      <div className="panel">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: 17 }}>
              {playing ? `Round ${S.qIdx + 1} of ${S.questions.length}` : `${nQ} question${nQ === 1 ? '' : 's'} ready`}
            </h3>
            <div style={{ fontSize: 15, marginTop: 4 }}>
              {playing ? (
                q ? q.text || <i>(no text)</i> : <i>No questions.</i>
              ) : S.survey.open ? (
                <i>Survey is open — employees are answering on their phones.</i>
              ) : (
                <i>Set up teams and questions, then open the survey below.</i>
              )}
            </div>
            {playing && q && q.notes && (
              <div className="hint" style={{ marginTop: 6 }}>
                Judge notes: {q.notes}
              </div>
            )}
          </div>
          <div style={{ textAlign: 'right' }}>
            <PhasePill S={S} />
            <div className="row" style={{ marginTop: 10, justifyContent: 'flex-end' }}>
              <button className="btn btn-sm btn-outline" onClick={ACT.undo}>
                ↶ Undo
              </button>
              <button className="btn btn-sm btn-outline" onClick={ACT.redo}>
                ↷ Redo
              </button>
              {playing && (
                <>
                  <button className="btn btn-sm btn-outline" onClick={ACT.pause}>
                    {S.paused ? 'Resume' : 'Pause'}
                  </button>
                  <button className="btn btn-sm btn-outline" onClick={ACT.skipQuestion}>
                    Skip question
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <Scores S={S} />

      {/* SETUP — open the one survey covering all questions */}
      {S.stage === 'setup' && !S.survey.open && (
        <div className="panel">
          <h3>Step 1 — collect answers</h3>
          <p className="hint">
            Open the survey so employees can answer <b>all {nQ} questions</b> from their phones. One QR code appears on
            the main screen — everyone scans it, answers, and submits once. Their answers stay hidden.
          </p>
          <div className="row">
            <button className="btn btn-primary btn-big" onClick={ACT.openSurvey}>
              Open survey (all questions)
            </button>
            <button className="btn btn-outline" onClick={ACT.simResponses}>
              Simulate answers (for testing)
            </button>
          </div>
        </div>
      )}

      {/* SURVEY OPEN — waiting for responses across all questions */}
      {S.survey.open && (
        <div className="panel">
          <h3>Survey is open</h3>
          <div className="row" style={{ gap: 26, alignItems: 'flex-start' }}>
            <div style={{ textAlign: 'center' }}>
              <div className="bigcount">{people}</div>
              <div className="hint">people answered</div>
            </div>
            <div style={{ flex: 1, minWidth: 220 }}>
              <p className="hint">
                Employees scan the QR on the main screen and answer all {nQ} questions. Answers stay hidden until you
                close the survey.{' '}
                {secs != null && (
                  <>
                    Auto-closes in <span className="timer-chip">{secs}</span>s.
                  </>
                )}
              </p>
              <div className="row">
                <button className="btn btn-red btn-big" onClick={ACT.closeSurvey}>
                  Close survey and start the game
                </button>
                <button className="btn btn-outline" onClick={ACT.simResponses}>
                  Simulate answers
                </button>
                <button className="btn btn-outline btn-sm" onClick={() => ACT.copy(surveyURL())}>
                  Copy survey link
                </button>
              </div>
              <SurveyProgress S={S} RESPALL={snap.RESPALL} />
            </div>
            <div className="qrbox-admin">
              <QR text={surveyURL()} size={120} />
            </div>
          </div>
        </div>
      )}

      {/* PLAY — build the board for the current question */}
      {playing && S.phase === 'idle' && (
        <div className="panel">
          <h3>Round {S.qIdx + 1} — build the answer board</h3>
          <p className="hint">
            {respCount(S.qIdx)} answer{respCount(S.qIdx) === 1 ? '' : 's'} were submitted for this question. Group them
            into the board, then reveal and play.
          </p>
          <div className="row">
            <button className="btn btn-primary btn-big" onClick={ACT.buildBoard}>
              Build the answer board
            </button>
            {q && parsePre(q).length > 0 && (
              <button className="btn btn-outline" onClick={ACT.boardFromPre}>
                Use pre-approved answers
              </button>
            )}
            {S.qIdx < S.questions.length - 1 && (
              <button className="btn btn-outline" onClick={() => ACT.nextQuestion()}>
                Skip to next question →
              </button>
            )}
          </div>
        </div>
      )}

      {S.phase === 'review' && <Review S={S} />}
      {S.phase === 'board' && <Judge S={S} />}

      {S.phase === 'roundEnd' && (
        <div className="panel">
          <h3>Round complete</h3>
          <p className="hint">The main screen is showing the round results.</p>
          <div className="row">
            {S.qIdx < S.questions.length - 1 && (
              <button className="btn btn-primary btn-big" onClick={() => ACT.nextQuestion()}>
                Next question →
              </button>
            )}
            <button className="btn btn-blue" onClick={ACT.showFinal}>
              Show final leaderboard
            </button>
            <button className="btn btn-outline" onClick={ACT.returnToGame}>
              Back to the board
            </button>
          </div>
        </div>
      )}

      {S.phase === 'final' && (
        <div className="panel">
          <h3>Final leaderboard is showing</h3>
          <div className="row">
            <button className="btn btn-primary" onClick={ACT.downloadCsv}>
              Download results (CSV)
            </button>
            <button className="btn btn-outline" onClick={ACT.printResults}>
              Print results
            </button>
            <button className="btn btn-outline" onClick={ACT.returnToGame}>
              Return to game
            </button>
            <button className="btn btn-blue" onClick={ACT.newGame}>
              Start a new game
            </button>
          </div>
          <FinalTable S={S} />
        </div>
      )}

      {playing && <BuzzPanel S={S} />}
    </>
  );
}
