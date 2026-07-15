import React from 'react';

export default function Help() {
  return (
    <div className="panel helpdoc">
      <h3>Setup, hosting and test checklist</h3>

      <h4>Firebase (for real multi-device play)</h4>
      <ol>
        <li>
          Go to <b>console.firebase.google.com</b> and add a project.
        </li>
        <li>
          Build → <b>Realtime Database</b> → create database (test mode is fine for an internal event).
        </li>
        <li>
          Build → <b>Authentication</b> → sign-in method → enable <b>Anonymous</b>.
        </li>
        <li>Project settings → your apps → add a <b>web app</b> → copy the config object.</li>
        <li>
          Open <code>src/config.js</code> and paste the values into <code>FIREBASE_CONFIG</code>, then rebuild.
        </li>
      </ol>

      <h4>Hosting</h4>
      <ul>
        <li>
          Run <code>npm run build</code>, then deploy the <code>dist/</code> folder.
        </li>
        <li>
          <b>Netlify:</b> drag the <code>dist</code> folder onto <code>app.netlify.com/drop</code>.
        </li>
        <li>
          <b>GitHub Pages / Firebase Hosting:</b> publish the contents of <code>dist</code>.
        </li>
      </ul>
      <p>
        Phones must reach the same public URL that the QR codes encode — use the hosted URL, not localhost. Without
        Firebase the game still runs fully in this browser (open the game screen, survey and buzzers in separate tabs).
      </p>

      <h4>Admin password</h4>
      <p>
        Change <code>ADMIN_PASSWORD</code> in <code>src/config.js</code> (currently the default from the build brief).
        It is never shown on public screens.
      </p>

      <h4>Test checklist</h4>
      <ol>
        <li>Admin login with the password.</li>
        <li>Teams tab: names, colours, five players per team.</li>
        <li>Questions tab: add, edit, reorder, duplicate, delete.</li>
        <li>Live: Start survey → QR appears on the game screen.</li>
        <li>Open the survey link on 2+ devices/tabs and submit answers (one per device per question).</li>
        <li>Close survey → answers are grouped with counts; merge/rename/hide as needed.</li>
        <li>Approve and create board → covered slots appear on the game screen.</li>
        <li>Open buzzers → buzz from the phone pages or keys 1/2; first press locks.</li>
        <li>✓ Correct keeps the turn; ✕ Wrong switches teams.</li>
        <li>Bonus / deduct for judge-awarded points.</li>
        <li>End round → results screen; last question → final leaderboard with confetti.</li>
        <li>Refresh any screen mid-round — state is restored.</li>
      </ol>
    </div>
  );
}
