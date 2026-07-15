import React from 'react';
import { Logo, BackButton } from '../components/common.jsx';

function Step({ n, title, children }) {
  return (
    <div className="guide-card">
      <div className="guide-step">{n}</div>
      <div>
        <h3>{title}</h3>
        {children}
      </div>
    </div>
  );
}

export default function Guide() {
  return (
    <div className="guide">
      <BackButton />
      <Logo className="glogo" />
      <p className="guide-intro">
        Two teams of five, questions answered live by everyone in the room, and a race to the buzzer. Here is how a game
        runs.
      </p>

      <h2 className="guide-h">How a round works</h2>
      <Step n={1} title="The question appears">
        The host starts a question and the big screen shows it together with a QR code.
      </Step>
      <Step n={2} title="Everyone answers the survey">
        Scan the QR code with your phone and submit one anonymous answer. Nobody sees the answers while the survey is
        open — only a counter of how many people have responded.
      </Step>
      <Step n={3} title="The board is built">
        The host closes the survey. Matching answers are grouped and counted, and the most popular ones become the
        hidden answer board. Each answer is worth the number of colleagues who gave it.
      </Step>
      <Step n={4} title="Buzz to play">
        The buzzers open. Each team has a buzzer page on a phone — the first press wins the turn and locks both buzzers.
      </Step>
      <Step n={5} title="Guess the board">
        One player from the team with the turn gives an answer out loud. If it is on the board, it is revealed and the
        points go to that team, and the same team continues with its next player. If it is wrong, the turn switches to
        the other team immediately — there is no three-strike rule.
      </Step>
      <Step n={6} title="The round ends">
        The round finishes when the whole board is revealed or the host ends it. Scores carry over, and the next question
        begins.
      </Step>

      <h2 className="guide-h">Good to know</h2>
      <Step n="•" title="Answers are anonymous">
        One answer per device per question. Your submission is never shown with your name.
      </Step>
      <Step n="•" title="The judge decides">
        A spoken answer can be accepted even if the wording differs — for example “Man United” for “Manchester United”.
        The judge can also award bonus points for a clever answer that is not on the board.
      </Step>
      <Step n="•" title="Players take turns">
        Each team has five players and the answering player rotates automatically, so everyone gets a go.
      </Step>
      <Step n="•" title="Winning">
        Revealed answers add their points to the team’s total. After the last question, the team with the highest total
        wins the final leaderboard.
      </Step>

      <h2 className="guide-h">The screens</h2>
      <Step n="▣" title="Main screen">
        Shown on the big display: the question, QR code, answer board, scores, and whose turn it is.
      </Step>
      <Step n="▣" title="Survey page">
        Opens on your phone from the QR code — this is where you submit your answer.
      </Step>
      <Step n="▣" title="Buzzer pages">
        One per team, each with a single large button in the team’s colour. Be first.
      </Step>
    </div>
  );
}
