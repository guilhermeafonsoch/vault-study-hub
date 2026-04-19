import { CheckCircle2, Gauge } from "lucide-react";
import { getQuestionDomain } from "../data/quiz.js";
import { SurfaceCard, SurfaceIntro, SurfaceKicker, SurfaceStat, getSurfaceTokens } from "./SurfacePrimitives.jsx";
import { useLocale } from "../i18n/LocaleContext.jsx";

export default function StatsDashboard({ studied, dark }) {
  const { domains, quiz, totalObjectives, ui } = useLocale();
  const tokens = getSurfaceTokens(dark);
  const studiedCount = Object.values(studied).filter(Boolean).length;
  const pct = Math.round((studiedCount / totalObjectives) * 100);
  const readiness = pct < 30 ? ui.labels.foundations : pct < 60 ? ui.labels.buildingRecall : pct < 85 ? ui.labels.solidCoverage : ui.labels.finalReview;
  const ring = 2 * Math.PI * 70;
  const offset = ring * (1 - pct / 100);
  const quizCoverage = new Set(quiz.map((question) => question.obj)).size;
  const quizPct = Math.round((quizCoverage / totalObjectives) * 100);
  const accent = pct >= 85 ? "#24a148" : pct >= 50 ? "#f1c21b" : "var(--ibm-purple-40)";

  return (
    <div className="space-y-6 animate-fade-in">
      <SurfaceIntro
        dark={dark}
        tone="blue"
        eyebrow={ui.views.stats}
        title={ui.labels.localOnlyStats}
        body={ui.home.modes.stats}
        stats={[
          <SurfaceStat key="progress" dark={dark} label={ui.labels.studied} value={`${studiedCount}/${totalObjectives}`} body={ui.labels.studiedProgress(studiedCount, totalObjectives)} />,
          <SurfaceStat key="coverage" dark={dark} label={ui.labels.quizCoverage} value={`${quizCoverage}/${totalObjectives}`} body={ui.labels.quizCoverageCount(quizCoverage, totalObjectives, quizPct)} tone="purple" />,
          <SurfaceStat key="readiness" dark={dark} label={ui.labels.finalReview} value={`${pct}%`} body={readiness} />,
        ]}
      />

      <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <SurfaceCard dark={dark}>
          <SurfaceKicker tone="blue">
            <Gauge size={13} />
            {ui.labels.domainProgress}
          </SurfaceKicker>
          <div className="flex flex-col items-center justify-center pt-6">
            <svg width={190} height={190}>
              <circle cx={95} cy={95} r={70} fill="none" stroke={dark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.10)"} strokeWidth={10} />
              <circle
                cx={95}
                cy={95}
                r={70}
                fill="none"
                stroke={accent}
                strokeWidth={10}
                strokeLinecap="round"
                strokeDasharray={ring}
                strokeDashoffset={offset}
                transform="rotate(-90 95 95)"
                style={{ transition: "stroke-dashoffset 0.8s ease" }}
              />
              <text x={95} y={90} textAnchor="middle" fontSize={32} fontWeight={800} fill={dark ? "#fff" : "#111"}>{pct}%</text>
              <text x={95} y={114} textAnchor="middle" fontSize={11} fill={dark ? "#a2a9b0" : "#525252"}>{studiedCount} / {totalObjectives}</text>
            </svg>
            <div className="display-font mt-3 text-2xl font-semibold" style={{ color: accent }}>{readiness}</div>
            <div className={`mt-2 text-center text-xs leading-6 ${tokens.muted}`}>{ui.labels.localOnlyStats}</div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <div className={`${tokens.soft} rounded-[22px] border p-4`}>
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--ibm-blue-30)" }}>
                {ui.labels.objectiveCoverage}
              </div>
              <div className="mt-2 text-lg font-semibold">{ui.labels.coverageFull(totalObjectives, totalObjectives)}</div>
              <div className={`mt-2 text-xs leading-6 ${tokens.muted}`}>{ui.labels.localProgress}</div>
            </div>
            <div className={`${tokens.soft} rounded-[22px] border p-4`}>
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--ibm-purple-40)" }}>
                {ui.labels.quizCoverage}
              </div>
              <div className="mt-2 text-lg font-semibold">{ui.labels.quizCoverageCount(quizCoverage, totalObjectives, quizPct)}</div>
              <div className={`mt-2 text-xs leading-6 ${tokens.muted}`}>{ui.labels.singleAnswerMode}</div>
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard dark={dark}>
          <SurfaceKicker tone="purple">{ui.labels.domainProgress}</SurfaceKicker>
          <div className="mt-6 space-y-4">
            {domains.map((domain) => {
              const done = domain.objectives.filter((objective) => studied[objective.id]).length;
              const progress = Math.round((done / domain.objectives.length) * 100);
              const quizCount = quiz.filter((question) => getQuestionDomain(question) === String(domain.id)).length;

              return (
                <div key={domain.id} className={`${tokens.soft} rounded-[24px] border p-4`}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{domain.icon}</span>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold">D{domain.id} {domain.label}</div>
                      <div className={`mt-1 text-[11px] ${tokens.muted}`}>{ui.labels.quizCoverageByDomain(quizCount)}</div>
                    </div>
                    <div className="text-sm font-semibold" style={{ color: domain.color }}>{progress}%</div>
                    {progress === 100 ? <CheckCircle2 size={14} className="text-green-500" /> : null}
                  </div>
                  <div className={`mt-3 h-1.5 overflow-hidden rounded-full ${tokens.track}`}>
                    <div className="h-full rounded-full" style={{ width: `${progress}%`, background: domain.color }} />
                  </div>
                  <div className={`mt-3 flex items-center justify-between text-[11px] ${tokens.muted}`}>
                    <span>{done}/{domain.objectives.length}</span>
                    <span>{quizCount}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </SurfaceCard>
      </section>
    </div>
  );
}
