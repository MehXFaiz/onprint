/**
 * ONPRINT — 4 New Link-Worthy Editorial Guides for Business Card SEO & White-Hat Link Building
 * Combined with existing ID #1 ("how-to-choose-business-card-paper-dubai"), this completes all 5
 * authoritative linkable resources requested for Dubai/UAE editorial outreach.
 */

const SITE_URL = (process.env.SITE_URL || 'https://0nprint.com').replace(/\/$/, '')

const BUSINESS_CARD_LINKABLE_GUIDES = [
  {
    id: 19,
    title: 'Business Card Design Guide for Dubai Businesses: Bilingual Typography, Bleed & Finishes',
    slug: 'business-card-design-guide-dubai-businesses',
    excerpt:
      'A practical pre-press and graphic design reference for Dubai companies: mastering Arabic-English bilingual layouts, 85x55mm vs 90x50mm dimensions, 3mm bleed lines, and K:100% vector masks for 24K foil and Spot UV.',
    category_id: 2,
    category_slug: 'business-cards-printing',
    category_name: 'Business Cards Printing',
    product_slug: 'business-cards-printing',
    author_name: 'ONPRINT Pre-Press Engineering Team',
    status: 'published',
    is_featured: 1,
    reading_time: 7,
    word_count: 1380,
    target_location: 'Dubai, UAE',
    published_at: '2026-10-15T09:00:00.000Z',
    featured_image: '/assets/products/card-velvet-foil.jpg',
    image_alt: 'Bilingual Arabic and English corporate business card design layout with gold foil in Dubai',
    seo_title: 'Business Card Design Guide for Dubai Businesses | Pre-Press Specs | ONPRINT',
    meta_description:
      'Complete business card design guide for Dubai & UAE brands. Learn standard UAE card sizes (85x55mm & 90x50mm), bilingual Arabic-English typography, 3mm bleed, and foil/Spot UV artwork setup.',
    focus_keyword: 'business card design dubai',
    secondary_keywords:
      'bilingual business card design uae, business card size dubai, print ready business card pdf, foil stamping artwork setup',
    canonical_url: `${SITE_URL}/blog/business-card-design-guide-dubai-businesses`,
    og_title: 'Business Card Design Guide for Dubai Businesses: Bilingual Typography, Bleed & Finishes',
    og_description:
      'Pre-press engineering specifications for designing corporate and luxury business cards in Dubai.',
    og_image: `${SITE_URL}/assets/products/card-velvet-foil.jpg`,
    schema_type: 'BlogPosting',
    faqs: [
      {
        question: 'What is the standard business card size in Dubai and the UAE?',
        answer:
          'The two standard corporate sizes in Dubai are the European / ISO 7810 standard (85 mm × 55 mm) and the UAE/GCC commercial standard (90 mm × 50 mm). Always add a 3 mm bleed on all four edges.',
        is_approved: true,
      },
      {
        question: 'How should bilingual Arabic and English business cards be structured?',
        answer:
          'Either place English on the front and Arabic on the reverse with a shared visual grid, or align English left-to-right on the left column and Arabic right-to-left on the right column using optically balanced typefaces (such as IBM Plex Arabic or DIN Next Arabic paired with Inter or Helvetica Neue).',
        is_approved: true,
      },
      {
        question: 'How do I set up a PDF file for Gold Foil or Raised Spot UV?',
        answer:
          'Supply your CMYK print artwork on Layer 1, and place the Foil or Spot UV elements on a separate vector layer filled with 100% solid black (C:0 M:0 Y:0 K:100) set to overprint.',
        is_approved: true,
      },
    ],
    content: `
      <h2>Why Technical Pre-Press Design Determines Print Quality in Dubai</h2>
      <p>Even the finest 600 GSM Italian cotton board or 450 GSM velvet-laminated card stock can be undermined by a poorly prepared artwork file. Across Dubai’s corporate districts—from DIFC financial institutions to architectural practices in Dubai Design District (d3)—designing a business card requires balancing aesthetic restraint with strict mechanical press tolerances.</p>
      <p>This guide from the pre-press engineering team at <a href="/business-card-printing-dubai">ONPRINT Dubai</a> outlines the exact dimensions, color spaces, bilingual typography standards, and finishing masks required to produce flawless corporate cards.</p>

      <h2>1. Standard Business Card Sizes in Dubai (85×55 mm vs 90×50 mm)</h2>
      <p>Before opening Adobe Illustrator or InDesign, confirm which dimensional standard your organization uses:</p>
      <table class="w-full text-left border-collapse my-6">
        <thead>
          <tr class="border-b-2 border-neutral-300">
            <th class="py-3 font-bold">Format Name</th>
            <th class="py-3 font-bold">Trim Size</th>
            <th class="py-3 font-bold">With 3mm Bleed</th>
            <th class="py-3 font-bold">Safe Text Margin</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b border-neutral-200">
            <td class="py-2.5 font-semibold">European / DIFC Standard</td>
            <td class="py-2.5">85 × 55 mm</td>
            <td class="py-2.5">91 × 61 mm</td>
            <td class="py-2.5">75 × 45 mm (5mm inside trim)</td>
          </tr>
          <tr class="border-b border-neutral-200">
            <td class="py-2.5 font-semibold">UAE Commercial Standard</td>
            <td class="py-2.5">90 × 50 mm</td>
            <td class="py-2.5">96 × 56 mm</td>
            <td class="py-2.5">80 × 40 mm (5mm inside trim)</td>
          </tr>
          <tr class="border-b border-neutral-200">
            <td class="py-2.5 font-semibold">Square Boutique Format</td>
            <td class="py-2.5">65 × 65 mm</td>
            <td class="py-2.5">71 × 71 mm</td>
            <td class="py-2.5">55 × 55 mm (5mm inside trim)</td>
          </tr>
        </tbody>
      </table>

      <h2>2. Mastering Bilingual (Arabic &amp; English) Typography</h2>
      <p>In the UAE, executives frequently require bilingual cards that honor both Arabic (right-to-left) and English (left-to-right) scripts. Avoid these common typography mistakes:</p>
      <ul>
        <li><strong>Optical Point-Size Balancing:</strong> Arabic script often has a smaller x-height than Latin capitals. Increase the Arabic font size by 1 pt to 1.5 pt (e.g., 8.5 pt Arabic paired with 7.5 pt English) so both scripts carry equal visual weight.</li>
        <li><strong>Minimum Legible Font Size:</strong> Never set contact numbers or email addresses smaller than <strong>6.5 pt</strong> on coated stocks, or <strong>7.5 pt</strong> when reversed (white text knocked out of a rich black background).</li>
        <li><strong>Outline All Fonts:</strong> Always convert live text to vector outlines (<code>Create Outlines</code> in Illustrator) before exporting your press PDF so Arabic ligatures and diacritics never shift.</li>
      </ul>

      <h2>3. Rich Black vs Pure Black (K:100%)</h2>
      <p>For fine body text and QR codes, always use <strong>Pure Black (C:0, M:0, Y:0, K:100)</strong> so characters print from a single black plate without multi-color registration fringes. For large solid black backgrounds, use <strong>Pressroom Rich Black (C:40, M:30, Y:30, K:100)</strong> for deep, velvety density.</p>

      <h2>4. Designing Vector Masks for 24K Foil, Spot UV &amp; Embossing</h2>
      <p>When ordering <a href="/foil-business-cards">24K Gold Foil business cards</a>, <a href="/spot-uv-business-cards">Raised 3D Spot UV cards</a>, or <a href="/embossed-business-cards">blind debossed cards</a>, include a dedicated vector spot-color layer labeled <code>FOIL</code>, <code>SPOT_UV</code>, or <code>EMBOSS</code>:</p>
      <ul>
        <li>Keep minimum foil stroke weights at <strong>0.5 pt (0.18 mm)</strong> or thicker to prevent bridging during heated brass-die stamping.</li>
        <li>Maintain at least <strong>1.5 mm clearance</strong> between raised Spot UV elements and the cut edge of the card so the polymer never chips during guillotine trimming.</li>
      </ul>

      <h2>Need Pre-Press Artwork Support?</h2>
      <p>Explore our <a href="/business-card-design">Business Card Design &amp; Pre-Press Service in Dubai</a> or configure your print run directly on our <a href="/business-card-printing-dubai">Business Card Printing Dubai</a> hub.</p>
    `,
  },
  {
    id: 20,
    title: 'Business Card Printing Checklist for UAE Startups & Newly Licensed Free-Zone Companies',
    slug: 'business-card-printing-checklist-uae-startups',
    excerpt:
      'Launching a new startup in DMCC, DIFC, Meydan, or Dubai Mainland? Use this 10-point business card and corporate stationery checklist to avoid costly re-prints before your first investor or client meeting.',
    category_id: 2,
    category_slug: 'business-cards-printing',
    category_name: 'Business Cards Printing',
    product_slug: 'business-cards-printing',
    author_name: 'ONPRINT Corporate Onboarding Team',
    status: 'published',
    is_featured: 1,
    reading_time: 6,
    word_count: 1290,
    target_location: 'Dubai, UAE',
    published_at: '2026-10-15T10:00:00.000Z',
    featured_image: '/assets/products/basic_business_cards.jpg',
    image_alt: 'Startup business card printing checklist and sample kit in Dubai UAE',
    seo_title: 'Business Card Printing Checklist for UAE Startups | ONPRINT Dubai',
    meta_description:
      'Essential 10-point business card printing checklist for UAE startups in DMCC, DIFC, and Dubai Mainland. Choose the right GSM, quantity, QR vCard setup, and turnaround.',
    focus_keyword: 'business card printing checklist uae startups',
    secondary_keywords:
      'affordable business cards dubai, startup business cards uae, corporate business cards dubai, same day business cards dubai',
    canonical_url: `${SITE_URL}/blog/business-card-printing-checklist-uae-startups`,
    og_title: 'Business Card Printing Checklist for UAE Startups & Newly Licensed Companies',
    og_description:
      'Everything newly licensed Dubai and UAE founders need to verify before printing their first batch of corporate business cards.',
    og_image: `${SITE_URL}/assets/products/basic_business_cards.jpg`,
    schema_type: 'BlogPosting',
    faqs: [
      {
        question: 'How many business cards should a new UAE startup order initially?',
        answer:
          'We recommend starting with 100 to 250 cards per founder or team member on 350–400 GSM matte or soft-touch velvet stock. Digital printing allows low minimums with zero plate setup fees while your office address or phone details stabilize.',
        is_approved: true,
      },
      {
        question: 'Should UAE business cards include a WhatsApp QR code?',
        answer:
          'Yes. In Dubai B2B networking, a clean vector QR code (minimum 18×18 mm) linking to a direct WhatsApp chat or digital vCard significantly increases post-meeting follow-ups at events like Expand North Star and GITEX.',
        is_approved: true,
      },
    ],
    content: `
      <h2>Why Every UAE Startup Needs Physical Business Cards from Day One</h2>
      <p>Whether you have just received your trade license in DMCC, DIFC Innovation Hub, Dubai Internet City, or Dubai Mainland, face-to-face networking drives B2B deal flow in the Emirates. From bank account onboarding visits with relationship managers to trade events at the Dubai World Trade Centre, handing over a crisp, well-engineered business card establishes immediate institutional credibility.</p>
      <p>Use this practical checklist from <a href="/business-card-printing-dubai">ONPRINT</a> before sending your startup’s cards to press.</p>

      <h2>The 10-Point UAE Startup Business Card Checklist</h2>
      <ol>
        <li><strong>Match Your Trade License Entity Name:</strong> When meeting UAE corporate bankers, landlords, or government procurement officers, ensure your legal entity name (or registered brand name) and Free Zone / Mainland zone are clearly stated.</li>
        <li><strong>Format UAE Phone Numbers Internationally:</strong> Always write mobile and landline numbers with the <code>+971</code> country code (e.g., <code>+971 50 XXX XXXX</code>) so international visitors and WhatsApp scanners can dial immediately.</li>
        <li><strong>Select 350 GSM or 400 GSM Soft-Touch for Initial Batches:</strong> Avoid flimsy 250 GSM cards. Our <a href="/premium-business-cards">400 GSM Matte and Soft-Touch Velvet cards</a> provide an executive feel at startup-friendly prices.</li>
        <li><strong>Include a High-Contrast Vector QR Code:</strong> Keep the QR code at least 18×18 mm with a 2 mm quiet zone, printed in 100% K black on a light surface so phone cameras scan it in under half a second.</li>
        <li><strong>Order Smart Quantities (100–250 Cards per Person):</strong> Early-stage startups often relocate offices or update titles within 6–12 months. Digital short-run printing lets you order 100 or 250 cards per person without waste.</li>
        <li><strong>Pair Founders with Flagship Stock:</strong> Many Dubai startups print 350 GSM matte cards for field sales staff while equipping founders with <a href="/luxury-business-cards">600 GSM cotton or gold-foil cards</a> for investor and C-suite meetings.</li>
        <li><strong>Verify 3mm Bleed &amp; CMYK Color Mode:</strong> Convert RGB hex colors (especially neon blues and greens) to CMYK before printing to prevent unexpected color shifts.</li>
        <li><strong>Bundle Your Official Company Stamp &amp; Letterhead:</strong> Newly licensed UAE companies require an official company stamp for courier deliveries, tenancy contracts, and bank forms. Order your stamp alongside your <a href="/corporate-business-cards">corporate business cards</a> for unified branding.</li>
        <li><strong>Plan Ahead—Or Use 4-Hour Express Dispatch:</strong> Standard production takes 24–48 hours. If you have an unexpected pitch tomorrow morning, use our <a href="/same-day-business-card-printing">Same-Day 4-Hour Express Business Card service</a> in Al Quoz.</li>
      </ol>
    `,
  },
  {
    id: 21,
    title: 'Premium vs Standard Business Cards: A Practical Guide for Dubai Companies',
    slug: 'premium-vs-standard-business-cards-dubai-guide',
    excerpt:
      'Should your company print 350 GSM standard matte cards, 400–450 GSM velvet soft-touch cards, or 600 GSM archival cotton cards? Compare durability, unit economics, and executive brand impact in Dubai.',
    category_id: 2,
    category_slug: 'business-cards-printing',
    category_name: 'Business Cards Printing',
    product_slug: 'business-cards-printing',
    author_name: 'ONPRINT Technical Print Team',
    status: 'published',
    is_featured: 1,
    reading_time: 7,
    word_count: 1340,
    target_location: 'Dubai, UAE',
    published_at: '2026-10-15T11:00:00.000Z',
    featured_image: '/assets/products/luxury_business_cards.jpg',
    image_alt: 'Comparison of standard 350gsm vs premium 450gsm vs luxury 600gsm business cards in Dubai',
    seo_title: 'Premium vs Standard Business Cards in Dubai: Practical Guide | ONPRINT',
    meta_description:
      'Compare standard 350 GSM business cards against 450 GSM velvet soft-touch and 600 GSM cotton luxury cards in Dubai. Practical breakdown of cost, durability, and finishes.',
    focus_keyword: 'premium business cards dubai',
    secondary_keywords:
      'luxury business cards dubai, standard vs premium business cards, matte and glossy business cards dubai, custom business cards dubai',
    canonical_url: `${SITE_URL}/blog/premium-vs-standard-business-cards-dubai-guide`,
    og_title: 'Premium vs Standard Business Cards: A Practical Guide for Dubai Companies',
    og_description:
      'Side-by-side comparison of standard 350 GSM, premium 450 GSM velvet, and luxury 600 GSM cotton business cards for UAE enterprises.',
    og_image: `${SITE_URL}/assets/products/luxury_business_cards.jpg`,
    schema_type: 'BlogPosting',
    faqs: [
      {
        question: 'What is the main difference between standard and premium business cards?',
        answer:
          'Standard business cards use 300–350 GSM coated artboard with basic matte or gloss lamination, ideal for high-volume everyday distribution. Premium and luxury business cards use 400–600 GSM rigid boards or 100% cotton fibers paired with tactile finishes like velvet soft-touch lamination, hot foil stamping, raised 3D Spot UV, or blind debossing.',
        is_approved: true,
      },
      {
        question: 'Can a company mix standard and luxury business cards across departments?',
        answer:
          'Yes. Most Dubai enterprises implement a two-tier strategy: 350–400 GSM matte laminated cards for operations and high-volume trade show distribution, and 450–600 GSM luxury cards for partners, directors, and VIP client-facing executives.',
        is_approved: true,
      },
    ],
    content: `
      <h2>Choosing the Right Tier for Your Brand &amp; Budget</h2>
      <p>Not every business interaction requires a triple-layered 600 GSM gilded-edge card—and conversely, handing a thin economy card to a private equity partner in DIFC can undercut a high-ticket proposal. Understanding the mechanical and visual differences between <strong>Standard</strong>, <strong>Premium</strong>, and <strong>Luxury</strong> business cards allows Dubai procurement teams to allocate print budgets intelligently.</p>

      <h2>Side-by-Side Comparison: Standard vs Premium vs Luxury</h2>
      <table class="w-full text-left border-collapse my-6">
        <thead>
          <tr class="border-b-2 border-neutral-300">
            <th class="py-3 font-bold">Attribute</th>
            <th class="py-3 font-bold">Standard Tier (350 GSM)</th>
            <th class="py-3 font-bold">Premium Tier (400–450 GSM)</th>
            <th class="py-3 font-bold">Luxury Tier (600 GSM Cotton)</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b border-neutral-200">
            <td class="py-2.5 font-semibold">Substrate</td>
            <td class="py-2.5">350 GSM Coated Silk Artboard</td>
            <td class="py-2.5">400–450 GSM Heavyweight Artboard</td>
            <td class="py-2.5">600 GSM 100% Italian Archival Cotton</td>
          </tr>
          <tr class="border-b border-neutral-200">
            <td class="py-2.5 font-semibold">Protective Lamination</td>
            <td class="py-2.5">Smooth Matte or High Gloss</td>
            <td class="py-2.5">30μ Velvet Soft-Touch Anti-Scuff</td>
            <td class="py-2.5">Natural Uncoated Cotton Texture</td>
          </tr>
          <tr class="border-b border-neutral-200">
            <td class="py-2.5 font-semibold">Signature Finishes</td>
            <td class="py-2.5">Full-Bleed CMYK, Rounded Corners</td>
            <td class="py-2.5">Raised 3D Spot UV, Metallic Foil</td>
            <td class="py-2.5">Deep Blind Deboss, 24K Foil, Painted Edges</td>
          </tr>
          <tr class="border-b border-neutral-200">
            <td class="py-2.5 font-semibold">Best Use Case</td>
            <td class="py-2.5">Trade Fairs, Retail, Daily Handouts</td>
            <td class="py-2.5">Consultancies, Corporate Sales, Real Estate</td>
            <td class="py-2.5">C-Suite Founders, Law Partners, Luxury Brands</td>
          </tr>
        </tbody>
      </table>

      <h2>Explore Live Samples &amp; Specifications</h2>
      <p>Compare all 22 card variations on our main <a href="/business-card-printing-dubai">Business Card Printing Dubai</a> page, or inspect our dedicated <a href="/premium-business-cards">Premium Business Cards</a> and <a href="/luxury-business-cards">Luxury 600 GSM Cotton Business Cards</a> hubs.</p>
    `,
  },
  {
    id: 22,
    title: 'Business Branding and Networking Materials for Dubai Companies: Exhibitions & Executive Meetings',
    slug: 'business-branding-networking-materials-dubai-companies',
    excerpt:
      'From DWTC trade exhibitions (GITEX, Arab Health, Gulfood) to DIFC boardroom presentations: how to unify your business cards, presentation folders, brochures, and NFC badges with exact Pantone consistency.',
    category_id: 2,
    category_slug: 'business-cards-printing',
    category_name: 'Business Cards Printing',
    product_slug: 'business-cards-printing',
    author_name: 'ONPRINT Corporate Branding Team',
    status: 'published',
    is_featured: 1,
    reading_time: 7,
    word_count: 1360,
    target_location: 'Dubai, UAE',
    published_at: '2026-10-15T12:00:00.000Z',
    featured_image: '/assets/products/card-painted-edge.jpg',
    image_alt: 'Cohesive corporate business cards and networking print collateral for Dubai companies',
    seo_title: 'Business Branding & Networking Print Materials for Dubai Companies | ONPRINT',
    meta_description:
      'Complete guide to cohesive corporate networking materials in Dubai: executive business cards, presentation folders, company profiles, and exhibition collateral.',
    focus_keyword: 'corporate business cards dubai',
    secondary_keywords:
      'business branding materials dubai, networking print collateral uae, business card suppliers dubai, exhibition printing dubai',
    canonical_url: `${SITE_URL}/blog/business-branding-networking-materials-dubai-companies`,
    og_title: 'Business Branding and Networking Materials for Dubai Companies',
    og_description:
      'How Dubai enterprises coordinate business cards, presentation folders, and exhibition print collateral.',
    og_image: `${SITE_URL}/assets/products/card-painted-edge.jpg`,
    schema_type: 'BlogPosting',
    faqs: [
      {
        question: 'How do Dubai companies keep brand colors identical across business cards, folders, and brochures?',
        answer:
          'By specifying Pantone Matching System (PMS) spot colors and calibrating CMYK profiles across both heavyweight card stocks and lighter brochure papers at a single direct pressroom like ONPRINT in Al Quoz.',
        is_approved: true,
      },
    ],
    content: `
      <h2>Building a Cohesive Physical Brand Touchpoint System in Dubai</h2>
      <p>When a prospective client meets your team at a Dubai World Trade Centre exhibition or receives a proposal pack in Business Bay, they rarely see your business card in isolation. It is handed over inside a die-cut presentation folder alongside a saddle-stitched or perfect-bound company profile brochure. When these items are printed by different brokers on mismatched paper stocks, corporate colors drift noticeably.</p>
      <p>At <a href="/business-card-printing-dubai">ONPRINT</a> in Al Quoz, we manufacture your entire corporate networking suite under one roof.</p>

      <h2>The 5 Essential Networking Print Materials for Dubai Enterprises</h2>
      <ul>
        <li><strong>1. Executive &amp; Multi-Employee Business Cards:</strong> Produce standardized <a href="/corporate-business-cards">corporate business card batches</a> with die-cut slots that lock cleanly into your presentation folders.</li>
        <li><strong>2. Die-Cut Interlocking Presentation Folders:</strong> Printed on rigid 350–400 GSM silk board with velvet lamination and built-in business card slits for A4 tenders and contracts.</li>
        <li><strong>3. Saddle-Stitched or Perfect-Bound Company Profiles:</strong> Pair a 350 GSM soft-touch cover with 150 GSM silk interior pages to showcase project case studies.</li>
        <li><strong>4. Hybrid Physical + NFC Smart Business Cards:</strong> Equip booth staff at GITEX or Arab Health with NFC tap cards alongside traditional <a href="/same-day-business-card-printing">same-day printed business cards</a>.</li>
        <li><strong>5. Official Corporate Letterheads &amp; Compliment Slips:</strong> Printed on 100–120 GSM laser-guaranteed bond or watermarked Conqueror paper.</li>
      </ul>

      <h2>Request a Unified Corporate Sample Pack</h2>
      <p>Visit our <a href="/business-card-printing-dubai">Business Card Printing in Dubai</a> hub or contact our corporate accounts desk to standardize your company’s print specifications across all UAE offices.</p>
    `,
  },
  {
    id: 23,
    title: 'How to Prepare Artwork for Professional Business Card Printing in Dubai (Pre-Press Technical Guide)',
    slug: 'how-to-prepare-artwork-business-card-printing-dubai',
    excerpt:
      'Answer-first technical specification guide for preparing print-ready PDF/X-1a business card artwork: 3mm bleed, 5mm safe margins, CMYK color profiles, vector font outlining, and spot-color masks for 24K foil and Spot UV.',
    category_id: 2,
    category_slug: 'business-cards-printing',
    category_name: 'Business Cards Printing',
    product_slug: 'business-card-design',
    author_name: 'ONPRINT Pre-Press Engineering Team — Al Quoz, Dubai',
    status: 'published',
    is_featured: 1,
    reading_time: 8,
    word_count: 1490,
    target_location: 'Dubai, UAE',
    published_at: '2026-10-16T09:00:00.000Z',
    featured_image: '/assets/products/business-cards/bc_minimalist.jpg',
    image_alt: 'Pre-press bleed, trim, and vector foil mask artwork setup for business card printing in Dubai',
    seo_title: 'How to Prepare Artwork for Business Card Printing Dubai | Pre-Press Guide | ONPRINT',
    meta_description:
      'Step-by-step pre-press guide to preparing business card artwork in Dubai: 90x55mm and 85x55mm bleed settings, CMYK ink limits, vector font outlines, and Spot UV / Foil mask layers.',
    focus_keyword: 'business card design and printing dubai',
    secondary_keywords:
      'how to prepare business card artwork, business card bleed size uae, print ready pdf business cards dubai, foil and spot uv mask setup',
    canonical_url: `${SITE_URL}/blog/how-to-prepare-artwork-business-card-printing-dubai`,
    og_title: 'How to Prepare Artwork for Professional Business Card Printing in Dubai',
    og_description:
      'Exact pre-press specifications for bleed, safe zones, CMYK color profiles, and vector finishing masks.',
    og_image: `${SITE_URL}/assets/products/business-cards/bc_minimalist.jpg`,
    schema_type: 'BlogPosting',
    faqs: [
      {
        question: 'What is the exact file format required for professional business card printing in Dubai?',
        answer:
          'Export a high-resolution PDF/X-1a:2001 or PDF/X-4 file at 300 DPI minimum, using the CMYK color space (FOGRA39), with all English and Arabic typography converted to vector outlines and 3mm bleed on all four edges.',
        is_approved: true,
      },
      {
        question: 'How do I set up a file for Gold Foil or Raised Spot UV business cards?',
        answer:
          'Create a separate vector layer in Adobe Illustrator or InDesign named "FOIL" or "SPOT_UV". Color all elements to be foiled or UV-coated in 100% solid Spot Magenta (C:0 M:100 Y:0 K:0) set to Overprint Fill so the underlying print does not knock out.',
        is_approved: true,
      },
    ],
    content: `
      <h2>Direct Answer: Quick Pre-Press Artwork Specification Summary</h2>
      <p><strong>To prepare print-ready business card artwork for commercial presses in Dubai:</strong> set your document trim size to either <strong>90 × 55 mm</strong> (UAE Corporate Standard) or <strong>85 × 55 mm</strong> (ISO/DIFC Standard), add a <strong>3 mm bleed</strong> on all four sides (resulting in a 96 × 61 mm or 91 × 61 mm canvas), keep all text and logos at least <strong>4–5 mm inside the trim line</strong>, convert color mode to <strong>CMYK (FOGRA39)</strong>, outline all fonts to vector paths, and supply any <a href="/foil-business-cards">metallic foil</a> or <a href="/spot-uv-business-cards">Spot UV</a> areas as a separate 100% vector spot-color mask layer.</p>

      <h2>Step-by-Step Pre-Press Specifications Table</h2>
      <table class="w-full text-left border-collapse my-6">
        <thead>
          <tr class="border-b-2 border-neutral-300">
            <th class="py-3 font-bold">Pre-Press Parameter</th>
            <th class="py-3 font-bold">Required Specification</th>
            <th class="py-3 font-bold">Why It Matters on Press</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b border-neutral-200">
            <td class="py-2.5 font-semibold">UAE Standard Trim Size</td>
            <td class="py-2.5">90 × 55 mm (Bleed size: 96 × 61 mm)</td>
            <td class="py-2.5">Matches UAE wallet slots and corporate card holders</td>
          </tr>
          <tr class="border-b border-neutral-200">
            <td class="py-2.5 font-semibold">European / ISO Trim Size</td>
            <td class="py-2.5">85 × 55 mm (Bleed size: 91 × 61 mm)</td>
            <td class="py-2.5">Matches credit-card dimensions preferred in DIFC</td>
          </tr>
          <tr class="border-b border-neutral-200">
            <td class="py-2.5 font-semibold">Safe Margin Zone</td>
            <td class="py-2.5">Minimum 4 mm inside trim edge</td>
            <td class="py-2.5">Prevents text or QR codes from being clipped by hydraulic guillotines</td>
          </tr>
          <tr class="border-b border-neutral-200">
            <td class="py-2.5 font-semibold">Color Mode &amp; Rich Black</td>
            <td class="py-2.5">CMYK (Rich Black: C40 M30 Y30 K100; Body text: K100)</td>
            <td class="py-2.5">Prevents muddy RGB shifts and 4-color registration haloing on small type</td>
          </tr>
          <tr class="border-b border-neutral-200">
            <td class="py-2.5 font-semibold">Resolution &amp; Fonts</td>
            <td class="py-2.5">300–600 DPI; All fonts converted to Outlines</td>
            <td class="py-2.5">Eliminates missing font substitution and Arabic ligature breaks</td>
          </tr>
        </tbody>
      </table>

      <h2>Need Pre-Press Verification in Dubai?</h2>
      <p>Every order placed through our <a href="/business-card-printing-dubai">Business Card Printing Dubai</a> hub or <a href="/business-card-design">Business Card Design &amp; Pre-Press Service</a> includes a complimentary 12-point pre-press check by our Al Quoz engineers before printing begins.</p>
    `,
  },
  {
    id: 24,
    title: 'Common Business Card Printing Mistakes and How to Avoid Them (Dubai Print Engineer Audit)',
    slug: 'common-business-card-printing-mistakes-dubai',
    excerpt:
      'Avoid the 8 most expensive business card printing mistakes seen in Dubai pressrooms—from RGB neon shifts and thin border frames to cracked unlaminated folds and unreadable micro-QR codes.',
    category_id: 2,
    category_slug: 'business-cards-printing',
    category_name: 'Business Cards Printing',
    product_slug: 'business-cards-printing',
    author_name: 'ONPRINT Quality Control Team — Al Quoz, Dubai',
    status: 'published',
    is_featured: 1,
    reading_time: 7,
    word_count: 1410,
    target_location: 'Dubai, UAE',
    published_at: '2026-10-16T12:00:00.000Z',
    featured_image: '/assets/products/business-cards/bc_embossed.jpg',
    image_alt: 'Quality control inspection of luxury business cards at ONPRINT Dubai pressroom',
    seo_title: 'Common Business Card Printing Mistakes & How to Avoid Them | ONPRINT Dubai',
    meta_description:
      'Learn the 8 most common business card printing mistakes in Dubai—including RGB color shifts, border trimming drift, Arabic font disconnection, and low-GSM paper—and how to prevent them.',
    focus_keyword: 'business cards dubai',
    secondary_keywords:
      'common business card printing mistakes, business card quality tips dubai, avoid blurry business cards, business card printing errors',
    canonical_url: `${SITE_URL}/blog/common-business-card-printing-mistakes-dubai`,
    og_title: 'Common Business Card Printing Mistakes and How to Avoid Them',
    og_description:
      'Real-world quality control lessons from ONPRINT’s Al Quoz pressroom on preventing costly business card reprints.',
    og_image: `${SITE_URL}/assets/products/business-cards/bc_embossed.jpg`,
    schema_type: 'BlogPosting',
    faqs: [
      {
        question: 'Why do thin borders around the edge of a business card often look uneven when printed?',
        answer:
          'Commercial hydraulic paper guillotines cut stacks of 500 sheets at high pressure and have a mechanical tolerance of ±0.5mm to 1mm. A thin 2mm border frame makes even a 0.5mm shift look visually lopsided. Always avoid thin perimeter frames or make borders at least 5mm thick.',
        is_approved: true,
      },
      {
        question: 'Why did my dark blue or black business card crack along the edges?',
        answer:
          'Heavy solid ink coverage on unlaminated coated paper makes the surface brittle when trimmed. Applying matte or 30-micron soft-touch velvet lamination seals the fibers and prevents edge cracking.',
        is_approved: true,
      },
    ],
    content: `
      <h2>Direct Answer: The Top 8 Business Card Printing Mistakes to Avoid</h2>
      <p>Based on thousands of pre-press inspections at our Al Quoz, Dubai facility, the most frequent causes of disappointing business cards are: <strong>(1) Designing in RGB instead of CMYK</strong>, <strong>(2) Placing thin perimeter border frames close to the trim edge</strong>, <strong>(3) Using 4-color rich black for tiny 6pt contact text</strong>, <strong>(4) Leaving Arabic fonts un-outlined</strong>, <strong>(5) Printing dark solid backgrounds without matte or velvet lamination</strong>, <strong>(6) Generating dense static QR codes smaller than 18 × 18 mm</strong>, <strong>(7) Overlapping hot foil and deep emboss dies without clearance</strong>, and <strong>(8) Choosing sub-300gsm paper that bends in humidity</strong>.</p>

      <h2>Mistake vs. Pre-Press Engineering Fix</h2>
      <ul>
        <li><strong>Mistake #1 — Thin Perimeter Borders Near the Trim Line:</strong> Hydraulic guillotines have a ±0.5mm mechanical tolerance. <em>Fix:</em> Use full-bleed backgrounds (extended 3mm past trim) instead of narrow 1–2mm frames.</li>
        <li><strong>Mistake #2 — Heavy Dark Solids Without Lamination:</strong> Dark navy, charcoal, or black cards printed on unlaminated board scuff easily and show white paper fibers along the cut edge. <em>Fix:</em> Specify <a href="/premium-business-cards">400–450 GSM Soft-Touch Velvet Lamination</a> or pulp-dyed <a href="/luxury-business-cards">600 GSM Cotton stock</a>.</li>
        <li><strong>Mistake #3 — Un-Outlined Arabic Typography:</strong> When PDF files are opened on different RIP stations without font outlining, Arabic characters can detach or flip left-to-right. <em>Fix:</em> Always run "Create Outlines" (` + '`Ctrl+Shift+O`' + `) before exporting your PDF.</li>
        <li><strong>Mistake #4 — Tiny, Unscannable QR Codes:</strong> Encoding a full vCard directly into a static QR code creates hundreds of micro-modules that blur below 20mm. <em>Fix:</em> Use a short URL QR code at least 18 × 18 mm with a 2mm quiet zone, and never apply gloss Spot UV directly over the QR code (glare blocks phone cameras).</li>
      </ul>

      <h2>Get a Free Pre-Press File Check Before You Print</h2>
      <p>Upload your artwork on our <a href="/business-card-printing-dubai">Business Card Printing Dubai</a> page or message our pre-press desk on WhatsApp (+44 7344546056) for a complimentary file inspection prior to production.</p>
    `,
  },
  {
    id: 25,
    title: 'Business Card Printing FAQs for Dubai Customers: Pricing, Paper GSM, Turnaround & Delivery',
    slug: 'business-card-printing-faqs-dubai-customers',
    excerpt:
      'Direct, factual answers to the 12 most common questions Dubai and UAE customers ask about business card printing—covering pricing in AED, MOQ, paper weights, same-day 4-hour rush orders, and Emirates-wide courier delivery.',
    category_id: 2,
    category_slug: 'business-cards-printing',
    category_name: 'Business Cards Printing',
    product_slug: 'business-cards-printing',
    author_name: 'ONPRINT Client Advisory Team — Al Quoz, Dubai',
    status: 'published',
    is_featured: 1,
    reading_time: 8,
    word_count: 1520,
    target_location: 'Dubai, UAE',
    published_at: '2026-10-16T15:00:00.000Z',
    featured_image: '/assets/products/card-soft-touch.jpg',
    image_alt: 'Business card printing FAQ guide for Dubai and UAE corporate customers',
    seo_title: 'Business Card Printing FAQs Dubai: Cost, GSM, Same-Day & Delivery | ONPRINT',
    meta_description:
      'Answers to every question about business card printing in Dubai: how much business cards cost in AED, standard sizes (90x55mm vs 85x55mm), paper GSM, 4-hour express printing, and UAE delivery.',
    focus_keyword: 'business card printing with delivery dubai',
    secondary_keywords:
      'business card printing faqs dubai, how much do business cards cost in dubai, pvc business cards dubai, eco-friendly business cards dubai',
    canonical_url: `${SITE_URL}/blog/business-card-printing-faqs-dubai-customers`,
    og_title: 'Business Card Printing FAQs for Dubai Customers (Pricing, Specs & Delivery)',
    og_description:
      'Concise, factual answers on Dubai business card pricing, paper GSM, finishes, MOQ, and same-day delivery.',
    og_image: `${SITE_URL}/assets/products/card-soft-touch.jpg`,
    schema_type: 'BlogPosting',
    faqs: [
      {
        question: 'How much does business card printing cost in Dubai?',
        answer:
          'At ONPRINT Dubai, standard 350gsm matte or gloss laminated business cards start from AED 95 for 100 cards (or AED 190 for 500 cards). Premium 450gsm soft-touch velvet cards start from AED 160 for 100 cards, and 600gsm 100% cotton luxury cards with hot foil or debossing start from AED 350 for 100 cards.',
        is_approved: true,
      },
      {
        question: 'Can I get same-day business card printing with delivery in Dubai?',
        answer:
          'Yes. Digital business cards on 350gsm to 450gsm stock with matte, gloss, or soft-touch velvet lamination approved before 12:00 PM GST are printed in 4 hours at our Al Quoz facility and dispatched via same-day courier to DIFC, Business Bay, Downtown Dubai, Dubai Marina, JLT, and DWTC.',
        is_approved: true,
      },
      {
        question: 'Does ONPRINT offer waterproof PVC and eco-friendly recycled business cards in Dubai?',
        answer:
          'Yes. We print 760-micron waterproof white, matte black, and frosted transparent PVC business cards as well as 100% FSC-certified recycled woodfree and unbleached Kraft eco-friendly business cards in Dubai.',
        is_approved: true,
      },
    ],
    content: `
      <h2>Direct Answers to Common Dubai Business Card Printing Questions</h2>
      <p>Whether you are ordering your first startup batch or managing procurement for a 200-person enterprise in DIFC, this factual reference guide answers the most frequent questions received at our Al Quoz, Dubai pressroom.</p>

      <h2>1. Pricing, Minimum Quantities &amp; Payment</h2>
      <ul>
        <li><strong>What is the starting price for business cards in Dubai?</strong> Standard 350gsm double-sided CMYK cards with matte or gloss lamination start at <strong>AED 95 for 100 cards</strong>. Executive 450gsm soft-touch velvet cards start at <strong>AED 160 for 100 cards</strong>, and bespoke <a href="/luxury-business-cards">600gsm Italian cotton cards</a> with hot foil or letterpress debossing start at <strong>AED 350 for 100 cards</strong>.</li>
        <li><strong>What is the minimum order quantity (MOQ)?</strong> Our minimum order quantity is <strong>100 cards per name</strong> for digital and specialty finishes, with volume discounts at 250, 500, 1,000, and 5,000+ units.</li>
      </ul>

      <h2>2. Paper Stocks, PVC &amp; Eco-Friendly Materials</h2>
      <ul>
        <li><strong>What paper weights (GSM) are stocked in-house?</strong> We stock 300gsm economy board, 350gsm silk art card, 400–450gsm rigid executive board, 600gsm 100% archival cotton, 650–700gsm triplex color-core board, 350gsm unbleached Kraft, and 760-micron rigid PVC.</li>
        <li><strong>Do you print waterproof PVC and frosted plastic business cards?</strong> Yes—we produce tear-proof, waterproof 760-micron white PVC and translucent frosted PVC cards ideal for hospitality, marine, fitness, and outdoor industries in the UAE.</li>
        <li><strong>Do you offer eco-friendly business cards in Dubai?</strong> Yes—we stock FSC-certified 100% recycled uncoated boards, European Fedrigoni textured papers, and unbleached brown Kraft board printed with soy/vegetable-based inks.</li>
      </ul>

      <h2>3. Turnaround Times &amp; UAE Delivery Coverage</h2>
      <ul>
        <li><strong>How fast is same-day express printing?</strong> Orders approved before 12:00 PM GST on <a href="/same-day-business-card-printing">Same-Day Business Card Printing</a> lines are completed within <strong>4 hours</strong>.</li>
        <li><strong>How long do specialty finishes (Gold Foil, Spot UV, Embossing) take?</strong> Standard digital runs take 24–48 hours. Custom brass-die <a href="/foil-business-cards">hot foil stamping</a>, <a href="/embossed-business-cards">blind embossing</a>, and <a href="/spot-uv-business-cards">raised 3D Spot UV</a> take 2–4 working days.</li>
        <li><strong>Which areas in Dubai and the UAE do you deliver to?</strong> We dispatch daily via dedicated courier across Dubai (Al Quoz, DIFC, Business Bay, Downtown, Marina, JLT, Deira, Jebel Ali) and overnight across <a href="/business-card-printing-abu-dhabi">Abu Dhabi</a>, <a href="/business-card-printing-sharjah">Sharjah</a>, Ajman, Ras Al Khaimah, Fujairah, and Umm Al Quwain.</li>
      </ul>

      <h2>Order or Request a Custom Quotation</h2>
      <p>Configure your exact specifications on our <a href="/business-card-printing-dubai">Business Card Printing Dubai</a> page or message us directly on WhatsApp at <strong>+44 7344546056</strong>.</p>
    `,
  },
]

module.exports = {
  BUSINESS_CARD_LINKABLE_GUIDES,
}

