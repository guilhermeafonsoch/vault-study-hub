import { useEffect, useRef, useState } from "react";

/**
 * Like useState, but persisted in localStorage under `key`.
 * Safe against quota errors and SSR (falls back to initial).
 */
export function usePersistedState(key, initial) {
  const initialRef = useRef(initial);
  const [value, setValue] = useState(() => {
    try {
      if (typeof window === "undefined") return initial;
      const raw = localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* quota / private mode — ignore */
    }
  }, [key, value]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const onStorage = (event) => {
      if (event.key !== key) return;
      try {
        setValue(event.newValue !== null ? JSON.parse(event.newValue) : initialRef.current);
      } catch {
        setValue(initialRef.current);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [key]);

  return [value, setValue];
}
