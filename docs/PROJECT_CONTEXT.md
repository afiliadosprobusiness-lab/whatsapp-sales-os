# PROJECT_CONTEXT (Derived Summary)

## Stack
- Vite + React 18 + TypeScript.
- React Router for SPA routing.
- Tailwind + custom `ventrix-*` utility classes.
- `@tanstack/react-query` configured globally (already used in Settings workspace profile; available for additional data modules).

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

## Current Workspace Settings Architecture
- `src/services/workspace.service.ts` handles workspace requests with `fetch` + `credentials: "include"`.
- Settings business profile (`src/pages/Settings.tsx`) is connected to:
  - `GET /workspace/me` for loading current workspace data.
  - `PATCH /workspace/me` for persisting business profile changes.
- Settings now handles `loading | error | empty | success` states for workspace profile data.
- React Query key base is `workspaceQueryKeys.me()` to support reuse in future modules (Leads, etc.).

## Current Leads Architecture
- `src/services/leads.service.ts` handles lead requests with `fetch` + `credentials: "include"` and `{data,error}` envelope parsing.
- Leads screen (`src/pages/Leads.tsx`) is connected to:
  - `GET /leads` for list and pipeline.
  - `GET /leads/:id` for detail panel.
  - `POST /leads` for lead creation.
  - `PATCH /leads/:id` for lead editing.
  - `PATCH /leads/:id/status` for fast status changes.
- Leads query keys are centralized in `leadsQueryKeys` for list/detail cache invalidation.
- Leads UX now handles `idle | loading | success | error | empty` states end-to-end.

## Route Access Model
- Public routes:
  - `/`
- Guest-only routes:
  - `/login`
  - `/register`
- Private routes (guarded by auth session):
  - `/dashboard`
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

## UX Expectations in Auth
- Login/Register include loading, error and success states.
- Private shell exposes logout action and authenticated user info.
- If unauthenticated user accesses private route, redirect to `/login`.
- If authenticated user opens `/login` or `/register`, redirect to `/dashboard`.
