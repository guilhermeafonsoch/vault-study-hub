import ObjCard from "./ObjCard.jsx";
import { useLocale } from "../i18n/LocaleContext.jsx";

export default function SearchResults({ results, expandedObj, toggleObj, markObj, studied, dark, query }) {
  const { ui } = useLocale();
  const t2 = dark ? "text-gray-400" : "text-gray-500";
  const total = results.reduce((s, d) => s + d.objectives.length, 0);
  return (
    <div>
      <div className={`text-xs ${t2} mb-3`}>
        {ui.labels.howManyResults(total, query)}
      </div>
      {results.map((d) => (
        <div key={d.id} className="mb-4">
          <div className="text-xs font-semibold mb-2" style={{ color: d.color }}>
            {d.icon} {ui.labels.domain} {d.id}: {d.label}
          </div>
          {d.objectives.map((o) => (
            <ObjCard
              key={o.id}
              o={o}
              d={d}
              expanded={!!expandedObj[o.id]}
              toggle={toggleObj}
              studied={!!studied[o.id]}
              mark={markObj}
              dark={dark}
            />
          ))}
        </div>
      ))}
      {results.length === 0 && <div className={`text-center ${t2} py-10`}>{ui.labels.noMatches}</div>}
    </div>
  );
}
