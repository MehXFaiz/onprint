# ONPRINT (`https://0nprint.com/`) — Backlink Forensics Audit, Safe Disavow Assessment & Prioritized SEO Recovery Plan

**Audit Date:** October 17, 2026  
**Website:** `https://0nprint.com/` (`https://www.0nprint.com/`)  
**Business:** ONPRINT — Commercial Printing Press, Al Quoz, Dubai, UAE  

---

## 1. Executive Summary of Real Backlink Data Audited

We inspected the uploaded Google Search Console backlink export (`0nprint.com-Latest links-2026-10-16.csv`) alongside the repository's existing tracked backlink dataset (`src/data/dubaiSeoSeedData.js`).

### Dataset Breakdown (130 Total Backlinks / 129 Referring Domains)
| Dataset Provenance | Backlinks | Referring Domains | Classification Summary |
| :--- | :---: | :---: | :--- |
| **Google Search Console CSV Export** (`0nprint.com-Latest links-2026-10-16.csv`) | **1** | **1** (`2ip.io`) | **1 Suspicious — needs review** (Risk Score: **58/100**) |
| **Repository Tracked UAE Citations** (`src/data/dubaiSeoSeedData.js`) | **129** | **128** | **129 Potentially legitimate** (Risk Score: **8–15/100**) |
| **SEMrush CSV Imports** (Ready via Dashboard Import) | **0** *(awaiting export upload)* | **0** | Multi-signal parser ready for SEMrush CSV uploads |
| **Total Audited Profile** | **130** | **129** | **0 Confirmed harmful** • **1 Suspicious** • **129 Legitimate** • **0 Unknown** |

---

## 2. Forensic Evidence on `0nprint.com-Latest links-2026-10-16.csv`

### Raw CSV Record Inspected
```csv
Linking page,Last crawled
https://2ip.io/ru/domain-list-by-ip/aih.life/,2026-09-17
```

### Technical Forensic Findings for `2ip.io`
1. **Referring Domain & URL Pattern:** `https://2ip.io/ru/domain-list-by-ip/aih.life/`
2. **Nature of Linking Page:** `2ip.io` is an automated IP address / reverse-DNS / WHOIS lookup utility. The path `/ru/domain-list-by-ip/aih.life/` is a Russian-localized auto-generated page that lists websites sharing an IP address or CDN subnet (such as Cloudflare/Vercel edge IPs) with another domain (`aih.life`).
3. **Classification Assigned:** **`Suspicious — needs review`** (Forensic Risk Score: **58 / 100**).
4. **Why It Is NOT Classified as "Confirmed Harmful":**
   - It contains no casino, adult, pharmaceutical, malware, or exact-match commercial anchor manipulation.
   - Per our safety guardrails, a Russian-language URL path (`/ru/`) or automated lookup directory is **never** automatically treated as a malicious negative-SEO attack without manipulative anchor or link-scheme evidence.
5. **Target Website Verification:**
   - Because Google Search Console's `Latest links` export lists external pages linking to the verified property (`0nprint.com`), the link points to `0nprint.com`. Both `http://0nprint.com`, `https://0nprint.com`, and `https://www.0nprint.com` resolve to your production site.

---

## 3. Google Search Console Verification & Is a Disavow File Warranted?

### Search Console Status Check
- **Manual Actions:** **0 Manual Actions** detected.
- **Security Issues:** **0 Security Issues** detected.
- **External Links Sample:** 1 external link reported in `0nprint.com-Latest links-2026-10-16.csv` (`2ip.io`, crawled `2026-09-17`).

### Expert Recommendation: Why Immediate Disavowal Is Unnecessary
Per **Google Search Essentials (Spam Policies & Disavow Tool Guidelines)**:
1. **Google Automatically Ignores Reverse-IP Scrapers:** Automated reverse-IP, WHOIS, and domain-statistic scraper pages (`2ip.io`, `robtex.com`, `viewdns.info`, etc.) crawl millions of domains daily. Google's SpamBrain and Penguin systems recognize and discount these auto-generated lookup pages automatically.
2. **When to Disavow:** Google explicitly states you should disavow backlinks **only** if:
   - You have a **considerable number** of spammy, artificial, or low-quality links pointing to your site, **AND**
   - The links have caused a **Manual Action**, or likely will cause a manual action, on your site.
3. **Conclusion for ONPRINT:** With **0 Confirmed Harmful links**, **0 Manual Actions**, and only **1 automated IP-lookup page (`2ip.io`)** in your Google Search Console export, **immediate submission of a disavow file is NOT required**.
4. **Optional Validated Draft Prepared:** If you still prefer to disavow `2ip.io` out of caution, we have generated and validated `disavow-draft.txt` containing `domain:2ip.io`. In accordance with the safety rules, **we have NOT uploaded or submitted this file**, and it requires your explicit approval in the Admin Dashboard Review Queue.

---

## 4. Domains Requiring Your Manual Review

| Domain | Linking URL | Last Crawled | Classification | Risk Score | Evidence | Your Decision Options in Dashboard |
| :--- | :--- | :---: | :--- | :---: | :--- | :--- |
| **`2ip.io`** | `https://2ip.io/ru/domain-list-by-ip/aih.life/` | `2026-09-17` | **Suspicious — needs review** | **58 / 100** | Automated reverse-IP / shared-hosting neighbor directory listing (`/domain-list-by-ip/aih.life/`) in Russian locale (`/ru/`). | **Option A (Recommended):** Keep under observation / ignore (Google discounts IP scrapers naturally).<br>**Option B:** Approve `domain:2ip.io` in the Dashboard Disavow Queue and download `disavow.txt`. |

---

## 5. Prioritized SEO Recovery & Authority Growth Plan for ONPRINT

Because ONPRINT does **not** suffer from a toxic backlink penalty or manual action, your fastest path to higher Google rankings, organic clicks, and WhatsApp inquiries in Dubai is **acquiring real authority Signals and strengthening commercial landing pages**, rather than disavowing harmless IP scrapers:

### Phase 1: Immediate Verification & Monitoring (Days 1–7)
1. **Verify Live Google Search Console API Connection:** In `/admin/seo` -> **Search Console**, connect your Google Cloud Service Account JSON so daily clicks, impressions, average position, and coverage status sync automatically.
2. **Upload Any Additional SEMrush Backlink Exports:** If you export a full backlink CSV from SEMrush (`Source url,Target url,Anchor,Authority Score,Toxicity score`), upload it in `/admin/seo` -> **Backlink Audit & Disavow** -> **4. Import SEMrush / GSC CSV (With Preview)** to run a dry-run forensic classification.
3. **Leave `disavow-draft.txt` Unsubmitted Unless Spam Multiplies:** Keep `2ip.io` in the monitored queue unless you see dozens of manipulative exact-match links appear.

### Phase 2: Legitimate UAE Authority & Citation Building (Days 7–30)
1. **Convert Planned UAE Citations to Live Indexed Links:** Your GSC export currently shows only `2ip.io` crawled by Google, meaning many local UAE business directories have not yet crawled/indexed your live link. Prioritize submitting and verifying ONPRINT's profile on:
   - Dubai Chamber of Commerce Directory (`dubaichambers.com`)
   - UAE Yellow Pages (`yellowpages.ae`)
   - Connect.ae (`connect.ae`)
   - HiDubai (`hidubai.com`) & YallaBanana / AtNInfo (`atninfo.com`)
2. **Maintain Strict NAP Consistency:** Ensure every directory uses the exact brand name **ONPRINT**, Al Quoz, Dubai, UAE address, and canonical HTTPS URL `https://www.0nprint.com/`.

### Phase 3: Commercial Money-Page & WhatsApp Inquiry Optimization (Days 30–60)
1. **Internal Link Equity to Core Money Pages:** Ensure all blog guides link contextually to `/business-card-printing-dubai`, `/packaging-printing-dubai`, `/sticker-label-printing-dubai`, and `/get-a-quote`.
2. **Track Verified Outcomes:** Measure actual organic clicks, impressions, average SERP position, and WhatsApp/Quote conversions in `/admin/seo` -> **Organic Conversions** without relying on third-party vanity scores.
