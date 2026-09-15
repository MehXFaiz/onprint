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
}

export default serviceGeoContent
