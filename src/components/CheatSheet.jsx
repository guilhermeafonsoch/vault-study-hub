import { CheckCircle2, Circle } from "lucide-react";
import { DOMAINS } from "../data/domains.js";

export default function CheatSheet({ studied, markObj, dark }) {
  const card = dark ? "bg-ink-600" : "bg-white";
  const brd = dark ? "border-ink-400" : "border-gray-200";
  const t2 = dark ? "text-gray-400" : "text-gray-500";

  return (
    <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
      {DOMAINS.map((d) => (
        <div key={d.id} className={`${card} border ${brd} rounded-xl p-3`} style={{ borderTop: `3px solid ${d.color}` }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{d.icon}</span>
            <span className="text-xs font-bold">D{d.id}: {d.label}</span>
          </div>
          {d.objectives.map((o) => (
            <div key={o.id} className={`text-[11px] ${t2} py-1 flex items-start gap-1.5`}>
              <button
                onClick={() => markObj(o.id)}
                className="bg-transparent border-0 cursor-pointer p-0 flex flex-shrink-0 mt-0.5"
                aria-label={studied[o.id] ? "mark unstudied" : "mark studied"}
              >
                {studied[o.id]
                  ? <CheckCircle2 size={11} className="text-green-500" />
                  : <Circle size={11} className={`${t2} opacity-40`} />}
              </button>
              <span>
                <span className="font-semibold" style={{ color: d.color }}>{o.id}</span> {o.title}
              </span>
            </div>
          ))}
          <div className={`mt-2 text-[10px] p-2 rounded ${dark ? "bg-ink-800" : "bg-gray-50"} leading-5`} style={{ borderLeft: `2px solid ${d.color}` }}>
            <strong>Tip: </strong>{d.objectives[0].tip}
          </div>
        </div>
      ))}
    </div>
  );
}
