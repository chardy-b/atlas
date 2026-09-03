# Application template

A neutral, maintainable starting point for personal tools, dashboards, AI applications, and prototypes. It uses Next.js App Router, TypeScript, Tailwind CSS, locally owned shadcn/ui components, Lucide icons, and Vercel-friendly defaults.

## Requirements

- Node.js 22 or newer
- pnpm 11.24.0 (Corepack is supported)

## Install and run

```sh
corepack enable pnpm
pnpm install
pnpm dev
```

Open http://localhost:3000. The starter does not need environment variables to run.

## Scripts

```sh
pnpm dev              # Run the local development server
pnpm build            # Create a production build
pnpm start            # Run the production server
pnpm format           # Format supported repository files
pnpm format:check     # Verify formatting without writes
pnpm lint             # Lint the repository
pnpm typecheck        # Type-check without emitting files
pnpm test             # Run Vitest in watch mode
pnpm test:run         # Run unit and component tests once
pnpm test:coverage    # Run tests with V8 text and HTML coverage reports
pnpm test:e2e         # Run Chromium desktop and mobile browser/visual tests
pnpm test:e2e:update  # Deliberately update Playwright screenshot baselines
pnpm audit            # Fail on high or critical dependency vulnerabilities
pnpm check            # Formatting, lint, types, tests, and production build
```

## Quality and security gate

Pull requests run deterministic formatting, ESLint, strict TypeScript, V8 coverage-backed unit/component tests, a production build, Playwright desktop/mobile browser tests, screenshot regression tests, a high/critical dependency audit, and Gitleaks secret detection.

The committed visual baselines live beside the Playwright spec. Review screenshot changes deliberately; use `pnpm test:e2e:update` only when an intended UI change requires new baselines. Playwright reports and coverage output are generated locally and excluded from version control.

CodeQL runs automatically for public repositories. An eligible private repository can enable it by setting the GitHub repository variable `ENABLE_CODEQL=true`; this avoids falsely claiming private-plan Code Scanning support.

## Environment variables

Copy `.env.example` to `.env.local` only when a project needs optional configuration. `AI_PROVIDER_API_KEY` is server-only. Variables with `NEXT_PUBLIC_` are visible to every visitor and must contain only public data.

Environment schemas are in `src/lib/env.ts`. Keep server-only modules out of Client Components.

## Health check

`GET /api/health` returns `200` with `{ "status": "ok" }` and disables caching. Use it for deployment checks.

## UI conventions

- Prefer Server Components; use Client Components only for browser APIs or interactivity.
- Use semantic CSS variables from `src/app/globals.css`, not arbitrary colors.
- Reuse local primitives in `src/components/ui/`.
- Include keyboard access, visible focus, and loading, empty, error, and success states.
- Check the UI at mobile, tablet, and desktop widths. Respect reduced-motion preferences.

### Add a shadcn component

```sh
pnpm dlx shadcn@latest add <component>
```

Review the generated local source before committing it. Do not add the entire registry.

## Vercel deployment

The repository is ready for standard Vercel Next.js deployment. Configure Vercel Authentication in the Vercel project settings; it is not configured in this source code. Add project-specific environment variables in Vercel, then use `/api/health` for a deployment check.

The baseline headers intentionally omit a Content Security Policy. Add a production CSP only after the project’s third-party scripts, media, and integrations are known.

## Intentionally excluded

This base template does not include:

- database
- application-level authentication
- durable workflows
- Three.js
- project provisioning
- production-specific CSP
- analytics and monitoring vendor
