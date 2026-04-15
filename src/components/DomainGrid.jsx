import { CheckCircle2 } from "lucide-react";
import { DOMAINS } from "../data/domains.js";
import { DOMAIN_GUIDES } from "../data/studyGuide.js";

export default function DomainGrid({ studied, onSelect, dark, domainProgress }) {
  const card = dark ? "bg-ink-600" : "bg-white";
  const brd = dark ? "border-ink-400" : "border-gray-200";
  const t2 = dark ? "text-gray-400" : "text-gray-500";

  return (
    <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
      {DOMAINS.map((d) => {
        const prog = domainProgress(d);
        const doneCount = d.objectives.filter((o) => studied[o.id]).length;
        const guide = DOMAIN_GUIDES[d.id];
        return (
          <button
            key={d.id}
            onClick={() => onSelect(d)}
            className={`${card} border ${brd} rounded-xl p-4 text-left cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-xl relative`}
            style={{ borderLeft: `4px solid ${d.color}` }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{d.icon}</span>
              <div>
                <div className="text-[10px] font-bold tracking-wide" style={{ color: d.color }}>DOMAIN {d.id}</div>
                <div className="text-sm font-semibold">{d.label}</div>
              </div>
            </div>
            <div className={`text-xs ${t2} mb-2`}>
              {d.objectives.length} objectives · {doneCount} done
            </div>
            <p className={`text-[11px] ${t2} mb-3 leading-5 line-clamp-2`}>{d.summary}</p>
            <div className={`text-[11px] ${t2} mb-3 leading-5 rounded-lg p-2 ${dark ? "bg-ink-800" : "bg-gray-50"}`}>
              <span className="font-semibold" style={{ color: d.color }}>Focus:</span> {guide.focus}
            </div>
            <div className={`text-[10px] ${t2} mb-3 leading-5`}>
              <span className="font-semibold text-amber-500">Watch for:</span> {guide.commonTraps[0]}
            </div>
            <div className="flex items-center gap-2">
              <div className={`flex-1 h-1.5 ${dark ? "bg-ink-400" : "bg-gray-200"} rounded overflow-hidden`}>
                <div className="h-full rounded transition-all duration-500" style={{ width: `${prog}%`, background: d.color }} />
              </div>
              <span className={`text-[10px] ${t2}`}>{prog}%</span>
            </div>
            {prog === 100 && <CheckCircle2 size={16} className="text-green-500 absolute top-2 right-2" />}
          </button>
        );
      })}
    </div>
  );
}
