import { ArrowRight, CheckCircle2, Compass, ExternalLink, Map, Sparkles } from "lucide-react";
import { VaultMark } from "./BrandMarks.jsx";
import { SurfaceCard, SurfaceIntro, SurfaceKicker, SurfaceLink, SurfaceStat, getSurfaceTokens } from "./SurfacePrimitives.jsx";
import { useLocale } from "../i18n/LocaleContext.jsx";

export default function StudyGuide({ dark, studied, onOpenDomain, onOpenMindMap, domainProgress }) {
  const { domains, domainGuides, examGuide, objectiveGuide, ui } = useLocale();
  const tokens = getSurfaceTokens(dark);

  const introAside = (
    <div className="grid gap-3">
      {examGuide.highlights.map((item, index) => (
        <div
          key={item.title}
          className={`${tokens.soft} rounded-[24px] border p-4`}
          style={index === 0 ? { background: dark ? "linear-gradient(120deg, rgba(15,98,254,0.14), rgba(190,149,255,0.04))" : "linear-gradient(120deg, rgba(15,98,254,0.08), rgba(190,149,255,0.03))" } : undefined}
        >
          <div className="text-xs font-semibold">{item.title}</div>
          <div className={`mt-2 text-xs leading-6 ${tokens.muted}`}>{item.body}</div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <SurfaceIntro
        dark={dark}
        tone="mixed"
        eyebrow={<><VaultMark size={16} /><span>{ui.labels.studyHub}</span></>}
        title={examGuide.title}
        body={examGuide.summary}
        actions={
          <>
            <button
              onClick={onOpenMindMap}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white transition hover:opacity-95"
              style={{ backgroundColor: "var(--ibm-blue-60)" }}
            >
              {ui.actions.openMindMap}
              <ArrowRight size={14} />
            </button>
            <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${tokens.chip}`}>
              <Compass size={14} />
              {ui.labels.recommendedFlow}
            </div>
          </>
        }
        stats={[
          <SurfaceStat key="domains" dark={dark} label={ui.labels.domain} value={`${domains.length}`} body={ui.labels.nineDomains} />,
          <SurfaceStat key="objectives" dark={dark} label={ui.labels.objectiveGuide} value={`${domains.flatMap((domain) => domain.objectives).length}`} body={ui.labels.fortyObjectives} tone="purple" />,
          <SurfaceStat key="links" dark={dark} label={ui.labels.officialStudyLinks} value={`${examGuide.officialLinks.length}`} body={ui.labels.crossCheckGuide} tone="blue" />,
        ]}
        aside={introAside}
      />

      <section className="grid gap-5 xl:grid-cols-2">
        <SurfaceCard dark={dark}>
          <SurfaceKicker tone="blue">
            <Sparkles size={13} />
            {ui.labels.howToStudy}
          </SurfaceKicker>
          <div className="display-font mt-3 text-3xl font-semibold">{ui.labels.recommendedFlow}</div>
          <div className={`mt-3 text-sm leading-7 ${tokens.muted}`}>{ui.home.routeOneBody}</div>
          <div className="mt-6 grid gap-3">
            {examGuide.studyFlow.map((step, index) => (
              <div key={step.title} className={`${tokens.soft} rounded-[24px] border p-4`}>
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--ibm-blue-30)" }}>
                  {ui.labels.pass} {index + 1}
                </div>
                <div className="mt-2 text-sm font-semibold">{step.title}</div>
                <div className={`mt-2 text-xs leading-6 ${tokens.muted}`}>{step.body}</div>
              </div>
            ))}
          </div>
        </SurfaceCard>

        <SurfaceCard dark={dark}>
          <SurfaceKicker tone="purple">
            <Map size={13} />
            {ui.labels.mindMapRoutes}
          </SurfaceKicker>
          <div className="display-font mt-3 text-3xl font-semibold">{ui.labels.mapExamChain}</div>
          <div className={`mt-3 text-sm leading-7 ${tokens.muted}`}>{ui.labels.mapIntroBody}</div>
          <div className="mt-6 grid gap-3">
            {examGuide.connectionMap.map((item, index) => (
              <div
                key={item.title}
                className={`${tokens.soft} rounded-[24px] border p-4`}
                style={index === 0 ? { borderLeft: "3px solid var(--ibm-purple-40)" } : undefined}
              >
                <div className="text-sm font-semibold">{item.title}</div>
                <div className={`mt-2 text-xs leading-6 ${tokens.muted}`}>{item.body}</div>
              </div>
            ))}
          </div>
        </SurfaceCard>
      </section>

      <SurfaceCard dark={dark}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <SurfaceKicker tone="blue">{ui.labels.officialStudyLinks}</SurfaceKicker>
            <div className="display-font mt-3 text-3xl font-semibold">{ui.labels.crossCheckGuide}</div>
          </div>
          <div className={`max-w-xl text-sm leading-7 ${tokens.muted}`}>{ui.labels.builtFor} · {ui.labels.contentBasedOn}</div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {examGuide.officialLinks.map((link) => (
            <SurfaceLink key={link.href} dark={dark} href={link.href} icon={<ExternalLink size={12} />}>
              {link.label}
            </SurfaceLink>
          ))}
        </div>
      </SurfaceCard>

      <section className="space-y-4">
        {domains.map((domain) => {
          const guide = domainGuides[domain.id];
          const progress = domainProgress(domain);
          const done = domain.objectives.filter((objective) => studied[objective.id]).length;

          return (
            <article
              key={domain.id}
              className={`${tokens.panel} overflow-hidden rounded-[32px] border`}
              style={{
                background: dark
                  ? `linear-gradient(120deg, rgba(15,98,254,0.04), rgba(255,255,255,0.02)), linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.02))`
                  : `linear-gradient(120deg, rgba(15,98,254,0.03), rgba(255,255,255,0.95))`,
              }}
            >
              <div className="grid gap-5 p-5 md:p-6 xl:grid-cols-[1.05fr_0.95fr]">
                <div>
                  <div className="flex items-start gap-3 flex-wrap">
                    <div className="text-3xl">{domain.icon}</div>
                    <div className="min-w-[220px] flex-1">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: domain.color }}>
                        {ui.labels.domain} {domain.id}
                      </div>
                      <div className="display-font mt-2 text-2xl font-semibold">{domain.label}</div>
                      <p className={`mt-3 text-sm leading-7 ${tokens.muted}`}>{guide.focus}</p>
                    </div>

                    <div className="min-w-[210px]">
                      <div className={`mb-2 flex items-center justify-between text-[11px] ${tokens.muted}`}>
                        <span>{ui.labels.studiedProgress(done, domain.objectives.length)}</span>
                        <span className="font-semibold" style={{ color: domain.color }}>{progress}%</span>
                      </div>
                      <div className={`h-1.5 overflow-hidden rounded-full ${tokens.track}`}>
                        <div className="h-full rounded-full" style={{ width: `${progress}%`, background: domain.color }} />
                      </div>
                      <button
                        onClick={() => onOpenDomain(domain)}
                        className="mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white transition hover:opacity-95"
                        style={{ backgroundColor: domain.color }}
                      >
                        {ui.actions.openDomainNotes}
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-2">
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
                      <div className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--ibm-purple-40)" }}>
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
                </div>

                <div>
                  <div className={`${tokens.soft} rounded-[28px] border p-4`}>
                    <SurfaceKicker tone="blue">{ui.labels.objectiveGuide}</SurfaceKicker>
                    <div className="mt-4 grid gap-3">
                      {domain.objectives.map((objective) => {
                        const note = objectiveGuide[objective.id];
                        return (
                          <div
                            key={objective.id}
                            className={`${tokens.inset} rounded-[22px] border p-4`}
                            style={{ borderLeft: `3px solid ${domain.color}` }}
                          >
                            <div className="flex items-start gap-3">
                              <span className="text-xs font-bold mt-0.5" style={{ color: domain.color }}>{objective.id}</span>
                              <div className="min-w-0 flex-1">
                                <div className="text-sm font-semibold leading-6">{objective.title}</div>
                                <div className={`mt-2 text-[11px] leading-6 ${tokens.muted}`}>{note?.remember ?? objective.tip}</div>
                              </div>
                              {studied[objective.id] ? <CheckCircle2 size={16} className="text-green-500 mt-0.5" /> : null}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {guide.resources.map((resource) => (
                      <SurfaceLink key={resource.href} dark={dark} href={resource.href} icon={<ExternalLink size={12} />}>
                        {resource.label}
                      </SurfaceLink>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
