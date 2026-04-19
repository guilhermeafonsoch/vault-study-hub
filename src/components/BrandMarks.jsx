export function VaultMark({ size = 22, className = "" }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 72 72"
      width={size}
      height={size}
      fill="none"
    >
      <rect x="6" y="12" width="16" height="48" rx="6" fill="var(--ibm-blue-80)" />
      <rect x="28" y="6" width="16" height="60" rx="6" fill="var(--ibm-blue-60)" />
      <rect x="50" y="18" width="16" height="36" rx="6" fill="var(--ibm-purple-40)" />
      <rect x="12" y="18" width="48" height="8" rx="4" fill="rgba(255,255,255,0.18)" />
      <circle cx="58" cy="12" r="5" fill="var(--ibm-white)" fillOpacity="0.92" />
    </svg>
  );
}

export function VaultHeroGraphic({ dark, onSelectView, surfaces, caption }) {
  const panelStyle = dark
    ? {
      background:
          "radial-gradient(circle at 20% 18%, rgba(15, 98, 254, 0.28), transparent 24%), radial-gradient(circle at 82% 16%, rgba(190, 149, 255, 0.22), transparent 26%), linear-gradient(155deg, rgba(10, 14, 25, 0.98), rgba(18, 24, 38, 0.94))",
      borderColor: "rgba(162, 169, 176, 0.18)",
    }
    : {
      background:
          "radial-gradient(circle at 18% 18%, rgba(15, 98, 254, 0.12), transparent 24%), radial-gradient(circle at 82% 16%, rgba(190, 149, 255, 0.14), transparent 24%), linear-gradient(155deg, rgba(255,255,255,0.96), rgba(242,244,248,0.96))",
      borderColor: "rgba(193, 199, 205, 0.9)",
    };

  const chipStyle = dark
    ? "border-white/10 bg-black/20 text-gray-100 hover:bg-black/30"
    : "border-black/10 bg-white/80 text-gray-900 hover:bg-white";

  return (
    <div
      className="relative min-h-[340px] overflow-hidden rounded-[32px] border"
      style={panelStyle}
    >
      <div className="vault-grid absolute inset-0 opacity-70" />
      <div className="vault-scan absolute inset-x-0 top-[28%] h-px" />

      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 640 420"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <path d="M122 300L224 206L320 238L432 138L530 172" stroke="rgba(15, 98, 254, 0.42)" strokeWidth="2" />
        <path d="M108 126L224 206L332 126L432 138L546 94" stroke="rgba(190, 149, 255, 0.34)" strokeWidth="2" />
        <path d="M170 72L170 352" stroke="rgba(162, 169, 176, 0.22)" strokeWidth="1" strokeDasharray="6 10" />
        <path d="M470 48L470 338" stroke="rgba(162, 169, 176, 0.22)" strokeWidth="1" strokeDasharray="6 10" />
        <circle cx="224" cy="206" r="12" fill="var(--ibm-blue-60)" />
        <circle cx="320" cy="238" r="10" fill="var(--ibm-purple-40)" />
        <circle cx="432" cy="138" r="10" fill="var(--ibm-white)" fillOpacity="0.9" />
        <circle cx="546" cy="94" r="8" fill="var(--ibm-purple-40)" fillOpacity="0.85" />
        <rect x="252" y="116" width="138" height="172" rx="30" fill={dark ? "rgba(0, 17, 65, 0.56)" : "rgba(255,255,255,0.82)"} stroke="rgba(15, 98, 254, 0.28)" />
        <rect x="286" y="150" width="22" height="102" rx="10" fill="var(--ibm-blue-80)" />
        <rect x="320" y="126" width="22" height="150" rx="10" fill="var(--ibm-blue-60)" />
        <rect x="354" y="168" width="22" height="66" rx="10" fill="var(--ibm-purple-40)" />
        <rect x="230" y="320" width="188" height="18" rx="9" fill="rgba(15, 98, 254, 0.18)" />
        <rect x="230" y="348" width="124" height="12" rx="6" fill="rgba(190, 149, 255, 0.22)" />
      </svg>

      <div className="pointer-events-none absolute inset-0">
        {surfaces.slice(0, 4).map((surface, index) => {
          const positions = [
            "left-6 top-6",
            "right-6 top-10",
            "left-10 bottom-16",
            "right-10 bottom-8",
          ];
          return (
            <button
              key={surface.view}
              type="button"
              onClick={() => onSelectView(surface.view)}
              className={`pointer-events-auto absolute ${positions[index]} inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[11px] font-semibold transition ${chipStyle}`}
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: surface.tone }}
              />
              {surface.label}
            </button>
          );
        })}
      </div>

      <div className="absolute bottom-5 left-5 flex items-center gap-3 rounded-full border border-white/10 bg-black/15 px-4 py-2 text-[11px] font-medium text-white/80 backdrop-blur-sm">
        <VaultMark size={20} />
        <span>{caption}</span>
      </div>
    </div>
  );
}
