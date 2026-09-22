import { useState, useMemo } from 'react'
import {
  Network,
  Search,
  ExternalLink,
  ChevronDown,
  Sparkles,
  Link2,
  FileText,
  Target,
  Copy,
  Check,
  RefreshCw,
  Layers,
  ArrowRight,
  BookOpen,
} from 'lucide-react'
import Button from '../../../components/Button'
import { generateContentBrief } from '../../../services/seo'

export const TOPICAL_CLUSTERS = [
  {
    id: 'cluster-a',
    letter: 'A',
    name: 'Luxury & Corporate Business Cards',
    focus_entity: 'Corporate Business Card Printing Press Dubai',
    target_url: '/business-card-printing-dubai',
    search_intent: 'Commercial',
    primary_keywords: [
      'business card printing dubai',
      'luxury business cards dubai',
      'gold foil business cards',
      'cotton business cards 600gsm',
      'same day business card printing dubai',
    ],
    subtopics: [
      'Business Card Paper Weight Guide: 350gsm vs 450gsm vs 600gsm',
      'Luxury Finishes: Hot Foil Stamping, Spot UV, and Painted Edges',
      'Corporate Stationery Ordering: Bulk Employee Cards in DIFC',
      'Standard UAE Business Card Dimensions (85x55mm & 90x50mm)',
    ],
    internal_links: [
      { text: 'Corporate Stationery Dubai', url: '/corporate-printing-dubai' },
      { text: 'Get an Instant Business Card Quote', url: '/get-a-quote' },
      { text: 'Paper Finishes Guide', url: '/blog' },
    ],
  },
  {
    id: 'cluster-b',
    letter: 'B',
    name: 'Rigid Boxes & Custom Luxury Packaging',
    focus_entity: 'Custom Luxury Packaging Manufacturer Dubai',
    target_url: '/packaging-printing-dubai',
    search_intent: 'Commercial',
    primary_keywords: [
      'custom packaging dubai',
      'rigid box manufacturer dubai',
      'luxury perfume boxes uae',
      'magnetic gift box printing',
      'custom printed folding cartons',
    ],
    subtopics: [
      'Rigid Box Caliper Ratings: 1000gsm to 2000gsm Board Selection',
      'Custom EVA Foam and Velvet Tray Inserts for Fragrance & Jewelry',
      'Eco-Friendly FSC-Certified Corrugated Mailer Boxes',
      'Die-Line Creation & Structural Prototyping in Al Quoz',
    ],
    internal_links: [
      { text: 'Custom Retail Packaging', url: '/custom-packaging-dubai' },
      { text: 'Product Labels & Stickers', url: '/sticker-printing-dubai' },
      { text: 'Request Packaging Prototype Kit', url: '/get-a-quote' },
    ],
  },
  {
    id: 'cluster-c',
    letter: 'C',
    name: 'Custom Stickers & Die-Cut Product Labels',
    focus_entity: 'Industrial Label & Sticker Printing Dubai',
    target_url: '/sticker-printing-dubai',
    search_intent: 'Commercial',
    primary_keywords: [
      'sticker printing dubai',
      'custom product labels uae',
      'waterproof vinyl stickers dubai',
      'die cut sticker printing',
      'roll labels for cosmetics & bottles',
    ],
    subtopics: [
      'Waterproof BOPP Vinyl vs Paper Labels: Adhesives Guide',
      'Custom Die-Cut Shapes and Kiss-Cut Sticker Sheets',
      'Cosmetics & Jar Labels: Oil-Resistant and Freezer-Grade',
      'Metallic Foil Labels on Rolls for Automated Applicators',
    ],
    internal_links: [
      { text: 'All Packaging Solutions', url: '/packaging-printing-dubai' },
      { text: 'Order Sample Swatches', url: '/get-a-quote' },
    ],
  },
  {
    id: 'cluster-d',
    letter: 'D',
    name: 'Marketing Brochures, Profiles & Catalogs',
    focus_entity: 'Commercial Brochure & Catalog Printing Dubai',
    target_url: '/brochure-printing-dubai',
    search_intent: 'Commercial',
    primary_keywords: [
      'brochure printing dubai',
      'company profile printing uae',
      'annual report printing dubai',
      'saddle stitch booklet printing',
      'tri-fold brochure printing dubai',
    ],
    subtopics: [
      'Binding Options: Saddle-Stitch, Wire-O, and Perfect Binding',
      'Silk vs Gloss Art Paper: 150gsm to 300gsm Recommendations',
      'Company Profile Design Specifications for B2B Procurement',
      'Spot UV and Foil Accents on Brochure Covers',
    ],
    internal_links: [
      { text: 'Flyer Printing Dubai', url: '/flyer-printing-dubai' },
      { text: 'Corporate Stationery', url: '/corporate-printing-dubai' },
      { text: 'Instant Brochure Quote', url: '/get-a-quote' },
    ],
  },
  {
    id: 'cluster-e',
    letter: 'E',
    name: 'Promotional Flyers & Leaflets',
    focus_entity: 'Bulk Commercial Flyer Printing Dubai',
    target_url: '/flyer-printing-dubai',
    search_intent: 'Commercial',
    primary_keywords: [
      'flyer printing dubai',
      'cheap flyer printing uae',
      'a5 flyer printing dubai',
      'same day flyer printing',
      'bulk distribution leaflet printing',
    ],
    subtopics: [
      'Flyer Paper Weight Comparison: 130gsm, 170gsm, and 250gsm',
      'Standard Sizes: A4, A5, A6, and DL Flyer Specifications',
      'Cost per Unit vs Volume: 1,000 to 50,000 Offset Runs',
      'Same-Day Urgent Dispatch for Dubai Events & Expos',
    ],
    internal_links: [
      { text: 'Brochure Printing Dubai', url: '/brochure-printing-dubai' },
      { text: 'Exhibition Displays', url: '/large-format-printing-dubai' },
      { text: 'Request Flyer Quote', url: '/get-a-quote' },
    ],
  },
  {
    id: 'cluster-f',
    letter: 'F',
    name: 'Roll-Up Banners & Exhibition Displays',
    focus_entity: 'Large Format Banner & Exhibition Printing Dubai',
    target_url: '/large-format-printing-dubai',
    search_intent: 'Commercial',
    primary_keywords: [
      'large format printing dubai',
      'roll up banner printing dubai',
      'pop up exhibition stand dubai',
      'trade show display printing uae',
      'outdoor vinyl banner printing',
    ],
    subtopics: [
      'Standard 85x200cm Roll-Up vs Luxury Wide-Base Aluminum Units',
      'Fabric Backdrop vs PVC Banner: Durability & Anti-Glare',
      'World Trade Centre Dubai Exhibition Stand Guidelines',
      'Same-Day Emergency Roll-Up Banner Printing & Delivery',
    ],
    internal_links: [
      { text: 'Signage Printing Dubai', url: '/signage-printing-dubai' },
      { text: 'Corporate Gifts & Merchandise', url: '/promotional-printing-dubai' },
      { text: 'Order Trade Show Displays', url: '/get-a-quote' },
    ],
  },
  {
    id: 'cluster-g',
    letter: 'G',
    name: 'Corporate Stationery & Executive Letterheads',
    focus_entity: 'Corporate Stationery Printing Press Dubai',
    target_url: '/corporate-printing-dubai',
    search_intent: 'Commercial',
    primary_keywords: [
      'corporate printing dubai',
      'letterhead printing dubai',
      'custom presentation folders uae',
      'branded envelope printing dubai',
      'official company stamp & seals',
    ],
    subtopics: [
      '100gsm & 120gsm Laser-Guaranteed Bond Paper for Invoices',
      'Die-Cut Presentation Folders with Business Card Slits',
      'Self-Seal Window & Non-Window Envelopes (DL, C5, C4)',
      'Brand Identity Color Precision: Pantone Matching in Al Quoz',
    ],
    internal_links: [
      { text: 'Business Card Printing Dubai', url: '/business-card-printing-dubai' },
      { text: 'Commercial Printing Overview', url: '/services' },
      { text: 'Request Stationery Package Quote', url: '/get-a-quote' },
    ],
  },
  {
    id: 'cluster-h',
    letter: 'H',
    name: 'Paper Bags & Eco-Friendly Retail Packaging',
    focus_entity: 'Custom Paper Bag Manufacturer Dubai',
    target_url: '/custom-packaging-dubai',
    search_intent: 'Commercial',
    primary_keywords: [
      'paper bag printing dubai',
      'luxury shopping bags uae',
      'kraft paper bags wholesale dubai',
      'custom boutique bags with rope handle',
      'eco friendly retail packaging',
    ],
    subtopics: [
      'Kraft Paper (Brown & White) vs Coated Art Paper Bags',
      'Handle Styles: Twisted Paper, Flat Tape, Cotton Rope, Satin Ribbon',
      'Reinforced Card Bases and Turn-Tops for High Weight Limits',
      'Foil Stamping on Matte Black and White Boutique Bags',
    ],
    internal_links: [
      { text: 'Rigid Box Packaging', url: '/packaging-printing-dubai' },
      { text: 'Product Labels', url: '/sticker-printing-dubai' },
      { text: 'Request Bag Samples', url: '/get-a-quote' },
    ],
  },
  {
    id: 'cluster-i',
    letter: 'I',
    name: 'Retail Signage & Acrylic Office Branding',
    focus_entity: 'Indoor & Outdoor Signage Manufacturer Dubai',
    target_url: '/signage-printing-dubai',
    search_intent: 'Commercial',
    primary_keywords: [
      'signage printing dubai',
      'acrylic office signs dubai',
      '3d backlit letters uae',
      'reception wall logo signage',
      'safety and wayfinding signs dubai',
    ],
    subtopics: [
      'Cast Acrylic vs Aluminum Composite (Dibond) Signage',
      'LED Backlit Channel Letters: Durability in Dubai Heat',
      'Frosted Glass Vinyl and Meeting Room Privacy Graphics',
      'Permits & Regulations for Commercial Signage in Dubai',
    ],
    internal_links: [
      { text: 'Large Format Printing', url: '/large-format-printing-dubai' },
      { text: 'Commercial Services', url: '/services' },
      { text: 'Signage Site Survey Request', url: '/contact' },
    ],
  },
  {
    id: 'cluster-j',
    letter: 'J',
    name: 'Branded Promotional Gifts & Merchandise',
    focus_entity: 'Corporate Promotional Gifts Dubai',
    target_url: '/promotional-printing-dubai',
    search_intent: 'Commercial',
    primary_keywords: [
      'promotional printing dubai',
      'corporate gifts dubai',
      'custom printed pens & notebooks uae',
      'branded water bottles & mugs',
      'executive vip corporate gift sets',
    ],
    subtopics: [
      'UV Direct-to-Object (DTO) Printing vs Screen Printing',
      'Laser Engraving on Stainless Steel, Bamboo, and Leather',
      'Ramadan and Corporate Year-End Gift Sets in Dubai',
      'Minimum Quantities and Lead Times for UAE Events',
    ],
    internal_links: [
      { text: 'Corporate Stationery', url: '/corporate-printing-dubai' },
      { text: 'Custom Packaging & Boxes', url: '/packaging-printing-dubai' },
      { text: 'Request Corporate Gifts Catalog', url: '/get-a-quote' },
    ],
  },
  {
    id: 'cluster-k',
    letter: 'K',
    name: 'Food & Beverage Packaging (Delivery & Retail)',
    focus_entity: 'Food-Grade Custom Packaging Dubai',
    target_url: '/custom-packaging-dubai',
    search_intent: 'Commercial',
    primary_keywords: [
      'food packaging printing dubai',
      'greaseproof paper printing uae',
      'custom burger boxes dubai',
      'takeaway coffee cup printing',
      'food grade certified paper packaging',
    ],
    subtopics: [
      'Food-Safe Inks and Barrier Coatings for Delivery Packaging',
      'Greaseproof Wrapping Paper for Gourmet Burgers & Bakeries',
      'Folding Kraft Takeaway Boxes with Ventilation Holes',
      'Dubai Municipality Health & Food Contact Material Compliance',
    ],
    internal_links: [
      { text: 'Product Labels & Stickers', url: '/sticker-printing-dubai' },
      { text: 'Paper Bags', url: '/custom-packaging-dubai' },
      { text: 'Food Packaging Quote', url: '/get-a-quote' },
    ],
  },
  {
    id: 'cluster-l',
    letter: 'L',
    name: 'Event, Conference & Exhibition Printing',
    focus_entity: 'Urgent Event Printing Press Dubai',
    target_url: '/printing-services-dubai',
    search_intent: 'Commercial',
    primary_keywords: [
      'event printing dubai',
      'conference printing services uae',
      'same day exhibition printing',
      'event badge and lanyard printing',
      'dwtc printing contractor',
    ],
    subtopics: [
      'Express Production for DWTC and Madinat Jumeirah Events',
      'Delegate Badges, Neck Lanyards, and Welcome Packs',
      'Directional Foam Board and Easel Signage for Summits',
      '24/7 Weekend Emergency Dispatch for International Exhibitors',
    ],
    internal_links: [
      { text: 'Roll-Up Banners', url: '/large-format-printing-dubai' },
      { text: 'Flyers & Handouts', url: '/flyer-printing-dubai' },
      { text: 'Emergency Event Quote', url: '/get-a-quote' },
    ],
  },
  {
    id: 'cluster-m',
    letter: 'M',
    name: 'Luxury Foil Stamping, Spot UV & Embossing',
    focus_entity: 'Luxury Print Embellishments Studio Dubai',
    target_url: '/services',
    search_intent: 'Informational',
    primary_keywords: [
      'foil stamping dubai',
      'spot uv printing uae',
      'embossing and debossing printing',
      'raised 3d spot uv printing',
      'metallic gold foil printing al quoz',
    ],
    subtopics: [
      'Hot Foil vs Cold Foil: When to Choose Each Method',
      'Blind Embossing vs Foil Embossing: Vector File Requirements',
      'Soft-Touch Velvet Lamination with High-Gloss Spot UV Contrast',
      'Pantone Metallic Inks vs Foil Stamping for High Volumes',
    ],
    internal_links: [
      { text: 'Luxury Business Cards', url: '/business-card-printing-dubai' },
      { text: 'Rigid Boxes & Packaging', url: '/packaging-printing-dubai' },
      { text: 'Request Finish Swatch Sample Box', url: '/contact' },
    ],
  },
  {
    id: 'cluster-n',
    letter: 'N',
    name: 'Books, Magazines & Saddle-Stitched Booklets',
    focus_entity: 'Book & Magazine Printing Press Dubai',
    target_url: '/services',
    search_intent: 'Commercial',
    primary_keywords: [
      'book printing dubai',
      'magazine printing uae',
      'perfect bound book printing',
      'coffee table book printing dubai',
      'saddle stitched lookbook printing',
    ],
    subtopics: [
      'Spine Calculation Formulas for Perfect Bound Publications',
      'Hardcover Case Binding with Ribbon Markers and Dust Jackets',
      'Color Reproduction Accuracy for Photography & Art Portfolios',
      'ISBN and National Media Council Printing Regulations in UAE',
    ],
    internal_links: [
      { text: 'Brochure Printing', url: '/brochure-printing-dubai' },
      { text: 'Company Profiles', url: '/brochure-printing-dubai' },
      { text: 'Book Printing Quote', url: '/get-a-quote' },
    ],
  },
  {
    id: 'cluster-o',
    letter: 'O',
    name: 'Point of Sale (POS) Displays & Retail Merchandising',
    focus_entity: 'POSM & Retail Display Fabricator Dubai',
    target_url: '/large-format-printing-dubai',
    search_intent: 'Commercial',
    primary_keywords: [
      'pos display printing dubai',
      'retail point of sale displays uae',
      'countertop display unit printing',
      'cardboard floor standing display cdu',
      'shelf talkers and wobblers dubai',
    ],
    subtopics: [
      'Corrugated Flute Grades (B-Flute, E-Flute) for Retail Units',
      'Custom Flat-Pack CDUs with Simple Tool-Free Assembly',
      'Acrylic Countertop Dump Bins and Cosmetic Presenters',
      'Retail Supermarket (Lulu, Carrefour) Display Approval Standards',
    ],
    internal_links: [
      { text: 'Custom Retail Packaging', url: '/custom-packaging-dubai' },
      { text: 'Large Format Signage', url: '/large-format-printing-dubai' },
      { text: 'POS Engineering Consultation', url: '/get-a-quote' },
    ],
  },
  {
    id: 'cluster-p',
    letter: 'P',
    name: 'Custom Hang Tags & Apparel Packaging',
    focus_entity: 'Fashion & Retail Hang Tag Printing Dubai',
    target_url: '/label-printing-dubai',
    search_intent: 'Commercial',
    primary_keywords: [
      'hang tag printing dubai',
      'garment swing tags uae',
      'custom clothing tags with eyelet',
      'kraft fashion tags with string',
      'luxury apparel packaging tags',
    ],
    subtopics: [
      'Paper Weights: 400gsm to 700gsm Rigid Board Hang Tags',
      'Eyelet Finishing: Brass, Gunmetal, Matte Black, and Silver',
      'String Selections: Waxed Cotton, Jute Cord, Elastic Ribbon',
      'Barcodes, QR Codes & Care Instructions Printing Standards',
    ],
    internal_links: [
      { text: 'Sticker & Label Printing', url: '/sticker-printing-dubai' },
      { text: 'Retail Paper Bags', url: '/custom-packaging-dubai' },
      { text: 'Order Apparel Tag Swatches', url: '/get-a-quote' },
    ],
  },
  {
    id: 'cluster-q',
    letter: 'Q',
    name: 'Calendars, Executive Diaries & Corporate Agendas',
    focus_entity: 'Corporate Calendar & Diary Printing Dubai',
    target_url: '/corporate-printing-dubai',
    search_intent: 'Commercial',
    primary_keywords: [
      'calendar printing dubai',
      'corporate desk calendar printing',
      'custom leather diary printing uae',
      'wall calendar printing dubai',
      'annual corporate agendas with foil logo',
    ],
    subtopics: [
      'Desk Tent Calendars with Wire-O Spiral and Rigid Stand',
      'Custom Debossed PU Leather & Hardbound Executive Planners',
      'Islamic Hijri and Gregorian Dual Calendar Design Layouts',
      'Corporate Year-End Volume Bulk Discounts and Distribution',
    ],
    internal_links: [
      { text: 'Corporate Stationery', url: '/corporate-printing-dubai' },
      { text: 'Promotional Merchandise', url: '/promotional-printing-dubai' },
      { text: 'Request Diary & Calendar Pricing', url: '/get-a-quote' },
    ],
  },
  {
    id: 'cluster-r',
    letter: 'R',
    name: 'Carbonless NCR Duplicate & Triplicate Books',
    focus_entity: 'Commercial NCR Invoice Book Printing Dubai',
    target_url: '/corporate-printing-dubai',
    search_intent: 'Commercial',
    primary_keywords: [
      'ncr book printing dubai',
      'carbonless invoice book printing',
      'duplicate receipt voucher printing',
      'triplicate delivery note books uae',
      'custom numbered receipt books',
    ],
    subtopics: [
      '2-Part, 3-Part, and 4-Part NCR Paper Color Sequences (White, Pink, Yellow, Blue)',
      'Sequential Numbering and Perforation for Clean Tearing',
      'Hard Wrap-Around Writing Shield to Prevent Copy Through',
      'VAT Compliance Fields for Federal Tax Authority (FTA) Invoices',
    ],
    internal_links: [
      { text: 'Corporate Printing Dubai', url: '/corporate-printing-dubai' },
      { text: 'Company Letterheads', url: '/corporate-printing-dubai' },
      { text: 'Order NCR Books', url: '/get-a-quote' },
    ],
  },
  {
    id: 'cluster-s',
    letter: 'S',
    name: 'PVC Plastic Cards, Lanyards & Security Badges',
    focus_entity: 'Plastic Card & ID Badge Printing Dubai',
    target_url: '/corporate-printing-dubai',
    search_intent: 'Commercial',
    primary_keywords: [
      'pvc card printing dubai',
      'employee id card printing uae',
      'custom lanyard printing dubai',
      'membership card printing with magnetic stripe',
      'rfid contactless key card printing',
    ],
    subtopics: [
      'Standard CR80 30-Mil PVC Cards: Scratch-Resistant Overlay',
      'Full-Color Dye-Sublimation vs High-Volume UV Offset',
      'Lanyard Attachment Options: Lobster Clasp, Swivel Hook, Safety Breakaway',
      'Smart Cards: RFID, NFC, and Magnetic Stripe Encoding Options',
    ],
    internal_links: [
      { text: 'Event Printing Dubai', url: '/printing-services-dubai' },
      { text: 'Corporate Stationery', url: '/corporate-printing-dubai' },
      { text: 'Request ID Badge Quote', url: '/get-a-quote' },
    ],
  },
  {
    id: 'cluster-t',
    letter: 'T',
    name: 'Same-Day Urgent Printing Press Al Quoz',
    focus_entity: 'Same-Day Commercial Press Al Quoz Dubai',
    target_url: '/printing-services-dubai',
    search_intent: 'Transactional',
    primary_keywords: [
      'same day printing dubai',
      'urgent printing al quoz',
      'emergency commercial printer uae',
      '24 hour printing press dubai',
      'quick turnaround print shop dubai',
    ],
    subtopics: [
      'Cut-Off Times: File Approval by 11:00 AM for Same-Day Courier Delivery',
      'Available Same-Day Items: Business Cards, Flyers, Roll-Up Banners, Booklets',
      'Direct Pressroom Pickup in Al Quoz Industrial Area 3',
      'Dedicated Urgent WhatsApp Dispatch Helpline (+44 7344 546056)',
    ],
    internal_links: [
      { text: 'Business Card Printing Dubai', url: '/business-card-printing-dubai' },
      { text: 'Roll-Up Banners', url: '/large-format-printing-dubai' },
      { text: 'Urgent Quote Request Form', url: '/get-a-quote' },
    ],
  },
]

export default function TopicalAuthorityTab({ showToast }) {
  const [search, setSearch] = useState('')
  const [intentFilter, setIntentFilter] = useState('All')
  const [expandedCluster, setExpandedCluster] = useState('cluster-a')
  const [copiedKeyword, setCopiedKeyword] = useState(null)

  // Content Brief Modal State
  const [briefModalOpen, setBriefModalOpen] = useState(false)
  const [briefLoading, setBriefLoading] = useState(false)
  const [activeBrief, setActiveBrief] = useState(null)

  const filteredClusters = useMemo(() => {
    return TOPICAL_CLUSTERS.filter((c) => {
      const q = search.toLowerCase().trim()
      const matchSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.focus_entity.toLowerCase().includes(q) ||
        c.target_url.toLowerCase().includes(q) ||
        c.primary_keywords.some((k) => k.toLowerCase().includes(q))

      const matchIntent = intentFilter === 'All' || c.search_intent === intentFilter
      return matchSearch && matchIntent
    })
  }, [search, intentFilter])

  const handleCopy = (text) => {
    navigator.clipboard?.writeText(text)
    setCopiedKeyword(text)
    showToast?.(`Copied "${text}" to clipboard!`)
    setTimeout(() => setCopiedKeyword(null), 2000)
  }

  const handleGenerateBrief = async (cluster) => {
    setBriefLoading(true)
    setBriefModalOpen(true)
    try {
      const res = await generateContentBrief({
        topic: cluster.name,
        target_url: cluster.target_url,
        search_intent: cluster.search_intent,
      })
      if (res?.success) {
        setActiveBrief(res.data)
      } else {
        showToast?.('Failed to generate content brief', 'error')
      }
    } catch (err) {
      showToast?.('Error generating brief: ' + (err.response?.data?.message || err.message), 'error')
    } finally {
      setBriefLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#A82F19]/10 px-2.5 py-0.5 text-xs font-bold text-[#A82F19]">
                <Network className="h-3.5 w-3.5" />
                Topical Authority Architecture
              </span>
              <span className="text-xs font-semibold text-neutral-500">Requirement 4 &amp; 11</span>
            </div>
            <h2 className="font-display mt-2 text-2xl font-black tracking-tight text-neutral-900">
              Topical Map &amp; Pillar-Cluster Architecture
            </h2>
            <p className="mt-1 text-sm text-neutral-600 max-w-2xl">
              20 core commercial printing and luxury packaging clusters (A–T) mapped to search intent, target landing URLs, and hub-and-spoke internal linking directives.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-mono font-bold text-neutral-700">
              20 / 20 Clusters Active
            </span>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-4">
            <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">
              Topical Clusters
            </span>
            <div className="text-2xl font-black text-neutral-900">20</div>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Full Dubai Coverage</span>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block mb-1">
              URL Coverage
            </span>
            <div className="text-2xl font-black text-emerald-800">100%</div>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Zero Orphan Clusters</span>
          </div>
          <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-4">
            <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block mb-1">
              Commercial Intent
            </span>
            <div className="text-2xl font-black text-blue-800">18 / 20</div>
            <span className="text-[11px] text-blue-600 font-semibold mt-1 block">B2B Buyer Focused</span>
          </div>
          <div className="rounded-xl border border-purple-200 bg-purple-50/40 p-4">
            <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider block mb-1">
              Internal Linking Silos
            </span>
            <div className="text-2xl font-black text-purple-800">60+</div>
            <span className="text-[11px] text-purple-600 font-semibold mt-1 block">Bi-directional Connections</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clusters, entities, keywords..."
            className="w-full rounded-xl border border-neutral-200 pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-[#A82F19]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs font-bold text-neutral-600 shrink-0">Search Intent:</label>
          <select
            value={intentFilter}
            onChange={(e) => setIntentFilter(e.target.value)}
            className="rounded-xl border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-[#A82F19]"
          >
            <option value="All">All Intents</option>
            <option value="Commercial">Commercial</option>
            <option value="Transactional">Transactional</option>
            <option value="Informational">Informational</option>
          </select>
        </div>
      </div>

      {/* Clusters List */}
      <div className="space-y-4">
        {filteredClusters.map((cluster) => {
          const isExpanded = expandedCluster === cluster.id
          return (
            <div
              key={cluster.id}
              className={`rounded-2xl border transition-all duration-200 bg-white overflow-hidden ${
                isExpanded ? 'border-neutral-900 shadow-md' : 'border-neutral-200/80 hover:border-neutral-300 shadow-2xs'
              }`}
            >
              <div
                className="p-5 cursor-pointer select-none"
                onClick={() => setExpandedCluster(isExpanded ? null : cluster.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5 flex-1">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-900 text-white font-mono font-black text-sm">
                      {cluster.letter}
                    </div>

                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">
                          Cluster {cluster.letter}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            cluster.search_intent === 'Transactional'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : cluster.search_intent === 'Commercial'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-purple-50 text-purple-700 border border-purple-200'
                          }`}
                        >
                          {cluster.search_intent} Intent
                        </span>
                        <a
                          href={cluster.target_url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-0.5 text-[10px] font-mono text-neutral-700 hover:text-[#A82F19]"
                        >
                          <span>{cluster.target_url}</span>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      </div>

                      <h3 className="font-display text-base font-bold text-neutral-900 pt-0.5">
                        {cluster.name}
                      </h3>

                      <p className="text-xs text-neutral-500 font-medium">
                        Focus Entity: <span className="text-neutral-800 font-semibold">{cluster.focus_entity}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleGenerateBrief(cluster)
                      }}
                      className="text-xs font-bold border-neutral-300 text-neutral-800 hover:border-[#A82F19]"
                    >
                      <Sparkles className="h-3.5 w-3.5 mr-1 text-[#A82F19]" />
                      <span>Content Brief</span>
                    </Button>
                    <div className="p-2 text-neutral-400">
                      <ChevronDown
                        className={`h-5 w-5 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180 text-neutral-800' : ''
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Body Details */}
              {isExpanded && (
                <div className="border-t border-neutral-100 bg-neutral-50/50 p-5 space-y-5 text-xs">
                  {/* Primary Dubai Keywords */}
                  <div>
                    <h4 className="font-bold text-neutral-800 mb-2 flex items-center gap-1.5">
                      <Target className="h-4 w-4 text-[#A82F19]" />
                      Primary Dubai Target Queries (GEO / Search)
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {cluster.primary_keywords.map((kw, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleCopy(kw)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-800 hover:border-[#A82F19] transition-colors cursor-pointer"
                          title="Click to copy query"
                        >
                          <span>{kw}</span>
                          {copiedKeyword === kw ? (
                            <Check className="h-3 w-3 text-emerald-600" />
                          ) : (
                            <Copy className="h-3 w-3 text-neutral-400" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Subtopics & Content Hierarchy */}
                  <div>
                    <h4 className="font-bold text-neutral-800 mb-2 flex items-center gap-1.5">
                      <FileText className="h-4 w-4 text-blue-600" />
                      Recommended H2 Supporting Subtopics &amp; Knowledge Assets
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {cluster.subtopics.map((sub, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 rounded-xl border border-neutral-200/80 bg-white p-3 text-xs text-neutral-700"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-[#A82F19] shrink-0" />
                          <span>{sub}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Internal Linking Architecture */}
                  <div>
                    <h4 className="font-bold text-neutral-800 mb-2 flex items-center gap-1.5">
                      <Link2 className="h-4 w-4 text-purple-600" />
                      Required Hub-and-Spoke Internal Links
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {cluster.internal_links.map((link, idx) => (
                        <a
                          key={idx}
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-xl border border-purple-200 bg-purple-50/40 px-3 py-1.5 text-xs font-semibold text-purple-900 hover:bg-purple-100 transition-colors"
                        >
                          <ArrowRight className="h-3 w-3 text-purple-600" />
                          <span>{link.text}</span>
                          <span className="font-mono text-[10px] text-purple-600">({link.url})</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Content Brief Modal */}
      {briefModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
          onClick={() => setBriefModalOpen(false)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-[#A82F19]">
                  AI SEO &amp; GEO Content Strategy
                </span>
                <h3 className="font-display text-xl font-black text-neutral-900">
                  {briefLoading ? 'Generating Content Brief…' : `Content Brief: ${activeBrief?.topic || ''}`}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setBriefModalOpen(false)}
                className="p-2 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100"
              >
                ✕
              </button>
            </div>

            {briefLoading ? (
              <div className="py-16 text-center text-xs text-neutral-500">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto text-[#A82F19] mb-3" />
                Synthesizing Dubai search intent, technical specs, and H2/H3 outline…
              </div>
            ) : activeBrief ? (
              <div className="mt-5 space-y-5 text-xs leading-relaxed">
                {/* Meta Tags Recommendation */}
                <div className="rounded-xl border border-neutral-200 bg-neutral-50/70 p-4 space-y-2">
                  <div>
                    <span className="font-bold text-neutral-800">Target URL: </span>
                    <span className="font-mono text-neutral-600">{activeBrief.target_url}</span>
                  </div>
                  <div>
                    <span className="font-bold text-neutral-800">Suggested Title: </span>
                    <span className="text-neutral-900 font-semibold">{activeBrief.suggested_meta_title}</span>
                  </div>
                  <div>
                    <span className="font-bold text-neutral-800">Suggested Description: </span>
                    <span className="text-neutral-700">{activeBrief.suggested_meta_description}</span>
                  </div>
                </div>

                {/* Scope & Word Count */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="rounded-xl border border-neutral-200 p-3">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase block">Search Intent</span>
                    <span className="text-xs font-bold text-neutral-900">{activeBrief.search_intent}</span>
                  </div>
                  <div className="rounded-xl border border-neutral-200 p-3">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase block">Word Count Target</span>
                    <span className="text-xs font-bold text-neutral-900">{activeBrief.recommended_word_count}</span>
                  </div>
                  <div className="col-span-2 sm:col-span-1 rounded-xl border border-neutral-200 p-3">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase block">Primary Query</span>
                    <span className="text-xs font-bold text-neutral-900 truncate block">{activeBrief.primary_keyword}</span>
                  </div>
                </div>

                {/* Content Hierarchy Outline */}
                <div>
                  <h4 className="font-bold text-neutral-900 mb-2">Recommended Section Outline (H2 / H3)</h4>
                  <div className="space-y-2.5">
                    {activeBrief.content_structure?.map((section, idx) => (
                      <div key={idx} className="rounded-xl border border-neutral-200 p-3.5 bg-white">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="rounded bg-neutral-900 text-white font-mono px-1.5 py-0.5 text-[10px] font-bold">
                            {section.level?.toUpperCase()}
                          </span>
                          <span className="font-bold text-neutral-900">{section.heading}</span>
                        </div>
                        <ul className="list-disc pl-5 space-y-1 text-neutral-600 text-[11px]">
                          {section.talking_points?.map((tp, tpIdx) => (
                            <li key={tpIdx}>{tp}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* FAQ Targets */}
                {activeBrief.faq_targets && (
                  <div>
                    <h4 className="font-bold text-neutral-900 mb-2">Answer-First FAQ Targets (Schema Ready)</h4>
                    <div className="space-y-2">
                      {activeBrief.faq_targets.map((faq, idx) => (
                        <div key={idx} className="rounded-xl border border-neutral-200 p-3 bg-neutral-50/50">
                          <p className="font-bold text-neutral-800">Q: {faq.question}</p>
                          <p className="mt-1 text-neutral-600 text-[11px]">A: {faq.answer_guideline}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : null}

            <div className="mt-6 flex justify-end border-t border-neutral-200 pt-4">
              <Button variant="accent" size="sm" onClick={() => setBriefModalOpen(false)}>
                Close Brief
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
