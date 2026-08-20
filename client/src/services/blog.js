import api from './api'

export const defaultBlogPosts = [
  {
    _id: 'blog-1',
    id: 1,
    title: 'The Complete Guide to Commercial & Digital Printing Services in Dubai',
    slug: 'printing-services-dubai',
    category: 'Printing Guide',
    author: 'ONPRINT Studio',
    readTime: '7 min read',
    excerpt: 'Understand the critical differences between digital press and offset printing in Dubai, paper stock weights, color calibration, and how to prepare print-ready files.',
    featuredImage: '/assets/products/1 (7).jpg',
    imageAlt: 'Commercial digital and offset printing press in Dubai UAE',
    seoTitle: 'Commercial & Digital Printing Services in Dubai | Complete Guide | ONPRINT',
    seoDescription: 'Discover how commercial & digital printing works in Dubai. Learn about offset vs digital presses, Pantone matching, paper stocks, and pre-press artwork specs.',
    seoKeywords: 'printing services dubai, digital printing dubai, commercial printing dubai, printing company in dubai',
    canonicalUrl: 'https://0nprint.com/blog/printing-services-dubai',
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    content: `<h2>Understanding Commercial Printing in Dubai</h2>
<p>For modern businesses operating in Dubai's competitive corporate landscape, physical print collateral remains one of the strongest touchpoints for building brand authority. Whether distributing promotional brochures at the Dubai World Trade Centre or presenting proposals in bespoke executive folders, precision printing communicates excellence before a single word is read.</p>

<h3>Digital Press vs. Offset Printing: Which Fits Your Project?</h3>
<p>Selecting the right print technology depends primarily on quantity, turnaround urgency, and budget:</p>
<ul>
  <li><strong>Digital Printing:</strong> Best for short-to-medium runs (1 to 500 units), urgent same-day or 24-hour turnarounds, and variable data personalization. Modern digital presses in Dubai offer near-offset sharpness with zero setup plate costs.</li>
  <li><strong>Offset Printing:</strong> Ideal for high-volume commercial runs (1,000+ units), large corporate catalogs, packaging boxes, and projects requiring exact Pantone spot color fidelity. Offset offers lower per-unit costs at scale.</li>
</ul>

<h3>Paper Stocks and Tactile Finishes</h3>
<p>The tactile weight and texture of your paper immediately establish perceived value. Common executive stocks in Dubai include:</p>
<ul>
  <li><strong>350gsm Silk & Art Card:</strong> The industry standard for sturdy business cards, premium marketing flyers, and table tents.</li>
  <li><strong>120gsm Uncoated Laser Paper:</strong> Smooth, absorbent stationery stock optimized for corporate letterheads, contracts, and invoices.</li>
  <li><strong>FSC-Certified Textured & Kraft Stocks:</strong> Eco-conscious alternatives providing an organic, artisan aesthetic for luxury branding.</li>
</ul>

<h3>Key Pre-Flight File Requirements</h3>
<p>To avoid common print issues, ensure your design files follow these specifications:</p>
<ol>
  <li>Set the document color profile to <strong>CMYK (Fogra39 or US Web Coated)</strong> rather than RGB.</li>
  <li>Include at least <strong>3mm bleed</strong> on all edges with crop marks enabled.</li>
  <li>Maintain a minimum image resolution of <strong>300 DPI</strong> at 100% final output size.</li>
  <li>Convert all typography and font layers to outlines/curves before exporting as high-resolution PDF/X-1a.</li>
</ol>`,
  },
  {
    _id: 'blog-2',
    id: 2,
    title: 'Top Corporate Gift & Promotional Merchandise Ideas for Dubai Businesses',
    slug: 'corporate-gifts-dubai',
    category: 'Corporate Gifting',
    author: 'ONPRINT Studio',
    readTime: '6 min read',
    excerpt: 'A curated selection of high-impact corporate gifts and promotional giveaways in Dubai, from laser-engraved vacuum flasks to luxury leatherette notebooks.',
    featuredImage: '/assets/products/1 (1).jpg',
    imageAlt: 'Custom luxury corporate gifts and promotional merchandise in Dubai',
    seoTitle: 'Corporate Gifts Dubai | Promotional Gift Printing Ideas | ONPRINT',
    seoDescription: 'Explore the best corporate gift ideas in Dubai. Learn how custom branded mugs, thermal bottles, luxury notebooks, and apparel enhance brand loyalty across the UAE.',
    seoKeywords: 'corporate gifts dubai, promotional gifts dubai, corporate gift printing dubai, custom gifts dubai',
    canonicalUrl: 'https://0nprint.com/blog/corporate-gifts-dubai',
    publishedAt: new Date(Date.now() - 172800000).toISOString(),
    content: `<h2>The Power of Tangible Corporate Gifting in the UAE</h2>
<p>In the UAE business culture, corporate gifting is more than a marketing gesture — it is an integral relationship-building tradition. High-quality promotional gifts demonstrate appreciation, strengthen executive partnerships, and keep your brand top-of-mind throughout the year.</p>

<h3>Most Requested Corporate Gifts in Dubai</h3>
<p>Here are the highest-performing branded promotional items favored by Dubai enterprises:</p>
<ul>
  <li><strong>Smart Thermal Flasks & Drinkware:</strong> Double-wall insulated stainless steel bottles with LED temperature displays, laser-engraved with corporate branding. Highly practical and used daily across offices and commute.</li>
  <li><strong>Executive Leatherette Bound Notebooks:</strong> Hardcover A5 debossed journals featuring bookmark ribbons, elastic pen holders, and 80gsm cream writing paper.</li>
  <li><strong>Sublimation Ceramic Mugs:</strong> Dishwasher-safe 11oz and 15oz matte and gloss mugs printed with vibrant Pantone-accurate logos.</li>
  <li><strong>Custom Embroidered Apparel:</strong> Combed cotton polo shirts, crewneck tees, and 3D puff embroidered caps designed for team uniforms and trade exhibition booths.</li>
</ul>

<h3>Personalization & Luxury Branding Techniques</h3>
<p>Elevate your promotional items beyond standard printing using specialized finishing methods:</p>
<ul>
  <li><strong>Precision Laser Engraving:</strong> Permanent, clean etching on metal, wood, and leather items that will never fade or peel.</li>
  <li><strong>UV Spot Gloss & Metallic Foil Stamping:</strong> High-sheen detailing for presentation boxes and gift set sleeves.</li>
  <li><strong>3D Puff Embroidery:</strong> Adds depth and structure to branded headwear and executive jackets.</li>
</ul>

<h3>Planning Your Gifting Timeline</h3>
<p>For major corporate events, exhibitions at GITEX or Arab Health, and Ramadan or End-of-Year gifting, plan your custom print orders 2 to 3 weeks in advance to allow for proof approvals, sample testing, and bespoke packaging assembly.</p>`,
  },
  {
    _id: 'blog-3',
    id: 3,
    title: 'Luxury Business Card Printing in Dubai: Paper Stocks, Finishes & Specs',
    slug: 'business-card-design-printing',
    category: 'Business Stationery',
    author: 'ONPRINT Studio',
    readTime: '5 min read',
    excerpt: 'Everything you need to know about crafting executive business cards in Dubai: 350gsm to 600gsm cotton stocks, soft-touch matte lamination, spot UV, and gold foil stamping.',
    featuredImage: '/assets/products/1 (7).jpg',
    imageAlt: 'Luxury foil-stamped business cards printed in Dubai',
    seoTitle: 'Business Card Printing Dubai | Luxury Stocks & Foil Finishes | ONPRINT',
    seoDescription: 'Expert guide to premium business card printing in Dubai. Compare 350gsm silk, cotton cardstocks, gold foil embossing, and spot UV finishes for executive cards.',
    seoKeywords: 'business card printing dubai, luxury business cards dubai, custom business cards uae',
    canonicalUrl: 'https://0nprint.com/blog/business-card-design-printing',
    publishedAt: new Date(Date.now() - 259200000).toISOString(),
    content: `<h2>Making a Lasting Impression with Premium Business Cards</h2>
<p>Your business card is often the very first physical artifact a prospective client or investor holds. In executive meetings across DIFC, Downtown Dubai, and Abu Dhabi, a flimsy standard card is quickly discarded, while a substantial, textured card with refined finishing demands attention.</p>

<h3>Selecting the Right Cardstock Weight</h3>
<ul>
  <li><strong>350gsm Silk Card:</strong> The standard corporate benchmark offering crisp rigidness and smooth tactile handling.</li>
  <li><strong>400gsm – 450gsm Heavyweight Art Board:</strong> Substantial weight that resists bending in pockets and cardholders.</li>
  <li><strong>600gsm Cotton / Duplex Card:</strong> Ultra-thick luxury stock created by mounting two complementary paper boards together with optional colored edge painting.</li>
</ul>

<h3>Popular Specialty Finishes for Dubai Brands</h3>
<p>Modern print finishing transforms minimalist card designs into executive statements:</p>
<ul>
  <li><strong>Soft-Touch Velvet Lamination:</strong> Imparts a subtle suede-like texture that prevents fingerprint smudging and enhances grip.</li>
  <li><strong>Raised Spot UV Varnish:</strong> Creates high-gloss transparent dimensional highlights on logos, icons, or typography.</li>
  <li><strong>Hot Foil Stamping:</strong> Metallic gold, silver, rose gold, or copper foil pressed with heat and brass dies for undeniable elegance.</li>
  <li><strong>Blind Embossing & Debossing:</strong> Three-dimensional relief pressed into paper fibers without ink for subtle tactile branding.</li>
</ul>

<h3>Standard Card Dimensions in UAE</h3>
<p>The standard business card dimension across the UAE and GCC is <strong>90mm x 50mm</strong> (or 85mm x 55mm international format). Always include 3mm bleed around all sides (total artwork size 96mm x 56mm) with a 4mm inner safety margin for all typography.</p>`,
  },
  {
    _id: 'blog-4',
    id: 4,
    title: 'How to Choose the Best Commercial Printing Company in Dubai, UAE',
    slug: 'choosing-printing-company-dubai',
    category: 'Industry Insights',
    author: 'ONPRINT Studio',
    readTime: '6 min read',
    excerpt: '5 essential criteria for selecting a reliable printing partner in Dubai, including prepress verification, turnaround speeds, sample proofs, and local press capabilities.',
    featuredImage: '/assets/products/1 (9).jpg',
    imageAlt: 'Commercial printing facility and prepress studio in Dubai UAE',
    seoTitle: 'Choosing a Printing Company in Dubai | 5 Critical Checklist Points | ONPRINT',
    seoDescription: 'Looking for a printing partner in Dubai? Learn how to evaluate print quality, turnaround times, sample proofs, and equipment before placing your commercial order.',
    seoKeywords: 'printing company in dubai, printing company dubai, professional printing services dubai',
    canonicalUrl: 'https://0nprint.com/blog/choosing-printing-company-dubai',
    publishedAt: new Date(Date.now() - 345600000).toISOString(),
    content: `<h2>Why Your Printing Partner Matters</h2>
<p>Selecting a commercial printing company in Dubai directly impacts your brand reputation. A partner with inconsistent color calibration, delayed deliveries, or poor finishing can jeopardize major event launches and client presentations. Here are the 5 critical factors to evaluate before committing to a print vendor.</p>

<h3>1. Prepress File Inspection & Digital Proofing</h3>
<p>A professional printing facility does not simply press print on received files. They provide a thorough prepress review that checks:</p>
<ul>
  <li>CMYK color space conversion and total ink coverage limits</li>
  <li>Adequate bleed allowances and crop mark alignments</li>
  <li>Image resolution to prevent pixelated output</li>
  <li>Font rasterization and overprint settings</li>
</ul>

<h3>2. In-House Equipment & Press Capabilities</h3>
<p>Brokers who outsource every job often suffer from unexpected delays and zero direct quality control. Verify that your partner operates modern in-house equipment for digital presses, large-format roll-ups, UV printing, and die-cutting.</p>

<h3>3. Transparency in Paper Specs & Material Samples</h3>
<p>Ask to inspect tangible paper swatches and sample proofs. Reputable printers clearly state exact paper grammages (GSM), stock brands (e.g., Fedrigoni, Arctic Silk), and laminate grades upfront.</p>

<h3>4. Turnaround Reliability in Dubai</h3>
<p>Event deadlines in Dubai are non-negotiable. Ensure your printing partner offers confirmed production schedules, express same-day or 48-hour turnarounds for urgent collaterals, and tracked doorstep delivery across all Emirates.</p>

<h3>5. End-to-End Solutions Under One Roof</h3>
<p>From initial design review to printing, folding, binding, foil-stamping, and custom packaging, having a single partner manage the complete pipeline ensures seamless quality consistency across all brand assets.</p>`,
  },
]

const BLOG_STORAGE_KEY = 'onprint_admin_blog_posts'

export function getStoredBlogPosts() {
  try {
    const saved = localStorage.getItem(BLOG_STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch {
    // ignore
  }
  return defaultBlogPosts
}

export function saveStoredBlogPosts(posts) {
  try {
    localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(posts))
  } catch {
    // ignore
  }
}

export async function getBlogPosts(params = {}) {
  try {
    const { data } = await api.get('/blog', { params })
    if (data?.data && data.data.length > 0) return data.data
  } catch {
    // fallback
  }

  let list = getStoredBlogPosts()
  if (params.category && params.category !== 'All') {
    list = list.filter((p) => p.category.toLowerCase() === params.category.toLowerCase())
  }
  if (params.search || params.q) {
    const term = (params.search || params.q).toLowerCase()
    list = list.filter((p) => p.title.toLowerCase().includes(term) || p.excerpt.toLowerCase().includes(term))
  }
  return list
}

export async function getBlogPostBySlug(slug) {
  try {
    const { data } = await api.get(`/blog/${slug}`)
    if (data?.data) return data.data
  } catch {
    // fallback
  }

  const all = getStoredBlogPosts()
  const found = all.find((p) => p.slug === slug || String(p.id) === slug || p._id === slug)
  if (found) {
    const related = all.filter((p) => p.slug !== found.slug).slice(0, 3)
    return { ...found, related }
  }
  throw new Error('Blog article not found')
}

export async function createBlogPost(payload) {
  try {
    const { data } = await api.post('/blog', payload)
    return data
  } catch (err) {
    if (err.message === 'Network Error' || !err.response) {
      const all = getStoredBlogPosts()
      const newPost = {
        _id: `blog-${Date.now()}`,
        id: Date.now(),
        ...payload,
        publishedAt: new Date().toISOString(),
        active: true,
      }
      saveStoredBlogPosts([newPost, ...all])
      return { success: true, data: newPost }
    }
    throw err
  }
}

export async function updateBlogPost(id, payload) {
  try {
    const { data } = await api.put(`/blog/${id}`, payload)
    return data
  } catch (err) {
    if (err.message === 'Network Error' || !err.response) {
      const all = getStoredBlogPosts()
      const updated = all.map((p) => (String(p.id) === String(id) || p._id === id ? { ...p, ...payload } : p))
      saveStoredBlogPosts(updated)
      return { success: true, message: 'Article updated' }
    }
    throw err
  }
}

export async function deleteBlogPost(id) {
  try {
    const { data } = await api.delete(`/blog/${id}`)
    return data
  } catch (err) {
    if (err.message === 'Network Error' || !err.response) {
      const all = getStoredBlogPosts()
      const updated = all.filter((p) => String(p.id) !== String(id) && p._id !== id)
      saveStoredBlogPosts(updated)
      return { success: true, message: 'Article deleted' }
    }
    throw err
  }
}
