# PropSpace — Frontend

React client for PropSpace. Vite · React · React Router · Axios · Socket.io · Tailwind v4.

## Setup
```bash
npm install
cp .env.example .env     # point VITE_API_URL / VITE_SOCKET_URL at your backend
npm run dev              # http://localhost:5173
```
Run the backend (default http://localhost:5000) alongside it.

### Environment
| Key | Default | Purpose |
|-----|---------|---------|
| `VITE_API_URL` | http://localhost:5000/api | REST base URL |
| `VITE_SOCKET_URL` | http://localhost:5000 | Socket.io server |

## Where the required best practices live

**1. State Initialization — fetch exactly once on mount**
- `src/hooks/useFetch.js` runs its fetcher in a `useEffect` with a controlled dependency array (empty by default).
- Used by `PropertyDetail`, `MyListings`, and `PropertyForm` (edit mode). `Feed` uses the same pattern inline, re-running only when filters change.

**2. Memory Cleanups — teardown on unmount**
- `src/hooks/useSocket.js` registers Socket.io listeners and its effect returns a cleanup that `socket.off(...)`s every listener and `socket.disconnect()`s.
- Every fetch effect also flips an `active` flag in cleanup so a late response can't set state on an unmounted component.
- `StrictMode` is on, which double-invokes effects in dev to surface any missing cleanup.

**3. Global Interceptors — centralized auth + error handling**
- `src/api/client.js` is the single Axios instance.
- Request interceptor attaches `Authorization: Bearer <token>` to every call.
- Response interceptor catches 401s globally, clears the session, and redirects to login.

## Structure
```
src/
  api/         client.js (interceptors) + auth/properties/users calls
  context/     AuthContext (token + user persistence)
  hooks/       useFetch (BP#1/#2), useSocket (BP#2)
  components/  Navbar, ProtectedRoute, PropertyCard, FilterBar,
               Field (InputField/SelectField/TextAreaField), ui (Spinner/Error/Empty)
  pages/       Feed, PropertyDetail, Login, Register,
               MyListings, PropertyForm, AccountSettings
  utils/       validation.js (client-side rules run before the network)
```

## Evaluation criteria coverage
- **Component modularity** — UI is split into reusable pieces: `PropertyCard`, `FilterBar`, and form primitives `InputField`/`SelectField`/`TextAreaField` used by every form, plus `Spinner`/`ErrorNote`/`EmptyState`.
- **Async UX states** — `Feed`, `MyListings`, and `PropertyDetail` render explicit Loading, Empty, and Error UI rather than blank or broken layouts.
- **Form validation** — `utils/validation.js` validates each form and blocks submission (showing per-field errors) *before* any API call; forms use `noValidate` so our rules, not the browser's, govern.
- **Client routing & guards** — `ProtectedRoute` wraps dashboard routes and redirects guests to `/login`, preserving the intended path so login returns them there.


## Routes
| Path | Access | Screen |
|------|--------|--------|
| `/` | public | Browse + filters (live updates) |
| `/listings/:id` | public | Property detail |
| `/login`, `/register` | public | Auth |
| `/dashboard` | protected | My listings |
| `/listings/new`, `/listings/:id/edit` | protected | Create / edit |
| `/settings` | protected | Profile + password |
