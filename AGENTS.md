<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Agent guide

## Workflow

1. Inspect existing patterns before implementing.
2. Make the smallest coherent change.
3. Reuse existing components before adding dependencies.
4. Run validation before declaring completion.
5. Inspect rendered UI at desktop and mobile sizes.
6. Report remaining risks or unverified behavior.

## Frontend conventions

- Prefer Server Components by default.
- Add `"use client"` only when browser APIs, state, effects, or interactive event handling require it.
- Do not convert large component trees to Client Components without justification.
- Use semantic design tokens rather than arbitrary colors.
- Reuse local shadcn primitives before inventing controls.
- Maintain keyboard navigation and visible focus.
- Implement loading, empty, error, and success states.
- Check mobile, tablet, and desktop behavior.
- Respect reduced-motion preferences.
- Avoid generic AI gradients and repetitive card grids.
- Keep visual design appropriate to the product being built.

## Security

- Never expose server secrets through client code.
- Never log credentials, tokens, or sensitive user content.
- Validate untrusted API input.
- Authorize sensitive server actions and routes.
- Return safe errors to users.
- Do not weaken security checks to make builds pass.

## Required validation

Run before completion:

```sh
pnpm lint
pnpm typecheck
pnpm build
```

Unit, browser, screenshot, and security CI gates will be added in the next phase.
