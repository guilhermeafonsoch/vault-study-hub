import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Timer } from "lucide-react";
import { useLocale } from "../i18n/LocaleContext.jsx";

/**
 * Simple Pomodoro-style study timer. 25 min focus by default.
 * Fires an alert when it reaches 0.
 */
export default function StudyTimer({ dark }) {
  const { ui } = useLocale();
  const [remaining, setRemaining] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [preset, setPreset] = useState(25);
  const tick = useRef(null);

  useEffect(() => {
    if (!running) return;
    tick.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          setRunning(false);
          try { new Audio("data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEAIlYAAESsAAACABAAZGF0YQAAAAA=").play(); } catch {}
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(tick.current);
  }, [running]);

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");

  const reset = (mins = preset) => {
    setRunning(false);
    setRemaining(mins * 60);
    setPreset(mins);
  };

  const brd = dark ? "border-ink-400" : "border-gray-200";
  return (
    <div className={`flex items-center gap-1.5 border ${brd} rounded-lg px-2 py-1 ${dark ? "bg-ink-600" : "bg-white"}`}>
      <Timer size={12} className={dark ? "text-gray-400" : "text-gray-500"} />
      <span className="font-mono text-xs font-semibold tabular-nums">{mm}:{ss}</span>
      <button
        onClick={() => setRunning((r) => !r)}
        className={`ml-1 p-1 rounded hover:bg-violet-500 hover:text-white transition`}
        aria-label={running ? ui.actions.pause : ui.actions.start}
      >
        {running ? <Pause size={12} /> : <Play size={12} />}
      </button>
      <button onClick={() => reset()} className="p-1 rounded hover:bg-violet-500 hover:text-white transition" aria-label={ui.actions.reset}>
        <RotateCcw size={12} />
      </button>
      <div className="flex gap-0.5 ml-1">
        {[15, 25, 50].map((m) => (
          <button
            key={m}
            onClick={() => reset(m)}
            className={`text-[10px] px-1.5 py-0.5 rounded ${preset === m ? "bg-violet-500 text-white" : dark ? "bg-ink-400" : "bg-gray-100"}`}
          >{m}</button>
        ))}
      </div>
    </div>
  );
}
