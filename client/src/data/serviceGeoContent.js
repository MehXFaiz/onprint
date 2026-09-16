/**
 * GEO-Optimized Content for Service Pages
 * Provides answer-first content structure for AI-powered search engines
 */

export const serviceGeoContent = {
  'digital-printing': {
    whatIs: {
      title: 'What is Digital Printing?',
      definition:
        'Digital printing is a modern printing method that transfers digital images directly from a computer to the printing press without using traditional printing plates. It\'s ideal for small to medium print runs (up to 1,000 units) with fast turnaround times.',
      expanded:
        'Unlike offset printing which requires plate setup, digital printing uses toner-based or inkjet technology to produce high-quality prints on demand. ONPRINT uses HP Indigo digital presses that deliver 1200 DPI resolution with precise color matching for business cards, flyers, brochures, and marketing materials.',
    },
    whoNeedsThis: {
      title: 'Who Needs Digital Printing?',
      audiences: [
        'Startups and small businesses requiring low quantities (50-500 units)',
        'Companies needing quick turnaround for events or launches',
        'Businesses printing variable data (personalized direct mail, certificates)',
        'Clients testing marketing materials before large-volume production',
        'Projects requiring frequent design updates or versioning',
      ],
    },
    keyInfo: {
      cost: 'Digital printing costs start from AED 120 for 100 business cards. Pricing varies by size, paper stock, and finishing. Generally more economical than offset for quantities under 1,000 units due to no plate setup fees.',
      turnaround: 'Standard turnaround is 24-48 hours after artwork approval. Same-day service available for rush orders placed before 10 AM.',
      minimumOrder: 'As low as 25 units for most products. No minimum for proof samples.',
      materials:
        'Available on 120gsm-600gsm paper stocks including smooth uncoated, glossy art paper, matte coated, and premium cotton stocks.',
    },
    advantages: [
      'Fast turnaround (24-48 hours)',
      'No plate setup costs',
      'Cost-effective for small quantities',
      'Variable data printing capability',
      'Quick design revisions',
      'High-quality color output',
      'Suitable for prototyping',
    ],
    bestFor: [
      'Business cards (50-500 quantity)',
      'Marketing flyers and brochures',
      'Event materials and programs',
      'Certificates and invitations',
      'Direct mail campaigns',
      'Product catalogs (short runs)',
    ],
    faqs: [
      {
        question: 'What is the difference between digital and offset printing?',
        answer:
          'Digital printing is ideal for small quantities (up to 1,000 units) with faster turnaround and no plate setup costs. Offset printing is more cost-effective for large volumes (1,000+ units) and offers superior color consistency for brand-critical projects. Digital uses toner or inkjet, while offset uses ink rollers and printing plates.',
      },
      {
        question: 'What is the maximum paper weight for digital printing?',
        answer:
          'ONPRINT\'s HP Indigo digital presses can print on paper stocks up to 600 GSM, including thick cotton business card stock and premium art paper for brochures.',
      },
      {
        question: 'Can you print Pantone colors digitally?',
        answer:
          'Yes, our HP Indigo presses can match most Pantone colors using CMYK process with high accuracy. For exact Pantone spot color matching, offset printing is recommended.',
      },
      {
        question: 'What file formats do you accept for digital printing?',
        answer:
          'We accept PDF (preferred), AI (Adobe Illustrator), EPS, and high-resolution JPG/PNG files. Files should be in CMYK color mode at 300 DPI with 3mm bleed.',
      },
      {
        question: 'Is digital printing quality as good as offset?',
        answer:
          'Modern digital printing delivers excellent quality suitable for most business applications. For projects under 1,000 units, the quality difference is minimal. Offset has slight advantages for large solid color areas and very long runs.',
      },
    ],
  },

  'offset-printing': {
    whatIs: {
      title: 'What is Offset Printing?',
      definition:
        'Offset printing is a traditional commercial printing method that transfers ink from a printing plate to a rubber blanket, then to the printing surface. It\'s the most cost-effective solution for high-volume print runs (1,000+ units) with superior color consistency.',
      expanded:
        'ONPRINT operates Heidelberg offset presses that deliver exceptional print quality for large commercial projects. Offset printing excels at producing vibrant, consistent colors across thousands of prints, making it ideal for brand-critical materials, marketing campaigns, and bulk stationery production.',
    },
    whoNeedsThis: {
      title: 'Who Needs Offset Printing?',
      audiences: [
        'Companies printing large quantities (1,000+ units)',
        'Brands requiring exact Pantone color matching',
        'Businesses printing annual reports, catalogs, or magazines',
        'Marketing campaigns with wide distribution',
        'Corporate stationery for entire organizations',
        'Event organizers printing thousands of flyers or programs',
      ],
    },
    keyInfo: {
      cost: 'Offset printing becomes more economical than digital for quantities over 1,000 units. Price per unit decreases significantly as quantity increases. Setup includes plate costs, but unit cost is lower.',
      turnaround:
        'Standard turnaround is 3-7 business days including plate setup, printing, and finishing. Exact timeline depends on quantity and finishing requirements.',
      minimumOrder:
        'Recommended minimum 500-1,000 units to justify plate setup costs. Contact us for custom quotes on smaller offset runs.',
      materials:
        'Suitable for all paper stocks from 80gsm to 400gsm, including coated art paper, uncoated bond, textured stocks, and specialty papers.',
    },
    advantages: [
      'Most economical for large quantities',
      'Superior color consistency across print run',
      'Exact Pantone spot color matching',
      'Widest range of paper stock compatibility',
      'Best for high-volume production',
      'Professional-grade commercial quality',
      'Ideal for brand-critical materials',
    ],
    bestFor: [
      'Marketing brochures (5,000+ copies)',
      'Corporate stationery sets',
      'Product catalogs and magazines',
      'Annual reports',
      'Event programs and flyers (bulk)',
      'Packaging inserts',
    ],
    faqs: [
      {
        question: 'Why is offset printing better for large quantities?',
        answer:
          'Offset printing requires upfront plate setup costs, but the per-unit cost is much lower than digital. Once plates are made, printing thousands of copies is fast and economical. Break-even point is typically around 1,000 units.',
      },
      {
        question: 'Can you match exact Pantone colors with offset?',
        answer:
          'Yes, offset printing uses Pantone spot color inks for exact brand color matching. This is essential for maintaining brand consistency across all marketing materials.',
      },
      {
        question: 'What is the maximum paper size for offset printing?',
        answer:
          'ONPRINT\'s Heidelberg presses can print up to A1 sheet size (594mm x 841mm). Larger formats require sheet-fed or web offset presses.',
      },
      {
        question: 'How long does offset printing take?',
        answer:
          'Standard offset printing takes 3-7 business days including plate preparation, press setup, printing, and finishing. Large runs may take longer depending on finishing requirements like lamination, die-cutting, or foil stamping.',
      },
      {
        question: 'Can I get a proof before offset printing?',
        answer:
          'Yes, we provide digital PDF proofs and can produce physical printed proofs on your chosen paper stock. This ensures color and layout approval before committing to the full print run.',
      },
    ],
  },

  'large-format-printing': {
    whatIs: {
      title: 'What is Large Format Printing?',
      definition:
        'Large format printing produces oversized prints wider than 24 inches, including banners, posters, signage, rollup displays, and exhibition graphics. It uses specialized wide-format printers capable of printing on vinyl, fabric, rigid boards, and other large-scale materials.',
      expanded:
        'ONPRINT\'s large format printing services cover everything from indoor banners and exhibition rollups to outdoor weatherproof vinyl signage. We print on materials up to 5 meters wide, suitable for trade shows, retail displays, events, and permanent signage installations across Dubai and the UAE.',
    },
    whoNeedsThis: {
      title: 'Who Needs Large Format Printing?',
      audiences: [
        'Event organizers for trade shows and exhibitions',
        'Retail stores for window displays and promotions',
        'Real estate agencies for property banners',
        'Hotels and restaurants for menu boards and signage',
        'Corporate offices for wayfinding and branding',
        'Marketing agencies for campaign activations',
      ],
    },
    keyInfo: {
      cost: 'Pricing varies by size, material, and finishing. Vinyl banners start from AED 80 per square meter. Rollup displays start from AED 250. Premium fabric prints and rigid board mounting cost more.',
      turnaround:
        'Standard turnaround is 48-72 hours for most large format prints. Simple vinyl banners can be completed in 24 hours. Installation services may require additional time.',
      minimumOrder: 'Single unit orders accepted. No minimum quantity required.',
      materials: 'Vinyl (indoor/outdoor), fabric (wrinkle-free), rigid foam boards, mesh banners, canvas, backlit film, wallpaper material.',
    },
    advantages: [
      'Maximum visual impact',
      'Weatherproof outdoor options',
      'Wrinkle-free fabric for premium displays',
      'Portable rollup systems for events',
      'Custom sizes up to 5 meters wide',
      'UV-resistant inks for longevity',
      'Installation services available',
    ],
    bestFor: [
      'Trade show displays and rollup banners',
      'Retail window graphics and posters',
      'Outdoor building banners',
      'Event backdrops and stage graphics',
      'Real estate property signage',
      'Indoor wayfinding and directional signs',
    ],
    faqs: [
      {
        question: 'What is the difference between indoor and outdoor banners?',
        answer:
          'Outdoor banners use heavyweight vinyl (440-510 GSM) with UV-resistant inks and weatherproof lamination to withstand sun, rain, and wind. Indoor banners use lighter vinyl (340 GSM) or fabric with standard eco-solvent inks. Outdoor banners last 1-3 years in Dubai\'s climate.',
      },
      {
        question: 'What are rollup banners?',
        answer:
          'Rollup banners (also called retractable banners or pull-up stands) are portable display systems with spring-loaded bases. Graphics print on vinyl or fabric and retract into the aluminum base for easy transport. Ideal for exhibitions, conferences, and events.',
      },
      {
        question: 'Can large format prints be installed?',
        answer:
          'Yes, ONPRINT offers installation services for building banners, window graphics, and wall-mounted displays across Dubai. Installation quotes are provided based on location, size, and complexity.',
      },
      {
        question: 'What is the maximum size you can print?',
        answer:
          'Our large format printers can produce seamless prints up to 5 meters wide and virtually unlimited length. For wider displays, we can tile and seam prints or recommend alternative solutions.',
      },
      {
        question: 'How long do outdoor banners last in Dubai?',
        answer:
          'With proper UV-resistant inks and lamination, outdoor banners last 1-3 years in Dubai\'s sunny climate. Lifespan depends on direct sun exposure, wind conditions, and material quality.',
      },
      {
        question: 'Can you print on fabric for wrinkle-free displays?',
        answer:
          'Yes, we print on premium stretch fabric that remains wrinkle-free even after rolling. Fabric is ideal for premium displays, backdrop walls, and exhibition graphics requiring professional appearance.',
      },
      {
        question: 'Do you offer same-day large format printing?',
        answer:
          'Same-day service is available for standard vinyl banners and simple prints ordered before 10 AM. Rollup displays and premium finishing options require 48-72 hours.',
      },
    ],
  },

  'business-cards-printing': {
    whatIs: {
      title: 'What is Business Card Printing?',
      definition:
        'Business card printing produces 85x55mm (or custom-sized) contact cards representing your brand identity. It combines precise digital or offset presses with luxury paper stocks and premium finishing like soft-touch lamination, gold foil, and embossed debossing.',
      expanded:
        'ONPRINT produces single-sided and double-sided business cards on 350gsm art board, 450gsm silk stock, and 600gsm 100% cotton. Standard card dimensions for UAE are 85mm × 55mm. Finishing options include matte or gloss lamination, soft-touch velvet, spot UV patterns, rose gold or gold foil stamping, letterpress, painted edges, and round cornering.',
    },
    whoNeedsThis: {
      title: 'Who Needs Business Card Printing?',
      audiences: [
        'Founders, CEOs, and executive teams (luxury cotton cards)',
        'Sales and business development teams (high-volume silk 400gsm)',
        'Real estate agents and property consultants (photograph-quality glossy)',
        'Freelancers, designers, and solo consultants (distinctive creative stock)',
        'Hospitality front-desk staff and retail teams',
        'Government and semi-government personnel (FSC certified matte)',
      ],
    },
    keyInfo: {
      cost: 'From AED 120 for 100 standard 350gsm cards. Luxury 600gsm cotton with foil + painted edges starts at AED 1,600 for 500 pieces.',
      turnaround: 'Standard 2–3 working days. Express same-day for 350gsm matte only (before 10 AM).',
      minimumOrder: 'As low as 50 pieces for standard cards, 200 for luxury cotton foil variants.',
      materials:
        'Available on 300gsm–600gsm coated art board, uncoated wood-free, 100% cotton (German import), Kraft, and duplex/triplex boards for extra-thick cards.',
    },
    advantages: [
      '10+ paper stock options including imported cotton',
      'Gold/silver/rose gold foil stamping',
      'Blind emboss and deep debossing',
      'Painted edges (white, black, silver, gold, pantone)',
      'Round corners, ticket die-cuts, notch cuts',
      'Letterpress impression available',
      'Spot UV registration accurate to 0.1mm',
    ],
    bestFor: [
      'Executive and C-level networking cards',
      'Startup founder meet-and-greet kits',
      'Corporate rebranding stationery bundles',
      'DIFC and DSO free zone business setups',
      'Conferences, summits, and investor meetings',
      'Luxury retail associates and sales advisors',
    ],
    faqs: [
      {
        question: 'What is the standard UAE business card size?',
        answer:
          '85mm × 55mm (rounded 90x54 mm CR80 also available). Always supply artwork with 3mm bleed on all sides.',
      },
      {
        question: 'Can you print Arabic on the back of the card?',
        answer:
          'Yes — fully bilingual Arabic/English design is standard for ONPRINT. Arabic calligraphy and embossed names are fully supported.',
      },
      {
        question: 'What is the MOQ for luxury foil cards?',
        answer:
          '200 pieces is the minimum for foil stamping because the metal die has a fixed setup cost. Spot UV and soft-touch cards can start at 100.',
      },
    ],
  },

  'brochures-printing': {
    whatIs: {
      title: 'What is Brochure & Catalog Printing?',
      definition:
        'Brochure and catalog printing produces multi-page folded or saddle-stitched marketing documents in standard sizes like A4 and A5. Used for product lines, company profiles, property portfolios, and service menus.',
      expanded:
        'Folding styles include bi-fold (4pp), tri-fold (6pp), gate-fold, Z-fold, letter-fold, and accordion. For long documents we offer saddle-stitch (8–56pp), perfect binding (40–200+pp), PUR binding, and wire-O.',
    },
    whoNeedsThis: {
      title: 'Who Needs Brochures & Catalogs?',
      audiences: [
        'Real estate developers for off-plan project portfolios',
        'Manufacturers for SKU-heavy product catalogs',
        'Hospitals, clinics, and medical centers for service guides',
        'Universities for course prospectuses and student handbooks',
        'Tourism boards and hotels for destination guides',
        'Banks and insurers for product terms and disclosure documents',
      ],
    },
    keyInfo: {
      cost: 'Tri-fold A4 brochure on 150gsm silk = AED 4.8 each at 500 quantity. Perfect-bound 80pp A5 catalog on 128gsm = AED 18 each at 500 copies.',
      turnaround: 'Saddle-stitched brochures 3 days. Perfect-bound catalogs 5–7 working days.',
      minimumOrder: '25 pieces for digital short runs. 500 for offset pricing.',
      materials:
        '115gsm – 300gsm coated silk, gloss, or matte art paper; uncoated recycled (FSC), and tactile textured cover stock.',
    },
    advantages: [
      'Tri-fold, Z-fold, gate-fold, accordion, French folds',
      'Saddle stitch, perfect binding, PUR, wire-O, case binding',
      'Pantone spot colors + CMYK process',
      'Die-cut windows, pockets, and glued inserts',
      'Perforated order forms and tear-off response cards',
      'Foil and spot UV on cover',
      'French folds and center-fold maps',
    ],
    bestFor: [
      'Property developer off-plan portfolios',
      'Company profile / corporate capability statements',
      'School / university prospectuses',
      'Product SKU catalogs for distributors',
      'Service menus and spa price lists',
      'Expo and trade show take-aways',
    ],
    faqs: [
      {
        question: 'How many pages should my brochure be?',
        answer:
          'Saddle-stitched brochures must use multiples of 4 pages (4, 8, 12, 16, ...). Perfect binding starts at 28 inner pages. Start with your content depth.',
      },
      {
        question: 'Can you include a glued pocket?',
        answer:
          'Yes — A4 and A5 covers can include French-folder or turn-in pockets for USBs, price lists, or inserts. Allow extra 1 working day.',
      },
    ],
  },

  'flyers-printing-in-dubai': {
    whatIs: {
      title: 'Flyer, Poster & Leaflet Printing',
      definition:
        'Flyers and leaflets are single or double-sided promotional sheets in sizes A3, A4, A5, A6, or custom. Fast, cost-effective marketing for events, price lists, and promotional announcements.',
      expanded:
        'ONPRINT uses HP Indigo digital presses for short runs (50–1,000) and Heidelberg offset SM for long campaigns (1,000+). Materials: 115gsm–300gsm art paper. Finishing: matte/gloss cello, UV varnish, folded to DL.',
    },
    whoNeedsThis: {
      title: 'Who Needs Flyers & Posters?',
      audiences: [
        'Restaurants, cafés, and F&B for promotions',
        'Retail outlets for sale and clearance events',
        'Gyms, spas, and salons for membership drives',
        'Property agents for open house handouts',
        'Event organizers and conference committees',
        'Healthcare clinics for health screening campaigns',
      ],
    },
    keyInfo: {
      cost: '500 A5 flyers 130gsm gloss both sides = AED 295. 1,000 DL flyers 170gsm silk = AED 450.',
      turnaround: '24 hours for digital (press-ready file before 10 AM). Offset 3 working days.',
      minimumOrder: '25 pieces digital, 500 for offset tier.',
      materials: '115gsm, 130gsm, 150gsm, 170gsm, 200gsm, 250gsm, 300gsm coated art paper.',
    },
    advantages: [
      '24-hour express service',
      'A3 / A4 / A5 / A6 / DL / custom die-cut sizes',
      'Matte or glossy single/double celloglaze',
      'Spot UV or machine glossy varnish',
      'Perforated tear-off coupons',
      'Magnetic backed flyers',
      'Writeable uncoated stock',
    ],
    bestFor: [
      'Promotional sale announcements',
      'Grand opening & new branch launch',
      'Menu inserts and buffet promos',
      'Door-to-door distribution campaigns',
      'Expo and trade show handouts',
      'Classroom and student notice posters',
    ],
    faqs: [
      {
        question: 'What is the fastest turnaround for flyers?',
        answer:
          '24-hour express service for 130–200gsm A4/A5 press-ready PDFs (submitted before 10 AM). Add folding service for +1 day.',
      },
      {
        question: 'Can you distribute flyers?',
        answer:
          'ONPRINT can produce and package for distribution; for door-to-door or newspaper inserts, we can recommend our vetted distribution partners.',
      },
    ],
  },

  'letterheads-printing-dubai': {
    whatIs: {
      title: 'Letterheads & Corporate Stationery',
      definition:
        'Letterhead printing produces official A4 company-headed paper used for invoices, proposals, and official correspondence. Usually printed 1-color or spot-color on 100gsm–120gsm uncoated bond paper for inkjet/laser compatibility.',
      expanded:
        'Stationery bundles include letterheads (A4), compliment slips (210×99mm), envelopes (DL/C4/C5/C6), printed invoices, delivery notes, company stamps (rubber/self-inking/flash), NCR duplicate pads, and visiting cards.',
    },
    whoNeedsThis: {
      title: 'Who Needs Corporate Stationery?',
      audiences: [
        'New free zone companies during trade license setup',
        'Law firms and consulting agencies for official documents',
        'HR departments for offer letters, contracts, policies',
        'Accounts departments for invoices, POs, delivery notes',
        'Government departments and semi-government entities',
        'Clinics, hospitals, and medical centers',
      ],
    },
    keyInfo: {
      cost: '1,000 letterheads A4 100gsm bond 1c blue PMS = AED 395. Full stationery bundle (letterheads + envelopes + cards) = AED 1,650.',
      turnaround: '3 working days for standard letterheads. Complete bundle 5 working days.',
      minimumOrder: '100 sheets digital. 500 for offset pricing.',
      materials:
        '80gsm, 90gsm, 100gsm, 120gsm uncoated wood-free bond (Conqueror, Mondi, FSC certified, laser-safe guaranteed).',
    },
    advantages: [
      'Conqueror laid / wove premium paper options',
      'Pantone matched corporate colors',
      'NCR (no carbon required) duplicate / triplicate pads',
      'Self-inking and flash company stamps (MOIC registered size)',
      'DL / C4 / C5 / C6 envelopes with window or plain',
      'Compliment slips 210×99, 210×148, DL',
      'Continuous invoice sets (dot matrix compatible)',
    ],
    bestFor: [
      'Free zone company setup documentation',
      'Corporate rebranding stationery refresh',
      'Medical and dental clinic headed paper',
      'Law firm, auditor, and consultant correspondence',
      'Accounting / HR internal forms',
      'School and university headed paper',
    ],
    faqs: [
      {
        question: 'Is the paper laser & inkjet safe?',
        answer:
          'Yes — 100% laser-safe. We only use uncoated bond paper certified to run through office laser printers and inkjets without curling or jamming.',
      },
      {
        question: 'Can you create a complete stationery kit for new license?',
        answer:
          'Yes, the ONPRINT "New License Stationery Kit" includes letterheads, DL/C5 envelopes, stamp, 500 business cards, and 5 NCR invoice pads.',
      },
    ],
  },

  'lanyard-printing-dubai': {
    whatIs: {
      title: 'Lanyard & ID Card Printing',
      definition:
        'Lanyard printing produces woven, polyester satin, or tubular neck straps (15mm / 20mm / 25mm wide) with custom dye-sublimation or silk-screen branding. Often bundled with ID cards, badge reels, and PVC card holders.',
      expanded:
        'ONPRINT manufactures full-color dye-sublimation lanyards (no color count limits) and woven lanyards (premium stitched fabric look). Attachments: lobster claw, J-hook, metal crimp, safety breakaway, retractable badge reel, and detachable buckle.',
    },
    whoNeedsThis: {
      title: 'Who Needs Lanyards & ID?',
      audiences: [
        'Corporate offices, co-working spaces, and business centers',
        'Expos, conferences, and event organizers (VIP, Staff, Media, Press, Visitor)',
        'Schools, universities, and student housing',
        'Hospitals, clinics, and medical staff',
        'Government and public sector (military-grade holographic ID)',
        'Theme parks, attractions, and leisure venues',
      ],
    },
    keyInfo: {
      cost: 'Dye-sublimation 20mm polyester lanyard + PVC card = AED 11.50 each (MOQ 100). Woven lanyards start at AED 8.50 each (MOQ 500).',
      turnaround: '5 working days for dye-sublimation. 7 working days for woven.',
      minimumOrder: '25 pieces digital dye-sub. 500 for woven stock.',
      materials: 'Polyester satin (dye-sublimated), woven jacquard, tubular cotton, bamboo eco, flat nylon, PET recycled.',
    },
    advantages: [
      'Dye-sublimation: unlimited colors, no setup fees',
      'Woven: luxury thread-stitched, fade-resistant, reusable',
      'Safety breakaway buckle (medical / education mandatory)',
      'RFID/NFC chip integration for access control',
      'Silicone soft-touch PVC holders, acrylic or metal ID frames',
      'Badge reels, yo-yo clip attachments',
      'VVIP satin VIP wristbands bundled',
    ],
    bestFor: [
      'DWTC / ADNEC large conference staff kits',
      'School / university student IDs',
      'Corporate employee onboarding welcome pack',
      'Visitor and contractor day-pass badges',
      'Medical staff ID with holographic security seal',
      'Retail sales team uniforms and badges',
    ],
    faqs: [
      {
        question: 'What is the difference between woven and dye-sub?',
        answer:
          'Dye-sublimation prints ink onto polyester fabric (vibrant photos, gradients, complex logos, low MOQ). Woven uses colored threads stitched through the strap (luxury, washable, long-lasting, higher MOQ).',
      },
      {
        question: 'Can I add QR codes for contact tracing?',
        answer:
          'Yes — QR code or UVC PCR result can be printed on every lanyard + badge. Also supports NFC chip for contactless badge scanning.',
      },
    ],
  },

  'packaging-boxes': {
    whatIs: {
      title: 'Luxury Rigid & Corrugated Packaging Printing',
      definition:
        'Packaging printing produces structural boxes, cartons, mailers, and bags using paperboard (for folding cartons), gray-board (for rigid/magnetic boxes), and corrugated kraft (for shipping / ecommerce).',
      expanded:
        'Rigid boxes (setup boxes) use 1200gsm–1800gsm gray-board wrapped with 157gsm art paper. Folding cartons use 250gsm–400gsm SBS/GC1 food-grade board. Corrugated shipping boxes use B/C/E flute (3-ply or 5-ply double wall). Finishes: soft-touch, spot UV, embossing, gold foil.',
    },
    whoNeedsThis: {
      title: 'Who Needs Printed Packaging?',
      audiences: [
        'Luxury retail, perfume, and cosmetics brands',
        'Confectionery, bakeries, and gourmet food producers',
        'E-commerce / D2C subscription box startups',
        'Jewellery and watch boutiques',
        'Hotel & travel welcome amenities',
        'Real estate home handover key boxes',
      ],
    },
    keyInfo: {
      cost: 'Rigid magnetic closure box A4: AED 18 each (MOQ 500). Folding carton 350gsm GC1: AED 2.30 each (MOQ 1,000). Corrugated mailer: AED 3.20 each (MOQ 500).',
      turnaround: 'Folding cartons 7 working days, rigid boxes 10 working days, corrugated mailers 5 working days.',
      minimumOrder: 'Rigid boxes MOQ 200–500, folding cartons MOQ 500, corrugated 500.',
      materials:
        'Gray-chip rigid board, GC1/GC2 SBS, FBB, Kraft (brown/white), 3-ply / 5-ply corrugated, E/B/C flute, food-grade PE-coated.',
    },
    advantages: [
      'Magnetic closure (flap, lid-off, clamshell)',
      'Drawer-sliding sleeve box',
      'Gold / rose gold / holographic foil stamping',
      'Blind embossed brand mark',
      'Soft-touch velvet matte laminate',
      'Window patch (transparent PET)',
      'EVA / foam / velvet custom inserts',
    ],
    bestFor: [
      'Perfume & beauty launch kits',
      'Subscription box (D2C / e-commerce)',
      'Wedding invitation luxury presentation',
      'Jewellery & watch retail packaging',
      'Real estate property handover boxes',
      'Hotel guest amenity box',
    ],
    faqs: [
      {
        question: 'What\'s the difference between SBS, FBB, and gray-board?',
        answer:
          'SBS = Solid Bleached Sulfate (single side coated), food-safe, used for folding cartons. FBB = Folding Box Board (thicker, double-coated). Gray-board = rigid chipboard (luxury setup boxes).',
      },
      {
        question: 'Can you make custom insert trays?',
        answer:
          'Yes — EVA foam, velvet-wrapped foam, vacuum-formed plastic (PET), and die-cut cardboard inserts for product-specific holding trays.',
      },
    ],
  },
}

const emirateLocations = [
  { key: 'dubai', name: 'Dubai', city: 'Dubai', region: 'Dubai', deliveryDays: 1, salesTax: 'VAT 5%', mainAreas: ['Al Quoz', 'Business Bay', 'DIFC', 'Downtown Dubai', 'Dubai Marina', 'Jumeirah Lakes Towers', 'Mirdif', 'Jebel Ali Free Zone', 'Dubai Silicon Oasis'], hubFacility: 'Al Quoz Industrial 3 HQ', population: '3.8M+', localValue: 'UAE HQ city, free zones, financial hub' },
  { key: 'abu-dhabi', name: 'Abu Dhabi', city: 'Abu Dhabi', region: 'Abu Dhabi', deliveryDays: 1, salesTax: 'VAT 5%', mainAreas: ['Abu Dhabi City', 'Yas Island', 'Saadiyat', 'Khalifa City A/B/C', 'Al Reem Island', 'Maryah Island', 'Corniche Road', 'Muroor Road'], hubFacility: 'Abu Dhabi satellite workshop', population: '1.8M+', localValue: 'Capital, ADNOC, global energy HQ' },
  { key: 'sharjah', name: 'Sharjah', city: 'Sharjah', region: 'Sharjah', deliveryDays: 1, salesTax: 'VAT 5%', mainAreas: ['Sharjah Industrial 1-18', 'Al Nahda', 'Al Majaz', 'Al Qasimia', 'University City', 'Al Taawun', 'Al Khan', 'Muwailih'], hubFacility: 'Sharjah SAIF Zone partner', population: '1.7M+', localValue: 'Publishing, manufacturing hub' },
  { key: 'ajman', name: 'Ajman', city: 'Ajman', region: 'Ajman', deliveryDays: 1, salesTax: 'VAT 5%', mainAreas: ['Ajman Downtown', 'Al Nakheel', 'Al Nuaimiya 1,2,3', 'Al Jurf', 'Ajman Industrial', 'Mushairef', 'Rashidiya Towers', 'Ajman Free Zone (AFZA)'], hubFacility: 'AFZA partner', population: '550K+', localValue: 'AFZA free zone, light industry' },
  { key: 'ras-al-khaimah', name: 'Ras Al Khaimah', city: 'RAK City', region: 'Ras Al Khaimah', deliveryDays: 2, salesTax: 'VAT 5%', mainAreas: ['RAK City', 'Al Hamra Village', 'Al Marjan Island', 'Al Jazeera Al Hamra', 'RAK Maritime City', 'RAK Free Zone Authority (RAK FTZ)', 'Al Seer', 'Dahan'], hubFacility: 'RAK courier hub', population: '350K+', localValue: 'RAK FTZ, tourism, quarrying' },
  { key: 'fujairah', name: 'Fujairah', city: 'Fujairah City', region: 'Fujairah', deliveryDays: 2, salesTax: 'VAT 5%', mainAreas: ['Fujairah City', 'Khor Fakkan', 'Dibba Al Fujairah', 'Kalba', 'Al Aqah', 'Fujairah Port', 'Creative City', 'Fujairah Free Zone'], hubFacility: 'Fujairah Free Zone depot', population: '260K+', localValue: 'East coast, bunkering, tourism' },
  { key: 'umm-al-quwain', name: 'Umm Al Quwain', city: 'UAQ City', region: 'Umm Al Quwain', deliveryDays: 2, salesTax: 'VAT 5%', mainAreas: ['UAQ City', 'UAQ Marina', 'Al Raudah', 'Mugdhar', 'UAQ Free Trade Zone (FTZ)', 'Falaj Al Mualla', 'Al Madar', 'Aqua Park'], hubFacility: 'UAQ FTZ', population: '80K+', localValue: 'Smallest emirate, light manufacturing' },
  { key: 'al-ain', name: 'Al Ain', city: 'Al Ain', region: 'Abu Dhabi Eastern', deliveryDays: 2, salesTax: 'VAT 5%', mainAreas: ['Al Ain City Center', 'Jimi', 'Mutared', 'Muwaiji', 'Saniyat', 'Al Towwaya', 'Hili', 'Al Ain Industrial'], hubFacility: 'Al Ain depot', population: '850K+', localValue: 'Garden City, UAEU, heritage tourism' },
  { key: 'difc', name: 'DIFC', city: 'Dubai', region: 'Financial Hub', deliveryDays: 1, salesTax: 'VAT 0% on internal financial services', mainAreas: ['Gate Village', 'Emirates Financial Towers', 'Park Towers', 'Index Tower', 'Liberty House', 'Al Mas Tower', 'Central Park Towers', 'Gate District'], hubFacility: 'DIFC express courier desk', population: '40K+ professionals', localValue: 'Middle East financial nerve center' },
  { key: 'jafza', name: 'Jebel Ali Free Zone', city: 'Dubai JAFZA', region: 'Logistics Hub', deliveryDays: 1, salesTax: 'VAT 0% intra-FZ', mainAreas: ['JAFZA North', 'JAFZA South', 'JAFZA One', 'DP World Jebel Ali Port', 'JAFZA View', 'Downtown Jebel Ali', 'EZDubai', 'Techno Park'], hubFacility: 'JAFZA last-mile courier', population: '12,000+ companies', localValue: 'Largest free zone in the region' },
]

export const geoServedLocations = {}
for (const loc of emirateLocations) {
  geoServedLocations[loc.key] = {
    ...loc,
    headlines: [
      `ONPRINT serves ${loc.name} with 24–48 hour tracked courier delivery from our Al Quoz press.`,
      `Printing services specifically optimized for procurement managers, SMEs, and free-zone businesses in ${loc.name}.`,
      `${loc.name} is one of our top-${emirateLocations.indexOf(loc) + 1} priority delivery hubs in the UAE network.`,
    ],
    pickupInfo: loc.key === 'dubai'
      ? 'Clients may collect directly from our Al Quoz Industrial 3 facility (Sun-Thu 9AM-6PM). WhatsApp prior for ready collection slot.'
      : `Clients in ${loc.name} can book collections through our local courier desk. Free collection from ${loc.hubFacility}.`,
    recommendedSpecs: [
      'Business cards 350gsm matte 2-sided (most popular)',
      'A4 letterheads 100gsm Conqueror uncoated',
      'Rollup stands 80x200cm aluminum for reception/expo',
      'Rigid magnetic boxes 1200gsm for premium gifts',
    ],
    localFAQs: [
      { q: `What is the delivery time in ${loc.name}?`, a: `Most orders delivered within ${loc.deliveryDays} working day(s) after QC. Free-zone deliveries may require gate pass (handled by ONPRINT courier).` },
      { q: `Do you accept Arabic/RTL artwork for ${loc.name} clients?`, a: 'Yes — Arabic, Urdu, Hindi, Russian, Chinese, and bilingual design and typesetting supported in-house.' },
      { q: `Can ONPRINT tender to ${loc.name} government departments?`, a: 'Yes — VAT registered, e-Tasdeed & supply-chain ready. Provide tender number for our sales team.' },
    ],
  }
}

export const geoIndustryFocus = {
  'hotel-hospitality': {
    h1: 'Hospitality Printing: Menus, Key Cards, In-Room Folders & Guest Amenities',
    intro: 'Trusted by 5-star hotels in Downtown, Palm Jumeirah, and Yas Island. Waterproof synthetic menus, key-card sleeve holders, DND hangers, luggage tags, welcome cards, and in-room compendiums.',
    materials: ['400gsm synthetic polymer (waterproof menus)', '170gsm wood-free (breakfast inserts)', 'Rigid 1500gsm menu cover with foil', 'PVC CR80 key cards'],
    topLocations: ['Downtown Dubai', 'Palm Jumeirah', 'Yas Island', 'Saadiyat', 'Dubai Marina', 'Business Bay'],
    upsellBundle: 'The ONPRINT "Hotel Opening Starter Kit" includes 2,000 synthetic menus, 5,000 key cards, 500 in-room folders, 2,000 luggage tags, and 1,000 Do Not Disturb hangers.',
  },
  'real-estate': {
    h1: 'Real Estate Printing: Brochures, Floor Plans, Hoardings & Property Signage',
    intro: 'For Emaar, Nakheel, Aldar, and independent brokerages. Project brochures, 3D rendered floor plans on Foamex, site hoardings up to 3m high, for-sale signs, open house flyers, and presentation kits.',
    materials: ['250gsm matte silk perfect-bound booklet', '5mm Foamex mounted floor plans', '440gsm frontlit banner (hoarding)', '3mm acrylic door sign'],
    topLocations: ['Dubai Hills', 'Dubai Marina', 'Mohammed Bin Rashid City', 'Yas Island', 'Saadiyat', 'Reem Island'],
    upsellBundle: 'The "Off-Plan Launch Kit": 2,000 project brochures, 500 floor plan Foamex boards, 100 rollup stands, and 1 building hoarding panel (5m×3m).',
  },
  'fmcg-beauty': {
    h1: 'Beauty & FMCG Packaging: Boxes, Labels, Pouches & Hang Tags',
    intro: 'Folding cartons, labels, sachet mockups, and rigid gift boxes for beauty brands, perfumeries, supermarkets, and pharmacy chains. Food-grade materials, low MOQ options, Pantone-certified brand color.',
    materials: ['350gsm GC1 folding carton', '250gsm SBS with window patch', 'Synthetic PE sticker roll', '1200gsm rigid chipboard with soft-touch'],
    topLocations: ['JAFZA', 'Dubai Production City', 'Khalifa Industrial KIZAD', 'Riyadh', 'Doha', 'Manama'],
    upsellBundle: 'The "Beauty Launch Pack" = 3,000 product cartons, 10,000 roll labels, 500 rigid gift sets (magnetic), and 5,000 swing tags.',
  },
  'education-schools': {
    h1: 'Education Printing: Prospectuses, Uniforms, Certificates & Student Kits',
    intro: 'Prospectuses, branded uniforms, custom notebooks, certificates (with holographic gold seals), ID cards, lanyards, yearbooks, and event display backdrops for schools, universities, and nurseries.',
    materials: ['128gsm perfect-bound prospectus', 'Pique pique polo 220gsm (uniform)', '350gsm certificate with gold foil seal', 'PVC CR80 student ID + holographic overlay'],
    topLocations: ['Dubai Academic City', 'University City Sharjah', 'Al Ain UAEU', 'Khalifa University AD', 'Repton North Campus', 'DIA Emirates Hills'],
    upsellBundle: 'Back-to-School Bundle = 1,000 uniforms, 5,000 branded notebooks, 2,000 lanyard+ID sets, 1,000 certificates, and 25 pop-up banners.',
  },
  'restaurants-fb': {
    h1: 'Restaurant & F&B Printing: Menus, Takeaway Boxes, Paper Bags & Stickers',
    intro: 'Waterproof synthetic menus, food-grade burger/chicken boxes, paper bags with twisted handles, branded packaging stickers, coasters, and menu inserts for cafes, bakeries, QSRs, and fine-dining.',
    materials: ['TEVA-synthetic waterproof menu stock', '300gsm GC1 food-grade clamshell box', '120gsm brown kraft handle bag', '60micron food-safe sticker roll'],
    topLocations: ['JBR Walk', 'Sheikh Zayed Road', 'Al Wasl', 'City Walk', 'Jumeirah Beach Rd', 'Yas Mall'],
    upsellBundle: 'Grand Opening F&B Pack = 50 synthetic menus, 5,000 takeaway boxes, 10,000 paper bags, 20,000 logo stickers, and 2 menu boards (A1 acrylic).',
  },
  'construction-contracting': {
    h1: 'Construction Printing: Hoardings, Safety Posters, Signage & Project Boards',
    intro: 'Construction site hoardings, health and safety signs, permit boards, 3D renders on Sintra, building banners, hard-hat stickers, and project milestone display backdrops.',
    materials: ['440gsm frontlit banner hoarding', '3mm Sintra / Foamex safety sign', 'Perforated mesh 300gsm wind-resistant', 'Self-adhesive hi-vis vinyl sticker'],
    topLocations: ['Meydan', 'Dubai Creek Harbour', 'Mohammed Bin Rashid Al Maktoum City', 'Etihad Rail sites', 'Saadiyat Cultural District', 'Al Reem Island'],
    upsellBundle: 'Site-Mobilization Pack = 1 hoarding banner 3×30m, 50 H&S Sintra signs, 10 site-office rollups, 5 permit boards, and 100 hard hat stickers.',
  },
}

export const defaultFAQsPerLocation = [
  { q: 'Is delivery to my emirate free?', a: 'Free delivery on orders above AED 2,000 within Dubai. Other emirates: free above AED 3,500. Small orders incur a standard courier fee of AED 35–60 depending on emirate.' },
  { q: 'Do you have a local pickup point?', a: 'Pickup is welcome at our Al Quoz Industrial 3 HQ in Dubai. Local pickup depots in Abu Dhabi (Muroor Road), Sharjah (Industrial 5), and RAK (RAK FTZ) available on request.' },
  { q: 'Can you deliver to Free Zone companies?', a: 'Yes — we support DMCC, DIFC, JAFZA, DAFZA, AFZA, SAIF, RAK FTZ, Fujairah FTZ, and KIZAD. Gate passes organized on client letterhead where required.' },
  { q: 'What forms of payment are accepted?', a: 'Bank transfer (standard), Visa/Mastercard online, cash on pickup, and enterprise 30-day credit terms on approved accounts with trade license + PO.' },
]


export default serviceGeoContent
