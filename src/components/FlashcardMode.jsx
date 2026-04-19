import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, Shuffle } from "lucide-react";
import { shuffle } from "../data/quiz.js";
import { SurfaceCard, SurfaceIntro, SurfaceKicker, SurfaceStat, getSurfaceTokens } from "./SurfacePrimitives.jsx";
import { useLocale } from "../i18n/LocaleContext.jsx";

export default function FlashcardMode({ dark, studied, markObj }) {
  const { domains, allObjectives, objectiveGuide, ui } = useLocale();
  const tokens = getSurfaceTokens(dark);
  const [filter, setFilter] = useState("all");
  const [order, setOrder] = useState(() => allObjectives.map((_, index) => index));
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const cards = useMemo(
    () =>
      order
        .map((index) => allObjectives[index])
        .filter(Boolean)
        .filter((objective) => filter === "all" || objective.domain.id === filter),
    [allObjectives, filter, order]
  );

  const card = cards[idx];
  const note = card ? objectiveGuide[card.id] : null;
  const activeDomain = filter === "all" ? null : domains.find((domain) => domain.id === filter);

  const reshuffle = () => {
    setOrder(shuffle(allObjectives.map((_, index) => index)));
    setIdx(0);
    setFlipped(false);
  };

  if (!card) {
    return (
      <SurfaceCard dark={dark}>
        <div className={`py-10 text-center text-sm ${tokens.muted}`}>{ui.labels.noCards}</div>
      </SurfaceCard>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <SurfaceIntro
        dark={dark}
        tone="blue"
        eyebrow={ui.views.flash}
        title={activeDomain ? `${ui.labels.domain} ${activeDomain.id}` : ui.labels.flashcardHint}
        body={activeDomain ? activeDomain.summary : ui.home.modes.flash}
        stats={[
          <SurfaceStat key="cards" dark={dark} label={ui.labels.card} value={`${cards.length}`} body={ui.labels.flashcardHint} />,
          <SurfaceStat key="progress" dark={dark} label={ui.labels.prompt} value={`${idx + 1}/${cards.length}`} body={ui.labels.cardProgress(idx + 1, cards.length)} tone="purple" />,
          <SurfaceStat key="studied" dark={dark} label={ui.labels.studied} value={`${Object.values(studied).filter(Boolean).length}`} body={ui.labels.localProgress} />,
        ]}
      />

      <SurfaceCard dark={dark}>
        <SurfaceKicker tone="blue">{ui.labels.objectiveGuide}</SurfaceKicker>
        <div className="mt-5 flex flex-wrap gap-2">
          <FilterPill
            dark={dark}
            active={filter === "all"}
            onClick={() => {
              setFilter("all");
              setIdx(0);
              setFlipped(false);
            }}
            tone="var(--ibm-blue-60)"
            label={`${ui.labels.all} (${allObjectives.length})`}
          />
          {domains.map((domain) => (
            <FilterPill
              key={domain.id}
              dark={dark}
              active={filter === domain.id}
              onClick={() => {
                setFilter(domain.id);
                setIdx(0);
                setFlipped(false);
              }}
              tone={domain.color}
              label={`${domain.icon} D${domain.id}`}
            />
          ))}
          <button onClick={reshuffle} className={`ml-auto inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition ${tokens.chip}`}>
            <Shuffle size={12} />
            {ui.actions.shuffle}
          </button>
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-[0.88fr_1.12fr]">
          <div className={`${tokens.soft} rounded-[24px] border p-4`}>
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--ibm-blue-30)" }}>
              {ui.labels.cardProgress(idx + 1, cards.length)}
            </div>
            <div className="display-font mt-3 text-3xl font-semibold">{card.id}</div>
            <div className={`mt-3 text-sm leading-7 ${tokens.muted}`}>{ui.labels.flashcardPromptHint}</div>
            <div className="mt-5 flex items-center gap-3">
              <span className="text-3xl">{card.domain.icon}</span>
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: card.domain.color }}>
                  {ui.labels.domain} {card.domain.id}
                </div>
                <div className="text-sm font-semibold">{card.domain.label}</div>
              </div>
            </div>
            <div className={`mt-5 h-2 overflow-hidden rounded-full ${tokens.track}`}>
              <div className="h-full rounded-full" style={{ width: `${((idx + 1) / cards.length) * 100}%`, background: card.domain.color }} />
            </div>
          </div>

          <button
            onClick={() => setFlipped((value) => !value)}
            className={`${tokens.panelStrong} min-h-[420px] rounded-[32px] border p-6 text-left transition hover:-translate-y-0.5 hover:shadow-xl`}
            style={{
              background: dark
                ? "linear-gradient(120deg, rgba(15,98,254,0.08), rgba(190,149,255,0.05))"
                : "linear-gradient(120deg, rgba(15,98,254,0.06), rgba(255,255,255,0.98))",
              borderTop: `4px solid ${card.domain.color}`,
            }}
          >
            <div className="flex items-center gap-3">
              <div className="text-3xl">{card.domain.icon}</div>
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: card.domain.color }}>
                  {ui.labels.domain} {card.domain.id} · {card.id}
                </div>
                <div className={`mt-1 text-xs ${tokens.muted}`}>{flipped ? ui.labels.answer : ui.labels.prompt} · {ui.labels.clickToFlip}</div>
              </div>
            </div>

            {!flipped ? (
              <div className="py-10">
                <div className="display-font text-3xl font-semibold leading-tight md:text-4xl">{card.title}?</div>
                <div className={`mt-5 text-sm leading-7 ${tokens.muted}`}>{ui.labels.flashcardPromptHint}</div>
              </div>
            ) : (
              <div className="animate-fade-in py-6">
                {note?.remember ? (
                  <Callout dark={dark} accent={card.domain.color} title={ui.labels.remember}>
                    {note.remember}
                  </Callout>
                ) : null}

                {note?.explanation ? (
                  <div className={`mt-4 text-sm leading-7 ${tokens.muted}`}>{note.explanation}</div>
                ) : null}

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {note?.useCase ? (
                    <MiniPanel dark={dark} accent="#24a148" title={ui.labels.useCase}>
                      {note.useCase}
                    </MiniPanel>
                  ) : null}
                  {note?.realWorldExample ? (
                    <MiniPanel dark={dark} accent="var(--ibm-blue-60)" title={ui.labels.realWorldExample}>
                      {note.realWorldExample}
                    </MiniPanel>
                  ) : null}
                </div>

                <div className="mt-5 space-y-2">
                  {card.concepts.map((concept) => (
                    <div key={concept} className={`text-sm leading-6 pl-3 ${tokens.muted}`} style={{ borderLeft: `2px solid ${card.domain.color}66` }}>
                      {concept}
                    </div>
                  ))}
                </div>

                {note?.examCue ? (
                  <MiniPanel dark={dark} accent="var(--ibm-purple-40)" title={ui.labels.examCue} className="mt-5">
                    {note.examCue}
                  </MiniPanel>
                ) : null}

                <MiniPanel dark={dark} accent="#f1c21b" title={note?.pitfalls?.length ? ui.labels.trap : ui.labels.examTip} className="mt-5">
                  {note?.pitfalls?.[0] ?? card.tip}
                </MiniPanel>
              </div>
            )}
          </button>
        </div>

        <div className="mt-5 flex items-center justify-center gap-2">
          <button
            onClick={() => {
              setIdx((value) => Math.max(0, value - 1));
              setFlipped(false);
            }}
            disabled={idx === 0}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition disabled:opacity-30 ${tokens.chip}`}
          >
            <ChevronLeft size={14} />
            {ui.actions.prev}
          </button>
          <button
            onClick={() => markObj(card.id)}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white transition hover:opacity-95"
            style={{ backgroundColor: studied[card.id] ? "#24a148" : "var(--ibm-blue-60)" }}
          >
            {studied[card.id] ? `✓ ${ui.actions.studied}` : ui.actions.markStudied}
          </button>
          <button
            onClick={() => setFlipped((value) => !value)}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${tokens.chip}`}
          >
            <RotateCcw size={14} />
            {ui.actions.flip}
          </button>
          <button
            onClick={() => {
              setIdx((value) => Math.min(cards.length - 1, value + 1));
              setFlipped(false);
            }}
            disabled={idx >= cards.length - 1}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition disabled:opacity-30 ${tokens.chip}`}
          >
            {ui.actions.next}
            <ChevronRight size={14} />
          </button>
        </div>
      </SurfaceCard>
    </div>
  );
}

function FilterPill({ dark, active, onClick, tone, label }) {
  const tokens = getSurfaceTokens(dark);
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${active ? "text-white" : tokens.chip}`}
      style={active ? { backgroundColor: tone, borderColor: tone } : undefined}
    >
      {label}
    </button>
  );
}

function Callout({ dark, accent, title, children }) {
  const tokens = getSurfaceTokens(dark);
  return (
    <div className={`${tokens.soft} rounded-[20px] border px-4 py-3 text-xs leading-6`} style={{ borderLeft: `3px solid ${accent}` }}>
      <strong style={{ color: accent }}>{title}: </strong>
      <span className={tokens.muted}>{children}</span>
    </div>
  );
}

function MiniPanel({ dark, accent, title, children, className = "" }) {
  const tokens = getSurfaceTokens(dark);
  return (
    <div className={`${tokens.soft} rounded-[20px] border px-4 py-3 text-xs leading-6 ${className}`} style={{ borderLeft: `3px solid ${accent}` }}>
      <div className="font-semibold" style={{ color: accent }}>{title}</div>
      <div className={`mt-2 ${tokens.muted}`}>{children}</div>
    </div>
  );
}
