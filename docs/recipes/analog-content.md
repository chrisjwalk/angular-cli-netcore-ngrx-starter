---
title: Markdown content pages (Analog content)
area: frontend
canonical: [apps/web-app/src/app/content/content.routes.ts, apps/web-app/src/app/content/content.ts, apps/web-app/src/content/about.md, libs/home/src/lib/home/home.ts, apps/web-app/project.json]
updated: 2026-08-15
---

# Markdown content pages

Pages render from Markdown files with frontmatter via Analog's content feature (`provideContent` + `injectContent`), with shiki highlighting and mermaid support. The home page renders the repo README.

## Canonical implementation

- `apps/web-app/src/app/app.config.ts` — `provideContent(withMarkdownRenderer({ loadMermaid: ... }))`
- `apps/web-app/src/app/content/content.ts` + `content.routes.ts` — the `/content` route: `injectContent<ContentAttributes>({ customFilename: 'about' })`, TOC built from `content.toc` with IntersectionObserver scrollspy
- `apps/web-app/src/content/about.md` — frontmatter is `title` + `description` typed via `ContentAttributes`
- `libs/home/src/lib/home/home.ts` — home renders `content/home.md` via `injectContent({ customFilename: 'home' })`

## Conventions & gotchas

- **There is no file-based slug route** — dropping a `.md` into `content/` lists it via `injectContentFiles()` but doesn't create a page; every page needs an explicit route + component.
- **README → home.md sync is real now**: `.lintstagedrc.cjs` runs `pnpm update-readme` (`sed -n '/^# /,$p' README.md > apps/web-app/src/assets/home.md`) on README commits; `content/home.md` (the rendered copy) is hand-maintained and must be kept in sync manually.
- `assets/home.md` is precached by the PWA and Tailwind-scanned — always regenerate with `pnpm update-readme` after README edits.
- The vitest setup mocks `injectContent` (`libs/home/src/lib/home/home.spec.ts`) since the real loader needs the Vite content pipeline.

## Related

- [PWA & service worker](pwa.md) · [Feature library](feature-library.md)
