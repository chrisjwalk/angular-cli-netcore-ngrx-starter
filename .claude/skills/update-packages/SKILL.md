---
name: update-packages
description: >
  Update all npm packages to their latest versions using the update-packages
  script, fix open dependabot alerts, and close covered dependabot PRs. Use this
  when asked to update, upgrade, or consolidate dependencies, or to close
  dependabot PRs/alerts.
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

Use `--minor-only` to automatically skip all major version bumps (recommended).
Use `--omit` to additionally skip specific packages by name.

```bash
bun run tools/update-packages/src/main.tsx --minor-only --interactive false
```

The tool is a React Ink interactive CLI. In interactive mode (default) it will:

1. Show a table of all outdated packages
2. Prompt you to select any packages to **omit** via a multi-select (major bumps
   are pre-selected when `--minor-only` is passed)
3. Show live progress as each `nx migrate` runs
4. Prompt to run `pnpm install` and `npx nx migrate --run-migrations` on completion

In non-interactive mode (`--interactive false`), it skips all prompts and runs
through all packages automatically, still streaming live progress.

Key flags:

| Flag                  | Description                                            |
| --------------------- | ------------------------------------------------------ |
| `--minor-only`        | Skip all packages with a major version bump            |
| `--omit <pkg...>`     | Skip specific packages by name                         |
| `--interactive false` | Run non-interactively (no prompts)                     |
| `--json`              | Output results as JSON (implies `--interactive false`) |

The script will:

- Detect all outdated packages via `pnpm outdated`
- Run `nx migrate <pkg>@latest` for each one
- Merge any generated migrations into `migrations.json`
- Print next steps (install + run migrations if needed)

### 4. Install updated packages

```bash
pnpm install --no-frozen-lockfile
```

If the install fails, check the `preinstall` `dotnet restore` output (e.g.
NU1xxx package resolution errors in `apps/api`). If it fails with
`ERR_PNPM_NO_MATCHING_VERSION` for a version that does exist on the registry,
run `pnpm cache delete` and retry (stale metadata).

### 5. Run migrations (only if migrations.json was updated)

```bash
npx nx migrate --run-migrations
```

### 6. Fix remaining dependabot alerts

The update fixes most alerts by itself — GitHub dismisses them automatically
once the vulnerable version leaves the default branch. Find what's left:

```bash
gh api repos/<owner>/<repo>/dependabot/alerts --paginate \
  --jq '.[] | select(.state=="open") | "\(.security_advisory.severity)\t\(.dependency.package.name)\t\(.security_advisory.ghsa_id)"'
pnpm audit
```

For each remaining vulnerable package:

1. Find the installed version and its dependents: `pnpm why -r <pkg>`
2. Raise the floor of the matching override in `pnpm-workspace.yaml`
   (overrides live there, **not** in package.json), or add a new entry:
   `'<pkg>': '>=<patched-version>'`
3. If raising a floor doesn't change the lockfile resolution (pnpm keeps the
   stale resolution because it still satisfies the floor), add an upper bound
   to force re-resolution, e.g. `'>=1.1.17 <2'`.
4. If the patched version isn't published yet (advisory
   `first_patched_version` is null, or the version doesn't exist on the
   registry), leave the alert open and note it in the PR — nothing to do until
   upstream ships a fix.
5. Reinstall (`pnpm install --no-frozen-lockfile`) and re-run `pnpm audit`
   until only unfixable findings remain.

Also watch the `preinstall` `dotnet restore` output for NU1903 warnings
(vulnerable NuGet packages). Fix by bumping the parent that pins the vulnerable
version (e.g. Swashbuckle pinning Microsoft.OpenApi), or adding a direct
`PackageReference` at the patched version. Verify with `dotnet restore <sln>`
and `dotnet list <proj> package --include-transitive`.

### 7. Run all tests

```bash
nx reset
nx run-many -t build,test
```

All 13 projects must pass before committing.

### 8. Commit

```bash
git add -A
git commit -m "chore: update all packages to latest, fix open dependabot alerts (closes #<issue-number>)"
```

### 9. Push and open PR

```bash
git push origin feat/consolidate-deps-<issue-number>
gh pr create --title "chore: update all packages to latest, fix open dependabot alerts" \
  --body "Closes #<issue-number> ..."
```

List in the PR body which alerts were fixed and which remain (with their GHSA
IDs), e.g. fixes with no published patched version yet.

### 10. Close stale dependabot PRs

Close any open dependabot PRs that are now covered by this update:

```bash
gh pr list --author "app/dependabot" --json number,title
gh pr close <number> --comment "Covered by consolidated update PR" --delete-branch
```

Leave open any dependabot PRs for packages that were intentionally omitted
(e.g. TypeScript major version bumps) or whose fix isn't published yet.

## Notes

- Use `--minor-only` by default to skip major version bumps — run them separately
  once you've confirmed they are safe (e.g. no breaking changes affecting the codebase)
- Use `--omit <pkg>` for additional specific packages to skip beyond major bumps
- If a package is a transitive dep not shown by `pnpm outdated`, raise/add an
  override in `pnpm-workspace.yaml` to force the version
- After merging, watch for new dependabot PRs — dependabot may recreate stale
  ones; close them if the package was already updated. Fixed alerts dismiss
  automatically after merge; verify the repo Security tab afterwards.
