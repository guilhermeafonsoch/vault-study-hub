import { ArrowRight, CheckCircle2, ExternalLink } from "lucide-react";
import { useLocale } from "../i18n/LocaleContext.jsx";

export default function StudyGuide({ dark, studied, onOpenDomain, onOpenMindMap, domainProgress }) {
  const { domains, domainGuides, examGuide, objectiveGuide, ui } = useLocale();
  const panel = dark ? "bg-ink-600 border-ink-400" : "bg-white border-gray-200";
  const muted = dark ? "text-gray-400" : "text-gray-500";
  const subtle = dark ? "bg-ink-800/80" : "bg-gray-50";

  return (
    <div className="space-y-6 animate-fade-in">
      <section
        className={`${panel} border rounded-[28px] overflow-hidden`}
        style={{
          background: dark
            ? "linear-gradient(135deg, rgba(127,119,221,0.14), rgba(29,158,117,0.10) 45%, rgba(216,90,48,0.14))"
            : "linear-gradient(135deg, rgba(127,119,221,0.08), rgba(29,158,117,0.05) 45%, rgba(216,90,48,0.08))",
        }}
      >
        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr] p-6 md:p-8">
          <div>
            <div className="text-[11px] font-bold tracking-[0.18em] text-emerald-500 uppercase">{ui.labels.studyHub}</div>
            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mt-2 mb-3">{examGuide.title}</h1>
            <p className={`max-w-3xl text-sm leading-7 ${muted}`}>{examGuide.summary}</p>

            <div className="flex flex-wrap gap-2 mt-5">
              <span className={`text-[11px] px-2.5 py-1 rounded-full border ${panel}`}>Vault 1.16</span>
              <span className={`text-[11px] px-2.5 py-1 rounded-full border ${panel}`}>{ui.labels.hourExam}</span>
              <span className={`text-[11px] px-2.5 py-1 rounded-full border ${panel}`}>{ui.labels.onlineProctored}</span>
              <span className={`text-[11px] px-2.5 py-1 rounded-full border ${panel}`}>{ui.labels.nineDomains}</span>
              <span className={`text-[11px] px-2.5 py-1 rounded-full border ${panel}`}>{ui.labels.fortyObjectives}</span>
            </div>

            <div className="flex flex-wrap gap-2 mt-5">
              <button
                onClick={onOpenMindMap}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 text-sm font-semibold transition"
              >
                {ui.actions.openMindMap} <ArrowRight size={14} />
              </button>
              <div className={`text-xs leading-6 px-3 py-2 rounded-2xl ${subtle} ${muted}`}>
                {ui.labels.recommendedFlow}
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            {examGuide.highlights.map((item) => (
              <div key={item.title} className={`${subtle} border ${dark ? "border-ink-400" : "border-gray-200"} rounded-2xl p-4`}>
                <div className="text-xs font-semibold mb-1">{item.title}</div>
                <div className={`text-xs leading-6 ${muted}`}>{item.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className={`${panel} border rounded-3xl p-5`}>
          <div className="text-lg font-bold mb-3">{ui.labels.howToStudy}</div>
          <div className="space-y-3">
            {examGuide.studyFlow.map((step, index) => (
              <div key={step.title} className={`${subtle} border ${dark ? "border-ink-400" : "border-gray-200"} rounded-2xl p-4`}>
                <div className="text-[11px] font-bold tracking-wide text-emerald-500 uppercase">{ui.labels.pass} {index + 1}</div>
                <div className="text-sm font-semibold mt-1">{step.title}</div>
                <div className={`text-xs leading-6 mt-1 ${muted}`}>{step.body}</div>
              </div>
            ))}
          </div>
        </div>

        <div className={`${panel} border rounded-3xl p-5`}>
          <div className="text-lg font-bold mb-3">{ui.labels.mindMapRoutes}</div>
          <div className="space-y-3">
            {examGuide.connectionMap.map((item) => (
              <div key={item.title} className={`${subtle} border ${dark ? "border-ink-400" : "border-gray-200"} rounded-2xl p-4`}>
                <div className="text-sm font-semibold">{item.title}</div>
                <div className={`text-xs leading-6 mt-1 ${muted}`}>{item.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${panel} border rounded-3xl p-5`}>
        <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
          <div>
            <div className="text-lg font-bold">{ui.labels.officialStudyLinks}</div>
            <div className={`text-xs ${muted}`}>{ui.labels.crossCheckGuide}</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {examGuide.officialLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className={`inline-flex items-center gap-2 text-xs px-3 py-2 rounded-full border ${dark ? "border-ink-400 bg-ink-800 hover:bg-ink-700" : "border-gray-200 bg-gray-50 hover:bg-gray-100"} transition`}
            >
              {link.label} <ExternalLink size={12} />
            </a>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        {domains.map((domain) => {
          const guide = domainGuides[domain.id];
          const progress = domainProgress(domain);
          const done = domain.objectives.filter((objective) => studied[objective.id]).length;

          return (
            <article key={domain.id} className={`${panel} border rounded-3xl p-5`}>
              <div className="flex items-start gap-3 flex-wrap">
                <div className="text-3xl">{domain.icon}</div>
                <div className="flex-1 min-w-[240px]">
                  <div className="text-[11px] font-bold tracking-wide uppercase" style={{ color: domain.color }}>
                    {ui.labels.domain} {domain.id}
                  </div>
                  <div className="text-xl font-bold">{domain.label}</div>
                  <p className={`text-sm leading-7 mt-2 ${muted}`}>{guide.focus}</p>
                </div>

                <div className="min-w-[180px]">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className={muted}>{ui.labels.studiedProgress(done, domain.objectives.length)}</span>
                    <span style={{ color: domain.color }} className="font-semibold">{progress}%</span>
                  </div>
                  <div className={`h-1.5 rounded-full overflow-hidden ${dark ? "bg-ink-800" : "bg-gray-100"}`}>
                    <div className="h-full rounded-full" style={{ width: `${progress}%`, background: domain.color }} />
                  </div>
                  <button
                    onClick={() => onOpenDomain(domain)}
                    className={`mt-3 w-full inline-flex items-center justify-center gap-2 rounded-full px-3 py-2 text-xs font-semibold border transition ${dark ? "border-ink-400 bg-ink-800 hover:bg-ink-700" : "border-gray-200 bg-gray-50 hover:bg-gray-100"}`}
                  >
                    {ui.actions.openDomainNotes} <ArrowRight size={12} />
                  </button>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2 mt-5">
                <div className={`${subtle} border ${dark ? "border-ink-400" : "border-gray-200"} rounded-2xl p-4`}>
                  <div className="text-xs font-semibold mb-2">{ui.labels.mentalModel}</div>
                  <div className="space-y-2">
                    {guide.mentalModel.map((item) => (
                      <div key={item} className={`text-xs leading-6 pl-3 ${muted}`} style={{ borderLeft: `2px solid ${domain.color}55` }}>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`${subtle} border ${dark ? "border-ink-400" : "border-gray-200"} rounded-2xl p-4`}>
                  <div className="text-xs font-semibold mb-2">{ui.labels.commonTraps}</div>
                  <div className="space-y-2">
                    {guide.commonTraps.map((item) => (
                      <div key={item} className={`text-xs leading-6 pl-3 ${muted}`} style={{ borderLeft: "2px solid #eab308" }}>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <div className="text-sm font-bold mb-3">{ui.labels.objectiveGuide}</div>
                <div className="grid gap-3 lg:grid-cols-2">
                  {domain.objectives.map((objective) => {
                    const note = objectiveGuide[objective.id];
                    return (
                      <div
                        key={objective.id}
                        className={`${subtle} border ${dark ? "border-ink-400" : "border-gray-200"} rounded-2xl p-4`}
                        style={{ borderTop: `3px solid ${domain.color}` }}
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-xs font-bold mt-0.5" style={{ color: domain.color }}>{objective.id}</span>
                          <div className="flex-1">
                            <div className="text-sm font-semibold leading-6">{objective.title}</div>
                            <div className={`text-[11px] leading-6 mt-1 ${muted}`}>{note?.remember ?? objective.tip}</div>
                          </div>
                          {studied[objective.id] && <CheckCircle2 size={16} className="text-green-500 flex-shrink-0 mt-0.5" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-5">
                {guide.resources.map((resource) => (
                  <a
                    key={resource.href}
                    href={resource.href}
                    target="_blank"
                    rel="noreferrer"
                    className={`inline-flex items-center gap-2 text-[11px] px-3 py-2 rounded-full border ${dark ? "border-ink-400 bg-ink-800 hover:bg-ink-700" : "border-gray-200 bg-gray-50 hover:bg-gray-100"} transition`}
                  >
                    {resource.label} <ExternalLink size={12} />
                  </a>
                ))}
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
