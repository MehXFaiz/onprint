/**
 * ONPRINT GEO FAQ Dataset
 * Comprehensive, factual question-and-answer library covering all major services,
 * commercial specifications, materials, and Dubai/UAE operating context.
 * Adheres strictly to genuine ONPRINT capabilities without unverified claims.
 */

const SITE_URL = (process.env.SITE_URL || 'https://0nprint.com').replace(/\/$/, '')

const GEO_FAQS = [
  // ==========================================
  // 1. GENERAL PRINTING & ONPRINT ENTITY (Requirements 1, 4, 5)
  // ==========================================
  {
    id: 1,
    question: 'What is ONPRINT?',
    answer: 'ONPRINT is an independent commercial printing company and physical branding studio headquartered in Al Quoz Industrial Area 3, Dubai, UAE. The company provides digital printing, offset lithography, corporate stationery, promotional merchandise, and large-format signage to businesses, retailers, and corporate clients across the United Arab Emirates.',
    category: 'General',
    related_service: 'Commercial Printing',
    target_url: `${SITE_URL}/about`,
    search_intent: 'Informational',
    status: 'published',
  },
  {
    id: 2,
    question: 'Where is ONPRINT located in Dubai?',
    answer: 'ONPRINT operates an in-house pressroom located in Al Quoz Industrial Area 3, Dubai, United Arab Emirates. From this facility, ONPRINT manages pre-press engineering, digital and offset production, luxury finishing, and dispatch across Dubai, Abu Dhabi, Sharjah, and all other Emirates.',
    category: 'General',
    related_service: 'Commercial Printing',
    target_url: `${SITE_URL}/contact`,
    search_intent: 'Local',
    status: 'published',
  },
  {
    id: 3,
    question: 'What printing services does ONPRINT offer in Dubai?',
    answer: 'ONPRINT provides high-resolution digital printing for short runs, high-capacity offset lithography for volume jobs, executive business cards (350gsm–600gsm), custom rigid and folding retail packaging, marketing brochures and flyers, custom die-cut product labels and stickers, corporate office stationery (letterheads, envelopes, folders), staff PVC ID cards and lanyards, promotional corporate gifts, and large-format roll-up exhibition banners.',
    category: 'General',
    related_service: 'Printing Services Dubai',
    target_url: `${SITE_URL}/services`,
    search_intent: 'Commercial',
    status: 'published',
  },
  {
    id: 4,
    question: 'Does ONPRINT provide printing services across Dubai?',
    answer: 'Yes. ONPRINT provides direct commercial printing services throughout all commercial and residential areas of Dubai, including Al Quoz, Business Bay, Downtown Dubai, DIFC, Dubai Marina, Jumeirah, Sheikh Zayed Road, Deira, Bur Dubai, Dubai South, and the Dubai World Trade Centre (DWTC).',
    category: 'General',
    related_service: 'Printing Services Dubai',
    target_url: `${SITE_URL}/printing-services-dubai`,
    search_intent: 'Local',
    status: 'published',
  },
  {
    id: 5,
    question: 'How can I request a quote from ONPRINT?',
    answer: 'You can request an itemized quotation by using the Get a Quote form on 0nprint.com, sending a message to our WhatsApp concierge (+971 55 183 7995), or emailing your specifications and artwork to 0nprint183@gmail.com.',
    category: 'General',
    related_service: 'Quotation Desk',
    target_url: `${SITE_URL}/get-a-quote`,
    search_intent: 'Transactional',
    status: 'published',
  },
  {
    id: 6,
    question: 'How can I contact ONPRINT?',
    answer: 'You can contact ONPRINT via WhatsApp concierge at +971 55 183 7995, via email at 0nprint183@gmail.com, or in person at our press facility in Warehouse 4, 24th Street, Al Quoz Industrial Area 3, Dubai, UAE. Operating hours are Monday through Saturday from 8:30 AM to 6:30 PM.',
    category: 'General',
    related_service: 'Contact Desk',
    target_url: `${SITE_URL}/contact`,
    search_intent: 'Local',
    status: 'published',
  },
  {
    id: 7,
    question: 'What types of businesses does ONPRINT serve?',
    answer: 'ONPRINT serves B2B corporate enterprises, growing startups, retail brands, restaurants and hospitality venues, e-commerce businesses, marketing and creative agencies, financial institutions, event and exhibition organizers at DWTC, and professional individuals requiring bespoke printing collateral.',
    category: 'General',
    related_service: 'Commercial Printing',
    target_url: `${SITE_URL}/about`,
    search_intent: 'Informational',
    status: 'published',
  },
  {
    id: 8,
    question: 'Does ONPRINT provide custom printing?',
    answer: 'Yes. All production at ONPRINT is custom manufactured to client specifications. Clients can customize dimensions, paper stocks from 120gsm to 600gsm, pantone color matching, and post-press finishing techniques including hot foil stamping in metallic gold or silver, spot UV varnishing, blind embossing, debossing, soft-touch velvet lamination, and custom die-cutting.',
    category: 'General',
    related_service: 'Custom Printing',
    target_url: `${SITE_URL}/services`,
    search_intent: 'Commercial',
    status: 'published',
  },

  // ==========================================
  // 2. BUSINESS CARDS PRINTING (Requirement 5)
  // ==========================================
  {
    id: 9,
    question: 'Does ONPRINT print business cards in Dubai?',
    answer: 'Yes. ONPRINT prints premium business cards in Dubai, producing standard 300gsm networking cards, executive 350gsm to 450gsm silk cards with soft-touch lamination, and luxury 600gsm multi-ply cotton boards with foil stamping and painted edges at our Al Quoz 3 facility.',
    category: 'Business Cards',
    related_service: 'Business Card Printing',
    target_url: `${SITE_URL}/business-card-printing-dubai`,
    search_intent: 'Commercial',
    status: 'published',
  },
  {
    id: 10,
    question: 'What business card options are available at ONPRINT?',
    answer: 'Available options include standard 300gsm coated art paper, premium 350gsm soft-touch laminated cards, executive 450gsm velvet cards with metallic gold/silver foil stamping, 600gsm luxury duplex/triplex cotton cards with colored sandwich cores, painted edge finishing, textured Conqueror stocks, and spot UV varnishing.',
    category: 'Business Cards',
    related_service: 'Business Card Printing',
    target_url: `${SITE_URL}/business-card-printing-dubai`,
    search_intent: 'Commercial',
    status: 'published',
  },
  {
    id: 11,
    question: 'Can business cards be customized with luxury finishes?',
    answer: 'Yes. Custom finishes include hot foil stamping (mirror gold, matte gold, rose gold, silver, holographic), raised 3D spot UV, blind embossing, blind debossing, custom die-cut rounded corners, and Pantone edge painting to match corporate brand guidelines.',
    category: 'Business Cards',
    related_service: 'Business Card Printing',
    target_url: `${SITE_URL}/business-card-printing-dubai`,
    search_intent: 'Commercial',
    status: 'published',
  },
  {
    id: 12,
    question: 'What artwork format should I provide for business card printing?',
    answer: 'Submit print-ready PDF/X-1a or vector Adobe Illustrator (AI) files at 300 DPI in CMYK color mode. Ensure 3mm bleed on all outer edges and keep all text and logos within a 4mm inner safe zone. Convert all typography to vector outlines (curves). For foil or spot UV layers, provide separate vector masks in 100% K (black).',
    category: 'Business Cards',
    related_service: 'Business Card Printing',
    target_url: `${SITE_URL}/business-card-printing-dubai`,
    search_intent: 'Informational',
    status: 'published',
  },
  {
    id: 13,
    question: 'How can I order business cards from ONPRINT in Dubai?',
    answer: 'You can order directly online by selecting your desired card specifications on 0nprint.com, submitting your PDF artwork through our quote form, or contacting our press desk on WhatsApp at +971 55 183 7995. A digital pre-press proof will be provided for your review and approval prior to production.',
    category: 'Business Cards',
    related_service: 'Business Card Printing',
    target_url: `${SITE_URL}/business-card-printing-dubai`,
    search_intent: 'Transactional',
    status: 'published',
  },

  // ==========================================
  // 3. PACKAGING & CUSTOM BOXES (Requirement 5)
  // ==========================================
  {
    id: 14,
    question: 'Does ONPRINT provide custom packaging in Dubai?',
    answer: 'Yes. ONPRINT manufactures custom rigid boxes, folding retail cartons, corrugated shipping mailers, luxury gift boxes, and product packaging in Dubai. We handle custom structural CAD dielines, printing, laminating, and rigid assembly in-house.',
    category: 'Packaging',
    related_service: 'Custom Packaging',
    target_url: `${SITE_URL}/custom-packaging-dubai`,
    search_intent: 'Commercial',
    status: 'published',
  },
  {
    id: 15,
    question: 'What types of packaging can ONPRINT produce?',
    answer: 'ONPRINT produces two-piece lid-and-base rigid boxes, book-style magnetic closure boxes, slide drawer matchboxes, tuck-end folding retail cartons, self-locking corrugated e-commerce mailers, luxury gift hamper boxes, perfume boxes, and retail shopping bags with custom handles.',
    category: 'Packaging',
    related_service: 'Packaging Printing',
    target_url: `${SITE_URL}/packaging-printing-dubai`,
    search_intent: 'Commercial',
    status: 'published',
  },
  {
    id: 16,
    question: 'Can packaging be customized with a company logo and custom inserts?',
    answer: 'Yes. Packaging can be branded with CMYK full-color graphics, metallic foil stamping, embossed brand marks, and spot UV. In addition, we create tailored internal product inserts using precision laser-cut high-density EVA foam, velvet-flocked trays, or thermoformed card partitions.',
    category: 'Packaging',
    related_service: 'Custom Packaging',
    target_url: `${SITE_URL}/custom-packaging-dubai`,
    search_intent: 'Commercial',
    status: 'published',
  },
  {
    id: 17,
    question: 'What packaging materials are available at ONPRINT?',
    answer: 'Materials include 1.5mm to 3.0mm European greyboard and chipboard for rigid boxes, 300gsm to 400gsm SBS folding boxboard (C1S/C2S), unbleached recycled brown Kraft board, E-flute and B-flute corrugated board for transit mailers, and specialty paper wraps from Fedrigoni and Arjowiggins.',
    category: 'Packaging',
    related_service: 'Custom Packaging',
    target_url: `${SITE_URL}/custom-packaging-dubai`,
    search_intent: 'Informational',
    status: 'published',
  },
  {
    id: 18,
    question: 'How can I request custom packaging in Dubai?',
    answer: 'Submit your packaging dimensions (length x width x height in mm), preferred box structure, estimated quantity, and product weight via our Get a Quote page or WhatsApp. Our packaging team will prepare a structural dieline template, calculate manufacturing turnaround, and provide sample prototype options.',
    category: 'Packaging',
    related_service: 'Custom Packaging',
    target_url: `${SITE_URL}/custom-packaging-dubai`,
    search_intent: 'Transactional',
    status: 'published',
  },

  // ==========================================
  // 4. PRODUCT LABELS & DIE-CUT STICKERS (Requirement 5)
  // ==========================================
  {
    id: 19,
    question: 'Does ONPRINT print product labels in Dubai?',
    answer: 'Yes. ONPRINT prints custom product labels for cosmetics, food and beverage, perfumes, cleaning products, retail jars, and retail packaging on waterproof vinyl, BOPP film, textured paper, and Kraft substrates.',
    category: 'Labels',
    related_service: 'Label Printing',
    target_url: `${SITE_URL}/label-printing-dubai`,
    search_intent: 'Commercial',
    status: 'published',
  },
  {
    id: 20,
    question: 'Can labels and stickers be customized in any shape or size?',
    answer: 'Yes. Using computerized digital blade and laser die-cutting, ONPRINT produces stickers and labels in any custom geometric or freeform die-cut shape without requiring expensive physical die moulds for short-to-medium runs.',
    category: 'Labels',
    related_service: 'Sticker Printing',
    target_url: `${SITE_URL}/sticker-printing-dubai`,
    search_intent: 'Commercial',
    status: 'published',
  },
  {
    id: 21,
    question: 'What label formats and sizes are available at ONPRINT?',
    answer: 'We supply custom labels both as individual die-cut pieces, kiss-cut multiple units per sheet, or wound onto machine-application rolls with standard 25mm, 40mm, or 76mm cardboard cores. Sizes range from micro 10mm seal stickers up to large industrial bucket labels.',
    category: 'Labels',
    related_service: 'Label Printing',
    target_url: `${SITE_URL}/label-printing-dubai`,
    search_intent: 'Informational',
    status: 'published',
  },
  {
    id: 22,
    question: 'Can ONPRINT print branded labels with foil or waterproof coatings?',
    answer: 'Yes. We offer waterproof gloss and matte lamination, scratch-resistant coatings, metallic hot foil stamping, holographic film finishes, and transparent clear BOPP labels with opaque white ink backing for clear glass bottles and jars.',
    category: 'Labels',
    related_service: 'Label Printing',
    target_url: `${SITE_URL}/label-printing-dubai`,
    search_intent: 'Commercial',
    status: 'published',
  },

  // ==========================================
  // 5. CORPORATE PRINTING & STATIONERY (Requirement 5)
  // ==========================================
  {
    id: 23,
    question: 'Does ONPRINT provide corporate printing in Dubai?',
    answer: 'Yes. ONPRINT specializes in B2B corporate printing, serving corporate offices, DIFC financial firms, hospitality groups, and healthcare providers across Dubai and the UAE with official brand collateral.',
    category: 'Corporate Printing',
    related_service: 'Corporate Printing',
    target_url: `${SITE_URL}/corporate-printing-dubai`,
    search_intent: 'Commercial',
    status: 'published',
  },
  {
    id: 24,
    question: 'Can companies order branded stationery sets from ONPRINT?',
    answer: 'Yes. We produce complete branded stationery sets including matching letterheads, DL and C4 envelopes with peel-and-seal strips, presentation pocket folders, employee name badges, branded notepads, and executive notebooks.',
    category: 'Corporate Printing',
    related_service: 'Corporate Printing',
    target_url: `${SITE_URL}/corporate-printing-dubai`,
    search_intent: 'Commercial',
    status: 'published',
  },
  {
    id: 25,
    question: 'What corporate printing products are available?',
    answer: 'Products include 120gsm laser-guaranteed corporate letterheads, official correspondence envelopes, laminated presentation folders with business card slits, executive notebooks, employee PVC ID cards with RFID/NFC chips, custom branded lanyards, and annual reports.',
    category: 'Corporate Printing',
    related_service: 'Corporate Printing',
    target_url: `${SITE_URL}/corporate-printing-dubai`,
    search_intent: 'Informational',
    status: 'published',
  },

  // ==========================================
  // 6. BROCHURES & FLYERS
  // ==========================================
  {
    id: 26,
    question: 'Which company provides brochure printing in Dubai?',
    answer: 'ONPRINT provides commercial brochure printing in Dubai from our Al Quoz 3 facility, producing bi-fold, tri-fold, z-fold leaflets, saddle-stitched product catalogs, and perfect-bound corporate profiles on FSC-certified 150gsm to 300gsm art paper.',
    category: 'Brochures & Flyers',
    related_service: 'Brochure Printing',
    target_url: `${SITE_URL}/brochure-printing-dubai`,
    search_intent: 'Commercial',
    status: 'published',
  },
  {
    id: 27,
    question: 'What is the difference between a flyer and a brochure?',
    answer: 'A flyer is typically a single flat sheet (single or double-sided, usually A5, A4, or DL size) used for promotional announcements, event handouts, or mass marketing. A brochure is folded or bound into multi-page panels (bi-fold, tri-fold, multi-page catalog) providing structured, detailed company or product presentations.',
    category: 'Brochures & Flyers',
    related_service: 'Brochure Printing',
    target_url: `${SITE_URL}/brochure-printing-dubai`,
    search_intent: 'Informational',
    status: 'published',
  },
  {
    id: 28,
    question: 'What paper stocks are recommended for marketing flyers in Dubai?',
    answer: 'For cost-effective mass distribution, 130gsm to 170gsm gloss or silk art paper is standard. For premium corporate or real estate handouts, 250gsm to 300gsm coated art board with protective matte or velvet soft-touch lamination is recommended.',
    category: 'Brochures & Flyers',
    related_service: 'Flyer Printing',
    target_url: `${SITE_URL}/flyer-printing-dubai`,
    search_intent: 'Informational',
    status: 'published',
  },

  // ==========================================
  // 7. LARGE FORMAT & EXHIBITION SIGNAGE
  // ==========================================
  {
    id: 29,
    question: 'Where can I print roll-up banners and exhibition displays in Dubai?',
    answer: 'ONPRINT produces roll-up retractable display banners, pop-up backdrops, tension fabric displays, and exhibition posters at our Al Quoz 3 facility, with direct dispatch available to the Dubai World Trade Centre (DWTC), Expo City, and event venues across the UAE.',
    category: 'Large Format & Signage',
    related_service: 'Large Format Printing',
    target_url: `${SITE_URL}/large-format-printing-dubai`,
    search_intent: 'Local',
    status: 'published',
  },
  {
    id: 30,
    question: 'What sizes are standard for roll-up banners?',
    answer: 'Standard roll-up banner sizes are 85cm x 200cm (most popular commercial format), 100cm x 200cm, 120cm x 200cm, and wide 150cm x 200cm presentation formats. All units are printed on anti-curl, blockout satin polyester film mounted into durable aluminium cassette bases with carry bags.',
    category: 'Large Format & Signage',
    related_service: 'Large Format Printing',
    target_url: `${SITE_URL}/large-format-printing-dubai`,
    search_intent: 'Informational',
    status: 'published',
  },

  // ==========================================
  // 8. TECHNICAL, ARTWORK & PRE-PRESS (Requirement 6)
  // ==========================================
  {
    id: 31,
    question: 'How do I prepare artwork files for professional printing?',
    answer: 'To prepare artwork for professional printing: 1) Design in CMYK color mode (not RGB); 2) Set document resolution to 300 DPI at 100% print scale; 3) Add 3mm bleed on all outer edges; 4) Keep important typography and logos at least 4mm inside the trim line (safe margin); 5) Convert all fonts to vector curves/outlines; 6) Export as high-resolution PDF/X-1a or PDF/X-4 with crop marks.',
    category: 'Artwork & Quality',
    related_service: 'Pre-Press Services',
    target_url: `${SITE_URL}/blog/how-to-prepare-print-ready-pdf-artwork`,
    search_intent: 'Informational',
    status: 'published',
  },
  {
    id: 32,
    question: 'What is the difference between digital printing and offset printing?',
    answer: 'Digital printing transfers ink/toner directly from digital files without metal printing plates, making it fast and cost-effective for short runs (1 to 500 units) with same-day turnaround. Offset printing uses aluminum plates to transfer ink via rubber blankets onto paper; it requires initial setup but delivers the lowest per-unit cost on higher volumes (500 to 100,000+ units) and superior Pantone spot color matching.',
    category: 'Artwork & Quality',
    related_service: 'Printing Services Dubai',
    target_url: `${SITE_URL}/blog/digital-vs-offset-printing-dubai`,
    search_intent: 'Informational',
    status: 'published',
  },
  {
    id: 33,
    question: 'Can I see a physical proof before full press production starts?',
    answer: 'Yes. Every order receives a digital PDF proof as standard. For high-volume offset runs, corporate stationery packages, or color-critical branding, clients can request a hard-copy contract digital proof or unprinted structural packaging mockup at our Al Quoz 3 facility.',
    category: 'Artwork & Quality',
    related_service: 'Pre-Press Services',
    target_url: `${SITE_URL}/about`,
    search_intent: 'Commercial',
    status: 'published',
  },

  // ==========================================
  // 9. PRICING FACTORS (Requirement 6, 32 - NO INVENTED PRICES)
  // ==========================================
  {
    id: 34,
    question: 'How much does printing cost in Dubai?',
    answer: 'Printing costs in Dubai vary based on project specifications rather than a single flat rate. Key pricing factors include: 1) Quantity (higher print runs significantly lower the per-unit cost on offset presses); 2) Paper stock and GSM (standard 300gsm art paper vs 600gsm luxury imported cotton); 3) Dimensions and page count; 4) Printing method (digital short-run vs high-volume offset); 5) Specialty finishing (hot foil stamping, spot UV, custom die-cutting require specialized tooling); 6) Production turnaround (standard 2-4 days vs same-day rush). ONPRINT provides transparent itemized quotations within 2 hours of receiving your specs.',
    category: 'Pricing Factors',
    related_service: 'Quotation Desk',
    target_url: `${SITE_URL}/get-a-quote`,
    search_intent: 'Commercial',
    status: 'published',
  },
  {
    id: 35,
    question: 'What factors affect the price of business card printing in Dubai?',
    answer: 'Business card pricing depends on five measurable factors: 1) Paper stock (standard 300gsm art card vs 350gsm silk vs 600gsm cotton board); 2) Print quantity (100, 250, 500, or 1,000+ cards); 3) Lamination (matte, gloss, soft-touch velvet); 4) Specialty enhancements (gold/silver hot foil, spot UV, debossing, or painted edges); 5) Production speed (standard 24–48 hours vs same-day emergency press service).',
    category: 'Pricing Factors',
    related_service: 'Business Card Printing',
    target_url: `${SITE_URL}/business-card-printing-dubai`,
    search_intent: 'Informational',
    status: 'published',
  },
  {
    id: 36,
    question: 'What factors determine custom packaging costs in Dubai?',
    answer: 'Custom packaging pricing is determined by: 1) Box construction (folding carton vs rigid setup box vs corrugated mailer); 2) Board caliper and thickness (e.g. 1200gsm greyboard vs 350gsm SBS); 3) Production quantity (tooling and die-cutting plate setup amortize over larger runs); 4) Exterior paper wrap and finishing (foil stamping, spot UV, matte lamination); 5) Internal insert requirements (custom laser-cut EVA foam vs card dividers); 6) Assembly (flat-packed vs fully pre-assembled rigid boxes).',
    category: 'Pricing Factors',
    related_service: 'Custom Packaging',
    target_url: `${SITE_URL}/custom-packaging-dubai`,
    search_intent: 'Informational',
    status: 'published',
  },

  // ==========================================
  // 10. TURNAROUND & DELIVERY (Requirements 16, 17)
  // ==========================================
  {
    id: 37,
    question: 'What is the standard turnaround time for printing orders at ONPRINT?',
    answer: 'Standard digital printing orders (business cards, flyers, presentation folders, roll-up banners) are completed within 24 to 48 hours following artwork approval. Offset lithography runs, custom rigid gift boxes, and complex multi-process foil projects typically require 3 to 7 working days.',
    category: 'Turnaround & Delivery',
    related_service: 'Logistics Desk',
    target_url: `${SITE_URL}/track-order`,
    search_intent: 'Informational',
    status: 'published',
  },
  {
    id: 38,
    question: 'Does ONPRINT offer same-day or rush printing in Dubai?',
    answer: 'Yes. Same-day rush printing is available for select digital products including urgent business cards, event flyers, and retractable roll-up display banners when print-ready artwork is submitted and confirmed before 11:00 AM on business days.',
    category: 'Turnaround & Delivery',
    related_service: 'Logistics Desk',
    target_url: `${SITE_URL}/contact`,
    search_intent: 'Local',
    status: 'published',
  },
  {
    id: 39,
    question: 'Does ONPRINT deliver to Abu Dhabi, Sharjah, and other Emirates?',
    answer: 'Yes. ONPRINT delivers across all seven Emirates of the UAE via tracked courier logistics: Dubai, Abu Dhabi, Sharjah, Ajman, Ras Al Khaimah, Fujairah, and Umm Al Quwain. Clients can also arrange direct order collection from our Al Quoz 3 facility in Dubai.',
    category: 'Turnaround & Delivery',
    related_service: 'Logistics Desk',
    target_url: `${SITE_URL}/contact`,
    search_intent: 'Local',
    status: 'published',
  },
  {
    id: 40,
    question: 'How can I track my ONPRINT order?',
    answer: 'Clients can track their production and delivery status online at 0nprint.com/track-order by entering their Order Number (e.g. ORD-2026-XXXXXX) or approved Quote Number.',
    category: 'Turnaround & Delivery',
    related_service: 'Order Tracking',
    target_url: `${SITE_URL}/track-order`,
    search_intent: 'Transactional',
    status: 'published',
  },
]

module.exports = {
  GEO_FAQS,
}
