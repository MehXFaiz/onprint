import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock, Star, CheckCircle2, ArrowRight, Building2, Printer, FileText, Layers, MessageCircle } from 'lucide-react'
import Container from '../../components/Container'
import Button from '../../components/Button'
import Breadcrumbs from '../../components/Breadcrumbs'
import SEOHead from '../../components/SEOHead'
import Reveal from '../../components/Reveal'
import { FORMATTED_PHONE, getServiceWhatsAppUrl } from '../../utils/whatsapp'

const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://0nprint.com').replace(/\/$/, '')

const LOCATION_DATA = {
  'abu-dhabi': {
    name: 'Abu Dhabi',
    region: 'Abu Dhabi',
    geo: { lat: 24.4539, lng: 54.3773 },
    title: 'Printing Services in Abu Dhabi & Al Ain | ONPRINT UAE',
    description: 'Commercial printing services across Abu Dhabi & Al Ain. Luxury business cards, corporate stationery, exhibition displays, product packaging, and promotional gifts with express UAE delivery.',
    keywords: 'printing services abu dhabi, commercial printing abu dhabi, business cards abu dhabi, corporate stationery abu dhabi, roll up banners abu dhabi, packaging printing abu dhabi',
    areas: ['Abu Dhabi City', 'Al Ain', 'Khalifa City', 'Al Reem Island', 'Saadiyat Island', 'Yas Island', 'Masdar City'],
  },
  'sharjah': {
    name: 'Sharjah',
    region: 'Sharjah',
    geo: { lat: 25.2854, lng: 55.3863 },
    title: 'Commercial Printing Services in Sharjah | ONPRINT UAE',
    description: 'Full-service digital and offset commercial printing in Sharjah. Premium business cards, brochures, flyers, custom stickers, boxes, and branded merchandise with reliable express delivery.',
    keywords: 'printing services sharjah, digital printing sharjah, offset printing sharjah, business cards sharjah, sticker printing sharjah, packaging sharjah',
    areas: ['Sharjah City', 'Al Qasba', 'Al Majaz', 'University City', 'Industrial Area', 'Muweilah', 'Al Nahda'],
  },
  'ajman': {
    name: 'Ajman',
    region: 'Ajman',
    geo: { lat: 25.4052, lng: 55.5136 },
    title: 'Printing Services in Ajman | ONPRINT Commercial Solutions',
    description: 'Professional commercial printing in Ajman. High-quality business cards, brochures, roll-up banners, custom labels, and corporate identity printing with fast turnaround and competitive pricing.',
    keywords: 'printing services ajman, business card printing ajman, commercial printing ajman, banner printing ajman, custom stickers ajman',
    areas: ['Ajman City', 'Al Nuaimiya', 'Al Rashidiya', 'Al Bustan', 'Industrial Area', 'Al Jurf'],
  },
  'ras-al-khaimah': {
    name: 'Ras Al Khaimah',
    region: 'Ras Al Khaimah',
    geo: { lat: 25.7942, lng: 55.9764 },
    title: 'Printing Services in Ras Al Khaimah (RAK) | ONPRINT',
    description: 'Commercial and corporate printing services for businesses across Ras Al Khaimah. Premium business cards, exhibition signage, marketing brochures, custom labels, and corporate gifts.',
    keywords: 'printing services ras al khaimah, commercial printing rak, business cards rak, signage printing rak, packaging printing rak',
    areas: ['RAK City', 'Al Hamra', 'Al Nakheel', 'Al Dhait', 'Industrial Area', 'Jazirat Al Hamra'],
  },
}

const SERVICES = [
  {
    icon: FileText,
    title: 'Business Cards Printing',
    desc: 'Luxury business cards with premium finishes including soft-touch, foil stamping, spot UV, and painted edges.',
  },
  {
    icon: FileText,
    title: 'Corporate Stationery',
    desc: 'Executive letterheads, presentation folders, envelopes, and branded business stationery suites.',
  },
  {
    icon: Layers,
    title: 'Marketing Materials',
    desc: 'Brochures, flyers, catalogs, and promotional collateral produced with high-definition digital and offset printing.',
  },
  {
    icon: Printer,
    title: 'Large Format Printing',
    desc: 'Roll-up banners, pop-up displays, vinyl signage, and exhibition backdrops designed for events and retail.',
  },
  {
    icon: Building2,
    title: 'Corporate Branding & Gifts',
    desc: 'Drinkware, water bottles, mugs, notebooks, pens, and customized executive gift packages.',
  },
  {
    icon: Star,
    title: 'Custom Packaging & Labels',
    desc: 'Rigid luxury boxes, corrugated mailers, paper bags, and waterproof roll labels.',
  },
]

const WHY_CHOOSE_US = [
  'Prompt dispatch and courier delivery across the emirate',
  'Premium certified paper stocks and European inks',
  'Transparent B2B pricing with no hidden charges',
  'Free file pre-flight and press proof verification',
  'Tiered volume discounts for corporate orders',
  'Dedicated WhatsApp support for instant quotes and artwork review',
]

export default function LocationLandingPage({ locationKey }) {
  const locationData = LOCATION_DATA[locationKey]

  if (!locationData) {
    return (
      <Container className="py-24 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Location Not Found</h1>
        <p className="text-slate-600 mb-6">The requested regional printing page does not exist.</p>
        <Button to="/services">Explore All Services</Button>
      </Container>
    )
  }

  const breadcrumbs = [
    { name: 'Services', path: '/services' },
    { name: `Printing in ${locationData.name}`, path: `/printing-services-${locationKey}` },
  ]

  const locationSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `ONPRINT ${locationData.name}`,
    description: locationData.description,
    url: `${SITE_URL}/printing-services-${locationKey}`,
    telephone: FORMATTED_PHONE,
    email: '0nprint183@gmail.com',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      addressLocality: locationData.name,
      addressRegion: locationData.region,
      addressCountry: 'AE',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: locationData.geo.lat,
      longitude: locationData.geo.lng,
    },
    areaServed: locationData.areas.map((area) => ({
      '@type': 'City',
      name: area,
    })),
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '08:30',
        closes: '18:30',
      },
    ],
  }

  const whatsAppUrl = getServiceWhatsAppUrl('general', {
    notes: `Location inquiry for ${locationData.name} printing services`,
  })

  return (
    <>
      <SEOHead
        title={locationData.title}
        description={locationData.description}
        keywords={locationData.keywords}
        canonicalPath={`/printing-services-${locationKey}`}
        structuredData={locationSchema}
        breadcrumbs={breadcrumbs}
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
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5500]/10 text-[#FF5500] text-xs font-semibold uppercase tracking-wider mb-4">
                  <MapPin className="h-3.5 w-3.5" /> Fast Delivery Across {locationData.name}
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
                  Commercial Printing Services in {locationData.name}
                </h1>
                <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
                  {locationData.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button to="/get-a-quote" size="lg">
                    Request Free Quote
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <a
                    href={whatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#25D366] text-white font-medium hover:bg-[#20ba5a] transition-colors shadow-sm"
                  >
                    <MessageCircle className="h-5 w-5" />
                    Chat on WhatsApp
                  </a>
                  <Button to="/products" variant="outline" size="lg">
                    View Products
                  </Button>
                </div>
              </motion.div>
            </section>
          </Reveal>

          {/* Service Areas */}
          <Reveal>
            <section className="py-12 mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 text-center">
                Areas We Serve Across {locationData.name}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                {locationData.areas.map((area, index) => (
                  <motion.div
                    key={area}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-lg p-4 shadow-sm border border-slate-200 text-center hover:shadow-md transition-shadow"
                  >
                    <MapPin className="h-5 w-5 text-[#FF5500] mx-auto mb-2" />
                    <span className="text-sm font-medium text-slate-700">{area}</span>
                  </motion.div>
                ))}
              </div>
            </section>
          </Reveal>

          {/* Services */}
          <Reveal>
            <section className="py-16 mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-12 text-center">
                Printing Capabilities Available in {locationData.name}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {SERVICES.map((service, index) => (
                  <motion.div
                    key={service.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                    className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-shadow"
                  >
                    <service.icon className="h-10 w-10 text-[#FF5500] mb-4" />
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">{service.title}</h3>
                    <p className="text-slate-600">{service.desc}</p>
                  </motion.div>
                ))}
              </div>
            </section>
          </Reveal>

          {/* Why Choose Us */}
          <Reveal>
            <section className="py-16 mb-16 bg-slate-900 text-white rounded-2xl p-8 lg:p-12">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
                Why Corporate Clients in {locationData.name} Choose ONPRINT
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {WHY_CHOOSE_US.map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="h-6 w-6 text-[#FF5500] shrink-0 mt-0.5" />
                    <span className="text-slate-200">{item}</span>
                  </motion.div>
                ))}
              </div>
            </section>
          </Reveal>

          {/* CTA Section */}
          <Reveal>
            <section className="py-16 mb-16 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                Ready to Print for Your Business in {locationData.name}?
              </h2>
              <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
                Request a formal quotation or speak directly with our print production specialists on WhatsApp for instant guidance and artwork checks.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button to="/get-a-quote" size="lg">
                  Request Free Quote
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-slate-800 font-semibold hover:text-[#25D366] transition-colors"
                >
                  <MessageCircle className="h-5 w-5 text-[#25D366]" />
                  <span>WhatsApp: {FORMATTED_PHONE}</span>
                </a>
              </div>
            </section>
          </Reveal>

          {/* Contact Info */}
          <Reveal>
            <section className="py-12 border-t border-slate-200">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <Phone className="h-8 w-8 text-[#FF5500] mx-auto mb-3" />
                  <h3 className="font-semibold text-slate-900 mb-1">Direct Hotline / WhatsApp</h3>
                  <p className="text-slate-600">{FORMATTED_PHONE}</p>
                </div>
                <div>
                  <Mail className="h-8 w-8 text-[#FF5500] mx-auto mb-3" />
                  <h3 className="font-semibold text-slate-900 mb-1">Email Sales Desk</h3>
                  <p className="text-slate-600">0nprint183@gmail.com</p>
                </div>
                <div>
                  <Clock className="h-8 w-8 text-[#FF5500] mx-auto mb-3" />
                  <h3 className="font-semibold text-slate-900 mb-1">Production Hours</h3>
                  <p className="text-slate-600">Mon - Sat: 8:30 AM - 6:30 PM</p>
                </div>
              </div>
            </section>
          </Reveal>
        </Container>
      </div>
    </>
  )
}
