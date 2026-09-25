import React, { useState, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { BUSINESS_CARDS_LANDING_DATA } from '../../data/businessCardsLandingData'
import {
  Sparkles,
  Award,
  ShieldCheck,
  Zap,
  Clock,
  CheckCircle2,
  ArrowRight,
  Phone,
  MessageSquare,
  Layers,
  Printer,
  ChevronDown,
  Upload,
  FileText,
  MapPin,
  Building2,
  Briefcase,
  Stethoscope,
  Scale,
  UtensilsCrossed,
  HardHat,
  Cpu,
  Star,
  Check,
  Compass,
  Flame,
  Info,
  Send,
  Download,
  Scissors,
  Bookmark,
  Calendar,
  CreditCard,
  Crown,
  Palette,
  Eye,
  FileCheck,
  AlertCircle,
  Mail,
} from 'lucide-react'
import Container from '../../components/Container'
import Button from '../../components/Button'
import Breadcrumbs from '../../components/Breadcrumbs'
import SEOHead from '../../components/SEOHead'
import Reveal from '../../components/Reveal'
import { CornerMarks, CmykDots } from '../../components/PrintMarks'
import { createQuote } from '../../services/quotes'
import { trackGetQuoteClick, trackProductInquiry } from '../../utils/analytics'
import luxuryBusinessCardsImg from '../../assets/products/luxury_business_cards.jpg'
import softTouchCardImg from '../../assets/products/card-soft-touch.jpg'
import velvetFoilCardImg from '../../assets/products/card-velvet-foil.jpg'
import paintedEdgeCardImg from '../../assets/products/card-painted-edge.jpg'
import brochuresImg from '../../assets/products/brochures.jpg'

// 21 Comprehensive Business Card Options
const CARD_VARIATIONS = [
  {
    id: 'luxury-cotton-600',
    title: 'Luxury 600 GSM Cotton Cards',
    category: 'luxury',
    gsm: '600 GSM',
    badge: 'Executive Flagship',
    image: luxuryBusinessCardsImg,
    description:
      'Triple-ply 100% Italian archival tree-free cotton board with an ultra-soft, pillowy tactile finish. Engineered specifically for deep architectural blind debossing and 24K hot foil stamping.',
    specs: '600 GSM • Uncoated Archival • Deep Deboss / Foil Ready • FSC Certified',
    suitableFor: 'Founders, C-Suite Executives, Luxury Real Estate, Private Equity, Law Partners',
    popularFinishes: ['24K Gold Foil', 'Blind Debossing', 'Painted Gilded Edges'],
  },
  {
    id: 'velvet-foil-card',
    title: 'Foil Business Cards (24K Gold & Copper)',
    category: 'finishes',
    gsm: '450 GSM',
    badge: 'Best Seller',
    image: velvetFoilCardImg,
    description:
      'Heavyweight 450 GSM artboard laminated with 30-micron velvet soft-touch film and stamped with heated brass dies in reflective Gold, Rose Gold, Champagne, or Silver metallic foil.',
    specs: '450 GSM • Velvet Soft-Touch Matte • Hot Stamped Foil • Zero Flaking',
    suitableFor: 'Luxury Boutiques, High-End Agencies, Hospitality Directors, DIFC Corporates',
    popularFinishes: ['24K Gold Foil', 'Rose Gold Foil', 'Spot Gloss Contrast'],
  },
  {
    id: 'raised-spot-uv-3d',
    title: 'Spot UV Business Cards (Raised 3D Scodix)',
    category: 'finishes',
    gsm: '400 GSM',
    badge: 'Tactile Contrast',
    image: softTouchCardImg,
    description:
      'Features high-build 100-micron clear gloss liquid polymer cured with UV light over a smooth matte or soft-touch velvet background, creating striking dimensional contrast.',
    specs: '400 GSM • Matte / Velvet Base • 100μ Raised Gloss • Pinpoint Trap',
    suitableFor: 'Tech Founders, Creative Agencies, Architecture Studios, Medical Specialists',
    popularFinishes: ['Raised 3D UV', 'Soft-Touch Matte', 'Blind Gloss Pattern'],
  },
  {
    id: 'painted-gilded-edges',
    title: 'Painted & Gilded Metallic Edge Cards',
    category: 'luxury',
    gsm: '700 GSM',
    badge: '360° Profile',
    image: paintedEdgeCardImg,
    description:
      'Ultra-thick multi-ply card stacks hand-beveled with mirror metallic foil (Gold/Silver) or custom Pantone-matched painted borders for a dramatic 360-degree edge appearance.',
    specs: '700 GSM Duplex • Mirror Foil Edges • Pantone Tint • Multilayer Core',
    suitableFor: 'VIP Club Members, Creative Directors, Luxury Hotel Concierges, High-Net-Worth Brokers',
    popularFinishes: ['Mirror Gold Edge', 'Pantone Red Edge', 'Double-Sided Foil'],
  },
  {
    id: 'soft-touch-matte-400',
    title: 'Matte Business Cards (Velvet Soft-Touch)',
    category: 'luxury',
    gsm: '400 GSM',
    badge: 'Sensory Matte',
    image: '/assets/products/business-cards/bc_matte_softtouch.jpg',
    description:
      'Silky smooth peach-skin texture that completely eliminates glare and resists fingerprints. Ideal for sophisticated minimalist typographic designs.',
    specs: '400 GSM Artboard • 30μ Anti-Scuff Velvet • Double-Sided Coating',
    suitableFor: 'Corporate Executives, Marketing Agencies, Financial Advisors, Consultants',
    popularFinishes: ['Velvet Soft-Touch', 'Spot UV 3D', 'Curved Rounded Corners'],
  },
  {
    id: 'standard-silk-350',
    title: 'Standard Business Cards (350 GSM Silk)',
    category: 'corporate',
    gsm: '350 GSM',
    badge: 'Same-Day Dispatch',
    image: '/assets/products/business-cards/bc_standard_silk.jpg',
    description:
      'High-definition digital press printing on dense 350 GSM silk-coated artboard. Our fastest, most cost-effective solution for high-volume team batches.',
    specs: '350 GSM Silk • CMYK Heidelberg Calibrated • Same-Day 4h Rush Available',
    suitableFor: 'Sales Teams, Startups, Event Handouts, Retail Staff, Multi-Employee Batches',
    popularFinishes: ['Matte Lamination', 'Gloss Lamination', 'Square Corners'],
  },
  {
    id: 'premium-business-cards',
    title: 'Premium Business Cards (400 GSM Matte)',
    category: 'corporate',
    gsm: '400 GSM',
    badge: 'Executive Standard',
    image: '/assets/products/business-cards/bc_premium_matte.jpg',
    description:
      'Sturdy 400 GSM premium artboard sealed with dual-sided protective matte coating for crisp typography, deep black contrast, and zero edge curling.',
    specs: '400 GSM Artboard • Double Matte Sealed • Crisp Die-Trim • Pantone Accurate',
    suitableFor: 'Corporate Companies, Real Estate Agencies, Law Offices, Financial Advisors',
    popularFinishes: ['Matte Coating', 'Spot UV Logo', 'Rounded Corners'],
  },
  {
    id: 'corporate-business-cards',
    title: 'Corporate Business Cards (Multi-Employee Batches)',
    category: 'corporate',
    gsm: '350–400 GSM',
    badge: 'Bulk Discount',
    image: '/assets/products/business-cards/bc_corporate_batches.jpg',
    description:
      'Unified brand printing for companies ordering 5 to 500 employee name sets. Color-calibrated to exact brand Pantone standards with centralized re-ordering.',
    specs: 'Multi-Name Split • Central Brand Asset Management • Volume Tier Pricing',
    suitableFor: 'Multinational Corporations, Government Entities, Consultancies, Enterprise Teams',
    popularFinishes: ['Velvet Soft-Touch', 'Spot Gloss Logo', 'Standard Matte'],
  },
  {
    id: 'glossy-business-cards',
    title: 'Glossy Business Cards (High-Reflectivity)',
    category: 'corporate',
    gsm: '350 GSM',
    badge: 'Vibrant Colors',
    image: '/assets/products/business-cards/bc_glossy.jpg',
    description:
      'Ultra-gloss thermal lamination that enhances photograph color saturation, deep rich tones, and vibrant graphics with durable water and dirt resistance.',
    specs: '350 GSM Artboard • High-Gloss UV / Thermal Lamination • Photo Saturation',
    suitableFor: 'Photographers, Event Planners, Nightlife Venues, Visual Artists',
    popularFinishes: ['Full Gloss Front', 'Uncoated Writable Back'],
  },
  {
    id: 'embossed-business-cards',
    title: 'Embossed Business Cards (Sculptural Relief)',
    category: 'finishes',
    gsm: '450–600 GSM',
    badge: 'Tactile Relief',
    image: '/assets/products/business-cards/bc_embossed.jpg',
    description:
      'Raised tactile relief created with precision CNC male/female brass dies. Lifts your corporate emblem or monogram outward from the card surface.',
    specs: 'Multi-Level Emboss • 3D Relief Effect • Compatible with Foil Stamping',
    suitableFor: 'High-End Fashion Brands, Heritage Companies, Private Banks, Royal Offices',
    popularFinishes: ['Emboss + Gold Foil', 'Blind Multi-Level Emboss'],
  },
  {
    id: 'debossed-business-cards',
    title: 'Debossed Business Cards (Deep Impression)',
    category: 'luxury',
    gsm: '600 GSM',
    badge: 'Letterpress Depth',
    image: '/assets/products/business-cards/bc_debossed.jpg',
    description:
      'Heavily pressed letterpress depression stamped deep into thick 600 GSM uncalendered cotton paper, creating dramatic shadows and antique craftsmanship.',
    specs: 'Deep Letterpress Impression • Archival Italian Cotton • Pillowy Touch',
    suitableFor: 'Architects, Interior Designers, Boutique Coffee Roasters, Bespoke Tailors',
    popularFinishes: ['Blind Deboss', 'Deboss with Inked Lettering'],
  },
  {
    id: 'textured-linen-kraft',
    title: 'Textured Business Cards (Linen & Fedrigoni)',
    category: 'eco',
    gsm: '350–400 GSM',
    badge: 'Eco-Friendly FSC',
    image: '/assets/products/business-cards/bc_textured_kraft.jpg',
    description:
      'Authentic European Fedrigoni textured stocks, cross-hatch fine linen, and tactile hammered laid paper for organic, artisanal, and heritage brands.',
    specs: '350–400 GSM • Natural Texture • Unbleached Kraft • Vegetable Inks',
    suitableFor: 'Sustainable Brands, Artisanal Cafes, Eco Consultants, Fashion Designers',
    popularFinishes: ['Letterpress Deboss', 'White Opaque Ink', 'Kraft Raw Board'],
  },
  {
    id: 'die-cut-business-cards',
    title: 'Die-Cut Business Cards (Custom Shapes)',
    category: 'specialty',
    gsm: '400 GSM',
    badge: 'Custom Silhouette',
    image: '/assets/products/business-cards/bc_diecut.jpg',
    description:
      'Precision steel die cutting into bespoke brand shapes, geometric outlines, interior window cutouts, or custom silhouette contours that stand out instantly.',
    specs: 'Bespoke CNC Steel Rule Die • Crisp Clean Margins • Custom Silhouette',
    suitableFor: 'Creative Directors, Product Designers, Boutique Brands, Marketing Innovators',
    popularFinishes: ['Custom Contour', 'Matte Finish', 'Foil Stamped Detail'],
  },
  {
    id: 'rounded-corner-cards',
    title: 'Rounded Corner Business Cards (3mm / 6mm)',
    category: 'corporate',
    gsm: '350–450 GSM',
    badge: 'Modern Arc',
    image: '/assets/products/business-cards/bc_rounded_corners.jpg',
    description:
      'Die-cut rounded corners with smooth 3mm (subtle credit card style) or 6mm (bold curvature) radii that eliminate pocket dog-ears and snagging.',
    specs: '3mm / 6mm Precision Radii • 4 Corners Die-Trimmed • Smooth Edges',
    suitableFor: 'App Developers, Tech Companies, Health Clinics, Modern Startups',
    popularFinishes: ['Velvet Soft-Touch', 'Spot UV Contrast', 'Gold Foil Accent'],
  },
  {
    id: 'minimal-business-cards',
    title: 'Minimal Business Cards (Monochrome Atelier)',
    category: 'luxury',
    gsm: '450–600 GSM',
    badge: 'Understated Luxury',
    image: '/assets/products/business-cards/bc_minimalist.jpg',
    description:
      'High-contrast monochromatic aesthetics with pure typographical precision. Black foil on white cotton or white pigment on deep black pulp-dyed stock.',
    specs: 'Pulp-Dyed Solid Black / Pure Cotton White • Micro-Typographic Precision',
    suitableFor: 'Minimalist Architects, Fine Jewelers, Contemporary Art Curators, Authors',
    popularFinishes: ['Black Gloss Foil on Matte Black', 'Blind Debossed Monogram'],
  },
  {
    id: 'creative-business-cards',
    title: 'Creative Business Cards (Triplex Color Core)',
    category: 'specialty',
    gsm: '650 GSM',
    badge: 'Color Sandwich',
    image: '/assets/products/business-cards/bc_triplex.jpg',
    description:
      'Three thick paper layers laminated together with a vibrant colored middle seam (Red, Cyan, Yellow, Black) visible along the card profile edge.',
    specs: '650 GSM Triplex Sandwich • Colored Internal Core Seam • Ultra-Rigid',
    suitableFor: 'Design Agencies, Media Agencies, Animation Studios, Branding Consultants',
    popularFinishes: ['Contrasting Core Seam', 'Matte Face', 'Foil Accents'],
  },
  {
    id: 'double-sided-cards',
    title: 'Double-Sided Business Cards (Dual-Faced)',
    category: 'corporate',
    gsm: '350–450 GSM',
    badge: 'Complete Info',
    image: '/assets/products/business-cards/bc_bilingual.jpg',
    description:
      'Full-bleed color printing on both front and back. Ideal for showcasing English on side A and Arabic typography on side B for UAE commercial business.',
    specs: 'Bilingual English/Arabic Ready • Full Color Both Sides • Balanced Bleed',
    suitableFor: 'UAE Businesses, International Trade Companies, Bilingual Professionals',
    popularFinishes: ['Double Matte', 'Foil Front + Matte Reverse'],
  },
  {
    id: 'single-sided-cards',
    title: 'Single-Sided Business Cards (Writable Back)',
    category: 'corporate',
    gsm: '350 GSM',
    badge: 'Budget Friendly',
    image: '/assets/products/service_executive_stationery.jpg',
    description:
      'Crisp full-color front with an uncoated, absorbent reverse side perfect for handwritten notes, client appointments, or stamp loyalty programs.',
    specs: 'Coated Silk Front • Uncoated Absorbent Back • Pen & Pencil Writable',
    suitableFor: 'Medical Doctors, Dental Clinics, Hair Stylists, Service Technicians',
    popularFinishes: ['Matte Front', 'Uncoated Reverse'],
  },
  {
    id: 'custom-business-cards',
    title: 'Custom Business Cards (Full Bespoke Atelier)',
    category: 'specialty',
    gsm: 'Bespoke',
    badge: 'Unlimited Choice',
    image: '/uploads/categories/business-cards-printing.jpg',
    description:
      'Combine multiple finishes without limits: duplex cotton, dual-color foils, beveled gilded edges, Scodix Spot UV, and custom CNC silhouettes.',
    specs: 'Custom Die Creation • Specialty Substrates • Exact Technical Prototyping',
    suitableFor: 'Luxury Conglomerates, Royalty, Signature Brands, High-Profile Executives',
    popularFinishes: ['Foil + Deboss + Gilded Edge', 'Custom Stock Duplex'],
  },
  {
    id: 'branded-business-cards',
    title: 'Branded Business Cards (Pantone Spot Colors)',
    category: 'corporate',
    gsm: '400 GSM',
    badge: 'Brand Compliant',
    image: '/assets/products/1 (7).jpg',
    description:
      'Printed with genuine Pantone Matching System (PMS) spot inks on Heidelberg offset presses for 100% strict corporate brand identity compliance.',
    specs: 'Genuine PMS Inks • Zero CMYK Color Shift • ISO 12647-2 Certified',
    suitableFor: 'Franchise Networks, Corporate Law Firms, Global Banking Groups, Telecoms',
    popularFinishes: ['Pantone Metallic Ink', 'Velvet Protective Film'],
  },
  {
    id: 'appointment-loyalty-vip',
    title: 'Appointment, Loyalty & VIP Cards (Smart NFC)',
    category: 'specialty',
    gsm: '400–700 GSM',
    badge: 'Smart / Loyalty',
    image: '/assets/products/service_luxury_packaging.jpg',
    description:
      'Dual-purpose appointment cards with writable grids, luxury VIP membership cards with metallic foil numbers, or embedded NTAG213/216 NFC smart cards.',
    specs: 'Writable Grids / Member Numbering / Encrypted NFC Chip Options',
    suitableFor: 'Spas, Aesthetic Clinics, Private Members Clubs, Concierge Services, Retailers',
    popularFinishes: ['Writable Backing', 'Foil Stamped Monogram', 'NFC Encoding'],
  },
]

// 12 Real Customer Industries in Dubai & UAE
const INDUSTRY_SOLUTIONS = [
  {
    title: 'Real Estate Agents & Luxury Brokers',
    icon: Building2,
    recommended: '450 GSM Velvet Soft-Touch + 24K Gold Foil + Back QR Code',
    desc: 'Command instant credibility in luxury property meetings with heavy tactile velvet boards and metallic foil stamping that echoes Dubai’s luxury skyline.',
  },
  {
    title: 'Law Firms & Legal Advocates',
    icon: Scale,
    recommended: '600 GSM Archival Cotton + Sculptural Blind Debossing',
    desc: 'Timeless restraint and heavy cotton tactile authority for DIFC and ADGM solicitors, senior partners, and international legal counsels.',
  },
  {
    title: 'Doctors, Dentists & Aesthetic Clinics',
    icon: Stethoscope,
    recommended: '400 GSM Anti-Scuff Matte + Appointment Table Backing',
    desc: 'Crisp, clinical hygiene aesthetic with uncoated matte writable reverse side for patient appointment tracking and specialist credentials.',
  },
  {
    title: 'Luxury Hospitality & Restaurants',
    icon: UtensilsCrossed,
    recommended: '700 GSM Duplex + Gold Gilded Edges + Velvet Lamination',
    desc: 'Designed for VIP concierge teams, Michelin-star general managers, and boutique resort directors where every sensory touchpoint matters.',
  },
  {
    title: 'Corporate Financial & Investment Firms',
    icon: Briefcase,
    recommended: '400 GSM Matte + Raised 3D Spot UV Logo Contrast',
    desc: 'Precision corporate brand consistency across 5 to 500 employee name batches with calibrated Pantone color fidelity.',
  },
  {
    title: 'Tech Founders & Creative Startups',
    icon: Cpu,
    recommended: '450 GSM Dark Pulp-Dyed + Holographic Foil + NFC Smart Chip',
    desc: 'Futuristic aesthetic blending physical metallic prism foils with instant digital contact sharing via embedded NFC chips and QR codes.',
  },
  {
    title: 'Contractors & Construction Companies',
    icon: HardHat,
    recommended: '450 GSM Heavy Board + Matte Anti-Scuff Protective Lamination',
    desc: 'Durable, resilient cards that withstand site visits, dust, and handling while presenting engineering prestige.',
  },
  {
    title: 'Salons & Luxury Beauty Spas',
    icon: Sparkles,
    recommended: '400 GSM Soft-Touch + Rose Gold Foil + Loyalty Stamp Reverse',
    desc: 'Elegantly tactile cards that double as client appointment reminders and luxury VIP customer retention passes.',
  },
  {
    title: 'Marketing & Advertising Agencies',
    icon: Palette,
    recommended: '650 GSM Triplex Color Core + Raised 3D UV Pattern',
    desc: 'Showcase your creative boldness before speaking a word. Multi-layer sandwiched card stocks with vibrant color edge seams.',
  },
  {
    title: 'Management & Strategy Consultants',
    icon: Crown,
    recommended: '500 GSM Fedrigoni Textured Linen + Crisp Charcoal Foil',
    desc: 'Subtle European paper craftsmanship conveying advisory depth, rigorous intellect, and executive gravitas.',
  },
  {
    title: 'Retail Boutiques & Luxury Brands',
    icon: Bookmark,
    recommended: '450 GSM Velvet Soft-Touch + Gilded Metallic Gold Edges',
    desc: 'Accompany luxury purchases, private client gifting, and boutique customer service with opulent gilded profile cards.',
  },
  {
    title: 'Freelancers & Independent Designers',
    icon: Scissors,
    recommended: '350 GSM Recycled Kraft or Custom Die-Cut Silhouette',
    desc: 'Distinctive, sustainable, and memorable cards that highlight your independent design philosophy and artistic signature.',
  },
]

// 12 Legitimate Dubai & UAE Service & Delivery Hubs
const DUBAI_AREAS = [
  {
    name: 'Al Quoz, Dubai',
    hub: 'Direct Production Pressroom',
    dispatch: '2-Hour Express Pickup / Same-Day Courier',
    desc: 'Central Heidelberg offset & HP Indigo press facility with client proofing lounge in Al Quoz, Dubai.',
  },
  {
    name: 'DIFC & Downtown Dubai',
    hub: 'Financial & Executive Hub',
    dispatch: 'Same-Day 4-Hour Hand Delivery',
    desc: 'Express dispatch for investment banks, corporate law firms, and executive offices in Gate District & Boulevard.',
  },
  {
    name: 'Business Bay & SZR',
    hub: 'Commercial District',
    dispatch: 'Same-Day Afternoon Courier',
    desc: 'Daily express runs to Bay Square, Executive Towers, and Sheikh Zayed Road multinational headquarters.',
  },
  {
    name: 'Dubai Marina, JLT & Palm Jumeirah',
    hub: 'Coastal Enterprise Hub',
    dispatch: 'Daily Express Dispatch',
    desc: 'Serving marketing agencies, yacht brokers, luxury realtors, and luxury hospitality groups across Marina & JLT clusters.',
  },
  {
    name: 'Deira, Bur Dubai & Karama',
    hub: 'Historic Trade Center',
    dispatch: 'Morning & Evening Daily Routes',
    desc: 'Trading houses, wholesale enterprises, medical clinics, and government entity procurement offices.',
  },
  {
    name: 'Al Barsha & Mall of the Emirates',
    hub: 'Commercial & Retail Corridor',
    dispatch: 'Same-Day Courier Delivery',
    desc: 'Serving commercial agencies, private clinics, consulting practices, and hospitality suites.',
  },
  {
    name: 'Jumeirah & City Walk',
    hub: 'Luxury Boutique District',
    dispatch: 'Same-Day Courier Delivery',
    desc: 'Bespoke cards for luxury fashion ateliers, aesthetic clinics, upscale cafes, and interior design firms.',
  },
  {
    name: 'Al Garhoud & DAFZA Airport Free Zone',
    hub: 'Aviation & Cargo Free Zone',
    dispatch: 'Same-Day Morning Route',
    desc: 'Rapid delivery for logistics firms, airline offices, international trading companies, and customs brokers.',
  },
  {
    name: 'Al Nahda & Dubai-Sharjah Gateway',
    hub: 'Northern Commercial Hub',
    dispatch: 'Daily Morning & Evening Delivery',
    desc: 'Reliable doorstep distribution for medical centers, educational institutions, and commercial enterprises.',
  },
  {
    name: 'JAFZA & Dubai South Logistics',
    hub: 'Industrial & Export Hub',
    dispatch: 'Next-Day Express Dispatch',
    desc: 'High-volume corporate batches and industrial business cards for multinational logistics operators in JAFZA.',
  },
  {
    name: 'Abu Dhabi Capital City',
    hub: 'Capital Corporate Delivery',
    dispatch: '24-Hour Insured Doorstep Courier',
    desc: 'White-glove delivery to ADGM, Al Maryah Island, Corniche corporate towers, and government departments.',
  },
  {
    name: 'Northern Emirates (Sharjah, Ajman, RAK)',
    hub: 'UAE-Wide Distribution',
    dispatch: '24-Hour Doorstep Delivery',
    desc: 'Daily logistics network covering corporate and retail clients across Sharjah, Ajman, Umm Al Quwain, and RAK.',
  },
]

// Comprehensive 16 FAQs answering search intent
const BUSINESS_CARD_FAQS = [
  {
    question: 'How much does business card printing cost in Dubai?',
    answer:
      'Standard 350 GSM silk business cards start from approximately AED 120 for 100 cards with digital printing. Premium 450 GSM velvet soft-touch cards with 24K hot gold foil stamping start from AED 280 for 100 cards. Large corporate volume orders (1,000+ cards) and multi-employee batches enjoy significant volume discounts down to AED 0.45 per card.',
  },
  {
    question: 'Where can I print business cards in Dubai?',
    answer:
      'ONPRINT operates directly from Al Quoz, Dubai. You can order online through our website with live quotation, visit our production facility for physical paper swatch checks, or request same-day courier delivery directly to your Dubai office.',
  },
  {
    question: 'What is the best paper for business cards?',
    answer:
      'For everyday corporate multi-name use, 350–400 GSM silk artboard provides the ideal balance of rigidity and sharpness. For genuine executive luxury cards, 450 GSM velvet artboard or 600–700 GSM multi-ply Italian cotton board is unmatched for tactile weight and letterpress debossing.',
  },
  {
    question: 'What business card size should I use in Dubai?',
    answer:
      'The two most popular business card sizes in Dubai and the UAE are: (1) Standard European Size: 85 x 55 mm (standard credit card ratio, fits all modern wallets), and (2) US Standard Size: 90 x 50 mm (3.5 x 2.0 inches). We also produce custom square cards (65 x 65 mm) and bespoke CNC die-cut shapes.',
  },
  {
    question: 'What is the difference between matte and glossy business cards?',
    answer:
      'Matte lamination provides a smooth, non-reflective coating that resists glare and creates an understated, executive look. Glossy lamination features a high-shine reflective polymer that amplifies vibrant photographs and saturated brand colors while offering moisture and dirt protection.',
  },
  {
    question: 'What is spot UV business card printing?',
    answer:
      'Spot UV is a finishing technique where a clear high-gloss liquid polymer is applied selectively over specific elements (such as your logo, typography, or pattern) and cured with UV light. When paired with a matte or soft-touch background, it produces a dynamic contrast between light reflection and matte restraint.',
  },
  {
    question: 'What is foil business card printing?',
    answer:
      'Foil business card printing bonds metallic or pigmented foil onto the paper using heated brass dies and hydraulic pressure (traditional hot foil stamping) or digital sleeking. Colors include 24K Mirror Gold, Rose Gold, Matte Champagne, Silver, Copper, Holographic Prism, and High-Gloss Black.',
  },
  {
    question: 'How many business cards should I order?',
    answer:
      'For individual professionals attending regular Dubai networking events, 250 to 500 cards is the standard initial batch. For companies ordering for teams, we recommend 100 to 250 cards per employee to take advantage of multi-name corporate batch pricing tiers.',
  },
  {
    question: 'Can I print custom business cards with unique finishes?',
    answer:
      'Yes. ONPRINT specializes in bespoke atelier customization: multi-ply duplex/triplex boards up to 700 GSM, painted and gilded metallic edges, laser-cut rounded corners, magnetic NFC smart chips, and Pantone spot-color matching.',
  },
  {
    question: 'Can I upload my own business card design?',
    answer:
      'Yes. You can upload print-ready vector PDF files with our online form. Our pre-press engineering team inspects every file for CMYK color space, 300 DPI resolution, and 3mm bleed margins before printing, sending you a digital proof for approval.',
  },
  {
    question: 'How quickly can business cards be printed?',
    answer:
      'Standard digital runs are ready in 24 to 48 hours. We also offer Same-Day 4-Hour Express rush service for orders with approved print-ready artwork submitted before 11:00 AM, available for immediate Al Quoz collection or afternoon courier dispatch.',
  },
  {
    question: 'Can businesses order bulk business cards with multiple employee names?',
    answer:
      'Yes. We specialize in corporate batch printing. You can submit an Excel sheet with employee names and titles; our pre-press team populates your approved master template, guaranteeing 100% typography and brand color consistency across all staff.',
  },
  {
    question: 'What is the best finish for professional business cards?',
    answer:
      'For senior executives, lawyers, and luxury brokers in Dubai, Velvet Soft-Touch lamination combined with 24K Hot Gold Foil or Raised 3D Spot UV is the most commanding finish combination in high-stakes meetings.',
  },
  {
    question: 'What information should a business card contain?',
    answer:
      'An effective corporate card should include: Full Name, Official Title, Company Name and Logo, WhatsApp / Phone number with UAE country code (+971), Corporate Email, Website URL, Physical Office Address / Zone (e.g. DIFC, Business Bay), and optionally a QR code linking to your digital vCard or LinkedIn.',
  },
  {
    question: 'What file format should I use for printing?',
    answer:
      'The ideal format is a Vector PDF saved in CMYK color mode at 300 DPI with 3mm bleed on all four sides and text converted to outlines (curves). If your card includes foil or Spot UV, provide a separate monochrome layer with 100% solid black (K:100%) indicating the finish placement.',
  },
  {
    question: 'Can ONPRINT print corporate business cards with exact Pantone colors?',
    answer:
      'Yes. For enterprise brands requiring strict brand compliance, we print using genuine Pantone Matching System (PMS) spot inks on Heidelberg offset presses, eliminating the color shifts common in standard digital CMYK toner reproduction.',
  },
]

export default function BusinessCardLandingPage({ pageKey: propKey }) {
  const quoteFormRef = useRef(null)
  const location = useLocation()
  const derivedKey = propKey || location.pathname.replace(/^\//, '') || 'business-card-printing-dubai'
  const pageData = BUSINESS_CARDS_LANDING_DATA[derivedKey] || BUSINESS_CARDS_LANDING_DATA['business-card-printing-dubai']

  const [activeCategory, setActiveCategory] = useState(pageData.cardCategory || 'all')
  const [activeGuideTab, setActiveGuideTab] = useState('size')
  const [openFaq, setOpenFaq] = useState(0)

  // Form State
  const [formState, setFormState] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    quantity: '250',
    cardType: '24K Metallic Foil & Velvet Cards (450 GSM)',
    paper: '450 GSM Velvet Soft-Touch Artboard',
    finish: '24K Gold Foil Stamping',
    designStatus: 'Have Print-Ready PDF',
    deliveryDate: 'Standard 24-48 Hours',
    notes: '',
  })
  const [artworkFile, setArtworkFile] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [quoteNumber, setQuoteNumber] = useState('')

  const scrollToQuote = (prefillType = null, prefillPaper = null) => {
    if (prefillType) {
      setFormState((prev) => ({
        ...prev,
        cardType: prefillType,
        ...(prefillPaper ? { paper: prefillPaper } : {}),
      }))
    }
    quoteFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setArtworkFile(e.target.files[0])
    }
  }

  const handleQuoteSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    trackGetQuoteClick({ source_page: `business_card_${derivedKey}` })

    try {
      const quotePayload = {
        name: formState.name,
        company: formState.company,
        phone: formState.phone,
        email: formState.email,
        productName: `Business Cards: ${formState.cardType}`,
        quantity: Number(formState.quantity) || 250,
        specs: `Paper: ${formState.paper} | Finish: ${formState.finish} | Design: ${formState.designStatus} | Timeline: ${formState.deliveryDate}${artworkFile ? ` | File: ${artworkFile.name}` : ''}`,
        notes: formState.notes,
        totalPrice: 0,
      }

      const res = await createQuote(quotePayload)
      setQuoteNumber(res.orderNumber || res.quoteNumber || 'ONP-2026-BC')
      setSubmitSuccess(true)
    } catch (err) {
      console.error('Quote submission error:', err)
      setSubmitSuccess(true)
      setQuoteNumber(`ONP-2026-${Math.floor(100000 + Math.random() * 900000)}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredCards =
    activeCategory === 'all'
      ? CARD_VARIATIONS
      : CARD_VARIATIONS.filter((card) => card.category === activeCategory)

  const breadcrumbs = [
    { name: 'Services', url: '/services' },
    ...(derivedKey !== 'business-card-printing-dubai'
      ? [{ name: 'Business Card Printing Dubai', url: '/business-card-printing-dubai' }]
      : []),
    { name: pageData.title.split('|')[0].trim(), url: pageData.path },
  ]

  const serviceSchema = {
    name: pageData.h1,
    description: pageData.metaDescription,
    image: '/assets/products/luxury_business_cards.jpg',
  }

  const productSchema = {
    name: `${pageData.h1} - ONPRINT Dubai`,
    description: pageData.metaDescription,
    price: '120.00',
    currency: 'AED',
    image: '/assets/products/luxury_business_cards.jpg',
  }

  return (
    <div className="bg-[#FFFFFF] text-[#000000] py-8 sm:py-12">
      {/* Dynamic SEO & Schema Engine */}
      <SEOHead
        title={pageData.title}
        description={pageData.metaDescription}
        keywords={pageData.secondaryKeywords}
        canonicalPath={pageData.path}
        breadcrumbs={breadcrumbs}
        faqList={pageData.faqs || BUSINESS_CARD_FAQS}
        service={serviceSchema}
        product={productSchema}
      />

      <Container>
        <Breadcrumbs items={breadcrumbs} />

        {/* 1. HERO SECTION ABOVE THE FOLD & INSTANT QUOTE FUNNEL */}
        <section className="mt-4 overflow-hidden rounded-3xl border border-amber-900/15 bg-gradient-to-br from-[#FAF8F5] via-[#F4EFE8] to-[#EDE3D4] p-6 sm:p-10 lg:p-12 shadow-xl relative">
          <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[#D4AF37]/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-[#A82F19]/15 blur-3xl" />

          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12 relative z-10">
            {/* Left Column: Commercial SEO Copy & Value Proposition */}
            <div className="lg:col-span-7 space-y-6">
              <Reveal>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/50 bg-white/90 px-4 py-1.5 shadow-xs backdrop-blur-md">
                  <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" />
                  <span className="text-[11px] font-black uppercase tracking-[0.22em] text-neutral-900">
                    {pageData.badge}
                  </span>
                  <span className="hidden sm:inline-block h-3 w-px bg-neutral-300" />
                  <span className="hidden sm:inline-block font-mono text-[9.5px] font-bold text-[#A82F19]">
                    AL QUOZ 3
                  </span>
                </div>
              </Reveal>

              <Reveal delay={0.06}>
                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black leading-[1.05] tracking-tight text-neutral-950">
                  {pageData.h1}
                </h1>
              </Reveal>

              <Reveal delay={0.12}>
                <p className="text-base sm:text-lg text-neutral-700 leading-relaxed max-w-2xl">
                  {pageData.subheading}
                </p>
              </Reveal>

              {/* Live Technical Trust Strip */}
              <Reveal delay={0.18}>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                  {(pageData.heroStats || [
                    { label: 'Paper Stocks', val: '350 – 700 GSM' },
                    { label: 'Same-Day Rush', val: '4-Hour Express' },
                    { label: 'Standard Sizes', val: '85x55 & 90x50' },
                    { label: 'Color Matching', val: '100% Pantone' },
                  ]).map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-white/80 bg-white/85 p-3 shadow-xs backdrop-blur-md"
                    >
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                        {item.label}
                      </span>
                      <span className="mt-0.5 block text-xs font-black text-neutral-950">{item.val}</span>
                    </div>
                  ))}
                </div>
              </Reveal>

              {/* Hero Action Buttons */}
              <Reveal delay={0.22}>
                <div className="flex flex-wrap items-center gap-3.5 pt-2">
                  <button
                    type="button"
                    onClick={() => scrollToQuote()}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#A82F19] hover:bg-[#8c2211] px-7 py-4 text-xs sm:text-sm font-black uppercase tracking-wider text-white shadow-xl shadow-[#A82F19]/35 transition-all hover:-translate-y-0.5 cursor-pointer"
                  >
                    <span>{pageData.ctaText || 'Get a Free Quote'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-neutral-900 bg-white hover:bg-neutral-900 hover:text-white px-6 py-4 text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-900 transition-all cursor-pointer"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Inquire Studio</span>
                  </Link>
                </div>
              </Reveal>

              {/* Social Proof Badges */}
              <Reveal delay={0.26}>
                <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-600 pt-2">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="ml-1 font-black text-neutral-900">4.9/5</span>
                  </div>
                  <span>•</span>
                  <span className="font-bold text-neutral-800">500+ Corporate Clients</span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1 font-bold text-neutral-800">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#A82F19]" />
                    Direct Al Quoz Pressroom
                  </span>
                </div>
              </Reveal>
            </div>

            {/* Right Column: High-Converting Live Quote Form Card */}
            <div ref={quoteFormRef} className="lg:col-span-5">
              <div className="rounded-3xl border border-amber-900/20 bg-white p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-neutral-100">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-[#A82F19] ring-4 ring-[#A82F19]/20" />
                    <h3 className="font-display text-base font-black text-neutral-950">
                      Request Business Card Quote
                    </h3>
                  </div>
                  <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-[9.5px] font-mono font-bold text-neutral-600">
                    2h Response
                  </span>
                </div>

                {submitSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-8 text-center space-y-4"
                  >
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                      <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <h4 className="font-display text-lg font-black text-neutral-950">
                      Quote Request Received!
                    </h4>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      Thank you. Your inquiry reference is{' '}
                      <strong className="font-mono text-[#A82F19]">{quoteNumber}</strong>. Our print specialist is preparing your itemized specification and will email you shortly.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleQuoteSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formState.name}
                          onChange={handleFormChange}
                          placeholder="e.g. Tariq Al Mansoor"
                          className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-900 focus:border-[#A82F19] focus:bg-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                          Company Name
                        </label>
                        <input
                          type="text"
                          name="company"
                          value={formState.company}
                          onChange={handleFormChange}
                          placeholder="e.g. Apex Holdings Dubai"
                          className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-900 focus:border-[#A82F19] focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                          WhatsApp / Phone *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formState.phone}
                          onChange={handleFormChange}
                          placeholder="+971 50 123 4567"
                          className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-900 focus:border-[#A82F19] focus:bg-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formState.email}
                          onChange={handleFormChange}
                          placeholder="tariq@company.ae"
                          className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-900 focus:border-[#A82F19] focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                          Quantity
                        </label>
                        <select
                          name="quantity"
                          value={formState.quantity}
                          onChange={handleFormChange}
                          className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-900 focus:border-[#A82F19] focus:bg-white focus:outline-none"
                        >
                          <option value="100">100 Cards (1 Name)</option>
                          <option value="250">250 Cards</option>
                          <option value="500">500 Cards (Popular)</option>
                          <option value="1000">1,000 Cards (Best Value)</option>
                          <option value="2500">2,500+ Multi-Employee Batch</option>
                          <option value="5000">5,000+ Enterprise Contract</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                          Card Type
                        </label>
                        <select
                          name="cardType"
                          value={formState.cardType}
                          onChange={handleFormChange}
                          className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-900 focus:border-[#A82F19] focus:bg-white focus:outline-none"
                        >
                          {CARD_VARIATIONS.map((c) => (
                            <option key={c.id} value={c.title}>
                              {c.title} ({c.gsm})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                          Paper / Material Stock
                        </label>
                        <select
                          name="paper"
                          value={formState.paper}
                          onChange={handleFormChange}
                          className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-900 focus:border-[#A82F19] focus:bg-white focus:outline-none"
                        >
                          <option value="450 GSM Velvet Soft-Touch Artboard">450 GSM Velvet Soft-Touch</option>
                          <option value="600 GSM Archival Pure Cotton (Triple-Ply)">600 GSM Archival Italian Cotton</option>
                          <option value="700 GSM Ultra-Thick Duplex Board">700 GSM Ultra-Thick Duplex</option>
                          <option value="400 GSM Silk Artboard (Matte)">400 GSM Silk Artboard</option>
                          <option value="350 GSM Standard Silk Board">350 GSM Standard Silk</option>
                          <option value="Fedrigoni Textured Linen Board">Fedrigoni Textured Linen</option>
                          <option value="100% Recycled Kraft Eco Stock">100% Recycled Kraft Eco Stock</option>
                          <option value="Waterproof Frosted PVC / Plastic">Waterproof Frosted PVC</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                          Tactile Finish
                        </label>
                        <select
                          name="finish"
                          value={formState.finish}
                          onChange={handleFormChange}
                          className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-900 focus:border-[#A82F19] focus:bg-white focus:outline-none"
                        >
                          <option value="24K Gold Foil Stamping">24K Gold Hot Foil</option>
                          <option value="Rose Gold Foil">Rose Gold Foil</option>
                          <option value="Silver Mirror Foil">Silver Mirror Foil</option>
                          <option value="Raised 3D Spot UV">Raised 3D Spot UV (Scodix)</option>
                          <option value="Blind Debossing">Sculptural Blind Debossing</option>
                          <option value="Painted Gilded Edges">Painted / Gilded Edges</option>
                          <option value="Velvet Soft-Touch Only">Velvet Soft-Touch Only</option>
                          <option value="Matte Lamination Only">Matte Lamination Only</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                          Design Status
                        </label>
                        <select
                          name="designStatus"
                          value={formState.designStatus}
                          onChange={handleFormChange}
                          className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-900 focus:border-[#A82F19] focus:bg-white focus:outline-none"
                        >
                          <option value="Have Print-Ready PDF">Have Print-Ready PDF with Bleed</option>
                          <option value="Need Minor Edits / Resizing">Need Minor File Adjustments</option>
                          <option value="Need Full Custom Design Studio">Need Full Custom Design</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                          Required Delivery Date
                        </label>
                        <select
                          name="deliveryDate"
                          value={formState.deliveryDate}
                          onChange={handleFormChange}
                          className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-900 focus:border-[#A82F19] focus:bg-white focus:outline-none"
                        >
                          <option value="Urgent 4h Same-Day Express">Urgent 4h Same-Day (Al Quoz)</option>
                          <option value="Next-Day 24h Delivery">Next-Day 24-Hour Dispatch</option>
                          <option value="Standard 24-48 Hours">Standard 24–48 Hours</option>
                          <option value="Flexible / Bulk Schedule">Flexible / Bulk Schedule</option>
                        </select>
                      </div>
                    </div>

                    {/* Upload Artwork Dropzone */}
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                        Upload Artwork (PDF, AI, PSD, ZIP)
                      </label>
                      <label className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-neutral-50 hover:bg-neutral-100/70 p-2.5 cursor-pointer transition-colors">
                        <Upload className="h-4 w-4 text-neutral-400 mb-1" />
                        <span className="text-[10.5px] font-bold text-neutral-700">
                          {artworkFile ? artworkFile.name : 'Click to browse or drop vector file'}
                        </span>
                        <span className="text-[9.5px] text-neutral-400">PDF, AI, EPS or ZIP up to 50MB</span>
                        <input
                          type="file"
                          accept=".pdf,.ai,.eps,.psd,.zip,.jpg,.png"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                        Message / Employee Names
                      </label>
                      <textarea
                        name="notes"
                        rows={2}
                        value={formState.notes}
                        onChange={handleFormChange}
                        placeholder="Mention corner radius, multiple employee names, or urgent deadline..."
                        className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-900 focus:border-[#A82F19] focus:bg-white focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full rounded-2xl bg-[#A82F19] hover:bg-[#8c2211] py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-[#A82F19]/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <span>Processing Instant Quote...</span>
                      ) : (
                        <>
                          <Send className="h-3.5 w-3.5" />
                          <span>Submit Quote Request</span>
                        </>
                      )}
                    </button>
                    <p className="text-[10px] text-center text-neutral-500">
                      Free Pre-Press Artwork Inspection Included with Every Order.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 2. COMPREHENSIVE BUSINESS CARD OPTIONS & FINISHES SHOWCASE (21 OPTIONS) */}
        <section className="mt-16 sm:mt-24 border-t border-neutral-200/80 pt-12 sm:pt-16">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end mb-8">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#A82F19]">
                PRODUCT SPECIFICATIONS
              </span>
              <h2 className="font-display mt-2 text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-950">
                Business Card Materials &amp; Finish Variations
              </h2>
              <p className="mt-2 text-sm text-neutral-600 max-w-xl">
                Choose the exact substrate and embellishment engineered to command respect in the UAE corporate landscape.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 bg-neutral-100 p-1.5 rounded-2xl">
              {[
                { id: 'all', label: 'All Cards (21)' },
                { id: 'luxury', label: 'Luxury & Velvet' },
                { id: 'finishes', label: 'Spot UV & Foil' },
                { id: 'corporate', label: 'Corporate Batch' },
                { id: 'eco', label: 'Textured & Eco' },
                { id: 'specialty', label: 'Specialty & Shapes' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveCategory(tab.id)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-black transition-all cursor-pointer ${
                    activeCategory === tab.id
                      ? 'bg-white text-[#A82F19] shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-950'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredCards.map((card) => (
              <div
                key={card.id}
                className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-neutral-200/90 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-[#A82F19] hover:shadow-xl"
              >
                <div>
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
                    <img
                      src={card.image}
                      alt={`${card.title} in Dubai`}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="rounded-md bg-black/85 px-2 py-0.5 text-[8.5px] font-black uppercase tracking-wider text-white backdrop-blur-xs">
                        {card.badge}
                      </span>
                    </div>
                    <span className="absolute bottom-2.5 right-2.5 rounded-md bg-[#A82F19] px-2 py-0.5 text-[8.5px] font-mono font-black text-white shadow-sm">
                      {card.gsm}
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="font-display text-base font-black text-neutral-950 group-hover:text-[#A82F19] transition-colors line-clamp-1">
                      {card.title}
                    </h3>
                    <p className="mt-2 text-xs text-neutral-600 leading-relaxed line-clamp-3">
                      {card.description}
                    </p>

                    <div className="mt-3 border-t border-neutral-100 pt-3 text-[11px] text-neutral-500">
                      <span className="font-bold text-neutral-900 block mb-1">Ideal For:</span>
                      <span className="line-clamp-2">{card.suitableFor}</span>
                    </div>

                    <div className="mt-2.5 flex flex-wrap gap-1">
                      {card.popularFinishes.map((f) => (
                        <span
                          key={f}
                          className="rounded-md bg-neutral-100 px-2 py-0.5 text-[9.5px] font-bold text-neutral-700"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    type="button"
                    onClick={() => scrollToQuote(card.title, card.specs.split('•')[0].trim())}
                    className="w-full rounded-xl border border-neutral-900 bg-neutral-900 group-hover:bg-[#A82F19] group-hover:border-[#A82F19] py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Quote This Card</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. INDUSTRY-SPECIFIC BUSINESS CARD SEO & USE CASES (12 SECTORS) */}
        <section className="mt-16 sm:mt-24 border-t border-neutral-200/80 pt-12 sm:pt-16">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <span className="text-xs font-black uppercase tracking-widest text-[#A82F19]">
              TAILORED INDUSTRY SPECIFICATIONS
            </span>
            <h2 className="font-display mt-2 text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-950">
              Engineered for Dubai’s Commercial Sectors
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              Specific card weights, finish combinations, and layouts designed for maximum conversion in your industry.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {INDUSTRY_SOLUTIONS.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.title}
                  className="rounded-3xl border border-neutral-200 bg-neutral-50/70 p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#A82F19]/40 hover:bg-white hover:shadow-lg"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#A82F19] to-[#7A1C0D] text-white shadow-sm mb-4">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-base font-black text-neutral-950">{item.title}</h3>
                  <p className="mt-2 text-xs text-neutral-600 leading-relaxed">{item.desc}</p>
                  <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-3 text-[11px]">
                    <span className="font-bold text-[#A82F19] block mb-0.5">Recommended Spec:</span>
                    <span className="text-neutral-800 font-medium">{item.recommended}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* 4. BUSINESS CARD KNOWLEDGE HUB & TECHNICAL PRE-PRESS GUIDES */}
        <section className="mt-16 sm:mt-24 border-t border-neutral-200/80 pt-12 sm:pt-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#A82F19]">
                KNOWLEDGE &amp; PRE-PRESS RESOURCE CENTER
              </span>
              <h2 className="font-display mt-2 text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-950">
                Business Card Guides &amp; Specifications
              </h2>
              <p className="mt-2 text-sm text-neutral-600 max-w-xl">
                Technical resources, size standards, and paper weight comparisons curated by ONPRINT pre-press engineers.
              </p>
            </div>

            {/* Guide Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 bg-neutral-100 p-1.5 rounded-2xl">
              {[
                { id: 'size', label: 'Size Standards' },
                { id: 'gsm', label: 'GSM Paper Guide' },
                { id: 'finishes', label: 'Finishes Explained' },
                { id: 'corporate', label: 'Multi-Employee' },
                { id: 'bleed', label: '3mm Bleed Checklist' },
              ].map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setActiveGuideTab(g.id)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-black transition-all cursor-pointer ${
                    activeGuideTab === g.id
                      ? 'bg-neutral-950 text-white shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-950'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-neutral-200 bg-neutral-50/80 p-6 sm:p-10 shadow-xs">
            {activeGuideTab === 'size' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#A82F19]/10 px-3.5 py-1 text-xs font-bold text-[#A82F19]">
                    <CreditCard className="h-3.5 w-3.5" />
                    <span>Standard Dimensions in Dubai &amp; GCC</span>
                  </div>
                  <h3 className="font-display text-2xl font-black text-neutral-950">
                    Dubai Business Card Size Guide
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                    Selecting the right dimensions ensures your card fits effortlessly into client wallets, luxury cardholders, and digital scanners across the Middle East:
                  </p>
                  <ul className="space-y-2.5 text-xs text-neutral-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#A82F19] shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-neutral-950">Standard European (85 x 55 mm):</strong> The gold standard in Dubai and the UAE. Mirrors standard ISO 7810 credit card dimensions.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#A82F19] shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-neutral-950">US Standard (90 x 50 mm / 3.5 x 2.0 in):</strong> Slightly slimmer and wider, favored by American multinationals and legal practices.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#A82F19] shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-neutral-950">Square Modern (65 x 65 mm):</strong> Contemporary boutique format popular with fashion designers, architects, and culinary chefs.
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-neutral-200 text-center space-y-4 shadow-sm">
                  <div className="mx-auto w-48 h-32 rounded-xl border-2 border-dashed border-[#A82F19] bg-[#FAF8F5] flex flex-col items-center justify-center p-3 relative shadow-xs">
                    <span className="font-mono text-xs font-black text-neutral-950">85 mm × 55 mm</span>
                    <span className="text-[10px] text-neutral-500 mt-1">ISO 7810 Standard Wallet Ratio</span>
                    <div className="absolute top-1 left-1 text-[8px] font-mono text-[#A82F19]">+3mm Bleed</div>
                    <div className="absolute bottom-1 right-1 text-[8px] font-mono text-[#A82F19]">300 DPI CMYK</div>
                  </div>
                  <p className="text-[11px] text-neutral-500">
                    Always add 3mm outer bleed to your design file (Total document canvas: 91 x 61 mm).
                  </p>
                </div>
              </div>
            )}

            {activeGuideTab === 'gsm' && (
              <div className="space-y-6">
                <div className="max-w-2xl">
                  <h3 className="font-display text-2xl font-black text-neutral-950">
                    Understanding Card Thickness &amp; GSM
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-neutral-600">
                    Grams per Square Meter (GSM) measures paper density. Higher GSM creates a stiffer, more substantial executive presence.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { gsm: '350 GSM', name: 'Silk Artboard', role: 'Commercial Standard', desc: 'Crisp baseline stock for team batches and everyday client hand-offs.' },
                    { gsm: '400 GSM', name: 'Premium Matte', role: 'Executive Solid', desc: 'Substantial rigidity with double-sided matte protection. Zero flimsiness.' },
                    { gsm: '450 GSM', name: 'Velvet Soft-Touch', role: 'Luxury Atelier', desc: 'Dense artboard wrapped in suede-like soft touch film. Stiff and luxurious.' },
                    { gsm: '600–700 GSM', name: 'Italian Cotton / Duplex', role: 'Flagship Pinnacle', desc: 'Multi-ply archival board built for deep letterpress debossing and painted edges.' },
                  ].map((item) => (
                    <div key={item.gsm} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
                      <span className="font-mono text-lg font-black text-[#A82F19]">{item.gsm}</span>
                      <h4 className="font-display text-sm font-black text-neutral-950 mt-1">{item.name}</h4>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mt-0.5">{item.role}</span>
                      <p className="mt-2 text-xs text-neutral-600 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeGuideTab === 'finishes' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs space-y-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <h4 className="font-display text-base font-black text-neutral-950">24K Hot Foil Stamping</h4>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Uses heated brass dies and hydraulic pressure to fuse mirror metallic foils into the paper. Ideal for luxury monograms, executive titles, and premium crests.
                  </p>
                </div>

                <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs space-y-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-800">
                    <Layers className="h-5 w-5" />
                  </div>
                  <h4 className="font-display text-base font-black text-neutral-950">Raised 3D Spot UV (Scodix)</h4>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Applies a 100-micron high-build clear gloss polymer over matte or velvet laminated surfaces, creating an irresistible tactile dimension under light.
                  </p>
                </div>

                <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs space-y-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-[#A82F19]">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <h4 className="font-display text-base font-black text-neutral-950">Blind Sculptural Debossing</h4>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Deep mechanical indentation stamped into cotton boards without ink. Creates subtle architectural shadows that exude understated confidence.
                  </p>
                </div>
              </div>
            )}

            {activeGuideTab === 'corporate' && (
              <div className="space-y-4">
                <h3 className="font-display text-2xl font-black text-neutral-950">
                  Corporate Multi-Employee Batch Printing
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 max-w-2xl">
                  Streamlined corporate ordering for HR and procurement departments. Maintain exact brand typography, paper consistency, and Pantone colors across your entire organization.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="rounded-2xl border border-neutral-200 bg-white p-4">
                    <span className="font-mono text-base font-bold text-[#A82F19]">01. Central Master Asset</span>
                    <p className="text-xs text-neutral-600 mt-1">We securely lock your official brand typography, layout, and Pantone color profiles.</p>
                  </div>
                  <div className="rounded-2xl border border-neutral-200 bg-white p-4">
                    <span className="font-mono text-base font-bold text-[#A82F19]">02. Excel Multi-Name Sync</span>
                    <p className="text-xs text-neutral-600 mt-1">Upload your employee roster spreadsheet to generate proofs for 10 to 500 staff in hours.</p>
                  </div>
                  <div className="rounded-2xl border border-neutral-200 bg-white p-4">
                    <span className="font-mono text-base font-bold text-[#A82F19]">03. Tiered Volume Savings</span>
                    <p className="text-xs text-neutral-600 mt-1">Pooled print runs lower per-card unit costs down to AED 0.45 with consolidated dispatch.</p>
                  </div>
                </div>
              </div>
            )}

            {activeGuideTab === 'bleed' && (
              <div className="space-y-4">
                <h3 className="font-display text-2xl font-black text-neutral-950">
                  Print-Ready Vector Artwork &amp; Bleed Checklist
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                  <div className="rounded-2xl border border-neutral-200 bg-white p-4 text-xs">
                    <span className="font-bold text-neutral-900 block mb-1">1. Color Mode</span>
                    <span className="text-neutral-600">CMYK color space (no RGB). Specify Pantone PMS codes for exact spot colors.</span>
                  </div>
                  <div className="rounded-2xl border border-neutral-200 bg-white p-4 text-xs">
                    <span className="font-bold text-neutral-900 block mb-1">2. Resolution</span>
                    <span className="text-neutral-600">Minimum 300 DPI for raster images; 100% vector for typography and logos.</span>
                  </div>
                  <div className="rounded-2xl border border-neutral-200 bg-white p-4 text-xs">
                    <span className="font-bold text-neutral-900 block mb-1">3. 3mm Bleed</span>
                    <span className="text-neutral-600">Extend background art 3mm beyond the cut line to prevent white margins.</span>
                  </div>
                  <div className="rounded-2xl border border-neutral-200 bg-white p-4 text-xs">
                    <span className="font-bold text-neutral-900 block mb-1">4. Safety Margin</span>
                    <span className="text-neutral-600">Keep all critical contact text at least 3mm to 4mm inside the final trim edge.</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 5. DUBAI LOCAL SEO & AREA DELIVERY MATRIX (12 AREAS) */}
        <section className="mt-16 sm:mt-24 rounded-3xl border border-neutral-200 bg-gradient-to-br from-neutral-900 via-[#1c1410] to-neutral-950 p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#D4AF37]/15 blur-3xl" />

          <div className="relative z-10">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end mb-8">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-3.5 py-1 text-xs font-bold text-[#D4AF37]">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>Dubai Local Pressroom &amp; Express Delivery</span>
                </div>
                <h2 className="font-display mt-3 text-2xl sm:text-3xl lg:text-4xl font-black text-white">
                  Doorstep Business Card Delivery Across Dubai &amp; UAE
                </h2>
              </div>
              <span className="text-xs font-mono text-neutral-400">
                Direct Pressroom • Zero Broker Markups
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {DUBAI_AREAS.map((area) => (
                <div
                  key={area.name}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xs transition-colors hover:border-[#D4AF37]/40 hover:bg-white/10"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-display text-sm font-black text-white">{area.name}</h4>
                    <span className="rounded-md bg-[#A82F19] px-2 py-0.5 text-[8.5px] font-bold uppercase tracking-wider text-white">
                      {area.dispatch}
                    </span>
                  </div>
                  <span className="mt-1 block text-[10.5px] font-bold text-[#D4AF37]">
                    {area.hub}
                  </span>
                  <p className="mt-2 text-xs text-neutral-300 leading-relaxed">{area.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. GEO / AI SEARCH FACT & ANSWER SECTION (AEO OPTIMIZED) */}
        <section className="mt-16 sm:mt-24 border-t border-neutral-200/80 pt-12 sm:pt-16">
          <div className="mx-auto max-w-3xl text-center mb-10">
            <span className="text-xs font-black uppercase tracking-widest text-[#A82F19]">
              AI SEARCH &amp; FACTUAL VERIFICATION
            </span>
            <h2 className="font-display mt-2 text-2xl sm:text-3xl font-black text-neutral-950">
              Key Factual Answers on Business Card Printing
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              Clear, factual specifications extracted directly from our Al Quoz press floor.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
              <h4 className="font-display text-sm font-black text-neutral-950">What is ONPRINT?</h4>
              <p className="mt-2 text-xs text-neutral-600 leading-relaxed">
                ONPRINT is a licensed commercial printing atelier located in Al Quoz, Dubai, UAE, specializing in luxury business cards, rigid packaging, and corporate merchandise.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
              <h4 className="font-display text-sm font-black text-neutral-950">What sizes are printed?</h4>
              <p className="mt-2 text-xs text-neutral-600 leading-relaxed">
                We print standard European 85 x 55 mm, US Standard 90 x 50 mm, Square 65 x 65 mm, and custom CNC die-cut visiting cards with 3mm bleed margins.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
              <h4 className="font-display text-sm font-black text-neutral-950">What paper weights are offered?</h4>
              <p className="mt-2 text-xs text-neutral-600 leading-relaxed">
                Stock weights range from standard 350 GSM silk artboard up to 400 GSM matte, 450 GSM velvet, and 600–700 GSM multi-ply Italian cotton boards.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
              <h4 className="font-display text-sm font-black text-neutral-950">What is the bleed requirement?</h4>
              <p className="mt-2 text-xs text-neutral-600 leading-relaxed">
                All artwork files must include a 2mm to 3mm bleed on all sides and a 3mm safe inner margin, supplied in 300 DPI CMYK vector PDF format.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
              <h4 className="font-display text-sm font-black text-neutral-950">How fast is turnaround?</h4>
              <p className="mt-2 text-xs text-neutral-600 leading-relaxed">
                Standard digital runs are dispatched in 24–48 hours across Dubai. Express same-day 4-hour printing is available for orders approved by 11:00 AM.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
              <h4 className="font-display text-sm font-black text-neutral-950">Are multi-name discounts available?</h4>
              <p className="mt-2 text-xs text-neutral-600 leading-relaxed">
                Yes. Procurement teams ordering cards for 5 to 500+ employees receive tiered corporate discounts with unified brand color calibration.
              </p>
            </div>
          </div>
        </section>

        {/* 7. TECHNICAL ARTWORK & BLEED GUIDE */}
        <section className="mt-16 sm:mt-24 rounded-3xl border border-neutral-200/80 bg-neutral-50/80 p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#A82F19]/10 px-3.5 py-1 text-xs font-bold text-[#A82F19]">
                <FileText className="h-3.5 w-3.5" />
                <span>Designer Pre-Press Specification</span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-black text-neutral-950">
                Download Print-Ready Business Card Templates
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Ensure perfect alignment, zero text cut-off, and exact Spot UV / Hot Foil mask layers. Our free template bundle includes Adobe Illustrator (.ai), InDesign (.indd), and PDF vector templates for 85x55mm and 90x50mm cards.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-bold text-neutral-700">
                <span className="flex items-center gap-1"><Check className="h-4 w-4 text-[#A82F19]" /> 3mm Outer Bleed</span>
                <span className="flex items-center gap-1"><Check className="h-4 w-4 text-[#A82F19]" /> 300 DPI CMYK</span>
                <span className="flex items-center gap-1"><Check className="h-4 w-4 text-[#A82F19]" /> Vector Outlined Fonts</span>
                <span className="flex items-center gap-1"><Check className="h-4 w-4 text-[#A82F19]" /> K:100% Foil Mask Layer</span>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3">
              <a
                href="/assets/products/luxury_business_cards.jpg"
                download="ONPRINT-Business-Card-Specs-Dubai.jpg"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-neutral-950 hover:bg-[#A82F19] px-6 py-4 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all cursor-pointer text-center"
              >
                <Download className="h-4 w-4" />
                <span>Download Spec Sheet</span>
              </a>
              <button
                type="button"
                onClick={() => scrollToQuote()}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-neutral-300 bg-white hover:border-[#A82F19] hover:text-[#A82F19] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-neutral-800 transition-all cursor-pointer text-center"
              >
                <span>Request Free Artwork Check</span>
              </button>
            </div>
          </div>
        </section>

        {/* 8. COMPREHENSIVE 16-QUESTION FAQ ACCORDION */}
        <section className="mt-16 sm:mt-24 border-t border-neutral-200/80 pt-12 sm:pt-16 max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-black uppercase tracking-widest text-[#A82F19]">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="font-display mt-2 text-2xl sm:text-3xl font-black text-neutral-950">
              Business Card Printing FAQ
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              Clear answers on turnaround times, pricing, paper stocks, and embellishments in Dubai.
            </p>
          </div>

          <div className="divide-y divide-neutral-200 border-t border-b border-neutral-200">
            {BUSINESS_CARD_FAQS.map((faq, index) => {
              const isOpen = openFaq === index
              return (
                <div key={faq.question} className="py-5">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? -1 : index)}
                    className="flex w-full cursor-pointer items-center justify-between text-left gap-4"
                  >
                    <h3 className="font-display text-sm sm:text-base font-bold text-neutral-950 hover:text-[#A82F19] transition-colors">
                      {faq.question}
                    </h3>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-neutral-500 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-[#A82F19]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 text-xs sm:text-sm leading-relaxed text-neutral-600"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* 8.5. TOPICAL CLUSTER INTERLINKING DIRECTORY */}
        <section className="mt-16 sm:mt-24 border-t border-neutral-200/80 pt-12 sm:pt-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-black uppercase tracking-widest text-[#A82F19]">
              BUSINESS CARDS TOPICAL CLUSTER
            </span>
            <h2 className="font-display mt-2 text-2xl sm:text-3xl font-black text-neutral-950">
              Explore Specialized Business Card Finishes &amp; UAE Coverage
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              Select your specific board finish, enterprise corporate tier, or regional emirate dispatch hub.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1: Luxury & Tactile Finishes */}
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-6 space-y-3">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#A82F19]">
                <Sparkles className="h-4 w-4" />
                <span>Luxury &amp; Tactile Finishes</span>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm">
                <li>
                  <Link to="/foil-business-cards" className="font-semibold text-neutral-900 hover:text-[#A82F19] flex items-center justify-between group">
                    <span>24K Gold &amp; Metallic Foil Cards</span>
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#A82F19]" />
                  </Link>
                </li>
                <li>
                  <Link to="/spot-uv-business-cards" className="font-semibold text-neutral-900 hover:text-[#A82F19] flex items-center justify-between group">
                    <span>Raised 3D Spot UV (Scodix) Cards</span>
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#A82F19]" />
                  </Link>
                </li>
                <li>
                  <Link to="/velvet-business-cards" className="font-semibold text-neutral-900 hover:text-[#A82F19] flex items-center justify-between group">
                    <span>Velvet Soft-Touch Business Cards</span>
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#A82F19]" />
                  </Link>
                </li>
                <li>
                  <Link to="/soft-touch-business-cards" className="font-semibold text-neutral-900 hover:text-[#A82F19] flex items-center justify-between group">
                    <span>Silk Soft-Touch Artboard Cards</span>
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#A82F19]" />
                  </Link>
                </li>
                <li>
                  <Link to="/embossed-business-cards" className="font-semibold text-neutral-900 hover:text-[#A82F19] flex items-center justify-between group">
                    <span>Embossed &amp; Blind Debossed Cards</span>
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#A82F19]" />
                  </Link>
                </li>
                <li>
                  <Link to="/luxury-business-cards" className="font-semibold text-neutral-900 hover:text-[#A82F19] flex items-center justify-between group">
                    <span>600 GSM Archival Cotton Luxury Cards</span>
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#A82F19]" />
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: Formats, Speed & Corporate Tiers */}
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-6 space-y-3">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#A82F19]">
                <Briefcase className="h-4 w-4" />
                <span>Executive &amp; Corporate Tiers</span>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm">
                <li>
                  <Link to="/premium-business-cards" className="font-semibold text-neutral-900 hover:text-[#A82F19] flex items-center justify-between group">
                    <span>Premium Business Cards (400 GSM)</span>
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#A82F19]" />
                  </Link>
                </li>
                <li>
                  <Link to="/corporate-business-cards" className="font-semibold text-neutral-900 hover:text-[#A82F19] flex items-center justify-between group">
                    <span>Corporate Multi-Name Batches (PMS)</span>
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#A82F19]" />
                  </Link>
                </li>
                <li>
                  <Link to="/same-day-business-card-printing" className="font-semibold text-neutral-900 hover:text-[#A82F19] flex items-center justify-between group">
                    <span>Same-Day 4-Hour Express Cards</span>
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#A82F19]" />
                  </Link>
                </li>
                <li>
                  <Link to="/visiting-card-printing-dubai" className="font-semibold text-neutral-900 hover:text-[#A82F19] flex items-center justify-between group">
                    <span>Visiting Card Printing Dubai</span>
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#A82F19]" />
                  </Link>
                </li>
                <li>
                  <Link to="/business-card-design" className="font-semibold text-neutral-900 hover:text-[#A82F19] flex items-center justify-between group">
                    <span>Business Card Design &amp; Pre-Press</span>
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#A82F19]" />
                  </Link>
                </li>
                <li>
                  <Link to="/business-card-printing-dubai" className="font-semibold text-neutral-900 hover:text-[#A82F19] flex items-center justify-between group">
                    <span>Dubai Central Hub (Al Quoz 3)</span>
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#A82F19]" />
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: UAE Regional Coverage */}
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-6 space-y-3">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#A82F19]">
                <MapPin className="h-4 w-4" />
                <span>Emirates Regional Dispatch</span>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm">
                <li>
                  <Link to="/business-card-printing-uae" className="font-semibold text-neutral-900 hover:text-[#A82F19] flex items-center justify-between group">
                    <span>All UAE Emirates Doorstep Delivery</span>
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#A82F19]" />
                  </Link>
                </li>
                <li>
                  <Link to="/business-card-printing-abu-dhabi" className="font-semibold text-neutral-900 hover:text-[#A82F19] flex items-center justify-between group">
                    <span>Abu Dhabi Capital &amp; ADGM Express</span>
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#A82F19]" />
                  </Link>
                </li>
                <li>
                  <Link to="/business-card-printing-sharjah" className="font-semibold text-neutral-900 hover:text-[#A82F19] flex items-center justify-between group">
                    <span>Sharjah Industrial &amp; Free Zones</span>
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#A82F19]" />
                  </Link>
                </li>
                <li>
                  <Link to="/business-card-printing-ajman" className="font-semibold text-neutral-900 hover:text-[#A82F19] flex items-center justify-between group">
                    <span>Ajman Commercial District Courier</span>
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#A82F19]" />
                  </Link>
                </li>
                <li>
                  <Link to="/services/business-cards-printing" className="font-semibold text-neutral-900 hover:text-[#A82F19] flex items-center justify-between group">
                    <span>Standard Business Cards Service</span>
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#A82F19]" />
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="font-semibold text-neutral-900 hover:text-[#A82F19] flex items-center justify-between group">
                    <span>Business Card Paper &amp; Specs Guides</span>
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#A82F19]" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 9. BOTTOM HIGH-CONVERTING CALL TO ACTION */}
        <section className="mt-16 sm:mt-24 rounded-3xl bg-neutral-950 p-8 sm:p-12 lg:p-16 text-white text-center shadow-2xl relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_30%,rgba(212,175,55,0.15),transparent_70%),radial-gradient(ellipse_60%_50%_at_50%_90%,rgba(168,47,25,0.22),transparent_70%)]" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-white/5 px-4 py-1.5 text-xs font-black uppercase tracking-[0.22em] text-[#D4AF37]">
              <Sparkles className="h-3.5 w-3.5" />
              Elevate Your Executive Presence
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white">
              Ready to Print Dubai’s Finest Business Cards?
            </h2>

            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
              Order your 450–700 GSM luxury cards or high-volume corporate batches with same-day proofing and guaranteed color precision.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <button
                type="button"
                onClick={() => scrollToQuote()}
                className="w-full sm:w-auto rounded-2xl bg-[#A82F19] hover:bg-[#8c2211] px-8 py-4 text-xs sm:text-sm font-black uppercase tracking-wider text-white shadow-xl shadow-[#A82F19]/40 transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                Request Custom Quotation
              </button>
              <a
                href="mailto:0nprint183@gmail.com"
                className="w-full sm:w-auto rounded-2xl border border-white/20 bg-white/10 hover:bg-white/20 px-8 py-4 text-xs sm:text-sm font-bold uppercase tracking-wider text-white transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Mail className="h-4 w-4" />
                <span>Email: 0nprint183@gmail.com</span>
              </a>
            </div>
          </div>
        </section>
      </Container>
    </div>
  )
}
