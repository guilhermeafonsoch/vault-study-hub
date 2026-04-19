import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Timer } from "lucide-react";
import { getSurfaceTokens } from "./SurfacePrimitives.jsx";
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

  const tokens = getSurfaceTokens(dark);
  const brd = dark ? "border-white/10" : "border-black/10";
  return (
    <div className={`flex items-center gap-1.5 border ${brd} rounded-full px-2.5 py-1.5 ${dark ? "bg-[#0d1523]" : "bg-white/90"}`}>
      <Timer size={12} className={dark ? "text-[#a2a9b0]" : "text-[#525252]"} />
      <span className="font-mono text-xs font-semibold tabular-nums">{mm}:{ss}</span>
      <button
        onClick={() => setRunning((r) => !r)}
        className={`ml-1 rounded-full p-1.5 transition ${tokens.chip}`}
        aria-label={running ? ui.actions.pause : ui.actions.start}
      >
        {running ? <Pause size={12} /> : <Play size={12} />}
      </button>
      <button onClick={() => reset()} className={`rounded-full p-1.5 transition ${tokens.chip}`} aria-label={ui.actions.reset}>
        <RotateCcw size={12} />
      </button>
      <div className="flex gap-0.5 ml-1">
        {[15, 25, 50].map((m) => (
          <button
            key={m}
            onClick={() => reset(m)}
            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${preset === m ? "text-white" : dark ? "bg-white/10 text-gray-100" : "bg-[#f2f4f8] text-gray-900"}`}
            style={preset === m ? { backgroundColor: "var(--ibm-blue-60)" } : undefined}
          >{m}</button>
        ))}
      </div>
    </div>
  );
}
