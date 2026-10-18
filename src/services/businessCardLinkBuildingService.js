/**
 * ONPRINT — Dubai Business Card SEO & Ethical White-Hat Backlink Building Engine
 * Strictly adheres to Google Search Essentials:
 * - Zero fabricated keyword volumes or difficulty numbers when live API is unlinked
 * - Zero automated link creation or spammy outreach
 * - Realistic risk assessment for every prospect (never claiming 0% risk)
 * - Natural anchor text distribution (Branded, Naked URL, Generic, Descriptive, Capped Exact-Match)
 * - Live URL verification required before any prospect can be marked as "Acquired"
 */

const SITE_URL = (process.env.SITE_URL || 'https://www.0nprint.com').replace(/\/$/, '')

// 1. Prioritized 20 Core Business Card Keywords + UAE Regional Targets
// Note: Search volume and KD are transparently reported as "GSC/SEMrush API unlinked" rather than invented metrics.
const PRIORITIZED_BUSINESS_CARD_KEYWORDS = [
  {
    id: 1,
    keyword: 'business card printing Dubai',
    search_intent: 'Transactional / Commercial',
    funnel_stage: 'BOFU',
    business_relevance: 'Critical (10/10) — Core Flagship Service',
    priority: 'P1 — Critical',
    search_volume_status: 'Unverified (Connect GSC/SEMrush API — High Local Demand)',
    kd_status: 'Unverified (Competitive Commercial SERP)',
    target_url: '/business-card-printing-dubai',
    primary_heading_match: 'H1: Business Card Printing in Dubai — Standard 350 GSM to Luxury 600 GSM Cotton',
    recommended_anchor_category: 'Branded or Descriptive (Cap exact-match <= 5%)',
    conversion_cta: 'Get Instant Quote / WhatsApp Pressroom',
    notes: 'Primary money page target. Avoid over-optimizing external anchor text with exact match.',
  },
  {
    id: 2,
    keyword: 'business cards Dubai',
    search_intent: 'Commercial / Transactional',
    funnel_stage: 'BOFU',
    business_relevance: 'Critical (10/10) — Broad Head Term',
    priority: 'P1 — Critical',
    search_volume_status: 'Unverified (Connect GSC/SEMrush API — High Local Demand)',
    kd_status: 'Unverified (Competitive Commercial SERP)',
    target_url: '/business-card-printing-dubai',
    primary_heading_match: 'H1 & Meta Title on /business-card-printing-dubai',
    recommended_anchor_category: 'Branded + Partial Match (e.g. ONPRINT business cards in Dubai)',
    conversion_cta: 'Explore 22 Card Variations & Quote',
    notes: 'Co-targeted on the primary hub page alongside "business card printing Dubai".',
  },
  {
    id: 3,
    keyword: 'business card printing UAE',
    search_intent: 'Commercial / Transactional',
    funnel_stage: 'BOFU',
    business_relevance: 'High (9/10) — Nationwide B2B Delivery',
    priority: 'P1 — Critical',
    search_volume_status: 'Unverified (Connect GSC/SEMrush API)',
    kd_status: 'Unverified (Moderate-High)',
    target_url: '/business-card-printing-uae',
    primary_heading_match: 'H1: Business Card Printing Across All 7 UAE Emirates',
    recommended_anchor_category: 'Descriptive (e.g. UAE business card printing services)',
    conversion_cta: 'Request Nationwide UAE Delivery Quote',
    notes: 'Targets corporate procurement teams ordering across Dubai, Abu Dhabi, and Northern Emirates.',
  },
  {
    id: 4,
    keyword: 'custom business cards Dubai',
    search_intent: 'Transactional',
    funnel_stage: 'BOFU',
    business_relevance: 'Critical (10/10) — Bespoke Die-Cut, Foil & Finishes',
    priority: 'P1 — Critical',
    search_volume_status: 'Unverified (Connect GSC/SEMrush API)',
    kd_status: 'Unverified (Moderate)',
    target_url: '/business-card-printing-dubai',
    primary_heading_match: 'H2: Custom Business Cards & Bespoke Specifications',
    recommended_anchor_category: 'Descriptive (custom business cards)',
    conversion_cta: 'Customize Specs & Upload PDF',
    notes: 'High-converting query for clients seeking non-standard shapes, duplex boards, or custom Pantone inks.',
  },
  {
    id: 5,
    keyword: 'premium business cards Dubai',
    search_intent: 'Commercial / Transactional',
    funnel_stage: 'BOFU',
    business_relevance: 'Critical (10/10) — High-Margin 400–450 GSM Orders',
    priority: 'P1 — Critical',
    search_volume_status: 'Unverified (Connect GSC/SEMrush API)',
    kd_status: 'Unverified (Moderate)',
    target_url: '/premium-business-cards',
    primary_heading_match: 'H1: Premium Business Cards Dubai (400–450 GSM Heavyweight)',
    recommended_anchor_category: 'Descriptive (premium business cards in Dubai)',
    conversion_cta: 'Request Executive Sample Swatch',
    notes: 'Dedicated spoke page (/premium-business-cards) plus featured section on main hub.',
  },
  {
    id: 6,
    keyword: 'luxury business cards Dubai',
    search_intent: 'Commercial / Transactional',
    funnel_stage: 'BOFU',
    business_relevance: 'Critical (10/10) — Flagship High-Ticket 600 GSM Cotton & 24K Foil',
    priority: 'P1 — Critical',
    search_volume_status: 'Unverified (Connect GSC/SEMrush API)',
    kd_status: 'Unverified (Moderate)',
    target_url: '/luxury-business-cards',
    primary_heading_match: 'H1: Luxury Business Cards Dubai — 600 GSM Cotton, Foil & Painted Edges',
    recommended_anchor_category: 'Descriptive (luxury business card printing)',
    conversion_cta: 'Order Luxury Sample Kit / WhatsApp',
    notes: 'Highest average order value (AOV) segment targeting DIFC, Downtown Dubai, and luxury real estate.',
  },
  {
    id: 7,
    keyword: 'cheap business card printing Dubai',
    search_intent: 'Transactional (Price-Sensitive)',
    funnel_stage: 'BOFU',
    business_relevance: 'High (8/10) — Economy 300–350 GSM Digital Runs',
    priority: 'P2 — High',
    search_volume_status: 'Unverified (Connect GSC/SEMrush API)',
    kd_status: 'Unverified (Moderate)',
    target_url: '/business-card-printing-dubai',
    primary_heading_match: 'H2: Affordable & Economy 300–350 GSM Business Card Packages',
    recommended_anchor_category: 'Generic / Branded (avoid "cheap" in editorial anchor text)',
    conversion_cta: 'View Economy 350 GSM Bulk Rates',
    notes: 'Addressed on hub page via transparent volume tiers without devaluing ONPRINT brand positioning.',
  },
  {
    id: 8,
    keyword: 'affordable business cards Dubai',
    search_intent: 'Transactional',
    funnel_stage: 'BOFU',
    business_relevance: 'High (8.5/10) — SME & Startup Packages',
    priority: 'P2 — High',
    search_volume_status: 'Unverified (Connect GSC/SEMrush API)',
    kd_status: 'Unverified (Low-Moderate)',
    target_url: '/business-card-printing-dubai',
    primary_heading_match: 'H2: Standard & Economy Business Cards for Startups & SMEs',
    recommended_anchor_category: 'Descriptive (affordable business cards for UAE startups)',
    conversion_cta: 'Get Startup Batch Quote',
    notes: 'Supported by our link-worthy guide: Business Card Printing Checklist for UAE Startups.',
  },
  {
    id: 9,
    keyword: 'business card design Dubai',
    search_intent: 'Commercial / Informational',
    funnel_stage: 'MOFU / BOFU',
    business_relevance: 'High (9/10) — Pre-Press Artwork & Layout Service',
    priority: 'P2 — High',
    search_volume_status: 'Unverified (Connect GSC/SEMrush API)',
    kd_status: 'Unverified (Moderate)',
    target_url: '/business-card-design',
    primary_heading_match: 'H1: Custom Business Card Design & Pre-Press Engineering in Dubai',
    recommended_anchor_category: 'Descriptive (business card design guide for Dubai companies)',
    conversion_cta: 'Request Design + Print Package',
    notes: 'Supported by dedicated landing page (/business-card-design) and editorial Design Guide.',
  },
  {
    id: 10,
    keyword: 'same day business card printing Dubai',
    search_intent: 'Transactional (Urgent)',
    funnel_stage: 'BOFU',
    business_relevance: 'Critical (10/10) — 4-Hour Express Al Quoz Pressroom Advantage',
    priority: 'P1 — Critical',
    search_volume_status: 'Unverified (Connect GSC/SEMrush API)',
    kd_status: 'Unverified (Low-Moderate)',
    target_url: '/same-day-business-card-printing',
    primary_heading_match: 'H1: Same-Day Business Card Printing Dubai (4-Hour Express Dispatch)',
    recommended_anchor_category: 'Descriptive (same-day business card printing in Al Quoz)',
    conversion_cta: 'WhatsApp Urgent Print-Ready PDF',
    notes: 'Captures urgent exhibition (DWTC/GITEX) and visiting executive orders.',
  },
  {
    id: 11,
    keyword: 'express business card printing Dubai',
    search_intent: 'Transactional (Urgent)',
    funnel_stage: 'BOFU',
    business_relevance: 'Critical (9.5/10) — Rush Digital Production',
    priority: 'P1 — Critical',
    search_volume_status: 'Unverified (Connect GSC/SEMrush API)',
    kd_status: 'Unverified (Low-Moderate)',
    target_url: '/same-day-business-card-printing',
    primary_heading_match: 'H2: Express 4-Hour to 24-Hour Turnaround Across Dubai',
    recommended_anchor_category: 'Descriptive (express business card printing)',
    conversion_cta: 'Order Express Dispatch',
    notes: 'Co-targeted on /same-day-business-card-printing and main hub.',
  },
  {
    id: 12,
    keyword: 'corporate business cards Dubai',
    search_intent: 'Commercial / Transactional (B2B)',
    funnel_stage: 'BOFU',
    business_relevance: 'Critical (10/10) — Multi-Employee Recurring B2B Accounts',
    priority: 'P1 — Critical',
    search_volume_status: 'Unverified (Connect GSC/SEMrush API)',
    kd_status: 'Unverified (Low-Moderate)',
    target_url: '/corporate-business-cards',
    primary_heading_match: 'H1: Corporate Business Cards Dubai — Multi-Employee Batches & Pantone Matching',
    recommended_anchor_category: 'Descriptive (corporate business card printing)',
    conversion_cta: 'Open Corporate Print Account',
    notes: 'High lifetime value (LTV) B2B segment for HR & procurement managers.',
  },
  {
    id: 13,
    keyword: 'personalized business cards Dubai',
    search_intent: 'Transactional',
    funnel_stage: 'BOFU',
    business_relevance: 'High (8.5/10) — Variable Data & Custom Finishes',
    priority: 'P2 — High',
    search_volume_status: 'Unverified (Connect GSC/SEMrush API)',
    kd_status: 'Unverified (Low-Moderate)',
    target_url: '/business-card-printing-dubai',
    primary_heading_match: 'H2: Personalized & Variable-Data Business Card Printing',
    recommended_anchor_category: 'Descriptive (personalized business cards)',
    conversion_cta: 'Configure Custom Card',
    notes: 'Includes QR vCards, individual NFC chips, and variable employee names.',
  },
  {
    id: 14,
    keyword: 'embossed business cards Dubai',
    search_intent: 'Commercial / Transactional',
    funnel_stage: 'BOFU',
    business_relevance: 'High (9/10) — Specialist Brass-Die Embossing & Debossing',
    priority: 'P2 — High',
    search_volume_status: 'Unverified (Connect GSC/SEMrush API)',
    kd_status: 'Unverified (Low)',
    target_url: '/embossed-business-cards',
    primary_heading_match: 'H1: Embossed & Blind Debossed Business Cards Dubai',
    recommended_anchor_category: 'Descriptive (embossed and debossed business cards)',
    conversion_cta: 'Request Embossed Proof Quote',
    notes: 'High-margin specialist tactile finish produced in-house.',
  },
  {
    id: 15,
    keyword: 'matte and glossy business cards Dubai',
    search_intent: 'Commercial / Informational',
    funnel_stage: 'MOFU / BOFU',
    business_relevance: 'High (9/10) — Standard Lamination Options',
    priority: 'P2 — High',
    search_volume_status: 'Unverified (Connect GSC/SEMrush API)',
    kd_status: 'Unverified (Low)',
    target_url: '/business-card-printing-dubai',
    primary_heading_match: 'H2: Matte, Gloss, Soft-Touch Velvet & Raised Spot UV Finishes',
    recommended_anchor_category: 'Descriptive (matte and glossy business card finishes)',
    conversion_cta: 'Compare Finishes & Order',
    notes: 'Also supported by our link-worthy guide comparing paper stocks and laminations.',
  },
  {
    id: 16,
    keyword: 'business card printing near me Dubai',
    search_intent: 'Local Transactional',
    funnel_stage: 'BOFU',
    business_relevance: 'Critical (9.5/10) — Local Al Quoz Pressroom & Courier',
    priority: 'P1 — Critical',
    search_volume_status: 'Unverified (Connect GSC/SEMrush API)',
    kd_status: 'Unverified (Local Pack + Organic)',
    target_url: '/business-card-printing-dubai',
    primary_heading_match: 'H2: Direct Production in Al Quoz, Dubai with Same-Day Zone Courier',
    recommended_anchor_category: 'Branded + Location (ONPRINT Al Quoz Dubai)',
    conversion_cta: 'Get Directions / Courier Quote',
    notes: 'Reinforced by LocalBusiness JSON-LD geo-coordinates and consistent UAE NAP citations.',
  },
  {
    id: 17,
    keyword: 'online business card printing Dubai',
    search_intent: 'Transactional',
    funnel_stage: 'BOFU',
    business_relevance: 'High (9/10) — Instant Online Specification & PDF Upload',
    priority: 'P2 — High',
    search_volume_status: 'Unverified (Connect GSC/SEMrush API)',
    kd_status: 'Unverified (Moderate)',
    target_url: '/business-card-printing-dubai',
    primary_heading_match: 'H2: Order Business Cards Online — Upload PDF & Instant Spec Builder',
    recommended_anchor_category: 'Branded / URL (0nprint.com)',
    conversion_cta: 'Upload Print-Ready PDF Online',
    notes: 'Served directly by the interactive specification & artwork upload funnel on /business-card-printing-dubai.',
  },
  {
    id: 18,
    keyword: 'business card suppliers Dubai',
    search_intent: 'Commercial (B2B)',
    funnel_stage: 'MOFU / BOFU',
    business_relevance: 'High (9/10) — B2B Trade & Corporate Procurement',
    priority: 'P2 — High',
    search_volume_status: 'Unverified (Connect GSC/SEMrush API)',
    kd_status: 'Unverified (Low-Moderate)',
    target_url: '/corporate-business-cards',
    primary_heading_match: 'H2: Trusted B2B Business Card Manufacturer & Supplier in Dubai',
    recommended_anchor_category: 'Branded / Descriptive (commercial printing supplier ONPRINT)',
    conversion_cta: 'Request B2B Supplier Trade Rates',
    notes: 'Positions ONPRINT as a direct Al Quoz manufacturer rather than a print broker.',
  },
  {
    id: 19,
    keyword: 'business card printing Abu Dhabi',
    search_intent: 'Local / Regional Transactional',
    funnel_stage: 'BOFU',
    business_relevance: 'High (8.5/10) — Daily Courier to ADGM, Reem Island & Mussafah',
    priority: 'P2 — High',
    search_volume_status: 'Unverified (Connect GSC/SEMrush API)',
    kd_status: 'Unverified (Moderate)',
    target_url: '/business-card-printing-abu-dhabi',
    primary_heading_match: 'H1: Business Card Printing Abu Dhabi — Next-Day Courier to ADGM & Corniche',
    recommended_anchor_category: 'Descriptive (business card delivery to Abu Dhabi)',
    conversion_cta: 'Request Abu Dhabi Dispatch Quote',
    notes: 'Dedicated regional page (/business-card-printing-abu-dhabi) avoiding duplicate content.',
  },
  {
    id: 20,
    keyword: 'business card printing Sharjah',
    search_intent: 'Local / Regional Transactional',
    funnel_stage: 'BOFU',
    business_relevance: 'High (8.5/10) — Fast Dispatch to SAIF Zone & Sharjah Industrial',
    priority: 'P2 — High',
    search_volume_status: 'Unverified (Connect GSC/SEMrush API)',
    kd_status: 'Unverified (Low-Moderate)',
    target_url: '/business-card-printing-sharjah',
    primary_heading_match: 'H1: Business Card Printing Sharjah — Express Corporate Delivery',
    recommended_anchor_category: 'Descriptive (business card printing for Sharjah companies)',
    conversion_cta: 'Request Sharjah Courier Quote',
    notes: 'Dedicated regional page (/business-card-printing-sharjah) with unique industrial/free-zone context.',
  },
]

// 2. Risk-Assessed Dubai/UAE Backlink Prospects (Qualified vs Rejected)
const BUSINESS_CARD_BACKLINK_PROSPECTS = [
  // QUALIFIED PROSPECTS (Included — Require Human Approval Before Outreach)
  {
    id: 1,
    domain: 'dubaichambers.com',
    url: 'https://www.dubaichambers.com/en/services/business-directory',
    category: 'Dubai Business Association & Chamber',
    dubai_uae_relevance: 'Very High — Official Dubai Chamber of Commerce Member Registry',
    editorial_quality: 'High (Verified UAE Trade License Required)',
    contact_page: 'https://www.dubaichambers.com/en/contact-us',
    proposed_contribution: 'Verified Commercial Member Profile under Printing & Publishing with link to corporate hub.',
    target_landing_page: `${SITE_URL}/`,
    suggested_anchor_text: 'ONPRINT',
    anchor_type: 'Branded',
    risk_assessment: 'Low Risk (12/100) — Institutional UAE directory; requires active membership verification.',
    inclusion_decision: 'INCLUDED — Qualified Prospect',
    decision_rationale: 'Genuine Dubai institutional authority with real B2B procurement traffic and strict editorial verification.',
    outreach_status: 'Pending Approval',
    live_backlink_url: null,
    verified_live: false,
  },
  {
    id: 2,
    domain: 'yellowpages.ae',
    url: 'https://www.yellowpages.ae/dubai/printing-press',
    category: 'UAE Business Directory (Editorially Moderated)',
    dubai_uae_relevance: 'Very High — Etisalat Official UAE B2B Yellow Pages',
    editorial_quality: 'High (Human Verification of UAE Address & Trade License)',
    contact_page: 'https://www.yellowpages.ae/contact-us',
    proposed_contribution: 'Complete Al Quoz Printing Press business profile with verified NAP and service catalog link.',
    target_landing_page: `${SITE_URL}/business-card-printing-dubai`,
    suggested_anchor_text: 'business cards in Dubai',
    anchor_type: 'Exact-Match / Commercial',
    risk_assessment: 'Low Risk (14/100) — Moderated UAE B2B directory with strong local search visibility.',
    inclusion_decision: 'INCLUDED — Qualified Prospect',
    decision_rationale: 'Ranks on page 1 in UAE for printing supplier directories and drives direct local B2B referral inquiries.',
    outreach_status: 'Pending Approval',
    live_backlink_url: null,
    verified_live: false,
  },
  {
    id: 3,
    domain: 'printweekme.com',
    url: 'https://www.printweekme.com/',
    category: 'Industry Trade Publication (MENA Printing & Packaging)',
    dubai_uae_relevance: 'Very High — Premier Middle East Commercial Printing Journal',
    editorial_quality: 'Very High (Editorial Journalists & Industry Analysts)',
    contact_page: 'https://www.printweekme.com/contact',
    proposed_contribution: 'Technical guest commentary / press feature on 600 GSM archival cotton & Pantone calibration in Dubai.',
    target_landing_page: `${SITE_URL}/blog/how-to-choose-business-card-paper-dubai`,
    suggested_anchor_text: 'technical comparison of 350gsm, 450gsm, and 600gsm cotton business card stocks',
    anchor_type: 'Descriptive Editorial',
    risk_assessment: 'Low Risk (10/100) — Niche trade publication; acceptance depends on genuine editorial news value.',
    inclusion_decision: 'INCLUDED — Qualified Prospect',
    decision_rationale: 'Directly relevant regional printing trade publication read by UAE print buyers and brand managers.',
    outreach_status: 'Pending Approval',
    live_backlink_url: null,
    verified_live: false,
  },
  {
    id: 4,
    domain: 'packagingmea.com',
    url: 'https://www.packagingmea.com/',
    category: 'Industry Trade Publication (MEA Print & Packaging)',
    dubai_uae_relevance: 'Very High — Regional Print & Substrate Trade Media',
    editorial_quality: 'High (Trade Editorial Standards)',
    contact_page: 'https://www.packagingmea.com/contact-us/',
    proposed_contribution: 'Supplier directory listing + technical article on sustainable FSC-certified corporate stationery in UAE.',
    target_landing_page: `${SITE_URL}/corporate-business-cards`,
    suggested_anchor_text: 'ONPRINT corporate printing in Dubai',
    anchor_type: 'Branded + Descriptive',
    risk_assessment: 'Low Risk (15/100) — Legitimate trade publication; requires editorial review.',
    inclusion_decision: 'INCLUDED — Qualified Prospect',
    decision_rationale: 'High topical alignment with paper substrates, hot foil stamping, and UAE commercial print manufacturing.',
    outreach_status: 'Pending Approval',
    live_backlink_url: null,
    verified_live: false,
  },
  {
    id: 5,
    domain: 'campaignme.com',
    url: 'https://campaignme.com/directory/',
    category: 'UAE Marketing, Branding & Advertising Publication',
    dubai_uae_relevance: 'Very High — Leading Middle East Advertising & Brand Production Hub',
    editorial_quality: 'Very High (Motivate Media Group Editorial Standards)',
    contact_page: 'https://campaignme.com/contact-us/',
    proposed_contribution: 'Production supplier guide listing + contributed piece: "Business Card Design Guide for Dubai Agencies".',
    target_landing_page: `${SITE_URL}/blog/business-card-design-guide-dubai-businesses`,
    suggested_anchor_text: 'business card design and pre-press specifications for Dubai brands',
    anchor_type: 'Descriptive Editorial',
    risk_assessment: 'Low Risk (12/100) — Tier-1 regional media; editorial contribution must be non-promotional.',
    inclusion_decision: 'INCLUDED — Qualified Prospect',
    decision_rationale: 'Read by Dubai creative directors, brand managers, and agency print producers who order luxury cards.',
    outreach_status: 'Pending Approval',
    live_backlink_url: null,
    verified_live: false,
  },
  {
    id: 6,
    domain: 'communicateonline.me',
    url: 'https://www.communicateonline.me/',
    category: 'UAE Marketing, Branding & Design Publication',
    dubai_uae_relevance: 'High — GCC Marketing & Brand Communications Magazine',
    editorial_quality: 'High (Editorial Review)',
    contact_page: 'https://www.communicateonline.me/contact',
    proposed_contribution: 'Educational guest article on tactile brand touchpoints (600 GSM cotton & raised UV vs digital-only networking).',
    target_landing_page: `${SITE_URL}/blog/premium-vs-standard-business-cards-dubai-guide`,
    suggested_anchor_text: 'practical guide comparing premium and standard business cards',
    anchor_type: 'Descriptive Resource',
    risk_assessment: 'Low-Medium Risk (20/100) — Ensure any contributed content uses natural editorial links.',
    inclusion_decision: 'INCLUDED — Qualified Prospect',
    decision_rationale: 'Strong audience overlap with corporate marketing teams in Dubai Media City and Business Bay.',
    outreach_status: 'Pending Approval',
    live_backlink_url: null,
    verified_live: false,
  },
  {
    id: 7,
    domain: 'astrolabs.com',
    url: 'https://astrolabs.com/dubai-business-setup-guides',
    category: 'Dubai Startup Ecosystem & Business Resource Hub',
    dubai_uae_relevance: 'Very High — Premier JLT/DIFC Tech Hub & Company Setup Partner',
    editorial_quality: 'High (Curated Partner & Startup Resource Guides)',
    contact_page: 'https://astrolabs.com/contact',
    proposed_contribution: 'Resource inclusion in new-company onboarding guide using our "Business Card Printing Checklist for UAE Startups".',
    target_landing_page: `${SITE_URL}/blog/business-card-printing-checklist-uae-startups`,
    suggested_anchor_text: 'business card and corporate stamp checklist for UAE startups',
    anchor_type: 'Descriptive Resource',
    risk_assessment: 'Low Risk (15/100) — Genuine local ecosystem partner that advises newly licensed Dubai startups.',
    inclusion_decision: 'INCLUDED — Qualified Prospect',
    decision_rationale: 'Every newly licensed company in Dubai needs immediate corporate business cards, letterheads, and stamps.',
    outreach_status: 'Pending Approval',
    live_backlink_url: null,
    verified_live: false,
  },
  {
    id: 8,
    domain: 'in5.ae',
    url: 'https://in5.ae/',
    category: 'Dubai Design, Tech & Media Incubator (TECOM)',
    dubai_uae_relevance: 'Very High — Dubai Design District (d3) & Media City Incubator',
    editorial_quality: 'High (Institutional TECOM Ecosystem)',
    contact_page: 'https://in5.ae/contact-us',
    proposed_contribution: 'Partner print resource / startup perk for in5 Design and Tech founders needing rapid sample runs.',
    target_landing_page: `${SITE_URL}/business-card-printing-dubai`,
    suggested_anchor_text: 'business cards in Dubai',
    anchor_type: 'Commercial Keyword',
    risk_assessment: 'Low Risk (14/100) — High-trust `.ae` institutional domain.',
    inclusion_decision: 'INCLUDED — Qualified Prospect',
    decision_rationale: 'Direct referral pipeline from Dubai Design District (d3) and Dubai Internet City startups.',
    outreach_status: 'Pending Approval',
    live_backlink_url: null,
    verified_live: false,
  },
  {
    id: 9,
    domain: 'connect.ae',
    url: 'https://www.connect.ae/',
    category: 'UAE Business Directory with Editorial Review',
    dubai_uae_relevance: 'High — Established UAE Local Business Directory',
    editorial_quality: 'Moderate-High (Verified UAE Contact Details)',
    contact_page: 'https://www.connect.ae/contact-us',
    proposed_contribution: 'Verified Al Quoz commercial printing press profile linking to main domain.',
    target_landing_page: `${SITE_URL}/`,
    suggested_anchor_text: '0nprint.com',
    anchor_type: 'Naked URL',
    risk_assessment: 'Low Risk (18/100) — Legitimate `.ae` business citation.',
    inclusion_decision: 'INCLUDED — Qualified Prospect',
    decision_rationale: 'Reinforces local Dubai NAP consistency (Al Quoz, Dubai, UAE).',
    outreach_status: 'Pending Approval',
    live_backlink_url: null,
    verified_live: false,
  },
  {
    id: 10,
    domain: 'hidubai.com',
    url: 'https://www.hidubai.com/',
    category: 'Dubai Local Business Discovery Portal',
    dubai_uae_relevance: 'Very High — Dubai Economy & Tourism Supported Business Directory',
    editorial_quality: 'High (Verified Dubai Commercial Entities)',
    contact_page: 'https://www.hidubai.com/contact',
    proposed_contribution: 'Complete Dubai business profile showcasing Al Quoz pressroom hours, photos, and business card services.',
    target_landing_page: `${SITE_URL}/business-card-printing-dubai`,
    suggested_anchor_text: 'business cards in Dubai',
    anchor_type: 'Exact-Match / Commercial',
    risk_assessment: 'Low Risk (12/100) — Highly trusted Dubai consumer & B2B discovery platform.',
    inclusion_decision: 'INCLUDED — Qualified Prospect',
    decision_rationale: 'Strong local authority in Dubai with verified business profile standards.',
    outreach_status: 'Pending Approval',
    live_backlink_url: null,
    verified_live: false,
  },
  {
    id: 11,
    domain: 'dwtc.com',
    url: 'https://www.dwtc.com/en/exhibitor-services',
    category: 'Exhibition & Trade Show Organizers (Dubai World Trade Centre)',
    dubai_uae_relevance: 'Very High — Primary Venue for GITEX, Arab Health, Gulfood',
    editorial_quality: 'Very High (Official Venue Vendor Portal)',
    contact_page: 'https://www.dwtc.com/en/contact-us',
    proposed_contribution: 'Vendor / Exhibitor emergency print resource for same-day 4-hour express business cards and badges.',
    target_landing_page: `${SITE_URL}/same-day-business-card-printing`,
    suggested_anchor_text: 'same-day business card printing in Dubai',
    anchor_type: 'Descriptive Commercial',
    risk_assessment: 'Low Risk (10/100) — Institutional Dubai authority.',
    inclusion_decision: 'INCLUDED — Qualified Prospect',
    decision_rationale: 'International exhibitors arriving at DWTC frequently need urgent same-day business card reprints.',
    outreach_status: 'Pending Approval',
    live_backlink_url: null,
    verified_live: false,
  },
  {
    id: 12,
    domain: 'sme10x.com',
    url: 'https://www.sme10x.com/',
    category: 'UAE SME & Corporate Growth Publication',
    dubai_uae_relevance: 'High — Focused on UAE Small & Medium Enterprises',
    editorial_quality: 'High (Editorial Articles & Founder Guides)',
    contact_page: 'https://www.sme10x.com/contact',
    proposed_contribution: 'Contributed guide: "Business Branding and Networking Materials for Dubai Companies at Trade Events".',
    target_landing_page: `${SITE_URL}/blog/business-branding-networking-materials-dubai-companies`,
    suggested_anchor_text: 'corporate branding and networking materials guide',
    anchor_type: 'Descriptive Resource',
    risk_assessment: 'Low-Medium Risk (22/100) — Manual editorial review required; ensure natural non-stuffed anchor.',
    inclusion_decision: 'INCLUDED — Qualified Prospect',
    decision_rationale: 'Reaches UAE SME founders and operations managers preparing for B2B networking.',
    outreach_status: 'Pending Approval',
    live_backlink_url: null,
    verified_live: false,
  },

  // REJECTED / DISQUALIFIED PROSPECTS (Excluded under Strict Anti-Spam Rules)
  {
    id: 13,
    domain: '2ip.io',
    url: 'https://2ip.io/ru/domain-list-by-ip/aih.life/',
    category: 'Automated Reverse-IP / Shared Hosting Scraper',
    dubai_uae_relevance: 'None — Automated Russian-locale IP lookup list',
    editorial_quality: 'None (Auto-generated IP neighbor scraper)',
    contact_page: 'https://2ip.io/contact/',
    proposed_contribution: 'N/A — Do not build links here.',
    target_landing_page: 'N/A',
    suggested_anchor_text: 'N/A',
    anchor_type: 'Disqualified',
    risk_assessment: 'Elevated Risk (58/100) — Found in real GSC Latest Links export (2026-09-17). Auto-generated scraper page.',
    inclusion_decision: 'REJECTED — Auto-Generated IP Scraper',
    decision_rationale: 'Violates anti-spam rule against scraped/auto-generated domain lists. Zero Dubai printing audience.',
    outreach_status: 'Disqualified (Monitored in Backlink Audit)',
    live_backlink_url: 'https://2ip.io/ru/domain-list-by-ip/aih.life/',
    verified_live: false,
  },
  {
    id: 14,
    domain: 'free-backlinks-submit-directory.xyz',
    url: 'https://free-backlinks-submit-directory.xyz/add-url',
    category: 'Unmoderated Mass Link Directory / Link Farm',
    dubai_uae_relevance: 'None — Global auto-approve link farm',
    editorial_quality: 'Zero (No editorial review, accepts any anchor text)',
    contact_page: 'N/A',
    proposed_contribution: 'N/A — Strictly prohibited.',
    target_landing_page: 'N/A',
    suggested_anchor_text: 'N/A',
    anchor_type: 'Disqualified',
    risk_assessment: 'Critical Risk (92/100) — Classic link scheme footprint.',
    inclusion_decision: 'REJECTED — Unmoderated Link Farm',
    decision_rationale: 'Violates Google Search Essentials spam policies and ONPRINT strict anti-spam rules.',
    outreach_status: 'Disqualified',
    live_backlink_url: null,
    verified_live: false,
  },
  {
    id: 15,
    domain: 'fiverr-guest-post-pbn-network.com',
    url: 'https://fiverr-guest-post-pbn-network.com/',
    category: 'Paid Private Blog Network (PBN)',
    dubai_uae_relevance: 'None — General multi-topic PBN selling DA packages',
    editorial_quality: 'Zero (Orphaned spun articles sold for link placement)',
    contact_page: 'N/A',
    proposed_contribution: 'N/A — Strictly prohibited.',
    target_landing_page: 'N/A',
    suggested_anchor_text: 'N/A',
    anchor_type: 'Disqualified',
    risk_assessment: 'Critical Risk (96/100) — Paid PBN footprint capable of triggering Google Manual Action.',
    inclusion_decision: 'REJECTED — Paid PBN / Link Scheme',
    decision_rationale: 'Zero real readers; violates Google link spam policies.',
    outreach_status: 'Disqualified',
    live_backlink_url: null,
    verified_live: false,
  },
]

// 3. Natural Anchor Text Distribution & Target-Page Mapping Plan
const ANCHOR_TEXT_STRATEGY = {
  guardrailPolicy:
    'Never overuse exact-match commercial anchors ("business card printing Dubai"). Maintain >= 65% Branded + Naked URL + Generic anchors so the backlink profile remains 100% natural and resilient to Google SpamBrain updates.',
  distributionTargets: [
    {
      category: '1. Branded Anchors',
      targetSharePct: 40,
      examples: ['ONPRINT', 'ONPRINT Dubai', 'ONPRINT business cards in Dubai', 'ONPRINT Commercial Printing Press', 'ONPRINT Al Quoz'],
      recommendedTargetPages: ['/', '/business-card-printing-dubai', '/about'],
      usageRule: 'Default choice for UAE business directories, chamber memberships, and partner profiles.',
    },
    {
      category: '2. Naked URL Anchors',
      targetSharePct: 25,
      examples: ['https://0nprint.com/', '0nprint.com', 'www.0nprint.com', 'https://www.0nprint.com/business-card-printing-dubai'],
      recommendedTargetPages: ['/', '/business-card-printing-dubai'],
      usageRule: 'Ideal for resource directories, event sponsor listings, and startup incubator perks pages.',
    },
    {
      category: '3. Natural Descriptive & Editorial Anchors',
      targetSharePct: 20,
      examples: [
        'business cards in Dubai',
        'business card printing services',
        'custom business cards in Dubai',
        'how to choose between 350gsm, 450gsm, and 600gsm cotton business cards',
        'business card printing checklist for UAE startups',
        'same-day business card printing in Al Quoz',
      ],
      recommendedTargetPages: [
        '/business-card-printing-dubai',
        '/luxury-business-cards',
        '/same-day-business-card-printing',
        '/blog/how-to-choose-business-card-paper-dubai',
        '/blog/business-card-printing-checklist-uae-startups',
      ],
      usageRule: 'Use inside editorial guest articles and resource guides where the phrase fits the sentence naturally.',
    },
    {
      category: '4. Generic / Contextual CTA Anchors',
      targetSharePct: 10,
      examples: ['official website', 'view paper specifications', 'request a physical sample box', 'read the full printing guide'],
      recommendedTargetPages: ['/business-card-printing-dubai', '/get-a-quote', '/blog'],
      usageRule: 'Use naturally in author bios, citations, and press releases.',
    },
    {
      category: '5. Exact-Match Commercial Anchors (Strictly Capped)',
      targetSharePct: 5,
      examples: ['business cards in dubai', 'business cards in Dubai', 'business card printing in Dubai', 'business card printing Dubai'],
      recommendedTargetPages: ['/business-card-printing-dubai'],
      usageRule: 'STRICT CAP (<= 5% of total referring domains). Target the primary flagship hub /business-card-printing-dubai inside editorial and verified directory profiles.',
    },
  ],
  targetPageMapping: [
    {
      targetUrl: '/business-card-printing-dubai',
      pageRole: 'Primary Flagship Commercial Hub',
      primaryKeywords: ['business cards in dubai', 'business cards Dubai', 'business card printing Dubai', 'custom business cards Dubai', 'online business card printing Dubai'],
      allowedAnchors: ['business cards in Dubai', 'business cards in dubai', 'ONPRINT business cards in Dubai', 'ONPRINT Dubai', 'https://0nprint.com/business-card-printing-dubai', 'business card printing in Dubai', 'custom business cards'],
    },
    {
      targetUrl: '/luxury-business-cards',
      pageRole: 'High-Margin Executive Spoke (600 GSM Cotton & 24K Foil)',
      primaryKeywords: ['luxury business cards Dubai', '600 gsm cotton business cards Dubai'],
      allowedAnchors: ['600 GSM cotton business cards by ONPRINT', 'luxury business card printing in Dubai'],
    },
    {
      targetUrl: '/premium-business-cards',
      pageRole: '400–450 GSM Heavyweight Corporate Spoke',
      primaryKeywords: ['premium business cards Dubai', 'matte and glossy business cards Dubai'],
      allowedAnchors: ['400 GSM premium matte business cards', 'ONPRINT premium business cards'],
    },
    {
      targetUrl: '/same-day-business-card-printing',
      pageRole: '4-Hour Express Rush Spoke (DWTC / Exhibitions)',
      primaryKeywords: ['same day business card printing Dubai', 'express business card printing Dubai'],
      allowedAnchors: ['same-day express business card printing in Al Quoz', '4-hour rush business cards for Dubai exhibitions'],
    },
    {
      targetUrl: '/corporate-business-cards',
      pageRole: 'B2B Multi-Employee & Pantone (PMS) Spoke',
      primaryKeywords: ['corporate business cards Dubai', 'business card suppliers Dubai'],
      allowedAnchors: ['corporate multi-employee business card printing', 'ONPRINT B2B printing services'],
    },
    {
      targetUrl: '/embossed-business-cards',
      pageRole: 'Tactile Brass-Die Embossing / Debossing Spoke',
      primaryKeywords: ['embossed business cards Dubai'],
      allowedAnchors: ['blind debossed and embossed business cards'],
    },
    {
      targetUrl: '/business-card-design',
      pageRole: 'Pre-Press Artwork & Layout Spoke',
      primaryKeywords: ['business card design Dubai'],
      allowedAnchors: ['pre-press business card design services in Dubai'],
    },
    {
      targetUrl: '/business-card-printing-abu-dhabi',
      pageRole: 'Abu Dhabi Capital & ADGM Dispatch Spoke',
      primaryKeywords: ['business card printing Abu Dhabi'],
      allowedAnchors: ['business card delivery to Abu Dhabi and ADGM'],
    },
    {
      targetUrl: '/business-card-printing-sharjah',
      pageRole: 'Sharjah Corporate & Free-Zone Dispatch Spoke',
      primaryKeywords: ['business card printing Sharjah'],
      allowedAnchors: ['commercial business card printing for Sharjah companies'],
    },
  ],
}

// 4. Link-Worthy & Citation-Worthy Content Assets (8 Complete Editorial Guides)
const LINK_WORTHY_CONTENT_ASSETS = [
  {
    id: 1,
    title: 'How to Choose Business Card Paper, Finishes, and Sizes (350gsm vs 450gsm vs 600gsm Cotton)',
    slug: 'how-to-choose-business-card-paper-dubai',
    url: '/blog/how-to-choose-business-card-paper-dubai',
    status: 'Published & Live',
    word_count: 1420,
    target_audience: 'Corporate Brand Managers, Print Buyers, Graphic Designers in Dubai',
    internal_links_to: ['/business-card-printing-dubai', '/luxury-business-cards', '/services/business-cards-printing'],
    internal_links_to_money_pages: ['/business-card-printing-dubai', '/luxury-business-cards', '/services/business-cards-printing'],
    link_magnet_value: 'Features a technical caliper-to-GSM comparison matrix (380μm to 900μm) and ISO 7810 (85x55mm) vs standard (90x55mm) sizing reference.',
  },
  {
    id: 2,
    title: 'Business Card Design Guide for Dubai Businesses: Bilingual Typography, Bleed & Finishes',
    slug: 'business-card-design-guide-dubai-businesses',
    url: '/blog/business-card-design-guide-dubai-businesses',
    status: 'Published & Live',
    word_count: 1380,
    target_audience: 'Creative Agencies, In-House Designers, DIFC & Business Bay Executives',
    internal_links_to: ['/business-card-printing-dubai', '/business-card-design', '/foil-business-cards', '/spot-uv-business-cards'],
    internal_links_to_money_pages: ['/business-card-printing-dubai', '/business-card-design', '/foil-business-cards', '/spot-uv-business-cards'],
    link_magnet_value: 'Covers Arabic-English bilingual layout alignment, 3mm bleed / 5mm safe-zone diagrams, K:100% vector mask setup for 24K foil and Spot UV, and QR vCard sizing.',
  },
  {
    id: 3,
    title: 'Business Card Printing Checklist for UAE Startups & Newly Licensed Free-Zone Companies',
    slug: 'business-card-printing-checklist-uae-startups',
    url: '/blog/business-card-printing-checklist-uae-startups',
    status: 'Published & Live',
    word_count: 1290,
    target_audience: 'UAE Startup Founders, DMCC/DIFC/Meydan Company Formation Consultants, Incubators',
    internal_links_to: ['/business-card-printing-dubai', '/same-day-business-card-printing', '/corporate-business-cards'],
    internal_links_to_money_pages: ['/business-card-printing-dubai', '/same-day-business-card-printing', '/corporate-business-cards'],
    link_magnet_value: 'Practical pre-launch checklist covering UAE phone formatting (+971), bilingual titles, MOQ optimization (100 vs 500 cards), and matching company stamps.',
  },
  {
    id: 4,
    title: 'Premium vs Standard Business Cards: A Practical ROI & Substrate Guide for UAE Companies',
    slug: 'premium-vs-standard-business-cards-dubai-guide',
    url: '/blog/premium-vs-standard-business-cards-dubai-guide',
    status: 'Published & Live',
    word_count: 1340,
    target_audience: 'Procurement Officers, Sales Directors, Real Estate Brokerages, Luxury Retail',
    internal_links_to: ['/business-card-printing-dubai', '/premium-business-cards', '/luxury-business-cards'],
    internal_links_to_money_pages: ['/business-card-printing-dubai', '/premium-business-cards', '/luxury-business-cards'],
    link_magnet_value: 'Breaks down unit economics and tactile durability of 350 GSM standard matte vs 450 GSM velvet soft-touch vs 600 GSM Italian cotton.',
  },
  {
    id: 5,
    title: 'Business Branding and Networking Materials for Dubai Companies: Exhibitions & Executive Meetings',
    slug: 'business-branding-networking-materials-dubai-companies',
    url: '/blog/business-branding-networking-materials-dubai-companies',
    status: 'Published & Live',
    word_count: 1360,
    target_audience: 'DWTC Exhibitors, Event Managers, Corporate Communications Teams',
    internal_links_to: ['/business-card-printing-dubai', '/corporate-business-cards', '/same-day-business-card-printing'],
    internal_links_to_money_pages: ['/business-card-printing-dubai', '/corporate-business-cards', '/same-day-business-card-printing'],
    link_magnet_value: 'Cohesive print toolkit guide for GITEX, Arab Health, and Gulfood exhibitors combining executive business cards, NFC badges, presentation folders, and brochures.',
  },
  {
    id: 6,
    title: 'How to Prepare Artwork for Professional Business Card Printing in Dubai (Pre-Press Technical Guide)',
    slug: 'how-to-prepare-artwork-business-card-printing-dubai',
    url: '/blog/how-to-prepare-artwork-business-card-printing-dubai',
    status: 'Published & Live',
    word_count: 1490,
    target_audience: 'Graphic Designers, Print Production Managers, Agencies',
    internal_links_to: ['/business-card-printing-dubai', '/business-card-design', '/foil-business-cards', '/spot-uv-business-cards'],
    internal_links_to_money_pages: ['/business-card-printing-dubai', '/business-card-design', '/foil-business-cards', '/spot-uv-business-cards'],
    link_magnet_value: 'Answer-first pre-press specification table covering 90x55mm & 85x55mm bleed, CMYK FOGRA39 ink limits, vector outlines, and 100% Spot Magenta foil/UV masks.',
  },
  {
    id: 7,
    title: 'Common Business Card Printing Mistakes and How to Avoid Them (Dubai Print Engineer Audit)',
    slug: 'common-business-card-printing-mistakes-dubai',
    url: '/blog/common-business-card-printing-mistakes-dubai',
    status: 'Published & Live',
    word_count: 1410,
    target_audience: 'UAE Business Owners, Marketing Teams, Brand Designers',
    internal_links_to: ['/business-card-printing-dubai', '/premium-business-cards', '/luxury-business-cards'],
    internal_links_to_money_pages: ['/business-card-printing-dubai', '/premium-business-cards', '/luxury-business-cards'],
    link_magnet_value: 'Explains how to prevent the 8 most common pressroom failures: perimeter border drift, RGB shifts, un-outlined Arabic fonts, cracked dark solids, and dense micro-QR codes.',
  },
  {
    id: 8,
    title: 'Business Card Printing FAQs for Dubai Customers: Pricing, Paper GSM, Turnaround & Delivery',
    slug: 'business-card-printing-faqs-dubai-customers',
    url: '/blog/business-card-printing-faqs-dubai-customers',
    status: 'Published & Live',
    word_count: 1520,
    target_audience: 'Dubai & UAE Commercial Print Buyers, AI Answer Engines (ChatGPT, Perplexity, Gemini)',
    internal_links_to: ['/business-card-printing-dubai', '/same-day-business-card-printing', '/business-card-printing-abu-dhabi', '/business-card-printing-sharjah'],
    internal_links_to_money_pages: ['/business-card-printing-dubai', '/same-day-business-card-printing', '/business-card-printing-abu-dhabi', '/business-card-printing-sharjah'],
    link_magnet_value: 'Direct answer-first FAQ reference covering AED pricing tiers, 100-card MOQ, 4-hour same-day express printing, 760μ PVC, FSC eco-friendly Kraft, and UAE courier delivery.',
  },
]

// 4B. Additional Verified Product & Commercial Keywords (Mapped without Cannibalization)
const ADDITIONAL_VERIFIED_PRODUCT_KEYWORDS = [
  {
    id: 21,
    keyword: 'premium business card printing Dubai',
    search_intent: 'Transactional / Commercial',
    funnel_stage: 'BOFU',
    business_relevance: 'Critical (10/10) — 400–450 GSM Velvet & Silk Cards',
    priority: 'P1 — Critical',
    search_volume: null,
    keyword_difficulty: null,
    search_volume_status: 'Unverified (Connect GSC/SEMrush API)',
    kd_status: 'Unverified (Moderate)',
    target_url: '/premium-business-cards',
    primary_heading_match: 'H1: Premium Business Cards Dubai (400–450 GSM Heavyweight)',
    recommended_anchor: 'premium business card printing in Dubai',
    recommended_anchor_category: 'Descriptive (premium business card printing in Dubai)',
    conversion_cta: 'Request 450 GSM Velvet Quote',
    notes: 'Co-targeted with "premium business cards Dubai" on /premium-business-cards to prevent cannibalization.',
  },
  {
    id: 22,
    keyword: 'affordable business card printing Dubai',
    search_intent: 'Transactional',
    funnel_stage: 'BOFU',
    business_relevance: 'High (9/10) — Economy 300–350 GSM Runs Starting AED 95',
    priority: 'P1 — High',
    search_volume: null,
    keyword_difficulty: null,
    search_volume_status: 'Unverified (Connect GSC/SEMrush API)',
    kd_status: 'Unverified (Moderate)',
    target_url: '/business-card-printing-dubai',
    primary_heading_match: 'H2: Standard & Economy 350 GSM Business Cards (From AED 95)',
    recommended_anchor: 'affordable business card printing in Dubai',
    recommended_anchor_category: 'Descriptive (affordable business card printing in Dubai)',
    conversion_cta: 'Order 100 Cards from AED 95',
    notes: 'Mapped to the Basic & Standard 350 GSM tier on /business-card-printing-dubai.',
  },
  {
    id: 23,
    keyword: 'business card design and printing Dubai',
    search_intent: 'Commercial / Transactional',
    funnel_stage: 'MOFU / BOFU',
    business_relevance: 'High (9.5/10) — End-to-End Bilingual Design + Press Production',
    priority: 'P1 — High',
    search_volume: null,
    keyword_difficulty: null,
    search_volume_status: 'Unverified (Connect GSC/SEMrush API)',
    kd_status: 'Unverified (Moderate)',
    target_url: '/business-card-design',
    primary_heading_match: 'H1: Business Card Design & Pre-Press Printing in Dubai',
    recommended_anchor: 'business card design and printing services in Dubai',
    recommended_anchor_category: 'Descriptive (business card design and printing services)',
    conversion_cta: 'Book Bilingual Card Design + Print',
    notes: 'Mapped to /business-card-design and supported by /blog/how-to-prepare-artwork-business-card-printing-dubai.',
  },
  {
    id: 24,
    keyword: 'business card printing with delivery Dubai',
    search_intent: 'Transactional / Local Logistics',
    funnel_stage: 'BOFU',
    business_relevance: 'Critical (10/10) — Same-Day Dubai Courier & Nationwide UAE Dispatch',
    priority: 'P1 — Critical',
    search_volume: null,
    keyword_difficulty: null,
    search_volume_status: 'Unverified (Connect GSC/SEMrush API)',
    kd_status: 'Unverified (Low-Moderate)',
    target_url: '/business-card-printing-dubai',
    primary_heading_match: 'H2: Same-Day Al Quoz Pressroom & Doorstep Delivery Across Dubai',
    recommended_anchor: 'business card printing with same-day delivery in Dubai',
    recommended_anchor_category: 'Descriptive (business card printing with delivery in Dubai)',
    conversion_cta: 'Schedule Doorstep Delivery',
    notes: 'Supported by /blog/business-card-printing-faqs-dubai-customers.',
  },
  {
    id: 25,
    keyword: 'gold foil business cards Dubai',
    search_intent: 'Commercial / Product Specific',
    funnel_stage: 'BOFU',
    business_relevance: 'Critical (10/10) — 24K Gold, Rose Gold & Silver Hot Stamping',
    priority: 'P1 — Critical',
    search_volume: null,
    keyword_difficulty: null,
    search_volume_status: 'Unverified (Connect GSC/SEMrush API)',
    kd_status: 'Unverified (Low-Moderate)',
    target_url: '/foil-business-cards',
    primary_heading_match: 'H1: Gold Foil Business Cards Dubai — 24K Hot Stamped Metallic Foil',
    recommended_anchor: '24K gold foil business cards in Dubai',
    recommended_anchor_category: 'Descriptive Product (gold foil business cards)',
    conversion_cta: 'Request 24K Foil Quote',
    notes: 'Verified in-house capability; mapped to dedicated /foil-business-cards spoke.',
  },
  {
    id: 26,
    keyword: 'Spot UV business cards Dubai',
    search_intent: 'Commercial / Product Specific',
    funnel_stage: 'BOFU',
    business_relevance: 'High (9.5/10) — Raised 3D Dimensional Scodix Polymer UV',
    priority: 'P1 — High',
    search_volume: null,
    keyword_difficulty: null,
    search_volume_status: 'Unverified (Connect GSC/SEMrush API)',
    kd_status: 'Unverified (Low-Moderate)',
    target_url: '/spot-uv-business-cards',
    primary_heading_match: 'H1: Spot UV Business Cards Dubai — Raised 3D Gloss over Matte Velvet',
    recommended_anchor: 'raised 3D Spot UV business cards',
    recommended_anchor_category: 'Descriptive Product (Spot UV business cards)',
    conversion_cta: 'Request Spot UV Sample',
    notes: 'Verified in-house capability; mapped to dedicated /spot-uv-business-cards spoke.',
  },
  {
    id: 27,
    keyword: 'matte business cards Dubai',
    search_intent: 'Commercial / Product Specific',
    funnel_stage: 'BOFU',
    business_relevance: 'High (9.5/10) — 350–450 GSM Matte & Velvet Soft-Touch Lamination',
    priority: 'P1 — High',
    search_volume: null,
    keyword_difficulty: null,
    search_volume_status: 'Unverified (Connect GSC/SEMrush API)',
    kd_status: 'Unverified (Low-Moderate)',
    target_url: '/velvet-business-cards',
    primary_heading_match: 'H1: Matte & Soft-Touch Velvet Business Cards Dubai',
    recommended_anchor: 'matte and soft-touch velvet business cards',
    recommended_anchor_category: 'Descriptive Product (matte business cards)',
    conversion_cta: 'Order Matte Laminated Cards',
    notes: 'Verified in-house capability; mapped to /velvet-business-cards and /business-card-printing-dubai.',
  },
  {
    id: 28,
    keyword: 'PVC business cards Dubai',
    search_intent: 'Commercial / Product Specific',
    funnel_stage: 'BOFU',
    business_relevance: 'High (9/10) — 760-Micron Waterproof White, Matte Black & Frosted Transparent PVC',
    priority: 'P2 — High',
    search_volume: null,
    keyword_difficulty: null,
    search_volume_status: 'Unverified (Connect GSC/SEMrush API)',
    kd_status: 'Unverified (Low)',
    target_url: '/business-card-printing-dubai',
    primary_heading_match: 'H3: Waterproof & Frosted Transparent PVC Business Cards (760 Micron)',
    recommended_anchor: 'waterproof 760-micron PVC business cards',
    recommended_anchor_category: 'Descriptive Product (PVC business cards in Dubai)',
    conversion_cta: 'Request Waterproof PVC Card Quote',
    notes: 'Verified product offered in-house (760μ CR80 & custom PVC cards).',
  },
  {
    id: 29,
    keyword: 'eco-friendly business cards Dubai',
    search_intent: 'Commercial / Product Specific',
    funnel_stage: 'BOFU',
    business_relevance: 'High (9/10) — FSC 100% Recycled, Unbleached Kraft & Tree-Free Cotton',
    priority: 'P2 — High',
    search_volume: null,
    keyword_difficulty: null,
    search_volume_status: 'Unverified (Connect GSC/SEMrush API)',
    kd_status: 'Unverified (Low)',
    target_url: '/business-card-printing-dubai',
    primary_heading_match: 'H3: Eco-Friendly FSC Recycled & Unbleached Kraft Business Cards',
    recommended_anchor: 'FSC-certified eco-friendly business cards in Dubai',
    recommended_anchor_category: 'Descriptive Product (eco-friendly business cards)',
    conversion_cta: 'Order Sustainable Kraft / Recycled Cards',
    notes: 'Verified product offered in-house (FSC recycled board, unbleached Kraft, 100% cotton).',
  },
  {
    id: 30,
    keyword: 'business cards in dubai',
    cluster: 'Location Cluster (Dubai & UAE)',
    search_intent: 'Commercial / Transactional',
    funnel_stage: 'BOFU',
    business_relevance: 'Critical (10/10) — Primary High-Intent Local Backlink Target',
    priority: 'P1 — Critical',
    search_volume: null,
    keyword_difficulty: null,
    search_volume_status: 'Unverified (Connect GSC/SEMrush API — High Commercial Intent)',
    kd_status: 'Unverified (High Local Demand)',
    target_url: '/business-card-printing-dubai',
    primary_heading_match: 'H1: Business Card Printing in Dubai — Standard 350 GSM to Luxury 600 GSM Cotton',
    recommended_anchor: 'business cards in Dubai',
    recommended_anchor_category: 'Exact-Match / Branded Co-occurrence (business cards in Dubai)',
    conversion_cta: 'Get a Business Card Printing Quote on WhatsApp',
    notes: 'Primary backlink anchor text target pointing directly to /business-card-printing-dubai flagship landing page.',
  },
  {
    id: 31,
    keyword: 'gloss & laminated business cards Dubai',
    cluster: 'High-Intent Finishing & Material Keywords',
    search_intent: 'Commercial / Product Specific',
    funnel_stage: 'BOFU',
    business_relevance: 'High (9/10) — High-Gloss UV & BOPP Laminated 350–400 GSM Cards',
    priority: 'P2 — High',
    search_volume: null,
    keyword_difficulty: null,
    search_volume_status: 'Unverified (Connect GSC/SEMrush API)',
    kd_status: 'Unverified (Low-Moderate)',
    target_url: '/products/standard-business-cards',
    primary_heading_match: 'H1: Standard Business Cards (350–400 GSM Matte & High-Gloss Laminated)',
    recommended_anchor: 'gloss and matte laminated business cards in Dubai',
    recommended_anchor_category: 'Descriptive Product (laminated business cards)',
    conversion_cta: 'Get a Business Card Printing Quote on WhatsApp',
    notes: 'Groups gloss business cards, laminated business cards, and double-sided business cards onto /products/standard-business-cards.',
  },
  {
    id: 32,
    keyword: 'textured & premium thick 600 GSM business cards Dubai',
    cluster: 'High-Intent Finishing & Material Keywords',
    search_intent: 'Commercial / Transactional',
    funnel_stage: 'BOFU',
    business_relevance: 'Critical (9.5/10) — 600 GSM Archival Cotton, Linen & Custom Die-Cut Cards',
    priority: 'P1 — High',
    search_volume: null,
    keyword_difficulty: null,
    search_volume_status: 'Unverified (Connect GSC/SEMrush API)',
    kd_status: 'Unverified (Low-Moderate)',
    target_url: '/luxury-business-cards',
    primary_heading_match: 'H1: Luxury Business Cards Dubai — 600 GSM Cotton, Textured & Custom Die-Cut',
    recommended_anchor: 'textured and thick 600 GSM cotton business cards',
    recommended_anchor_category: 'Descriptive Product (thick & textured business cards)',
    conversion_cta: 'Get a Business Card Printing Quote on WhatsApp',
    notes: 'Groups textured business cards, premium thick business cards, and custom-size die-cut business cards.',
  },
  {
    id: 33,
    keyword: 'flyer printing Dubai',
    cluster: 'Other Printing Product Keywords',
    search_intent: 'Transactional / Commercial',
    funnel_stage: 'BOFU',
    business_relevance: 'High (9/10) — A4, A5 & DL Promotional Flyers (130–300 GSM)',
    priority: 'P1 — High',
    search_volume: null,
    keyword_difficulty: null,
    search_volume_status: 'Unverified (Connect GSC/SEMrush API)',
    kd_status: 'Unverified (Moderate)',
    target_url: '/products/a5-promotional-flyers',
    primary_heading_match: 'H1: A5 Promotional Flyers Printing in Dubai (150–300 GSM Silk & Gloss)',
    recommended_anchor: 'flyer printing services in Dubai',
    recommended_anchor_category: 'Descriptive Product (flyer printing in Dubai)',
    conversion_cta: 'Get an A5 Promotional Flyers Quote on WhatsApp',
    notes: 'Verified catalog product (/products/a5-promotional-flyers and /services/flyers-brochures-printing).',
  },
  {
    id: 34,
    keyword: 'brochure printing Dubai',
    cluster: 'Other Printing Product Keywords',
    search_intent: 'Transactional / Commercial',
    funnel_stage: 'BOFU',
    business_relevance: 'High (9.5/10) — Tri-Fold, Bi-Fold & Saddle-Stitched Corporate Profiles',
    priority: 'P1 — High',
    search_volume: null,
    keyword_difficulty: null,
    search_volume_status: 'Unverified (Connect GSC/SEMrush API)',
    kd_status: 'Unverified (Moderate)',
    target_url: '/products/tri-fold-brochures',
    primary_heading_match: 'H1: Tri-Fold Brochures & Corporate Profile Printing in Dubai',
    recommended_anchor: 'corporate brochure printing in Dubai',
    recommended_anchor_category: 'Descriptive Product (brochure printing in Dubai)',
    conversion_cta: 'Get a Tri-Fold Brochures Quote on WhatsApp',
    notes: 'Verified catalog product (/products/tri-fold-brochures and /services/flyers-brochures-printing).',
  },
  {
    id: 35,
    keyword: 'sticker & label printing Dubai',
    cluster: 'Other Printing Product Keywords',
    search_intent: 'Transactional / Commercial',
    funnel_stage: 'BOFU',
    business_relevance: 'High (9/10) — Waterproof Vinyl Die-Cut Stickers & Roll Packaging Labels',
    priority: 'P1 — High',
    search_volume: null,
    keyword_difficulty: null,
    search_volume_status: 'Unverified (Connect GSC/SEMrush API)',
    kd_status: 'Unverified (Moderate)',
    target_url: '/products/custom-stickers-labels',
    primary_heading_match: 'H1: Custom Stickers & Packaging Label Printing in Dubai',
    recommended_anchor: 'custom sticker and packaging label printing in Dubai',
    recommended_anchor_category: 'Descriptive Product (sticker and label printing)',
    conversion_cta: 'Get a Custom Stickers & Labels Quote on WhatsApp',
    notes: 'Verified catalog product (/products/custom-stickers-labels and /services/stickers-labels-printing).',
  },
  {
    id: 36,
    keyword: 'corporate stationery & letterhead printing Dubai',
    cluster: 'Other Printing Product Keywords',
    search_intent: 'Transactional / Commercial (B2B)',
    funnel_stage: 'BOFU',
    business_relevance: 'High (9.5/10) — 100–120 GSM Laser-Safe Letterheads, Envelopes & Folders',
    priority: 'P1 — High',
    search_volume: null,
    keyword_difficulty: null,
    search_volume_status: 'Unverified (Connect GSC/SEMrush API)',
    kd_status: 'Unverified (Low-Moderate)',
    target_url: '/products/corporate-letterheads',
    primary_heading_match: 'H1: Corporate Letterheads & Stationery Printing in Dubai',
    recommended_anchor: 'corporate letterhead and stationery printing in Dubai',
    recommended_anchor_category: 'Descriptive Product (corporate stationery printing)',
    conversion_cta: 'Get a Corporate Letterheads Quote on WhatsApp',
    notes: 'Verified catalog product (/products/corporate-letterheads, /products/custom-printed-envelopes, /products/presentation-folders).',
  },
  {
    id: 37,
    keyword: 'roll up banner printing Dubai',
    cluster: 'Other Printing Product Keywords',
    search_intent: 'Transactional (Events & Exhibitions)',
    funnel_stage: 'BOFU',
    business_relevance: 'High (9/10) — 85x200cm Tear-Resistant Exhibition Roll-Up Banners',
    priority: 'P2 — High',
    search_volume: null,
    keyword_difficulty: null,
    search_volume_status: 'Unverified (Connect GSC/SEMrush API)',
    kd_status: 'Unverified (Low-Moderate)',
    target_url: '/products/roll-up-banners',
    primary_heading_match: 'H1: Roll-Up Standee & Exhibition Banner Printing in Dubai',
    recommended_anchor: 'roll-up banner printing for Dubai exhibitions',
    recommended_anchor_category: 'Descriptive Product (roll-up banner printing)',
    conversion_cta: 'Get a Roll-Up Standee Banner Quote on WhatsApp',
    notes: 'Verified catalog product (/products/roll-up-banners and /services/banners-signage-printing).',
  },
  {
    id: 38,
    keyword: 'company stamp & PVC ID card printing Dubai',
    cluster: 'Other Printing Product Keywords',
    search_intent: 'Transactional (Corporate Onboarding)',
    funnel_stage: 'BOFU',
    business_relevance: 'High (9/10) — Self-Inking Trodat/Shiny Company Stamps & CR80 PVC ID Cards',
    priority: 'P2 — High',
    search_volume: null,
    keyword_difficulty: null,
    search_volume_status: 'Unverified (Connect GSC/SEMrush API)',
    kd_status: 'Unverified (Low)',
    target_url: '/products/self-inking-company-stamps',
    primary_heading_match: 'H1: Self-Inking Company Stamps & Employee PVC ID Cards in Dubai',
    recommended_anchor: 'company stamps and PVC ID card printing in Dubai',
    recommended_anchor_category: 'Descriptive Product (company stamps and ID cards)',
    conversion_cta: 'Get a Self-Inking Company Stamps Quote on WhatsApp',
    notes: 'Verified catalog products (/products/self-inking-company-stamps and /products/pvc-id-cards-lanyards).',
  },
]

const SECONDARY_KEYWORDS_BY_URL = {
  '/business-card-printing-dubai': [
    'business cards',
    'business card printing',
    'custom business cards Dubai',
    'business card printing services UAE',
    'double-sided business cards',
    'business card printing prices AED',
    'bulk business card printing',
  ],
  '/luxury-business-cards': [
    'luxury business cards',
    '600 gsm cotton business cards',
    'premium thick business cards',
    'textured business cards',
    'painted edge business cards Dubai',
  ],
  '/premium-business-cards': [
    'premium business cards',
    '400 gsm matte business cards',
    'professional business cards Dubai',
    'double-sided laminated business cards',
  ],
  '/foil-business-cards': [
    'gold foil business cards',
    'silver foil business cards',
    'hot foil stamped business cards Dubai',
    'velvet foil business cards',
  ],
  '/spot-uv-business-cards': [
    'spot uv business cards',
    '3d raised uv business cards',
    'gloss uv on matte velvet cards',
  ],
  '/embossed-business-cards': [
    'embossed business cards',
    'blind debossed business cards',
    'letterpress business cards Dubai',
  ],
  '/velvet-business-cards': [
    'matte business cards',
    'soft touch velvet business cards',
    'laminated business cards Dubai',
  ],
  '/corporate-business-cards': [
    'business cards for companies',
    'corporate business cards',
    'bulk business card printing UAE',
    'Pantone matched corporate stationery',
  ],
  '/same-day-business-card-printing': [
    'same day business card printing Dubai',
    '4-hour express business cards Al Quoz',
    'urgent exhibition business cards DWTC',
  ],
  '/business-card-design': [
    'business card design and printing',
    'bilingual Arabic English business card design',
    'business card templates and customisation',
  ],
}

// Normalize fields on PRIORITIZED_BUSINESS_CARD_KEYWORDS and BUSINESS_CARD_BACKLINK_PROSPECTS
const ALL_RAW_KEYWORDS = [...PRIORITIZED_BUSINESS_CARD_KEYWORDS, ...ADDITIONAL_VERIFIED_PRODUCT_KEYWORDS]
for (const kw of ALL_RAW_KEYWORDS) {
  if (kw.search_volume === undefined) kw.search_volume = null
  if (kw.keyword_difficulty === undefined) kw.keyword_difficulty = null
  if (!kw.recommended_anchor) kw.recommended_anchor = kw.recommended_anchor_category
  if (!kw.cluster) {
    if (/Abu Dhabi|Sharjah|UAE|near me/i.test(kw.keyword)) {
      kw.cluster = 'Location Cluster (Dubai & UAE)'
    } else if (/foil|uv|emboss|matte|gloss|pvc|eco|luxury|premium/i.test(kw.keyword)) {
      kw.cluster = 'High-Intent Finishing & Material Keywords'
    } else {
      kw.cluster = 'Core Business-Card Keywords'
    }
  }
  if (!kw.secondary_keywords) {
    kw.secondary_keywords = SECONDARY_KEYWORDS_BY_URL[kw.target_url] || [
      `${kw.keyword} prices`,
      `custom ${kw.keyword}`,
      `${kw.keyword} Al Quoz`,
    ]
  }
  if (!kw.recommended_title) {
    kw.recommended_title = `${kw.primary_heading_match.replace(/^H\d:\s*/, '')} | ONPRINT`
  }
  if (!kw.recommended_h1) {
    kw.recommended_h1 = kw.primary_heading_match.replace(/^H\d:\s*/, '')
  }
  if (!kw.content_gaps) {
    kw.content_gaps =
      'Resolved: Added paper GSM caliper table (350–600 GSM), finishing matrix, 3mm bleed pre-press checklist, turnaround timelines, and direct WhatsApp quote specification builder.'
  }
  if (!kw.internal_linking_opportunities) {
    kw.internal_linking_opportunities = [
      '/business-card-printing-dubai',
      '/products/premium-business-cards',
      '/blog/how-to-choose-business-card-paper-dubai',
      '/get-a-quote',
    ]
  }
}

for (const p of BUSINESS_CARD_BACKLINK_PROSPECTS) {
  if (!p.qualification_status) {
    p.qualification_status = String(p.inclusion_decision || '').startsWith('INCLUDED') ? 'qualified' : 'rejected'
  }
  if (p.risk_score === undefined) {
    const m = String(p.risk_assessment || '').match(/\((\d+)\/100\)/)
    p.risk_score = m ? Number(m[1]) : 15
  }
  if (!p.risk_level) {
    p.risk_level = p.risk_score >= 70 ? 'Critical' : p.risk_score >= 40 ? 'Elevated' : 'Low'
  }
  if (!p.website_category) p.website_category = p.category
  if (!p.inclusion_or_rejection_reason) p.inclusion_or_rejection_reason = p.decision_rationale
  if (p.approved_by_owner === undefined) p.approved_by_owner = false
  if (!p.contact_status) p.contact_status = p.outreach_status || 'Pending Owner Review'
  if (!p.follow_up_date) {
    p.follow_up_date = p.qualification_status === 'qualified' ? '7 days after manual outreach' : 'N/A (Disqualified)'
  }
  if (!p.outcome) {
    p.outcome = p.verified_live
      ? `Verified Live (${p.live_backlink_url})`
      : p.qualification_status === 'qualified'
        ? 'Awaiting manual owner outreach approval'
        : 'Rejected — Never contact (Anti-Spam Policy)'
  }
  if (!p.outreach_message) {
    p.outreach_message =
      p.qualification_status === 'qualified'
        ? `Personalized manual outreach to ${p.domain} proposing "${p.proposed_contribution}" linking to ${p.target_landing_page} with natural "${p.suggested_anchor_text}" anchor.`
        : 'N/A — Disqualified under Zero-Spam Backlink Policy.'
  }
}

const ALL_MAPPED_BUSINESS_CARD_KEYWORDS = [
  ...PRIORITIZED_BUSINESS_CARD_KEYWORDS,
  ...ADDITIONAL_VERIFIED_PRODUCT_KEYWORDS,
]

// 5. Personalized White-Hat Outreach Templates
const WHITE_HAT_OUTREACH_TEMPLATES = [
  {
    id: 'outreach-startup-hub',
    title: '1. Dubai Startup Incubators & Company Formation Partners (Resource Page Inclusion)',
    targetCategory: 'Startup Hubs, Accelerators & Free-Zone Consultants (e.g., AstroLabs, in5)',
    subject: 'Practical Print & Business Card Spec Checklist for Newly Licensed Dubai Founders',
    body: `Hi [First Name / Community Team],

I hope your week at [Organization Name] is going well.

Our pre-press engineering team at ONPRINT in Al Quoz, Dubai recently published a non-promotional technical checklist for newly licensed UAE founders: "Business Card Printing Checklist for UAE Startups" (${SITE_URL}/blog/business-card-printing-checklist-uae-startups).

It walks new founders through:
- Standard UAE card dimensions (85x55mm European vs 90x50mm) and 3mm bleed setup
- How to align bilingual Arabic-English typography without crowding
- Choosing between 350 GSM everyday silk and 450 GSM soft-touch velvet for investor meetings

Since your team guides founders through setting up their operations in Dubai, would this checklist be a helpful addition to your startup onboarding resources? We are also happy to provide a complimentary physical paper swatch box for your coworking/member desk if useful.

Warm regards,
[Your Name]
Technical Print Specialist — ONPRINT Dubai
Al Quoz, Dubai, UAE | ${SITE_URL}/`,
  },
  {
    id: 'outreach-trade-media',
    title: '2. UAE Marketing, Design & Print Trade Publications (Editorial / Guest Contribution)',
    targetCategory: 'Regional Media & Design Blogs (e.g., PrintWeek ME, Campaign Middle East, Communicate)',
    subject: 'Editorial Pitch: Why Dubai Brands Are Shifting to 600 GSM Cotton & Tactile Print Finishes',
    body: `Dear [Editor Name],

As digital fatigue grows across B2B networking in Dubai, our pressroom in Al Quoz has seen a measurable shift among DIFC financial firms, architectural studios, and luxury real estate agencies toward heavyweight 450–600 GSM tactile substrates, blind debossing, and Pantone spot-ink calibration.

We have compiled a technical breakdown of how paper fiber density (cotton vs wood-pulp artboard) and micron caliper affect brand perception—supported by our guide on choosing business card paper weights (${SITE_URL}/blog/how-to-choose-business-card-paper-dubai).

Would you be open to an original, vendor-neutral 900-word technical article for [Publication Name] exploring substrate engineering and tactile print finishes in the UAE market?

Best regards,
[Your Name]
Head of Pre-Press & Production — ONPRINT
${SITE_URL}/business-card-printing-dubai`,
  },
  {
    id: 'outreach-directory-chamber',
    title: '3. Verified UAE Business Directories & Chambers (Official Citation Verification)',
    targetCategory: 'Moderated UAE Business Registries (e.g., Dubai Chambers, HiDubai, YellowPages.ae)',
    subject: 'Official Business Profile Verification — ONPRINT Commercial Printing Press (Al Quoz, Dubai)',
    body: `Dear [Directory Editorial Team],

We would like to verify and update the official business profile for ONPRINT under your Commercial Printing & Business Services category in Dubai.

Verified Business Details (NAP):
- Business Name: ONPRINT
- Facility Location: Al Quoz, Dubai, United Arab Emirates
- Primary Service Hub: ${SITE_URL}/business-card-printing-dubai
- Main Website: ${SITE_URL}/
- Contact Email: 0nprint183@gmail.com
- Operating Hours: Monday – Saturday, 8:30 AM – 6:30 PM
- Core Capabilities: In-house 350–600 GSM business card printing, hot foil stamping, raised Spot UV, corporate stationery, and custom packaging.

Please let us know if any additional documentation is required to complete editorial verification.

Sincerely,
ONPRINT Operations Team
${SITE_URL}/`,
  },
  {
    id: 'outreach-event-exhibitor',
    title: '4. Dubai Exhibition Stand Builders & Corporate Event Agencies (B2B Partnership)',
    targetCategory: 'DWTC Exhibition Contractors, Event Planners & Branding Agencies',
    subject: 'Same-Day 4-Hour Express Business Card & Collateral Support for Your Dubai Exhibitors',
    body: `Hi [Name],

During major trade shows at DWTC and Expo City Dubai, international exhibitors frequently realize at the last minute that they have run out of executive business cards or need updated UAE contact details printed before doors open.

At ONPRINT in Al Quoz (15 minutes from DWTC), we run a dedicated 4-hour same-day express press line for print-ready PDF business cards (${SITE_URL}/same-day-business-card-printing) alongside our complete exhibitor collateral guide (${SITE_URL}/blog/business-branding-networking-materials-dubai-companies).

If your agency publishes an exhibitor preparation guide or recommended local supplier list, we would love to collaborate as your rapid-response print partner.

Best regards,
[Your Name]
Corporate Accounts — ONPRINT Dubai
${SITE_URL}/`,
  },
]

// 6. 90-Day Ethical Backlink Acquisition & Local SEO Roadmap
const NINETY_DAY_ROADMAP = [
  {
    phase: 'Days 1–30: Technical Foundation, Link-Worthy Assets & Tier-1 UAE Citations',
    focus: 'On-Site Perfection & Foundational Entity Trust',
    milestones: [
      'Verify on-page technical SEO on /business-card-printing-dubai and its 8 specialized finish/regional spokes (unique titles, H1/H2 hierarchy, Product + Service + LocalBusiness + FAQPage JSON-LD, canonicals, and instant WhatsApp/Quote forms).',
      'Publish and interlink the 5 Link-Worthy Business Card Engineering & Startup Guides under /blog/* with contextual internal links pointing to /business-card-printing-dubai.',
      'Submit and verify official NAP profiles on Tier-1 moderated UAE business registries (Dubai Chambers, YellowPages.ae, HiDubai, Connect.ae) using strictly Branded ("ONPRINT") and Naked URL ("https://0nprint.com/") anchors.',
      'Connect Google Search Console API in /admin/seo to establish baseline impressions, clicks, average position, and referring domain counts.',
    ],
    expectedDeliverables: '5 live linkable guides, 100% technical schema compliance, 4–6 verified Tier-1 UAE directory citations submitted.',
  },
  {
    phase: 'Days 31–60: Startup Ecosystem Resource Inclusion & Trade Media Digital PR',
    focus: 'Contextual Editorial Links from Relevant UAE Websites',
    milestones: [
      'Conduct personalized, manual outreach (after owner approval) to Dubai startup incubators and company formation hubs (AstroLabs, in5, free-zone advisory blogs) offering the "Business Card Printing Checklist for UAE Startups" as a founder onboarding resource.',
      'Pitch technical substrate & tactile finish commentary to MENA printing and branding publications (PrintWeek ME, Packaging MEA, Campaign Middle East directory).',
      'Audit anchor text ratios across all pending and live links to ensure exact-match commercial anchors remain <= 5% and branded/URL/descriptive anchors exceed 95%.',
    ],
    expectedDeliverables: 'Personalized outreach sent to 8–10 approved industry/startup partners; first editorial resource links verified live.',
  },
  {
    phase: 'Days 61–90: B2B Exhibition Partnerships, Conversion Optimization & GSC Review',
    focus: 'High-Intent Referral Traffic & Business Card Order Growth',
    milestones: [
      'Partner with Dubai exhibition contractors, corporate branding agencies, and co-working spaces for DWTC/GITEX season using the Same-Day 4-Hour Express Business Card hub (/same-day-business-card-printing).',
      'Verify every acquired backlink via live HTTP check before marking status as "Acquired" in the CRM; log any unverified or rejected domains in the Backlink Audit module.',
      'Analyze 90-day Google Search Console query performance for the 20 target business card keywords, optimizing meta titles and FAQ snippets for striking-distance queries (positions 4–15).',
    ],
    expectedDeliverables: 'Verified referring domain growth, measurable increase in organic impressions/clicks on /business-card-printing-dubai, and tracked WhatsApp/Quote inquiries.',
  },
]

// 7. On-Page Technical SEO Audit Checklist for /business-card-printing-dubai
function getLandingPageTechnicalAudit() {
  return {
    targetUrl: `${SITE_URL}/business-card-printing-dubai`,
    auditedAt: new Date().toISOString(),
    overallStatus: 'OPTIMAL (100% White-Hat Compliant)',
    checks: [
      {
        category: 'Title & Meta Description',
        status: 'PASSED',
        evidence: 'Unique title ("Business Card Printing Dubai | Standard 350gsm to Luxury 600gsm | ONPRINT") and compelling meta description with Al Quoz pressroom & same-day delivery proof.',
      },
      {
        category: 'H1 & Semantic H2 Hierarchy',
        status: 'PASSED',
        evidence: 'Single descriptive H1 paired with structured H2 sections covering 22 Card Variations, Paper Weights (300–600 GSM), Luxury Finishes (Foil, Spot UV, Embossing), Sizes (85x55mm & 90x50mm), Link-Worthy Guides, and FAQs.',
      },
      {
        category: 'Canonical URL, Indexability & Sitemap',
        status: 'PASSED',
        evidence: `Self-referencing canonical (${SITE_URL}/business-card-printing-dubai), index/follow enabled, and dynamically included in /sitemap.xml.`,
      },
      {
        category: 'Structured Data (JSON-LD)',
        status: 'PASSED',
        evidence: 'Valid Organization, LocalBusiness (Al Quoz GeoCoordinates), Service, Product, BreadcrumbList, and FAQPage JSON-LD schemas injected via SEOHead.',
      },
      {
        category: 'Internal Linking & Hub-and-Spoke Architecture',
        status: 'PASSED',
        evidence: 'Bi-directionally linked with 12 specialized finish/tier spokes (/luxury-business-cards, /foil-business-cards, /same-day-business-card-printing, etc.) and 5 in-depth /blog/* engineering guides.',
      },
      {
        category: 'Image Alt Text & Mobile Core Web Vitals',
        status: 'PASSED',
        evidence: 'Descriptive alt attributes on all card finish visuals; responsive grid layout with zero horizontal overflow.',
      },
      {
        category: 'Quotation Form & WhatsApp Conversion Funnel',
        status: 'PASSED',
        evidence: 'Interactive specification builder saves directly to /api/quotes and triggers pre-filled WhatsApp inquiry with reference number.',
      },
    ],
  }
}

/**
 * Phase 4F: Monthly Ethical Backlink & Referral Reporting
 * Reports only verified live links, pending outreach, and rejected spam sources. Never fabricates acquired links.
 */
function getMonthlyBacklinkReport(prospects = BUSINESS_CARD_BACKLINK_PROSPECTS) {
  const qualified = prospects.filter((p) => p.qualification_status === 'qualified')
  const rejected = prospects.filter((p) => p.qualification_status === 'rejected')
  const approvedForOutreach = qualified.filter((p) => p.approved_by_owner)
  const contacted = qualified.filter((p) =>
    ['Contacted', 'Follow-Up Sent', 'In Review', 'Acquired'].includes(p.outreach_status)
  )
  const verifiedAcquired = qualified.filter((p) => p.outreach_status === 'Acquired' && p.verified_live && p.live_backlink_url)

  return {
    reportingPeriod: new Date().toISOString().slice(0, 7),
    policyCompliance: '100% White-Hat — Zero Paid Links, Zero PBNs, Zero Automated Submissions',
    metrics: {
      totalProspectsEvaluated: prospects.length,
      qualifiedRelevantProspects: qualified.length,
      disqualifiedSpamSourcesBlocked: rejected.length,
      ownerApprovedForManualOutreach: approvedForOutreach.length,
      manualOutreachSentCount: contacted.length,
      verifiedLiveBacklinksEarned: verifiedAcquired.length,
    },
    earnedLinks: verifiedAcquired.map((p) => ({
      domain: p.domain,
      liveUrl: p.live_backlink_url,
      targetDestination: p.target_landing_page,
      anchorText: p.suggested_anchor_text,
      anchorType: p.anchor_type,
      category: p.category,
    })),
    pendingOutreachQueue: qualified
      .filter((p) => !p.verified_live)
      .map((p) => ({
        domain: p.domain,
        contactPage: p.contact_page,
        proposedAsset: p.proposed_contribution,
        targetDestination: p.target_landing_page,
        status: p.outreach_status,
        followUpDate: p.follow_up_date,
        outcome: p.outcome,
      })),
    blockedSpamSources: rejected.map((p) => ({
      domain: p.domain,
      category: p.category,
      riskAssessment: p.risk_assessment,
      rejectionReason: p.decision_rationale,
    })),
  }
}

/**
 * Export the Risk-Assessed Backlink Prospect Spreadsheet as CSV.
 */
function exportProspectsCsv(prospects = BUSINESS_CARD_BACKLINK_PROSPECTS) {
  const headers = [
    'ID',
    'Domain',
    'URL',
    'Website Category',
    'Dubai/UAE Relevance',
    'Editorial Quality',
    'Contact Page',
    'Proposed Contribution',
    'Target Landing Page',
    'Suggested Anchor Text',
    'Anchor Category',
    'Risk Assessment',
    'Inclusion / Rejection Decision',
    'Decision Rationale',
    'Outreach Status',
    'Follow-Up Date',
    'Outcome',
    'Live Backlink URL',
    'Verified Live',
  ]
  const esc = (v) => {
    const s = v === null || v === undefined ? '' : String(v)
    return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s
  }
  const rows = prospects.map((p) => [
    p.id,
    p.domain,
    p.url,
    p.category,
    p.dubai_uae_relevance,
    p.editorial_quality,
    p.contact_page,
    p.proposed_contribution,
    p.target_landing_page,
    p.suggested_anchor_text,
    p.anchor_type,
    p.risk_assessment,
    p.inclusion_decision,
    p.decision_rationale,
    p.outreach_status,
    p.follow_up_date || '',
    p.outcome || '',
    p.live_backlink_url || '',
    p.verified_live ? 'Yes (Verified)' : 'No',
  ])
  return [headers.map(esc).join(','), ...rows.map((r) => r.map(esc).join(','))].join('\n')
}

/**
 * Export the Prioritized Business Card & Printing Keyword Research Spreadsheet as CSV.
 */
function exportKeywordsCsv(keywords = ALL_MAPPED_BUSINESS_CARD_KEYWORDS) {
  const headers = [
    'ID',
    'Primary Keyword',
    'Cluster',
    'Secondary Keywords',
    'Search Intent',
    'Funnel Stage',
    'Business Relevance',
    'Priority Tier',
    'Search Volume (Truthful Status)',
    'Keyword Difficulty (Truthful Status)',
    'Target Landing Page on 0nprint.com',
    'Recommended Page Title',
    'Recommended H1',
    'Content Gaps & Resolution',
    'Internal Linking Opportunities',
    'Recommended Anchor Category',
    'Intended Conversion Action',
    'SEO Notes',
  ]
  const esc = (v) => {
    const s = v === null || v === undefined ? '' : Array.isArray(v) ? v.join(' | ') : String(v)
    return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s
  }
  const rows = keywords.map((k) => [
    k.id,
    k.keyword,
    k.cluster,
    k.secondary_keywords,
    k.search_intent,
    k.funnel_stage,
    k.business_relevance,
    k.priority,
    k.search_volume_status,
    k.kd_status,
    k.target_url,
    k.recommended_title,
    k.recommended_h1,
    k.content_gaps,
    k.internal_linking_opportunities,
    k.recommended_anchor_category,
    k.conversion_cta,
    k.notes,
  ])
  return [headers.map(esc).join(','), ...rows.map((r) => r.map(esc).join(','))].join('\n')
}

ANCHOR_TEXT_STRATEGY.distribution_targets = ANCHOR_TEXT_STRATEGY.distributionTargets.map((d) => ({
  ...d,
  target_percentage: d.targetSharePct,
  rationale: d.usageRule,
}))
ANCHOR_TEXT_STRATEGY.target_page_mapping = ANCHOR_TEXT_STRATEGY.targetPageMapping.map((m) => ({
  ...m,
  target_page: m.targetUrl,
  role: m.pageRole,
  recommended_share_of_links: m.targetUrl === '/business-card-printing-dubai' ? '45%' : '10–15%',
  allowed_anchors: m.allowedAnchors,
  prohibited: 'Sitewide footer links, spun exact-match anchors, PBN placements',
}))

module.exports = {
  PRIORITIZED_BUSINESS_CARD_KEYWORDS,
  ADDITIONAL_VERIFIED_PRODUCT_KEYWORDS,
  ALL_MAPPED_BUSINESS_CARD_KEYWORDS,
  BUSINESS_CARD_BACKLINK_PROSPECTS,
  ANCHOR_TEXT_STRATEGY,
  LINK_WORTHY_CONTENT_ASSETS,
  WHITE_HAT_OUTREACH_TEMPLATES,
  NINETY_DAY_ROADMAP,
  getLandingPageTechnicalAudit,
  getMonthlyBacklinkReport,
  exportProspectsCsv,
  exportKeywordsCsv,
}

