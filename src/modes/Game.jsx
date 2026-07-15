import React from 'react';
import { Logo, QR } from '../components/common.jsx';
import { ACT, tname, curQ, derivedWinner, gameProgress, surveyURL, surveySecondsLeft } from '../lib/engine.js';

function TeamPanel({ snap, i }) {
  const S = snap.S;
  const t = S.teams[i];
  const isTurn = S.turn === i && (S.phase === 'board' || S.phase === 'roundEnd');
  return (
    <div className={'team-panel' + (isTurn ? ' turn' : '')}>
      {isTurn && <div className="turn-flag">THEIR TURN</div>}
      <div className="team-name">
        {t.logo ? (
          <img className="team-logo" src={t.logo} alt="" onError={(e) => (e.currentTarget.style.display = 'none')} />
        ) : (
          <span className="team-dot" style={{ background: t.color, color: t.color }} />
        )}
        {tname(i)}
      </div>
      <div className="team-score" data-score={i}>
        {t.score}
      </div>
      <div className="round-pts">Round points: {S.roundPoints[i]}</div>
      <div className="players">
        {t.players.map((p, j) => (
          <div className={'player' + (isTurn && t.playerIdx === j ? ' now' : '')} key={j}>
            <span className="pnum">{j + 1}</span>
            {p || 'Player ' + (j + 1)}
          </div>
        ))}
      </div>
    </div>
  );
}

function BoardGrid({ snap }) {
  const S = snap.S;
  const n = S.board.length;
  const cols = n > 4 ? 2 : 1;
  return (
    <div className="board" style={{ gridTemplateColumns: `repeat(${cols},1fr)` }}>
      {S.board.map((a, i) => (
        <div className={'slot' + (a.revealed ? ' open' : '')} key={a.id}>
          <div className="slot-inner">
            <div className="slot-face slot-front">
              <span className="n">{i + 1}</span>
            </div>
            <div className="slot-face slot-back">
              <span className="atxt">{a.text}</span>
              {a.awarded && <span className="who">{tname(a.awardedTo)}</span>}
              <span className="apts">{a.points}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function QBanner({ snap }) {
  const S = snap.S;
  const q = curQ();
  return (
    <div className="qbanner">
      <div className="qtag">
        {q.category ? q.category.toUpperCase() + ' · ' : ''}
        QUESTION {S.qIdx + 1} OF {S.questions.length}
      </div>
      <div className="qtext">{q.text}</div>
      {q.image && (
        <img
          src={q.image}
          alt=""
          style={{ maxHeight: 120, borderRadius: 10, marginTop: 10 }}
          onError={(e) => (e.currentTarget.style.display = 'none')}
        />
      )}
    </div>
  );
}

function RoundEndOverlay({ snap }) {
  const S = snap.S;
  const rp = S.roundPoints;
  const winner = rp[0] === rp[1] ? null : rp[0] > rp[1] ? 0 : 1;
  const order = S.teams[0].score >= S.teams[1].score ? [0, 1] : [1, 0];
  const distinct = S.teams[order[0]].score !== S.teams[order[1]].score;
  return (
    <div className="overlay-screen">
      <div className="sub">ROUND {S.qIdx + 1} RESULTS</div>
      <h2>{winner === null ? 'Round tied!' : tname(winner) + ' takes the round!'}</h2>
      <p style={{ color: 'var(--blue-200)', margin: 0 }}>
        Round points: {tname(0)} {rp[0]} — {rp[1]} {tname(1)}
      </p>
      {order.map((tm, i) => (
        <div className={'rank-row' + (i === 0 ? ' win' : '')} key={tm}>
          <div className="rank-pos">{i + 1}</div>
          <div className="rank-name">
            <span className="team-dot" style={{ background: S.teams[tm].color, color: S.teams[tm].color }} />
            {tname(tm)}
            {i === 0 && distinct && <span className="crown">LEADING</span>}
          </div>
          <div className="rank-score">{S.teams[tm].score}</div>
        </div>
      ))}
      <p style={{ color: 'var(--blue-300)', fontSize: 14 }}>
        {gameProgress()} · {S.qIdx < S.questions.length - 1 ? 'next question coming up' : 'that was the last question'}
      </p>
    </div>
  );
}

function FinalOverlay({ snap }) {
  const S = snap.S;
  const order = S.teams[0].score >= S.teams[1].score ? [0, 1] : [1, 0];
  const tie = S.teams[0].score === S.teams[1].score;
  const champs = S.teams[order[0]].players.filter(Boolean).join(' · ');
  return (
    <div className="overlay-screen">
      <div className="sub">FINAL LEADERBOARD</div>
      <h2>{tie ? 'It is a tie!' : '🏆 ' + tname(order[0]) + ' wins!'}</h2>
      {order.map((tm, i) => (
        <div className={'rank-row' + (i === 0 && !tie ? ' win' : '')} key={tm}>
          <div className="rank-pos">{i + 1}</div>
          <div className="rank-name">
            <span className="team-dot" style={{ background: S.teams[tm].color, color: S.teams[tm].color }} />
            {tname(tm)}
            {i === 0 && !tie && <span className="crown">CHAMPIONS</span>}
          </div>
          <div className="rank-score">{S.teams[tm].score}</div>
        </div>
      ))}
      {!tie && champs && (
        <div className="winners-list">
          <b>Winning team:</b> {champs}
        </div>
      )}
    </div>
  );
}

export default function Game({ snap }) {
  const S = snap.S;
  const q = curQ();
  const n = Object.keys(snap.RESP).length;
  const secs = surveySecondsLeft();

  let center;
  if (!q || S.phase === 'idle') {
    center = (
      <div className="idle-hero">
        <Logo />
        <p>{q ? 'Get ready — question ' + (S.qIdx + 1) + ' is coming up' : 'Waiting for the host to set up the game'}</p>
      </div>
    );
  } else if (S.phase === 'survey') {
    center = (
      <>
        <QBanner snap={snap} />
        <div className="qr-stage">
          <div className="qr-white">
            <QR text={surveyURL()} size={230} />
          </div>
          <div className="qr-side">
            <h3>Scan the QR code and submit your answer</h3>
            <div className="joincode">{S.joinCode}</div>
            <div className="cnt-line">
              <b>{n}</b> answer{n === 1 ? '' : 's'} received
              {secs != null && (
                <>
                  {' · '}
                  <span className="timer-chip">{secs}</span>s left
                </>
              )}
            </div>
            <div style={{ color: 'var(--blue-300)', fontSize: 13.5, marginTop: 6 }}>
              Answers stay secret until the host builds the board.
            </div>
          </div>
        </div>
      </>
    );
  } else if (S.phase === 'review') {
    center = (
      <>
        <QBanner snap={snap} />
        <div className="idle-hero" style={{ flex: 1 }}>
          <h3 style={{ fontSize: 'clamp(20px,2.6vw,32px)' }}>
            The host is building the answer board
            <span className="waiting-dot" />
            <span className="waiting-dot" />
            <span className="waiting-dot" />
          </h3>
          <p>{n} answers were submitted</p>
        </div>
      </>
    );
  } else {
    center = (
      <>
        <QBanner snap={snap} />
        <BoardGrid snap={snap} />
      </>
    );
  }

  const w = derivedWinner();
  const buzzChip = !S.buzz.open ? (
    <div className="status-chip">
      <span className="status-dot off" />
      Buzzers closed
    </div>
  ) : w === null ? (
    <div className="status-chip hot">
      <span className="status-dot hot" />
      BUZZERS OPEN — hit it!
    </div>
  ) : (
    <div className="status-chip">
      <span className="status-dot" />
      {tname(w)} buzzed first
    </div>
  );

  const mainBuzz =
    S.buzz.open && S.phase === 'board' ? (
      <>
        <div className="mainbuzz-row">
          {[0, 1].map((tm) => (
            <button
              className="mainbuzz"
              key={tm}
              style={{ background: S.teams[tm].color }}
              disabled={w !== null}
              onClick={() => ACT.mainBuzz(tm)}
            >
              {tname(tm)}
            </button>
          ))}
        </div>
        <div className="kbd-hint" style={{ textAlign: 'center', width: '100%' }}>
          Keyboard: 1 = {tname(0)} · 2 = {tname(1)} · B = reset
        </div>
      </>
    ) : null;

  let overlay = null;
  if (Date.now() < snap.BANNER_UNTIL && w !== null) {
    overlay = (
      <div className="buzz-banner">
        <div className="inner">
          <div className="lbl">FIRST BUZZ</div>
          <div className="who" style={{ color: S.teams[w].color }}>
            {tname(w)}
          </div>
        </div>
      </div>
    );
  }
  if (S.phase === 'roundEnd') overlay = <RoundEndOverlay snap={snap} />;
  if (S.phase === 'final') overlay = <FinalOverlay snap={snap} />;

  return (
    <div className="stage">
      <div className="stage-top">
        <Logo />
        <div>
          <div className="stage-title">{S.title}</div>
          <div className="stage-progress">
            Question {Math.min(S.qIdx + 1, S.questions.length)} of {S.questions.length} · {gameProgress()}
          </div>
        </div>
        <div className="stage-tools">
          <button className="tool-btn" onClick={ACT.mute}>
            {snap.MUTED ? '🔇 Sound off' : '🔊 Sound on'}
          </button>
          <button className="tool-btn" onClick={ACT.fullscreen}>
            ⛶ Full screen
          </button>
        </div>
      </div>
      <div className="stage-main">
        <TeamPanel snap={snap} i={0} />
        <div className="stage-center">{center}</div>
        <TeamPanel snap={snap} i={1} />
      </div>
      <div className="stage-status">
        {buzzChip}
        <div className="status-chip">
          Round points: {tname(0)} {S.roundPoints[0]} — {S.roundPoints[1]} {tname(1)}
        </div>
        {S.phase === 'survey' && (
          <div className="status-chip">
            <span className="status-dot" />
            Survey open — {n} responses
          </div>
        )}
      </div>
      {mainBuzz}
      {overlay}
      {S.paused && (
        <div className="buzz-banner">
          <div className="inner">
            <div className="lbl">PAUSED</div>
            <div className="who">☕ Short break</div>
          </div>
        </div>
      )}
    </div>
  );
}
