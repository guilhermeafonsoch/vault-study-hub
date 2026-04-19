import { useMemo, useState } from "react";
import { BookOpen, Check, ChevronRight, ExternalLink, RotateCcw, Trophy, X } from "lucide-react";
import { getQuestionDomain, shuffle } from "../data/quiz.js";
import { SurfaceCard, SurfaceIntro, SurfaceKicker, SurfaceLink, SurfaceStat, getSurfaceTokens } from "./SurfacePrimitives.jsx";
import { useLocale } from "../i18n/LocaleContext.jsx";

export default function QuizMode({ dark }) {
  const { domains, quiz, totalObjectives, allObjectives, domainGuides, objectiveGuide, ui } = useLocale();
  const tokens = getSurfaceTokens(dark);
  const [filter, setFilter] = useState("all");
  const [order, setOrder] = useState(() => shuffle(quiz.map((question) => question.id)));
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [correct, setCorrect] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showDocs, setShowDocs] = useState(false);

  const objectiveLookup = useMemo(
    () => Object.fromEntries(allObjectives.map((objective) => [objective.id, objective])),
    [allObjectives]
  );

  const pool = useMemo(
    () =>
      order
        .map((id) => quiz.find((question) => question.id === id))
        .filter(Boolean)
        .filter((question) => filter === "all" || getQuestionDomain(question) === String(filter)),
    [filter, order, quiz]
  );

  const coveredObjectives = useMemo(() => new Set(quiz.map((question) => question.obj)).size, [quiz]);
  const reviewCount = useMemo(() => quiz.filter((question) => getQuestionDomain(question) === "review").length, [quiz]);
  const activeDomain = useMemo(() => domains.find((domain) => String(domain.id) === String(filter)), [domains, filter]);

  const question = pool[idx];
  const isReviewQuestion = question ? getQuestionDomain(question) === "review" : false;
  const guideObjectiveId = question
    ? (question.guideObjective === false ? null : (question.guideObjective ?? question.obj))
    : null;
  const objective = guideObjectiveId ? objectiveLookup[guideObjectiveId] : null;
  const questionDomain = question && !isReviewQuestion
    ? domains.find((domain) => String(domain.id) === String(Number.parseInt(guideObjectiveId ?? question.obj, 10)))
    : null;
  const note = guideObjectiveId ? objectiveGuide[guideObjectiveId] : null;

  const questionDocs = useMemo(() => {
    if (!question) return [];
    if (question.docs?.length) return question.docs;
    const domainDocs = questionDomain ? (domainGuides[questionDomain.id]?.resources ?? []) : [];
    const seen = new Set();
    return domainDocs.filter((doc) => {
      if (!doc?.href || seen.has(doc.href)) return false;
      seen.add(doc.href);
      return true;
    }).slice(0, 4);
  }, [domainGuides, question, questionDomain]);

  const filterSummary = filter === "all"
    ? ui.home.questionBankNote
    : filter === "review"
      ? ui.labels.mapExamChain
      : activeDomain?.summary;
  const filterTitle = filter === "all"
    ? ui.labels.all
    : filter === "review"
      ? ui.labels.mixedReview
      : `${ui.labels.domain} ${activeDomain?.id}`;

  const reset = (nextFilter = filter) => {
    setOrder(shuffle(quiz.map((entry) => entry.id)));
    setIdx(0);
    setPicked(null);
    setCorrect(0);
    setAnswered(0);
    setFinished(false);
    setFilter(nextFilter);
    setShowDocs(false);
  };

  const submit = (choiceIndex) => {
    if (picked !== null || !question) return;
    setPicked(choiceIndex);
    setAnswered((value) => value + 1);
    if (choiceIndex === question.answer) setCorrect((value) => value + 1);
  };

  const next = () => {
    if (idx + 1 >= pool.length) {
      setFinished(true);
    } else {
      setIdx((value) => value + 1);
      setPicked(null);
      setShowDocs(false);
    }
  };

  if (!question && !finished) {
    return (
      <SurfaceCard dark={dark}>
        <div className={`py-10 text-center text-sm ${tokens.muted}`}>{ui.labels.noQuestions}</div>
      </SurfaceCard>
    );
  }

  if (finished) {
    const pct = Math.round((correct / Math.max(answered, 1)) * 100);
    const band = pct >= 85
      ? { title: ui.labels.strongRecall, accent: "#24a148" }
      : pct >= 65
        ? { title: ui.labels.solidBase, accent: "#f1c21b" }
        : { title: ui.labels.keepDrilling, accent: "var(--ibm-purple-40)" };

    return (
      <div className="space-y-6 animate-fade-in">
        <SurfaceIntro
          dark={dark}
          tone="purple"
          eyebrow={filterTitle}
          title={band.title}
          body={ui.labels.quizStudyAid}
          stats={[
            <SurfaceStat key="score" dark={dark} label={ui.labels.correct} value={`${pct}%`} body={ui.labels.correctProgress(correct, answered)} tone="purple" />,
            <SurfaceStat key="answered" dark={dark} label={ui.labels.question} value={`${answered}`} body={ui.labels.singleAnswerMode} />,
            <SurfaceStat key="coverage" dark={dark} label={ui.labels.objectiveCoverage} value={`${coveredObjectives}/${totalObjectives}`} body={ui.labels.quizCoverage} />,
          ]}
        />

        <SurfaceCard dark={dark} className="mx-auto max-w-2xl text-center">
          <Trophy size={48} className="mx-auto" style={{ color: band.accent }} />
          <div className="display-font mt-4 text-3xl font-semibold">{band.title}</div>
          <div className={`mt-3 text-sm ${tokens.muted}`}>{ui.labels.correctProgress(correct, answered)}</div>
          <button
            onClick={() => reset()}
            className="mt-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white transition hover:opacity-95"
            style={{ backgroundColor: "var(--ibm-blue-60)" }}
          >
            <RotateCcw size={14} />
            {ui.actions.retry}
          </button>
        </SurfaceCard>
      </div>
    );
  }

  const choiceReviews = question.choices.map((choice, index) => ({
    choice,
    isCorrect: index === question.answer,
    reason: question.choiceNotes?.[index] ?? buildChoiceReason({ question, choice, index, objective, note }),
  }));
  const progressPct = pool.length ? (idx / pool.length) * 100 : 0;
  const isCorrect = picked === question.answer;

  return (
    <div className="space-y-6 animate-fade-in">
      <SurfaceIntro
        dark={dark}
        tone="purple"
        eyebrow={ui.views.quiz}
        title={filterTitle}
        body={ui.home.modes.quiz}
        stats={[
          <SurfaceStat key="bank" dark={dark} label={ui.home.questionBank} value={`${quiz.length}`} body={filterSummary ?? ui.home.questionBankNote} tone="purple" />,
          <SurfaceStat key="coverage" dark={dark} label={ui.labels.objectiveCoverage} value={`${coveredObjectives}/${totalObjectives}`} body={ui.labels.quizCoverage} />,
          <SurfaceStat key="run" dark={dark} label={ui.labels.correct} value={`${correct}/${answered}`} body={ui.labels.singleAnswerMode} />,
        ]}
      />

      <SurfaceCard dark={dark}>
        <SurfaceKicker tone="purple">{ui.labels.quizCoverage}</SurfaceKicker>
        <div className="mt-5 flex flex-wrap gap-2">
          <FilterPill
            dark={dark}
            active={filter === "all"}
            onClick={() => reset("all")}
            tone="var(--ibm-blue-60)"
            label={`${ui.labels.all} (${quiz.length})`}
          />
          {domains.map((domain) => {
            const count = quiz.filter((entry) => getQuestionDomain(entry) === String(domain.id)).length;
            if (!count) return null;
            return (
              <FilterPill
                key={domain.id}
                dark={dark}
                active={filter === String(domain.id)}
                onClick={() => reset(String(domain.id))}
                tone={domain.color}
                label={`${domain.icon} D${domain.id} (${count})`}
              />
            );
          })}
          {reviewCount > 0 ? (
            <FilterPill
              dark={dark}
              active={filter === "review"}
              onClick={() => reset("review")}
              tone="#24a148"
              label={`${ui.labels.mixedReview} (${reviewCount})`}
            />
          ) : null}
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
          <div className={`${tokens.soft} rounded-[24px] border p-4`}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--ibm-purple-40)" }}>
                  {ui.labels.questionProgress(idx + 1, pool.length)}
                </div>
                <div className="mt-2 text-sm font-semibold">{filterTitle}</div>
              </div>
              <div className="text-sm font-semibold">{ui.labels.correctProgress(correct, answered)}</div>
            </div>
            <div className={`mt-4 h-2 overflow-hidden rounded-full ${tokens.track}`}>
              <div className="h-full rounded-full" style={{ width: `${progressPct}%`, background: "var(--ibm-purple-40)" }} />
            </div>
            <div className={`mt-4 text-xs leading-6 ${tokens.muted}`}>{filterSummary}</div>
          </div>

          <div
            className={`${tokens.panelStrong} rounded-[28px] border p-5 md:p-6`}
            style={{
              background: dark
                ? "linear-gradient(120deg, rgba(190,149,255,0.1), rgba(255,255,255,0.02))"
                : "linear-gradient(120deg, rgba(190,149,255,0.07), rgba(255,255,255,0.98))",
            }}
          >
            <div className={`text-[11px] uppercase tracking-[0.16em] ${tokens.muted}`}>
              {isReviewQuestion
                ? `${ui.labels.mixedReview}${question.reviewObjectives?.length ? ` · ${question.reviewObjectives.join(" · ")}` : ""}`
                : `${ui.labels.objective} ${question.obj}${objective ? ` · ${objective.title}` : ""}`}
            </div>
            <div className="mt-3 text-lg font-semibold leading-8">{question.question}</div>

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                onClick={() => setShowDocs((value) => !value)}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition ${tokens.chip}`}
              >
                <BookOpen size={13} />
                {showDocs ? ui.actions.hideDocs : ui.actions.showDocs}
              </button>
            </div>

            {showDocs ? (
              <div className={`${tokens.soft} mt-5 rounded-[24px] border p-4`}>
                <SurfaceKicker tone="purple">{ui.labels.officialDocsForQuestion}</SurfaceKicker>
                <div className={`mt-2 text-xs leading-6 ${tokens.muted}`}>{ui.labels.sourceLinks}</div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {questionDocs.map((doc) => (
                    <SurfaceLink key={doc.href} dark={dark} href={doc.href} icon={<ExternalLink size={12} />}>
                      {doc.label}
                    </SurfaceLink>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-5 flex flex-col gap-2">
              {question.choices.map((choice, index) => {
                const isChoiceCorrect = index === question.answer;
                const isChoicePicked = index === picked;
                const activeStyle = picked !== null && isChoiceCorrect
                  ? { background: dark ? "rgba(36, 161, 72, 0.16)" : "rgba(36, 161, 72, 0.12)", borderColor: "rgba(36, 161, 72, 0.48)" }
                  : picked !== null && isChoicePicked
                    ? { background: dark ? "rgba(218, 30, 40, 0.16)" : "rgba(218, 30, 40, 0.08)", borderColor: "rgba(218, 30, 40, 0.42)" }
                    : undefined;

                return (
                  <button
                    key={`${question.id}-${index}`}
                    disabled={picked !== null}
                    onClick={() => submit(index)}
                    className={`flex items-center gap-3 rounded-[22px] border px-4 py-4 text-left text-sm transition ${picked !== null && !isChoiceCorrect && !isChoicePicked ? "opacity-60" : ""} ${tokens.inset}`}
                    style={activeStyle}
                  >
                    <span className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${dark ? "border-white/15 text-gray-200" : "border-black/15 text-gray-700"}`}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="flex-1">{choice}</span>
                    {picked !== null && isChoiceCorrect ? <Check size={16} className="text-green-500" /> : null}
                    {picked !== null && isChoicePicked && !isChoiceCorrect ? <X size={16} className="text-red-500" /> : null}
                  </button>
                );
              })}
            </div>

            {picked !== null ? (
              <div className="mt-5 space-y-3">
                <div className={`rounded-[22px] border px-4 py-3 text-xs leading-6 ${isCorrect ? "border-green-500/30 bg-green-500/10 text-green-200" : "border-red-500/30 bg-red-500/10 text-red-200"}`}>
                  <strong>{isCorrect ? `${ui.labels.correctAnswer} ` : `${ui.labels.incorrectAnswer} `}</strong>
                  {question.explain}
                </div>

                <div className={`${tokens.soft} rounded-[24px] border p-4`}>
                  <SurfaceKicker tone="purple">{ui.labels.answerReview}</SurfaceKicker>
                  <div className="mt-4">
                    <div className="text-xs font-semibold text-green-500">{ui.labels.whyThisIsCorrect}</div>
                    <div className={`mt-2 text-xs leading-6 ${tokens.muted}`}>{question.correctReview ?? buildCorrectReview(question, note)}</div>
                  </div>

                  <div className="mt-4">
                    <div className="text-xs font-semibold" style={{ color: "var(--ibm-purple-40)" }}>{ui.labels.optionBreakdown}</div>
                    <div className="mt-3 space-y-2">
                      {choiceReviews.map((item, reviewIndex) => (
                        <div
                          key={`${question.id}-review-${reviewIndex}`}
                          className={`rounded-[20px] border px-4 py-3 ${item.isCorrect ? "border-green-500/30 bg-green-500/10" : tokens.inset}`}
                        >
                          <div className="flex items-start gap-3">
                            <span className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${item.isCorrect ? "border-green-500 text-green-500" : dark ? "border-white/15 text-gray-200" : "border-black/15 text-gray-700"}`}>
                              {String.fromCharCode(65 + reviewIndex)}
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-semibold">{item.choice}</div>
                              <div className={`mt-1 text-[11px] ${item.isCorrect ? "text-green-400" : tokens.muted}`}>
                                {item.isCorrect ? ui.labels.whyThisIsCorrect : ui.labels.whyThisIsNotBest}
                              </div>
                              <div className={`mt-2 text-xs leading-6 ${item.isCorrect ? "text-green-200" : tokens.muted}`}>
                                {item.reason}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {picked !== null ? (
              <div className="mt-5 flex justify-end">
                <button
                  onClick={next}
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white transition hover:opacity-95"
                  style={{ backgroundColor: "var(--ibm-blue-60)" }}
                >
                  {idx + 1 >= pool.length ? ui.labels.seeResults : ui.actions.next}
                  <ChevronRight size={14} />
                </button>
              </div>
            ) : null}
          </div>
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

function buildCorrectReview(question, note) {
  return [question.explain, note?.explanation, note?.examCue].filter(Boolean).join(" ");
}

function buildChoiceReason({ question, choice, index, objective, note }) {
  if (index === question.answer) {
    return buildCorrectReview(question, note);
  }

  const correctChoice = question.choices[question.answer];
  const objectiveFocus = objective?.title ? `This question is testing ${objective.title.toLowerCase()}.` : "";
  const trap = note?.pitfalls?.[0] ? `Common trap: ${note.pitfalls[0]}` : "";

  return [
    `${choice} does not best match what the prompt is asking for.`,
    objectiveFocus,
    `${correctChoice} is the better answer here because ${question.explain.charAt(0).toLowerCase()}${question.explain.slice(1)}`,
    trap,
  ].filter(Boolean).join(" ");
}
