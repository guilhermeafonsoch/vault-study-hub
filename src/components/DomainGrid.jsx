import { CheckCircle2, LayoutGrid, MoveUpRight } from "lucide-react";
import { SurfaceCard, SurfaceIntro, SurfaceKicker, SurfaceStat, getSurfaceTokens } from "./SurfacePrimitives.jsx";
import { useLocale } from "../i18n/LocaleContext.jsx";

export default function DomainGrid({ studied, onSelect, dark, domainProgress }) {
  const { domains, domainGuides, ui } = useLocale();
  const tokens = getSurfaceTokens(dark);

  return (
    <div className="space-y-6 animate-fade-in">
      <SurfaceIntro
        dark={dark}
        tone="blue"
        eyebrow={ui.views.grid}
        title={ui.home.studySurfacesHeadline}
        body={ui.home.modes.grid}
        stats={[
          <SurfaceStat key="domains" dark={dark} label={ui.labels.domain} value={`${domains.length}`} body={ui.labels.nineDomains} />,
          <SurfaceStat key="objectives" dark={dark} label={ui.labels.objectives} value={`${domains.flatMap((domain) => domain.objectives).length}`} body={ui.labels.fortyObjectives} tone="purple" />,
          <SurfaceStat key="focus" dark={dark} label={ui.labels.focus} value={ui.labels.objectiveGuide} body={ui.home.domainsBody} />,
        ]}
      />

      <SurfaceCard dark={dark}>
        <SurfaceKicker tone="blue">
          <LayoutGrid size={13} />
          {ui.views.grid}
        </SurfaceKicker>
        <div className="mt-6 grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))" }}>
          {domains.map((domain) => {
            const progress = domainProgress(domain);
            const doneCount = domain.objectives.filter((objective) => studied[objective.id]).length;
            const guide = domainGuides[domain.id];

            return (
              <button
                key={domain.id}
                onClick={() => onSelect(domain)}
                className={`${tokens.panelStrong} relative overflow-hidden rounded-[28px] border p-5 text-left transition hover:-translate-y-0.5 hover:shadow-xl`}
                style={{
                  background: dark
                    ? "linear-gradient(120deg, rgba(15,98,254,0.06), rgba(255,255,255,0.02))"
                    : "linear-gradient(120deg, rgba(15,98,254,0.05), rgba(255,255,255,0.98))",
                  borderLeft: `3px solid ${domain.color}`,
                }}
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{domain.icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: domain.color }}>
                      {ui.labels.domain} {domain.id}
                    </div>
                    <div className="mt-2 text-base font-semibold">{domain.label}</div>
                    <div className={`mt-2 text-xs leading-6 ${tokens.muted}`}>{domain.summary}</div>
                  </div>
                  {progress === 100 ? <CheckCircle2 size={16} className="text-green-500 mt-0.5" /> : null}
                </div>

                <div className={`mt-4 rounded-[20px] border p-3 text-xs leading-6 ${tokens.soft}`}>
                  <span className="font-semibold" style={{ color: domain.color }}>{ui.labels.focus}: </span>
                  <span className={tokens.muted}>{guide.focus}</span>
                </div>

                <div className={`mt-3 text-xs leading-6 ${tokens.muted}`}>
                  <span className="font-semibold" style={{ color: "#f1c21b" }}>{ui.labels.watchFor}: </span>
                  {guide.commonTraps[0]}
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <div className={`h-1.5 flex-1 overflow-hidden rounded-full ${tokens.track}`}>
                    <div className="h-full rounded-full" style={{ width: `${progress}%`, background: domain.color }} />
                  </div>
                  <span className="text-xs font-semibold" style={{ color: domain.color }}>{progress}%</span>
                </div>

                <div className={`mt-4 flex items-center justify-between text-[11px] ${tokens.muted}`}>
                  <span>{ui.labels.objectiveCount(domain.objectives.length)} · {ui.labels.doneCount(doneCount)}</span>
                  <span className="inline-flex items-center gap-1 font-semibold" style={{ color: domain.color }}>
                    {ui.actions.openDomainNotes}
                    <MoveUpRight size={13} />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </SurfaceCard>
    </div>
  );
}
