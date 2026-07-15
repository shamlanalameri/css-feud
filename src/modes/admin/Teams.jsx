import React from 'react';
import { BoundText, BoundColor } from '../../components/fields.jsx';

export default function Teams({ snap }) {
  const S = snap.S;
  return (
    <div className="grid2">
      {[0, 1].map((i) => {
        const t = S.teams[i];
        return (
          <div className="panel" key={i}>
            <h3>Team {i + 1}</h3>
            <label>Team name</label>
            <BoundText path={`teams.${i}.name`} value={t.name} />
            <div className="row">
              <div style={{ flex: 1 }}>
                <label>Team colour</label>
                <BoundColor path={`teams.${i}.color`} value={t.color} style={{ height: 42, padding: 4 }} />
              </div>
              <div style={{ flex: 3 }}>
                <label>Logo image URL (optional)</label>
                <BoundText path={`teams.${i}.logo`} value={t.logo} placeholder="https://…" />
              </div>
            </div>
            <label>Players (five)</label>
            {t.players.map((p, j) => (
              <BoundText
                key={j}
                style={{ marginBottom: 6 }}
                path={`teams.${i}.players.${j}`}
                value={p}
                placeholder={'Player ' + (j + 1)}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
