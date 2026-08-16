---
title: Markdown content pages (Analog content)
area: frontend
canonical: [apps/web-app/src/app/content/content.routes.ts, apps/web-app/src/app/content/content.ts, apps/web-app/src/app/recipes/recipes.ts, apps/web-app/src/app/recipes/recipe.ts, apps/web-app/src/content/about.md, libs/home/src/lib/home/home.ts, apps/web-app/project.json]
updated: 2026-08-16
---

# Markdown content pages

Pages render from Markdown files with frontmatter via Analog's content feature (`provideContent` + `injectContent`), with shiki highlighting and mermaid support. The home page renders the repo README, and `/recipes` renders the repo's recipe catalog.

## Canonical implementation

- `apps/web-app/src/app/app.config.ts` — `provideContent(withMarkdownRenderer({ loadMermaid: ... }))`
- `apps/web-app/src/app/content/content.ts` + `content.routes.ts` — the `/content` route: `injectContent<ContentAttributes>({ customFilename: 'about' })`, TOC built from `content.toc` with IntersectionObserver scrollspy
- `apps/web-app/src/app/recipes/recipes.ts` + `recipe.ts` + `recipes.routes.ts` — the `/recipes` catalog: the index lists `injectContentFiles()` filtered to `recipes/` slugs; each page loads via `injectContent({ param: 'slug', subdirectory: 'recipes' })`
- `apps/web-app/src/content/about.md` — frontmatter is `title` + `description` typed via `ContentAttributes`
- `apps/web-app/src/content/recipes` — a symlink to the repo's `docs/recipes/`, so the app browses the same files that are the source of truth (no copies)
- `libs/home/src/lib/home/home.ts` — home renders `content/home.md` via `injectContent({ customFilename: 'home' })`

## Conventions & gotchas

- **There is no automatic file-based slug routing** — dropping a `.md` into `content/` lists it via `injectContentFiles()` but doesn't create a page; every content area needs explicit routes. A param-based route (`{ path: ':slug' }` + `injectContent({ param: 'slug', subdirectory: ... })`) covers a whole directory of files with one component.
- The content plugin only discovers `src/content/**/*.md` (hardcoded in @analogjs/platform) — files elsewhere must be reached via a symlink, which tinyglobby follows (`followSymbolicLinks: true`).
- **Filter content files by `filename`, not `slug`** — `slug` is only the last path segment (bare filename), and in dev Vite resolves symlinks to their real paths, so map keys differ between dev (`/home/.../docs/recipes/x.md`) and build (`/src/content/recipes/x.md`); the `/recipes/` directory segment in `filename` is the stable discriminator.
- **Recipe `Related` links are bare `<name>.md`** (correct when browsing on GitHub) — a marked extension in `vite.config.ts` (`content.markedOptions.extensions`) rewrites them to `/recipes/<name>` at render time; SWA config 404s stray `/*.md` URLs so they don't bounce to the home page via the SPA fallback.
- **README → home.md sync is real now**: `.lintstagedrc.cjs` runs `pnpm update-readme` (`sed -n '/^# /,$p' README.md > apps/web-app/src/assets/home.md`) on README commits; `content/home.md` (the rendered copy) is hand-maintained and must be kept in sync manually.
- `assets/home.md` is precached by the PWA and Tailwind-scanned — always regenerate with `pnpm update-readme` after README edits.
- The vitest setup mocks `injectContent`/`injectContentFiles` (`libs/home/src/lib/home/home.spec.ts`, `apps/web-app/src/app/recipes/*.spec.ts`) since the real loader needs the Vite content pipeline.

## Related

- [PWA & service worker](pwa.md) · [Feature library](feature-library.md)
