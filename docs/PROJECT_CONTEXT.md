# PROJECT_CONTEXT (Derived Summary)

## Stack
- Vite + React 18 + TypeScript.
- React Router for SPA routing.
- Tailwind + custom `ventrix-*` utility classes.
- Framer Motion for funnel transitions and animated step changes.
- `@tanstack/react-query` configured globally (already used in Settings workspace profile, WhatsApp channel, Leads, lead messaging, and global tasks).

## Current Public Marketing/Funnel Architecture
- Public home (`/`) now renders `src/pages/Landing.tsx`.
- Landing alias (`/landing`) also renders `src/pages/Landing.tsx`.
- Interactive qualification funnel now renders at `/quiz` via `src/pages/InteractiveFunnel.tsx`.
- Funnel content is centralized in `src/data/funnel-content.ts`.
- Funnel types and extensibility hooks live in `src/types/funnel.ts`.
- Reusable funnel UI blocks live in `src/components/funnel/*`.
- Funnel starts with a minimal hero slide optimized for conversion (small top logo/progress, centered mockup, short economic value headline, one CTA).
- Qualification flow now runs through 5 sequential filter questions focused on WhatsApp sales maturity and follow-up loss signals.
- Funnel runtime state:
  - `currentStepIndex`
  - `currentQuestionIndex`
  - `answers`
  - `qualificationScore` (derived)
  - `videoProgress`
  - `videoUnlocked`
- Lightweight persistence uses `sessionStorage` key `wsr-interactive-funnel-v1`.
- Video CTA unlock rule:
  - unlock when playback reaches configured percentage (`ctaRevealPercent`), or
  - unlock after configured fallback playback time (`fallbackRevealSeconds`).
- Checkout destination is configurable via `VITE_FUNNEL_CHECKOUT_URL` with fallback in funnel content file.
- Marketing landing content now emphasizes clear ROI language, numeric proof, and WhatsApp official API benefits.

## Current Auth Architecture
- `src/lib/session.ts` centralizes authenticated user state for the entire app.
- `src/services/auth.service.ts` is the only place with auth request logic.
- Service uses production API strategy only with `fetch` + `credentials: "include"` against:
  - `POST /auth/register`
  - `POST /auth/login`
  - `POST /auth/logout`
  - `GET /auth/me`
- API base URL is read from `VITE_API_URL` (fallback `VITE_API_BASE_URL`, then production URL default).
- Auth state machine in provider: `idle | loading | success | error | unauthorized`.
- No sensitive auth data is stored in `localStorage`.

## Current Superadmin Frontend Architecture
- Superadmin access is frontend-only and separate from backend auth session.
- Dedicated helpers in `src/lib/superadmin.ts` provide:
  - fixed superadmin credential validation from login.
  - local session storage handling (`wsr-superadmin-session-v1`).
  - superadmin identity lock rules.
- Dedicated route guard in `src/guards/RequireSuperAdmin.tsx` protects `/superadmin`.
- Superadmin panel in `src/pages/SuperAdmin.tsx` is scoped to user management only:
  - create users
  - one-click plan changes
  - delete users (except locked superadmin account)
- User operations are frontend state only (no API persistence).

## Current Workspace Settings Architecture
- `src/services/workspace.service.ts` handles workspace requests with `fetch` + `credentials: "include"`.
- Settings business profile (`src/pages/Settings.tsx`) is connected to:
  - `GET /workspace/me` for loading current workspace data.
  - `PATCH /workspace/me` for persisting business profile changes.
- Settings now handles `loading | error | empty | success` states for workspace profile data.
- React Query key base is `workspaceQueryKeys.me()` to support reuse in future modules (Leads, etc.).

## Current WhatsApp Channel Settings Architecture
- `src/services/whatsapp-channel.service.ts` handles channel requests with `fetch` + `credentials: "include"` and timeout/network-aware errors.
- Settings integrations section (`src/pages/Settings.tsx`) is connected to:
  - `GET /channels/whatsapp` for current channel status/provider visibility.
  - `POST /channels/whatsapp` for first-time channel setup.
  - `PATCH /channels/whatsapp/:id` for channel updates.
- WhatsApp channel query key is centralized in `whatsappChannelQueryKeys.current()` for cache reuse.
- Settings WhatsApp UX handles `loading | error | unavailable | empty | success`.
- Frontend does not talk to YCloud directly; provider details stay abstracted behind backend provider/adapters architecture.

## Current Leads Architecture
- `src/services/leads.service.ts` handles lead requests with `fetch` + `credentials: "include"` and `{data,error}` envelope parsing.
- `src/services/lead-activity.service.ts` handles lead activity requests with the same transport/error strategy.
- `src/services/lead-messages.service.ts` derives WhatsApp messages from activity and sends manual replies through backend endpoints.
- `src/services/lead-tasks.service.ts` handles lead follow-up tasks requests with the same transport/error strategy.
- Leads screen (`src/pages/Leads.tsx`) is connected to:
  - `GET /leads` for list and pipeline.
  - `GET /leads/:id` for detail panel.
  - `POST /leads` for lead creation.
  - `PATCH /leads/:id` for lead editing.
  - `PATCH /leads/:id/status` for fast status changes.
  - `GET /leads/:id/activity` for per-lead activity history.
  - `GET /leads/:id/activity` (same source) for WhatsApp message timeline rendering in lead detail.
  - `POST /leads/:id/messages` for manual WhatsApp reply from lead detail.
  - `POST /leads/:id/activity` for manual note/activity creation.
  - `GET /leads/:id/tasks` for per-lead follow-up reminders.
  - `POST /leads/:id/tasks` for follow-up task creation.
  - `PATCH /tasks/:id` for basic task editing.
  - `PATCH /tasks/:id/status` for done/pending/cancelled status updates.
- Leads query keys are centralized in `leadsQueryKeys` for list/detail cache invalidation.
- Lead activity query keys are centralized in `leadActivityQueryKeys` for per-lead refresh after create.
- Lead message query keys are centralized in `leadMessagesQueryKeys` for per-lead messaging refresh after send.
- Lead tasks query keys are centralized in `leadTasksQueryKeys` for per-lead task refresh after create/edit/status changes.
- Leads route now accepts optional `leadId` query param (`/leads?leadId=...`) to open related lead context from global task flows.
- Leads UX now handles `idle | loading | success | error | empty` states end-to-end, including graceful fallback when WhatsApp messaging endpoints are unavailable (`404/501/503/timeout`).
- Persisted CRM activity remains the visible source of truth for WhatsApp conversation timeline in lead detail.

## Current Global Tasks Inbox Architecture
- `src/services/tasks.service.ts` handles workspace-wide tasks requests with `fetch` + `credentials: "include"` and `{data,error}` envelope parsing.
- Global tasks inbox screen (`src/pages/TasksInbox.tsx`) is connected to:
  - `GET /tasks` for workspace queue listing.
  - `GET /tasks/summary` for optional counters (graceful fallback when endpoint is unavailable).
  - `PATCH /tasks/:id/status` for quick mark-done action when backend supports status endpoint.
- Tasks query keys are centralized in `tasksQueryKeys` for list/summary refresh after mutations.
- Global tasks UX now handles `loading | error | empty | success` with operational filters: `pending | today | overdue | done`.

## Route Access Model
- Public routes:
  - `/` (marketing landing, primary)
  - `/landing` (marketing landing alias)
  - `/quiz` (interactive funnel)
- Guest-only routes:
  - `/login`
  - `/register`
- Superadmin-only routes (guarded by frontend local session):
  - `/superadmin`
- Private routes (guarded by auth session):
  - `/dashboard`
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

## UX Expectations in Auth
- Login/Register include loading, error and success states.
- Private shell exposes logout action and authenticated user info.
- If unauthenticated user accesses private route, redirect to `/login`.
- If authenticated user opens `/login` or `/register`, redirect to `/dashboard`.
