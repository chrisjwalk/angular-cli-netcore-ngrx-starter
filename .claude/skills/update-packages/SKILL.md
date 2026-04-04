---
name: update-packages
description: >
  Update all npm packages to their latest versions using the update-packages
  script. Use this when asked to update, upgrade, or consolidate dependencies,
  or to close dependabot PRs.
---

## Update Packages Workflow

Follow these steps in order.

### 1. Create a GitHub issue (as `chrisjwalk`)

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

Always omit `typescript` — upgrading TypeScript is a breaking change that
requires a dedicated branch and tsconfig work (see issue #101 for context).

```bash
npx ts-node ./tools/update-packages/src/main.ts --omit typescript --interactive false
```

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
git commit -m "chore: update all packages to latest (closes #<issue-number>)

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

### 8. Push and open PR as `chrisjwalk-bot`, then switch back

```bash
gh auth switch --user chrisjwalk-bot
git push origin feat/consolidate-deps-<issue-number>
gh pr create --title "chore: update all packages to latest" --body "Closes #<issue-number> ..."
gh auth switch --user chrisjwalk
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

- `typescript` is always omitted — track TS upgrades separately in issue #101
- If a package is a transitive dep not shown by `pnpm outdated`, use
  `pnpm.overrides` in `package.json` to force the version
- After merging, watch for new dependabot PRs — dependabot may recreate stale
  ones; close them if the package was already updated
