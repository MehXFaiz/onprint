import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  ShieldCheck,
  Zap,
  Clock,
  CheckCircle2,
  ArrowRight,
  Phone,
  IdCard,
  CreditCard,
  Smartphone,
  Building2,
  Users,
  Fingerprint,
  Wifi,
  QrCode,
  Camera,
  Star,
  Award,
  Printer,
  Layers,
  Crown,
  Palette,
  FileCheck,
  AlertCircle,
  Mail,
} from 'lucide-react'
import Container from '../../components/Container'
import Button from '../../components/Button'
import Breadcrumbs from '../../components/Breadcrumbs'
import SEOHead from '../../components/SEOHead'
import Reveal from '../../components/Reveal'
import { createQuote } from '../../services/quotes'
import { trackGetQuoteClick, trackProductInquiry } from '../../utils/analytics'
import idCardsImg from '../../assets/products/id_cards.jpg'

// ID Card Types and Variations
const ID_CARD_TYPES = [
  {
    id: 'standard-pvc-id',
    title: 'Standard PVC ID Cards',
    category: 'standard',
    thickness: '0.76mm (CR80)',
    badge: 'Most Popular • From AED 5',
    priceHint: 'From AED 5 / card',
    image: '/assets/products/id-cards/standard-pvc-id.jpg',
    description:
      'Durable 30mil PVC cards with full-color printing, perfect for employee badges, student IDs, and membership cards. Water-resistant and long-lasting.',
    specs: '30mil PVC • Full Color CMYK • Standard CR80 Size • Magnetic Stripe Available',
    suitableFor: 'Corporate Employees, Students, Gym Members, Club Members, Conference Attendees',
    features: ['Water Resistant', 'Scratch Resistant', 'UV Protected', 'Full Color Printing'],
  },
  {
    id: 'holographic-id-cards',
    title: 'Holographic ID Cards',
    category: 'security',
    thickness: '0.76mm',
    badge: 'High Security',
    priceHint: 'From AED 8 / card',
    image: '/assets/products/id-cards/holographic-id-cards.jpg',
    description:
      'Enhanced security with embedded holographic overlay that prevents counterfeiting and tampering. Ideal for high-security environments.',
    specs: '30mil PVC • Holographic Overlay • UV Features • Anti-Counterfeit',
    suitableFor: 'Government Buildings, Banks, Military, High-Security Facilities, VIP Access',
    features: ['Holographic Overlay', 'UV Security Features', 'Tamper-Evident', 'Anti-Forgery'],
  },
  {
    id: 'smart-nfc-id-cards',
    title: 'Smart NFC ID Cards',
    category: 'smart',
    thickness: '0.86mm',
    badge: 'Contactless',
    priceHint: 'From AED 12 / card',
    image: '/assets/products/id-cards/smart-nfc-id-cards.jpg',
    description:
      'Embedded NFC chip for contactless access control, payment systems, and data storage. Compatible with modern access control systems.',
    specs: 'NFC Chip Embedded • 13.56MHz Frequency • Contactless • Data Storage',
    suitableFor: 'Office Buildings, Hotels, Hospitals, Universities, Smart Buildings',
    features: ['Contactless Access', 'Data Storage', 'Multi-Application', 'Secure Encryption'],
  },
  {
    id: 'rfid-proximity-cards',
    title: 'RFID Proximity Cards',
    category: 'smart',
    thickness: '1.8mm',
    badge: 'Long Range',
    priceHint: 'From AED 10 / card',
    image: '/assets/products/id-cards/rfid-proximity-cards.jpg',
    description:
      '125kHz RFID technology for long-range access control. Reliable and compatible with most proximity readers in the UAE.',
    specs: '125kHz RFID • Long Range • Proximity Reader Compatible • Durable',
    suitableFor: 'Parking Access, Building Entry, Turnstiles, Gated Communities',
    features: ['Long Range', 'Proximity Detection', 'Durable Construction', 'Universal Compatibility'],
  },
  {
    id: 'magnetic-stripe-cards',
    title: 'Magnetic Stripe ID Cards',
    category: 'standard',
    thickness: '0.76mm',
    badge: 'Payment Ready',
    priceHint: 'From AED 6 / card',
    image: '/assets/products/id-cards/magnetic-stripe-cards.jpg',
    description:
      'High-coercivity magnetic stripe for payment systems, time tracking, and access control. Compatible with standard magnetic readers.',
    specs: 'HiCo Magnetic Stripe • 3-Track Encoding • Swipe Compatible • Durable',
    suitableFor: 'Hotels, Cafeterias, Time Attendance, Payment Systems, Loyalty Programs',
    features: ['HiCo Magnetic Stripe', '3-Track Encoding', 'Swipe Compatible', 'Long-Lasting'],
  },
  {
    id: 'photo-id-cards',
    title: 'Photo ID Cards with Lamination',
    category: 'standard',
    thickness: '0.76mm',
    badge: 'Professional',
    priceHint: 'From AED 7 / card',
    image: '/assets/products/id-cards/photo-id-cards.jpg',
    description:
      'Professional photo ID cards with protective lamination. Includes employee photo, name, designation, and company branding.',
    specs: 'Photo Printing • Laminated Protection • Custom Branding • QR Code Optional',
    suitableFor: 'Corporate Offices, Schools, Healthcare, Security Personnel, Event Staff',
    features: ['Photo Quality', 'Laminated', 'Custom Design', 'QR Code Option'],
  },
  {
    id: 'custom-shaped-id-cards',
    title: 'Custom-Shaped ID Cards',
    category: 'specialty',
    thickness: '0.76mm',
    badge: 'Unique Design',
    priceHint: 'From AED 15 / card',
    image: '/assets/products/id-cards/custom-shaped-id-cards.jpg',
    description:
      'Stand out with custom-shaped ID cards. Die-cut to your specifications with unique contours and brand-aligned designs.',
    specs: 'Custom Die-Cut • Brand Aligned • Full Color • Premium PVC',
    suitableFor: 'Hotels, Luxury Brands, Events, Theme Parks, Brand Promotions',
    features: ['Custom Shape', 'Brand Aligned', 'Unique Design', 'Premium Finish'],
  },
  {
    id: 'metal-id-cards',
    title: 'Premium Metal ID Cards',
    category: 'luxury',
    thickness: '0.5mm',
    badge: 'Executive',
    priceHint: 'From AED 35 / card',
    image: '/assets/products/id-cards/metal-id-cards.jpg',
    description:
      'Premium metal ID cards for executive access and VIP membership. Laser-etched with precision for lasting impressions.',
    specs: 'Stainless Steel • Laser Etched • Durable • Premium Finish',
    suitableFor: 'VIP Members, Executive Access, Luxury Hotels, Private Clubs, High-End Events',
    features: ['Metal Construction', 'Laser Etched', 'Premium Feel', 'Long-Lasting'],
  },
  {
    id: 'eco-friendly-id-cards',
    title: 'Eco-Friendly Bio-Based ID Cards',
    category: 'eco',
    thickness: '0.76mm',
    badge: 'Sustainable',
    priceHint: 'From AED 8 / card',
    image: '/assets/products/id-cards/eco-friendly-id-cards.jpg',
    description:
      'Environmentally conscious ID cards made from bio-based PVC. Same durability as traditional cards with reduced environmental impact.',
    specs: 'Bio-Based PVC • FSC Certified • Recyclable • Full Color',
    suitableFor: 'Green Buildings, Eco-Conscious Brands, Schools, NGOs, Sustainable Companies',
    features: ['Bio-Based Material', 'Recyclable', 'Eco-Friendly', 'FSC Certified'],
  },
  {
    id: 'transparent-id-cards',
    title: 'Transparent/Clear ID Cards',
    category: 'specialty',
    thickness: '0.76mm',
    badge: 'Modern',
    priceHint: 'From AED 9 / card',
    image: '/assets/products/id-cards/transparent-id-cards.jpg',
    description:
      'Modern transparent ID cards with clear PVC material. Unique aesthetic with printed elements visible through the card.',
    specs: 'Clear PVC • Transparent • Full Color Printing • Modern Design',
    suitableFor: 'Tech Companies, Design Agencies, Modern Offices, Events, Fashion Brands',
    features: ['Transparent Material', 'Modern Look', 'Unique Aesthetic', 'Full Color'],
  },
  {
    id: 'dual-sided-id-cards',
    title: 'Dual-Sided ID Cards',
    category: 'standard',
    thickness: '0.76mm',
    badge: 'Information Rich',
    priceHint: 'From AED 6 / card',
    image: '/assets/products/id-cards/dual-sided-id-cards.jpg',
    description:
      'Maximize information with dual-sided printing. Front for photo and basic info, back for terms, conditions, and additional data.',
    specs: 'Dual-Sided Printing • Full Color • Matte/Gloss Options • Magnetic Stripe',
    suitableFor: 'Student IDs, Employee Badges, Membership Cards, Access Control',
    features: ['Double Information', 'Full Color Both Sides', 'Magnetic Stripe', 'Custom Layout'],
  },
  {
    id: 'variable-data-id-cards',
    title: 'Variable Data ID Cards',
    category: 'corporate',
    thickness: '0.76mm',
    badge: 'Personalized',
    priceHint: 'From AED 5 / card',
    image: '/assets/products/id-cards/variable-data-id-cards.jpg',
    description:
      'Personalized ID cards with variable data printing. Each card unique with individual names, photos, numbers, and barcodes.',
    specs: 'Variable Data • Personalized • Barcode/QR • Sequential Numbering',
    suitableFor: 'Employee Badges, Student IDs, Membership Cards, Event Passes, Access Control',
    features: ['Personalized Data', 'Unique Per Card', 'Barcode/QR', 'Sequential Numbering'],
  },
]

// Industry Solutions
const INDUSTRY_SOLUTIONS = [
  {
    title: 'Corporate Offices & Buildings',
    icon: Building2,
    recommended: 'Smart NFC Cards + Photo ID + Access Control',
    desc: 'Secure employee access with smart cards featuring photo identification and company branding for Dubai offices.',
  },
  {
    title: 'Hotels & Hospitality',
    icon: Crown,
    recommended: 'Magnetic Stripe Key Cards + Custom Shaped + Photo ID',
    desc: 'Guest room access with premium key cards featuring hotel branding and guest photo identification.',
  },
  {
    title: 'Schools & Universities',
    icon: Users,
    recommended: 'Photo ID Cards + Lamination + Barcode/QR Code',
    desc: 'Student and staff identification with secure photo cards for campus access and library systems.',
  },
  {
    title: 'Healthcare & Hospitals',
    icon: ShieldCheck,
    recommended: 'Photo ID + Holographic Security + RFID Access',
    desc: 'Secure staff identification with enhanced security features for restricted healthcare areas.',
  },
  {
    title: 'Events & Conferences',
    icon: Star,
    recommended: 'Custom Shaped Cards + Variable Data + QR Codes',
    desc: 'Professional event passes with attendee information and scannable QR codes for check-in.',
  },
  {
    title: 'Government & Security',
    icon: Fingerprint,
    recommended: 'Holographic Cards + Biometric Integration + Metal Premium',
    desc: 'High-security identification with anti-counterfeit features for government facilities.',
  },
]

// ID Card Features
const CARD_FEATURES = [
  {
    icon: Printer,
    title: 'High-Definition Printing',
    desc: '600 DPI full-color printing with CMYK and Pantone color matching for sharp, vibrant results.',
  },
  {
    icon: ShieldCheck,
    title: 'Security Features',
    desc: 'Holographic overlays, UV printing, microtext, and anti-counterfeit elements for enhanced security.',
  },
  {
    icon: Wifi,
    title: 'Smart Technology',
    desc: 'NFC, RFID, and magnetic stripe options for access control, payment, and data storage.',
  },
  {
    icon: QrCode,
    title: 'QR & Barcode Integration',
    desc: 'Scannable QR codes and barcodes for attendance tracking, inventory, and verification.',
  },
  {
    icon: Layers,
    title: 'Premium Materials',
    desc: 'PVC, metal, bio-based, and transparent materials for various durability and aesthetic needs.',
  },
  {
    icon: Palette,
    title: 'Custom Design',
    desc: 'Full customization with your brand colors, logos, photos, and layout specifications.',
  },
]

export default function IdCardLandingPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showQuoteModal, setShowQuoteModal] = useState(false)
  const [quoteData, setQuoteData] = useState({
    name: '',
    email: '',
    phone: '',
    quantity: '',
    cardType: '',
    message: '',
  })

  const categories = [
    { id: 'all', name: 'All Types' },
    { id: 'standard', name: 'Standard' },
    { id: 'security', name: 'Security' },
    { id: 'smart', name: 'Smart Cards' },
    { id: 'specialty', name: 'Specialty' },
    { id: 'luxury', name: 'Luxury' },
    { id: 'eco', name: 'Eco-Friendly' },
    { id: 'corporate', name: 'Corporate' },
  ]

  const filteredCards =
    selectedCategory === 'all'
      ? ID_CARD_TYPES
      : ID_CARD_TYPES.filter((card) => card.category === selectedCategory)

  const handleQuoteSubmit = async (e) => {
    e.preventDefault()
    try {
      await createQuote(quoteData)
      trackGetQuoteClick('id-card-quote')
      alert('Quote request submitted successfully!')
      setShowQuoteModal(false)
      setQuoteData({ name: '', email: '', phone: '', quantity: '', cardType: '', message: '' })
    } catch (error) {
      alert('Failed to submit quote. Please try again.')
    }
  }

  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Categories', path: '/categories' },
    { name: 'ID Card Printing', path: '/categories/id-card-printing-dubai' },
  ]

  const faqList = [
    {
      question: 'What is the standard production time for ID cards in Dubai?',
      answer: 'Standard ID cards are produced within 2-3 business days. Express same-day and 24-hour options are available for urgent orders in Dubai, Abu Dhabi, and across UAE.',
    },
    {
      question: 'What ID card security features do you offer?',
      answer: 'We offer holographic overlays, UV security printing, microtext, magnetic stripes, NFC chips, RFID technology, and anti-counterfeit elements for enhanced security.',
    },
    {
      question: 'Can you handle bulk ID card orders for corporations?',
      answer: 'Yes, we specialize in bulk orders for corporations, schools, and events. Volume tier pricing is available for orders of 100+ cards with variable data personalization.',
    },
    {
      question: 'What file formats do you accept for ID card designs?',
      answer: 'We accept PDF, AI, PSD, and high-resolution JPG/PNG files. Our design team can also create custom ID card designs based on your requirements.',
    },
    {
      question: 'Do you offer ID card accessories like lanyards and holders?',
      answer: 'Yes, we offer a complete range of ID card accessories including branded lanyards, card holders, badge reels, and ID card printers for on-demand printing.',
    },
  ]

  return (
    <>
      <SEOHead
        title="ID Card Printing Dubai | ONPRINT – Premium ID Cards & Smart Cards"
        description="Professional ID card printing in Dubai, UAE. Smart NFC cards, RFID proximity cards, holographic ID cards, magnetic stripe cards, photo ID cards, and custom-shaped ID cards with fast delivery across UAE."
        keywords="id card printing dubai, employee id cards, student id cards, smart cards dubai, nfc cards, rfid cards, magnetic stripe cards, holographic id cards, photo id cards, access control cards, proximity cards, custom id cards, id card printing uae, id card printing abu dhabi, id card printing sharjah, smart card printing, contactless cards, id card lamination, variable data id cards, metal id cards, eco friendly id cards, transparent id cards, custom shaped id cards, corporate id cards, school id cards, hotel key cards, government id cards, security id cards, barcode id cards, qr code id cards, id card accessories, lanyard printing dubai, id card holders, badge reels, id card printers dubai"
        canonicalPath="/categories/id-card-printing-dubai"
        breadcrumbs={breadcrumbs}
        faqList={faqList}
        ogImage={idCardsImg}
      />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <Container>
          <Breadcrumbs items={breadcrumbs} />

          {/* Hero Section */}
          <Reveal>
            <section className="py-16 lg:py-24">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center max-w-4xl mx-auto"
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-[#A82F19] bg-white px-4 py-1 text-xs font-extrabold uppercase tracking-widest text-[#A82F19] mb-6">
                  <Sparkles className="h-3.5 w-3.5 text-[#A82F19]" />
                  Professional ID Card Solutions
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
                  ID Card Printing in Dubai
                </h1>
                <p className="text-lg md:text-xl text-slate-600 mb-8">
                  Premium ID cards with smart technology, security features, and custom designs. 
                  From standard PVC cards to NFC smart cards and holographic security badges.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button to="/get-a-quote" size="lg">
                    Get a Free Quote
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button to="/products" variant="outline" size="lg">
                    View Products
                  </Button>
                </div>
              </motion.div>
            </section>
          </Reveal>

          {/* Features Grid */}
          <Reveal>
            <section className="py-12 mb-16">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {CARD_FEATURES.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-shadow"
                  >
                    <feature.icon className="h-10 w-10 text-[#A82F19] mb-4" />
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">{feature.title}</h3>
                    <p className="text-slate-600">{feature.desc}</p>
                  </motion.div>
                ))}
              </div>
            </section>
          </Reveal>

          {/* Category Filter */}
          <Reveal>
            <section className="py-8 mb-8">
              <div className="flex flex-wrap gap-2 justify-center">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-[#A82F19] text-white'
                        : 'bg-white text-slate-700 border border-slate-200 hover:border-[#A82F19] hover:text-[#A82F19]'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </section>
          </Reveal>

          {/* ID Card Types Grid */}
          <Reveal>
            <section className="py-12 mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center">
                ID Card Types & Variations
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCards.map((card, index) => (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-lg transition-all group"
                  >
                    <div className="aspect-[4/3] bg-slate-100 overflow-hidden">
                      <img
                        src={card.image}
                        alt={card.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-[#A82F19]">{card.badge}</span>
                        <span className="text-xs font-medium text-slate-500">{card.thickness}</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">{card.title}</h3>
                      <p className="text-sm text-slate-600 mb-3">{card.description}</p>
                      <div className="text-xs text-slate-500 mb-3">
                        <p className="font-medium text-slate-700 mb-1">{card.specs}</p>
                      </div>
                      <p className="text-sm font-semibold text-[#A82F19] mb-3">{card.priceHint}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {card.features.slice(0, 3).map((feature) => (
                          <span key={feature} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                            {feature}
                          </span>
                        ))}
                      </div>
                      <Button
                        to="/get-a-quote"
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => setQuoteData({ ...quoteData, cardType: card.title })}
                      >
                        Request Quote
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </Reveal>

          {/* Industry Solutions */}
          <Reveal>
            <section className="py-16 mb-16 bg-gradient-to-r from-[#A82F19]/5 to-[#A82F19]/10 rounded-2xl">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-12 text-center">
                Industry Solutions
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {INDUSTRY_SOLUTIONS.map((solution, index) => (
                  <motion.div
                    key={solution.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
                  >
                    <solution.icon className="h-10 w-10 text-[#A82F19] mb-4" />
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">{solution.title}</h3>
                    <p className="text-sm text-slate-600 mb-3">{solution.desc}</p>
                    <div className="text-xs font-medium text-[#A82F19] bg-[#A82F19]/5 p-2 rounded">
                      {solution.recommended}
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </Reveal>

          {/* Why Choose Us */}
          <Reveal>
            <section className="py-16 mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center">
                Why Choose ONPRINT for ID Cards?
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                {[
                  'Fast delivery across UAE',
                  'High-security features',
                  'Smart card technology',
                  'Bulk order discounts',
                  'Custom design options',
                  'Premium materials',
                  'Variable data printing',
                  'Complete accessory range',
                ].map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="h-6 w-6 text-[#A82F19] shrink-0 mt-0.5" />
                    <span className="text-slate-700">{item}</span>
                  </motion.div>
                ))}
              </div>
            </section>
          </Reveal>

          {/* CTA Section */}
          <Reveal>
            <section className="py-16 mb-16 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                Ready to Order ID Cards?
              </h2>
              <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
                Contact us today for a free quote on your ID card printing project. 
                We deliver across Dubai, Abu Dhabi, Sharjah, and all UAE Emirates with fast turnaround.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button to="/get-a-quote" size="lg">
                  Request Free Quote
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="h-5 w-5" />
                  <span>+971 50 123 4567</span>
                </div>
              </div>
            </section>
          </Reveal>

          {/* Contact Info */}
          <Reveal>
            <section className="py-12 border-t border-slate-200">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <Phone className="h-8 w-8 text-[#A82F19] mx-auto mb-3" />
                  <h3 className="font-semibold text-slate-900 mb-1">Call Us</h3>
                  <p className="text-slate-600">+971 50 123 4567</p>
                </div>
                <div>
                  <Mail className="h-8 w-8 text-[#A82F19] mx-auto mb-3" />
                  <h3 className="font-semibold text-slate-900 mb-1">Email Us</h3>
                  <p className="text-slate-600">0nprint183@gmail.com</p>
                </div>
                <div>
                  <Clock className="h-8 w-8 text-[#A82F19] mx-auto mb-3" />
                  <h3 className="font-semibold text-slate-900 mb-1">Working Hours</h3>
                  <p className="text-slate-600">Sat - Thu: 8:30 AM - 6:30 PM</p>
                </div>
              </div>
            </section>
          </Reveal>
        </Container>
      </div>
    </>
  )
}
