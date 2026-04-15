import { ExternalLink } from "lucide-react";
import { DOMAIN_GUIDES } from "../data/studyGuide.js";
import ObjCard from "./ObjCard.jsx";

export default function DetailView({ domain, studied, expandedObj, toggleObj, markObj, dark, domainProgress }) {
  const t2 = dark ? "text-gray-400" : "text-gray-500";
  const prog = domainProgress(domain);
  const guide = DOMAIN_GUIDES[domain.id];
  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">{domain.icon}</span>
        <div>
          <div className="text-[11px] font-bold tracking-wide" style={{ color: domain.color }}>DOMAIN {domain.id}</div>
          <div className="text-xl font-bold">{domain.label}</div>
          <div className={`text-xs ${t2}`}>
            {domain.objectives.length} objectives · {domain.objectives.filter((o) => studied[o.id]).length} studied
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className={`w-20 h-1.5 ${dark ? "bg-ink-400" : "bg-gray-200"} rounded overflow-hidden`}>
            <div className="h-full rounded" style={{ width: `${prog}%`, background: domain.color }} />
          </div>
          <span className="text-xs font-semibold" style={{ color: domain.color }}>{prog}%</span>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr] mb-5">
        <div
          className={`px-4 py-4 rounded-2xl text-[13px] leading-6 ${dark ? "bg-ink-600 text-gray-300 border-ink-400" : "bg-white text-gray-700 border-gray-200"} border`}
          style={{ borderTopWidth: 3, borderTopColor: domain.color }}
        >
          <div className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: domain.color }}>
            Domain summary
          </div>
          <div>{domain.summary}</div>
          <div className={`mt-4 text-xs leading-7 ${t2}`}>{guide.focus}</div>
        </div>

        <div className={`rounded-2xl border p-4 ${dark ? "bg-ink-600 border-ink-400" : "bg-white border-gray-200"}`}>
          <div className="text-sm font-semibold mb-3">Official references</div>
          <div className="flex flex-wrap gap-2">
            {guide.resources.map((resource) => (
              <a
                key={resource.href}
                href={resource.href}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-2 text-[11px] px-3 py-2 rounded-full border transition ${dark ? "border-ink-400 bg-ink-800 hover:bg-ink-700" : "border-gray-200 bg-gray-50 hover:bg-gray-100"}`}
              >
                {resource.label} <ExternalLink size={12} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 mb-6">
        <div className={`rounded-2xl border p-4 ${dark ? "bg-ink-600 border-ink-400" : "bg-white border-gray-200"}`}>
          <div className="text-sm font-semibold mb-3">Mental model</div>
          <div className="space-y-2">
            {guide.mentalModel.map((item) => (
              <div key={item} className={`text-xs leading-6 pl-3 ${t2}`} style={{ borderLeft: `2px solid ${domain.color}55` }}>
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className={`rounded-2xl border p-4 ${dark ? "bg-ink-600 border-ink-400" : "bg-white border-gray-200"}`}>
          <div className="text-sm font-semibold mb-3">Common traps</div>
          <div className="space-y-2">
            {guide.commonTraps.map((item) => (
              <div key={item} className={`text-xs leading-6 pl-3 ${t2}`} style={{ borderLeft: "2px solid #eab308" }}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {domain.objectives.map((o) => (
        <ObjCard
          key={o.id}
          o={o}
          d={domain}
          expanded={!!expandedObj[o.id]}
          toggle={toggleObj}
          studied={!!studied[o.id]}
          mark={markObj}
          dark={dark}
        />
      ))}
    </div>
  );
}
