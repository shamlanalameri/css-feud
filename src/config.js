/* ==========================================================================
   CONFIG — edit these values
   ========================================================================== */

// Admin portal password — change me before a live event.
// It is never shown on the public game/survey/buzzer screens.
export const ADMIN_PASSWORD = '1234';

// Paste your Firebase web-app config here to enable live multi-device sync.
// Leave apiKey empty to run in LOCAL DEMO MODE (same-browser tabs only).
//
//   1. console.firebase.google.com -> Add project.
//   2. Build -> Realtime Database -> Create database -> start in TEST mode.
//   3. Build -> Authentication -> Sign-in method -> enable "Anonymous".
//   4. Project settings -> General -> Your apps -> Web app -> copy the config
//      object and paste its values below.
export const FIREBASE_CONFIG = {
  apiKey: '',
  authDomain: '',
  databaseURL: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
};

// Firebase Realtime Database root node.
export const APP_ROOT = 'cssfeud';

export const HAS_FB = !!FIREBASE_CONFIG.apiKey;
