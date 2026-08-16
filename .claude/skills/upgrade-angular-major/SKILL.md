---
name: upgrade-angular-major
description: >
  Upgrade Angular to the next major version in this workspace. Codifies the
  real Angular 21 → 22 playbook (commit 8e2ef26): coordinated group bumps,
  pnpm peer-dependency rules, nx migrations with AI instruction files, a known
  breaking-change sweep, full verification, and rollback.
---

# Upgrade Angular Major

Use when asked to upgrade Angular (and its ecosystem) to the next major.
Follow the steps in order; a baseline green run is the safety net.

## Step 0 – Issue and branch (AGENTS.md workflow)

```bash
gh issue create --title "feat: upgrade to Angular <N>" --body "..."
git checkout main && git pull
git checkout -b feat/angular-<N>-<issue-number>
```

## Step 1 – Baseline: everything green first

```bash
nx reset && pnpm install --frozen-lockfile
pnpm nx run-many --target=lint,test,build --all
pnpm e2e:ci
```

Do not start the upgrade on a red baseline.

## Step 2 – Coordinated version bumps

Bump the whole Angular group together (they must move as one; from 8e2ef26's diff):

- `@angular/*` (incl. `@angular/service-worker`), `@angular-devkit/{architect,core,schematics}`, `@angular/cli`, `@angular/build`, `@angular/compiler-cli`, `@angular/language-service`, `@schematics/angular`
- Co-bump ecosystem packages that track Angular majors: `@angular-eslint/*` + `angular-eslint`, `@analogjs/*`, `@module-federation/vite`, `@testing-library/angular`

For everything else use the `update-packages` skill/tool (which also runs
`nx migrate <pkg>@latest` per package and merges `migrations.json`):

```bash
bun run tools/update-packages/src/main.tsx --minor-only --interactive false
```

## Step 3 – pnpm peer-dependency rules

The new Angular major usually exceeds peer caps of Nx/NgRx/etc. In
`pnpm-workspace.yaml`:

- Add/update `peerDependencyRules.allowedVersions` for the new major
  (all `@angular/*`, `@angular/cdk`, `@angular/material`, `ng-packagr` → `'<N>'`)
- Add `minimumReleaseAgeExclude` entries for the freshly released
  `@angular-eslint` packages when pnpm's release-age policy blocks them

Then `pnpm install --no-frozen-lockfile` and re-run the baseline.

## Step 4 – Run migrations with AI instructions

```bash
npx nx migrate --run-migrations
```

When a migration needs judgment, `tools/ai-migrations/` holds the
LLM-instruction pattern: category-by-category breaking-change guides with
before/after snippets (e.g. `MIGRATE_VITEST_4.md`,
`@nx/vite/23.0.1/ai-instructions-for-vitest-4.md`,
`@nx/eslint/23.1.0/convert-to-flat-config.md`). Follow the same structure for
new migrations and commit the instruction files alongside.

## Step 5 – Known breaking-change sweep (from real history)

- `apps/web-app/vite.config.ts` **and** `apps/counter-remote/vite.config.ts`:
  bump the `angVer` / `cdkMatVer` shared-deps variables to the new major
- Migrate any `@angular/forms/signals/compat` usage to the stable
  `@angular/forms/signals` API (see `docs/recipes/signal-forms.md`)
- Static assets: if the CLI/Vite asset handling changed, move files to
  `public/` (robots/favicon moved in the 21→22 upgrade)
- PWA/e2e CI build flags: verify `serve-e2e:production` still builds
- Playwright browsers: `pnpm exec playwright install chromium firefox --with-deps`
- Material: check M3 theme/component API changes against `docs/recipes/theming.md`

## Step 6 – Verify

```bash
nx reset
pnpm nx run-many --target=lint,test,build --all
pnpm e2e:ci
```

Confirm the MFE integration e2e passes with zero NG0912 console errors
(shared-singleton config is the most common casualty of major upgrades).

## Step 7 – Rollback (if needed)

```bash
git revert <merge-commit>   # or checkout the baseline commit
pnpm install --frozen-lockfile
```

The frozen lockfile restores the old dependency tree; the Step 1 baseline run
is the reference point for "was green".

## Step 8 – PR

Commit/PR per AGENTS.md (issue closes in the PR body; commit as
`chrisjwalk-bot`), then close stale dependabot PRs per the `update-packages`
skill step 9.
