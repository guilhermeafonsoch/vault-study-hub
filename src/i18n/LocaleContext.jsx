import { createContext, useContext, useMemo } from "react";
import { DOMAINS, CONNECTIONS, DIFFICULTY, TOTAL_OBJECTIVES } from "../data/domains.js";
import { EXAM_GUIDE, DOMAIN_GUIDES, OBJECTIVE_GUIDE } from "../data/studyGuide.js";
import { QUIZ } from "../data/quiz.js";
import { PT_BR_CONTENT } from "../data/ptBRContent.js";
import { usePersistedState } from "../hooks/usePersistedState.js";
import { UI_COPY } from "./ui.js";

const LocaleContext = createContext(null);

const CONTENT_BY_LOCALE = {
  en: {
    domains: DOMAINS,
    connections: CONNECTIONS,
    difficulty: DIFFICULTY,
    examGuide: EXAM_GUIDE,
    domainGuides: DOMAIN_GUIDES,
    objectiveGuide: OBJECTIVE_GUIDE,
    quiz: QUIZ,
  },
  "pt-BR": PT_BR_CONTENT,
};

export function LocaleProvider({ children }) {
  const [locale, setLocale] = usePersistedState("vh.locale", "en");

  const value = useMemo(() => {
    const content = CONTENT_BY_LOCALE[locale] ?? CONTENT_BY_LOCALE.en;
    const ui = UI_COPY[locale] ?? UI_COPY.en;
    const allObjectives = content.domains.flatMap((domain) =>
      domain.objectives.map((objective) => ({ ...objective, domain }))
    );

    return {
      locale,
      setLocale,
      ui,
      ...content,
      allObjectives,
      totalObjectives: TOTAL_OBJECTIVES,
      languages: [
        { id: "en", label: UI_COPY.en.languageName },
        { id: "pt-BR", label: UI_COPY["pt-BR"].languageName },
      ],
    };
  }, [locale, setLocale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale must be used inside LocaleProvider");
  return context;
}
