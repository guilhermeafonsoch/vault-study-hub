import { CheckCircle2 } from "lucide-react";
import { useLocale } from "../i18n/LocaleContext.jsx";

export default function StatsDashboard({ studied, dark }) {
  const { domains, quiz, totalObjectives, ui } = useLocale();
  const studiedCount = Object.values(studied).filter(Boolean).length;
  const pct = Math.round((studiedCount / totalObjectives) * 100);
  const readiness = pct < 30 ? ui.labels.foundations : pct < 60 ? ui.labels.buildingRecall : pct < 85 ? ui.labels.solidCoverage : ui.labels.finalReview;
  const ring = 2 * Math.PI * 70;
  const offset = ring * (1 - pct / 100);
  const quizCoverage = new Set(quiz.map((question) => question.obj)).size;
  const quizPct = Math.round((quizCoverage / totalObjectives) * 100);

  const card = dark ? "bg-ink-600" : "bg-white";
  const brd = dark ? "border-ink-400" : "border-gray-200";
  const t2 = dark ? "text-gray-400" : "text-gray-500";

  return (
    <div className="grid gap-4 animate-fade-in" style={{ gridTemplateColumns: "minmax(260px, 320px) 1fr" }}>
      {/* Overall ring */}
      <div className="space-y-4">
        <div className={`${card} border ${brd} rounded-2xl p-6 flex flex-col items-center justify-center`}>
          <svg width={180} height={180}>
            <circle cx={90} cy={90} r={70} fill="none" stroke={dark ? "#2a2d3a" : "#e5e7eb"} strokeWidth={10} />
            <circle
              cx={90}
              cy={90}
              r={70}
              fill="none"
              stroke={pct >= 85 ? "#22c55e" : pct >= 50 ? "#eab308" : "#7F77DD"}
              strokeWidth={10}
              strokeLinecap="round"
              strokeDasharray={ring}
              strokeDashoffset={offset}
              transform="rotate(-90 90 90)"
              style={{ transition: "stroke-dashoffset 0.8s ease" }}
            />
            <text x={90} y={85} textAnchor="middle" fontSize={32} fontWeight={800} fill={dark ? "#fff" : "#111"}>{pct}%</text>
            <text x={90} y={108} textAnchor="middle" fontSize={11} fill={dark ? "#9ca3af" : "#6b7280"}>{studiedCount} / {totalObjectives}</text>
          </svg>
          <div className={`text-sm font-semibold mt-2 ${pct >= 85 ? "text-green-500" : pct >= 50 ? "text-amber-500" : "text-violet-400"}`}>
            {readiness}
          </div>
          <div className={`text-[11px] ${t2} mt-1 text-center`}>Vault 1.16 · {ui.labels.hourExam} · {ui.labels.onlineProctored}</div>
          <div className={`text-[11px] ${t2} mt-3 text-center leading-5`}>
            {ui.labels.localOnlyStats}
          </div>
        </div>

        <div className={`${card} border ${brd} rounded-2xl p-4 space-y-3`}>
          <div>
            <div className="text-[11px] font-semibold">{ui.labels.objectiveCoverage}</div>
            <div className={`text-xs ${t2} mt-1`}>{ui.labels.localProgress}</div>
            <div className="text-sm font-bold mt-1">{ui.labels.coverageFull(totalObjectives, totalObjectives)}</div>
          </div>
          <div>
            <div className="text-[11px] font-semibold">{ui.labels.quizCoverage}</div>
            <div className={`text-xs ${t2} mt-1`}>{ui.labels.singleAnswerMode}</div>
            <div className="text-sm font-bold mt-1">{ui.labels.quizCoverageCount(quizCoverage, totalObjectives, quizPct)}</div>
          </div>
        </div>
      </div>

      {/* Per-domain bars */}
      <div className={`${card} border ${brd} rounded-2xl p-6`}>
        <div className="text-sm font-bold mb-4">{ui.labels.domainProgress}</div>
        <div className="space-y-3">
          {domains.map((d) => {
            const done = d.objectives.filter((o) => studied[o.id]).length;
            const p = Math.round((done / d.objectives.length) * 100);
            const quizCount = quiz.filter((question) => question.obj.startsWith(String(d.id))).length;
            return (
              <div key={d.id}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">{d.icon}</span>
                  <span className="text-xs font-semibold flex-1">D{d.id} {d.label}</span>
                  <span className={`text-[11px] ${t2}`}>{done}/{d.objectives.length}</span>
                  {p === 100 && <CheckCircle2 size={13} className="text-green-500" />}
                </div>
                <div className={`text-[10px] ${t2} mb-1`}>
                  {ui.labels.quizCoverageByDomain(quizCount)}
                </div>
                <div className={`h-1.5 ${dark ? "bg-ink-400" : "bg-gray-200"} rounded overflow-hidden`}>
                  <div className="h-full rounded transition-all duration-500" style={{ width: `${p}%`, background: d.color }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
