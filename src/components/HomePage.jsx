import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Brain,
  Compass,
  FileText,
  LayoutGrid,
  Map,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { useMemo } from "react";
import { getQuestionDomain } from "../data/quiz.js";
import { useLocale } from "../i18n/LocaleContext.jsx";

const SURFACE_STYLES = {
  guide: "lg:col-span-7",
  quiz: "lg:col-span-5",
  map: "lg:col-span-4",
  grid: "lg:col-span-4",
  cheat: "lg:col-span-4",
  flash: "lg:col-span-6",
  stats: "lg:col-span-6",
};

const SURFACE_GRADIENTS = {
  guide: "linear-gradient(135deg, rgba(127,119,221,0.18), rgba(29,158,117,0.10) 55%, rgba(15,17,23,0.02))",
  quiz: "linear-gradient(135deg, rgba(216,90,48,0.20), rgba(127,119,221,0.08) 70%, rgba(15,17,23,0.02))",
  map: "linear-gradient(135deg, rgba(29,158,117,0.18), rgba(15,17,23,0.02))",
  grid: "linear-gradient(135deg, rgba(55,138,221,0.18), rgba(15,17,23,0.02))",
  cheat: "linear-gradient(135deg, rgba(186,117,23,0.18), rgba(15,17,23,0.02))",
  flash: "linear-gradient(135deg, rgba(216,83,126,0.18), rgba(15,17,23,0.02))",
  stats: "linear-gradient(135deg, rgba(99,153,34,0.18), rgba(15,17,23,0.02))",
};

const VIEW_ICONS = {
  guide: FileText,
  map: Map,
  grid: LayoutGrid,
  cheat: BookOpen,
  flash: Zap,
  quiz: Brain,
  stats: BarChart3,
};

export default function HomePage({ dark, studied, domainProgress, onOpenDomain, onSelectView }) {
  const { domains, quiz, totalObjectives, domainGuides, ui } = useLocale();
  const studiedCount = Object.values(studied).filter(Boolean).length;
  const reviewCount = quiz.filter((question) => getQuestionDomain(question) === "review").length;

  const questionCountsByDomain = useMemo(
    () =>
      Object.fromEntries(
        domains.map((domain) => [
          domain.id,
          quiz.filter((question) => getQuestionDomain(question) === String(domain.id)).length,
        ])
      ),
    [domains, quiz]
  );

  const nextFocusDomains = useMemo(
    () =>
      [...domains]
        .sort((left, right) => {
          const leftProgress = domainProgress(left);
          const rightProgress = domainProgress(right);
          if (leftProgress === rightProgress) return left.id - right.id;
          return leftProgress - rightProgress;
        })
        .slice(0, 3),
    [domainProgress, domains]
  );

  const surfaceCards = [
    {
      view: "guide",
      metric: `${totalObjectives}`,
      detail: ui.labels.fortyObjectives,
    },
    {
      view: "quiz",
      metric: `${quiz.length}`,
      detail: reviewCount ? `${reviewCount} ${ui.labels.mixedReview.toLowerCase()}` : ui.home.questionBankNote,
    },
    {
      view: "map",
      metric: ui.labels.nineDomains,
      detail: ui.labels.mapExamChain,
    },
    {
      view: "grid",
      metric: ui.labels.objectiveGuide,
      detail: ui.labels.domainProgress,
    },
    {
      view: "cheat",
      metric: ui.labels.remember,
      detail: ui.labels.examTip,
    },
    {
      view: "flash",
      metric: ui.labels.buildingRecall,
      detail: ui.labels.flashcardHint,
    },
    {
      view: "stats",
      metric: `${studiedCount}/${totalObjectives}`,
      detail: ui.home.localProgressNote,
    },
  ];

  const panel = dark ? "bg-ink-600 border-ink-400 text-gray-100" : "bg-white border-gray-200 text-gray-900";
  const muted = dark ? "text-gray-400" : "text-gray-500";
  const subtle = dark ? "bg-ink-800/90" : "bg-gray-50";
  const ghost = dark ? "bg-ink-700/90 border-ink-400 hover:bg-ink-700" : "bg-white/80 border-gray-200 hover:bg-white";
  const outline = dark ? "border-ink-400 bg-ink-700/60" : "border-gray-200 bg-white/70";

  return (
    <div className="space-y-6 animate-fade-in">
      <section
        className={`${panel} border rounded-[32px] overflow-hidden relative`}
        style={{
          background: dark
            ? "linear-gradient(145deg, rgba(15,17,23,0.98), rgba(19,21,31,0.96))"
            : "linear-gradient(145deg, rgba(255,255,255,0.98), rgba(247,248,252,0.95))",
        }}
      >
        <div
          className="absolute inset-0 opacity-80"
          style={{
            backgroundImage: dark
              ? "radial-gradient(circle at 12% 18%, rgba(127,119,221,0.30), transparent 34%), radial-gradient(circle at 82% 12%, rgba(29,158,117,0.20), transparent 28%), radial-gradient(circle at 72% 80%, rgba(216,90,48,0.16), transparent 24%), linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)"
              : "radial-gradient(circle at 12% 18%, rgba(127,119,221,0.16), transparent 34%), radial-gradient(circle at 82% 12%, rgba(29,158,117,0.14), transparent 28%), radial-gradient(circle at 72% 80%, rgba(216,90,48,0.12), transparent 24%), linear-gradient(rgba(15,17,23,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(15,17,23,0.04) 1px, transparent 1px)",
            backgroundSize: "auto, auto, auto, 32px 32px, 32px 32px",
          }}
        />

        <div className="relative grid gap-6 lg:grid-cols-[1.12fr_0.88fr] p-6 md:p-8 xl:p-10">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-bold tracking-[0.22em] uppercase text-emerald-400">
              <Sparkles size={12} />
              {ui.home.eyebrow}
            </div>

            <div className="max-w-4xl">
              <h1 className="display-font text-4xl font-bold leading-tight md:text-5xl md:leading-[1.02]">
                {ui.home.title}
              </h1>
              <p className={`mt-4 max-w-3xl text-sm leading-7 ${muted}`}>{ui.home.intro}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onSelectView("guide")}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-400"
              >
                {ui.home.primaryCta} <ArrowRight size={14} />
              </button>
              <button
                onClick={() => onSelectView("quiz")}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${ghost}`}
              >
                {ui.home.secondaryCta} <Brain size={14} />
              </button>
              <button
                onClick={() => onSelectView("grid")}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${ghost}`}
              >
                {ui.home.tertiaryCta} <Compass size={14} />
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <MetricCard
                dark={dark}
                icon={Target}
                label={ui.home.questionBank}
                value={`${quiz.length}`}
                body={`${ui.home.questionBankNote} ${reviewCount ? `(${reviewCount} ${ui.labels.mixedReview.toLowerCase()})` : ""}`.trim()}
              />
              <MetricCard
                dark={dark}
                icon={ShieldCheck}
                label={ui.home.localProgress}
                value={`${studiedCount}/${totalObjectives}`}
                body={ui.home.localProgressNote}
              />
              <MetricCard
                dark={dark}
                icon={FileText}
                label={ui.home.objectiveDepth}
                value={ui.labels.fortyObjectives}
                body={ui.home.objectiveDepthNote}
              />
            </div>
          </div>

          <div className="grid gap-3">
            <div className={`${subtle} border ${dark ? "border-ink-400" : "border-gray-200"} rounded-[28px] p-5`}>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-500">
                <Compass size={14} />
                {ui.home.snapshotTitle}
              </div>
              <p className={`mt-3 text-sm leading-7 ${muted}`}>{ui.home.snapshotBody}</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <SnapshotPill dark={dark} label={ui.labels.nineDomains} />
                <SnapshotPill dark={dark} label={ui.labels.fortyObjectives} />
                <SnapshotPill dark={dark} label="Vault 1.16" />
                <SnapshotPill dark={dark} label={ui.labels.language} />
              </div>
            </div>

            <div className={`${subtle} border ${dark ? "border-ink-400" : "border-gray-200"} rounded-[28px] p-5`}>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-violet-400">
                <Target size={14} />
                {ui.home.nextFocusTitle}
              </div>
              <p className={`mt-3 text-sm leading-7 ${muted}`}>{ui.home.nextFocusBody}</p>
              <div className="mt-4 space-y-2">
                {nextFocusDomains.map((domain) => (
                  <button
                    key={domain.id}
                    onClick={() => onOpenDomain(domain)}
                    className={`w-full rounded-2xl border px-3 py-3 text-left transition ${outline}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{domain.icon}</span>
                      <div className="flex-1">
                        <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: domain.color }}>
                          {ui.labels.domain} {domain.id}
                        </div>
                        <div className="text-sm font-semibold">{domain.label}</div>
                      </div>
                      <div className="text-xs font-semibold" style={{ color: domain.color }}>
                        {domainProgress(domain)}%
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`${panel} border rounded-[32px] p-5 md:p-6`}>
        <div className="flex items-start justify-between gap-4 flex-wrap mb-5">
          <div>
            <div className="display-font text-2xl font-bold">{ui.home.studySurfacesTitle}</div>
            <p className={`mt-2 max-w-3xl text-sm leading-7 ${muted}`}>{ui.home.studySurfacesBody}</p>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-12">
          {surfaceCards.map((surface) => {
            const Icon = VIEW_ICONS[surface.view];
            return (
              <button
                key={surface.view}
                onClick={() => onSelectView(surface.view)}
                className={`${SURFACE_STYLES[surface.view]} rounded-[28px] border p-5 text-left transition hover:-translate-y-0.5 hover:shadow-xl ${dark ? "border-ink-400" : "border-gray-200"}`}
                style={{ background: SURFACE_GRADIENTS[surface.view] }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <Icon size={18} />
                  </div>
                  <ArrowRight size={16} className={muted} />
                </div>
                <div className="mt-5">
                  <div className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-400">
                    {ui.views[surface.view]}
                  </div>
                  <div className="display-font mt-2 text-2xl font-bold leading-tight">{surface.metric}</div>
                  <div className="mt-2 text-sm font-semibold">{ui.home.modes[surface.view]}</div>
                  <div className={`mt-3 text-xs leading-6 ${muted}`}>{surface.detail}</div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div className={`${panel} border rounded-[32px] p-5 md:p-6`}>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-500">
            <Compass size={14} />
            {ui.home.routesTitle}
          </div>
          <div className="mt-4 space-y-3">
            <RouteCard dark={dark} title={ui.home.routeOneTitle} body={ui.home.routeOneBody} />
            <RouteCard dark={dark} title={ui.home.routeTwoTitle} body={ui.home.routeTwoBody} />
            <RouteCard dark={dark} title={ui.home.routeThreeTitle} body={ui.home.routeThreeBody} />
          </div>
        </div>

        <div className={`${panel} border rounded-[32px] p-5 md:p-6`}>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-violet-400">
            <ShieldCheck size={14} />
            {ui.home.persistenceTitle}
          </div>
          <p className={`mt-4 text-sm leading-7 ${muted}`}>{ui.home.persistenceBody}</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className={`${subtle} rounded-2xl border ${dark ? "border-ink-400" : "border-gray-200"} p-4`}>
              <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-500">
                {ui.home.localProgress}
              </div>
              <div className="display-font mt-2 text-2xl font-bold">{studiedCount}/{totalObjectives}</div>
              <div className={`mt-2 text-xs leading-6 ${muted}`}>{ui.labels.localOnlyStats}</div>
            </div>
            <div className={`${subtle} rounded-2xl border ${dark ? "border-ink-400" : "border-gray-200"} p-4`}>
              <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-violet-400">
                {ui.home.questionBank}
              </div>
              <div className="display-font mt-2 text-2xl font-bold">{quiz.length}</div>
              <div className={`mt-2 text-xs leading-6 ${muted}`}>{ui.home.questionBankNote}</div>
            </div>
          </div>
        </div>
      </section>

      <section className={`${panel} border rounded-[32px] p-5 md:p-6`}>
        <div className="flex items-start justify-between gap-3 flex-wrap mb-5">
          <div>
            <div className="display-font text-2xl font-bold">{ui.home.domainsTitle}</div>
            <p className={`mt-2 max-w-3xl text-sm leading-7 ${muted}`}>{ui.home.domainsBody}</p>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-3">
          {domains.map((domain) => (
            <button
              key={domain.id}
              onClick={() => onOpenDomain(domain)}
              className={`rounded-[28px] border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-lg ${dark ? "border-ink-400 bg-ink-700/80" : "border-gray-200 bg-white"}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{domain.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: domain.color }}>
                    {ui.labels.domain} {domain.id}
                  </div>
                  <div className="text-sm font-semibold leading-6">{domain.label}</div>
                </div>
                <div className="text-xs font-semibold" style={{ color: domain.color }}>
                  {domainProgress(domain)}%
                </div>
              </div>

              <p className={`mt-3 text-xs leading-6 ${muted}`}>{domain.summary}</p>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className={`rounded-full border px-2.5 py-1 text-[11px] ${outline}`}>
                  {ui.home.questionsForDomain(questionCountsByDomain[domain.id] ?? 0)}
                </span>
                <span className={`rounded-full border px-2.5 py-1 text-[11px] ${outline}`}>
                  {ui.labels.objectiveCount(domain.objectives.length)}
                </span>
              </div>

              <div className={`mt-4 text-[11px] leading-6 ${muted}`}>
                <span className="font-semibold text-amber-500">{ui.labels.watchFor}:</span> {domainGuides[domain.id]?.commonTraps?.[0] ?? domain.summary}
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <div className={`h-1.5 flex-1 rounded-full ${dark ? "bg-ink-800" : "bg-gray-100"} overflow-hidden`}>
                  <div className="h-full rounded-full" style={{ width: `${domainProgress(domain)}%`, background: domain.color }} />
                </div>
                <span className="text-xs font-semibold" style={{ color: domain.color }}>
                  {ui.home.openDomain}
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function MetricCard({ dark, icon: Icon, label, value, body }) {
  return (
    <div className={`rounded-[28px] border p-4 ${dark ? "border-ink-400 bg-ink-700/75" : "border-gray-200 bg-white/85"}`}>
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-violet-400">
        <Icon size={14} />
        {label}
      </div>
      <div className="display-font mt-3 text-2xl font-bold leading-none">{value}</div>
      <div className={`mt-2 text-xs leading-6 ${dark ? "text-gray-400" : "text-gray-500"}`}>{body}</div>
    </div>
  );
}

function SnapshotPill({ dark, label }) {
  return (
    <div className={`rounded-full border px-3 py-2 text-xs font-medium ${dark ? "border-ink-400 bg-ink-700/70 text-gray-200" : "border-gray-200 bg-white text-gray-700"}`}>
      {label}
    </div>
  );
}

function RouteCard({ dark, title, body }) {
  return (
    <div className={`rounded-[26px] border p-4 ${dark ? "border-ink-400 bg-ink-700/75" : "border-gray-200 bg-white/90"}`}>
      <div className="text-sm font-semibold">{title}</div>
      <div className={`mt-2 text-xs leading-6 ${dark ? "text-gray-400" : "text-gray-500"}`}>{body}</div>
    </div>
  );
}
