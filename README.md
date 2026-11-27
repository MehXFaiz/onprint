# ONPRINT

ONPRINT is a frontend-only React application for ONPRINT's public printing-services website. Product, category, service, and blog content is bundled with the app. Quote, contact, and order-status requests are prepared as WhatsApp messages; visitors review and send those messages themselves.

## Stack

- React 19
- Vite
- React Router
- Tailwind CSS
- Framer Motion
- Lucide React

There is no application server, user authentication, database, or online order tracking. Artwork files selected in forms are not uploaded; visitors must attach them directly in WhatsApp if they choose.

## Local development

Requirements: Node.js 20.19+ (Node.js 22 recommended).

```sh
npm install
cp .env.example .env
npm run dev
```

Vite prints the local development URL after startup.

## Build and preview

```sh
npm run lint
npm run build
npm run preview
```

The production build is written to `dist/`.

## Configuration

Copy `.env.example` to `.env` and set public build-time values as needed:

- `VITE_SITE_URL` — canonical website URL.
- `VITE_WHATSAPP_NUMBER` — international WhatsApp number, digits only.
- `VITE_GA_MEASUREMENT_ID` — overrides the built-in Google Analytics measurement ID.
- `VITE_GOOGLE_SITE_VERIFICATION` — optional Google Search Console verification token.

Values prefixed with `VITE_` are exposed to the browser. Do not put credentials or secrets in this file.

## Deployment

Deploy the Vite build output (`dist/`) as a static site. The included Vercel configuration builds the application and serves client-side routes through `index.html`. The `public/` directory contains static site metadata and assets.

### Hostinger (Node.js hosting)

Hostinger's Node.js hosting runs an entry file, so `server.js` serves the built `dist/` directory and falls back to `index.html` for client-side routes. Configure the application in hPanel as follows:

- Node version: `22` (from `.nvmrc`; must be at least `20.19.0` to satisfy the `engines` field and the Vite/React toolchain)
- Install command: `npm install`
- Build command: `npm run build`
- Start command / entry file: `node server.js` (`server.js`, port from `PORT`)

Static hosting works too: upload the contents of `dist/` instead of running `server.js`.
