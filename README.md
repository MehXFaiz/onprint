# ONPRINT

ONPRINT is a full-stack MERN platform for a professional printing-services business: a public marketing site, a customer portal for quotes/orders, and an admin panel — built for production deployment on traditional GoDaddy/cPanel hosting (no serverless platforms).

## Status

Phase 1 (project scaffolding) is complete. The public site routes, customer routes, and admin routes are wired up as placeholders; the API skeleton exposes a health check. Features are being built phase-by-phase — see [Roadmap](#roadmap).

## Tech stack

- **Client:** React 19, Vite, React Router, Tailwind CSS, Axios
- **Server:** Node.js, Express, MongoDB, Mongoose
- **Auth:** JWT + bcrypt (added in Phase 4)

## Project structure

```
onprint/
├── client/     React + Vite frontend (src/{components,pages,layouts,services,hooks,context,assets})
├── server/     Express API (controllers,models,routes,middleware,services,utils)
├── .env.example
└── README.md
```

`client/` and `server/` are independent Node projects (their own `package.json`), so they can be deployed separately — required for GoDaddy/cPanel hosting where the frontend is served as static files and the backend (if supported by the hosting plan) runs as its own Node application.

## Local development

Requires Node.js 18+ and a MongoDB instance (local `mongod` or MongoDB Atlas).

```bash
npm run install:all
```

Copy the env templates and fill in real values:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Run both apps together:

```bash
npm run dev
```

- Client: http://localhost:5173
- API: http://localhost:5000/api (health check at `/api/health`)

Or run them independently with `npm run dev:client` / `npm run dev:server`.

## Environment variables

| File | Used by | Notes |
|---|---|---|
| `server/.env` | Express API | `MONGODB_URI`, `JWT_SECRET`, `PORT`, `CLIENT_URL`, `STORAGE_DRIVER`, etc. Never commit. |
| `client/.env` | Vite build | Only `VITE_`-prefixed vars are exposed to the browser bundle. |
| `.env.example` (root) | Reference only | Documents the full variable set; not read by any app. |

## Deployment (GoDaddy / cPanel)

Full step-by-step deployment instructions land in Phase 12, once the application is feature-complete. In short:

- **Frontend:** `npm run build --prefix client` produces `client/dist`, uploaded to `public_html` (or a subfolder) with an `.htaccess` rewrite so React Router routes fall back to `index.html`.
- **Backend:** deployed via cPanel's "Setup Node.js App" if the hosting plan supports it. If the plan is static-hosting only, the domain/DNS stays on GoDaddy while the Express + MongoDB backend runs on a separate Node-capable host, with `client/.env`'s `VITE_API_URL` pointed at it.
- **Database:** MongoDB Atlas is recommended for cPanel deployments, since shared hosting rarely provides a local MongoDB server.

No Vercel/Netlify/serverless-only APIs are used anywhere in this codebase.

## Roadmap

1. ✅ Project scaffolding
2. Frontend layout & responsive UI shell
3. MongoDB + Express backend foundation
4. Authentication (JWT, roles)
5. Products & categories
6. Services
7. Quote system
8. Order system
9. Admin dashboard
10. Portfolio & contact system
11. SEO & performance
12. GoDaddy/cPanel production deployment prep
