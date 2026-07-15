import React, { useState } from 'react';
import { Logo } from '../components/common.jsx';
import { ACT } from '../lib/engine.js';

export default function Login() {
  const [pass, setPass] = useState('');
  const submit = () => ACT.login(pass);
  return (
    <div className="login-wrap">
      <div className="login-card">
        <Logo />
        <h2 style={{ fontSize: 19, marginBottom: 4 }}>Admin portal</h2>
        <p style={{ fontSize: 13, color: 'var(--ink-400)', margin: '0 0 16px' }}>
          Host and judge controls. Enter the admin password.
        </p>
        <input
          type="password"
          placeholder="Password"
          autoFocus
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
        />
        <button className="btn btn-primary btn-big" style={{ width: '100%', marginTop: 14 }} onClick={submit}>
          Log in
        </button>
      </div>
    </div>
  );
}
