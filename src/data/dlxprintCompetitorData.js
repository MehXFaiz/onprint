/**
 * ONPRINT vs. DLXPrint (dlxprint.com) Competitive Intelligence Dataset
 * Based on publicly observable market architecture, service lines, local footprint,
 * and search intent gaps in the Dubai and UAE commercial printing sector.
 *
 * DO NOT copy competitor text. Used strictly to build superior, original resources.
 */

const SITE_URL = (process.env.SITE_URL || 'https://0nprint.com').replace(/\/$/, '')

const DLXPRINT_PROFILE = {
  competitor_name: 'Deluxe Printing (DLXPrint)',
  website: 'https://dlxprint.com',
  headquarters: 'Street 13, Al Qusais Industrial Area 1, Dubai, UAE',
  established_year: 1999,
  market_position: 'Established traditional commercial and retail print shop in Deira/Al Qusais corridor',
  primary_production_technologies: [
    'Digital Color Presses',
    'Sheetfed Offset Presses',
    'UV Flatbed Printing',
    'Large Format Eco-Solvent / Latex',
    'Dye-Sublimation Fabric Printing',
  ],
  service_coverage: [
    'Office & Corporate Identity (Business cards, letterheads, folders, stamps, certificates)',
    'Marketing Collateral (Flyers, tri-fold brochures, booklets, catalogues)',
    'Signage & Light Boxes (Flex face, fabric lightbox, acrylic 3D, neon)',
    'Outdoor & Event Displays (Rollup banners, teardrop flags, pop-up backdrops)',
    'Packaging & Boxes (Printed paper bags, basic folding cartons, branded tissue)',
    'Corporate Merchandise & Giveaways (Mugs, pens, water bottles, USBs)',
  ],
  strengths: [
    'Long operating history in Dubai (since 1999) with strong legacy brand awareness',
    'High volume of public Google reviews (1,300+ reviews)',
    'Broad generalist catalog spanning small stationery to outdoor displays',
  ],
  weaknesses_and_vulnerabilities: [
    'Geographic disadvantage: Based in Al Qusais (far from DIFC, Downtown, Business Bay, Marina corporate demand centers)',
    'Lack of high-end luxury packaging specialization (rigid perfume boxes, magnetic gift boxes, custom velvet foam)',
    'Stationery limited largely to standard 350gsm stocks; lacks 600gsm cotton and painted edge craftsmanship',
    'Flat website architecture with thin technical specifications and generic FAQ answers',
    'No dedicated AI / GEO answer architecture (lacks llms.txt, structured answer blocks, and entity schema depth)',
    'Quote process relies primarily on standard email inquiry forms without instant interactive online quote builders',
  ],
}

const ONPRINT_DIFFERENTIATION_MATRIX = [
  {
    pillar: 'Geographic Location & Delivery Speed',
    onprint: 'Al Quoz Industrial Area 3 facility: 10–15 mins to DIFC, Downtown, Business Bay, Jumeirah, and DWTC. 4-hour same-day rush delivery across central Dubai.',
    dlxprint: 'Al Qusais Industrial Area 1: 35–50 mins in traffic to central Dubai business districts; standard 24–48hr lead times.',
    onprintAdvantageScore: 94,
    strategicAngle: 'Target urgent corporate orders in DIFC and Downtown with "Central Dubai Express Press / Al Quoz Same-Day".',
  },
  {
    pillar: 'Luxury Rigid Packaging & Custom Boxes',
    onprint: 'In-house rigid box die-making, magnetic closure assembly, velvet touch, hot foil stamping (gold, rose gold, silver, hologram), custom high-density EVA foam inserts. Low MOQ from 50 units.',
    dlxprint: 'Primarily basic folding cartons and paper bags; complex rigid boxes require 1,000+ unit MOQs and longer outsourced lead times.',
    onprintAdvantageScore: 96,
    strategicAngle: 'Dominate luxury perfume, oud, jewelry, and confectionery packaging in Dubai with low-MOQ rapid sampling.',
  },
  {
    pillar: 'Executive Business Cards & Bespoke Finishes',
    onprint: '350gsm silk, 450gsm velvet touch, 600gsm double-thick cotton card, edge painting/gilding, blind debossing, raised spot UV, foil stamping.',
    dlxprint: 'Standard 350gsm matte/gloss cards with basic spot UV. Rare heavy cotton or painted edge options.',
    onprintAdvantageScore: 92,
    strategicAngle: 'Position ONPRINT as the definitive bespoke card printer for law firms, venture capital, financial executives, and luxury real estate.',
  },
  {
    pillar: 'Exhibition & Trade Show Turnkey Packages',
    onprint: 'All-inclusive DWTC & Expo City turnkey kits: Heavy-duty satin rollups, fabric backdrops, acrylic brochure holders, event badges, and same-day delivery direct to exhibition halls.',
    dlxprint: 'A la carte display sales; lacks dedicated DWTC event concierge packages with booth-side delivery guarantees.',
    onprintAdvantageScore: 90,
    strategicAngle: 'Capture international exhibitors landing at DXB for GITEX, Arab Health, The Big 5, and Beautyworld with pre-booked delivery.',
  },
  {
    pillar: 'Digital Quoting & Online Customer Flow',
    onprint: 'Instant multi-step quote request builder (/get-a-quote), dedicated WhatsApp pressroom concierge (+44 7344 546056), sample pack request program.',
    dlxprint: 'Traditional static inquiry forms and manual email requests.',
    onprintAdvantageScore: 88,
    strategicAngle: 'Frictionless B2B procurement workflow converting mobile and urgent web searchers in under 60 seconds.',
  },
]

const DLXPRINT_COMPETITOR_GAPS = [
  // 1. KEYWORD GAPS
  {
    id: 'gap-kw-1',
    category: 'Keyword Gaps',
    gap_title: 'Luxury Cotton & Painted Edge Business Cards',
    competitor_coverage: 'Targets generic "business card printing dubai" and "cheap business cards". Minimal presence for high-gsm luxury card queries.',
    onprint_coverage: 'Dedicated Luxury Business Cards landing page and products with 450gsm and 600gsm cotton options.',
    opportunity: 'High CPC and high B2B order value from law firms, private equity, and DIFC executives.',
    recommended_page: '/business-card-printing-dubai',
    recommended_keyword: 'painted edge business cards dubai',
    search_intent: 'Commercial',
    priority: 'Critical',
    action: 'Target "luxury business cards DIFC", "cotton business cards dubai", and "painted edge cards UAE" with tactile substrate imagery.',
  },
  {
    id: 'gap-kw-2',
    category: 'Keyword Gaps',
    gap_title: 'Low MOQ Custom Rigid Boxes & Perfume Packaging',
    competitor_coverage: 'Targets general "packaging boxes" and "paper bag printing" with high minimum order requirements.',
    onprint_coverage: 'Luxury Packaging landing page (/luxury-packaging-dubai) and product detail page.',
    opportunity: 'Surging demand from homegrown UAE perfume brands, specialty chocolate makers, and luxury ecommerce boutiques.',
    recommended_page: '/luxury-packaging-dubai',
    recommended_keyword: 'low moq perfume box printing dubai',
    search_intent: 'Transactional',
    priority: 'Critical',
    action: 'Emphasize "custom rigid boxes from 50 units" and "same-day luxury packaging sample mockups in Al Quoz".',
  },
  {
    id: 'gap-kw-3',
    category: 'Keyword Gaps',
    gap_title: 'Urgent Same-Day Printing in Central Dubai (Al Quoz / DIFC)',
    competitor_coverage: 'Ranks for general rush printing but physical turnaround is constrained by Al Qusais location.',
    onprint_coverage: 'Same-Day Printing commercial page (/same-day-printing-dubai) with 4-hour turnaround specs.',
    opportunity: 'High-urgency commercial clients willing to pay premium expedited rates for same-day delivery.',
    recommended_page: '/same-day-printing-dubai',
    recommended_keyword: 'urgent printing dubai same day',
    search_intent: 'Transactional',
    priority: 'High',
    action: 'Highlight 4-hour turnaround cutoff times, instant WhatsApp ordering, and central Dubai dispatch radius.',
  },

  // 2. CONTENT GAPS
  {
    id: 'gap-content-1',
    category: 'Content Gaps',
    gap_title: 'Comprehensive Paper GSM & Substrate Tactile Guide',
    competitor_coverage: 'Brief product bullet points listing "350gsm paper" without tactile descriptions or weight comparison breakdowns.',
    onprint_coverage: 'Blog guide on paper weights and materials, but needs direct visual GSM comparison tables.',
    opportunity: 'Capture high-funnel searchers educating themselves before ordering corporate stationery.',
    recommended_page: '/blog/commercial-print-paper-weight-gsm-guide-dubai',
    recommended_keyword: 'paper gsm guide printing dubai',
    search_intent: 'Informational',
    priority: 'High',
    action: 'Publish an in-depth Paper GSM Guide (120gsm letterhead vs 350gsm flyer vs 450gsm card vs 600gsm duplex) with real touch descriptions.',
  },
  {
    id: 'gap-content-2',
    category: 'Content Gaps',
    gap_title: 'Pre-Press Artwork Preparation & 3mm Bleed Checklist',
    competitor_coverage: 'Brief notes on "send print-ready PDF" without step-by-step guidance on vector conversion, bleed, and CMYK color profiles.',
    onprint_coverage: 'FAQ guidelines page with technical specifications.',
    opportunity: 'Eliminate order delays, rank for graphic designer searches, and earn natural backlinks from UAE creative agencies.',
    recommended_page: '/faq',
    recommended_keyword: 'how to prepare artwork for printing dubai',
    search_intent: 'Informational',
    priority: 'Medium',
    action: 'Add a downloadable 1-page Artwork Pre-Press Checklist covering 300 DPI, 3mm bleed, CMYK color space, and font outlining.',
  },

  // 3. SERVICE GAPS
  {
    id: 'gap-service-1',
    category: 'Service Gaps',
    gap_title: 'DWTC Trade Show Same-Day Booth Delivery Service',
    competitor_coverage: 'Delivers across UAE via standard third-party couriers; no dedicated trade exhibition booth concierge.',
    onprint_coverage: 'Exhibition Stands commercial landing page (/exhibition-stands-dubai).',
    opportunity: 'Thousands of international exhibitors at Dubai World Trade Centre need direct-to-booth replacement prints and banner fixes.',
    recommended_page: '/exhibition-stands-dubai',
    recommended_keyword: 'dwtc exhibition printing direct to booth',
    search_intent: 'Commercial',
    priority: 'Critical',
    action: 'Package dedicated DWTC Emergency Exhibitor Service guaranteeing 4-hour direct-to-booth delivery during major trade shows.',
  },
  {
    id: 'gap-service-2',
    category: 'Service Gaps',
    gap_title: 'Rapid Luxury Packaging Prototyping (Sample Box Service)',
    competitor_coverage: 'Requires committing to full production runs or long digital proof cycles.',
    onprint_coverage: 'Interactive quote request with custom packaging options.',
    opportunity: 'Luxury brands require a tactile sample box for management approval before committing to 5,000+ units.',
    recommended_page: '/luxury-packaging-dubai',
    recommended_keyword: 'custom packaging sample box dubai',
    search_intent: 'Commercial',
    priority: 'High',
    action: 'Offer a "Sample Box Prototyping Service" credited against the final production order.',
  },

  // 4. PRODUCT GAPS
  {
    id: 'gap-product-1',
    category: 'Product Gaps',
    gap_title: 'Waterproof Synthetic Tear-Resistant Menus (TEVA Polymer)',
    competitor_coverage: 'Standard laminated paper menus that peel and discolor over time in outdoor Dubai humidity.',
    onprint_coverage: 'Custom printed menus under Restaurant Collateral category.',
    opportunity: 'Over 12,000 F&B venues in Dubai require durable, alcohol-resistant, washable menus for terrace and beachside dining.',
    recommended_page: '/menu-printing-dubai',
    recommended_keyword: 'waterproof restaurant menu printing dubai',
    search_intent: 'Commercial',
    priority: 'High',
    action: 'Showcase non-laminated waterproof synthetic polymer menu substrates that never peel or absorb liquids.',
  },
  {
    id: 'gap-product-2',
    category: 'Product Gaps',
    gap_title: 'Security Hologram & Anti-Counterfeit Labels',
    competitor_coverage: 'Basic paper stickers and vinyl decals; no specialized tamper-evident security holographic foils.',
    onprint_coverage: 'Stickers & Labels commercial page and product line.',
    opportunity: 'Luxury cosmetics, pharmaceuticals, electronics, and automotive parts brands in UAE requiring authentication seals.',
    recommended_page: '/custom-stickers-labels-dubai',
    recommended_keyword: 'hologram sticker printing dubai',
    search_intent: 'Commercial',
    priority: 'Medium',
    action: 'Highlight custom hologram and tamper-evident destructible vinyl sticker printing for brand security.',
  },

  // 5. FAQ GAPS
  {
    id: 'gap-faq-1',
    category: 'FAQ Gaps',
    gap_title: 'Digital vs. Offset Quantity Break-Even Point in UAE',
    competitor_coverage: 'Generic "We offer both digital and offset" without specific economic thresholds for customers.',
    onprint_coverage: 'GEO FAQ dataset covers digital vs offset pricing factors.',
    opportunity: 'Immediate answer extraction by Google AI Overviews and ChatGPT for B2B buyers budgeting print runs.',
    recommended_page: '/services',
    recommended_keyword: 'difference between digital and offset printing dubai',
    search_intent: 'Informational',
    priority: 'High',
    action: 'Provide exact guidance: 1–500 units optimal on digital press; 1,000+ units significantly cheaper per unit on Heidelberg offset.',
  },
  {
    id: 'gap-faq-2',
    category: 'FAQ Gaps',
    gap_title: 'Same-Day Print Order Deadlines & Courier Radii in Dubai',
    competitor_coverage: 'No published daily cutoff times or specific area delivery timeframes.',
    onprint_coverage: 'Same-day commercial page with 12:00 PM cutoff specification.',
    opportunity: 'Featured snippet capture for urgent searches ("how fast can I print business cards in Dubai").',
    recommended_page: '/same-day-printing-dubai',
    recommended_keyword: 'same day printing dubai turnaround time',
    search_intent: 'Informational',
    priority: 'High',
    action: 'Structure concise answer: "Orders confirmed with print-ready PDF before 12:00 PM are printed and dispatched by 4:00 PM across Dubai."',
  },

  // 6. INTERNAL-LINK GAPS
  {
    id: 'gap-link-1',
    category: 'Internal-Link Gaps',
    gap_title: 'Topical Hub-and-Spoke Mesh (Blog to Commercial Landing Pages)',
    competitor_coverage: 'Competitor blog articles have few contextual in-text links pointing back to commercial product configurators.',
    onprint_coverage: 'Internal linking engine systematically maps Blog -> Service, Category -> Product, and Service -> Quote.',
    opportunity: 'Pass page authority and user flow directly from high-funnel educational guides into conversion-focused landing pages.',
    recommended_page: '/blog',
    recommended_keyword: 'commercial printing guide dubai',
    search_intent: 'Informational',
    priority: 'High',
    action: 'Ensure every blog post contains 2–3 contextual anchor links pointing directly to the relevant commercial hub.',
  },

  // 7. SCHEMA GAPS
  {
    id: 'gap-schema-1',
    category: 'Schema Gaps',
    gap_title: 'Deep LocalBusiness, Service OfferCatalog & Product Price Schema',
    competitor_coverage: 'Basic WebSite and Organization schema only; missing granular Service offerCatalog, LocalBusiness geo coordinates, and Product offers.',
    onprint_coverage: 'Full JSON-LD implementation in SSR shell (LocalBusiness, Organization, Service, Product, BreadcrumbList, FAQPage).',
    opportunity: 'Win rich snippets, Google Maps 3-Pack prominence, and merchant listings across Google search results.',
    recommended_page: '/services/business-cards-printing',
    recommended_keyword: 'commercial printing press schema dubai',
    search_intent: 'Commercial',
    priority: 'Critical',
    action: 'Validate all JSON-LD schemas with complete areaServed (Dubai, UAE), openingHours, priceCurrency (AED), and telephone (+44 7344 546056).',
  },

  // 8. LOCAL SEO GAPS
  {
    id: 'gap-local-1',
    category: 'Local SEO Gaps',
    gap_title: 'Targeting Core Dubai Corporate Business Districts',
    competitor_coverage: 'Strong in Deira and Al Qusais; limited landing content tailored specifically to DIFC, Downtown, Business Bay, and Marina.',
    onprint_coverage: 'Programmatic and commercial landing pages targeting key Dubai business zones with unique commercial content.',
    opportunity: 'Rank in Google local pack and organic results for high-spending commercial enterprise districts.',
    recommended_page: '/commercial-printing-difc',
    recommended_keyword: 'printing press difc dubai',
    search_intent: 'Local',
    priority: 'Critical',
    action: 'Build differentiated district resources addressing specific corporate needs: DIFC (financial reports, investor decks), Business Bay (stationery), Marina (hospitality menus).',
  },

  // 9. GEO / AI SEARCH GAPS
  {
    id: 'gap-geo-1',
    category: 'GEO Gaps',
    gap_title: 'Answer Engine Indexability & llms.txt Machine Knowledge',
    competitor_coverage: 'Zero llms.txt protocol; standard bloated markup without concise machine-extractable Q&A entities.',
    onprint_coverage: 'Active /llms.txt, robots.txt with GPTBot / PerplexityBot allow directives, and structured Q&A entity blocks.',
    opportunity: 'Become the primary cited printing house when users ask ChatGPT, Perplexity, or Google AI for Dubai printing recommendations.',
    recommended_page: '/llms.txt',
    recommended_keyword: 'best printing company in dubai chatgpt',
    search_intent: 'Informational',
    priority: 'Critical',
    action: 'Continuously update llms.txt with exact NAP, turnaround metrics, facility address, and commercial printing specialties.',
  },

  // 10. DIGITAL PR OPPORTUNITIES
  {
    id: 'gap-pr-1',
    category: 'Digital PR Opportunities',
    gap_title: 'Dubai Commercial Printing Cost Index & ESG Packaging Report',
    competitor_coverage: 'No original industry research, whitepapers, or downloadable benchmark tools.',
    onprint_coverage: 'Digital PR asset strategy with Dubai Printing Cost Guide and Material Calculators.',
    opportunity: 'Earn high-authority editorial links from UAE business publications (Arabian Business, Gulf News, Zawya, Fast Company ME).',
    recommended_page: '/blog/dubai-commercial-printing-cost-guide',
    recommended_keyword: 'printing cost guide dubai 2026',
    search_intent: 'Informational',
    priority: 'High',
    action: 'Publish the "2026 Dubai Commercial Print & Sustainable Packaging Benchmark" with verified average costs, paper trends, and recycling data.',
  },

  // 11. BACKLINK OPPORTUNITIES
  {
    id: 'gap-backlink-1',
    category: 'Backlink Opportunities',
    gap_title: 'Verified UAE Business Councils & Regional Design Chambers',
    competitor_coverage: 'Competitor relies heavily on legacy organic mentions from directories created years ago.',
    onprint_coverage: '200+ curated legitimate UAE business directories, chambers of commerce, packaging forums, and design awards.',
    opportunity: 'Build a durable, spam-free, authoritative backlink profile from real regional organizations.',
    recommended_page: '/about',
    recommended_keyword: 'dubai chamber of commerce verified printer',
    search_intent: 'Navigational',
    priority: 'High',
    action: 'Execute systematic outreach to Dubai Chamber, British Business Group, French Business Council, and Packaging MEA trade portal.',
  },
]

module.exports = {
  DLXPRINT_PROFILE,
  ONPRINT_DIFFERENTIATION_MATRIX,
  DLXPRINT_COMPETITOR_GAPS,
}
