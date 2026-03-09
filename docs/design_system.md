# Design System Baseline

## 1) Goal
Keep dashboard UI consistent using existing `ventrix-*` tokens, utilities, and components without large redesigns.

## 2) Typography
- Display font: `Space Grotesk` (`--font-display`)
- Body font: `Inter` (`--font-body`)
- Usage:
  - Headlines and section titles use display font.
  - Body copy, labels, and table content use body font.

## 3) Color Tokens (source: `src/index.css`)
- Base:
  - `--background`, `--foreground`
  - `--card`, `--card-foreground`
  - `--border`, `--input`
- Brand and semantic:
  - `--primary`, `--primary-foreground`
  - `--success`, `--warning`, `--info`, `--destructive`
- Sidebar:
  - `--sidebar-background`, `--sidebar-foreground`
  - `--sidebar-accent`, `--sidebar-primary`

## 4) Core Surfaces and Primitives
- Cards: `.ventrix-card`
- Metric cards: `.ventrix-metric`
- Table: `.ventrix-table`
- Input: `.ventrix-input`
- Buttons:
  - Primary: `.ventrix-btn-primary`
  - Secondary: `.ventrix-btn-secondary`
- Badges:
  - Base: `.ventrix-badge`
  - Variants: `.ventrix-badge-success|warning|danger|info`

## 5) Layout Rules
- Dashboard pages must use `DashboardLayout`.
- Keep shell structure stable:
  - Left sidebar for module navigation.
  - Topbar for page title and global actions.
  - Main content inside card/grid compositions.
- Prefer simple responsive grids:
  - `grid-cols-2` for compact metrics.
  - `lg:grid-cols-*` for desktop density.

## 6) Interaction States
- Every backend-driven screen must include:
  - `loading`
  - `error`
  - `unavailable` (for backend modules still pending deploy, e.g. `404/501/503/timeout`)
  - `empty`
  - `success`
- Retry actions must be explicit on error states.
- Mutations should provide immediate feedback via toast.
- Unavailable state should use warning-style surface (`warning` tokens), never break layout, and keep a clear "Reintentar" action.

## 7) Accessibility Baseline
- Use semantic table structure for tabular data.
- Keep color + text status signals (not color alone).
- Preserve focus-visible styles from existing controls.

## 8) Scope Notes
- This document defines the current baseline only.
- New modules should extend this baseline, not replace it.

## 9) WhatsApp UI Pattern
- Channel configuration in Settings should live inside Integraciones card with:
  - provider/status badge
  - compact form fields
  - explicit unavailable feedback when backend endpoints are not ready.
- Lead-detail WhatsApp timeline should:
  - stay inside existing side panel (no separate inbox screen),
  - differentiate inbound/outbound bubbles by alignment + surface color,
  - include manual composer with loading/error/unavailable feedback.
