# Spartan UI

Shared UI primitives built on [Spartan.ng](https://spartan.ng) (ShadCN-inspired for Angular).

## Structure

Spartan uses a two-layer architecture:

- **Brain (`Brn*`)** — headless behavior primitives from `@spartan-ng/brain`. Handles accessibility, keyboard interaction, overlay positioning, and form control state.
- **Helm (`Hlm*`)** — styled UI directives/components that wrap Brain primitives with Tailwind CSS classes. These are **copied into your project** for full customization (the ShadCN model).

## Components

| Directive/Component | Selector            | Brain Primitive |
| ------------------- | ------------------- | --------------- |
| `HlmButton`         | `button[hlmButton]` | `BrnButton`     |
| `HlmInput`          | `input[hlmInput]`   | `BrnInput`      |
| `HlmLabel`          | `label[hlmLabel]`   | `BrnLabel`      |
| `HlmField`          | `hlm-field`         | `BrnField`      |
| `HlmTooltip`        | `[hlmTooltip]`      | `BrnTooltip`    |

## Usage

```typescript
import { HlmButton, HlmInput, HlmLabel, HlmField, HlmTooltip } from '@myorg/spartan';

@Component({
  imports: [HlmButton, HlmInput, HlmLabel, HlmField, HlmTooltip],
  template: `
    <button hlmButton variant="default">Click me</button>
  `
})
```

## Adding New Components

Spartan components follow a consistent pattern:

1. Identify the Brain primitive from `@spartan-ng/brain/<name>`
2. Create a Helm wrapper that:
   - Uses `hostDirectives` to delegate behavior to the Brain primitive
   - Adds Tailwind classes via `host: { class: '...' }` or computed `[class]` binding
   - Exposes Brain inputs with clear aliases (e.g., `brnTooltip` → `hlmTooltip`)
