# Three.js Mood Board Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Replace Atlas's generic homepage with a tested, attributed editorial mood board of twelve real Three.js projects.

**Architecture:** Keep project data and presentation metadata in a typed server-safe module. Render the editorial shell on the server, isolate filtering/dialog state in one client component, and dynamically load one decorative Three.js canvas as optional progressive enhancement. Store all thumbnails locally.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Base UI/shadcn primitives, Three.js, Vitest, Testing Library, Playwright.

---

## Global constraints

- **Compatibility:** Preserve Next.js 16.3.3, React 19, pnpm 11, strict TypeScript, existing `/api/health`, and Vercel deployment.
- **Dependencies:** Add only `three` and its type package if required. Do not add a masonry, animation, analytics, CMS, or state-management dependency.
- **Security and operations:** No remote scripts, iframes, image hotlinks, secrets, tracking, or runtime requests to featured projects. External links use `rel="noreferrer noopener"`.
- **Product contract:** Exactly twelve attributed projects; categories are All, Worlds, Particles, Product, Play, and Shaders; local thumbnails; filters; accessible details; one optional ambient WebGL scene; useful static fallback.
- **Delivery:** WIL-108 branch and linked PR only. No direct push to `main`.

## File and interface map

| Path / component                               | Responsibility and boundary                                 | Consumes                            | Publishes                                              |
| ---------------------------------------------- | ----------------------------------------------------------- | ----------------------------------- | ------------------------------------------------------ |
| `src/data/projects.ts`                         | Trusted local editorial catalogue                           | Static literals                     | `Project`, `ProjectCategory`, `projects`, `categories` |
| `src/components/mood-board.tsx`                | Filter and detail interaction                               | Project catalogue                   | Accessible board/dialog UI                             |
| `src/components/ambient-scene.tsx`             | Optional decorative Three.js lifecycle                      | Reduced-motion and WebGL capability | `aria-hidden` canvas or null fallback                  |
| `src/app/page.tsx`                             | Server-rendered page composition                            | Data and components                 | Homepage metadata/content                              |
| `src/app/globals.css`                          | Editorial tokens, layout, states, responsive/reduced motion | Semantic class names                | Site visual system                                     |
| `public/moodboard/*`                           | Optimized editorial snapshots                               | Captured source pages               | Local image assets                                     |
| `src/components/__tests__/mood-board.test.tsx` | Interaction/accessibility contract                          | Client component                    | Regression evidence                                    |
| `tests/home.spec.ts`                           | Desktop/mobile production behavior and screenshots          | Built app                           | Browser evidence                                       |

## Task 1: Curate and verify twelve references

1. Select twelve live projects from the official Three.js homepage showcase, spanning all five categories.
2. Verify each canonical URL returns a successful page or stable redirect.
3. Record title, creator where verifiable, categories, year only when sourced, alt text, and one original editorial observation in `src/data/projects.ts`.
4. Add a test asserting exactly twelve unique ids/URLs and nonempty attribution/alt/notes.
5. Run that test and confirm it fails before the data exists, then passes after implementation.

## Task 2: Capture safe local thumbnails

1. Capture each live project at a consistent desktop viewport or use its primary Open Graph image when the site cannot render reliably.
2. Crop/resize to bounded WebP images; strip metadata.
3. Store under `public/moodboard/` with stable descriptive names.
4. Verify no image is hotlinked and total asset weight stays reasonable for a mood board.

## Task 3: Build the interaction component with TDD

1. Write failing Testing Library tests for initial twelve-item rendering, category filtering, zero-result fallback, keyboard activation, detail dialog content, and safe source links.
2. Implement `MoodBoard` as the smallest client boundary using native buttons and the existing dialog primitive.
3. Run the targeted tests to green and confirm accessibility names are stable.

## Task 4: Add progressive Three.js ambience

1. Add `three` and types with pnpm.
2. Implement a bounded, decorative low-poly point/line field with explicit animation-frame and renderer cleanup.
3. Disable animation for reduced motion; return a static/no-canvas fallback when WebGL initialization fails.
4. Add lifecycle/reduced-motion tests using mocks where proportionate.

## Task 5: Compose the editorial homepage

1. Replace the component-demo homepage with the approved title, introduction, category board, attribution note, and health link.
2. Update `AppShell` branding/navigation only as needed for this surface.
3. Replace neutral globals with the approved editorial tokens and responsive asymmetric spans.
4. Preserve semantic headings, skip link, visible focus, light/dark compatibility where retained, and mobile readability.

## Task 6: Browser and quality verification

1. Update Playwright coverage for homepage title, all/filter/detail/source-link behavior, reduced motion, and `/api/health`.
2. Capture desktop and mobile screenshots.
3. Run `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm test:run`, `pnpm test:coverage`, `pnpm build`, and Playwright.
4. Confirm no unexpected network requests target featured projects during page rendering.
5. Run dependency audit and credential-pattern scan.

## Task 7: Review and delivery

1. Independently review spec compliance, security, and UI/accessibility at the exact head SHA.
2. Fix blockers and rerun affected and full gates.
3. Commit with WIL-108 in the message, publish the issue branch, and open a PR linking WIL-108.
4. Verify GitHub CI at the exact PR head.
5. Obtain the required approval; merge only after branch rules pass.
6. Verify `https://www.chezchardin.com`, `/api/health`, and responsive screenshots from the deployed `main` commit.
7. Link the PR/deployment evidence in WIL-108 and mark it Done only after verified production deployment.
