<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- You have access to the Nx MCP server and its tools, use them to help the user
- When answering questions about the repository, use the `nx_workspace` tool first to gain an understanding of the workspace architecture where applicable.
- When working in individual projects, use the `nx_project_details` mcp tool to analyze and understand the specific project structure and dependencies
- For questions around nx configuration, best practices or if you're unsure, use the `nx_docs` tool to get relevant, up-to-date docs. Always use this instead of assuming things about nx configuration
- If the user needs help with an Nx configuration or project graph error, use the `nx_workspace` tool to get any errors
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.

<!-- nx configuration end-->

# GitHub Workflow

## Accounts

- **chrisjwalk** — repo owner; creates issues, reviews and merges PRs
- **chrisjwalk-bot** — collaborator (push access); opens branches and PRs so the owner can review them

Both accounts are configured in the `gh` CLI on this machine.

## Complete Workflow — follow every step in order

**1. Create an issue first** (as `chrisjwalk`, the default account):

```bash
gh issue create --title "..." --body "..."
# note the issue number, e.g. #42
```

**2. Create a branch** referencing the issue:

```bash
git checkout -b feat/short-description-42
```

**3. Implement, commit** (git is configured to commit as `chrisjwalk-bot`):

```bash
git commit -m "feat: description (closes #42)

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

**4. Push and open PR as `chrisjwalk-bot`**:

```bash
gh auth switch --user chrisjwalk-bot
git push origin feat/short-description-42
gh pr create --title "..." --body "Closes #42 ..."
```

**5. Switch back to owner**:

```bash
gh auth switch --user chrisjwalk
```

> ⚠️ Never open a PR without a corresponding issue. Never push as `chrisjwalk-bot` without switching back to `chrisjwalk` afterwards.

## Git Commit Identity

Git is configured locally in this repo to commit as the bot:

- `user.name` = `chrisjwalk-bot`
- `user.email` = `268224883+chrisjwalk-bot@users.noreply.github.com`

# Coding Conventions

## Styling: Tailwind over CSS

Prefer Tailwind utility classes over component or global CSS whenever possible.

- Use inline Tailwind classes directly on elements in templates
- Only fall back to component `styles` or global CSS when Tailwind cannot express the rule (e.g. CSS custom properties, complex `:host` selectors, or third-party class overrides like `.mat-drawer-container`)
- Tailwind variants (`hover:`, `focus:`, `dark:`, `motion-reduce:`, arbitrary values like `w-[9999px]`) cover most cases

```html
<!-- ✅ preferred -->
<a class="absolute -left-[9999px] top-0 focus:left-0 bg-black text-white">...</a>

<!-- ❌ avoid -->
<a class="skip-link">...</a>
<!-- with .skip-link { position: absolute; ... } in styles -->
```

## Reactive state: `rxMethod` over manual subscribe

Use `rxMethod` (from `@ngrx/signals/rxjs-interop`) instead of manually subscribing to Observables. It handles subscription lifecycle automatically and works in both signal stores and components.

```typescript
// ✅ preferred — in a store's withMethods() or as a component class field
private readonly handleNavigation = rxMethod<NavigationEnd>(
  pipe(tap(() => { /* side effect */ }))
);
constructor() { this.handleNavigation(this.router.events.pipe(filter(...))); }

// ❌ avoid
this.router.events.pipe(filter(...), takeUntilDestroyed()).subscribe(() => { ... });
```

## Reactive state: `signalMethod` over Angular `effect()`

Use `signalMethod` (from `@ngrx/signals`) instead of `effect()` when reacting to signal changes inside a store or component. `signalMethod` is explicit about its input, testable, and avoids the pitfalls of untracked reads inside effects.

```typescript
// ✅ preferred — in withMethods()
inputCount: signalMethod<number>((count) => patchState(store, { count }));

// ❌ avoid
effect(() => {
  const count = this.count();
  patchState(store, { count });
});
```

## Angular components: `.ts`-only, inline templates, no `Component` suffix

All Angular components live in a single `.ts` file. Never generate separate `.html` or `.css` files.

- Use inline `template` in `@Component` (never `templateUrl`)
- Never use `styles` or `styleUrl` — use Tailwind classes instead (see above)
- File names drop the `.component` segment: `todo.ts`, not `todo.component.ts`
- Class names drop the `Component` suffix: `Todo`, not `TodoComponent`
- Always set `changeDetection: ChangeDetectionStrategy.OnPush`
- Add a `data-testid` on the host via the `host` property

```typescript
// ✅ preferred
@Component({
  selector: 'lib-todo',
  template: `<ul class="flex flex-col gap-2">
    ...
  </ul>`,
  host: { class: 'block', 'data-testid': 'lib-todo' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Todo {}

// ❌ avoid
@Component({
  selector: 'lib-todo',
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css',
})
export class TodoComponent {}
```

## Component specs: use `@testing-library/angular`

Use `render` + `screen` from `@testing-library/angular` in component specs (not `TestBed.createComponent`). Spec files also drop the `.component` segment: `todo.spec.ts`, not `todo.component.spec.ts`.

```typescript
// ✅ preferred
import { render, screen } from '@testing-library/angular';
import { Todo } from './todo';

describe('Todo', () => {
  it('should create', async () => {
    await render(Todo);
    expect(screen.getByTestId('lib-todo')).toBeTruthy();
  });
});
```
