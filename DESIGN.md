# Design System Specification: High-End Editorial SaaS

## 1. Overview & Creative North Star

The Creative North Star for this design system is **"The Kinetic Curator."**

We are moving away from the rigid, boxy constraints of traditional SaaS dashboards toward a digital experience that feels like a high-end editorial gallery. The goal is to balance the efficiency of a professional tool with the aesthetic soul of a premium publication.

By utilizing intentional asymmetry, overlapping layers, and a rigorous adherence to tonal depth over structural lines, we create a workspace that feels breathing and alive. We don't just "display" data; we curate it. This system prioritizes whitespace as a functional element, using it to guide the eye through complex workflows with sophisticated ease.

---

## 2. Colors & Surface Philosophy

The palette is a transition from high-vibrancy digital tones to a "muted-luxury" spectrum, now adapted for a dark mode experience. We utilize slate blues, soft plums, and terracotta reds to signify action without causing cognitive fatigue, appearing richer and more saturated against the dark background.

### The "No-Line" Rule

**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning or containment.
Boundaries must be defined solely through:

- **Background Shifts:** Placing a `surface-container-low` component against a `surface` background.
- **Tonal Transitions:** Using the `outline-variant` at 10-15% opacity only when absolutely necessary for accessibility.

### Surface Hierarchy & Nesting

Treat the UI as a physical stack of fine paper. Use the following tiers to define depth:

- **Base Layer:** `surface` (#1B1C1E) – The canvas, providing a rich, dark foundation.
- **Secondary Areas:** `surface-container-low` (#252629) – Used for sidebars or secondary utilities.
- **Interactive Components:** `surface-container-lowest` (#303134) – Used for cards or high-priority inputs to make them "pop" against the darker base.
- **Elevated Modals:** `surface-bright` (#1B1C1E) – Combined with glassmorphism.

### The "Glass & Signature" Rule

To break the "flat" SaaS aesthetic, floating elements (menus, tooltips, navigation bars) should utilize **Glassmorphism**:

- **Background:** Semi-transparent `surface` or `primary-container`.
- **Effect:** `backdrop-filter: blur(20px)`.
- **Signature Polish:** Use a subtle linear gradient on primary CTAs transitioning from `primary` (#4A628A) to `primary-dim` (#3B537A) to give buttons a tactile, "pressed-ink" quality.

---

## 3. Typography

We use **Manrope** exclusively. Its geometric yet humanist qualities allow it to scale from aggressive editorial headlines to micro-labeling without losing character.

- **Display (LG/MD/SM):** Set with tight letter-spacing (-0.02em). Use these for high-impact data points or "Kinetic Gallery" hero moments.
- **Headlines:** The "Anchor." High contrast is mandatory. Use `on-surface` (#E3E2E6) for all headlines to ensure a bold, authoritative hierarchy against the dark background.
- **Body (LG/MD/SM):** Optimized for readability. Use `on-surface-variant` (#C4C6CA) for long-form text to reduce visual weight while maintaining WCAG AA contrast.
- **Labels:** Always uppercase with +0.05em letter-spacing. Labels should feel like architectural annotations on a blueprint.

---

## 4. Elevation & Depth

Depth in this system is achieved through **Tonal Layering**, not shadows.

- **The Layering Principle:** Place a `surface-container-lowest` (#303134) card on top of a `surface-container` (#2C2D30) section. This creates a natural, soft lift that feels integrated into the environment.
- **Ambient Shadows:** For floating elements only.
- **Blur:** 40px – 60px.
- **Opacity:** 4% – 8%.
- **Color:** Use a tinted shadow based on `on-surface` (e.g., a deep slate tint) rather than pure black.
- **The "Ghost Border" Fallback:** If a container lacks sufficient contrast against its parent, use the `outline-variant` token at **15% opacity**. This provides a "suggestion" of a boundary without the harshness of a traditional border.

---

## 5. Components

### Buttons

- **Primary:** Gradient fill (`primary` to `primary-dim`). White text (`on-primary`). Roundedness: Maximum, pill-shaped (reflecting `roundedness: 3`).
- **Secondary:** Surface-based. `surface-container-high` background with `on-primary-container` text. No border.
- **Tertiary:** Text-only. Uses `primary` color with a subtle `surface-container` hover state.

### Cards & Lists

- **The Divider Ban:** Do not use `
` tags or border-bottoms to separate list items. Use **Vertical White Space** (spacing `4` or `5`) or alternating tonal shifts between `surface-container-low` and `surface-container-lowest`.

- **Interactive State:** On hover, a card should transition from `surface-container-lowest` to `surface-bright` with a 4% ambient shadow.

### Input Fields

- **Styling:** Use `surface-container-low` as the field background.
- **Focus State:** Transition the background to `surface-container-lowest` and add a 1px "Ghost Border" using the `primary` token at 40% opacity.
- **Error State:** Use `error` (#9f403d) for the label and an `error-container` (#601410) tint for the field background to signify a "warning glow."

### Chips

- **Selection Chips:** Use `secondary-container` (#90708f) with `on-secondary-container` (#FFDBF3) text. The soft plum tone provides a professional, sophisticated distinction from the primary blue actions.

---

## 6. Do's and Don'ts

### Do

- **Do** embrace asymmetry. In a gallery layout, allow some columns to be wider than others or offset images/data-viz.
- **Do** use the Spacing Scale rigorously. Use large gaps (`spacing-12` or `spacing-16`) to separate major conceptual groups.
- **Do** use `tertiary` (#A65D52) for "Human" or "Organic" touchpoints—notifications, user feedback, or celebratory states.

### Don't

- **Don't** use 100% opaque borders. They clutter the "Kinetic" flow and make the UI feel like a legacy spreadsheet.
- **Don't** use pure black (#000000) for text. Use `on-background` (#E3E2E6) to maintain the "premium ink" feel.
- **Don't** overcrowd the viewport. If a screen feels busy, increase the background-to-component ratio using the `surface` color.

---

## 7. Key Design Tokens Reference

| Role                    | Token                      | Hex                      |
| :---------------------- | :------------------------- | :----------------------- |
| **Primary Action**      | `primary`                  | #4A628A                  |
| **Secondary (Plum)**    | `secondary`                | #765B75                  |
| **Accent (Terracotta)** | `tertiary`                 | #A65D52                  |
| **Main Canvas**         | `surface`                  | #1B1C1E                  |
| **High-Priority Card**  | `surface-container-lowest` | #303134                  |
| **Text (Primary)**      | `on-surface`               | #E3E2E6                  |
| **Text (Secondary)**    | `on-surface-variant`       | #C4C6CA                  |
| **Border Fallback**     | `outline-variant`          | #7E909B (at 15% opacity) |
