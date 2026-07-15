import { useSyncExternalStore } from 'react';
import { subscribe, getSnapshot } from './engine.js';

// Subscribe a component to the engine's snapshot. Any emit() re-renders it.
export function useStore() {
  return useSyncExternalStore(subscribe, getSnapshot);
}
