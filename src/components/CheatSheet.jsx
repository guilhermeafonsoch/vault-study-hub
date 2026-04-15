import { CheckCircle2, Circle } from "lucide-react";
import { useLocale } from "../i18n/LocaleContext.jsx";

export default function CheatSheet({ studied, markObj, dark }) {
  const { domains, domainGuides, objectiveGuide, ui } = useLocale();
  const card = dark ? "bg-ink-600" : "bg-white";
  const brd = dark ? "border-ink-400" : "border-gray-200";
  const t2 = dark ? "text-gray-400" : "text-gray-500";

  return (
    <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
      {domains.map((d) => {
        const guide = domainGuides[d.id];
        return (
          <div key={d.id} className={`${card} border ${brd} rounded-xl p-3`} style={{ borderTop: `3px solid ${d.color}` }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{d.icon}</span>
              <span className="text-xs font-bold">D{d.id}: {d.label}</span>
            </div>
            <div className={`text-[10px] ${t2} mb-3 leading-5 rounded-lg p-2 ${dark ? "bg-ink-800" : "bg-gray-50"}`}>
              <strong style={{ color: d.color }}>{ui.labels.focus}: </strong>{guide.focus}
            </div>
            {d.objectives.map((o) => (
              <div key={o.id} className={`text-[11px] ${t2} py-1.5 flex items-start gap-1.5`}>
                <button
                  onClick={() => markObj(o.id)}
                  className="bg-transparent border-0 cursor-pointer p-0 flex flex-shrink-0 mt-0.5"
                  aria-label={studied[o.id] ? ui.actions.studied : ui.actions.markStudied}
                >
                  {studied[o.id]
                    ? <CheckCircle2 size={11} className="text-green-500" />
                    : <Circle size={11} className={`${t2} opacity-40`} />}
                </button>
                <div>
                  <div>
                    <span className="font-semibold" style={{ color: d.color }}>{o.id}</span> {o.title}
                  </div>
                  <div className="text-[10px] leading-5 mt-0.5">
                    {objectiveGuide[o.id]?.remember ?? o.tip}
                  </div>
                </div>
              </div>
            ))}
            <div className={`mt-2 text-[10px] p-2 rounded ${dark ? "bg-ink-800" : "bg-gray-50"} leading-5`} style={{ borderLeft: "2px solid #eab308" }}>
              <strong>{ui.labels.trap}: </strong>{guide.commonTraps[0]}
            </div>
          </div>
        );
      })}
    </div>
  );
}
