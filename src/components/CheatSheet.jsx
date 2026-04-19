import { CheckCircle2, Circle, FileText } from "lucide-react";
import { SurfaceCard, SurfaceIntro, SurfaceKicker, SurfaceStat, getSurfaceTokens } from "./SurfacePrimitives.jsx";
import { useLocale } from "../i18n/LocaleContext.jsx";

export default function CheatSheet({ studied, markObj, dark }) {
  const { domains, domainGuides, objectiveGuide, ui } = useLocale();
  const tokens = getSurfaceTokens(dark);

  return (
    <div className="space-y-6 animate-fade-in">
      <SurfaceIntro
        dark={dark}
        tone="purple"
        eyebrow={ui.views.cheat}
        title={ui.home.modes.cheat}
        body={ui.labels.examTip}
        stats={[
          <SurfaceStat key="domains" dark={dark} label={ui.labels.domain} value={`${domains.length}`} body={ui.home.domainsBody} tone="purple" />,
          <SurfaceStat key="objectives" dark={dark} label={ui.labels.objectiveGuide} value={`${domains.flatMap((domain) => domain.objectives).length}`} body={ui.labels.fortyObjectives} />,
          <SurfaceStat key="trap" dark={dark} label={ui.labels.trap} value={ui.labels.commonTraps} body={ui.home.modes.cheat} tone="purple" />,
        ]}
      />

      <SurfaceCard dark={dark}>
        <SurfaceKicker tone="purple">
          <FileText size={13} />
          {ui.views.cheat}
        </SurfaceKicker>
        <div className="mt-6 grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}>
          {domains.map((domain) => {
            const guide = domainGuides[domain.id];
            return (
              <div key={domain.id} className={`${tokens.panelStrong} rounded-[28px] border p-4`} style={{ borderTop: `3px solid ${domain.color}` }}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{domain.icon}</span>
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: domain.color }}>
                      {ui.labels.domain} {domain.id}
                    </div>
                    <div className="text-sm font-semibold">{domain.label}</div>
                  </div>
                </div>

                <div className={`${tokens.soft} mt-4 rounded-[20px] border p-3 text-xs leading-6`}>
                  <strong style={{ color: domain.color }}>{ui.labels.focus}: </strong>
                  <span className={tokens.muted}>{guide.focus}</span>
                </div>

                <div className="mt-4 space-y-2">
                  {domain.objectives.map((objective) => (
                    <div key={objective.id} className={`flex items-start gap-2.5 rounded-[18px] border px-3 py-3 ${tokens.inset}`}>
                      <button
                        onClick={() => markObj(objective.id)}
                        className="bg-transparent border-0 cursor-pointer p-0 mt-0.5"
                        aria-label={studied[objective.id] ? ui.actions.studied : ui.actions.markStudied}
                      >
                        {studied[objective.id]
                          ? <CheckCircle2 size={14} className="text-green-500" />
                          : <Circle size={14} className={`${tokens.faint} opacity-60`} />}
                      </button>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold leading-5">
                          <span style={{ color: domain.color }}>{objective.id}</span> {objective.title}
                        </div>
                        <div className={`mt-1 text-[11px] leading-5 ${tokens.muted}`}>
                          {objectiveGuide[objective.id]?.remember ?? objective.tip}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-[20px] border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs leading-6 text-amber-200">
                  <strong>{ui.labels.trap}: </strong>
                  {guide.commonTraps[0]}
                </div>
              </div>
            );
          })}
        </div>
      </SurfaceCard>
    </div>
  );
}
