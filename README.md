# Vault Study Hub

An interactive study app for the **HashiCorp Certified: Vault Associate (003)** exam, built to keep the guide, objective notes, mind map, flashcards, quiz, and progress tracking in one place.

Live app: [vault-study-hub.vercel.app](https://vault-study-hub.vercel.app)  
Repository: [github.com/guilhermeafonsoch/vault-study-hub](https://github.com/guilhermeafonsoch/vault-study-hub)

![Vault Study Hub preview](./public/repo-preview.svg)

## What this project is

This app is designed as a practical study hub for the current Vault Associate (003) scope on **Vault 1.16**.

It combines:

- a modern home page that lets you jump into the right study mode quickly
- a long-form written guide in [`docs/vault-associate-master-study-guide.md`](./docs/vault-associate-master-study-guide.md)
- domain-by-domain notes for all **40 official objectives**
- a visual mind map for the major concept chains the exam repeats
- flashcards, quiz review, cheat-sheet mode, search, and local progress tracking

## Current app features

- **Home**: launcher-style landing page that explains each study surface and lets you jump straight into domains or modes
- **Guide**: read-first study view with exam context, domain focus, mental models, common traps, and official references
- **Mind Map**: visual relationships between the 9 domains, with hover cues and direct drill-in to domain notes
- **Grid**: fast scan of all domains with progress, focus, and top trap
- **Cheat**: compressed cram mode with memory anchors and objective reminders
- **Flashcards**: recall mode with prompt/answer flow, use cases, examples, exam cues, and traps
- **Quiz**: practice mode with a **200-question** bank, domain filters, documentation links, and answer-by-answer review
- **Stats**: local progress dashboard for study coverage inside the app
- **Search**: search across objectives, explanations, CLI examples, cues, and pitfalls

## Study surfaces

| View | Purpose |
|---|---|
| **Home** | Choose the study mode you want and jump into the weakest domains fast |
| **Guide** | Read the exam story end to end with domain explanations and official links |
| **Mind Map** | Memorize the relationship chain between auth, tokens, policy, secrets, leases, and deployment concepts |
| **Grid** | Scan the whole exam surface quickly and open a domain directly |
| **Cheat** | Run a compressed review pass before or between quiz sessions |
| **Flashcards** | Force recall instead of recognition |
| **Quiz** | Practice with reviewed multiple-choice questions and post-answer explanation |
| **Stats** | Track local study progress and coverage by domain |

## Feature highlights

- **Objective depth**: every official objective includes explanation, why it matters, how it works, use case, example, exam cue, and trap notes
- **Written handbook**: one long-form study document in Markdown for people who want a single reading reference
- **Question review**: each quiz question includes documentation links plus explanation of why the correct option is correct and why the other options are not the best fit
- **Modern UI**: IBM-inspired blue/purple/black/white palette with a Vault-style geometric visual language
- **Language toggle**: English and Portuguese (Brazil) UI support
- **No login required**: progress is stored locally in the browser with `localStorage`

## Exam scope used in the app

- **Certification**: Vault Associate (003)
- **Product version**: Vault 1.16
- **Format**: online proctored
- **Duration**: 1 hour

## Recommended study flow

1. Start in **Guide** to understand the structure of the exam.
2. Use **Mind Map** until the concept chain feels natural.
3. Open weak domains from **Home**, **Grid**, or **Stats**.
4. Use **Flashcards** to force recall without looking.
5. Finish with **Quiz** and review every explanation, not just the score.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Production build

```bash
npm run build
npm run preview
```

Preview runs on [http://localhost:4173](http://localhost:4173).

## Persistence model

This project does **not** require authentication.

- study progress is stored in the browser with `localStorage`
- theme and selected language are also persisted locally
- progress is kept across page reloads and browser restarts on the same browser profile
- clearing browser storage resets that local progress

## Tech stack

- **React 18**
- **Vite**
- **Tailwind CSS**
- **Lucide React**

## Project structure

```text
vault-study-hub/
├── README.md
├── docs/
│   └── vault-associate-master-study-guide.md
├── public/
│   └── repo-preview.svg
├── src/
│   ├── App.jsx
│   ├── index.css
│   ├── components/
│   │   ├── BrandMarks.jsx
│   │   ├── SurfacePrimitives.jsx
│   │   ├── StudyGuide.jsx
│   │   ├── QuizMode.jsx
│   │   ├── FlashcardMode.jsx
│   │   ├── RadialMap.jsx
│   │   └── ...
│   ├── data/
│   ├── hooks/
│   └── i18n/
└── package.json
```

## Official references

- [Vault Associate certification details](https://developer.hashicorp.com/certifications/security-automation)
- [Vault Associate (003) exam content list](https://developer.hashicorp.com/vault/tutorials/associate-cert-003/associate-review-003)
- [Vault Associate learning path](https://developer.hashicorp.com/vault/tutorials/associate-cert-003/associate-study-003)
- [Vault Associate sample questions](https://developer.hashicorp.com/vault/tutorials/associate-cert-003/associate-questions-003)
- [Vault documentation](https://developer.hashicorp.com/vault/docs)

## Notes

- This is study material for exam preparation.
- It is not affiliated with or endorsed by HashiCorp or IBM.
