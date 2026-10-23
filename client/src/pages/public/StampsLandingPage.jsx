import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Stamp,
  CheckCircle2,
  Clock,
  Truck,
  ShieldCheck,
  FileCheck,
  Building2,
  Sparkles,
  ArrowRight,
  Phone,
  MessageSquare,
  UploadCloud,
  FileText,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Layers,
  MapPin,
  Check,
  Award,
  CreditCard,
  Tag,
  Palette,
  ExternalLink
} from 'lucide-react'
import Container from '../../components/Container'
import Button from '../../components/Button'
import Breadcrumbs from '../../components/Breadcrumbs'
import SEOHead from '../../components/SEOHead'
import Reveal from '../../components/Reveal'
import WhatsAppIcon from '../../components/WhatsAppIcon'
import {
  getServiceWhatsAppUrl,
  WHATSAPP_PHONE,
  FORMATTED_PHONE
} from '../../utils/whatsapp'
import { trackWhatsAppClick, trackGetQuoteClick } from '../../utils/analytics'
import { getProductImage } from '../../assets/productImages'

const STAMP_TYPES = [
  {
    id: 'round-company-stamps',
    name: 'Round Company Seal Stamp',
    slug: 'round-company-stamps',
    arabicName: 'ختم الشركة الدائري',
    tagline: 'Official circular seal for LLC agreements, bank accounts, and contracts',
    basePrice: 95,
    turnaround: '2-Hour Express',
    badge: 'Legal Essential',
    shape: 'round',
    image: '/assets/products/stamps/self-inking-company-stamp.jpg',
    defaultSizes: ['40 mm Dia (Standard Legal)', '30 mm Dia (Compact)', '45 mm Dia (Large Corporate)', '50 mm Dia (Notary Round)'],
    brands: ['Trodat Printy 4642', 'Colop Printer R40', 'Heavy Metal Core'],
  },
  {
    id: 'rectangular-company-stamps',
    name: 'Rectangular Office & Business Stamp',
    slug: 'rectangular-company-stamps',
    arabicName: 'ختم الشركة المستطيل للمكتب',
    tagline: 'Multi-line company stamp for invoices, delivery notes, and paperwork',
    basePrice: 85,
    turnaround: '2-Hour Express',
    badge: 'Bestseller',
    shape: 'rect',
    image: '/assets/products/stamps/self-inking-company-stamp.jpg',
    defaultSizes: ['47 × 18 mm (Standard 4-Line)', '38 × 14 mm (Compact 3-Line)', '58 × 22 mm (Large 6-Line)', '70 × 25 mm (Jumbo / TRN)'],
    brands: ['Trodat Printy 4912', 'Colop Printer 30', 'Steel Core Line'],
  },
  {
    id: 'self-inking-company-stamps',
    name: 'Self-Inking Corporate Company Stamp',
    slug: 'self-inking-company-stamps',
    arabicName: 'أختام أوتوماتيكية ذاتية التحبير',
    tagline: 'All-in-one automatic stamp with built-in high-capacity ink pad',
    basePrice: 85,
    turnaround: 'Same-Day Dispatch',
    badge: 'Popular',
    shape: 'rect',
    image: '/assets/products/stamps/self-inking-company-stamp.jpg',
    defaultSizes: ['47 × 18 mm Standard', '58 × 22 mm Large', '40 mm Round Seal', '38 × 14 mm Pocket'],
    brands: ['Trodat Printy 4.0', 'Colop Printer', 'Shiny Standard'],
  },
  {
    id: 'heavy-duty-dater-stamps',
    name: 'Heavy-Duty Date & Received Stamp',
    slug: 'heavy-duty-dater-stamps',
    arabicName: 'ختم التاريخ والمعاملات الحسابية',
    tagline: 'Internal steel-core dater for accounts, mailrooms, and logistics',
    basePrice: 130,
    turnaround: 'Same-Day Dispatch',
    badge: 'Heavy Duty',
    shape: 'rect',
    image: '/assets/products/stamps/heavy-duty-dater-stamp.jpg',
    defaultSizes: ['41 × 24 mm Accounts', '56 × 33 mm Logistics', '68 × 47 mm Large Custom'],
    brands: ['Trodat Professional 5460', 'Colop Classic Line'],
  },
  {
    id: 'pocket-mobile-stamps',
    name: 'Pocket Mobile Folding Stamp',
    slug: 'pocket-mobile-stamps',
    arabicName: 'ختم الجيب المحمول للأطباء والمهندسين',
    tagline: 'Ultra-compact slide-to-open stamp for doctors, engineers, and site visits',
    basePrice: 95,
    turnaround: '2-Hour Express',
    badge: 'Mobile Pro',
    shape: 'rect',
    image: '/assets/products/stamps/pocket-mobile-stamp.jpg',
    defaultSizes: ['38 × 14 mm Slim Pocket', '47 × 18 mm Standard Pocket', '40 mm Round Pocket'],
    brands: ['Trodat Mobile Printy', 'Colop Pocket Stamp Plus'],
  },
  {
    id: 'name-signature-stamps',
    name: 'Name & Personal Signature Stamp',
    slug: 'name-signature-stamps',
    arabicName: 'ختم التوقيع الشخصي والاسم',
    tagline: 'Precision personal name, doctor license, or facsimile signature stamp',
    basePrice: 75,
    turnaround: '2-Hour Express',
    badge: 'Personal License',
    shape: 'rect',
    image: '/assets/products/stamps/pocket-mobile-stamp.jpg',
    defaultSizes: ['38 × 14 mm Name Only', '47 × 18 mm Name + License No', '58 × 22 mm Signature + Title'],
    brands: ['Trodat Printy 4911', 'Colop Pocket', 'Shiny Handy'],
  },
  {
    id: 'custom-logo-stamps',
    name: 'Custom Logo & Brand Rubber Stamp',
    slug: 'custom-logo-stamps',
    arabicName: 'ختم الشعار التجاري المخصص',
    tagline: '1000 DPI laser-etched brand emblem for packaging, cups, and kraft boxes',
    basePrice: 110,
    turnaround: 'Same-Day Dispatch',
    badge: 'Brand Emblem',
    shape: 'round',
    image: '/assets/products/stamps/self-inking-company-stamp.jpg',
    defaultSizes: ['40 mm Round Logo', '50 × 50 mm Square Brand', '60 × 40 mm Packaging Seal', '20 × 20 mm Loyalty Card'],
    brands: ['Self-Inking Trodat', 'Beechwood Mount + Separate Pad', 'Metal Frame'],
  },
  {
    id: 'vat-trn-stamps',
    name: 'VAT & TRN Tax Invoice Stamp',
    slug: 'vat-trn-stamps',
    arabicName: 'ختم ضريبة القيمة المضافة TRN',
    tagline: 'FTA compliant corporate stamp with 15-digit TRN and signatory line',
    basePrice: 85,
    turnaround: '2-Hour Express',
    badge: 'FTA Compliant',
    shape: 'rect',
    image: '/assets/products/stamps/self-inking-company-stamp.jpg',
    defaultSizes: ['58 × 22 mm Standard TRN Box', '70 × 25 mm Detailed Multi-Emirate', '47 × 18 mm Compact'],
    brands: ['Trodat Printy 4913', 'Colop Printer Standard', 'Heavy Metal Core'],
  },
  {
    id: 'luxury-brass-wax-seal-stamps',
    name: 'Luxury Brass Wax Seal & Notary Stamp',
    slug: 'luxury-brass-wax-seal-stamps',
    arabicName: 'أختام الشمع النحاسية الفاخرة',
    tagline: 'CNC micro-milled solid brass head with polished rosewood handle',
    basePrice: 160,
    turnaround: '24–48 Hours',
    badge: 'Old-World Luxury',
    shape: 'round',
    image: '/assets/products/stamps/luxury-wax-seal-stamp.jpg',
    defaultSizes: ['25 mm Round', '30 mm Round', '35 mm Large Crest'],
    brands: ['Solid Brass + Rosewood', 'Full Gold Metal Handle', 'Desktop Embosser'],
  },
  {
    id: 'bulk-corporate-stamp-orders',
    name: 'Bulk Corporate Stamp Orders',
    slug: 'bulk-corporate-stamp-orders',
    arabicName: 'طلبيات الشركات الكبرى والجملة',
    tagline: 'Enterprise stamp provisioning with volume discounts for multi-branch organizations',
    basePrice: 70,
    turnaround: 'Express Fleet Dispatch',
    badge: 'Enterprise B2B',
    shape: 'rect',
    image: '/assets/products/stamps/self-inking-company-stamp.jpg',
    defaultSizes: ['Fleet Starter Kit (10 Stamps)', 'Multi-Branch Bundle (25 Stamps)', 'Corporate Enterprise Fleet (50+ Stamps)'],
    brands: ['Trodat Printy Mix', 'Accounts Metal Core Fleet', 'Executive Pocket Fleet'],
  },
]

const INK_COLORS = [
  { id: 'blue', name: 'Official Blue', hex: '#0055B8', tag: 'Bank & Contract Standard', desc: 'Recommended by UAE banks to distinguish original stamps from copies' },
  { id: 'black', name: 'Classic Black', hex: '#1A1A1A', tag: 'Standard Office', desc: 'Crisp, high-contrast monochrome impression for administrative records' },
  { id: 'red', name: 'Security Red', hex: '#D32F2F', tag: 'Approval & Urgency', desc: 'Ideal for RECEIVED, APPROVED, PAID, or URGENT document sign-offs' },
  { id: 'green', name: 'Forest Green', hex: '#2E7D32', tag: 'Audit & Verification', desc: 'Used for quality control, inspection passed, and accounting audits' },
  { id: 'violet', name: 'Royal Violet', hex: '#6A1B9A', tag: 'Executive Accent', desc: 'Distinguished violet hue for specialized legal and notary stamps' },
]

const QUANTITY_TIERS = [
  { qty: 1, label: '1 Stamp', discount: 0, tag: 'Standard' },
  { qty: 3, label: '3 Stamps', discount: 5, tag: 'Office Set' },
  { qty: 5, label: '5 Stamps', discount: 10, tag: 'Multi-Desk' },
  { qty: 10, label: '10 Stamps', discount: 20, tag: 'Volume Tier' },
  { qty: 25, label: '25+ Stamps', discount: 35, tag: 'Corporate Fleet' },
]

const STAMP_FAQS = [
  {
    q: 'What documents are required to make a company stamp in Dubai, UAE?',
    a: 'In full accordance with UAE economic and legal regulations, legitimate stamp manufacturers in Dubai require: (1) A clear copy of your valid UAE Trade License (issued by Dubai Economy & Tourism - DED, or any UAE Free Zone authority such as DMCC, JAFZA, DAFZA, IFZA, Shams, RAKEZ); and (2) An authorization letter printed on company letterhead signed by the authorized manager (as listed on the trade license) or a copy of the manager\'s Emirates ID. This legal verification safeguards your business against unauthorized stamp duplication, invoice tampering, and corporate identity theft. Personal name stamps, doctor license stamps, and generic office markers (e.g. PAID, APPROVED, RECEIVED) do not require a trade license.',
  },
  {
    q: 'How fast can I get my custom company stamp made and delivered in Dubai?',
    a: 'We offer express 2-Hour rush manufacturing at our central Al Quoz atelier for emergency business requirements (e.g., bank account opening, urgent lease agreement, or visa processing). If you submit your trade license and approve the digital vector proof before 2:00 PM, same-day delivery is dispatched to your office across Dubai (Downtown, Business Bay, DIFC, JLT, Marina, Deira, Bur Dubai, Silicon Oasis, Jebel Ali). Tracked courier delivery across Abu Dhabi, Sharjah, Ajman, and other Emirates arrives within 24 business hours.',
  },
  {
    q: 'Why do UAE banks and government entities recommend Blue Ink for company stamps?',
    a: 'Official Blue ink is the standard recommendation of UAE commercial banks (such as Emirates NBD, ADCB, FAB, Mashreq), courts, and government ministries because blue ink makes it instantly obvious whether a physical paper document bears an original inked impression or is a black-and-white photocopy. We offer genuine Austrian Trodat and Colop water-based document-proof blue ink cartridges certified to ISO 14145-2 (anti-fraud and forgery-resistant).',
  },
  {
    q: 'What is the difference between a self-inking stamp, a pre-inked stamp, and an embossing seal?',
    a: 'A self-inking stamp has an internal mechanical rotating die that flips and rests against a replaceable ink pad inside the casing after each press—making it the fastest, most durable everyday solution (capable of 10,000+ impressions before replacement). A pre-inked stamp holds ink inside microporous rubber for photographic sharpness. An embossing seal does not use ink at all; it physically presses a raised 3D tactile impression into paper for prestigious certificates, contracts, and notary attestations.',
  },
  {
    q: 'Can you create bilingual company stamps with both English and Arabic text?',
    a: 'Yes, absolutely. Over 90% of the corporate stamps we manufacture in Dubai feature bilingual typography. In round seals, the Arabic company name typically curves along the top concentric arc while the English name curves along the bottom arc, centered with your logo emblem and trade license number. Our in-house typographers inspect Arabic calligraphy, naskh, and kufic fonts to guarantee correct Arabic spelling and official trade license matching.',
  },
  {
    q: 'How long does a self-inking company stamp last, and how do I refill it?',
    a: 'Each factory-fresh Trodat Printy or Colop casing delivers between 8,000 and 12,000 razor-sharp impressions before the ink pad starts to lighten. When needed, refilling takes under 15 seconds: you simply press the release catch, slide out the old pad cartridge, and snap in a fresh pre-filled Trodat/Colop replacement pad (available from ONPRINT in blue, black, red, green, or violet) without ever staining your hands.',
  },
  {
    q: 'Can I include my company logo, Trade License number, and TRN on the same stamp?',
    a: 'Yes. Our laser engraving equipment operates at 1000 DPI microscopic resolution, enabling us to cleanly reproduce complex vector logos, crests, and multiple lines of text (Legal Name, License Number, TRN, PO Box, City, and Phone) without ink bleeding or smudging, provided the stamp size is appropriately matched (we recommend at least 40mm diameter for round seals or 58×22mm for rectangular stamps).',
  },
  {
    q: 'What artwork formats do you accept for custom stamp manufacturing?',
    a: 'We accept vector PDF, Adobe Illustrator (.AI), .EPS, and .SVG files. We can also work from high-resolution monochrome PNG or JPEG files (300+ DPI). If you only have a scanned letterhead, photo of an old stamp, or trade license text, our prepress design team will digitally redraw and typeset your stamp artwork into a clean vector layout and send you a complimentary PDF proof on WhatsApp before laser engraving.',
  },
  {
    q: 'Do you offer bulk corporate pricing for multi-branch organizations in the UAE?',
    a: 'Yes. We supply comprehensive stamp fleets for UAE commercial banks, healthcare networks, construction contractors, accounting firms, and real estate agencies. Volume orders enjoy discounts ranging from 10% to 35%, standardized brand typography across all branches, centralized billing, and individual delivery to different office branches across Dubai, Abu Dhabi, Sharjah, and the Northern Emirates.',
  },
  {
    q: 'How do I place an order and pay for my stamp?',
    a: 'You can order directly on WhatsApp by selecting your preferred stamp specifications on this page and clicking "Order on WhatsApp". Our print team will immediately confirm your requirements, inspect your trade license/artwork, send a digital proof for approval, and provide multiple payment options: corporate bank transfer, credit/debit card online invoice, or payment upon delivery in Dubai.',
  },
]

export default function StampsLandingPage() {
  const [selectedType, setSelectedType] = useState(STAMP_TYPES[0])
  const [selectedBrand, setSelectedBrand] = useState(STAMP_TYPES[0].brands[0])
  const [selectedSize, setSelectedSize] = useState(STAMP_TYPES[0].defaultSizes[0])
  const [selectedInk, setSelectedInk] = useState(INK_COLORS[0])
  const [selectedQty, setSelectedQty] = useState(QUANTITY_TIERS[0])
  const [companyNameEng, setCompanyNameEng] = useState('AL MANAR COMMERCIAL BROKERS L.L.C')
  const [companyNameAr, setCompanyNameAr] = useState('المنار لخدمات الوساطة التجارية ذ.م.م')
  const [tradeLicenseNo, setTradeLicenseNo] = useState('CN-1094821')
  const [trnNumber, setTrnNumber] = useState('100234567800003')
  const [customerName, setCustomerName] = useState('')
  const [deliveryLocation, setDeliveryLocation] = useState('Dubai')
  const [hasArtwork, setHasArtwork] = useState('Will attach vector PDF/trade license on WhatsApp')
  const [activeFaq, setActiveFaq] = useState(0)
  const [catalogFilter, setCatalogFilter] = useState('all')

  const handleTypeChange = (type) => {
    setSelectedType(type)
    setSelectedBrand(type.brands[0])
    setSelectedSize(type.defaultSizes[0])
  }

  const calculatedUnitPrice = useMemo(() => {
    const base = selectedType.basePrice
    const discountMultiplier = (100 - selectedQty.discount) / 100
    return Math.round(base * discountMultiplier)
  }, [selectedType, selectedQty])

  const calculatedTotalPrice = useMemo(() => {
    return calculatedUnitPrice * selectedQty.qty
  }, [calculatedUnitPrice, selectedQty])

  const stampInquiryDetails = useMemo(() => {
    return {
      productName: selectedType.name,
      stampType: selectedType.name,
      quantity: selectedQty.qty,
      size: selectedSize,
      casingBrand: selectedBrand,
      inkColor: selectedInk.name,
      stampText: `${companyNameEng} | ${companyNameAr} | Lic: ${tradeLicenseNo} | TRN: ${trnNumber}`,
      customerName: customerName.trim() || undefined,
      deliveryLocation: deliveryLocation.trim() || undefined,
      artworkStatus: hasArtwork,
      price: calculatedTotalPrice,
      pageUrl: 'https://www.0nprint.com/categories/stamps-printing-dubai',
    }
  }, [selectedType, selectedQty, selectedSize, selectedBrand, selectedInk, companyNameEng, companyNameAr, tradeLicenseNo, trnNumber, customerName, deliveryLocation, hasArtwork, calculatedTotalPrice])

  const filteredProducts = useMemo(() => {
    if (catalogFilter === 'all') return STAMP_TYPES
    if (catalogFilter === 'round') return STAMP_TYPES.filter(t => t.shape === 'round')
    if (catalogFilter === 'rect') return STAMP_TYPES.filter(t => t.shape === 'rect')
    if (catalogFilter === 'specialty') return STAMP_TYPES.filter(t => t.id.includes('dater') || t.id.includes('wax') || t.id.includes('pocket') || t.id.includes('bulk'))
    return STAMP_TYPES
  }, [catalogFilter])

  const breadcrumbsList = [
    { name: 'Home', url: '/' },
    { name: 'Catalog', url: '/products' },
    { name: 'Stamps & Seals', url: '/categories/stamps-printing-dubai' },
  ]

  const stampFaqSchema = STAMP_FAQS.map(faq => ({
    question: faq.q,
    answer: faq.a,
  }))

  const stampAggregateProduct = {
    name: 'Custom Rubber Stamps & Company Stamps Dubai',
    slug: 'stamps-printing-dubai',
    description: 'Official corporate rubber stamps and company seals in Dubai. Trodat & Colop self-inking stamps, round corporate seals, heavy daters, and pocket stamps with 2-hour express dispatch.',
    price: 85,
    minimumQuantity: 1,
    image: '/assets/products/stamps/self-inking-company-stamp.jpg',
  }

  return (
    <div className="min-h-screen bg-[#101D35] text-[#F5F2EB] selection:bg-[#D4AF65] selection:text-[#101D35]">
      {/* 1. SEO Head & Structured Data */}
      <SEOHead
        title="Custom Rubber Stamps & Company Stamps in Dubai | ONPRINT"
        description="Explore custom rubber stamps, company stamps and self-inking stamps from ONPRINT. Request a quote for your stamp requirements in Dubai and the UAE."
        keywords="rubber stamp dubai, custom stamps dubai, company stamp dubai, company stamp maker dubai, self inking stamp dubai, custom rubber stamp dubai, office stamps dubai, business stamp dubai, stamp printing dubai, custom company stamp uae, round company stamp dubai, date stamp dubai, name stamp dubai, vat stamp uae, stamp maker uae"
        canonicalPath="/categories/stamps-printing-dubai"
        product={stampAggregateProduct}
        breadcrumbs={breadcrumbsList}
        faqList={stampFaqSchema}
      />

      {/* 2. Top Banner & Breadcrumbs */}
      <div className="border-b border-[#203357] bg-[#172644]/80 backdrop-blur-md py-3">
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <Breadcrumbs
              items={[
                { name: 'Catalog', path: '/products' },
                { name: 'Stamps & Seals' },
              ]}
            />
            <div className="hidden sm:flex items-center gap-4 text-[#B0BECE]">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Al Quoz Atelier Active • 2-Hour Express Rush
              </span>
              <span>•</span>
              <span className="text-[#D4AF65] font-semibold">
                Trodat &amp; Colop Austrian Casings
              </span>
            </div>
          </div>
        </Container>
      </div>

      {/* 3. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-24 border-b border-[#203357]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(212,175,101,0.15),rgba(16,29,53,0))]" />
        
        <Container className="relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF65]/40 bg-[#D4AF65]/10 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-[#D4AF65] mb-6">
                <Stamp className="h-3.5 w-3.5" />
                <span>DUBAI PRESSROOM &bull; 2-HOUR EXPRESS TURNAROUND &bull; UAE LEGAL COMPLIANCE</span>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h1 className="font-display text-3xl font-black tracking-tight text-[#F5F2EB] sm:text-5xl lg:text-6xl leading-[1.1]">
                Custom Rubber Stamps &amp; Company Stamps in Dubai
              </h1>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="mt-6 text-base sm:text-lg leading-relaxed text-[#B0BECE] max-w-3xl mx-auto">
                Manufacture official legal company stamps, round corporate seals, self-inking Trodat &amp; Colop casings, heavy-duty accounting daters, and pocket stamps in Al Quoz, Dubai. Laser-etched to 1000 DPI vector fidelity with guaranteed UAE Trade License compliance and same-day delivery.
              </p>
            </Reveal>

            {/* Quick Badges Grid */}
            <Reveal delay={0.25}>
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-left">
                <div className="rounded-2xl border border-[#203357] bg-[#172644]/90 p-3.5 backdrop-blur-sm">
                  <Clock className="h-5 w-5 text-[#D4AF65] mb-1.5" />
                  <div className="text-xs font-extrabold text-[#F5F2EB]">2-Hour Express</div>
                  <div className="text-[10px] text-[#B0BECE]">Emergency Al Quoz rush</div>
                </div>
                <div className="rounded-2xl border border-[#203357] bg-[#172644]/90 p-3.5 backdrop-blur-sm">
                  <ShieldCheck className="h-5 w-5 text-emerald-400 mb-1.5" />
                  <div className="text-xs font-extrabold text-[#F5F2EB]">DED &amp; Freezone Legal</div>
                  <div className="text-[10px] text-[#B0BECE]">Trade license compliant</div>
                </div>
                <div className="rounded-2xl border border-[#203357] bg-[#172644]/90 p-3.5 backdrop-blur-sm">
                  <Award className="h-5 w-5 text-[#D4AF65] mb-1.5" />
                  <div className="text-xs font-extrabold text-[#F5F2EB]">Trodat &amp; Colop</div>
                  <div className="text-[10px] text-[#B0BECE]">10,000+ crisp impressions</div>
                </div>
                <div className="rounded-2xl border border-[#203357] bg-[#172644]/90 p-3.5 backdrop-blur-sm">
                  <Truck className="h-5 w-5 text-sky-400 mb-1.5" />
                  <div className="text-xs font-extrabold text-[#F5F2EB]">All 7 Emirates</div>
                  <div className="text-[10px] text-[#B0BECE]">Same-day Dubai courier</div>
                </div>
              </div>
            </Reveal>

            {/* Main Action CTAs */}
            <Reveal delay={0.3}>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
                <a
                  href={getServiceWhatsAppUrl('stamps', stampInquiryDetails)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackWhatsAppClick({
                      source_page: '/categories/stamps-printing-dubai',
                      product_name: selectedType.name,
                      button_location: 'hero_primary_whatsapp',
                      label: 'hero_whatsapp_quote',
                    })
                  }
                  className="flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] px-7 py-4 text-sm font-black text-white shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5 cursor-pointer"
                >
                  <WhatsAppIcon className="h-5 w-5 fill-white shrink-0" />
                  <span>Order on WhatsApp (Instant Quote)</span>
                </a>

                <a
                  href="#stamp-customizer"
                  className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-[#203357] bg-[#172644] hover:bg-[#203357] hover:border-[#D4AF65] px-6 py-4 text-sm font-bold text-[#F5F2EB] transition-all cursor-pointer"
                >
                  <span>Interactive Stamp Customizer</span>
                  <ArrowRight className="h-4 w-4 text-[#D4AF65]" />
                </a>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* 4. Interactive Stamp Customizer & Live Visual Impression Preview */}
      <section id="stamp-customizer" className="py-16 sm:py-24 border-b border-[#203357] bg-[#12203B]/60">
        <Container>
          <div className="mb-10 text-center max-w-3xl mx-auto">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#D4AF65]">
              STEP-BY-STEP STAMP BUILDER
            </span>
            <h2 className="font-display mt-2 text-2xl sm:text-4xl font-extrabold text-[#F5F2EB]">
              Configure Your Custom Stamp &amp; Get Price on WhatsApp
            </h2>
            <p className="mt-3 text-sm text-[#B0BECE]">
              Select your stamp model, size, ink color, and preview your company layout in real time. We prepare your prefilled WhatsApp inquiry with zero guesswork.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Interactive Configurator Controls */}
            <div className="lg:col-span-7 space-y-6">
              {/* 1. Stamp Type Selector */}
              <div className="rounded-3xl border border-[#203357] bg-[#172644] p-5 sm:p-6 shadow-md">
                <label className="block text-xs font-black uppercase tracking-wider text-[#D4AF65] mb-3">
                  1. Choose Stamp Category / Type
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[340px] overflow-y-auto pr-1">
                  {STAMP_TYPES.map((type) => {
                    const isSelected = selectedType.id === type.id
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => handleTypeChange(type)}
                        className={`text-left p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'border-[#D4AF65] bg-[#101D35] ring-2 ring-[#D4AF65]/30'
                            : 'border-[#203357] bg-[#101D35]/60 hover:border-[#D4AF65]/60 hover:bg-[#101D35]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <span className="text-xs font-bold text-[#F5F2EB] leading-tight">
                            {type.name}
                          </span>
                          <span className="rounded bg-[#D4AF65]/15 border border-[#D4AF65]/30 text-[#D4AF65] px-1.5 py-0.5 text-[9px] font-black shrink-0">
                            AED {type.basePrice}
                          </span>
                        </div>
                        <p className="text-[10px] text-[#B0BECE] line-clamp-1 mb-2">
                          {type.tagline}
                        </p>
                        <div className="flex items-center justify-between text-[9px] text-emerald-400 font-semibold pt-1 border-t border-[#203357]">
                          <span>{type.turnaround}</span>
                          <span className="text-[#B0BECE]">{type.badge}</span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* 2. Casing Brand & Dimensions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-3xl border border-[#203357] bg-[#172644] p-5 shadow-md">
                  <label className="block text-xs font-black uppercase tracking-wider text-[#D4AF65] mb-2.5">
                    2. Casing &amp; Mechanism
                  </label>
                  <div className="space-y-1.5">
                    {selectedType.brands.map((brand) => (
                      <button
                        key={brand}
                        type="button"
                        onClick={() => setSelectedBrand(brand)}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                          selectedBrand === brand
                            ? 'border-[#D4AF65] bg-[#101D35] text-[#D4AF65]'
                            : 'border-[#203357] bg-[#101D35]/50 text-[#F5F2EB] hover:border-[#D4AF65]/50'
                        }`}
                      >
                        <span>{brand}</span>
                        {selectedBrand === brand && <Check className="h-3.5 w-3.5 text-[#D4AF65]" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-[#203357] bg-[#172644] p-5 shadow-md">
                  <label className="block text-xs font-black uppercase tracking-wider text-[#D4AF65] mb-2.5">
                    3. Dimension / Impression Size
                  </label>
                  <div className="space-y-1.5">
                    {selectedType.defaultSizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                          selectedSize === size
                            ? 'border-[#D4AF65] bg-[#101D35] text-[#D4AF65]'
                            : 'border-[#203357] bg-[#101D35]/50 text-[#F5F2EB] hover:border-[#D4AF65]/50'
                        }`}
                      >
                        <span>{size}</span>
                        {selectedSize === size && <Check className="h-3.5 w-3.5 text-[#D4AF65]" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. Official Ink Colors */}
              <div className="rounded-3xl border border-[#203357] bg-[#172644] p-5 sm:p-6 shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-xs font-black uppercase tracking-wider text-[#D4AF65]">
                    4. Select Document Ink Color
                  </label>
                  <span className="text-[11px] font-bold text-sky-400">
                    Selected: {selectedInk.name}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {INK_COLORS.map((ink) => {
                    const isSelected = selectedInk.id === ink.id
                    return (
                      <button
                        key={ink.id}
                        type="button"
                        onClick={() => setSelectedInk(ink)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'border-[#D4AF65] bg-[#101D35] ring-2 ring-[#D4AF65]/30'
                            : 'border-[#203357] bg-[#101D35]/50 hover:border-[#D4AF65]/50'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <span
                            className="h-4 w-4 rounded-full border border-white/30 shadow-xs shrink-0"
                            style={{ backgroundColor: ink.hex }}
                          />
                          <span className="text-xs font-bold text-[#F5F2EB] truncate">
                            {ink.name}
                          </span>
                        </div>
                        <span className="text-[9px] text-[#B0BECE] line-clamp-1">
                          {ink.tag}
                        </span>
                      </button>
                    )
                  })}
                </div>
                <p className="mt-3 text-[11px] text-[#B0BECE] flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                  <span>Blue ink is recommended by UAE commercial banks &amp; notary departments for immediate authenticity verification.</span>
                </p>
              </div>

              {/* 4. Company Stamp Details Form */}
              <div className="rounded-3xl border border-[#203357] bg-[#172644] p-5 sm:p-6 shadow-md space-y-4">
                <label className="block text-xs font-black uppercase tracking-wider text-[#D4AF65]">
                  5. Stamp Inscription Details (English &amp; Arabic)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-[#B0BECE] mb-1">
                      Company Name (English)
                    </label>
                    <input
                      type="text"
                      value={companyNameEng}
                      onChange={(e) => setCompanyNameEng(e.target.value)}
                      placeholder="e.g. ABC TRADING L.L.C"
                      className="w-full rounded-xl border border-[#203357] bg-[#101D35] px-3.5 py-2.5 text-xs font-semibold text-[#F5F2EB] focus:border-[#D4AF65] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#B0BECE] mb-1">
                      Company Name (Arabic)
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      value={companyNameAr}
                      onChange={(e) => setCompanyNameAr(e.target.value)}
                      placeholder="اسم الشركة بالعربية كما في الرخصة"
                      className="w-full rounded-xl border border-[#203357] bg-[#101D35] px-3.5 py-2.5 text-xs font-semibold text-[#F5F2EB] focus:border-[#D4AF65] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#B0BECE] mb-1">
                      Trade License No. (DED / Freezone)
                    </label>
                    <input
                      type="text"
                      value={tradeLicenseNo}
                      onChange={(e) => setTradeLicenseNo(e.target.value)}
                      placeholder="e.g. CN-1094821 / 589201"
                      className="w-full rounded-xl border border-[#203357] bg-[#101D35] px-3.5 py-2.5 text-xs font-semibold text-[#F5F2EB] focus:border-[#D4AF65] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#B0BECE] mb-1">
                      Tax Registration No. (TRN - 15 digits)
                    </label>
                    <input
                      type="text"
                      value={trnNumber}
                      onChange={(e) => setTrnNumber(e.target.value)}
                      placeholder="e.g. 100234567800003"
                      className="w-full rounded-xl border border-[#203357] bg-[#101D35] px-3.5 py-2.5 text-xs font-semibold text-[#F5F2EB] focus:border-[#D4AF65] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-[#203357]">
                  <div>
                    <label className="block text-[11px] font-bold text-[#B0BECE] mb-1">
                      Your Name / Authorized Contact (Optional)
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Ahmed Al Mansoori"
                      className="w-full rounded-xl border border-[#203357] bg-[#101D35] px-3.5 py-2.5 text-xs font-semibold text-[#F5F2EB] focus:border-[#D4AF65] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#B0BECE] mb-1">
                      UAE Delivery Emirate
                    </label>
                    <select
                      value={deliveryLocation}
                      onChange={(e) => setDeliveryLocation(e.target.value)}
                      className="w-full rounded-xl border border-[#203357] bg-[#101D35] px-3.5 py-2.5 text-xs font-semibold text-[#F5F2EB] focus:border-[#D4AF65] focus:outline-none"
                    >
                      <option value="Dubai">Dubai (Same-Day Express Courier)</option>
                      <option value="Abu Dhabi">Abu Dhabi (Next-Day Doorstep Delivery)</option>
                      <option value="Sharjah">Sharjah (Same-Day / Next-Day Delivery)</option>
                      <option value="Ajman">Ajman (Next-Day Courier)</option>
                      <option value="Ras Al Khaimah">Ras Al Khaimah (Next-Day Courier)</option>
                      <option value="Fujairah">Fujairah (Next-Day Courier)</option>
                      <option value="Umm Al Quwain">Umm Al Quwain (Next-Day Courier)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 5. Quantity & Volume Tiers */}
              <div className="rounded-3xl border border-[#203357] bg-[#172644] p-5 sm:p-6 shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-xs font-black uppercase tracking-wider text-[#D4AF65]">
                    6. Order Quantity &amp; Corporate Fleet Discounts
                  </label>
                  {selectedQty.discount > 0 && (
                    <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-2.5 py-0.5 text-xs font-extrabold">
                      🎉 {selectedQty.discount}% Volume Savings Applied
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 min-[440px]:grid-cols-5 gap-2">
                  {QUANTITY_TIERS.map((tier) => {
                    const isSelected = selectedQty.qty === tier.qty
                    return (
                      <button
                        key={tier.qty}
                        type="button"
                        onClick={() => setSelectedQty(tier)}
                        className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                          isSelected
                            ? 'border-[#D4AF65] bg-[#D4AF65] text-[#101D35] font-black shadow-md'
                            : 'border-[#203357] bg-[#101D35] text-[#B0BECE] hover:border-[#D4AF65] hover:text-[#F5F2EB]'
                        }`}
                      >
                        <span className="text-xs font-extrabold">{tier.label}</span>
                        {tier.discount > 0 && (
                          <span className={`text-[10px] font-bold ${isSelected ? 'text-[#101D35]/90' : 'text-emerald-400'}`}>
                            Save {tier.discount}%
                          </span>
                        )}
                        <span className="text-[9px] opacity-75 mt-0.5">{tier.tag}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Right: Live Stamp Impression Digital Preview & WhatsApp Dispatcher */}
            <div className="lg:col-span-5 sticky top-24 space-y-5">
              {/* Live Preview Canvas Card */}
              <div className="rounded-3xl border border-[#203357] bg-[#172644] p-6 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-[#203357]">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#D4AF65] flex items-center gap-1.5">
                    <Stamp className="h-4 w-4" />
                    <span>Real-Time Digital Stamp Proof</span>
                  </span>
                  <span className="rounded-full bg-[#101D35] border border-[#203357] px-2 py-0.5 text-[10px] font-bold text-[#B0BECE]">
                    {selectedInk.name}
                  </span>
                </div>

                {/* Simulated Paper Texture Stage */}
                <div className="my-5 rounded-2xl bg-[#F5F2EB] p-6 sm:p-8 flex items-center justify-center min-h-[260px] shadow-inner relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#101D35_1px,transparent_1px)] [background-size:12px_12px]" />

                  {selectedType.shape === 'round' ? (
                    /* Circular Impression Preview */
                    <div
                      className="relative rounded-full border-4 flex flex-col items-center justify-center p-4 text-center select-none transition-all duration-300 aspect-square w-52 sm:w-60 shadow-xs"
                      style={{
                        borderColor: selectedInk.hex,
                        color: selectedInk.hex,
                      }}
                    >
                      {/* Outer concentric thin ring */}
                      <div
                        className="absolute inset-1.5 rounded-full border-2 border-dashed opacity-80"
                        style={{ borderColor: selectedInk.hex }}
                      />

                      {/* Top Arabic Arc Text */}
                      <div className="text-[10px] font-bold tracking-tight px-3 truncate max-w-[190px] pt-1">
                        {companyNameAr || 'اسم الشركة بالعربية'}
                      </div>

                      {/* Center Emblem Icon & Star */}
                      <div className="my-1.5 flex items-center gap-1.5 text-xs font-black">
                        <span>★</span>
                        <Stamp className="h-5 w-5" />
                        <span>★</span>
                      </div>

                      {/* Trade License & Date Center */}
                      <div className="text-[9px] font-extrabold uppercase tracking-wider border-y border-current py-0.5 my-0.5 px-2">
                        LIC: {tradeLicenseNo || 'DUBAI DED'}
                      </div>

                      {/* Bottom English Arc Text */}
                      <div className="text-[10px] font-black uppercase tracking-tight px-3 truncate max-w-[190px] pb-1">
                        {companyNameEng || 'COMPANY LEGAL NAME'}
                      </div>
                    </div>
                  ) : (
                    /* Rectangular Impression Preview */
                    <div
                      className="relative rounded-xl border-3 flex flex-col justify-center p-4 select-none transition-all duration-300 w-full max-w-[280px] shadow-xs text-center"
                      style={{
                        borderColor: selectedInk.hex,
                        color: selectedInk.hex,
                      }}
                    >
                      <div className="absolute inset-1 rounded-lg border border-dotted opacity-70" style={{ borderColor: selectedInk.hex }} />
                      
                      <div className="text-xs font-black uppercase tracking-wide truncate mb-0.5">
                        {companyNameEng || 'COMPANY LEGAL NAME L.L.C'}
                      </div>

                      <div className="text-[11px] font-bold truncate mb-1">
                        {companyNameAr || 'اسم الشركة بالعربية'}
                      </div>

                      <div className="flex items-center justify-center gap-2 text-[10px] font-extrabold border-y border-current py-0.5 my-1">
                        <span>LIC: {tradeLicenseNo || '1094821'}</span>
                        <span>•</span>
                        <span>TRN: {trnNumber ? trnNumber.slice(0, 10) + '...' : '1002345678'}</span>
                      </div>

                      <div className="text-[9px] font-bold text-current/90 mt-0.5">
                        P.O. BOX: 48920 &bull; {deliveryLocation.toUpperCase()}, UAE
                      </div>

                      <div className="mt-1 pt-1 border-t border-dashed border-current text-[8px] font-bold uppercase tracking-wider">
                        Authorized Signatory &bull; التوقيع المعتمد
                      </div>
                    </div>
                  )}
                </div>

                {/* Pricing & Estimation Summary */}
                <div className="rounded-2xl border border-[#203357] bg-[#101D35] p-4 space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-[#B0BECE]">
                    <span>Stamp Model:</span>
                    <span className="font-bold text-[#F5F2EB]">{selectedType.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#B0BECE]">
                    <span>Casing &amp; Size:</span>
                    <span className="font-bold text-[#F5F2EB]">{selectedBrand} &bull; {selectedSize.split(' ')[0]}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#B0BECE]">
                    <span>Ink Color:</span>
                    <span className="font-bold" style={{ color: selectedInk.hex }}>{selectedInk.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#B0BECE]">
                    <span>Quantity:</span>
                    <span className="font-bold text-[#F5F2EB]">{selectedQty.label}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#B0BECE]">
                    <span>Prepress Vector QC:</span>
                    <span className="font-bold text-emerald-400">Free Vector Check Included</span>
                  </div>

                  <div className="pt-2.5 border-t border-[#203357] flex items-baseline justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-[#B0BECE]">Estimated Total (AED):</span>
                      <div className="text-[10px] text-emerald-400">Inclusive of VAT &bull; Same-Day Dispatch</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-[#D4AF65]">
                        AED {calculatedTotalPrice}
                      </div>
                      {selectedQty.qty > 1 && (
                        <div className="text-[10px] text-[#B0BECE]">
                          (AED {calculatedUnitPrice} / stamp)
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Primary High-Converting CTAs */}
                <div className="mt-5 space-y-2.5">
                  <a
                    href={getServiceWhatsAppUrl('stamps', stampInquiryDetails)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      trackWhatsAppClick({
                        source_page: '/categories/stamps-printing-dubai',
                        product_name: selectedType.name,
                        button_location: 'customizer_whatsapp_order',
                        label: `customizer_order_${selectedType.slug}`,
                      })
                    }
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] py-4 text-sm font-black text-white shadow-lg shadow-emerald-600/25 transition-all hover:-translate-y-0.5 cursor-pointer"
                  >
                    <WhatsAppIcon className="h-5 w-5 fill-white shrink-0" />
                    <span>Order on WhatsApp (Ref #{selectedType.slug})</span>
                  </a>

                  <Link
                    to="/get-a-quote"
                    state={{
                      product: selectedType.name,
                      category: 'Custom Stamps & Seals',
                      quantity: selectedQty.qty,
                      size: selectedSize,
                      ink: selectedInk.name,
                      notes: `Stamp text: ${companyNameEng} | Lic: ${tradeLicenseNo} | TRN: ${trnNumber}. Brand: ${selectedBrand}`,
                    }}
                    onClick={() => trackGetQuoteClick({ source_page: 'stamps_customizer', product_name: selectedType.name })}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#203357] bg-[#101D35] hover:bg-[#203357] py-3 text-xs font-extrabold text-[#F5F2EB] transition-colors cursor-pointer"
                  >
                    <FileText className="h-4 w-4 text-[#D4AF65]" />
                    <span>Request Official Corporate Tax Quotation</span>
                  </Link>
                </div>

                <div className="mt-4 pt-3 border-t border-[#203357] flex items-center justify-between text-[10px] text-[#B0BECE]">
                  <span className="flex items-center gap-1 font-semibold text-[#F5F2EB]">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Prepress digital proof before laser cut</span>
                  </span>
                  <span className="font-bold text-[#D4AF65]">Al Quoz Pressroom</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 5. Complete Stamp Products Catalog Showcase */}
      <section className="py-16 sm:py-24 border-b border-[#203357]">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-[11px] font-black uppercase tracking-widest text-[#D4AF65]">
                GENUINE DUBAI STAMP PORTFOLIO
              </span>
              <h2 className="font-display mt-2 text-2xl sm:text-4xl font-extrabold text-[#F5F2EB]">
                Explore All 10 Certified Stamp &amp; Seal Models
              </h2>
              <p className="mt-2 text-sm text-[#B0BECE] max-w-xl">
                Every stamp is manufactured with laser-etched vulcanized rubber and backed by our express turnaround in Dubai.
              </p>
            </div>

            {/* Catalog Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl border border-[#203357] bg-[#172644]">
              {[
                { id: 'all', label: 'All 10 Models' },
                { id: 'round', label: 'Round Seals' },
                { id: 'rect', label: 'Office Rectangles' },
                { id: 'specialty', label: 'Daters, Pocket & Wax' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setCatalogFilter(tab.id)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                    catalogFilter === tab.id
                      ? 'bg-[#D4AF65] text-[#101D35] shadow-xs'
                      : 'text-[#B0BECE] hover:text-[#F5F2EB]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                className="group rounded-3xl border border-[#203357] bg-[#172644] overflow-hidden flex flex-col justify-between hover:border-[#D4AF65]/60 hover:shadow-xl transition-all duration-300"
              >
                <div>
                  {/* Image Stage */}
                  <div className="relative aspect-video overflow-hidden bg-[#101D35]">
                    <img
                      src={prod.image || getProductImage({ slug: prod.slug })}
                      alt={`${prod.name} Dubai maker`}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="rounded-full bg-[#101D35]/90 border border-[#203357] backdrop-blur-md px-2.5 py-0.5 text-[10px] font-black text-[#D4AF65]">
                        {prod.badge}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="rounded-full bg-emerald-500/90 text-white px-2.5 py-0.5 text-[10px] font-extrabold shadow-xs">
                        {prod.turnaround}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 sm:p-6">
                    <div className="flex items-baseline justify-between mb-1.5">
                      <span className="text-[11px] font-bold text-[#D4AF65] uppercase tracking-wider">
                        Starting from
                      </span>
                      <span className="text-lg font-black text-[#F5F2EB]">
                        AED {prod.basePrice}
                      </span>
                    </div>

                    <h3 className="font-display text-lg font-extrabold text-[#F5F2EB] group-hover:text-[#D4AF65] transition-colors leading-snug">
                      {prod.name}
                    </h3>
                    <p className="text-[11px] text-[#D4AF65]/80 font-bold mt-0.5 mb-2.5" dir="rtl">
                      {prod.arabicName}
                    </p>
                    <p className="text-xs text-[#B0BECE] leading-relaxed mb-4">
                      {prod.tagline}
                    </p>

                    {/* Features checklist */}
                    <div className="space-y-1.5 pt-3 border-t border-[#203357] text-[11px] text-[#B0BECE]">
                      <div className="flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        <span>Casings: {prod.brands.slice(0, 2).join(' &bull; ')}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        <span>Sizes: {prod.defaultSizes.slice(0, 2).join(', ')}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        <span>Blue, Black, Red, Green &amp; Violet inks</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action CTAs */}
                <div className="p-5 sm:p-6 pt-0 border-t border-[#203357]/60 flex items-center gap-2">
                  <a
                    href={getServiceWhatsAppUrl('stamps', {
                      productName: prod.name,
                      stampType: prod.name,
                      quantity: 1,
                      pageUrl: `https://www.0nprint.com/products/${prod.slug}`,
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      trackWhatsAppClick({
                        source_page: '/categories/stamps-printing-dubai',
                        product_name: prod.name,
                        button_location: 'catalog_card_whatsapp',
                        label: `card_whatsapp_${prod.slug}`,
                      })
                    }
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] py-2.5 text-xs font-black text-white transition-colors cursor-pointer"
                  >
                    <WhatsAppIcon className="h-4 w-4 fill-white shrink-0" />
                    <span>WhatsApp Quote</span>
                  </a>

                  <Link
                    to={`/products/${prod.slug}`}
                    className="flex items-center justify-center rounded-xl border border-[#203357] bg-[#101D35] hover:border-[#D4AF65] hover:text-[#D4AF65] px-3 py-2.5 text-xs font-bold text-[#F5F2EB] transition-colors"
                  >
                    <span>Details</span>
                    <ArrowRight className="h-3.5 w-3.5 ml-1 text-[#D4AF65]" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 6. UAE Legal & Trade License Compliance Guide (GEO & AEO Authority) */}
      <section className="py-16 sm:py-24 border-b border-[#203357] bg-[#172644]/40">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-400">
                <ShieldCheck className="h-4 w-4" />
                <span>UAE LEGAL VERIFICATION STANDARD</span>
              </div>
              <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-[#F5F2EB] leading-tight">
                Why Official Company Stamps in Dubai Require Legal Trade License Verification
              </h2>
              <p className="text-sm text-[#B0BECE] leading-relaxed">
                Under UAE Commercial Companies Law, a company stamp possesses legal binding power on contracts, bank accounts, government tenders, and lease agreements. To protect UAE businesses against fraudulent stamp replication and corporate identity theft, ONPRINT adheres strictly to DED and Free Zone manufacturing guidelines.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 rounded-2xl border border-[#203357] bg-[#172644] p-4">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#101D35] text-[#D4AF65] border border-[#203357] shrink-0 font-black text-xs">
                    1
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#F5F2EB]">Valid UAE Trade License Copy</h4>
                    <p className="text-[11px] text-[#B0BECE] mt-0.5">
                      Mainland (Dubai Department of Economy &amp; Tourism) or Free Zone (DMCC, JAFZA, DAFZA, IFZA, Shams, RAKEZ, etc.) verifying legal trade name and activities.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-[#203357] bg-[#172644] p-4">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#101D35] text-[#D4AF65] border border-[#203357] shrink-0 font-black text-xs">
                    2
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#F5F2EB]">Signatory Authorization Letter or Emirates ID</h4>
                    <p className="text-[11px] text-[#B0BECE] mt-0.5">
                      Authorization on official company letterhead signed by the authorized manager, or a copy of the manager's Emirates ID confirming permission to manufacture the stamp.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                  <CheckCircle2 className="h-6 w-6 text-emerald-400 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-emerald-300">Non-Regulated Stamps Do Not Require Trade Licenses</h4>
                    <p className="text-[11px] text-[#B0BECE] mt-0.5">
                      Personal name stamps, medical doctor license stamps, generic office markers (PAID, RECEIVED, APPROVED, DRAFT), and personal wax seal crests can be ordered immediately without a trade license.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Technical Features Card */}
            <div className="lg:col-span-6 rounded-3xl border border-[#203357] bg-[#172644] p-6 sm:p-8 space-y-6">
              <h3 className="font-display text-xl font-bold text-[#F5F2EB] flex items-center gap-2">
                <Award className="h-5 w-5 text-[#D4AF65]" />
                <span>Technical Specifications &amp; Quality Guarantee</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="rounded-2xl border border-[#203357] bg-[#101D35] p-4">
                  <div className="text-[#D4AF65] font-extrabold mb-1">1000 DPI Laser Die</div>
                  <p className="text-[#B0BECE] text-[11px]">
                    Computer-controlled laser ablation on odorless vulcanized rubber ensures microscopic clarity without ink smudging.
                  </p>
                </div>
                <div className="rounded-2xl border border-[#203357] bg-[#101D35] p-4">
                  <div className="text-sky-400 font-extrabold mb-1">Document-Proof Ink</div>
                  <p className="text-[#B0BECE] text-[11px]">
                    Certified to ISO 14145-2 anti-fraud standard. Non-toxic, archival, water-resistant, and indelible on standard bond papers.
                  </p>
                </div>
                <div className="rounded-2xl border border-[#203357] bg-[#101D35] p-4">
                  <div className="text-emerald-400 font-extrabold mb-1">10,000+ Impressions</div>
                  <p className="text-[#B0BECE] text-[11px]">
                    Built-in high-capacity ink pad delivers thousands of crisp stamps. Slide-out replacement pads are readily available.
                  </p>
                </div>
                <div className="rounded-2xl border border-[#203357] bg-[#101D35] p-4">
                  <div className="text-[#D4AF65] font-extrabold mb-1">Bilingual Typography</div>
                  <p className="text-[#B0BECE] text-[11px]">
                    Precise digital typesetting in official Arabic and English with harmonious weight balance and correct legal nomenclature.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-[#203357] bg-[#101D35] p-4 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#F5F2EB]">Have an urgent rush stamp requirement?</div>
                  <div className="text-[11px] text-[#B0BECE]">Contact our Al Quoz pressroom directly for 2-hour turnaround.</div>
                </div>
                <a
                  href={`tel:${WHATSAPP_PHONE}`}
                  className="rounded-xl bg-[#D4AF65] text-[#101D35] px-4 py-2 text-xs font-black hover:bg-[#C8B185] transition-colors shrink-0"
                >
                  Call Pressroom
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 7. Stamp Types Comparison Matrix */}
      <section className="py-16 sm:py-24 border-b border-[#203357]">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#D4AF65]">
              BUYER'S COMPARISON MATRIX
            </span>
            <h2 className="font-display mt-2 text-2xl sm:text-4xl font-extrabold text-[#F5F2EB]">
              Choose the Perfect Stamp Mechanism for Your Office
            </h2>
            <p className="mt-2 text-sm text-[#B0BECE]">
              Compare mechanisms, typical lifespans, and best use cases for corporate applications across Dubai.
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-[#203357] bg-[#172644] shadow-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#101D35] text-[#D4AF65] uppercase tracking-wider text-[10px] font-black border-b border-[#203357]">
                <tr>
                  <th className="p-4 sm:p-5">Stamp Type</th>
                  <th className="p-4 sm:p-5">Mechanism</th>
                  <th className="p-4 sm:p-5">Impression Lifespan</th>
                  <th className="p-4 sm:p-5">Best Used For</th>
                  <th className="p-4 sm:p-5">Turnaround</th>
                  <th className="p-4 sm:p-5 text-right">Starting Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#203357] text-[#B0BECE]">
                <tr className="hover:bg-[#101D35]/50 transition-colors">
                  <td className="p-4 sm:p-5 font-bold text-[#F5F2EB]">Round Corporate Seal</td>
                  <td className="p-4 sm:p-5">Self-inking rotational die</td>
                  <td className="p-4 sm:p-5">10,000+ impressions</td>
                  <td className="p-4 sm:p-5">LLC agreements, bank accounts, official contracts</td>
                  <td className="p-4 sm:p-5 text-emerald-400 font-bold">2-Hour Express</td>
                  <td className="p-4 sm:p-5 text-right font-black text-[#D4AF65]">AED 95</td>
                </tr>
                <tr className="hover:bg-[#101D35]/50 transition-colors">
                  <td className="p-4 sm:p-5 font-bold text-[#F5F2EB]">Rectangular Office Stamp</td>
                  <td className="p-4 sm:p-5">Built-in pad self-inking</td>
                  <td className="p-4 sm:p-5">10,000+ impressions</td>
                  <td className="p-4 sm:p-5">Commercial invoices, delivery notes, PO box details</td>
                  <td className="p-4 sm:p-5 text-emerald-400 font-bold">2-Hour Express</td>
                  <td className="p-4 sm:p-5 text-right font-black text-[#D4AF65]">AED 85</td>
                </tr>
                <tr className="hover:bg-[#101D35]/50 transition-colors">
                  <td className="p-4 sm:p-5 font-bold text-[#F5F2EB]">Heavy-Duty Dater Machine</td>
                  <td className="p-4 sm:p-5">Steel-core rotating wheels</td>
                  <td className="p-4 sm:p-5">15,000+ impressions</td>
                  <td className="p-4 sm:p-5">Accounting received, payment approvals, warehouse log</td>
                  <td className="p-4 sm:p-5 text-sky-400 font-bold">Same-Day</td>
                  <td className="p-4 sm:p-5 text-right font-black text-[#D4AF65]">AED 130</td>
                </tr>
                <tr className="hover:bg-[#101D35]/50 transition-colors">
                  <td className="p-4 sm:p-5 font-bold text-[#F5F2EB]">Pocket Mobile Stamp</td>
                  <td className="p-4 sm:p-5">Slide-open portable format</td>
                  <td className="p-4 sm:p-5">5,000+ impressions</td>
                  <td className="p-4 sm:p-5">Doctors, engineers, lawyers, mobile executives</td>
                  <td className="p-4 sm:p-5 text-emerald-400 font-bold">2-Hour Express</td>
                  <td className="p-4 sm:p-5 text-right font-black text-[#D4AF65]">AED 95</td>
                </tr>
                <tr className="hover:bg-[#101D35]/50 transition-colors">
                  <td className="p-4 sm:p-5 font-bold text-[#F5F2EB]">VAT &amp; TRN Tax Stamp</td>
                  <td className="p-4 sm:p-5">Pre-formatted FTA box</td>
                  <td className="p-4 sm:p-5">10,000+ impressions</td>
                  <td className="p-4 sm:p-5">Tax invoices, credit notes, customs clearing</td>
                  <td className="p-4 sm:p-5 text-emerald-400 font-bold">2-Hour Express</td>
                  <td className="p-4 sm:p-5 text-right font-black text-[#D4AF65]">AED 85</td>
                </tr>
                <tr className="hover:bg-[#101D35]/50 transition-colors">
                  <td className="p-4 sm:p-5 font-bold text-[#F5F2EB]">Luxury Brass Wax Seal</td>
                  <td className="p-4 sm:p-5">Solid CNC brass + hot wax</td>
                  <td className="p-4 sm:p-5">Lifetime brass durability</td>
                  <td className="p-4 sm:p-5">VIP certificates, luxury packaging, wedding stationery</td>
                  <td className="p-4 sm:p-5 text-amber-400 font-bold">24–48 Hours</td>
                  <td className="p-4 sm:p-5 text-right font-black text-[#D4AF65]">AED 160</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      {/* 8. Geographic Reach & Dubai Delivery Coverage */}
      <section className="py-16 sm:py-20 border-b border-[#203357] bg-[#12203B]/40">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center sm:text-left">
            <div className="rounded-3xl border border-[#203357] bg-[#172644] p-6">
              <MapPin className="h-6 w-6 text-[#D4AF65] mb-3" />
              <h3 className="font-display text-base font-extrabold text-[#F5F2EB]">
                Al Quoz Pressroom Express Pickup
              </h3>
              <p className="mt-2 text-xs text-[#B0BECE] leading-relaxed">
                Central Al Quoz Industrial Area 3 location. Ready in 2 hours for collection once your trade license and proof are confirmed.
              </p>
            </div>

            <div className="rounded-3xl border border-[#203357] bg-[#172644] p-6">
              <Truck className="h-6 w-6 text-sky-400 mb-3" />
              <h3 className="font-display text-base font-extrabold text-[#F5F2EB]">
                Same-Day Courier Across Dubai
              </h3>
              <p className="mt-2 text-xs text-[#B0BECE] leading-relaxed">
                Doorstep dispatch to Downtown, Business Bay, DIFC, Dubai Marina, JLT, Deira, Bur Dubai, Silicon Oasis, and JAFZA.
              </p>
            </div>

            <div className="rounded-3xl border border-[#203357] bg-[#172644] p-6">
              <Building2 className="h-6 w-6 text-emerald-400 mb-3" />
              <h3 className="font-display text-base font-extrabold text-[#F5F2EB]">
                UAE-Wide Doorstep Delivery
              </h3>
              <p className="mt-2 text-xs text-[#B0BECE] leading-relaxed">
                Tracked courier service across Abu Dhabi, Sharjah, Ajman, Ras Al Khaimah, Fujairah, and Umm Al Quwain within 24 business hours.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 9. Authentic Pre-Purchase FAQ Accordion */}
      <section className="py-16 sm:py-24 border-b border-[#203357]">
        <Container className="max-w-4xl">
          <div className="text-center mb-12">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#D4AF65]">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="font-display mt-2 text-2xl sm:text-4xl font-extrabold text-[#F5F2EB]">
              Frequently Asked Questions About Company Stamps in Dubai
            </h2>
            <p className="mt-2 text-sm text-[#B0BECE]">
              Everything you need to know about trade licenses, legal requirements, ink colors, and turnaround times.
            </p>
          </div>

          <div className="space-y-3">
            {STAMP_FAQS.map((faq, index) => {
              const isOpen = activeFaq === index
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-[#203357] bg-[#172644] overflow-hidden transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? -1 : index)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-xs sm:text-sm font-bold text-[#F5F2EB] hover:text-[#D4AF65] transition-colors cursor-pointer"
                  >
                    <span className="pr-4">{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 text-[#D4AF65] shrink-0" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-[#B0BECE] shrink-0" />
                    )}
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="px-4 sm:px-5 pb-5 pt-1 text-xs text-[#B0BECE] leading-relaxed border-t border-[#203357]/60"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </Container>
      </section>

      {/* 10. Internal Links to Complementary Business Printing Services */}
      <section className="py-16 sm:py-20 border-b border-[#203357] bg-[#172644]/60">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#D4AF65]">
              COMPLETE CORPORATE STATIONERY SUITE
            </span>
            <h2 className="font-display mt-2 text-2xl sm:text-3xl font-extrabold text-[#F5F2EB]">
              Pair Your Company Stamp with Executive Office Printing
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#B0BECE]">
              Complement your company seal with matching luxury business cards, executive letterheads, and official stationery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/business-card-printing-dubai"
              className="rounded-2xl border border-[#203357] bg-[#101D35] p-5 hover:border-[#D4AF65] transition-all group flex flex-col justify-between"
            >
              <div>
                <CreditCard className="h-6 w-6 text-[#D4AF65] mb-2" />
                <h3 className="text-sm font-extrabold text-[#F5F2EB] group-hover:text-[#D4AF65] transition-colors">
                  Luxury Business Cards
                </h3>
                <p className="text-[11px] text-[#B0BECE] mt-1 leading-snug">
                  450–600 GSM velvet soft-touch, 24K hot gold foil, and raised 3D spot UV.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-[11px] font-bold text-[#D4AF65]">
                <span>Explore Cards</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              to="/categories/letterheads-printing-dubai"
              className="rounded-2xl border border-[#203357] bg-[#101D35] p-5 hover:border-[#D4AF65] transition-all group flex flex-col justify-between"
            >
              <div>
                <FileText className="h-6 w-6 text-[#D4AF65] mb-2" />
                <h3 className="text-sm font-extrabold text-[#F5F2EB] group-hover:text-[#D4AF65] transition-colors">
                  Official Letterheads
                </h3>
                <p className="text-[11px] text-[#B0BECE] mt-1 leading-snug">
                  120 GSM premium bond and textured linen stationery with optional gold foil crests.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-[11px] font-bold text-[#D4AF65]">
                <span>View Letterheads</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              to="/categories/office-stationery-printing"
              className="rounded-2xl border border-[#203357] bg-[#101D35] p-5 hover:border-[#D4AF65] transition-all group flex flex-col justify-between"
            >
              <div>
                <Building2 className="h-6 w-6 text-[#D4AF65] mb-2" />
                <h3 className="text-sm font-extrabold text-[#F5F2EB] group-hover:text-[#D4AF65] transition-colors">
                  Corporate Stationery
                </h3>
                <p className="text-[11px] text-[#B0BECE] mt-1 leading-snug">
                  Printed envelopes (DL, C5, C4), presentation folders, and carbonless NCR books.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-[11px] font-bold text-[#D4AF65]">
                <span>Stationery Suite</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              to="/finishes"
              className="rounded-2xl border border-[#203357] bg-[#101D35] p-5 hover:border-[#D4AF65] transition-all group flex flex-col justify-between"
            >
              <div>
                <Palette className="h-6 w-6 text-[#D4AF65] mb-2" />
                <h3 className="text-sm font-extrabold text-[#F5F2EB] group-hover:text-[#D4AF65] transition-colors">
                  Luxury Finishes
                </h3>
                <p className="text-[11px] text-[#B0BECE] mt-1 leading-snug">
                  Explore 24K hot foil stamping, blind debossing, and edge painting techniques.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-[11px] font-bold text-[#D4AF65]">
                <span>Showcase</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </Container>
      </section>

      {/* 11. Final High-Impact Bottom WhatsApp Conversion Bar */}
      <section className="py-12 bg-gradient-to-r from-[#172644] via-[#101D35] to-[#172644] border-t border-[#203357]">
        <Container>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF65]">
                NEED ASSISTANCE OR ARTWORK REVIEW?
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#F5F2EB] mt-1">
                Chat Directly with our Al Quoz Prepress Stamp Specialists
              </h3>
              <p className="text-xs text-[#B0BECE] mt-1">
                Send your Trade License or draft artwork on WhatsApp for a digital proof in under 15 minutes.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <a
                href={getServiceWhatsAppUrl('stamps', stampInquiryDetails)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackWhatsAppClick({
                    source_page: '/categories/stamps-printing-dubai',
                    button_location: 'bottom_bar_whatsapp',
                    label: 'bottom_bar_whatsapp_quote',
                  })
                }
                className="flex items-center gap-2 rounded-full bg-[#25D366] hover:bg-[#20ba59] px-6 py-3.5 text-xs sm:text-sm font-black text-white shadow-lg transition-transform hover:-translate-y-0.5 cursor-pointer"
              >
                <WhatsAppIcon className="h-4.5 w-4.5 fill-white shrink-0" />
                <span>Message on WhatsApp</span>
              </a>

              <a
                href={`tel:${WHATSAPP_PHONE}`}
                className="rounded-full border border-[#203357] bg-[#101D35] hover:bg-[#203357] px-5 py-3.5 text-xs font-bold text-[#F5F2EB] transition-colors"
              >
                {FORMATTED_PHONE}
              </a>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
