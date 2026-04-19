const TONE_STYLES = {
  blue: {
    kicker: "var(--ibm-blue-30)",
    line: "var(--ibm-blue-60)",
    glow: "rgba(15, 98, 254, 0.18)",
    glowSoft: "rgba(15, 98, 254, 0.08)",
  },
  purple: {
    kicker: "var(--ibm-purple-40)",
    line: "var(--ibm-purple-40)",
    glow: "rgba(190, 149, 255, 0.18)",
    glowSoft: "rgba(190, 149, 255, 0.08)",
  },
  mixed: {
    kicker: "var(--ibm-blue-30)",
    line: "var(--ibm-blue-60)",
    glow: "rgba(15, 98, 254, 0.18)",
    glowSoft: "rgba(190, 149, 255, 0.08)",
  },
  amber: {
    kicker: "#f1c21b",
    line: "#f1c21b",
    glow: "rgba(241, 194, 27, 0.16)",
    glowSoft: "rgba(241, 194, 27, 0.08)",
  },
};

export function getSurfaceTokens(dark) {
  return {
    shell: dark ? "border-white/10 bg-[#0a0f18] text-gray-100" : "border-black/10 bg-white text-gray-900",
    panel: dark ? "border-white/10 bg-white/[0.03] text-gray-100" : "border-black/10 bg-white/90 text-gray-900",
    panelStrong: dark ? "border-white/10 bg-[#0d1523] text-gray-100" : "border-black/10 bg-white text-gray-900",
    soft: dark ? "border-white/10 bg-white/[0.04]" : "border-black/10 bg-[#f7f9fc]",
    inset: dark ? "border-white/10 bg-black/20" : "border-black/10 bg-white/80",
    chip: dark ? "border-white/10 bg-black/20 text-gray-100 hover:bg-white/[0.06]" : "border-black/10 bg-white text-gray-900 hover:bg-[#f7f9fc]",
    muted: dark ? "text-[#a2a9b0]" : "text-[#525252]",
    faint: dark ? "text-[#6f7984]" : "text-[#697077]",
    track: dark ? "bg-white/10" : "bg-black/10",
  };
}

export function getToneStyles(tone = "blue") {
  return TONE_STYLES[tone] ?? TONE_STYLES.blue;
}

export function getIntroBackground(dark, tone = "blue") {
  const tones = getToneStyles(tone);
  return dark
    ? `linear-gradient(150deg, rgba(0, 0, 0, 0.98), rgba(10, 15, 24, 0.96)), radial-gradient(circle at 18% 18%, ${tones.glow}, transparent 28%), radial-gradient(circle at 82% 16%, ${tones.glowSoft}, transparent 30%)`
    : `linear-gradient(150deg, rgba(255,255,255,0.98), rgba(242,244,248,0.98)), radial-gradient(circle at 18% 18%, ${tones.glowSoft}, transparent 28%), radial-gradient(circle at 82% 16%, ${tones.glow}, transparent 30%)`;
}

export function SurfaceIntro({ dark, tone = "blue", eyebrow, title, body, actions, stats, aside, className = "" }) {
  const tokens = getSurfaceTokens(dark);
  const tones = getToneStyles(tone);

  return (
    <section
      className={`${tokens.shell} relative overflow-hidden rounded-[36px] border ${className}`}
      style={{ background: getIntroBackground(dark, tone) }}
    >
      <div
        className="absolute inset-x-0 top-0 h-1"
        style={{
          background:
            tone === "purple"
              ? "linear-gradient(90deg, var(--ibm-purple-40), var(--ibm-blue-60))"
              : "linear-gradient(90deg, var(--ibm-blue-60), var(--ibm-purple-40))",
        }}
      />

      <div className={`grid gap-6 p-6 md:p-8 ${aside ? "xl:grid-cols-[1.08fr_0.92fr] xl:items-start" : ""}`}>
        <div className="max-w-3xl">
          {eyebrow && (
            <div
              className={`mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] ${dark ? "border-white/10 bg-white/[0.03]" : "border-black/10 bg-white/80"}`}
              style={{ color: tones.kicker }}
            >
              {eyebrow}
            </div>
          )}

          <div className="max-w-2xl">
            <h1 className="display-font text-3xl font-semibold leading-[0.98] md:text-5xl">{title}</h1>
            {body && <p className={`mt-4 max-w-2xl text-sm leading-7 ${tokens.muted}`}>{body}</p>}
          </div>

          {actions && <div className="mt-6 flex flex-wrap gap-2.5">{actions}</div>}
          {stats?.length ? <div className="mt-8 grid gap-3 md:grid-cols-3">{stats}</div> : null}
        </div>

        {aside ? <div>{aside}</div> : null}
      </div>
    </section>
  );
}

export function SurfaceStat({ dark, label, value, body, tone = "blue" }) {
  const tokens = getSurfaceTokens(dark);
  const tones = getToneStyles(tone);

  return (
    <div className={`${tokens.soft} rounded-[24px] border p-4`}>
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: tones.kicker }}>
        {label}
      </div>
      <div className="display-font mt-2 text-2xl font-semibold leading-none">{value}</div>
      {body ? <div className={`mt-2 text-xs leading-6 ${tokens.muted}`}>{body}</div> : null}
    </div>
  );
}

export function SurfaceCard({ dark, children, className = "", style }) {
  const tokens = getSurfaceTokens(dark);
  return (
    <div className={`${tokens.panel} rounded-[32px] border p-5 md:p-6 ${className}`} style={style}>
      {children}
    </div>
  );
}

export function SurfaceKicker({ tone = "blue", children, className = "" }) {
  const tones = getToneStyles(tone);
  return (
    <div className={`flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] ${className}`} style={{ color: tones.kicker }}>
      {children}
    </div>
  );
}

export function SurfaceLink({ dark, href, children, icon }) {
  const tokens = getSurfaceTokens(dark);
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium transition ${tokens.chip}`}
    >
      {children}
      {icon}
    </a>
  );
}
