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
