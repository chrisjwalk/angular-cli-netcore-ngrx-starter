---
title: Theming (Material 3 tokens + Tailwind v4)
area: frontend
canonical: [apps/web-app/src/styles/_tokens.css, apps/web-app/src/styles/styles.css, apps/web-app/src/styles/material.scss, libs/shared/src/lib/components/theme.service.ts]
updated: 2026-08-15
---

# Theming

Material 3 tokens are the single source of truth, bridged into Tailwind v4 utilities so templates write `bg-surface-container`, `text-on-surface-variant`, etc. A `ThemeService` cycles system → light → dark via `data-theme` on `<html>`.

## Canonical implementation

- `apps/web-app/src/styles/_tokens.css` — `--md-sys-color-*` light/dark values + `html[data-theme='dark']` override
- `apps/web-app/src/styles/material.scss` — `mat.define-theme` light/dark with `use-system-variables`, azure palette, `--mat-sys-*` → `--md-sys-color-*` bridge, custom form-field/table/paginator tokens
- `apps/web-app/src/styles/styles.css` — Tailwind v4 `@theme` mapping (`--color-*` → `--md-sys-color-*`) and a `@custom-variant dark` respecting `data-theme` + OS preference
- `libs/shared/src/lib/components/theme.service.ts` — persists the choice to `localStorage('theme')`, sets `data-theme`

## Conventions & gotchas

- Prefer Tailwind utility classes with design-token colors over component/global CSS (AGENTS.md) — Material components get theme overrides only where Tailwind can't reach (`.mat-drawer-container`, form-field tokens).
- DESIGN.md is the design-system spec ("The Kinetic Curator") — it describes the intended visual language (no-line rule, tonal layering, Manrope).
- New tokens must be added to `_tokens.css` AND the Tailwind `@theme` mapping, or utilities silently fall back to CSS defaults.

## Related

- [Feature library](feature-library.md)
