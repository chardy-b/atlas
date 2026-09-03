# Three.js Mood Board Design

**Issue:** WIL-108

## Purpose

Replace Atlas's generic template landing page with an editorial reference board that helps a product or design team study distinctive Three.js experiences. The board is a browsing and discussion artifact, not a directory, tutorial, or clone of the featured work.

## Experience

The homepage opens as a dark editorial canvas with a restrained ambient Three.js field behind the title. Twelve attributed references appear in an asymmetric visual wall. Filters reduce the wall to Worlds, Particles, Product, Play, or Shaders. Selecting an item opens an accessible detail dialog with a concise observation and a link to the original site.

The primary path is browse → filter → inspect → visit source. The page remains useful without JavaScript, WebGL, or animation.

## Content model

Each reference has a stable id, title, creator, source URL, local image path, image alt text, categories, year when verifiable, and a short editorial note. Selection is limited to projects listed by the official Three.js showcase or a primary creator/project source. Images are low-resolution editorial snapshots stored locally; ownership remains with the original creator.

## Visual system

- Near-black warm background, chalk text, acid-lime signal color, and rust accent.
- Condensed display typography paired with a quiet sans-serif body.
- An asymmetric masonry-like composition using deliberate span variants, not randomized layout.
- Crisp rules, index numbers, and metadata create an archival/editorial tone.
- Hover and focus reveal labels without hiding essential information.
- Motion is brief and transform/opacity based. Reduced-motion mode removes ambient animation and transition movement.

## Architecture

- Server-rendered page shell and typed local project data.
- One focused client component owns filters and details.
- One dynamically loaded client-only Three.js ambient canvas; failure leaves the static page intact.
- Local optimized images under `public/moodboard/`.
- Existing theme/template demo controls are removed from the homepage; `/api/health` remains unchanged.

## Accessibility and resilience

- Native buttons for filters and cards; dialog has title, description, close control, and focus management.
- Visible focus, skip link, sufficient contrast, semantic landmarks, and descriptive alt text.
- Mobile is a single visual column with full metadata; tablet and desktop use deliberate multi-column spans.
- WebGL capability failure and reduced motion do not block content.
- External links use safe new-tab attributes and broken external projects do not affect rendering.

## Security and privacy

No tracking, cookies, accounts, user-generated content, remote scripts, iframes, hotlinked images, or runtime calls to featured sites. No source code, 3D models, or brand asset packages are copied.

## Acceptance

The twelve references, filters, details, source links, responsive states, reduced-motion behavior, local assets, health endpoint, tests, CI, independent review, linked PR, and Vercel deployment must all be verified before completion.
