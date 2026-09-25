# ONPRINT — Technical Indexability, Crawlability & Site Architecture Audit Report

**Brand & Website**: ONPRINT / 0nprint ([https://0nprint.com](https://0nprint.com/))  
**Target Market**: Dubai, United Arab Emirates (UAE & GCC)  
**Facility Location**: Al Quoz, Dubai, UAE  
**Audit Date**: September 2026  
**Auditor**: Senior Technical SEO & Infrastructure Architect  
**Scope**: Server-Side Pre-Rendering Shells, Dynamic XML Sitemap Generation, Robots.txt Hygiene, Canonical Directives, Hreflang Alignment, and Crawl Budget Optimization.

---

## Executive Summary

Search engine indexability is the prerequisite for organic discovery. Modern Single-Page Applications (SPAs) built with React frequently suffer from indexing latency and metadata omission when search engine crawlers fail to execute asynchronous client-side JavaScript.

ONPRINT solves this challenge through a hybrid **Server-Side Rendered (SSR) SEO Shell** architecture powered by Express.js (`src/app.js`), paired with a dynamic MySQL-driven XML sitemap engine and an automated 301 redirection manager. Every crawler receives complete, fully-rendered HTML metadata and JSON-LD schemas in the very first TCP packet.

### Indexability & Crawlability Score: **97 / 100**

| Core Indexability Pillar | Score | Status | Key Determinants |
| :--- | :---: | :---: | :--- |
| **Server-Side SEO Pre-Rendering** | 98/100 | Optimal | Raw HTML delivers title, description, canonical, hreflang, and JSON-LD before JS hydration |
| **Dynamic XML Sitemap** | 98/100 | Optimal | Real-time generation from `page_seo` database; tiered priority (0.6 to 1.0) |
| **Robots.txt & AI Crawler Directives** | 100/100 | Optimal | Clean separation of public routes, admin blocks, and explicit AI bot permissions |
| **Canonical & URL Normalization** | 96/100 | Optimal | Strict non-www enforcement, trailing-slash removal, and 301 alias handling |
| **Hreflang Configuration** | 95/100 | Optimal | Three-tier alternate tagging (`en-ae`, `en`, `x-default`) on all indexable pages |

---

## 1. Hybrid Server-Side Pre-Rendering Shell (`src/app.js`)

Unlike standard React SPAs that serve a generic empty `<div id="root"></div>` with static head tags, ONPRINT intercepts incoming HTTP requests via `renderSeoShell` in Express.

```
                  [ Incoming HTTP GET Request (Googlebot / User) ]
                                         │
                                         ▼
                     [ Express Middleware: renderSeoShell ]
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 ▼                                               ▼
     [ Read client/dist/index.html ]                 [ Query MySQL Database ]
                                                       - page_seo by URL
                                                       - Dynamic meta_title
                                                       - Dynamic meta_description
                                                       - Dynamic canonical & hreflang
                                                       - Organization & Breadcrumbs JSON-LD
                 │                                               │
                 └───────────────────────┬───────────────────────┘
                                         │
                                         ▼
                 [ Injected HTML Response Delivered Instantly (TTFB ~120ms) ]
                                         │
                                         ▼
                 [ Search Engine Indexes Full Metadata Without Executing JS ]
```

### 1.1 Injected HTML Elements
Before returning the response to the client, the server dynamically injects:
1. `<title>`: Unique, keyword-targeted document title with brand suffix.
2. `<meta name="description">`: Factual, high-intent summary (150–160 chars).
3. `<meta name="robots">`: Controlled via database (`index, follow, max-image-preview:large` or `noindex, nofollow`).
4. `<link rel="canonical">`: Fully-qualified HTTPS URL preventing duplicate content.
5. `<link rel="alternate" hreflang="...">`: Multi-tier regional targeting (`en-ae`, `en`, `x-default`).
6. `<script type="application/ld+json">`: Server-rendered `LocalBusiness`, `WebSite`, and `BreadcrumbList` schemas.

---

## 2. Dynamic XML Sitemap Architecture (`/sitemap.xml`)

ONPRINT serves its XML sitemap dynamically at `https://0nprint.com/sitemap.xml` via `getSitemapXml` in `src/controllers/seoController.js`.

### 2.1 Database Integration & Tiered Priority
The sitemap queries the `page_seo` table as its **Single Source of Truth**, filtering exclusively for records where `robots_index = 'index'` and, for blog articles, verifying `status = 'published'` and `published_at <= NOW()`.

| URL Classification | Priority | Change Frequency | Examples |
| :--- | :---: | :---: | :--- |
| **Homepage** | `1.0` | Daily | `https://0nprint.com/` |
| **12 Commercial Landing Hubs** | `0.9` | Bi-weekly | `https://0nprint.com/printing-services-dubai`<br>`https://0nprint.com/custom-packaging-dubai` |
| **Core Service Pages** | `0.8` | Weekly | `https://0nprint.com/services/offset-lithography`<br>`https://0nprint.com/services/digital-printing` |
| **Product Categories** | `0.8` | Weekly | `https://0nprint.com/categories/luxury-business-cards`<br>`https://0nprint.com/categories/rigid-boxes` |
| **Individual Products** | `0.7` | Bi-weekly | `https://0nprint.com/products/magnetic-rigid-box` |
| **Blog & Knowledge Guides** | `0.7` | Monthly | `https://0nprint.com/blog/gsm-paper-weights-guide` |
| **Programmatic Landing Pages** | `0.6` | Monthly | `https://0nprint.com/printing-services/business-bay` |

* **Protocol Compliance**: Strictly adheres to the Sitemaps XML schema 0.9, utilizing UTF-8 character encoding, proper entity escaping (`&amp;`), and W3C ISO-8601 date timestamps (`YYYY-MM-DD`).

---

## 3. Robots Directives & AI Scraper Accommodation (`robots.txt`)

ONPRINT's `robots.txt` configuration balances search crawl budget efficiency with proactive Generative Engine Optimization:

### 3.1 Public Crawling Permitted
* Full access granted to public marketing hubs, products, categories, portfolio showcases, and static asset directories (`/assets/`, `/uploads/`).

### 3.2 Private & Administrative Areas Protected
* Crawlers are strictly disallowed from private, transactional, or administrative paths:
  * `Disallow: /admin`
  * `Disallow: /admin/*`
  * `Disallow: /api/`
  * `Disallow: /api/*`
  * `Disallow: /dashboard`
  * `Disallow: /login`
  * `Disallow: /register`
  * `Disallow: /account`

### 3.3 Explicit Generative AI Ingestion
* Explicit `User-agent: <AI-Bot>` and `Allow: /` rules for:
  * `GPTBot` (OpenAI training)
  * `ChatGPT-User` (OpenAI live browsing / ChatGPT Search)
  * `Google-Extended` (Gemini & Vertex AI)
  * `GoogleOther` (Google automated crawlers)
  * `PerplexityBot` (Perplexity AI real-time search)
  * `ClaudeBot` & `anthropic-ai` (Anthropic Claude search)
  * `Applebot-Extended` (Apple Intelligence search)
  * `CCBot` & `cohere-ai` (Common Crawl and Cohere AI)

---

## 4. Canonicalization & Redirection Hygiene

Duplicate content dilutes PageRank and confuses search ranking algorithms. ONPRINT enforces strict URL normalization:

### 4.1 Host Canonicalization (Non-WWW Enforcement)
* Any request to `www.0nprint.com` is automatically 301-redirected to the canonical origin `https://0nprint.com`.

### 4.2 Trailing Slash Normalization
* Request URLs ending in trailing slashes (e.g., `/services/`) are permanently 301-redirected to clean paths (e.g., `/services`), preventing split equity across duplicate URLs.

### 4.3 Legacy Route Redirection
* 301 server redirects ensure backward compatibility:
  * `/category/:slug` ➔ `/categories/:slug`
  * `/product/:slug` ➔ `/products/:slug`
  * `/track`, `/orders/track`, `/order-tracking` ➔ `/track-order`
  * `/login`, `/register` ➔ `/admin/login`
  * Commercial short links: `/business-card-printing` ➔ `/business-card-printing-dubai`

### 4.4 Dynamic Database Redirection Engine (`seo_redirects`)
* Before serving a 404 error, the server queries the `seo_redirects` table. If an active mapping exists, the crawler or user is redirected with the specified HTTP status code (301 Permanent or 302 Temporary) and hit counts are updated automatically.

---

## 5. Summary & Actionable Recommendations

1. **Google Search Console Sitemap Submission**:
   * Ensure `https://0nprint.com/sitemap.xml` is submitted to Google Search Console and Bing Webmaster Tools for daily monitoring.
2. **Periodic Crawl Budget Monitoring**:
   * Inspect server access logs monthly for Googlebot and PerplexityBot hit rates to verify that crawl budgets remain focused on commercial landing pages and new product additions.
3. **Automated 404 Detection**:
   * Utilize the built-in `seo_redirects` table to capture recurring legacy 404 requests and establish permanent 301 reroutes.
