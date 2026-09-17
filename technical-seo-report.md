# ONPRINT — Technical SEO Audit & Architecture Report

**Brand & Domain**: ONPRINT ([https://0nprint.com](https://0nprint.com/))  
**Target Market**: Dubai, UAE & Middle East  
**Date**: September 2026  
**Audit Focus**: Crawlability, Server Headers, Indexing Infrastructure, Dynamic Sitemaps, Robots Directives, Canonical Architecture, AI Crawler Protocols (LLMs.txt), and Asset Delivery.

---

## 1. Server Configuration & Response Headers

ONPRINT operates an Express.js backend serving both the RESTful API and static production assets built with Vite.

### 1.1 HTTP Status Codes & Route Hygiene
* **Root & Public Routes**: Return clean `200 OK` responses.
* **Non-Existent Routes**: Catch-all routing returns a styled client-side 404 handler (`NotFoundPage.jsx`) while maintaining canonical integrity.
* **HTTPS Enforcement**: Strict 301 redirection from HTTP to HTTPS across all hostnames (`http://0nprint.com` -> `https://0nprint.com`).

### 1.2 Compression & Caching Directives
* **Compression**: Server applies Gzip compression across text-based resources (`text/html`, `application/javascript`, `text/css`, `application/json`, `application/xml`).
* **Cache-Control Headers**:
  * Static build assets (`/assets/*.js`, `/assets/*.css`): `Cache-Control: public, max-age=31536000, immutable` (fingerprinted by Vite).
  * HTML documents: `Cache-Control: no-cache, must-revalidate` to ensure immediate propagation of SEO updates.
  * API endpoints: `Cache-Control: private, no-cache` to ensure real-time pricing and stock data.

---

## 2. Dynamic Robots.txt & XML Sitemap Architecture

### 2.1 Robots.txt (`/robots.txt`)
The backend route `GET /robots.txt` is dynamically handled by `seoController.getRobotsTxt`. It dynamically configures bot access, separates search engines from AI scrapers, and points to the sitemap index:

```txt
User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/admin
Disallow: /checkout
Disallow: /cart
Disallow: /profile

# AI & LLM Crawler Directives
User-agent: GPTBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: https://0nprint.com/sitemap.xml
```

### 2.2 XML Sitemap Engine (`/sitemap.xml`)
The XML sitemap is dynamically generated via `seoController.getSitemapXml`, querying database tables (`services`, `products`, `categories`, `blogs`, `page_seo`) to ensure immediate inclusion of all published assets:
* **Core Static Pages**: `/`, `/about`, `/contact`, `/services`, `/products`, `/categories`, `/blogs`, `/get-a-quote`.
* **Category Hubs**: Dynamic inclusion with `priority: 0.8`, `changefreq: weekly`.
* **Service Detail Pages**: Dynamic inclusion with `priority: 0.9`, `changefreq: weekly`.
* **Product Pages**: Dynamic inclusion with `priority: 0.8`, `changefreq: weekly`.
* **Blog Articles**: Dynamic inclusion with `priority: 0.7`, `changefreq: monthly`.
* **XML Validation**: Uses standard `http://www.sitemaps.org/schemas/sitemap/0.9` namespace with ISO 8601 `<lastmod>` timestamps.

---

## 3. AI Search Protocol: LLMs.txt (`/llms.txt`)

To capitalize on modern Generative Engine Optimization (GEO) and AI answer engines (ChatGPT Search, Perplexity, Gemini, Claude), ONPRINT implements the `/llms.txt` standard via `seoController.getLlmsTxt`.

This machine-readable markdown file provides AI crawlers with clean, structured summaries of:
* Company Profile: ONPRINT commercial printing and packaging press in Dubai.
* Primary Capabilities: Luxury business cards, rigid packaging, corporate gifts, exhibition banners.
* Production Turnaround: 24–48 hours standard; same-day rush available.
* MOQ Guidelines: Starting from 25–50 units.
* Contact & NAP: Street 18, Al Quoz Industrial Area 3, Dubai, UAE (+971 55 183 7995).

---

## 4. Canonicalization Architecture & URL Hygiene

* **Self-Referencing Canonicals**: Implemented across all pages via `SEOHead.jsx`.
* **Protocol & Domain Normalization**: All canonical tags enforce `https://0nprint.com` without trailing slashes.
* **Faceted Navigation Handling**: Query strings on `/products?category=...&sort=...` maintain a canonical pointer back to the clean canonical URL `/products` or the designated category hub `/categories/:slug` to prevent duplicate content indexing.

---

## 5. Media & Asset Delivery Optimization

* **Image Formats**: Product and service visuals are served in WebP format with JPG fallback.
* **Responsive Sizing**: `img` tags feature explicit `aspect-ratio` or `width`/`height` constraints to prevent Cumulative Layout Shift (CLS).
* **Lazy Loading**: Non-critical imagery below the fold implements `loading="lazy"` and `decoding="async"`.
* **Font Loading**: Inter and custom display fonts are preloaded with `font-display: swap` to eliminate Flash of Invisible Text (FOIT).

---

## 6. Security Headers & Trust Signals

| Security Header | Value | SEO Impact |
| :--- | :--- | :--- |
| **X-Content-Type-Options** | `nosniff` | Prevents MIME-type sniffing |
| **X-Frame-Options** | `SAMEORIGIN` | Mitigates clickjacking attacks |
| **X-XSS-Protection** | `1; mode=block` | Cross-site scripting mitigation |
| **Referrer-Policy** | `strict-origin-when-cross-origin` | Preserves referral data while protecting user privacy |
| **Strict-Transport-Security** | `max-age=31536000; includeSubDomains` | Guarantees HTTPS enforcement across all endpoints |
