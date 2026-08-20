# Login Functionality

This app has a simple client-side login system supporting two roles: **admin** and **user**.

## Demo Accounts

| Role  | Email              | Password |
| ----- | ------------------ | -------- |
| Admin | admin@gmail.com    | 123456   |
| User  | ananya@gmail.com   | 123456   |

## How It Works

- [lib/auth-context.tsx](lib/auth-context.tsx) holds a hardcoded list of accounts (email, password, role) and exposes an `AuthProvider` + `useAuth()` hook, following the same client-side pattern already used by [lib/cart-context.tsx](lib/cart-context.tsx), [lib/orders-context.tsx](lib/orders-context.tsx), and [lib/wishlist-context.tsx](lib/wishlist-context.tsx) (a module-level store synced via `useSyncExternalStore`, persisted to `localStorage`).
- `useAuth()` returns:
  - `user` — `{ email, role } | null`
  - `login(email, password)` — validates credentials against the hardcoded accounts and returns `{ success, error? }`
  - `logout()` — clears the session
- The logged-in user is persisted in `localStorage` under the `auth-user` key, so the session survives page reloads.
- [app/login/page.tsx](app/login/page.tsx) renders the login form. On success it redirects to the homepage (`/`).
- [components/Header.tsx](components/Header.tsx) shows a **Log in** link when signed out, and the current user's email (with an **Admin** badge for admin accounts) plus a **Log out** button when signed in.

## Notes

- This is a client-only, demo-grade auth flow (no server sessions, cookies, or hashing) — it matches the rest of the app's local-storage-backed state and is intended for demonstrating role-based login UI, not for production use.
- To add more accounts or roles, edit the `ACCOUNTS` array in [lib/auth-context.tsx](lib/auth-context.tsx).
