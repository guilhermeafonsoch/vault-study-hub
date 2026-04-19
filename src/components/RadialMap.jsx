import { useEffect, useMemo, useRef, useState } from "react";
import { Compass, MapPinned } from "lucide-react";
import { SurfaceCard, SurfaceIntro, SurfaceKicker, SurfaceStat, getSurfaceTokens } from "./SurfacePrimitives.jsx";
import { useLocale } from "../i18n/LocaleContext.jsx";

export default function RadialMap({ studied, onSelect, dark, domainProgress }) {
  const { domains, connections, domainGuides, ui } = useLocale();
  const tokens = getSurfaceTokens(dark);
  const containerRef = useRef(null);
  const [dims, setDims] = useState({ w: 680, h: 600 });
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return undefined;

    const observer = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      setDims({ w: Math.max(width, 320), h: Math.max(width * 0.82, 420) });
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const cx = dims.w / 2;
  const cy = dims.h / 2;
  const radius = Math.min(cx, cy) * 0.66;
  const nodeRadius = Math.min(46, radius * 0.28);

  const positions = useMemo(
    () =>
      domains.map((_, index) => {
        const angle = (index / domains.length) * Math.PI * 2 - Math.PI / 2;
        return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
      }),
    [cx, cy, domains, radius]
  );

  const stroke = dark ? "rgba(255,255,255,0.18)" : "rgba(18,22,25,0.16)";
  const hubFill = dark ? "#0d1523" : "#ffffff";
  const hubStroke = dark ? "rgba(255,255,255,0.16)" : "rgba(18,22,25,0.14)";
  const labelColor = dark ? "#d0d7de" : "#4b5563";
  const subLabel = dark ? "#8d98a5" : "#6b7280";
  const activeDomain = hovered ? domains.find((domain) => domain.id === hovered) : null;
  const activeGuide = activeDomain ? domainGuides[activeDomain.id] : null;
  const progressAverage = Math.round(domains.reduce((sum, domain) => sum + domainProgress(domain), 0) / domains.length);
  const studiedCount = Object.values(studied).filter(Boolean).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <SurfaceIntro
        dark={dark}
        tone="mixed"
        eyebrow={ui.views.map}
        title={ui.labels.mapExamChain}
        body={ui.home.modes.map}
        stats={[
          <SurfaceStat key="domains" dark={dark} label={ui.labels.domain} value={`${domains.length}`} body={ui.labels.hoverCue} />,
          <SurfaceStat key="studied" dark={dark} label={ui.labels.studied} value={`${studiedCount}`} body={ui.labels.localProgress} tone="purple" />,
          <SurfaceStat key="avg" dark={dark} label={ui.labels.focus} value={`${progressAverage}%`} body={ui.labels.mapIntroBody} />,
        ]}
      />

      <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <SurfaceCard dark={dark}>
          <SurfaceKicker tone="blue">
            <MapPinned size={13} />
            {ui.views.map}
          </SurfaceKicker>
          <div ref={containerRef} className={`relative mt-5 w-full overflow-hidden rounded-[28px] border ${dark ? "border-white/10" : "border-black/10"}`}>
            <div className="vault-grid absolute inset-0 opacity-60" />
            <svg width={dims.w} height={dims.h} className="relative block mx-auto">
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                {domains.map((domain) => (
                  <radialGradient key={`gradient-${domain.id}`} id={`gradient-${domain.id}`}>
                    <stop offset="0%" stopColor={domain.color} stopOpacity={dark ? 0.28 : 0.16} />
                    <stop offset="100%" stopColor={domain.color} stopOpacity={0} />
                  </radialGradient>
                ))}
              </defs>

              {connections.map(([left, right], index) => {
                const from = positions[left - 1];
                const to = positions[right - 1];
                if (!from || !to) return null;
                const domain = domains[left - 1];
                const isHighlighted = hovered === left || hovered === right;
                const midX = (from.x + to.x) / 2;
                const midY = (from.y + to.y) / 2;
                const deltaX = to.x - from.x;
                const deltaY = to.y - from.y;
                const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY) || 1;
                const normalX = (-deltaY / length) * 22;
                const normalY = (deltaX / length) * 22;
                const controlX = midX + normalX;
                const controlY = midY + normalY;

                return (
                  <g key={`connection-${index}`}>
                    <path
                      d={`M${from.x},${from.y} Q${controlX},${controlY} ${to.x},${to.y}`}
                      fill="none"
                      stroke={isHighlighted ? domain.color : stroke}
                      strokeWidth={isHighlighted ? 2.5 : 1}
                      strokeDasharray={isHighlighted ? "" : "4 3"}
                      opacity={isHighlighted ? 0.9 : 0.35}
                      style={{ transition: "all 0.35s ease" }}
                    />
                  </g>
                );
              })}

              <circle cx={cx} cy={cy} r={nodeRadius * 1.35} fill={hubFill} stroke={hubStroke} strokeWidth={1.5} />
              <circle cx={cx} cy={cy} r={nodeRadius * 1.35 - 4} fill="none" stroke={hubStroke} strokeWidth={0.5} strokeDasharray="3 2" opacity={0.6} />
              <text x={cx} y={cy - 10} textAnchor="middle" dominantBaseline="central" fill={dark ? "#ffffff" : "#121619"} fontSize={12} fontWeight={800} fontFamily="IBM Plex Sans, sans-serif">VAULT</text>
              <text x={cx} y={cy + 6} textAnchor="middle" dominantBaseline="central" fill={subLabel} fontSize={9.5}>Associate</text>
              <text x={cx} y={cy + 20} textAnchor="middle" dominantBaseline="central" fill={subLabel} fontSize={8.5} opacity={0.7}>(003) · v1.16</text>

              {positions.map((position, index) => (
                <line key={`spoke-${index}`} x1={cx} y1={cy} x2={position.x} y2={position.y} stroke={dark ? "#22252f" : "#dde1e6"} strokeWidth={0.5} opacity={0.45} />
              ))}

              {domains.map((domain, index) => {
                const position = positions[index];
                const progress = domainProgress(domain);
                const isHovered = hovered === domain.id;
                const scale = isHovered ? 1.13 : 1;
                const circumference = 2 * Math.PI * nodeRadius;
                const dashOffset = circumference * (1 - progress / 100);

                return (
                  <g
                    key={domain.id}
                    className="cursor-pointer"
                    style={{ transition: "transform 0.25s ease", transformOrigin: `${position.x}px ${position.y}px`, transform: `scale(${scale})` }}
                    onMouseEnter={() => setHovered(domain.id)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => onSelect(domain)}
                  >
                    {isHovered ? <circle cx={position.x} cy={position.y} r={nodeRadius + 18} fill={`url(#gradient-${domain.id})`} /> : null}
                    <circle cx={position.x} cy={position.y} r={nodeRadius} fill={hubFill} stroke={isHovered ? domain.color : hubStroke} strokeWidth={isHovered ? 2 : 1} style={{ transition: "all 0.3s" }} />
                    <circle
                      cx={position.x}
                      cy={position.y}
                      r={nodeRadius}
                      fill="none"
                      stroke={domain.color}
                      strokeWidth={3}
                      strokeDasharray={circumference}
                      strokeDashoffset={dashOffset}
                      strokeLinecap="round"
                      opacity={0.8}
                      transform={`rotate(-90 ${position.x} ${position.y})`}
                      style={{ transition: "stroke-dashoffset 0.6s ease" }}
                    />
                    <text x={position.x} y={position.y - 4} textAnchor="middle" dominantBaseline="central" fontSize={20}>{domain.icon}</text>
                    <text x={position.x} y={position.y + 15} textAnchor="middle" dominantBaseline="central" fill={subLabel} fontSize={8.5} fontWeight={600}>D{domain.id}</text>
                    {progress === 100 ? <circle cx={position.x + nodeRadius * 0.65} cy={position.y - nodeRadius * 0.65} r={7} fill="#24a148" stroke={hubFill} strokeWidth={2} /> : null}
                    <text x={position.x} y={position.y + nodeRadius + 16} textAnchor="middle" dominantBaseline="central" fill={isHovered ? domain.color : labelColor} fontSize={10.5} fontWeight={isHovered ? 700 : 500}>
                      {domain.mapLabel ?? (domain.label.length > 20 ? `${domain.label.slice(0, 18)}…` : domain.label)}
                    </text>
                    <text x={position.x} y={position.y + nodeRadius + 29} textAnchor="middle" dominantBaseline="central" fill={domain.color} fontSize={9} fontWeight={600} opacity={0.85}>
                      {progress}%
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          <div className={`pt-4 text-center text-[11px] ${tokens.muted}`}>{ui.labels.hoverCue}</div>
        </SurfaceCard>

        <SurfaceCard dark={dark}>
          <SurfaceKicker tone="purple">
            <Compass size={13} />
            {ui.labels.howToReadMap}
          </SurfaceKicker>

          {!activeDomain || !activeGuide ? (
            <div className="mt-4 space-y-4">
              <div className="display-font text-3xl font-semibold">{ui.labels.mapCue}</div>
              <div className={`text-sm leading-7 ${tokens.muted}`}>{ui.labels.mapIntroBody}</div>
              <div className="space-y-2">
                {connections.map(([left, right, label]) => (
                  <div key={`${left}-${right}-${label}`} className={`${tokens.soft} rounded-[20px] border px-4 py-3 text-xs leading-6`}>
                    <span style={{ color: domains[left - 1].color }}>{domains[left - 1].icon}</span>
                    {" → "}
                    <span style={{ color: domains[right - 1].color }}>{domains[right - 1].icon}</span>
                    <span className={`ml-2 ${tokens.muted}`}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <div className="flex items-start gap-3">
                <div className="text-3xl">{activeDomain.icon}</div>
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: activeDomain.color }}>
                    {ui.labels.domain} {activeDomain.id}
                  </div>
                  <div className="mt-2 text-xl font-semibold">{activeDomain.label}</div>
                  <div className={`mt-2 text-sm leading-7 ${tokens.muted}`}>{activeGuide.focus}</div>
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                <div className={`${tokens.soft} rounded-[20px] border p-4`}>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--ibm-blue-30)" }}>
                    {ui.labels.mapCue}
                  </div>
                  <div className={`mt-2 text-xs leading-6 ${tokens.muted}`}>{activeGuide.mentalModel[0]}</div>
                </div>
                <div className={`${tokens.soft} rounded-[20px] border p-4`}>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: "#f1c21b" }}>
                    {ui.labels.commonTraps}
                  </div>
                  <div className={`mt-2 text-xs leading-6 ${tokens.muted}`}>{activeGuide.commonTraps[0]}</div>
                </div>
              </div>
            </div>
          )}
        </SurfaceCard>
      </section>
    </div>
  );
}
