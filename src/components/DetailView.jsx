import { ExternalLink, LibraryBig, ShieldAlert } from "lucide-react";
import ObjCard from "./ObjCard.jsx";
import { SurfaceCard, SurfaceIntro, SurfaceKicker, SurfaceLink, SurfaceStat, getSurfaceTokens } from "./SurfacePrimitives.jsx";
import { useLocale } from "../i18n/LocaleContext.jsx";

export default function DetailView({ domain, studied, expandedObj, toggleObj, markObj, dark, domainProgress }) {
  const { domainGuides, ui } = useLocale();
  const tokens = getSurfaceTokens(dark);
  const progress = domainProgress(domain);
  const guide = domainGuides[domain.id];
  const done = domain.objectives.filter((objective) => studied[objective.id]).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <SurfaceIntro
        dark={dark}
        tone="mixed"
        eyebrow={<><span className="text-base">{domain.icon}</span><span>{ui.labels.domain} {domain.id}</span></>}
        title={domain.label}
        body={guide.focus}
        stats={[
          <SurfaceStat key="progress" dark={dark} label={ui.labels.studied} value={`${done}/${domain.objectives.length}`} body={ui.labels.studiedProgress(done, domain.objectives.length)} />,
          <SurfaceStat key="coverage" dark={dark} label={ui.labels.objectives} value={`${domain.objectives.length}`} body={ui.labels.objectiveCount(domain.objectives.length)} tone="purple" />,
          <SurfaceStat key="readiness" dark={dark} label={ui.labels.focus} value={`${progress}%`} body={domain.summary} />,
        ]}
      />

      <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <SurfaceCard dark={dark}>
          <SurfaceKicker tone="blue">
            <LibraryBig size={13} />
            {ui.labels.domainSummary}
          </SurfaceKicker>
          <div className="display-font mt-3 text-3xl font-semibold">{domain.summary}</div>
          <div className={`mt-4 text-sm leading-7 ${tokens.muted}`}>{guide.focus}</div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className={`${tokens.soft} rounded-[24px] border p-4`}>
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--ibm-blue-30)" }}>
                {ui.labels.mentalModel}
              </div>
              <div className="mt-3 space-y-2">
                {guide.mentalModel.map((item) => (
                  <div key={item} className={`text-xs leading-6 pl-3 ${tokens.muted}`} style={{ borderLeft: `2px solid ${domain.color}55` }}>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className={`${tokens.soft} rounded-[24px] border p-4`}>
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: "#f1c21b" }}>
                {ui.labels.commonTraps}
              </div>
              <div className="mt-3 space-y-2">
                {guide.commonTraps.map((item) => (
                  <div key={item} className={`text-xs leading-6 pl-3 ${tokens.muted}`} style={{ borderLeft: "2px solid #f1c21b" }}>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard dark={dark}>
          <SurfaceKicker tone="purple">
            <ShieldAlert size={13} />
            {ui.labels.officialReferences}
          </SurfaceKicker>
          <div className="display-font mt-3 text-3xl font-semibold">{ui.labels.officialStudyLinks}</div>
          <div className={`mt-3 text-sm leading-7 ${tokens.muted}`}>{ui.labels.crossCheckGuide}</div>

          <div className="mt-6 flex flex-wrap gap-2">
            {guide.resources.map((resource) => (
              <SurfaceLink key={resource.href} dark={dark} href={resource.href} icon={<ExternalLink size={12} />}>
                {resource.label}
              </SurfaceLink>
            ))}
          </div>

          <div className={`mt-6 rounded-[24px] border p-4 ${tokens.soft}`}>
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-semibold">{ui.labels.domainProgress}</div>
              <div className="text-sm font-semibold" style={{ color: domain.color }}>{progress}%</div>
            </div>
            <div className={`mt-3 h-2 overflow-hidden rounded-full ${tokens.track}`}>
              <div className="h-full rounded-full" style={{ width: `${progress}%`, background: domain.color }} />
            </div>
          </div>
        </SurfaceCard>
      </section>

      <section>
        {domain.objectives.map((objective) => (
          <ObjCard
            key={objective.id}
            o={objective}
            d={domain}
            expanded={!!expandedObj[objective.id]}
            toggle={toggleObj}
            studied={!!studied[objective.id]}
            mark={markObj}
            dark={dark}
          />
        ))}
      </section>
    </div>
  );
}
