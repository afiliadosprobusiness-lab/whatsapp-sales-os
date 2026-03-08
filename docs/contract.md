# Contract Document (UI-Driven)

## 1) Scope and current baseline
This document describes functional and structural contracts inferred from the current frontend implementation.

Current status in codebase:
- SPA with React + React Router.
- All domain screens exist as routes.
- Data in screens is static/mock (local arrays inside page components).
- There is no API integration layer yet (no service/repository/fetch abstraction in use).
- `@tanstack/react-query` is configured globally, but not yet used by pages.

Routes implemented:
- `/` Landing
- `/login` Login
- `/register` Register
- `/dashboard` Overview
- `/leads`
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
| Landing | `/` | Hero, feature cards, process steps, use-case cards, CTA sections |
| Auth | `/login`, `/register` | Two-panel auth layout, credential forms, social auth button |
| Dashboard Overview | `/dashboard` | KPI metric cards, mock chart, insights cards, leads table, activity feed, alert widgets |
| Leads | `/leads` | Pipeline stage cards, lead table, filters, detail side panel |
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
- `POST /auth/refresh`
- `GET /auth/me`

### 8.2 Users / Workspace
UI evidence:
- Workspace switcher in topbar (`Mi Tienda Online`).
- Team table in Settings with role/state.
- Business profile and branding fields.

Contract:
- `GET /workspaces/current`
- `PATCH /workspaces/current`
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
- `GET /leads/:leadId/timeline`

### 8.4 Conversations
UI evidence:
- Conversation list, unread badges, message thread, lead side panel, AI suggestion chips.

Contract:
- `GET /conversations`
- `GET /conversations/:conversationId/messages`
- `POST /conversations/:conversationId/messages`
- `POST /conversations/:conversationId/assign`
- `POST /conversations/:conversationId/close`

### 8.5 Chatbot
UI evidence:
- Assistant identity, objective, tone, behavior rules, triggers, canned message examples.

Contract:
- `GET /chatbot/config`
- `PATCH /chatbot/config`
- `GET /chatbot/triggers`
- `PATCH /chatbot/triggers/:triggerId`
- `POST /chatbot/simulate`

### 8.6 Recovery
UI evidence:
- Cold lead table, reactivation metrics, sequence definitions, template messages.

Contract:
- `GET /recovery/leads`
- `POST /recovery/reactivate`
- `GET /recovery/sequences`
- `POST /recovery/sequences`
- `PATCH /recovery/sequences/:sequenceId`
- `GET /recovery/metrics`

### 8.7 Campaigns
UI evidence:
- Campaign listing with status and performance, campaign editor, result stats.

Contract:
- `GET /campaigns`
- `POST /campaigns`
- `PATCH /campaigns/:campaignId`
- `POST /campaigns/:campaignId/activate`
- `POST /campaigns/:campaignId/pause`
- `GET /campaigns/:campaignId/performance`

### 8.8 Imports
UI evidence:
- Upload flow (upload, map, validate, import), mapping table, validation summary.

Contract:
- `POST /imports` (file upload)
- `GET /imports/:importId`
- `PATCH /imports/:importId/mappings`
- `POST /imports/:importId/validate`
- `POST /imports/:importId/commit`

### 8.9 Deal Probability
UI evidence:
- Ranking list with score, tier, positive/risk signals, recommended action.

Contract:
- `GET /deal-probability/leads`
- `GET /deal-probability/distribution`
- `POST /deal-probability/recalculate` (optional async job)

### 8.10 Offer Optimizer
UI evidence:
- Before/after message optimization blocks, quality metrics, optimization tags.

Contract:
- `POST /offer-optimizer/analyze` (input: message/content block)
- `GET /offer-optimizer/metrics`
- `GET /offer-optimizer/recommendations`

### 8.11 Revenue Intelligence
UI evidence:
- KPI overview, automatic insights, revenue flow chart, segment table.

Contract:
- `GET /revenue/intelligence/kpis`
- `GET /revenue/intelligence/insights`
- `GET /revenue/intelligence/segments`
- `GET /revenue/intelligence/flow`

### 8.12 Revenue Reports
UI evidence:
- Time range filters, monthly table, top campaigns list, segment closure bars.

Contract:
- `GET /revenue/reports/summary?range=7d|30d|90d|12m`
- `GET /revenue/reports/monthly`
- `GET /revenue/reports/top-campaigns`
- `GET /revenue/reports/segments`
- `GET /revenue/reports/export` (csv/xlsx/pdf)

### 8.13 Settings
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

### 8.14 Dashboard Overview
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

- There is no authentication guard; navigation to dashboard routes is open.
- `Index.tsx` exists but is not routed from `App.tsx`.
- `App.css` keeps Vite template styles and appears unused by current pages.
- UTF-8/encoding artifacts are visible in multiple Spanish strings.
- Domain logic is UI-only right now; no persistence or backend contract enforcement implemented.
