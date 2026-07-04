# Security Audit — 2026-07-04

Audited all 35 open dependabot security alerts. All resolved or stale — no code changes needed.

## Findings

- **34 alerts**: Packages not present in the lockfile (stale — removed in prior updates)
- **1 alert** (#296, esbuild LOW): Already patched — lockfile has esbuild@0.28.1 (≥0.28.1 required)

## Resolution

Alerts dismissed as "Risk is tolerable" on GitHub Security tab.

Closes #197
