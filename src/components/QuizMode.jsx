import { useMemo, useState } from "react";
import { Check, X, RotateCcw, ChevronRight, Trophy } from "lucide-react";
import { shuffle } from "../data/quiz.js";
import { useLocale } from "../i18n/LocaleContext.jsx";

export default function QuizMode({ dark }) {
  const { domains, quiz, totalObjectives, allObjectives, ui } = useLocale();
  const [filter, setFilter] = useState("all"); // domain id or "all"
  const [order, setOrder] = useState(() => shuffle(quiz.map((q) => q.id)));
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [correct, setCorrect] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [finished, setFinished] = useState(false);

  const card = dark ? "bg-ink-600" : "bg-white";
  const brd = dark ? "border-ink-400" : "border-gray-200";
  const t2 = dark ? "text-gray-400" : "text-gray-500";

  const pool = useMemo(() => {
    const ids = order
      .map((id) => quiz.find((q) => q.id === id))
      .filter(Boolean)
      .filter((q) => filter === "all" || q.obj.startsWith(String(filter)));
    return ids;
  }, [filter, order, quiz]);
  const objectiveLookup = useMemo(
    () => Object.fromEntries(allObjectives.map((objective) => [objective.id, objective])),
    [allObjectives]
  );
  const coveredObjectives = useMemo(() => new Set(quiz.map((question) => question.obj)).size, [quiz]);

  const q = pool[idx];
  const objective = q ? objectiveLookup[q.obj] : null;

  const reset = (nextFilter = filter) => {
    setOrder(shuffle(quiz.map((x) => x.id)));
    setIdx(0);
    setPicked(null);
    setCorrect(0);
    setAnswered(0);
    setFinished(false);
    setFilter(nextFilter);
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
  return (
    <div className="max-w-2xl mx-auto">
      {/* Filter pills */}
      <div className="flex flex-wrap gap-1 mb-4">
        <button
          onClick={() => reset("all")}
          className={`text-[11px] px-2.5 py-1 rounded border ${filter === "all" ? "bg-violet-500 text-white border-violet-500" : `${card} ${brd}`}`}
        >{ui.labels.all} ({quiz.length})</button>
        {domains.map((d) => {
          const n = quiz.filter((q) => q.obj.startsWith(String(d.id))).length;
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
      </div>

      <div className={`text-[11px] ${t2} mb-3`}>
        {ui.labels.singleAnswerMode} · {coveredObjectives} / {totalObjectives} {ui.labels.objectives}
      </div>

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
          {ui.labels.objective} {q.obj}{objective ? ` · ${objective.title}` : ""}
        </div>
        <div className="text-base font-semibold leading-7 mb-5">{q.question}</div>

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
          <div className={`mt-4 p-3 rounded-lg text-xs leading-6 ${isCorrect ? "bg-green-500/10 text-green-300" : "bg-red-500/10 text-red-300"}`}>
            <strong>{isCorrect ? `${ui.labels.correctAnswer} ` : `${ui.labels.incorrectAnswer} `}</strong>{q.explain}
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
