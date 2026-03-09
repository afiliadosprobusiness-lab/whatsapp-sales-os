# Context Map (Current Frontend)

## 1) Purpose of this file
This file defines bounded contexts inferred from the current UI implementation and route structure. It is intended to help future agents implement backend/state logic without breaking the current screen model.

## 2) Global product intent (as represented in UI)
WhatsSalesRecovery is presented as a WhatsApp sales operating system for LATAM businesses focused on:
- lead organization,
- conversational selling,
- recovery of abandoned opportunities,
- campaign execution,
- AI-assisted optimization,
- revenue visibility.
- Backend-owned channel integration (YCloud only as provider adapter, never called directly from frontend).
- Conversation history persisted and rendered inside CRM as product source of truth.

## 3) Context inventory

### A) Public Marketing Context
- Purpose: communicate value proposition and drive account creation.
- Responsibilities:
  - Landing narrative (problem, solution, features, use cases, CTA).
  - Conversion to auth routes.
- Main screens/components:
  - `src/pages/Landing.tsx`
- Inputs/outputs:
  - Input: anonymous visit.
  - Output: navigate to `/login` or `/register`.

### B) Auth Context
- Purpose: user sign-in and account registration entry point.
- Responsibilities:
  - Login and register forms with `idle | loading | success | error | unauthorized` status handling.
  - Session bootstrap (`GET /auth/me`) on app init through a central provider.
  - Use backend httpOnly cookie session as source of truth (`credentials: include`).
  - Route protection for private screens (`RequireAuth`) and guest-only auth pages (`RequireGuest`).
  - Logout action from private shell components.
- Main screens/components:
  - `src/pages/Login.tsx`
  - `src/pages/Register.tsx`
  - `src/lib/session.ts`
  - `src/guards/RequireAuth.tsx`
  - `src/guards/RequireGuest.tsx`
  - `src/services/auth.service.ts`
- Inputs/outputs:
  - Input: credentials/profile fields.
  - Output: authenticated user context for UI, route to private modules, logout to `/login`.

### C) Workspace and Access Context
- Purpose: represent account scope, members, and business profile.
- Responsibilities:
  - Workspace identity in topbar.
  - Team member listing and role visualization.
  - Business profile loading/saving against backend workspace scope (`GET/PATCH /workspace/me`).
  - Branding settings (still UI-only placeholder).
- Main screens/components:
  - `src/components/DashboardTopbar.tsx` (workspace switcher)
  - `src/pages/Settings.tsx` (profile, team)
- Inputs/outputs:
  - Input: profile updates, role updates, invites.
  - Output: workspace-level configuration used across all operational contexts.

### D) Dashboard Overview Context
- Purpose: central operational snapshot.
- Responsibilities:
  - Aggregate KPIs from leads, conversations, recovery, campaigns, and revenue.
  - Surface top leads, alerts, and recent activity.
- Main screens/components:
  - `src/pages/Dashboard.tsx`
- Inputs/outputs:
  - Input: cross-context metrics.
  - Output: summary for daily prioritization.

### E) Leads Context
- Purpose: manage lead pipeline and per-lead qualification.
- Responsibilities:
  - Pipeline stage visibility and real workspace lead listing.
  - Lead table with priority/score/probability/value from backend data.
  - Lead detail panel with backend detail fetch (`GET /leads/:id`).
  - Lead activity timeline fetch from dedicated backend endpoint (`GET /leads/:id/activity`).
  - WhatsApp message timeline rendering in lead detail, derived from persisted activity events (`GET /leads/:id/activity`).
  - Manual WhatsApp reply from lead detail (`POST /leads/:id/messages`) with immediate refresh of timeline/activity.
  - Manual note/activity creation from lead detail (`POST /leads/:id/activity`) with immediate refresh.
  - Lead follow-up tasks listing from backend (`GET /leads/:id/tasks`) with explicit loading/error/empty handling.
  - Lead follow-up task creation and basic editing (`POST /leads/:id/tasks`, `PATCH /tasks/:id`).
  - Lead follow-up task status updates (`PATCH /tasks/:id/status`) with per-lead refresh after mutations.
  - Graceful fallback states for WhatsApp module rollout (`404 | 501 | 503 | timeout`) without breaking lead detail UI.
  - Basic lead operations: create, edit, and status update against backend.
  - Explicit UI data states: `idle | loading | success | error | empty`.
- Main screens/components:
  - `src/pages/Leads.tsx`
  - `src/services/leads.service.ts`
  - `src/types/leads.ts`
  - `src/services/lead-activity.service.ts`
  - `src/types/lead-activity.ts`
  - `src/services/lead-messages.service.ts`
  - `src/types/lead-messages.ts`
  - `src/services/lead-tasks.service.ts`
  - `src/types/lead-tasks.ts`
- Inputs/outputs:
  - Input: lead attributes, filters, assignment, manual notes.
  - Output: prioritized lead set consumed by Conversations/Recovery/Campaigns/Deal Probability.

### F) Global Tasks Inbox Context
- Purpose: operate all follow-up tasks of the workspace from one queue.
- Responsibilities:
  - Fetch global follow-up list from backend (`GET /tasks`).
  - Provide operational filters (`pending`, `today`, `overdue`, `done`).
  - Expose optional summary counters (`GET /tasks/summary`) when available.
  - Trigger quick status update (`PATCH /tasks/:id/status`) for mark-done flow.
  - Link each task to related lead navigation (`/leads?leadId=...`) without changing leads architecture.
- Main screens/components:
  - `src/pages/TasksInbox.tsx`
  - `src/services/tasks.service.ts`
  - `src/types/tasks.ts`
- Inputs/outputs:
  - Input: workspace task backlog and status updates.
  - Output: daily follow-up execution queue for sales operators.

### G) Conversations Context
- Purpose: operate active WhatsApp-like conversations tied to leads.
- Responsibilities:
  - Conversation list and unread tracking.
  - Chat thread rendering and send action.
  - Quick AI suggestion shortcuts.
  - Right-side lead context in thread.
- Main screens/components:
  - `src/pages/Conversations.tsx`
- Inputs/outputs:
  - Input: messages, thread actions, assignment state.
  - Output: conversation events and engagement signals for scoring/recovery/revenue.

### H) Chatbot Context
- Purpose: configure AI assistant behavior in sales conversations.
- Responsibilities:
  - Assistant name/objective/tone/rules.
  - Trigger activation.
  - Conversation simulation preview.
  - Canned response templates.
- Main screens/components:
  - `src/pages/ChatbotAI.tsx`
- Inputs/outputs:
  - Input: config and trigger toggles.
  - Output: automated bot behavior consumed by Conversations and Recovery.

### I) Recovery Context
- Purpose: reactivate cold leads and abandoned conversations.
- Responsibilities:
  - Detect recoverable leads.
  - Manage reactivation sequences.
  - Provide recovery message templates.
  - Track recovered revenue and reactivation metrics.
- Main screens/components:
  - `src/pages/Recovery.tsx`
- Inputs/outputs:
  - Input: inactivity/risk signals from Leads/Conversations.
  - Output: recovered leads and revenue impact consumed by Dashboard/Revenue modules.

### J) Campaigns Context
- Purpose: orchestrate outbound campaigns and measure impact.
- Responsibilities:
  - Campaign CRUD status flow (draft/active/paused/completed).
  - Audience targeting.
  - Message template editing.
  - Campaign result tracking.
- Main screens/components:
  - `src/pages/Campaigns.tsx`
- Inputs/outputs:
  - Input: target segment definitions and campaign content.
  - Output: sends, responses, recovered leads/revenue.

### K) Imports Context
- Purpose: bootstrap or enrich lead data from CSV/XLSX.
- Responsibilities:
  - File intake.
  - CSV-to-system field mapping.
  - Validation and error/warning review.
  - Commit imported contacts.
- Main screens/components:
  - `src/pages/ImportCSV.tsx`
- Inputs/outputs:
  - Input: source file and mapping config.
  - Output: lead records for Leads/Campaigns/Recovery.

### L) Deal Probability Context
- Purpose: scoring and opportunity ranking.
- Responsibilities:
  - Assign probability scores.
  - Classify lead tier (hot/warm/cold).
  - Expose positive and risk signals.
  - Recommend next best action.
- Main screens/components:
  - `src/pages/DealProbability.tsx`
- Inputs/outputs:
  - Input: lead attributes + conversation behavior signals.
  - Output: actionable ranking consumed by Leads, Dashboard, Campaign targeting.

### M) Offer Optimization Context
- Purpose: improve sales copy quality and conversion potential.
- Responsibilities:
  - Analyze current sales messages.
  - Suggest improved variants and rationale.
  - Expose communication quality metrics.
- Main screens/components:
  - `src/pages/OfferOptimizer.tsx`
- Inputs/outputs:
  - Input: raw copy/message snippets.
  - Output: optimized templates used by Conversations/Chatbot/Campaigns/Recovery.

### N) Revenue Intelligence Context
- Purpose: diagnose revenue patterns and opportunities.
- Responsibilities:
  - Revenue KPIs and flow visualization.
  - Automated insight generation.
  - Segment-level performance analysis.
- Main screens/components:
  - `src/pages/RevenueIntelligence.tsx`
- Inputs/outputs:
  - Input: campaign/lead/conversation outcomes.
  - Output: optimization priorities for operations and strategy.

### O) Revenue Reporting Context
- Purpose: periodic and exportable business reporting.
- Responsibilities:
  - Time-range report views.
  - Monthly revenue/recovery tables.
  - Top campaign ranking.
  - Segment closure reporting.
- Main screens/components:
  - `src/pages/RevenueReports.tsx`
- Inputs/outputs:
  - Input: aggregated transactional performance data.
  - Output: historical reports for management and billing alignment.

### P) Platform Settings Context
- Purpose: operational configuration of workspace.
- Responsibilities:
  - Profile settings connected to workspace API (`GET/PATCH /workspace/me`).
  - WhatsApp channel setup/edit lifecycle via backend (`GET /channels/whatsapp`, `POST /channels/whatsapp`, `PATCH /channels/whatsapp/:id`).
  - Branding.
  - Team access.
  - Automation toggles.
  - Notification preferences.
  - Billing and integration status.
- Main screens/components:
  - `src/pages/Settings.tsx`
- Inputs/outputs:
  - Input: admin-level config changes.
  - Output: system-wide behavior flags and integration availability.

## 4) Relations between contexts

Primary dependency flow in current product model:
1. Public Marketing -> Auth -> Workspace.
2. Workspace provides scope for Leads, Global Tasks Inbox, Conversations, Campaigns, Recovery, and Settings.
3. Settings publishes channel configuration (including WhatsApp provider status) consumed by Leads and future Conversations runtime.
4. Leads, Global Tasks Inbox, and Conversations feed Deal Probability and Recovery.
5. Offer Optimization and Chatbot provide content/automation improvements for Conversations and Campaigns.
6. Campaigns and Recovery outcomes feed Revenue Intelligence and Revenue Reports.
7. Dashboard Overview aggregates outputs from Leads, Conversations, Recovery, Campaigns, and Revenue.

## 5) Shared cross-context UI infrastructure

Shared layout/runtime components:
- `src/components/DashboardLayout.tsx` (shell)
- `src/components/AppSidebar.tsx` (module navigation)
- `src/components/DashboardTopbar.tsx` (global quick actions)
- `src/index.css` design tokens and utility classes (`ventrix-*`)

Shared responsibilities:
- Global navigation consistency.
- Reused visual primitives (cards, badges, tables, inputs, buttons).
- Unified spacing, typography, and interaction pattern across dashboard modules.

## 6) Current context-level constraints and risks

- Auth is integrated against production backend (`https://backend-production-80db.up.railway.app`) through `VITE_API_URL` (fallback `VITE_API_BASE_URL`).
- No token or sensitive session data is persisted in `localStorage`; intended production strategy is cookie httpOnly + `GET /auth/me`.
- Backend CORS currently whitelists `http://localhost:5173`; deployed frontend domain must be added in backend `FRONTEND_URL`.
- Role-based route gating is still pending (only authenticated/guest guards are implemented).
- No explicit cross-context store; most pages own local mock data, except Settings, Leads, and Global Tasks Inbox which now use React Query + dedicated backend services.
- WhatsApp channel/messages endpoints can be temporarily unavailable during Railway incident windows; frontend now includes unavailable fallbacks to avoid UI breaks until backend deploy stabilizes.
- Some text encoding artifacts appear in Spanish labels; should be normalized before production content freeze.
