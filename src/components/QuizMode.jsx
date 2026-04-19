import { useMemo, useState } from "react";
import { Check, X, RotateCcw, ChevronRight, Trophy, BookOpen, ExternalLink } from "lucide-react";
import { getQuestionDomain, shuffle } from "../data/quiz.js";
import { useLocale } from "../i18n/LocaleContext.jsx";

export default function QuizMode({ dark }) {
  const { domains, quiz, totalObjectives, allObjectives, domainGuides, objectiveGuide, ui } = useLocale();
  const [filter, setFilter] = useState("all"); // domain id or "all"
  const [order, setOrder] = useState(() => shuffle(quiz.map((q) => q.id)));
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [correct, setCorrect] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showDocs, setShowDocs] = useState(false);

  const card = dark ? "bg-ink-600" : "bg-white";
  const brd = dark ? "border-ink-400" : "border-gray-200";
  const t2 = dark ? "text-gray-400" : "text-gray-500";

  const pool = useMemo(() => {
    const ids = order
      .map((id) => quiz.find((q) => q.id === id))
      .filter(Boolean)
      .filter((q) => filter === "all" || getQuestionDomain(q) === String(filter));
    return ids;
  }, [filter, order, quiz]);
  const objectiveLookup = useMemo(
    () => Object.fromEntries(allObjectives.map((objective) => [objective.id, objective])),
    [allObjectives]
  );
  const coveredObjectives = useMemo(() => new Set(quiz.map((question) => question.obj)).size, [quiz]);
  const reviewCount = useMemo(
    () => quiz.filter((question) => getQuestionDomain(question) === "review").length,
    [quiz]
  );
  const activeDomain = useMemo(
    () => domains.find((domain) => String(domain.id) === String(filter)),
    [domains, filter]
  );

  const q = pool[idx];
  const isReviewQuestion = q ? getQuestionDomain(q) === "review" : false;
  const guideObjectiveId = q
    ? (q.guideObjective === false ? null : (q.guideObjective ?? q.obj))
    : null;
  const objective = guideObjectiveId ? objectiveLookup[guideObjectiveId] : null;
  const questionDomain = q && !isReviewQuestion
    ? domains.find((domain) => String(domain.id) === String(Number.parseInt(guideObjectiveId ?? q.obj, 10)))
    : null;
  const note = guideObjectiveId ? objectiveGuide[guideObjectiveId] : null;
  const questionDocs = useMemo(() => {
    if (!q) return [];
    if (q.docs?.length) return q.docs;
    const domainDocs = questionDomain ? (domainGuides[questionDomain.id]?.resources ?? []) : [];
    const seen = new Set();
    return domainDocs.filter((doc) => {
      if (!doc?.href || seen.has(doc.href)) return false;
      seen.add(doc.href);
      return true;
    }).slice(0, 4);
  }, [domainGuides, q, questionDomain]);

  const reset = (nextFilter = filter) => {
    setOrder(shuffle(quiz.map((x) => x.id)));
    setIdx(0);
    setPicked(null);
    setCorrect(0);
    setAnswered(0);
    setFinished(false);
    setFilter(nextFilter);
    setShowDocs(false);
  };

  const submit = (choiceIdx) => {
    if (picked !== null) return;
    setPicked(choiceIdx);
    setAnswered((a) => a + 1);
    if (choiceIdx === q.answer) setCorrect((c) => c + 1);
  };

  const next = () => {
    if (idx + 1 >= pool.length) {
      setFinished(true);
    } else {
      setIdx(idx + 1);
      setPicked(null);
      setShowDocs(false);
    }
  };

  if (!q && !finished) {
    return <div className={`text-center ${t2} py-10 text-sm`}>{ui.labels.noQuestions}</div>;
  }

  if (finished) {
    const pct = Math.round((correct / Math.max(answered, 1)) * 100);
    const band =
      pct >= 85 ? { title: ui.labels.strongRecall, color: "text-green-500", icon: "text-emerald-400" }
      : pct >= 65 ? { title: ui.labels.solidBase, color: "text-amber-500", icon: "text-amber-400" }
      : { title: ui.labels.keepDrilling, color: t2, icon: "text-gray-400" };
    return (
      <div className={`${card} border ${brd} rounded-2xl p-8 max-w-lg mx-auto text-center animate-fade-in`}>
        <Trophy size={48} className={`mx-auto mb-3 ${band.icon}`} />
        <div className="text-2xl font-bold mb-1">{band.title}</div>
        <div className={`text-sm ${t2} mb-4`}>
          {ui.labels.correctProgress(correct, answered)} · <span className={band.color}>{pct}%</span>
        </div>
        <div className={`text-xs leading-6 ${t2} mb-5`}>
          {ui.labels.quizStudyAid}
        </div>
        <button
          onClick={() => reset()}
          className="px-4 py-2 rounded-lg font-semibold text-sm bg-violet-500 text-white hover:bg-violet-600 transition"
        >
          <RotateCcw size={14} className="inline-block mr-1" /> {ui.actions.retry}
        </button>
      </div>
    );
  }

  const isCorrect = picked === q.answer;
  const choiceReviews = q.choices.map((choice, index) => ({
    choice,
    isCorrect: index === q.answer,
    reason: q.choiceNotes?.[index]
      ?? buildChoiceReason({
        question: q,
        choice,
        index,
        objective,
        note,
      }),
  }));
  return (
    <div className="max-w-2xl mx-auto">
      {/* Filter pills */}
      <div className="flex flex-wrap gap-1 mb-4">
        <button
          onClick={() => reset("all")}
          className={`text-[11px] px-2.5 py-1 rounded border ${filter === "all" ? "bg-violet-500 text-white border-violet-500" : `${card} ${brd}`}`}
        >{ui.labels.all} ({quiz.length})</button>
        {domains.map((d) => {
          const n = quiz.filter((question) => getQuestionDomain(question) === String(d.id)).length;
          if (!n) return null;
          return (
            <button
              key={d.id}
              onClick={() => reset(String(d.id))}
              className={`text-[11px] px-2.5 py-1 rounded border ${filter === String(d.id) ? "text-white" : `${card} ${brd}`}`}
              style={filter === String(d.id) ? { background: d.color, borderColor: d.color } : {}}
            >{d.icon} D{d.id} ({n})</button>
          );
        })}
        {reviewCount > 0 && (
          <button
            onClick={() => reset("review")}
            className={`text-[11px] px-2.5 py-1 rounded border ${filter === "review" ? "bg-emerald-500 text-white border-emerald-500" : `${card} ${brd}`}`}
          >
            {ui.labels.mixedReview} ({reviewCount})
          </button>
        )}
      </div>

      <div className={`text-[11px] ${t2} mb-3`}>
        {ui.labels.singleAnswerMode} · {ui.home.questionsForDomain(quiz.length)} · {coveredObjectives} / {totalObjectives} {ui.labels.objectives}
      </div>

      {(activeDomain || filter === "review") && (
        <div className={`${card} border ${brd} rounded-2xl p-4 mb-4`}>
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-violet-400">
            {filter === "review" ? ui.labels.mixedReview : `${ui.labels.domain} ${activeDomain?.id}`}
          </div>
          <div className="text-sm font-semibold mt-2">
            {filter === "review" ? ui.home.questionBankNote : activeDomain?.label}
          </div>
          <div className={`text-xs leading-6 mt-2 ${t2}`}>
            {filter === "review" ? ui.labels.mapExamChain : activeDomain?.summary}
          </div>
        </div>
      )}

      {/* Progress */}
      <div className={`text-[11px] ${t2} mb-2 flex justify-between`}>
        <span>{ui.labels.questionProgress(idx + 1, pool.length)}</span>
        <span>{ui.labels.correctProgress(correct, answered)}</span>
      </div>
      <div className={`h-1 ${dark ? "bg-ink-400" : "bg-gray-200"} rounded overflow-hidden mb-4`}>
        <div className="h-full bg-violet-500 transition-all" style={{ width: `${((idx) / pool.length) * 100}%` }} />
      </div>

      {/* Card */}
      <div className={`${card} border ${brd} rounded-2xl p-6 animate-fade-in`}>
        <div className={`text-[10px] ${t2} mb-2 tracking-wider uppercase`}>
          {isReviewQuestion
            ? `${ui.labels.mixedReview}${q.reviewObjectives?.length ? ` · ${q.reviewObjectives.join(" · ")}` : ""}`
            : `${ui.labels.objective} ${q.obj}${objective ? ` · ${objective.title}` : ""}`}
        </div>
        <div className="text-base font-semibold leading-7 mb-5">{q.question}</div>

        <div className="flex flex-wrap gap-2 mb-5">
          <button
            onClick={() => setShowDocs((value) => !value)}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition ${dark ? "border-ink-400 bg-ink-700 hover:bg-ink-800" : "border-gray-200 bg-gray-50 hover:bg-gray-100"}`}
          >
            <BookOpen size={13} />
            {showDocs ? ui.actions.hideDocs : ui.actions.showDocs}
          </button>
        </div>

        {showDocs && (
          <div className={`mb-5 rounded-2xl border p-4 ${dark ? "border-ink-400 bg-ink-700/70" : "border-gray-200 bg-gray-50"}`}>
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-violet-400">
              {ui.labels.officialDocsForQuestion}
            </div>
            <div className={`text-xs leading-6 mt-2 ${t2}`}>
              {ui.labels.sourceLinks}
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {questionDocs.map((doc) => (
                <a
                  key={doc.href}
                  href={doc.href}
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium transition ${dark ? "border-ink-400 bg-ink-800 hover:bg-ink-700" : "border-gray-200 bg-white hover:bg-gray-100"}`}
                >
                  {doc.label}
                  <ExternalLink size={12} />
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2">
          {q.choices.map((choice, i) => {
            let cls = `${card} ${brd} hover:border-violet-400`;
            if (picked !== null) {
              if (i === q.answer) cls = "bg-green-500/15 border-green-500 text-green-400";
              else if (i === picked) cls = "bg-red-500/15 border-red-500 text-red-400";
              else cls = `${card} ${brd} opacity-60`;
            }
            return (
              <button
                key={i}
                disabled={picked !== null}
                onClick={() => submit(i)}
                className={`text-left px-4 py-3 rounded-lg border text-sm transition-all flex items-center gap-2 ${cls}`}
              >
                <span className={`w-5 h-5 flex-shrink-0 rounded-full border flex items-center justify-center text-[10px] font-bold ${brd}`}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="flex-1">{choice}</span>
                {picked !== null && i === q.answer && <Check size={16} className="text-green-500" />}
                {picked !== null && i === picked && i !== q.answer && <X size={16} className="text-red-500" />}
              </button>
            );
          })}
        </div>

        {picked !== null && (
          <div className="mt-4 space-y-3">
            <div className={`p-3 rounded-lg text-xs leading-6 ${isCorrect ? "bg-green-500/10 text-green-300" : "bg-red-500/10 text-red-300"}`}>
              <strong>{isCorrect ? `${ui.labels.correctAnswer} ` : `${ui.labels.incorrectAnswer} `}</strong>{q.explain}
            </div>

            <div className={`rounded-2xl border p-4 ${dark ? "border-ink-400 bg-ink-700/70" : "border-gray-200 bg-gray-50"}`}>
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-violet-400">
                {ui.labels.answerReview}
              </div>
              <div className="mt-3">
                <div className="text-xs font-semibold text-green-500">{ui.labels.whyThisIsCorrect}</div>
                <div className={`text-xs leading-6 mt-2 ${t2}`}>
                  {q.correctReview ?? buildCorrectReview(q, note)}
                </div>
              </div>
              <div className="mt-4">
                <div className="text-xs font-semibold text-violet-400">{ui.labels.optionBreakdown}</div>
                <div className="space-y-2 mt-3">
                  {choiceReviews.map((item, reviewIndex) => (
                    <div
                      key={`${q.id}-review-${reviewIndex}`}
                      className={`rounded-xl border px-3 py-3 ${item.isCorrect ? "border-green-500/30 bg-green-500/10" : dark ? "border-ink-400 bg-ink-800" : "border-gray-200 bg-white"}`}
                    >
                      <div className="flex items-start gap-2">
                        <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold ${item.isCorrect ? "border-green-500 text-green-500" : dark ? "border-ink-300 text-gray-300" : "border-gray-300 text-gray-600"}`}>
                          {String.fromCharCode(65 + reviewIndex)}
                        </span>
                        <div className="flex-1">
                          <div className="text-xs font-semibold">
                            {item.choice}
                          </div>
                          <div className={`text-[11px] mt-1 ${item.isCorrect ? "text-green-400" : t2}`}>
                            {item.isCorrect ? ui.labels.whyThisIsCorrect : ui.labels.whyThisIsNotBest}
                          </div>
                          <div className={`text-xs leading-6 mt-2 ${item.isCorrect ? "text-green-200" : t2}`}>
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
        )}

        <div className="flex justify-end mt-5">
          {picked !== null && (
            <button
              onClick={next}
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-violet-500 text-white hover:bg-violet-600 transition flex items-center gap-1"
            >
              {idx + 1 >= pool.length ? ui.labels.seeResults : ui.actions.next} <ChevronRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function buildCorrectReview(question, note) {
  return [
    question.explain,
    note?.explanation,
    note?.examCue,
  ].filter(Boolean).join(" ");
}

function buildChoiceReason({ question, choice, index, objective, note }) {
  if (index === question.answer) {
    return buildCorrectReview(question, note);
  }

  const correctChoice = question.choices[question.answer];
  const objectiveFocus = objective?.title
    ? `This question is testing ${objective.title.toLowerCase()}.`
    : "";
  const trap = note?.pitfalls?.[0]
    ? `Common trap: ${note.pitfalls[0]}`
    : "";

  return [
    `${choice} does not best match what the prompt is asking for.`,
    objectiveFocus,
    `${correctChoice} is the better answer here because ${question.explain.charAt(0).toLowerCase()}${question.explain.slice(1)}`,
    trap,
  ].filter(Boolean).join(" ");
}
