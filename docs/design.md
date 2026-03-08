# Visual Design System (Current UI)

## 1) Visual direction actually implemented
Current design language is a modern SaaS style with:
- light base surfaces for app content,
- dark hero/brand zones for landing and auth left panels,
- green as primary action color,
- compact, dense dashboard UI for operational tasks.

The system already has two major visual environments:
- Public/marketing surfaces (`Landing`, auth split left panel).
- Product/dashboard surfaces (`DashboardLayout` + module pages).

## 2) Tokens and foundations (from `src/index.css`)

### 2.1 Typography
- Display font: `Space Grotesk` (`--font-display`).
- Body font: `Inter` (`--font-body`).
- Usage pattern:
  - Headings and brand names use display font.
  - Body copy, labels, and data rows use body font.

### 2.2 Core color tokens
- Background: `hsl(150 10% 97%)`
- Foreground: `hsl(220 25% 10%)`
- Primary: `hsl(160 84% 29%)`
- Secondary surface: `hsl(150 15% 93%)`
- Accent surface: `hsl(160 60% 94%)`
- Muted text: `hsl(220 10% 46%)`
- Border/input: `hsl(150 10% 90%)`

Semantic extension tokens:
- Success: `hsl(160 84% 29%)`
- Warning: `hsl(38 92% 50%)`
- Info: `hsl(210 80% 52%)`
- Destructive: `hsl(0 72% 51%)`

Sidebar tokens:
- Sidebar background: `hsl(220 25% 7%)`
- Sidebar foreground: `hsl(220 10% 70%)`
- Sidebar accent bg: `hsl(220 20% 12%)`
- Sidebar border: `hsl(220 20% 14%)`

### 2.3 Gradients
- Primary gradient: green diagonal blend (`--gradient-primary`).
- Hero gradient: dark blue/charcoal blend (`--gradient-hero`).
- Card gradient token exists (`--gradient-card`) but current pages rely mostly on flat cards.

### 2.4 Radius, border, and shadow
- Base radius token: `--radius: 0.625rem`.
- Practical usage in pages:
  - cards: `rounded-xl`
  - controls/buttons: `rounded-lg`
  - badges: full pill
- Shadows:
  - subtle surface shadows via `shadow-sm`/`shadow-md`
  - glow effects on hero CTA (`--shadow-glow`)

### 2.5 Motion
Defined animations:
- `fade-in`
- `slide-in-left`
- `pulse-glow`

Actual usage pattern:
- `animate-fade-in` on dashboard page bodies.
- Framer Motion entry sequences on landing hero and sections.

## 3) Core layout patterns

### 3.1 Landing
Pattern in `src/pages/Landing.tsx`:
- Fixed semi-transparent nav (`bg-card/80` + blur).
- Large dark hero with radial overlays.
- Alternating sections (`bg-card` and default background).
- CTA blocks and feature grids using `ventrix-card`.
- Social proof and final CTA before footer.

Key behavior:
- Max container widths (`max-w-4xl`, `max-w-6xl`, `max-w-7xl`).
- Stacked mobile-first sections, grid expansion at `md`/`lg`.

### 3.2 Auth (login/register)
Pattern in `src/pages/Login.tsx` and `src/pages/Register.tsx`:
- Split screen on large devices:
  - left marketing panel (`ventrix-hero-bg`),
  - right form panel.
- Single-column adaptive form on mobile.
- Inputs and primary/secondary actions use shared utility classes.

### 3.3 Dashboard shell
Pattern in `src/components/DashboardLayout.tsx`:
- Full-height app shell (`h-screen`).
- Fixed-width left sidebar (`w-60`).
- Topbar (`h-14`) + scrollable main content.
- Content pages use `space-y-*` section stacks and grid blocks.

## 4) Sidebar and topbar patterns

### 4.1 Sidebar (`src/components/AppSidebar.tsx`)
- Dark vertical navigation with grouped sections:
  - Principal
  - Inteligencia
  - Bottom settings + user mini-profile
- Active state:
  - `bg-sidebar-accent`
  - stronger text
  - right dot indicator
- Navigation row shape:
  - icon + label + optional active marker
  - compact density (`px-3 py-2`, text-sm)

### 4.2 Topbar (`src/components/DashboardTopbar.tsx`)
- Left: screen title (display font).
- Right: search, workspace switch, primary quick action, notifications, avatar.
- Search hidden on small screens (`hidden md:block`).
- Compact controls (`h-8`) to keep dashboard density high.

## 5) Reusable UI patterns in modules

### 5.1 Cards
Primary card style is `ventrix-card`:
- white surface,
- rounded corners,
- border,
- subtle shadow,
- hover shadow increment.

Variants seen across screens:
- metric cards (`ventrix-metric`)
- bordered cards with left color accent (insight severity)
- dashed upload/drop area cards

### 5.2 Tables
Pattern class: `ventrix-table`
- compact text (`text-sm` base, often `text-xs` inner content)
- light row dividers
- hover row feedback (`bg-muted/50`)
- common mixed-cell pattern:
  - main value + secondary metadata line,
  - status badge,
  - progress micro-bar,
  - trailing action icon.

### 5.3 Badges and status chips
Pattern:
- base badge class + semantic variant class.
- variants used:
  - success
  - warning
  - danger
  - info
- used for lead state, campaign state, segment labels, role tags, integration status.

### 5.4 Forms
Shared input class: `ventrix-input`:
- fixed height around 40px,
- rounded, bordered,
- focus ring on primary hue.

Forms use:
- small labels (`text-xs`),
- grouped spacing (`space-y-4`),
- inline icon affordances (password reveal, search prefix),
- textarea and select styled with same visual family.

### 5.5 Buttons
Shared button utilities:
- `ventrix-btn-primary`
- `ventrix-btn-secondary`
- `ventrix-btn-hero`
- `ventrix-btn-outline-hero`

Behavior pattern:
- short transition durations,
- no heavy motion except hero CTA glow/hover lift,
- compact dashboard button sizes (`h-8`/`h-9`) and larger marketing CTAs (`h-12`).

## 6) Spacing and density conventions

Observed spacing rhythm:
- Page section stacks: `space-y-6` (dashboard default)
- Grid gaps: mostly `gap-4`, `gap-5`, `gap-6`
- Card paddings:
  - `p-4` lightweight,
  - `p-5` default,
  - `p-6` feature/detail sections
- Dashboard content inset: `p-6` in `main`.

Density model:
- Dashboard prioritizes compact information density.
- Landing/auth allow larger vertical breathing room (`py-20`, `pt-32`, etc).

## 7) Consistency rules for future screens

To stay visually aligned with current product:

1. Layout
- Use `DashboardLayout` for every authenticated module screen.
- Keep `space-y-6` page rhythm and `grid ... gap-4/6` blocks.

2. Typography
- Titles/headings with display font.
- Data and controls with body font.
- Keep small label scale (`text-xs`) for metadata, helper text, badges.

3. Surface system
- Prefer `ventrix-card` and `ventrix-metric` over ad-hoc containers.
- Maintain light surfaces in dashboard and dark surfaces only for hero/brand zones.

4. Interaction
- Reuse button/input utility classes.
- Keep hover/focus states subtle and consistent with existing tokens.

5. Status semantics
- Use same semantic colors and badge variants for state communication.
- Keep thresholds consistent (green positive, yellow warning, red risk).

6. Data presentation
- Continue current table style for list-heavy modules.
- Keep rows compact with optional secondary metadata line.

7. Responsiveness
- Preserve current breakpoints (`md`, `lg`, `xl`) and collapse behavior:
  - hide secondary controls on small devices,
  - stack columns to single-column where needed.

## 8) Current visual inconsistencies detected

- Some legacy template CSS remains in `src/App.css` and does not match active design system usage.
- Spanish text encoding artifacts are visible in multiple labels and copy.
- Some iconography/copy references are hardcoded mock values, so future dynamic data may expose width/overflow edge cases that are not yet tested.
- There is an unused `src/pages/Index.tsx` visual page not wired in router, which can confuse future contributors.
