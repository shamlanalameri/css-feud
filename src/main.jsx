import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { boot } from './lib/engine.js';

createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

// Kick off the backend + initial game load after the first render, exactly like
// the prototype's main() IIFE.
boot();
