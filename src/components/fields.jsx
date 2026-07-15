import React, { useEffect, useRef, useState } from 'react';
import { setField } from '../lib/engine.js';

// Text / textarea inputs commit on blur or Enter — matching the prototype's
// delegated `change` listener (which fires on blur for text fields). Local
// state keeps typing responsive; the bound value re-syncs if it changes
// remotely.
function useCommitState(value) {
  const [v, setV] = useState(value);
  const ref = useRef(value);
  useEffect(() => {
    if (value !== ref.current) {
      ref.current = value;
      setV(value);
    }
  }, [value]);
  const sync = (nv) => (ref.current = nv);
  return [v, setV, sync];
}

export function BoundText({ path, value, num = false, enterCommits = true, ...rest }) {
  const [v, setV, sync] = useCommitState(value ?? '');
  const commit = () => {
    sync(num ? parseFloat(v) || 0 : v);
    setField(path, v, { num });
  };
  return (
    <input
      value={v}
      onChange={(e) => setV(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (enterCommits && e.key === 'Enter') {
          e.preventDefault();
          commit();
          e.currentTarget.blur();
        }
      }}
      {...rest}
    />
  );
}

export function BoundTextarea({ path, value, ...rest }) {
  const [v, setV, sync] = useCommitState(value ?? '');
  const commit = () => {
    sync(v);
    setField(path, v);
  };
  return <textarea value={v} onChange={(e) => setV(e.target.value)} onBlur={commit} {...rest} />;
}

// Checkbox / colour / select commit immediately (their `change` fires at once).
export function BoundCheckbox({ path, value, ...rest }) {
  return <input type="checkbox" checked={!!value} onChange={(e) => setField(path, e.target.checked)} {...rest} />;
}

export function BoundColor({ path, value, ...rest }) {
  return <input type="color" value={value} onChange={(e) => setField(path, e.target.value)} {...rest} />;
}

export function BoundSelect({ path, value, num = false, children, ...rest }) {
  return (
    <select value={value} onChange={(e) => setField(path, e.target.value, { num })} {...rest}>
      {children}
    </select>
  );
}
