---
title: Dependency updates (update-packages workflow)
area: devops
canonical: [.claude/skills/update-packages/SKILL.md, tools/update-packages, .github/dependabot.yml, pnpm-workspace.yaml, .claude/skills/upgrade-angular-major/SKILL.md]
updated: 2026-08-16
---

# Dependency updates

Updates run through a codified procedure, not ad-hoc bumps: the `update-packages` skill drives the `tools/update-packages` interactive updater, dependabot groups the noise, and peer overrides absorb Angular-ecosystem coupling.

## Canonical implementation

- `.claude/skills/update-packages/SKILL.md` — the procedure (run the updater, verify, commit, close dependabot PRs)
- `tools/update-packages` — interactive updater invoked via `pnpm update-packages`
- `.github/dependabot.yml` — grouped updates to keep PR volume sane
- `pnpm-workspace.yaml` — `pnpm.overrides`/peer rules that let Angular ecosystem majors move together

## Conventions & gotchas

- **TypeScript majors are blocked by nx 23.1.1** — TS 7 breaks nx; keep TypeScript majors out of dependency updates until nx supports them.
- Angular ecosystem bumps are coordinated group bumps with peer-dependency overrides — the `upgrade-angular-major` skill codifies the real 21→22 playbook (commit 8e2ef26) including rollback.
- Dependabot PRs are closed by the update-packages flow, not merged individually — one canonical update path.
- Always run the full verify set after a bump: `nx reset && nx run-many -t lint,test,build --all && pnpm e2e:ci`.

## Related

- [Deployment & CI](deployment.md) · [Testing](testing.md)
