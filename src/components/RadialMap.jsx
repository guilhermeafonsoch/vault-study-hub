import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale } from "../i18n/LocaleContext.jsx";

export default function RadialMap({ studied, onSelect, dark, domainProgress }) {
  const { domains, connections, domainGuides, ui } = useLocale();
  const containerRef = useRef(null);
  const [dims, setDims] = useState({ w: 680, h: 600 });
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      setDims({ w: Math.max(width, 320), h: Math.max(width * 0.82, 420) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const cx = dims.w / 2;
  const cy = dims.h / 2;
  const R = Math.min(cx, cy) * 0.66;
  const nodeR = Math.min(46, R * 0.28);

  const positions = useMemo(
    () =>
      domains.map((_, i) => {
        const angle = (i / domains.length) * Math.PI * 2 - Math.PI / 2;
        return { x: cx + R * Math.cos(angle), y: cy + R * Math.sin(angle) };
      }),
    [cx, cy, domains, R]
  );

  const stroke = dark ? "#333946" : "#cbd5e1";
  const hubFill = dark ? "#1a1d27" : "#ffffff";
  const hubStroke = dark ? "#3b3f52" : "#9ca3af";
  const labelColor = dark ? "#c9ccd5" : "#4b5563";
  const subLabel = dark ? "#9ca3af" : "#6b7280";
  const card = dark ? "bg-ink-600 border-ink-400" : "bg-white border-gray-200";
  const muted = dark ? "text-gray-400" : "text-gray-500";
  const activeDomain = hovered ? domains.find((domain) => domain.id === hovered) : null;
  const activeGuide = activeDomain ? domainGuides[activeDomain.id] : null;

  return (
    <div ref={containerRef} className="w-full relative">
      <svg width={dims.w} height={dims.h} className="block mx-auto">
        <defs>
          <filter id="glow"><feGaussianBlur stdDeviation="3" result="g" /><feMerge><feMergeNode in="g" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          {domains.map((d) => (
            <radialGradient key={`rg${d.id}`} id={`rg${d.id}`}>
              <stop offset="0%" stopColor={d.color} stopOpacity={dark ? 0.3 : 0.15} />
              <stop offset="100%" stopColor={d.color} stopOpacity={0} />
            </radialGradient>
          ))}
        </defs>

        {/* Connection arcs */}
        {connections.map(([a, b], i) => {
          const pa = positions[a - 1];
          const pb = positions[b - 1];
          if (!pa || !pb) return null;
          const da = domains[a - 1];
          const isHov = hovered === a || hovered === b;
          const mx = (pa.x + pb.x) / 2;
          const my = (pa.y + pb.y) / 2;
          const dx = pb.x - pa.x;
          const dy = pb.y - pa.y;
          const len = Math.sqrt(dx * dx + dy * dy) || 1;
          const nx = (-dy / len) * 22;
          const ny = (dx / len) * 22;
          const cpx = mx + nx;
          const cpy = my + ny;
          return (
            <g key={i}>
              <path
                d={`M${pa.x},${pa.y} Q${cpx},${cpy} ${pb.x},${pb.y}`}
                fill="none"
                stroke={isHov ? da.color : stroke}
                strokeWidth={isHov ? 2.5 : 1}
                strokeDasharray={isHov ? "" : "4 3"}
                opacity={isHov ? 0.9 : 0.35}
                style={{ transition: "all 0.35s ease" }}
              />
              {isHov && (
                <circle cx={cpx} cy={cpy - 10} r={2} fill={da.color} opacity={0.7}>
                  <animate attributeName="r" values="2;5;2" dur="1.8s" repeatCount="indefinite" />
                </circle>
              )}
            </g>
          );
        })}

        {/* Center hub */}
        <circle cx={cx} cy={cy} r={nodeR * 1.35} fill={hubFill} stroke={hubStroke} strokeWidth={1.5} />
        <circle cx={cx} cy={cy} r={nodeR * 1.35 - 4} fill="none" stroke={hubStroke} strokeWidth={0.5} strokeDasharray="3 2" opacity={0.6} />
        <text x={cx} y={cy - 10} textAnchor="middle" dominantBaseline="central" fill={dark ? "#e8e6e3" : "#1a1a2e"} fontSize={12} fontWeight={800} fontFamily="Inter,system-ui">VAULT</text>
        <text x={cx} y={cy + 6} textAnchor="middle" dominantBaseline="central" fill={subLabel} fontSize={9.5}>Associate</text>
        <text x={cx} y={cy + 20} textAnchor="middle" dominantBaseline="central" fill={subLabel} fontSize={8.5} opacity={0.7}>(003) · v1.16</text>

        {/* Spokes */}
        {positions.map((p, i) => (
          <line key={`spoke${i}`} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke={dark ? "#22252f" : "#e5e7eb"} strokeWidth={0.5} opacity={0.45} />
        ))}

        {/* Domain nodes */}
        {domains.map((d, i) => {
          const p = positions[i];
          const prog = domainProgress(d);
          const isHov = hovered === d.id;
          const scale = isHov ? 1.13 : 1;
          const circumference = 2 * Math.PI * nodeR;
          const offset = circumference * (1 - prog / 100);
          return (
            <g
              key={d.id}
              className="cursor-pointer"
              style={{ transition: "transform 0.25s ease", transformOrigin: `${p.x}px ${p.y}px`, transform: `scale(${scale})` }}
              onMouseEnter={() => setHovered(d.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onSelect(d)}
            >
              {isHov && <circle cx={p.x} cy={p.y} r={nodeR + 18} fill={`url(#rg${d.id})`} />}
              <circle cx={p.x} cy={p.y} r={nodeR} fill={hubFill} stroke={isHov ? d.color : (dark ? "#2a2d3a" : "#d1d5db")} strokeWidth={isHov ? 2 : 1} style={{ transition: "all 0.3s" }} />
              <circle
                cx={p.x}
                cy={p.y}
                r={nodeR}
                fill="none"
                stroke={d.color}
                strokeWidth={3}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                opacity={0.75}
                transform={`rotate(-90 ${p.x} ${p.y})`}
                style={{ transition: "stroke-dashoffset 0.6s ease" }}
              />
              <text x={p.x} y={p.y - 4} textAnchor="middle" dominantBaseline="central" fontSize={20}>{d.icon}</text>
              <text x={p.x} y={p.y + 15} textAnchor="middle" dominantBaseline="central" fill={subLabel} fontSize={8.5} fontWeight={600}>D{d.id}</text>
              {prog === 100 && <circle cx={p.x + nodeR * 0.65} cy={p.y - nodeR * 0.65} r={7} fill="#22c55e" stroke={hubFill} strokeWidth={2} />}
              <text x={p.x} y={p.y + nodeR + 16} textAnchor="middle" dominantBaseline="central" fill={isHov ? d.color : labelColor} fontSize={10.5} fontWeight={isHov ? 700 : 500} style={{ transition: "all 0.3s" }}>
                {d.mapLabel ?? (d.label.length > 20 ? d.label.slice(0, 18) + "…" : d.label)}
              </text>
              <text x={p.x} y={p.y + nodeR + 29} textAnchor="middle" dominantBaseline="central" fill={d.color} fontSize={9} fontWeight={600} opacity={0.8}>
                {prog}%
              </text>
            </g>
          );
        })}
      </svg>

      <div className={`text-center text-[11px] ${muted} pt-1`}>
        {ui.labels.hoverCue}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-1.5 justify-center pt-1 pb-2 max-w-3xl mx-auto">
        {connections.map(([a, b, label], i) => (
          <span
            key={i}
            className={`text-[10px] ${dark ? "bg-ink-600 border-ink-400 text-gray-400" : "bg-gray-100 border-gray-200 text-gray-600"} px-2 py-0.5 rounded border`}
          >
            <span style={{ color: domains[a - 1].color }}>{domains[a - 1].icon}</span>
            {" → "}
            <span style={{ color: domains[b - 1].color }}>{domains[b - 1].icon}</span>
            {" "}{label}
          </span>
        ))}
      </div>

      <div className={`max-w-3xl mx-auto border rounded-2xl p-4 ${card}`}>
        {!activeDomain && (
          <div className="space-y-3">
            <div className="text-[11px] font-bold tracking-[0.18em] text-emerald-500 uppercase">{ui.labels.howToReadMap}</div>
            <div className="text-sm font-semibold">{ui.labels.mapExamChain}</div>
            <div className={`text-xs leading-6 ${muted}`}>
              {ui.labels.mapIntroBody}
            </div>
          </div>
        )}

        {activeDomain && activeGuide && (
          <div>
            <div className="flex items-start gap-3">
                <div className="text-3xl">{activeDomain.icon}</div>
              <div className="min-w-0">
                <div className="text-[11px] font-bold tracking-wide uppercase" style={{ color: activeDomain.color }}>
                  {ui.labels.domain} {activeDomain.id}
                </div>
                <div className="text-sm font-semibold">{activeDomain.label}</div>
                <div className={`text-xs leading-6 mt-1 ${muted}`}>{activeGuide.focus}</div>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2 mt-4">
              <div className={`${dark ? "bg-ink-800 border-ink-400" : "bg-gray-50 border-gray-200"} border rounded-2xl p-3`}>
                <div className="text-[11px] font-semibold mb-1">{ui.labels.mapCue}</div>
                <div className={`text-xs leading-6 ${muted}`}>{activeGuide.mentalModel[0]}</div>
              </div>
              <div className={`${dark ? "bg-ink-800 border-ink-400" : "bg-gray-50 border-gray-200"} border rounded-2xl p-3`}>
                <div className="text-[11px] font-semibold mb-1">{ui.labels.commonTraps}</div>
                <div className={`text-xs leading-6 ${muted}`}>{activeGuide.commonTraps[0]}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
