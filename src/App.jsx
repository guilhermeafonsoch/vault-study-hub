import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search, Moon, Sun, BookOpen, LayoutGrid, ArrowLeft, Map, Brain, Zap, BarChart3, KeyRound, Trash2, FileText,
} from "lucide-react";
import { DOMAINS, TOTAL_OBJECTIVES } from "./data/domains.js";
import { OBJECTIVE_GUIDE } from "./data/studyGuide.js";
import { usePersistedState } from "./hooks/usePersistedState.js";
import RadialMap from "./components/RadialMap.jsx";
import DomainGrid from "./components/DomainGrid.jsx";
import DetailView from "./components/DetailView.jsx";
import CheatSheet from "./components/CheatSheet.jsx";
import QuizMode from "./components/QuizMode.jsx";
import FlashcardMode from "./components/FlashcardMode.jsx";
import SearchResults from "./components/SearchResults.jsx";
import StudyTimer from "./components/StudyTimer.jsx";
import StatsDashboard from "./components/StatsDashboard.jsx";
import StudyGuide from "./components/StudyGuide.jsx";

const VIEWS = [
  ["guide", FileText, "Guide"],
  ["map", Map, "Mind Map"],
  ["grid", LayoutGrid, "Grid"],
  ["cheat", BookOpen, "Cheat"],
  ["flash", Zap, "Flashcards"],
  ["quiz", Brain, "Quiz"],
  ["stats", BarChart3, "Stats"],
];

export default function App() {
  const [dark, setDark] = usePersistedState("vh.dark", true);
  const [view, setView] = useState("guide");
  const [activeDomain, setActiveDomain] = useState(null);
  const [expandedObj, setExpandedObj] = useState({});
  const [studied, setStudied] = usePersistedState("vh.studied", {});
  const [search, setSearch] = useState("");

  const toggleObj = useCallback((id) => setExpandedObj((p) => ({ ...p, [id]: !p[id] })), []);
  const markObj = useCallback((id) => setStudied((p) => ({ ...p, [id]: !p[id] })), [setStudied]);
  const domainProgress = useCallback((d) => {
    const done = d.objectives.filter((o) => studied[o.id]).length;
    return Math.round((done / d.objectives.length) * 100);
  }, [studied]);

  const studiedCount = useMemo(() => Object.values(studied).filter(Boolean).length, [studied]);
  const pct = Math.round((studiedCount / TOTAL_OBJECTIVES) * 100);
  const readiness = pct < 30 ? "Beginner" : pct < 60 ? "Intermediate" : pct < 85 ? "Advanced" : "Exam Ready!";

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return DOMAINS;
    return DOMAINS.map((d) => ({
      ...d,
      objectives: d.objectives.filter((o) =>
        o.title.toLowerCase().includes(q) ||
        o.concepts.some((c) => c.toLowerCase().includes(q)) ||
        o.cli.some((c) => c.toLowerCase().includes(q)) ||
        o.tip.toLowerCase().includes(q) ||
        (OBJECTIVE_GUIDE[o.id]?.explanation || "").toLowerCase().includes(q) ||
        (OBJECTIVE_GUIDE[o.id]?.examCue || "").toLowerCase().includes(q) ||
        (OBJECTIVE_GUIDE[o.id]?.remember || "").toLowerCase().includes(q) ||
        (OBJECTIVE_GUIDE[o.id]?.pitfalls || []).some((item) => item.toLowerCase().includes(q)) ||
        o.id.includes(q)
      ),
    })).filter((d) => d.objectives.length > 0);
  }, [search]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      const map = { "1": "guide", "2": "map", "3": "grid", "4": "cheat", "5": "flash", "6": "quiz", "7": "stats" };
      if (map[e.key]) { setView(map[e.key]); setActiveDomain(null); setSearch(""); }
      if (e.key === "/") { e.preventDefault(); document.getElementById("search-input")?.focus(); }
      if (e.key === "Escape") { setActiveDomain(null); setSearch(""); }
      if (e.key.toLowerCase() === "t") { setDark((d) => !d); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setDark]);

  const openDomain = (d) => { setActiveDomain(d); };
  const resetProgress = () => {
    if (confirm("Clear all studied progress? This cannot be undone.")) setStudied({});
  };

  // Tokens
  const bg = dark ? "bg-ink-800 text-gray-100" : "bg-gray-50 text-gray-900";
  const headerBg = dark ? "bg-ink-700" : "bg-white";
  const brd = dark ? "border-ink-400" : "border-gray-200";
  const input = dark ? "bg-ink-600 text-gray-100 placeholder-gray-500" : "bg-gray-100 text-gray-900";
  const btn = dark ? "bg-transparent hover:bg-ink-400" : "bg-transparent hover:bg-gray-100";

  const showingDetail = activeDomain && !search;
  const showingSearch = !!search.trim();

  return (
    <div className={`${bg} min-h-screen ${dark ? "" : "light"}`}>
      {/* Header */}
      <header className={`${headerBg} border-b ${brd} px-4 py-2.5 flex items-center gap-2 flex-wrap sticky top-0 z-50 backdrop-blur`}>
        {showingDetail && (
          <button
            onClick={() => setActiveDomain(null)}
            className={`flex items-center gap-1 text-sm px-2 py-1 rounded ${btn}`}
          >
            <ArrowLeft size={14} /> Back
          </button>
        )}
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <KeyRound size={18} className="text-violet-400" />
          <span className="font-bold text-base">Vault Study Hub</span>
          <span className={`text-[10px] ${dark ? "bg-ink-400" : "bg-gray-200"} px-1.5 py-0.5 rounded`}>003 · v1.16</span>
        </div>

        <div className="flex items-center gap-1.5 flex-1 min-w-[180px] max-w-[260px]">
          <Search size={14} className={dark ? "text-gray-400" : "text-gray-500"} />
          <input
            id="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search topics, commands, tips…  ( / )"
            className={`${input} border ${brd} rounded-md px-2.5 py-1 text-xs flex-1 outline-none focus:border-violet-400 transition`}
          />
        </div>

        <StudyTimer dark={dark} />

        <nav className="flex items-center gap-1 flex-wrap">
          {VIEWS.map(([v, Icon, label], i) => (
            <button
              key={v}
              onClick={() => { setView(v); setActiveDomain(null); setSearch(""); }}
              title={`${label} (${i + 1})`}
              className={`flex items-center gap-1 text-[11px] font-medium border ${brd} rounded-md px-2 py-1 transition ${view === v && !showingDetail ? "bg-violet-500 text-white border-violet-500" : btn}`}
            >
              <Icon size={12} /> {label}
            </button>
          ))}
          <button
            onClick={resetProgress}
            title="Reset progress"
            className={`p-1.5 rounded border ${brd} ${btn}`}
          >
            <Trash2 size={12} />
          </button>
          <button
            onClick={() => setDark(!dark)}
            title="Toggle theme (T)"
            className={`p-1.5 rounded border ${brd} ${btn}`}
          >
            {dark ? <Sun size={13} /> : <Moon size={13} />}
          </button>
        </nav>
      </header>

      {/* Progress bar */}
      <div className={`px-4 py-2 flex items-center gap-3 flex-wrap border-b ${brd} ${dark ? "bg-ink-900/50" : "bg-gray-100/60"}`}>
        <div className="flex items-center gap-2">
          <div className={`w-28 h-1.5 ${dark ? "bg-ink-400" : "bg-gray-200"} rounded overflow-hidden`}>
            <div
              className="h-full rounded transition-all duration-500"
              style={{
                width: `${pct}%`,
                background: pct >= 85 ? "#22c55e" : pct >= 50 ? "#eab308" : "#7F77DD",
              }}
            />
          </div>
          <span className="text-[11px] text-gray-400">{studiedCount}/{TOTAL_OBJECTIVES}</span>
        </div>
        <span className={`text-[11px] font-semibold ${pct >= 85 ? "text-green-500" : pct >= 50 ? "text-amber-500" : "text-violet-400"}`}>
          {pct}% · {readiness}
        </span>
        <span className="text-[10px] text-gray-400 ml-auto hidden md:inline">
          Shortcuts: <kbd className="px-1 bg-ink-400 rounded">1–7</kbd> views ·
          <kbd className="px-1 bg-ink-400 rounded ml-1">/</kbd> search ·
          <kbd className="px-1 bg-ink-400 rounded ml-1">T</kbd> theme ·
          <kbd className="px-1 bg-ink-400 rounded ml-1">Esc</kbd> back
        </span>
      </div>

      {/* Main */}
      <main className="p-4 max-w-[1400px] mx-auto">
        {showingSearch && (
          <SearchResults
            results={filtered}
            expandedObj={expandedObj}
            toggleObj={toggleObj}
            markObj={markObj}
            studied={studied}
            dark={dark}
            query={search}
          />
        )}

        {!showingSearch && showingDetail && (
          <DetailView
            domain={activeDomain}
            studied={studied}
            expandedObj={expandedObj}
            toggleObj={toggleObj}
            markObj={markObj}
            dark={dark}
            domainProgress={domainProgress}
          />
        )}

        {!showingSearch && !showingDetail && view === "map" && (
          <RadialMap studied={studied} onSelect={openDomain} dark={dark} domainProgress={domainProgress} />
        )}

        {!showingSearch && !showingDetail && view === "guide" && (
          <StudyGuide
            dark={dark}
            studied={studied}
            onOpenDomain={openDomain}
            onOpenMindMap={() => setView("map")}
            domainProgress={domainProgress}
          />
        )}

        {!showingSearch && !showingDetail && view === "grid" && (
          <DomainGrid studied={studied} onSelect={openDomain} dark={dark} domainProgress={domainProgress} />
        )}

        {!showingSearch && !showingDetail && view === "cheat" && (
          <CheatSheet studied={studied} markObj={markObj} dark={dark} />
        )}

        {!showingSearch && !showingDetail && view === "flash" && (
          <FlashcardMode dark={dark} studied={studied} markObj={markObj} />
        )}

        {!showingSearch && !showingDetail && view === "quiz" && <QuizMode dark={dark} />}

        {!showingSearch && !showingDetail && view === "stats" && <StatsDashboard studied={studied} dark={dark} />}
      </main>

      <footer className={`text-center text-[10px] ${dark ? "text-gray-500" : "text-gray-400"} py-6`}>
        Built for the HashiCorp Vault Associate (003) exam · Content based on Vault 1.16 docs ·{" "}
        <a
          href="https://developer.hashicorp.com/vault/tutorials/associate-cert-003/associate-review-003"
          target="_blank" rel="noreferrer"
          className="underline hover:text-violet-400"
        >Official objectives</a>
      </footer>
    </div>
  );
}
