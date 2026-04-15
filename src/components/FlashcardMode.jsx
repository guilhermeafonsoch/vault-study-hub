import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, Shuffle } from "lucide-react";
import { DOMAINS, allObjectives } from "../data/domains.js";
import { shuffle } from "../data/quiz.js";
import { OBJECTIVE_GUIDE } from "../data/studyGuide.js";

export default function FlashcardMode({ dark, studied, markObj }) {
  const [filter, setFilter] = useState("all");
  const [order, setOrder] = useState(() => allObjectives().map((_, i) => i));
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const card = dark ? "bg-ink-600" : "bg-white";
  const brd = dark ? "border-ink-400" : "border-gray-200";
  const t2 = dark ? "text-gray-400" : "text-gray-500";

  const cards = useMemo(() => {
    const all = allObjectives();
    return order
      .map((i) => all[i])
      .filter(Boolean)
      .filter((o) => filter === "all" || o.domain.id === filter);
  }, [order, filter]);

  const c = cards[idx];
  const note = c ? OBJECTIVE_GUIDE[c.id] : null;

  const reshuffle = () => {
    setOrder(shuffle(allObjectives().map((_, i) => i)));
    setIdx(0);
    setFlipped(false);
  };

  if (!c) return <div className={`text-center ${t2} py-10 text-sm`}>No cards.</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex flex-wrap gap-1 mb-4">
        <button
          onClick={() => { setFilter("all"); setIdx(0); setFlipped(false); }}
          className={`text-[11px] px-2.5 py-1 rounded border ${filter === "all" ? "bg-violet-500 text-white border-violet-500" : `${card} ${brd}`}`}
        >All ({allObjectives().length})</button>
        {DOMAINS.map((d) => (
          <button
            key={d.id}
            onClick={() => { setFilter(d.id); setIdx(0); setFlipped(false); }}
            className={`text-[11px] px-2.5 py-1 rounded border ${filter === d.id ? "text-white" : `${card} ${brd}`}`}
            style={filter === d.id ? { background: d.color, borderColor: d.color } : {}}
          >{d.icon} D{d.id}</button>
        ))}
        <button onClick={reshuffle} className={`text-[11px] px-2.5 py-1 rounded border ${card} ${brd} flex items-center gap-1 ml-auto`}>
          <Shuffle size={11} /> Shuffle
        </button>
      </div>

      <div className={`text-[11px] ${t2} mb-2`}>Card {idx + 1} / {cards.length}</div>
      <div className={`text-[11px] ${t2} mb-3`}>
        Flashcards cover all official objectives. Try answering out loud before you flip.
      </div>

      <button
        onClick={() => setFlipped((f) => !f)}
        className={`${card} border ${brd} rounded-2xl w-full p-8 min-h-[320px] text-left cursor-pointer transition-all hover:shadow-xl animate-fade-in`}
        style={{ borderTop: `4px solid ${c.domain.color}` }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">{c.domain.icon}</span>
          <div>
            <div className="text-[10px] tracking-wider font-bold" style={{ color: c.domain.color }}>DOMAIN {c.domain.id} · {c.id}</div>
            <div className="text-xs opacity-60">{flipped ? "Answer" : "Prompt"} — click to flip</div>
          </div>
        </div>

        {!flipped ? (
          <div className="py-4">
            <div className="text-xl font-semibold leading-8">{c.title}?</div>
            <div className={`text-sm leading-7 mt-3 ${t2}`}>
              Explain the objective, the best use case, and the main contrast or trap without looking.
            </div>
          </div>
        ) : (
          <div className="animate-fade-in">
            {note?.remember && (
              <div className={`mb-4 text-sm leading-6 p-3 rounded-lg ${dark ? "bg-emerald-950/30 text-emerald-200" : "bg-emerald-50 text-emerald-900"}`} style={{ borderLeft: `2px solid ${c.domain.color}` }}>
                <strong>Remember: </strong>{note.remember}
              </div>
            )}
            {note?.explanation && (
              <div className={`mb-4 text-sm leading-7 ${t2}`}>{note.explanation}</div>
            )}
            <ul className="mb-4 space-y-1.5">
              {c.concepts.map((k, i) => (
                <li key={i} className="text-sm leading-6 pl-3" style={{ borderLeft: `2px solid ${c.domain.color}66` }}>{k}</li>
              ))}
            </ul>
            {note?.examCue && (
              <div className={`text-[11px] p-2 rounded mb-3 ${dark ? "bg-violet-950/30 text-violet-200" : "bg-violet-50 text-violet-900"} leading-5`} style={{ borderLeft: `2px solid ${c.domain.color}` }}>
                <strong>Exam cue: </strong>{note.examCue}
              </div>
            )}
            <div className={`text-[11px] p-2 rounded ${dark ? "bg-amber-950/30 text-amber-200" : "bg-amber-50 text-amber-900"} leading-5`} style={{ borderLeft: "2px solid #eab308" }}>
              <strong>{note?.pitfalls?.length ? "Trap: " : "Tip: "}</strong>{note?.pitfalls?.[0] ?? c.tip}
            </div>
          </div>
        )}
      </button>

      <div className="flex items-center gap-2 mt-4 justify-center">
        <button
          onClick={() => { setIdx((i) => Math.max(0, i - 1)); setFlipped(false); }}
          disabled={idx === 0}
          className={`px-3 py-2 rounded-lg border ${card} ${brd} text-xs font-medium flex items-center gap-1 disabled:opacity-30`}
        >
          <ChevronLeft size={14} /> Prev
        </button>
        <button
          onClick={() => markObj(c.id)}
          className={`px-3 py-2 rounded-lg border text-xs font-medium ${studied[c.id] ? "bg-green-500 text-white border-green-500" : `${card} ${brd}`}`}
        >
          {studied[c.id] ? "✓ Studied" : "Mark studied"}
        </button>
        <button
          onClick={() => setFlipped((f) => !f)}
          className={`px-3 py-2 rounded-lg border ${card} ${brd} text-xs font-medium flex items-center gap-1`}
        >
          <RotateCcw size={14} /> Flip
        </button>
        <button
          onClick={() => { setIdx((i) => Math.min(cards.length - 1, i + 1)); setFlipped(false); }}
          disabled={idx >= cards.length - 1}
          className={`px-3 py-2 rounded-lg border ${card} ${brd} text-xs font-medium flex items-center gap-1 disabled:opacity-30`}
        >
          Next <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
