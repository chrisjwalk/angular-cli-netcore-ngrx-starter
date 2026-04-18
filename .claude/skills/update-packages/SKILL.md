---
name: update-packages
description: >
  Update all npm packages to their latest versions using the update-packages
  script. Use this when asked to update, upgrade, or consolidate dependencies,
  or to close dependabot PRs.
---

## Update Packages Workflow

Follow these steps in order.

### 1. Create a GitHub issue to track the update

```bash
gh issue create --title "chore: update all packages to latest" --body "..."
```

Note the issue number (e.g. #42).

### 2. Create a branch off main

```bash
git checkout main && git pull
git checkout -b feat/consolidate-deps-<issue-number>
```

### 3. Run the update-packages script

Use `--omit` to skip any packages with known breaking changes or major version
bumps that need separate handling. Major version upgrades should be omitted by
default unless you've verified they are safe.

```bash
bun run tools/update-packages/src/main.tsx --omit typescript --interactive false
```

The tool is a React Ink interactive CLI. In interactive mode (default) it will:

1. Show a table of all outdated packages
2. Prompt you to select any packages to **omit** via a multi-select
3. Show live progress as each `nx migrate` runs
4. Prompt to run `pnpm install` and `npx nx migrate --run-migrations` on completion

In non-interactive mode (`--interactive false`), it skips all prompts and runs
through all packages automatically, still streaming live progress.

The script will:

- Detect all outdated packages via `pnpm outdated`
- Run `nx migrate <pkg>@latest` for each one
- Merge any generated migrations into `migrations.json`
- Print next steps (install + run migrations if needed)

### 4. Install updated packages

```bash
pnpm install --no-frozen-lockfile
```

If the install fails, check for postinstall build errors (e.g. tsconfig
issues in `tools/builders/dotnet-builder`).

### 5. Run migrations (only if migrations.json was updated)

```bash
npx nx migrate --run-migrations
```

### 6. Run all tests

```bash
nx reset
nx run-many -t build,test
```

All 9 projects must pass before committing.

### 7. Commit

```bash
git add -A
git commit -m "chore: update all packages to latest (closes #<issue-number>)"
```

### 8. Push and open PR

```bash
git push origin feat/consolidate-deps-<issue-number>
gh pr create --title "chore: update all packages to latest" --body "Closes #<issue-number> ..."
```

### 9. Close stale dependabot PRs

Close any open dependabot PRs that are now covered by this update:

```bash
gh pr list --author "app/dependabot" --json number,title
gh pr close <number> --comment "Covered by consolidated update PR" --delete-branch
```

Leave open any dependabot PRs for packages that were intentionally omitted
(e.g. TypeScript major version bumps).

## Notes

- Omit packages with major version bumps by default — run them separately once
  you've confirmed they are safe (e.g. no breaking changes affecting the codebase)
- If a package is a transitive dep not shown by `pnpm outdated`, use
  `pnpm.overrides` in `package.json` to force the version
- After merging, watch for new dependabot PRs — dependabot may recreate stale
  ones; close them if the package was already updated
