import React from 'react';

// Catches any render error so the user sees a readable message and a recovery
// button instead of a blank white page.
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    console.error('CSS Feud crashed:', error, info);
  }
  reset = () => {
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith('cf:'))
        .forEach((k) => localStorage.removeItem(k));
    } catch (e) {}
    location.reload();
  };
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          background: 'radial-gradient(130% 90% at 50% -12%, #143079 0%, #0E2158 42%, #0A1638 78%, #060C22 100%)',
          fontFamily: 'Inter, system-ui, sans-serif',
          color: '#fff',
        }}
      >
        <div
          style={{
            background: '#fff',
            color: '#232528',
            borderRadius: 16,
            padding: 30,
            maxWidth: 460,
            textAlign: 'center',
            boxShadow: '0 12px 28px rgba(0,0,0,.35)',
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 8 }}>😕</div>
          <h2 style={{ margin: '0 0 8px', fontSize: 20 }}>Something went wrong loading the game</h2>
          <p style={{ fontSize: 14, color: '#5F646D', margin: '0 0 16px' }}>
            This can happen after an update. Reset the saved game data and reload — your questions and scores may need
            to be set up again.
          </p>
          <button
            onClick={this.reset}
            style={{
              background: '#92722A',
              color: '#fff',
              border: 'none',
              borderRadius: 999,
              padding: '12px 26px',
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            Reset and reload
          </button>
          <pre
            style={{
              textAlign: 'left',
              marginTop: 18,
              padding: 10,
              background: '#F7F7F7',
              borderRadius: 8,
              fontSize: 11,
              color: '#797E86',
              overflow: 'auto',
              maxHeight: 120,
              whiteSpace: 'pre-wrap',
            }}
          >
            {String(this.state.error && (this.state.error.stack || this.state.error.message || this.state.error))}
          </pre>
        </div>
      </div>
    );
  }
}
