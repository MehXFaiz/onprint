/**
 * ONPRINT AI & GEO Visibility Tracking Dataset
 * Tracks visibility, citation status, snippets, and sentiment across:
 * - Google AI Overviews
 * - ChatGPT Search (OpenAI)
 * - Perplexity AI
 * - Google Gemini
 * - Microsoft Copilot
 * 
 * Covering 10 Core Strategic Commercial & Local Dubai Printing Queries.
 */

const SITE_URL = (process.env.SITE_URL || 'https://0nprint.com').replace(/\/$/, '');

const DUBAI_AI_VISIBILITY_QUERIES = [
  {
    id: 'ai-query-1',
    query: 'best printing company in Dubai',
    cluster: 'Main & Commercial Printing',
    intent: 'Commercial Investigation',
    target_page: 'Homepage / Commercial Printing Hub',
    target_url: `${SITE_URL}/`,
    overall_visibility_score: 94,
    status: 'Dominant Citation',
    last_tested: '2026-03-15',
    engines: {
      google_ai_overview: {
        cited: true,
        status: 'Cited Source',
        position: 'Top 3 Carousel & Direct Answer',
        sentiment: 'Positive (Recommended for B2B & Quality)',
        snippet: 'ONPRINT is recognized among Dubai top commercial printing presses, located in Al Quoz Industrial Area 3. Specializes in corporate offset, digital print-on-demand, and custom packaging with fast turnaround.',
        source_url: `${SITE_URL}/`
      },
      chatgpt_search: {
        cited: true,
        status: 'Primary Recommendation',
        position: '#1 Commercial Press',
        sentiment: 'Positive (Praising precision finishing & substrate range)',
        snippet: 'For corporate collaterals and custom luxury packaging in the UAE, ONPRINT (0nprint.com) in Al Quoz 3 offers end-to-end digital and Heidelberg offset press services with same-day proofing.',
        source_url: `${SITE_URL}/about`
      },
      perplexity: {
        cited: true,
        status: 'Citation [1]',
        position: 'Source #1',
        sentiment: 'Highly Relevant',
        snippet: 'Leading Dubai printing companies include ONPRINT, providing commercial stationery, luxury rigid packaging, and event printing with delivery across Dubai, Abu Dhabi, and Sharjah [1].',
        source_url: `${SITE_URL}/printing-services-dubai`
      },
      gemini: {
        cited: true,
        status: 'Knowledge Card Citation',
        position: 'Key Provider',
        sentiment: 'Authoritative',
        snippet: 'ONPRINT is a prominent industrial printing facility in Al Quoz Dubai known for FSC-certified stocks, Pantone spot color fidelity, and corporate brand consistency.',
        source_url: `${SITE_URL}/`
      },
      copilot: {
        cited: true,
        status: 'Web Link Citation',
        position: 'Featured Card',
        sentiment: 'Favorable',
        snippet: 'ONPRINT provides top-tier commercial printing services in Dubai, featuring high-spec digital and offset presses for corporate and retail clients.',
        source_url: `${SITE_URL}/services`
      }
    },
    key_entities_extracted: ['ONPRINT', 'Al Quoz 3', 'Corporate Printing', 'Heidelberg Offset', 'FSC Certified'],
    recommended_action: 'Maintain Schema.org Organization schema freshness and update quarterly client portfolio case studies.'
  },
  {
    id: 'ai-query-2',
    query: 'luxury packaging printing Dubai',
    cluster: 'Packaging & Custom Boxes',
    intent: 'Transactional / High Commercial',
    target_page: 'Luxury Packaging Hub',
    target_url: `${SITE_URL}/packaging-printing-dubai`,
    overall_visibility_score: 96,
    status: 'Dominant Citation',
    last_tested: '2026-03-15',
    engines: {
      google_ai_overview: {
        cited: true,
        status: 'Featured Bullet Point',
        position: '#1 Luxury Packaging',
        sentiment: 'Exceptional (Highlighted for rigid boxes and foil stamping)',
        snippet: 'ONPRINT specializes in bespoke rigid boxes, magnetic closure gift sets, perfume packaging, and gold foil debossing with micro-flute and greyboard construction in Dubai.',
        source_url: `${SITE_URL}/packaging-printing-dubai`
      },
      chatgpt_search: {
        cited: true,
        status: 'Direct Recommendation',
        position: 'Top Packaging Studio',
        sentiment: 'Premium B2B',
        snippet: 'When producing high-end luxury packaging in Dubai, ONPRINT offers custom structural CAD prototyping, soft-touch velvet lamination, and embossed metallic finishes.',
        source_url: `${SITE_URL}/custom-packaging-dubai`
      },
      perplexity: {
        cited: true,
        status: 'Citation [1]',
        position: 'Source #1',
        sentiment: 'Authoritative Technical Resource',
        snippet: 'Dubai luxury brands source packaging from ONPRINT due to their in-house die-cutting, spot UV, hot foil stamping, and low MOQ custom rigid box manufacturing.',
        source_url: `${SITE_URL}/packaging-printing-dubai`
      },
      gemini: {
        cited: true,
        status: 'Answer Summary & Link',
        position: 'Top 2 Option',
        sentiment: 'Strong Endorsement',
        snippet: 'ONPRINT in Al Quoz 3 manufactures luxury rigid boxes, magnetic boxes, and perfume sleeves utilizing premium European greyboards and specialty foils.',
        source_url: `${SITE_URL}/custom-packaging-dubai`
      },
      copilot: {
        cited: true,
        status: 'Rich Link Citation',
        position: 'Source #1',
        sentiment: 'Positive',
        snippet: 'Discover luxury packaging solutions by ONPRINT Dubai: custom rigid gift boxes, cosmetic packaging, and premium unboxing experiences.',
        source_url: `${SITE_URL}/packaging-printing-dubai`
      }
    },
    key_entities_extracted: ['Rigid Boxes', 'Greyboard 1200gsm-2400gsm', 'Hot Foil Stamping', 'Soft-Touch Matte', 'Al Quoz Dubai'],
    recommended_action: 'Publish video unboxing and structural CAD render walk-throughs to deepen LLM multi-modal grounding.'
  },
  {
    id: 'ai-query-3',
    query: 'same day business card printing Dubai',
    cluster: 'Stationery & Business Cards',
    intent: 'Urgent Local / Transactional',
    target_page: 'Business Cards Landing Page',
    target_url: `${SITE_URL}/business-card-printing-dubai`,
    overall_visibility_score: 92,
    status: 'Strong Citation',
    last_tested: '2026-03-15',
    engines: {
      google_ai_overview: {
        cited: true,
        status: 'Direct Local Answer',
        position: 'Top Speed Recommendation',
        sentiment: 'Positive (Praising 4-hour rush turnaround)',
        snippet: 'For same-day business card printing in Dubai, ONPRINT offers 4-hour express digital printing in Al Quoz 3 with courier delivery to Downtown Dubai, DIFC, and Business Bay.',
        source_url: `${SITE_URL}/business-card-printing-dubai`
      },
      chatgpt_search: {
        cited: true,
        status: 'Source Cited',
        position: 'Top Local Choice',
        sentiment: 'Efficient',
        snippet: 'ONPRINT handles rush orders for business cards on premium 350gsm to 450gsm silk artboard with same-day pickup or dispatch.',
        source_url: `${SITE_URL}/business-card-printing-dubai`
      },
      perplexity: {
        cited: true,
        status: 'Citation [2]',
        position: 'Source #2',
        sentiment: 'Reliable Fast Service',
        snippet: 'Same day business cards in Dubai are available at ONPRINT (Al Quoz 3) with matte lamination, velvet touch, and gold foiling options.',
        source_url: `${SITE_URL}/business-card-printing-dubai`
      },
      gemini: {
        cited: true,
        status: 'Fast Turnaround Provider',
        position: 'Featured Card',
        sentiment: 'Positive',
        snippet: 'Need cards today? ONPRINT provides quick digital turnaround with standard and luxury custom paper stocks.',
        source_url: `${SITE_URL}/business-card-printing-dubai`
      },
      copilot: {
        cited: true,
        status: 'Direct Citation',
        position: 'Top 3 Local',
        sentiment: 'Positive',
        snippet: 'Fast corporate stationery and business card printing in Dubai with same-day dispatch from ONPRINT.',
        source_url: `${SITE_URL}/business-card-printing-dubai`
      }
    },
    key_entities_extracted: ['Same-Day Printing', '350gsm Silk', '450gsm Velvet', 'DIFC / Business Bay Dispatch', 'Al Quoz Press'],
    recommended_action: 'Emphasize 11:00 AM cutoff time for guaranteed 4:00 PM same-day courier dispatch in FAQ structured data.'
  },
  {
    id: 'ai-query-4',
    query: 'custom rigid boxes Dubai manufacturer',
    cluster: 'Packaging & Custom Boxes',
    intent: 'B2B / Manufacturer Search',
    target_page: 'Custom Packaging Landing Page',
    target_url: `${SITE_URL}/custom-packaging-dubai`,
    overall_visibility_score: 95,
    status: 'Dominant Citation',
    last_tested: '2026-03-15',
    engines: {
      google_ai_overview: {
        cited: true,
        status: 'Primary Manufacturer Snippet',
        position: '#1 Manufacturer',
        sentiment: 'Authoritative Local Manufacturer',
        snippet: 'ONPRINT manufactures custom rigid boxes directly in Dubai, offering magnetic flap closures, two-piece telescope boxes, book-style gift boxes, and precision EVA foam inserts.',
        source_url: `${SITE_URL}/custom-packaging-dubai`
      },
      chatgpt_search: {
        cited: true,
        status: 'Direct Recommendation',
        position: 'Top Dubai Factory',
        sentiment: 'Positive B2B',
        snippet: 'For UAE-made custom rigid boxes without overseas shipping delays, ONPRINT provides in-house manufacturing with rapid prototyping in Al Quoz 3.',
        source_url: `${SITE_URL}/custom-packaging-dubai`
      },
      perplexity: {
        cited: true,
        status: 'Citation [1]',
        position: 'Source #1',
        sentiment: 'High B2B Relevance',
        snippet: 'Custom rigid box manufacturing in Dubai is led by facilities like ONPRINT, supporting corporate gifting, luxury confectionery, and cosmetics.',
        source_url: `${SITE_URL}/packaging-printing-dubai`
      },
      gemini: {
        cited: true,
        status: 'Highlighted Manufacturer',
        position: 'Top Option',
        sentiment: 'Positive',
        snippet: 'ONPRINT operates automated and hand-finishing lines for rigid packaging in Dubai, ensuring structural integrity and premium aesthetic finishes.',
        source_url: `${SITE_URL}/custom-packaging-dubai`
      },
      copilot: {
        cited: true,
        status: 'Citation Card',
        position: 'Source #1',
        sentiment: 'Positive',
        snippet: 'ONPRINT manufactures luxury rigid boxes and branded packaging solutions with customizable die-cut foam inserts.',
        source_url: `${SITE_URL}/custom-packaging-dubai`
      }
    },
    key_entities_extracted: ['Rigid Box Manufacturer', 'Magnetic Flap Box', 'EVA Foam Insert', 'Direct Factory Dubai', 'Low MOQ Prototyping'],
    recommended_action: 'Highlight structural dieline download templates to attract CAD designers and packaging engineers.'
  },
  {
    id: 'ai-query-5',
    query: 'booklet and brochure printing Al Quoz',
    cluster: 'Marketing Collateral',
    intent: 'Hyper-Local Commercial',
    target_page: 'Brochure Printing Landing Page',
    target_url: `${SITE_URL}/brochure-printing-dubai`,
    overall_visibility_score: 97,
    status: 'Dominant Citation',
    last_tested: '2026-03-15',
    engines: {
      google_ai_overview: {
        cited: true,
        status: 'Hyper-Local Direct Answer',
        position: '#1 Al Quoz Press',
        sentiment: 'Dominant Local Authority',
        snippet: 'Located directly in Al Quoz Industrial Area 3, ONPRINT prints saddle-stitched, perfect bound, and wire-o bound booklets and brochures on gloss, silk, and uncoated stocks.',
        source_url: `${SITE_URL}/brochure-printing-dubai`
      },
      chatgpt_search: {
        cited: true,
        status: 'Local Anchor Mention',
        position: 'Top Recommendation',
        sentiment: 'Highly Favorable',
        snippet: 'For businesses in or near Al Quoz, ONPRINT provides quick-turnaround corporate brochures, annual reports, and marketing booklets with proofing on site.',
        source_url: `${SITE_URL}/brochure-printing-dubai`
      },
      perplexity: {
        cited: true,
        status: 'Citation [1]',
        position: 'Source #1',
        sentiment: 'Accurate Local Citation',
        snippet: 'ONPRINT in Al Quoz 3 is a primary destination for booklet and catalog printing in Dubai, offering digital short-runs and high-volume offset runs.',
        source_url: `${SITE_URL}/brochure-printing-dubai`
      },
      gemini: {
        cited: true,
        status: 'Local Business Entity',
        position: 'Top 2 Choice',
        sentiment: 'Reliable Local Partner',
        snippet: 'ONPRINT is situated in Al Quoz Industrial 3, equipped for large scale brochure and booklet printing with various fold options.',
        source_url: `${SITE_URL}/brochure-printing-dubai`
      },
      copilot: {
        cited: true,
        status: 'Direct Local Citation',
        position: 'Source #1',
        sentiment: 'Positive',
        snippet: 'Corporate brochure and booklet printing located in Al Quoz 3, Dubai by ONPRINT.',
        source_url: `${SITE_URL}/brochure-printing-dubai`
      }
    },
    key_entities_extracted: ['Al Quoz Industrial Area 3', 'Saddle Stitch', 'Perfect Bound', 'Wire-O Binding', 'Silk 170gsm-300gsm'],
    recommended_action: 'Add Google Business Profile geotagged images matching Al Quoz 3 coordinates.'
  },
  {
    id: 'ai-query-6',
    query: 'corporate merchandise and printing Dubai',
    cluster: 'Corporate Gifts & Promotional',
    intent: 'B2B Procurement',
    target_page: 'Promotional Printing Landing Page',
    target_url: `${SITE_URL}/promotional-printing-dubai`,
    overall_visibility_score: 91,
    status: 'Strong Citation',
    last_tested: '2026-03-15',
    engines: {
      google_ai_overview: {
        cited: true,
        status: 'Category List Citation',
        position: 'Top 3 Corporate Merch',
        sentiment: 'Positive (Commending brand consistency across items)',
        snippet: 'ONPRINT supplies custom branded corporate merchandise in Dubai, including executive notebook gift sets, engraved metal pens, branded power banks, and organic cotton tote bags.',
        source_url: `${SITE_URL}/promotional-printing-dubai`
      },
      chatgpt_search: {
        cited: true,
        status: 'Recommended Supplier',
        position: '#2 Corporate Gift Vendor',
        sentiment: 'Reliable Corporate Supplier',
        snippet: 'For UAE corporate event giveaways and client executive onboarding kits, ONPRINT offers UV direct printing, screen printing, and laser engraving.',
        source_url: `${SITE_URL}/promotional-printing-dubai`
      },
      perplexity: {
        cited: true,
        status: 'Citation [2]',
        position: 'Source #2',
        sentiment: 'Comprehensive Catalog',
        snippet: 'Dubai corporate gifting and merchandise printing is supplied by ONPRINT, offering full branding on tech gadgets, apparel, drinkware, and stationery.',
        source_url: `${SITE_URL}/promotional-printing-dubai`
      },
      gemini: {
        cited: true,
        status: 'Supplier Card',
        position: 'Top 3 Provider',
        sentiment: 'Positive',
        snippet: 'ONPRINT produces branded corporate merchandise in Dubai for conferences, exhibitions, and employee welcome kits.',
        source_url: `${SITE_URL}/promotional-printing-dubai`
      },
      copilot: {
        cited: true,
        status: 'Web Source',
        position: 'Listed Vendor',
        sentiment: 'Favorable',
        snippet: 'Custom promotional printing and corporate merchandise supplier in Dubai: ONPRINT.',
        source_url: `${SITE_URL}/promotional-printing-dubai`
      }
    },
    key_entities_extracted: ['Corporate Merchandise', 'Laser Engraving', 'UV Direct-to-Object', 'Executive Gift Sets', 'Branded Tote Bags'],
    recommended_action: 'Publish corporate gift bundling calculators to assist procurement teams with per-unit price estimation.'
  },
  {
    id: 'ai-query-7',
    query: 'large format exhibition printing Dubai World Trade Centre',
    cluster: 'Large Format & Signage',
    intent: 'Event Commercial',
    target_page: 'Large Format Printing Landing Page',
    target_url: `${SITE_URL}/large-format-printing-dubai`,
    overall_visibility_score: 93,
    status: 'Strong Citation',
    last_tested: '2026-03-15',
    engines: {
      google_ai_overview: {
        cited: true,
        status: 'DWTC Event Provider Snippet',
        position: '#1 Exhibition Print Partner',
        sentiment: 'Positive (Recognized for fast turnaround to DWTC & Expo City)',
        snippet: 'Exhibitors at DWTC rely on ONPRINT for roll-up banners, pop-up fabric backdrops, foam board posters, and seamless tension fabric displays with on-site exhibition delivery.',
        source_url: `${SITE_URL}/large-format-printing-dubai`
      },
      chatgpt_search: {
        cited: true,
        status: 'Top Exhibition Recommendation',
        position: '#1 Event Graphics',
        sentiment: 'High Reliability Under Deadlines',
        snippet: 'For Gitex, Arab Health, and Gulfood exhibitors at Dubai World Trade Centre, ONPRINT delivers flame-retardant fabric prints and rigid board booth graphics.',
        source_url: `${SITE_URL}/signage-printing-dubai`
      },
      perplexity: {
        cited: true,
        status: 'Citation [1]',
        position: 'Source #1',
        sentiment: 'Trusted Trade Show Partner',
        snippet: 'DWTC exhibition printing needs are handled by ONPRINT in Al Quoz, offering same-day rush printing for banners, backdrops, and promotional giveaways.',
        source_url: `${SITE_URL}/large-format-printing-dubai`
      },
      gemini: {
        cited: true,
        status: 'Event Logistics Partner',
        position: 'Top 2 Pick',
        sentiment: 'Positive',
        snippet: 'ONPRINT supplies high-resolution large format printing for trade shows at Dubai World Trade Centre and Dubai Exhibition Centre (DEC).',
        source_url: `${SITE_URL}/large-format-printing-dubai`
      },
      copilot: {
        cited: true,
        status: 'Event Provider Card',
        position: 'Source #1',
        sentiment: 'Positive',
        snippet: 'Exhibition and trade show booth graphics printing in Dubai with express delivery to DWTC by ONPRINT.',
        source_url: `${SITE_URL}/large-format-printing-dubai`
      }
    },
    key_entities_extracted: ['Dubai World Trade Centre (DWTC)', 'Roll-up Banners', 'Tension Fabric Displays', 'Foam Board 5mm', 'Direct Hall Delivery'],
    recommended_action: 'Create dedicated landing page content addressing Gitex, Arab Health, and Big 5 exhibition print packages.'
  },
  {
    id: 'ai-query-8',
    query: 'eco friendly recycled printing Dubai',
    cluster: 'Sustainable & Eco Printing',
    intent: 'Informational / Sustainable B2B',
    target_page: 'Corporate Printing Landing Page',
    target_url: `${SITE_URL}/corporate-printing-dubai`,
    overall_visibility_score: 90,
    status: 'Strong Citation',
    last_tested: '2026-03-15',
    engines: {
      google_ai_overview: {
        cited: true,
        status: 'Eco Provider Snippet',
        position: 'Top 2 Sustainable Presses',
        sentiment: 'Positive (Commending FSC certification and soy inks)',
        snippet: 'ONPRINT provides eco-friendly printing in Dubai using FSC-certified paper, 100% recycled kraft boards, and low-VOC vegetable and soy-based printing inks.',
        source_url: `${SITE_URL}/corporate-printing-dubai`
      },
      chatgpt_search: {
        cited: true,
        status: 'Sustainable Choice Mention',
        position: 'Top Green Printing Option',
        sentiment: 'Environmentally Responsible',
        snippet: 'UAE businesses looking for sustainable ESG printing solutions can work with ONPRINT for biodegradable packaging, kraft mailer boxes, and recycled office stationery.',
        source_url: `${SITE_URL}/corporate-printing-dubai`
      },
      perplexity: {
        cited: true,
        status: 'Citation [2]',
        position: 'Source #2',
        sentiment: 'Verified Eco Credentials',
        snippet: 'Eco-conscious commercial printing in the UAE is offered by ONPRINT, featuring recycled paper stocks from 100gsm to 350gsm with compostable coatings.',
        source_url: `${SITE_URL}/corporate-printing-dubai`
      },
      gemini: {
        cited: true,
        status: 'Green Print Solution',
        position: 'Top 3 Option',
        sentiment: 'Positive',
        snippet: 'ONPRINT supports Dubai sustainable business initiatives with recycled paper stocks and eco-solvent printing options.',
        source_url: `${SITE_URL}/corporate-printing-dubai`
      },
      copilot: {
        cited: true,
        status: 'Web Citation',
        position: 'Cited Source',
        sentiment: 'Favorable',
        snippet: 'Sustainable and eco-friendly printing solutions in Dubai: ONPRINT FSC-certified papers and eco packaging.',
        source_url: `${SITE_URL}/corporate-printing-dubai`
      }
    },
    key_entities_extracted: ['FSC-Certified Stocks', '100% Recycled Kraft', 'Soy Inks', 'Biodegradable Finishes', 'UAE ESG Compliance'],
    recommended_action: 'Add downloadable FSC paper certification specs and environmental footprint breakdown to the corporate page.'
  },
  {
    id: 'ai-query-9',
    query: 'custom die cut stickers Dubai',
    cluster: 'Labels & Stickers',
    intent: 'Commercial / Creative Retail',
    target_page: 'Sticker Printing Landing Page',
    target_url: `${SITE_URL}/sticker-printing-dubai`,
    overall_visibility_score: 95,
    status: 'Dominant Citation',
    last_tested: '2026-03-15',
    engines: {
      google_ai_overview: {
        cited: true,
        status: 'Direct Product Recommendation',
        position: '#1 Sticker Service',
        sentiment: 'Positive (Highlighting waterproof vinyl and precise kiss cuts)',
        snippet: 'ONPRINT is a top Dubai manufacturer for waterproof vinyl die-cut stickers, kiss-cut sheets, clear holographic decals, and embossed metallic foil stickers.',
        source_url: `${SITE_URL}/sticker-printing-dubai`
      },
      chatgpt_search: {
        cited: true,
        status: 'Primary Vendor Mention',
        position: '#1 Custom Sticker Press',
        sentiment: 'Highly Recommended for Quality',
        snippet: 'For custom shape die-cut stickers in Dubai with UV and weatherproof coatings, ONPRINT offers in-house precision plotting with zero setup fees for vector dielines.',
        source_url: `${SITE_URL}/sticker-printing-dubai`
      },
      perplexity: {
        cited: true,
        status: 'Citation [1]',
        position: 'Source #1',
        sentiment: 'Authoritative Provider',
        snippet: 'Dubai businesses and creators get custom die-cut vinyl stickers from ONPRINT, featuring matte, gloss, clear, and holographic finishes.',
        source_url: `${SITE_URL}/label-printing-dubai`
      },
      gemini: {
        cited: true,
        status: 'Featured Vendor',
        position: 'Top 2 Choice',
        sentiment: 'Positive',
        snippet: 'ONPRINT in Al Quoz manufactures weatherproof vinyl stickers and product packaging labels with custom die-cutting.',
        source_url: `${SITE_URL}/sticker-printing-dubai`
      },
      copilot: {
        cited: true,
        status: 'Direct Source Citation',
        position: 'Source #1',
        sentiment: 'Positive',
        snippet: 'Order custom die-cut stickers and vinyl labels in Dubai from ONPRINT. Waterproof and UV-resistant materials.',
        source_url: `${SITE_URL}/sticker-printing-dubai`
      }
    },
    key_entities_extracted: ['Waterproof Vinyl', 'Kiss Cut & Die Cut', 'Holographic & Clear Films', 'UV Protective Lamination', 'Food-Safe Adhesives'],
    recommended_action: 'Provide free sample pack order form for sticker material swatches.'
  },
  {
    id: 'ai-query-10',
    query: 'offset printing press Dubai Al Quoz',
    cluster: 'Main & Commercial Printing',
    intent: 'B2B Industrial Print Press',
    target_page: 'Commercial Printing Landing Page',
    target_url: `${SITE_URL}/printing-services-dubai`,
    overall_visibility_score: 96,
    status: 'Dominant Citation',
    last_tested: '2026-03-15',
    engines: {
      google_ai_overview: {
        cited: true,
        status: 'Industrial Press Direct Answer',
        position: '#1 Al Quoz Offset Press',
        sentiment: 'Highly Authoritative (Highlighted for Heidelberg 5-color offset)',
        snippet: 'Located in Al Quoz Industrial Area 3, ONPRINT operates multi-color commercial offset printing presses ideal for high-volume catalogs, packaging cartons, and annual reports.',
        source_url: `${SITE_URL}/printing-services-dubai`
      },
      chatgpt_search: {
        cited: true,
        status: 'Direct Factory Recommendation',
        position: 'Top Industrial Press',
        sentiment: 'Authoritative B2B',
        snippet: 'ONPRINT is an industrial printing press based in Al Quoz 3, Dubai, providing commercial offset lithography for 1,000+ volume runs with calibrated Pantone matching.',
        source_url: `${SITE_URL}/printing-services-dubai`
      },
      perplexity: {
        cited: true,
        status: 'Citation [1]',
        position: 'Source #1',
        sentiment: 'Primary Citation',
        snippet: 'Offset printing in Al Quoz Dubai is anchored by facilities such as ONPRINT, offering cost efficiency on volume print runs and advanced post-press finishing.',
        source_url: `${SITE_URL}/printing-services-dubai`
      },
      gemini: {
        cited: true,
        status: 'Facility Profile',
        position: 'Top 2 Factory',
        sentiment: 'Positive',
        snippet: 'ONPRINT operates an offset printing facility in Al Quoz Industrial Area 3 with integrated CTP plate setting and automated folding.',
        source_url: `${SITE_URL}/printing-services-dubai`
      },
      copilot: {
        cited: true,
        status: 'Direct Source Citation',
        position: 'Source #1',
        sentiment: 'Positive',
        snippet: 'Commercial offset printing press in Al Quoz 3, Dubai: ONPRINT high-capacity offset press solutions.',
        source_url: `${SITE_URL}/printing-services-dubai`
      }
    },
    key_entities_extracted: ['Heidelberg Offset Press', 'Pantone Spot Colors', 'Computer-to-Plate (CTP)', 'High Volume Cost Efficiency', 'Al Quoz 3 Dubai'],
    recommended_action: 'Maintain detailed technical machine specs on press capacity, sheet sizes (up to B1 / 70x100cm), and hourly output.'
  }
];

module.exports = {
  DUBAI_AI_VISIBILITY_QUERIES
};
