import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { baseURL } from '../lib/engine.js';

const LOGO_SRC = import.meta.env.BASE_URL + 'css-feud-logo.png';

// Logo image that hides itself if the asset is missing (matches prototype's
// onerror behaviour). `fallbackText` renders a text title instead when set.
export function Logo({ className, alt = 'CSS Feud', fallbackText = false, ...rest }) {
  const [broken, setBroken] = useState(false);
  if (broken) {
    return fallbackText ? <h1 style={{ fontFamily: 'Inter' }}>CSS Feud</h1> : null;
  }
  return <img className={className} src={LOGO_SRC} alt={alt} onError={() => setBroken(true)} {...rest} />;
}

// QR code rendered to an <img> via the `qrcode` package. Same colours/level as
// the prototype (qrcodejs, correctLevel M).
export function QR({ text, size = 200 }) {
  const [url, setUrl] = useState('');
  useEffect(() => {
    let alive = true;
    QRCode.toDataURL(text, {
      width: size,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: { dark: '#0E0F12', light: '#ffffff' },
    })
      .then((u) => alive && setUrl(u))
      .catch(() => alive && setUrl(''));
    return () => {
      alive = false;
    };
  }, [text, size]);
  return url ? (
    <img src={url} width={size} height={size} alt="QR code" style={{ display: 'block' }} />
  ) : (
    <div style={{ width: size, height: size }} />
  );
}

export function BackButton() {
  return (
    <a className="back-btn" href={baseURL()}>
      ← Back
    </a>
  );
}
