import { Search } from "lucide-react";
import ObjCard from "./ObjCard.jsx";
import { SurfaceCard, SurfaceIntro, SurfaceKicker, SurfaceStat, getSurfaceTokens } from "./SurfacePrimitives.jsx";
import { useLocale } from "../i18n/LocaleContext.jsx";

export default function SearchResults({ results, expandedObj, toggleObj, markObj, studied, dark, query }) {
  const { ui } = useLocale();
  const tokens = getSurfaceTokens(dark);
  const total = results.reduce((sum, domain) => sum + domain.objectives.length, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <SurfaceIntro
        dark={dark}
        tone="blue"
        eyebrow={<><Search size={14} /><span>{ui.labels.search}</span></>}
        title={`“${query}”`}
        body={ui.labels.howManyResults(total, query)}
        stats={[
          <SurfaceStat key="results" dark={dark} label={ui.labels.results} value={`${total}`} body={ui.labels.objectiveGuide} />,
          <SurfaceStat key="domains" dark={dark} label={ui.labels.domain} value={`${results.length}`} body={ui.home.domainsBody} tone="purple" />,
          <SurfaceStat key="query" dark={dark} label={ui.labels.focus} value={query.length} body={ui.labels.searchPlaceholder} />,
        ]}
      />

      {results.length === 0 ? (
        <SurfaceCard dark={dark}>
          <div className={`py-6 text-center text-sm ${tokens.muted}`}>{ui.labels.noMatches}</div>
        </SurfaceCard>
      ) : (
        results.map((domain) => (
          <SurfaceCard key={domain.id} dark={dark}>
            <SurfaceKicker tone="blue">
              <span className="text-base">{domain.icon}</span>
              <span>{ui.labels.domain} {domain.id}</span>
            </SurfaceKicker>
            <div className="display-font mt-3 text-2xl font-semibold">{domain.label}</div>
            <div className={`mt-3 text-sm leading-7 ${tokens.muted}`}>{domain.summary}</div>

            <div className="mt-5">
              {domain.objectives.map((objective) => (
                <ObjCard
                  key={objective.id}
                  o={objective}
                  d={domain}
                  expanded={!!expandedObj[objective.id]}
                  toggle={toggleObj}
                  studied={!!studied[objective.id]}
                  mark={markObj}
                  dark={dark}
                />
              ))}
            </div>
          </SurfaceCard>
        ))
      )}
    </div>
  );
}
