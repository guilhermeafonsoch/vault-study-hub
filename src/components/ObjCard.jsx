import { ChevronDown, ChevronRight, CheckCircle2, Circle, Terminal, AlertTriangle } from "lucide-react";
import { useLocale } from "../i18n/LocaleContext.jsx";

export default function ObjCard({ o, d, expanded, toggle, studied, mark, dark }) {
  const { difficulty, objectiveGuide, ui } = useLocale();
  const card = dark ? "bg-ink-600" : "bg-white";
  const brd = dark ? "border-ink-400" : "border-gray-200";
  const t1 = dark ? "text-gray-100" : "text-gray-900";
  const t2 = dark ? "text-gray-400" : "text-gray-500";
  const note = objectiveGuide[o.id];

  return (
    <div className={`${card} border ${brd} rounded-xl mb-2 overflow-hidden transition-all hover:shadow-lg`}>
      <div
        onClick={() => toggle(o.id)}
        className="px-4 py-3 cursor-pointer flex items-center gap-2 select-none"
      >
        {expanded ? <ChevronDown size={14} className={t2} /> : <ChevronRight size={14} className={t2} />}
        <span className="text-xs font-bold min-w-[24px]" style={{ color: d.color }}>{o.id}</span>
        <span className={`text-[13px] font-medium flex-1 ${t1}`}>{o.title}</span>
        <span className="text-[10px] mr-2 whitespace-nowrap">{difficulty[o.diff]}</span>
        <button
          onClick={(e) => { e.stopPropagation(); mark(o.id); }}
          className="bg-transparent border-0 cursor-pointer p-0 flex"
          aria-label={studied ? `${ui.actions.studied}` : `${ui.actions.markStudied}`}
        >
          {studied
            ? <CheckCircle2 size={18} className="text-green-500" />
            : <Circle size={18} className={`${t2} opacity-40`} />}
        </button>
      </div>

      {expanded && (
        <div className={`px-4 pb-4 border-t ${brd} animate-fade-in`}>
          {note?.explanation && (
            <div className="mt-3">
              <div className={`text-[11px] font-semibold ${t2} mb-2 uppercase tracking-wider`}>{ui.labels.explanation}</div>
              <div className={`text-xs leading-6 ${t1} px-3 py-2.5 rounded-lg ${dark ? "bg-ink-800" : "bg-gray-50"}`} style={{ borderLeft: `3px solid ${d.color}` }}>
                {note.explanation}
              </div>
            </div>
          )}

          {note?.whyItMatters && (
            <div className="mt-3">
              <div className={`text-[11px] font-semibold ${t2} mb-2 uppercase tracking-wider`}>{ui.labels.whyItMatters}</div>
              <div className={`text-xs leading-6 ${t1} px-3 py-2.5 rounded-lg ${dark ? "bg-ink-800" : "bg-gray-50"}`} style={{ borderLeft: "3px solid #10b98155" }}>
                {note.whyItMatters}
              </div>
            </div>
          )}

          {note?.howItWorks && (
            <div className="mt-3">
              <div className={`text-[11px] font-semibold ${t2} mb-2 uppercase tracking-wider`}>{ui.labels.howItWorks}</div>
              <div className={`text-xs leading-6 ${t1} px-3 py-2.5 rounded-lg ${dark ? "bg-ink-800" : "bg-gray-50"}`} style={{ borderLeft: "3px solid #7F77DD55" }}>
                {note.howItWorks}
              </div>
            </div>
          )}

          {note?.useCase && (
            <div className="mt-3">
              <div className={`text-[11px] font-semibold ${t2} mb-2 uppercase tracking-wider`}>{ui.labels.useCase}</div>
              <div className={`text-xs leading-6 ${t1} px-3 py-2.5 rounded-lg ${dark ? "bg-ink-800" : "bg-gray-50"}`} style={{ borderLeft: "3px solid #22c55e55" }}>
                {note.useCase}
              </div>
            </div>
          )}

          {note?.realWorldExample && (
            <div className="mt-3">
              <div className={`text-[11px] font-semibold ${t2} mb-2 uppercase tracking-wider`}>{ui.labels.realWorldExample}</div>
              <div className={`text-xs leading-6 ${t1} px-3 py-2.5 rounded-lg ${dark ? "bg-ink-800" : "bg-gray-50"}`} style={{ borderLeft: "3px solid #f59e0b55" }}>
                {note.realWorldExample}
              </div>
            </div>
          )}

          {note?.examCue && (
            <div
              className={`mt-3 px-3 py-2.5 rounded-lg ${dark ? "bg-emerald-950/25 text-emerald-100" : "bg-emerald-50 text-emerald-900"}`}
              style={{ borderLeft: "3px solid #10b981" }}
            >
              <div className="text-xs leading-6">
                <strong>{ui.labels.examAsks}: </strong>{note.examCue}
              </div>
            </div>
          )}

          <div className="mt-3">
            <div className={`text-[11px] font-semibold ${t2} mb-2 uppercase tracking-wider`}>{ui.labels.keyConcepts}</div>
            {o.concepts.map((c, i) => (
              <div
                key={i}
                className={`text-xs ${t1} py-1 pl-3 mb-0.5 leading-6`}
                style={{ borderLeft: `2px solid ${d.color}33` }}
              >{c}</div>
            ))}
          </div>

          {o.cli.length > 0 && (
            <div className="mt-3">
              <div className={`text-[11px] font-semibold ${t2} mb-2 flex items-center gap-1 uppercase tracking-wider`}>
                <Terminal size={10} />{ui.labels.cliCode}
              </div>
              {o.cli.map((c, i) => (
                <pre
                  key={i}
                  className={`code-block ${dark ? "bg-ink-800 text-sky-300" : "bg-gray-100 text-blue-800"} border ${brd} rounded-md px-3 py-2 mb-1 overflow-x-auto`}
                >{c}</pre>
              ))}
            </div>
          )}

          {note?.pitfalls?.length > 0 && (
            <div className="mt-3">
              <div className={`text-[11px] font-semibold ${t2} mb-2 uppercase tracking-wider`}>{ui.labels.commonTraps}</div>
              {note.pitfalls.map((item) => (
                <div
                  key={item}
                  className={`text-xs leading-6 py-1 pl-3 mb-0.5 ${t1}`}
                  style={{ borderLeft: "2px solid #eab30866" }}
                >
                  {item}
                </div>
              ))}
            </div>
          )}

          {note?.remember && (
            <div
              className={`mt-3 px-3 py-2.5 rounded-lg ${dark ? "bg-sky-950/30 text-sky-100" : "bg-sky-50 text-sky-900"}`}
              style={{ borderLeft: `3px solid ${d.color}` }}
            >
              <div className="text-xs leading-6">
                <strong>{ui.labels.remember}: </strong>{note.remember}
              </div>
            </div>
          )}

          <div
            className={`mt-3 px-3 py-2.5 rounded-lg flex gap-2 items-start ${dark ? "bg-amber-950/30 text-amber-200" : "bg-amber-50 text-amber-900"}`}
            style={{ borderLeft: "3px solid #eab308" }}
          >
            <AlertTriangle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="text-xs leading-6">
              <strong>{ui.labels.examTip}: </strong>{o.tip}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
