# PROJECT_CONTEXT (Derived Summary)

## Stack
- Vite + React 18 + TypeScript.
- React Router for SPA routing.
- Tailwind + custom `ventrix-*` utility classes.
- `@tanstack/react-query` configured globally (available for future data modules).

## Current Auth Architecture
- `src/lib/session.ts` centralizes authenticated user state for the entire app.
- `src/services/auth.service.ts` is the only place with auth request logic.
- Service supports two strategies:
  - API strategy with `fetch` + `credentials: "include"` against:
    - `POST /auth/register`
    - `POST /auth/login`
    - `POST /auth/logout`
    - `GET /auth/me`
  - Mock strategy in memory (default) to keep UI decoupled while backend is pending.
- No sensitive auth data is stored in `localStorage`.

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
