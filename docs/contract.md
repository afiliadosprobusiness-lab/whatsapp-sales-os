# Contract Document (UI-Driven)

## 1) Scope and current baseline
This document describes functional and structural contracts inferred from the current frontend implementation.

Current status in codebase:
- SPA with React + React Router.
- Public index route now serves an interactive qualification funnel (quiz + VSL style flow) instead of the legacy static landing.
- All domain screens exist as routes.
- Most domain screens still render static/mock data (local arrays inside page components), except Auth, Workspace Settings, and Leads.
- Auth module is integrated to production API with cookie session.
- Settings business profile now uses real workspace API (`GET /workspace/me`, `PATCH /workspace/me`).
- Leads module now uses real backend API (`GET /leads`, `POST /leads`, `GET /leads/:id`, `PATCH /leads/:id`, `PATCH /leads/:id/status`).
- Lead activity inside lead detail now uses real backend API (`GET /leads/:id/activity`, `POST /leads/:id/activity`) for historial and manual notes.
- Lead WhatsApp messaging in lead detail now uses backend-owned endpoints (`GET /leads/:id/activity` as source of persisted history + `POST /leads/:id/messages` for manual replies).
- Lead follow-up tasks inside lead detail now use real backend API (`GET /leads/:id/tasks`, `POST /leads/:id/tasks`, `PATCH /tasks/:id`, `PATCH /tasks/:id/status`) for reminders CRUD basico y estado.
- Global tasks inbox now uses real backend API (`GET /tasks`) with optional summary (`GET /tasks/summary`) and optional quick status update (`PATCH /tasks/:id/status`).
- Settings integrations now include backend-owned WhatsApp channel configuration (`GET /channels/whatsapp`, `POST /channels/whatsapp`, `PATCH /channels/whatsapp/:id`) with graceful unavailable states while Railway deploy is unstable.
- YCloud remains only a backend channel provider adapter; frontend never calls provider APIs directly and CRM activity remains source of truth for visible conversation history.
- `@tanstack/react-query` is configured globally and is now used by Settings business profile integration.

Routes implemented:
- `/` Interactive qualification funnel
- `/landing` Legacy landing
- `/login` Login
- `/register` Register
- `/dashboard` Overview
- `/leads`
- `/tasks`
- `/conversations`
- `/chatbot`
- `/recovery`
- `/import`
- `/campaigns`
- `/deal-probability`
- `/offer-optimizer`
- `/revenue-intelligence`
- `/revenue-reports`
- `/settings`

## 2) Main modules and visible structures

| Module | Route | Main visible structures |
|---|---|---|
| Interactive Funnel | `/` | Multi-step guided flow, persistent progress bar, quiz question cards, reinforcement step, gated video CTA, authority/program/bonuses/objection/social-proof/final-offer steps, loading transitions, configurable checkout CTA |
| Landing (legacy) | `/landing` | Hero, feature cards, process steps, use-case cards, CTA sections |
| Auth | `/login`, `/register` | Two-panel auth layout, credential forms, social auth button |
| Dashboard Overview | `/dashboard` | KPI metric cards, mock chart, insights cards, leads table, activity feed, alert widgets |
| Leads | `/leads` | Pipeline stage cards, lead table, filters, detail side panel |
| Tasks Inbox | `/tasks` | Global follow-up/task list, filter chips, optional summary counters, quick done action, lead navigation |
| Conversations | `/conversations` | Conversation list, chat thread, AI suggestion chips, lead info panel |
| Chatbot | `/chatbot` | Config forms, objection tags, trigger toggles, preview thread, advanced settings |
| Recovery | `/recovery` | Recovery KPIs, cold lead table, sequence cards, recovery message templates |
| Campaigns | `/campaigns` | Campaign KPI cards, campaign table, campaign editor form, result funnel |
| Imports | `/import` | Upload area, field mapping rows, validation table, post-import actions |
| Deal Probability | `/deal-probability` | Ranked opportunity list, score bars, risk/signal tags, tier distribution cards |
| Offer Optimizer | `/offer-optimizer` | Communication quality score cards, before/after message blocks, optimization tags |
| Revenue Intelligence | `/revenue-intelligence` | Revenue KPI cards, stacked revenue bars, AI insight list, segment performance table |
| Revenue Reports | `/revenue-reports` | Period filters, KPI cards, monthly report chart, campaign ranking, segment bars |
| Settings | `/settings` | Settings tabs, business profile form, team table, automation toggles, billing card, integration cards |

## 3) Core entities (current conceptual model)

### 3.1 Workspace and identity
- `User`
- `Workspace`
- `WorkspaceMember`

### 3.2 Commercial operation
- `Lead`
- `Task`
- `LeadTimelineEvent`
- `Conversation`
- `Message`
- `Tag`
- `Campaign`
- `CampaignPerformance`
- `RecoverySequence`
- `ImportJob`
- `ImportFieldMapping`

### 3.3 Intelligence layer
- `LeadDealScore`
- `OfferOptimization`
- `RevenueKPI`
- `RevenueInsight`
- `RevenueSegmentPerformance`
- `DashboardOverview`

### 3.4 Settings/operations
- `AutomationRule`
- `NotificationPreference`
- `Integration`
- `Subscription`

## 4) Data types and formats expected from UI

Common primitive expectations from rendered UI:
- `id`: string
- `name`: string
- `email`: string
- `phone`: string in international format (E.164 preferred)
- `money`: currently rendered as localized string (`"$48,320"`), recommended backend format is integer cents
- `percent`: numeric in range 0..100
- `datetime`: ISO 8601 for transport, localized string for UI
- `status`: string enum by module
- `priority`: enum `HIGH | MEDIUM | LOW`

## 5) State catalogs (derived from current screens)

### 5.1 Lead status
- `NEW` (Nuevo)
- `CONTACTED` (Contactado)
- `INTERESTED` (Interesado)
- `FOLLOW_UP` (Seguimiento)
- `CLOSED` (Cerrado)
- `LOST` (Perdido)

### 5.2 Lead temperature/tier
- `HOT` (Caliente)
- `WARM` (Tibio)
- `COLD` (Frio)

### 5.3 Campaign state
- `DRAFT` (Borrador)
- `ACTIVE` (Activa)
- `PAUSED` (Pausada)
- `COMPLETED` (Completada)

### 5.4 Conversation state (implied)
- `OPEN`
- `WAITING_LEAD`
- `WAITING_AGENT`
- `CLOSED`

### 5.5 Import validation state
- `VALID`
- `WARNING`
- `ERROR`

### 5.6 Integration state
- `CONNECTED`
- `AVAILABLE`
- `COMING_SOON`

## 6) Entity relations

- `Workspace 1..* User` via `WorkspaceMember`.
- `Workspace 1..* Lead`.
- `Lead 1..* Conversation` (at least one active channel conversation expected).
- `Conversation 1..* Message`.
- `Lead 1..* LeadTimelineEvent`.
- `Campaign *..* Lead` through targeting and delivery records.
- `RecoverySequence *..* Lead` through recovery executions.
- `ImportJob 1..* Lead` (upsert/create outcome).
- `Lead 1..1 LeadDealScore` (latest scoring snapshot).
- `Workspace 1..* Integration`.
- `Workspace 1..* AutomationRule`.

## 7) DTO/shape proposals for future API alignment

```ts
interface AuthLoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface AuthSessionResponse {
  accessToken: string;
  refreshToken: string;
  user: UserDTO;
  workspace: WorkspaceDTO;
}

interface UserDTO {
  id: string;
  fullName: string;
  email: string;
  role: "ADMIN" | "SELLER" | "VIEWER";
  status: "ACTIVE" | "INVITED" | "DISABLED";
}

interface WorkspaceDTO {
  id: string;
  name: string;
  industry?: string;
  country?: string;
  timezone?: string;
  description?: string;
  branding?: { primaryColor?: string; logoUrl?: string; visibleName?: string };
}

interface LeadDTO {
  id: string;
  workspaceId: string;
  name: string;
  email?: string;
  phone?: string;
  source?: string;
  status: "NEW" | "CONTACTED" | "INTERESTED" | "FOLLOW_UP" | "CLOSED" | "LOST";
  priority: "HIGH" | "MEDIUM" | "LOW";
  score: number; // 0..100
  closeProbability: number; // 0..100
  estimatedValueCents?: number;
  ownerUserId?: string;
  lastContactAt?: string;
  tags?: string[];
}

interface ConversationDTO {
  id: string;
  workspaceId: string;
  leadId: string;
  channel: "WHATSAPP";
  status: "OPEN" | "WAITING_LEAD" | "WAITING_AGENT" | "CLOSED";
  unreadCount: number;
  lastMessageAt: string;
}

interface MessageDTO {
  id: string;
  conversationId: string;
  senderType: "LEAD" | "AGENT" | "BOT";
  body: string;
  createdAt: string;
}

interface CampaignDTO {
  id: string;
  workspaceId: string;
  name: string;
  type: "RECOVERY" | "FOLLOW_UP" | "SPECIAL_OFFER" | "URGENCY" | "DISCOUNT";
  audienceRule: string;
  status: "DRAFT" | "ACTIVE" | "PAUSED" | "COMPLETED";
  scheduledAt?: string;
  templateBody: string;
}

interface ImportJobDTO {
  id: string;
  workspaceId: string;
  filename: string;
  status: "UPLOADED" | "MAPPED" | "VALIDATED" | "IMPORTED" | "FAILED";
  totalRows: number;
  validRows: number;
  warningRows: number;
  errorRows: number;
  fieldMappings: Array<{ csvField: string; systemField: string; matched: boolean }>;
}

interface LeadDealScoreDTO {
  leadId: string;
  score: number;
  tier: "HOT" | "WARM" | "COLD";
  positiveSignals: string[];
  riskSignals: string[];
  suggestedAction?: string;
  scoredAt: string;
}

interface RevenueKPIDTO {
  estimatedRevenueCents: number;
  recoveredRevenueCents: number;
  potentialLossCents: number;
  activeOpportunities: number;
}
```

## 8) Functional contracts by requested domain

### 8.1 Auth
UI evidence:
- Login uses `email`, `password`, `remember me`.
- Register uses `full name`, `email`, `password`, `confirm password`, terms checkbox.

Contract:
- `POST /auth/login`
- `POST /auth/register`
- `POST /auth/logout`
- `GET /auth/me`
- Transport requirements:
  - `Content-Type: application/json`
  - `credentials: "include"`
  - No token persistence in `localStorage`
- Expected success envelope:
  - `{ data: { user: { id, fullName|name, email, role? } }, error: null }`
- Expected error envelope:
  - `{ data: null, error: { code, message, details?.fieldErrors? } }`

### 8.0 Public Funnel (Marketing Qualification)
UI evidence:
- Guided mobile-first sequence with step transitions and top progress state.
- Quiz-like question flow with answer capture and future scoring-ready structure.
- Video step where CTA unlock is conditioned by playback progress threshold or fallback timed playback.
- Final offer with FAQ and checkout redirect URL configurable through frontend env (`VITE_FUNNEL_CHECKOUT_URL`) or funnel content constants.

Contract:
- No backend contract required in this version (frontend-only state machine).
- State model for future extension:
  - `currentStepIndex`
  - `answers: Record<string,string>`
  - `qualificationScore`
  - `videoProgress`
  - `videoUnlocked`
- Lightweight persistence:
  - `sessionStorage` key: `wsr-interactive-funnel-v1`
- Routing contract:
  - `/` interactive funnel
  - `/landing` legacy landing retained for secondary access

### 8.2 Users / Workspace
UI evidence:
- Workspace switcher in topbar (`Mi Tienda Online`).
- Team table in Settings with role/state.
- Business profile and branding fields.

Contract:
- `GET /workspace/me`
- `PATCH /workspace/me`
- `GET /workspaces/current/members`
- `POST /workspaces/current/members/invite`
- `PATCH /workspaces/current/members/:memberId`

### 8.3 Leads
UI evidence:
- Pipeline stage summary, lead list table, score/probability, detail panel.

Contract:
- `GET /leads` with filters (`status`, `priority`, `owner`, `query`, `source`).
- `GET /leads/:leadId`
- `POST /leads`
- `PATCH /leads/:leadId`
- `PATCH /leads/:leadId/status`
- `GET /leads/:leadId/activity`
- `POST /leads/:leadId/activity`
- `POST /leads/:leadId/messages`
- `GET /leads/:leadId/tasks`
- `POST /leads/:leadId/tasks`
- `PATCH /tasks/:taskId`
- `PATCH /tasks/:taskId/status`

### 8.4 Global Tasks Inbox
UI evidence:
- Workspace-wide follow-up list with pending/today/overdue/done filters.
- Optional counters panel when backend exposes summary endpoint.
- Per-task lead reference with navigation to lead detail flow.
- Quick "mark done" action when backend status endpoint is available.

Contract:
- `GET /tasks`
- `GET /tasks/summary` (optional)
- `PATCH /tasks/:taskId/status` (optional quick update)

### 8.5 Conversations
UI evidence:
- Conversation list, unread badges, message thread, lead side panel, AI suggestion chips.

Contract:
- `GET /conversations`
- `GET /conversations/:conversationId/messages`
- `POST /conversations/:conversationId/messages`
- `POST /conversations/:conversationId/assign`
- `POST /conversations/:conversationId/close`

### 8.6 Chatbot
UI evidence:
- Assistant identity, objective, tone, behavior rules, triggers, canned message examples.

Contract:
- `GET /chatbot/config`
- `PATCH /chatbot/config`
- `GET /chatbot/triggers`
- `PATCH /chatbot/triggers/:triggerId`
- `POST /chatbot/simulate`

### 8.7 Recovery
UI evidence:
- Cold lead table, reactivation metrics, sequence definitions, template messages.

Contract:
- `GET /recovery/leads`
- `POST /recovery/reactivate`
- `GET /recovery/sequences`
- `POST /recovery/sequences`
- `PATCH /recovery/sequences/:sequenceId`
- `GET /recovery/metrics`

### 8.8 Campaigns
UI evidence:
- Campaign listing with status and performance, campaign editor, result stats.

Contract:
- `GET /campaigns`
- `POST /campaigns`
- `PATCH /campaigns/:campaignId`
- `POST /campaigns/:campaignId/activate`
- `POST /campaigns/:campaignId/pause`
- `GET /campaigns/:campaignId/performance`

### 8.9 Imports
UI evidence:
- Upload flow (upload, map, validate, import), mapping table, validation summary.

Contract:
- `POST /imports` (file upload)
- `GET /imports/:importId`
- `PATCH /imports/:importId/mappings`
- `POST /imports/:importId/validate`
- `POST /imports/:importId/commit`

### 8.10 Deal Probability
UI evidence:
- Ranking list with score, tier, positive/risk signals, recommended action.

Contract:
- `GET /deal-probability/leads`
- `GET /deal-probability/distribution`
- `POST /deal-probability/recalculate` (optional async job)

### 8.11 Offer Optimizer
UI evidence:
- Before/after message optimization blocks, quality metrics, optimization tags.

Contract:
- `POST /offer-optimizer/analyze` (input: message/content block)
- `GET /offer-optimizer/metrics`
- `GET /offer-optimizer/recommendations`

### 8.12 Revenue Intelligence
UI evidence:
- KPI overview, automatic insights, revenue flow chart, segment table.

Contract:
- `GET /revenue/intelligence/kpis`
- `GET /revenue/intelligence/insights`
- `GET /revenue/intelligence/segments`
- `GET /revenue/intelligence/flow`

### 8.13 Revenue Reports
UI evidence:
- Time range filters, monthly table, top campaigns list, segment closure bars.

Contract:
- `GET /revenue/reports/summary?range=7d|30d|90d|12m`
- `GET /revenue/reports/monthly`
- `GET /revenue/reports/top-campaigns`
- `GET /revenue/reports/segments`
- `GET /revenue/reports/export` (csv/xlsx/pdf)

### 8.14 Settings
UI evidence:
- Profile, team, automations, notification matrix, billing panel, integrations.

Contract:
- `PATCH /settings/profile`
- `GET /settings/automations`
- `PATCH /settings/automations/:ruleId`
- `GET /settings/notifications`
- `PATCH /settings/notifications`
- `GET /settings/billing`
- `GET /settings/integrations`
- `POST /settings/integrations/:provider/connect`
- `GET /channels/whatsapp`
- `POST /channels/whatsapp`
- `PATCH /channels/whatsapp/:id`

### 8.15 Dashboard Overview
UI evidence:
- Composite dashboard with multi-module KPIs and widgets.

Contract:
- `GET /dashboard/overview` returning a composition payload:
  - top KPIs
  - trend series
  - top leads
  - recent activity
  - alerts
  - daily summary

## 9) Dashboard/table/card/widget structural contracts

- Metric card contract: `{ label, value, change?, trend?, icon? }`
- Table contract: `{ columns[], rows[], rowActions? }`
- Badge contract: `{ label, variant }` where `variant in [success, warning, danger, info]`
- Progress contract: `{ current, max=100, colorByThreshold }`
- Insight card contract: `{ title, description, type, impact? }`
- Timeline item contract: `{ text, timestamp, type }`

## 10) Current gaps to preserve during implementation

- Authentication guards are active for private routes and guest-only auth routes.
- Auth API, workspace settings, and leads integration are active; remaining domain modules are still UI-only mock data.
- `Index.tsx` exists but is not routed from `App.tsx`.
- `App.css` keeps Vite template styles and appears unused by current pages.
- UTF-8/encoding artifacts are visible in multiple Spanish strings.
- Domain logic is still UI-only in modules not yet integrated (Conversations, Recovery, Campaigns, Revenue, etc.), while Settings profile/WhatsApp channel, Leads (including WhatsApp manual messaging), and global Tasks Inbox are connected.
- Funnel qualification currently does not branch users to different outcomes; all answers continue to the same final offer while preserving answer/score hooks for future personalization.

## 11) Contract changelog

| Date | Change | Type | Impact |
|---|---|---|---|
| 2026-03-08 | Auth contract aligned to real backend usage (`/auth/register`, `/auth/login`, `/auth/logout`, `/auth/me`) with `{data,error}` envelope and cookie session transport rules. | non-breaking | Frontend auth now depends on backend cookie session and backend error envelope parsing. |
| 2026-03-08 | Workspace settings contract aligned to real backend usage (`/workspace/me` GET/PATCH) for business profile load/save in Settings. | non-breaking | Settings business profile no longer depends on local mocks and now persists against backend workspace scope. |
| 2026-03-08 | Leads contract aligned to real backend usage (`/leads` GET/POST, `/leads/:id` GET/PATCH, `/leads/:id/status` PATCH) with shared `{data,error}` envelope handling. | non-breaking | Leads list/detail/create/edit/status now persist to backend in authenticated workspace scope. |
| 2026-03-08 | Lead activity contract connected in lead detail (`/leads/:id/activity` GET/POST) including manual note creation and refresh flow. | non-breaking | Lead detail activity feed now reads/writes against backend instead of relying on embedded lead timeline payloads only. |
| 2026-03-08 | Lead tasks contract connected in lead detail (`/leads/:id/tasks` GET/POST, `/tasks/:id` PATCH, `/tasks/:id/status` PATCH) with loading/error/empty states and post-mutation refresh. | non-breaking | Lead detail now supports real follow-up reminder listing, basic editing, and done/pending status updates without local mocks. |
| 2026-03-08 | Global tasks inbox contract connected (`/tasks` GET, optional `/tasks/summary` GET, optional `/tasks/:id/status` PATCH) with workspace-wide filters and lead navigation support. | non-breaking | Operators can now run follow-up execution from one global queue without leaving dashboard scope. |
| 2026-03-09 | WhatsApp frontend contract connected to backend-owned channel + lead messaging (`GET/POST/PATCH /channels/whatsapp`, `POST /leads/:id/messages`, message view derived from `GET /leads/:id/activity`) with graceful handling for `404/501/503/timeout` during Railway incident windows. | non-breaking | CRM now exposes WhatsApp setup and manual messaging UX without direct provider calls; features auto-activate when backend deploy finishes. |
| 2026-03-09 | Public index route migrated from static landing to interactive qualification funnel (`/`) with persistent progress, answer capture, gated video CTA, transition screens, and final checkout flow; legacy landing moved to `/landing`. | non-breaking | Marketing entry now uses guided conversion flow while keeping previous landing available as secondary route. |
