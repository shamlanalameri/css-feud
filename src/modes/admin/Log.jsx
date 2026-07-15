import React from 'react';
import { fmtT } from '../../lib/utils.js';

export default function Log({ snap }) {
  const log = snap.S.log || [];
  return (
    <div className="panel">
      <h3>Activity log</h3>
      <p className="hint">Private record of answers, points, turn changes and adjustments. Newest first.</p>
      {log.length ? (
        log.map((l, i) => (
          <div className="logrow" key={i}>
            <time>{fmtT(l.t)}</time>
            <span>{l.msg}</span>
          </div>
        ))
      ) : (
        <p className="hint">Nothing yet.</p>
      )}
    </div>
  );
}
