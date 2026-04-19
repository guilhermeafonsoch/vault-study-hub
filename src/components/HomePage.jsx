import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Brain,
  Compass,
  FileText,
  LayoutGrid,
  Map,
  MoveUpRight,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { useMemo } from "react";
import { getQuestionDomain } from "../data/quiz.js";
import { useLocale } from "../i18n/LocaleContext.jsx";
import { VaultHeroGraphic, VaultMark } from "./BrandMarks.jsx";

const VIEW_ICONS = {
  guide: FileText,
  map: Map,
  grid: LayoutGrid,
  cheat: BookOpen,
  flash: Zap,
  quiz: Brain,
  stats: BarChart3,
};

const VIEW_ORDER = ["guide", "quiz", "map", "flash", "grid", "cheat", "stats"];
const VIEW_TONES = {
  guide: "var(--ibm-blue-60)",
  quiz: "var(--ibm-purple-40)",
  map: "var(--ibm-blue-80)",
  flash: "var(--ibm-purple-40)",
  grid: "var(--ibm-blue-60)",
  cheat: "var(--ibm-purple-80)",
  stats: "var(--ibm-blue-80)",
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
        .slice(0, 4),
    [domainProgress, domains]
  );

  const surfaces = VIEW_ORDER.map((view) => ({
    view,
    icon: VIEW_ICONS[view],
    label: ui.views[view],
    tone: VIEW_TONES[view],
    detail: ui.home.modes[view],
    metric:
      view === "guide" ? `${totalObjectives} ${ui.labels.objectives}` :
        view === "quiz" ? `${quiz.length} ${ui.labels.question.toLowerCase()}s` :
          view === "map" ? ui.labels.nineDomains :
            view === "flash" ? ui.labels.buildingRecall :
              view === "grid" ? ui.labels.objectiveGuide :
                view === "cheat" ? ui.labels.examTip :
                  `${studiedCount}/${totalObjectives}`,
    subdetail:
      view === "quiz"
        ? reviewCount
          ? `${reviewCount} ${ui.labels.mixedReview.toLowerCase()}`
          : ui.home.questionBankNote
        : view === "stats"
          ? ui.home.localProgressNote
          : view === "map"
            ? ui.labels.mapExamChain
            : view === "grid"
              ? ui.home.domainsBody
              : view === "cheat"
                ? ui.labels.remember
                : view === "flash"
                  ? ui.labels.flashcardHint
                  : ui.home.objectiveDepthNote,
  }));

  const shell = dark ? "border-white/10 bg-[#0a0f18] text-gray-100" : "border-black/10 bg-white text-gray-900";
  const muted = dark ? "text-[#a2a9b0]" : "text-[#525252]";
  const chip = dark ? "border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06]" : "border-black/10 bg-white text-gray-900 hover:bg-[#f7f9fc]";

  return (
    <div className="space-y-6 animate-fade-in">
      <section
        className={`${shell} relative overflow-hidden rounded-[36px] border`}
        style={{
          background: dark
            ? "linear-gradient(160deg, rgba(0, 0, 0, 0.98), rgba(10, 15, 24, 0.96))"
            : "linear-gradient(160deg, rgba(255,255,255,0.98), rgba(242,244,248,0.98))",
        }}
      >
        <div className="absolute inset-x-0 top-0 h-1 ibm-color-bar" />

        <div className="grid gap-8 p-6 md:p-8 xl:grid-cols-[1.05fr_0.95fr] xl:items-center xl:p-10">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em]">
              <VaultMark size={18} />
              <span>{ui.home.eyebrow}</span>
            </div>

            <div className="max-w-2xl">
              <h1 className="display-font text-4xl font-semibold leading-[0.95] md:text-6xl">{ui.home.heroTitle}</h1>
              <p className={`mt-5 max-w-xl text-sm leading-7 ${muted}`}>{ui.home.heroIntro}</p>
            </div>

            <div className="mt-6 flex flex-wrap gap-2.5">
              <button
                onClick={() => onSelectView("guide")}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white transition hover:opacity-95"
                style={{ backgroundColor: "var(--ibm-blue-60)" }}
              >
                {ui.home.primaryCta}
                <ArrowRight size={14} />
              </button>
              <button
                onClick={() => onSelectView("quiz")}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${chip}`}
              >
                {ui.home.secondaryCta}
                <Brain size={14} />
              </button>
              <button
                onClick={() => onSelectView("map")}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${chip}`}
              >
                {ui.actions.openMindMap}
                <Map size={14} />
              </button>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <SignalPill dark={dark} label={ui.home.questionBank} value={`${quiz.length}`} body={ui.home.questionBankNote} />
              <SignalPill dark={dark} label={ui.home.objectiveDepth} value={`${totalObjectives}`} body={ui.labels.fortyObjectives} />
              <SignalPill dark={dark} label={ui.home.localProgress} value={`${studiedCount}/${totalObjectives}`} body={ui.home.localProgressNote} />
            </div>
          </div>

          <VaultHeroGraphic
            dark={dark}
            onSelectView={onSelectView}
            surfaces={surfaces}
            caption={ui.home.heroPanelCaption}
          />
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <div className={`${shell} rounded-[32px] border p-5 md:p-6`}>
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--ibm-blue-30)" }}>
            <Sparkles size={13} />
            {ui.home.studySurfacesTitle}
          </div>
          <div className="display-font mt-3 text-3xl font-semibold">{ui.home.studySurfacesHeadline}</div>
          <p className={`mt-3 max-w-3xl text-sm leading-7 ${muted}`}>{ui.home.studySurfacesBody}</p>

          <div className="mt-6 grid gap-3">
            {surfaces.map((surface, index) => {
              const Icon = surface.icon;
              const rowStyle = index < 2
                ? {
                  background: dark
                    ? "linear-gradient(110deg, rgba(15,98,254,0.16), rgba(190,149,255,0.06) 68%, rgba(255,255,255,0.02))"
                    : "linear-gradient(110deg, rgba(15,98,254,0.08), rgba(190,149,255,0.04) 72%, rgba(255,255,255,0.9))",
                }
                : undefined;

              return (
                <button
                  key={surface.view}
                  onClick={() => onSelectView(surface.view)}
                  className={`mode-row relative overflow-hidden rounded-[28px] border px-5 py-4 text-left transition hover:-translate-y-0.5 hover:shadow-xl ${shell}`}
                  style={{ ...rowStyle, "--row-accent": surface.tone }}
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    <div className="flex items-start gap-4 md:flex-1">
                      <div className={`rounded-2xl border p-3 ${dark ? "border-white/10 bg-white/[0.04]" : "border-black/10 bg-white"}`}>
                        <Icon size={18} style={{ color: surface.tone }} />
                      </div>
                      <div className="min-w-0">
                        <div className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${muted}`}>
                          {String(index + 1).padStart(2, "0")} · {surface.label}
                        </div>
                        <div className="mt-2 text-base font-semibold leading-6">{surface.detail}</div>
                        <div className={`mt-2 text-xs leading-6 ${muted}`}>{surface.subdetail}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-4 md:min-w-[210px]">
                      <div>
                        <div className={`text-[11px] uppercase tracking-[0.16em] ${muted}`}>{ui.labels.focus}</div>
                        <div className="mt-1 text-sm font-semibold">{surface.metric}</div>
                      </div>
                      <div className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: surface.tone }}>
                        {surface.label}
                        <MoveUpRight size={16} />
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <aside className={`${shell} rounded-[32px] border p-5 md:p-6`}>
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--ibm-purple-40)" }}>
            <Target size={13} />
            {ui.home.nextFocusTitle}
          </div>
          <div className="display-font mt-3 text-3xl font-semibold">{ui.home.nextFocusHeadline}</div>
          <p className={`mt-3 text-sm leading-7 ${muted}`}>{ui.home.nextFocusBody}</p>

          <div className="mt-6 grid gap-3">
            {nextFocusDomains.map((domain) => (
              <button
                key={domain.id}
                onClick={() => onOpenDomain(domain)}
                className={`relative overflow-hidden rounded-[24px] border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-lg ${shell}`}
                style={{
                  background: dark
                    ? "linear-gradient(120deg, rgba(255,255,255,0.03), rgba(15,98,254,0.04))"
                    : "linear-gradient(120deg, rgba(255,255,255,0.98), rgba(15,98,254,0.04))",
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{domain.icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: domain.color }}>
                      {ui.labels.domain} {domain.id}
                    </div>
                    <div className="mt-1 text-sm font-semibold">{domain.label}</div>
                  </div>
                  <div className="text-xs font-semibold" style={{ color: domain.color }}>
                    {domainProgress(domain)}%
                  </div>
                </div>
                <div className={`mt-3 text-xs leading-6 ${muted}`}>
                  <span className="font-semibold" style={{ color: "var(--ibm-purple-40)" }}>{ui.labels.watchFor}:</span>{" "}
                  {domainGuides[domain.id]?.commonTraps?.[0] ?? domain.summary}
                </div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className={`h-1.5 flex-1 overflow-hidden rounded-full ${dark ? "bg-white/10" : "bg-black/10"}`}>
                    <div className="h-full rounded-full" style={{ width: `${domainProgress(domain)}%`, background: domain.color }} />
                  </div>
                  <span className="text-xs font-semibold" style={{ color: domain.color }}>{ui.home.openDomain}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--ibm-blue-30)" }}>
            <Compass size={13} />
            {ui.home.domainsTitle}
          </div>
          <div className={`mt-3 text-sm leading-7 ${muted}`}>{ui.home.domainsBody}</div>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {domains.map((domain) => (
              <button
                key={domain.id}
                onClick={() => onOpenDomain(domain)}
                className={`rounded-2xl border px-3 py-3 text-left transition ${chip}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-lg">{domain.icon}</span>
                  <span className="text-[11px] font-semibold" style={{ color: domain.color }}>{domainProgress(domain)}%</span>
                </div>
                <div className="mt-2 text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: domain.color }}>
                  {ui.labels.domain} {domain.id}
                </div>
                <div className="mt-1 text-xs font-semibold leading-5">{questionCountsByDomain[domain.id] ?? 0}Q</div>
              </button>
            ))}
          </div>
        </aside>
      </section>
    </div>
  );
}

function SignalPill({ dark, label, value, body }) {
  return (
    <div className={`rounded-[24px] border p-4 ${dark ? "border-white/10 bg-white/[0.04]" : "border-black/10 bg-white/90"}`}>
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--ibm-blue-30)" }}>
        {label}
      </div>
      <div className="display-font mt-2 text-2xl font-semibold leading-none">{value}</div>
      <div className={`mt-2 text-xs leading-6 ${dark ? "text-[#a2a9b0]" : "text-[#525252]"}`}>{body}</div>
    </div>
  );
}
