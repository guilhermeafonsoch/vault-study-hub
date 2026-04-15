import { useEffect, useState } from "react";

/**
 * Like useState, but persisted in localStorage under `key`.
 * Safe against quota errors and SSR (falls back to initial).
 */
export function usePersistedState(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* quota / private mode — ignore */
    }
  }, [key, value]);

  return [value, setValue];
}
