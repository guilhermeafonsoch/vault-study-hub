import { AlertTriangle, CheckCircle2, ChevronDown, ChevronRight, Circle, Terminal } from "lucide-react";
import { getSurfaceTokens } from "./SurfacePrimitives.jsx";
import { useLocale } from "../i18n/LocaleContext.jsx";

export default function ObjCard({ o, d, expanded, toggle, studied, mark, dark }) {
  const { difficulty, objectiveGuide, ui } = useLocale();
  const tokens = getSurfaceTokens(dark);
  const note = objectiveGuide[o.id];

  return (
    <div
      className={`${tokens.panel} mb-3 overflow-hidden rounded-[28px] border transition-all hover:-translate-y-0.5 hover:shadow-xl`}
      style={{
        background: dark
          ? "linear-gradient(120deg, rgba(15,98,254,0.04), rgba(255,255,255,0.02))"
          : "linear-gradient(120deg, rgba(15,98,254,0.03), rgba(255,255,255,0.98))",
      }}
    >
      <div
        onClick={() => toggle(o.id)}
        className="flex cursor-pointer items-center gap-3 px-4 py-4 select-none md:px-5"
      >
        {expanded ? <ChevronDown size={16} className={tokens.muted} /> : <ChevronRight size={16} className={tokens.muted} />}
        <span className="min-w-[28px] text-xs font-bold" style={{ color: d.color }}>{o.id}</span>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold leading-6">{o.title}</div>
          <div className={`mt-1 text-[11px] ${tokens.muted}`}>{difficulty[o.diff]}</div>
        </div>
        <button
          onClick={(event) => {
            event.stopPropagation();
            mark(o.id);
          }}
          className="bg-transparent border-0 cursor-pointer p-0 flex"
          aria-label={studied ? ui.actions.studied : ui.actions.markStudied}
        >
          {studied ? <CheckCircle2 size={18} className="text-green-500" /> : <Circle size={18} className={`${tokens.faint} opacity-60`} />}
        </button>
      </div>

      {expanded && (
        <div className={`animate-fade-in border-t px-4 pb-4 pt-4 md:px-5 ${dark ? "border-white/10" : "border-black/10"}`}>
          {note?.explanation && (
            <InfoBlock dark={dark} title={ui.labels.explanation} body={note.explanation} accent={d.color} />
          )}
          {note?.whyItMatters && (
            <InfoBlock dark={dark} title={ui.labels.whyItMatters} body={note.whyItMatters} accent="var(--ibm-blue-60)" />
          )}
          {note?.howItWorks && (
            <InfoBlock dark={dark} title={ui.labels.howItWorks} body={note.howItWorks} accent="var(--ibm-purple-40)" />
          )}
          {note?.useCase && (
            <InfoBlock dark={dark} title={ui.labels.useCase} body={note.useCase} accent="#24a148" />
          )}
          {note?.realWorldExample && (
            <InfoBlock dark={dark} title={ui.labels.realWorldExample} body={note.realWorldExample} accent="#f1c21b" />
          )}

          {note?.examCue && (
            <Callout dark={dark} accent="#24a148" title={ui.labels.examAsks}>
              {note.examCue}
            </Callout>
          )}

          <div className="mt-4 grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--ibm-blue-30)" }}>
                {ui.labels.keyConcepts}
              </div>
              <div className="mt-3 space-y-2">
                {o.concepts.map((concept) => (
                  <div key={concept} className={`text-xs leading-6 pl-3 ${tokens.muted}`} style={{ borderLeft: `2px solid ${d.color}55` }}>
                    {concept}
                  </div>
                ))}
              </div>

              {o.cli.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--ibm-purple-40)" }}>
                    <Terminal size={11} />
                    {ui.labels.cliCode}
                  </div>
                  <div className="mt-3 space-y-2">
                    {o.cli.map((command) => (
                      <pre
                        key={command}
                        className={`code-block rounded-[18px] border px-4 py-3 ${tokens.inset}`}
                      >
                        {command}
                      </pre>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              {note?.pitfalls?.length ? (
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: "#f1c21b" }}>
                    {ui.labels.commonTraps}
                  </div>
                  <div className="mt-3 space-y-2">
                    {note.pitfalls.map((item) => (
                      <div key={item} className={`${tokens.soft} rounded-[20px] border p-3 text-xs leading-6 ${tokens.muted}`} style={{ borderLeft: "3px solid #f1c21b" }}>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {note?.remember && (
                <Callout dark={dark} accent={d.color} title={ui.labels.remember} className="mt-4">
                  {note.remember}
                </Callout>
              )}

              <div className="mt-4 rounded-[20px] border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs leading-6 text-amber-200">
                <div className="flex items-start gap-2">
                  <AlertTriangle size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>{ui.labels.examTip}: </strong>
                    {o.tip}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoBlock({ dark, title, body, accent }) {
  const tokens = getSurfaceTokens(dark);

  return (
    <div className="mt-3">
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: accent }}>
        {title}
      </div>
      <div className={`mt-2 rounded-[20px] border px-4 py-3 text-xs leading-6 ${tokens.soft} ${tokens.muted}`} style={{ borderLeft: `3px solid ${accent}` }}>
        {body}
      </div>
    </div>
  );
}

function Callout({ dark, accent, title, children, className = "" }) {
  const tokens = getSurfaceTokens(dark);
  return (
    <div className={`rounded-[20px] border px-4 py-3 text-xs leading-6 ${tokens.soft} ${className}`} style={{ borderLeft: `3px solid ${accent}` }}>
      <strong style={{ color: accent }}>{title}: </strong>
      <span className={tokens.muted}>{children}</span>
    </div>
  );
}
