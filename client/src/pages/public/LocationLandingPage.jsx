import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock, Star, CheckCircle2, ArrowRight, Building2, Printer, Box, FileText, Layers } from 'lucide-react'
import Container from '../../components/Container'
import Button from '../../components/Button'
import Breadcrumbs from '../../components/Breadcrumbs'
import SEOHead from '../../components/SEOHead'
import Reveal from '../../components/Reveal'

const LOCATION_DATA = {
  'abu-dhabi': {
    name: 'Abu Dhabi',
    region: 'Abu Dhabi',
    geo: { lat: 24.4539, lng: 54.3773 },
    title: 'Printing Services in Abu Dhabi | ONPRINT – Premium Printing Solutions',
    description: 'ONPRINT provides premium printing services in Abu Dhabi, UAE. Specializing in luxury business cards, premium business cards, foil business cards, velvet business cards, gold foil business cards, spot UV business cards, embossed business cards, debossed business cards, soft touch business cards, matte business cards, glossy business cards, custom business cards, corporate business cards, executive business cards, custom packaging, corporate gifts, and large-format signage with delivery across Abu Dhabi emirate.',
    keywords: 'printing services abu dhabi, business cards printing abu dhabi, luxury business cards abu dhabi, premium business cards abu dhabi, foil business cards abu dhabi, velvet business cards abu dhabi, gold foil business cards abu dhabi, spot UV business cards abu dhabi, embossed business cards abu dhabi, debossed business cards abu dhabi, soft touch business cards abu dhabi, matte business cards abu dhabi, glossy business cards abu dhabi, custom business cards abu dhabi, corporate business cards abu dhabi, executive business cards abu dhabi, custom packaging abu dhabi, corporate gifts abu dhabi, printing company abu dhabi, digital printing abu dhabi, offset printing abu dhabi, business cards with raised print abu dhabi, business cards with metallic finish abu dhabi, business cards with spot gloss abu dhabi, business cards with embossing abu dhabi, business cards with hot stamping abu dhabi, business cards with letterpress abu dhabi, thermography business cards abu dhabi, laminated business cards abu dhabi, uv coated business cards abu dhabi, silk business cards abu dhabi, uncoated business cards abu dhabi, recycled business cards abu dhabi, eco friendly business cards abu dhabi, sustainable business cards abu dhabi, FSC certified business cards abu dhabi, cotton business cards abu dhabi, kraft business cards abu dhabi, textured business cards abu dhabi, linen business cards abu dhabi, metal business cards abu dhabi, plastic business cards abu dhabi, clear business cards abu dhabi, transparent business cards abu dhabi, folded business cards abu dhabi, square business cards abu dhabi, rounded corner business cards abu dhabi, die cut business cards abu dhabi, custom shaped business cards abu dhabi, painted edge business cards abu dhabi, gilded edge business cards abu dhabi, triplex business cards abu dhabi, duplex business cards abu dhabi',
    areas: ['Abu Dhabi City', 'Al Ain', 'Khalifa City', 'Al Reem Island', 'Saadiyat Island', 'Yas Island', 'Masdar City'],
  },
  'sharjah': {
    name: 'Sharjah',
    region: 'Sharjah',
    geo: { lat: 25.2854, lng: 55.3863 },
    title: 'Printing Services in Sharjah | ONPRINT – Commercial Printing Solutions',
    description: 'Leading printing company in Sharjah, UAE. Offering offset printing, digital printing, luxury business cards, premium business cards, foil business cards, velvet business cards, gold foil business cards, spot UV business cards, embossed business cards, debossed business cards, soft touch business cards, matte business cards, glossy business cards, custom business cards, corporate business cards, executive business cards, packaging, and corporate branding with fast delivery across Sharjah emirate.',
    keywords: 'printing services sharjah, business cards printing sharjah, luxury business cards sharjah, premium business cards sharjah, foil business cards sharjah, velvet business cards sharjah, gold foil business cards sharjah, spot UV business cards sharjah, embossed business cards sharjah, debossed business cards sharjah, soft touch business cards sharjah, matte business cards sharjah, glossy business cards sharjah, custom business cards sharjah, corporate business cards sharjah, executive business cards sharjah, printing company sharjah, digital printing sharjah, offset printing sharjah, packaging printing sharjah, corporate branding sharjah, business cards with raised print sharjah, business cards with metallic finish sharjah, business cards with spot gloss sharjah, business cards with embossing sharjah, business cards with hot stamping sharjah, business cards with letterpress sharjah, thermography business cards sharjah, laminated business cards sharjah, uv coated business cards sharjah, silk business cards sharjah, uncoated business cards sharjah, recycled business cards sharjah, eco friendly business cards sharjah, sustainable business cards sharjah, FSC certified business cards sharjah, cotton business cards sharjah, kraft business cards sharjah, textured business cards sharjah, linen business cards sharjah, metal business cards sharjah, plastic business cards sharjah, clear business cards sharjah, transparent business cards sharjah, folded business cards sharjah, square business cards sharjah, rounded corner business cards sharjah, die cut business cards sharjah, custom shaped business cards sharjah, painted edge business cards sharjah, gilded edge business cards sharjah, triplex business cards sharjah, duplex business cards sharjah',
    areas: ['Sharjah City', 'Al Qasba', 'Al Majaz', 'University City', 'Industrial Area', 'Muweilah', 'Al Nahda'],
  },
  'ajman': {
    name: 'Ajman',
    region: 'Ajman',
    geo: { lat: 25.4052, lng: 55.5136 },
    title: 'Printing Services in Ajman | ONPRINT – Affordable Printing Solutions',
    description: 'Professional printing services in Ajman, UAE. Luxury business cards, premium business cards, foil business cards, velvet business cards, gold foil business cards, spot UV business cards, embossed business cards, debossed business cards, soft touch business cards, matte business cards, glossy business cards, custom business cards, corporate business cards, executive business cards, brochures, flyers, custom packaging, and corporate gifts with competitive pricing and quick turnaround.',
    keywords: 'printing services ajman, business cards printing ajman, luxury business cards ajman, premium business cards ajman, foil business cards ajman, velvet business cards ajman, gold foil business cards ajman, spot UV business cards ajman, embossed business cards ajman, debossed business cards ajman, soft touch business cards ajman, matte business cards ajman, glossy business cards ajman, custom business cards ajman, corporate business cards ajman, executive business cards ajman, printing company ajman, digital printing ajman, cheap printing ajman, affordable printing ajman, offset printing ajman, business cards with raised print ajman, business cards with metallic finish ajman, business cards with spot gloss ajman, business cards with embossing ajman, business cards with hot stamping ajman, business cards with letterpress ajman, thermography business cards ajman, laminated business cards ajman, uv coated business cards ajman, silk business cards ajman, uncoated business cards ajman, recycled business cards ajman, eco friendly business cards ajman, sustainable business cards ajman, FSC certified business cards ajman, cotton business cards ajman, kraft business cards ajman, textured business cards ajman, linen business cards ajman, metal business cards ajman, plastic business cards ajman, clear business cards ajman, transparent business cards ajman, folded business cards ajman, square business cards ajman, rounded corner business cards ajman, die cut business cards ajman, custom shaped business cards ajman, painted edge business cards ajman, gilded edge business cards ajman, triplex business cards ajman, duplex business cards ajman',
    areas: ['Ajman City', 'Al Nuaimiya', 'Al Rashidiya', 'Al Bustan', 'Industrial Area', 'Al Jurf'],
  },
  'ras-al-khaimah': {
    name: 'Ras Al Khaimah',
    region: 'Ras Al Khaimah',
    geo: { lat: 25.7942, lng: 55.9764 },
    title: 'Printing Services in Ras Al Khaimah | ONPRINT – Quality Printing',
    description: 'ONPRINT delivers quality printing services to Ras Al Khaimah. Luxury business cards, premium business cards, foil business cards, velvet business cards, gold foil business cards, spot UV business cards, embossed business cards, debossed business cards, soft touch business cards, matte business cards, glossy business cards, custom business cards, corporate business cards, executive business cards, packaging, marketing materials, and corporate gifts with reliable delivery across RAK emirate.',
    keywords: 'printing services ras al khaimah, business cards printing rak, luxury business cards rak, premium business cards rak, foil business cards rak, velvet business cards rak, gold foil business cards rak, spot UV business cards rak, embossed business cards rak, debossed business cards rak, soft touch business cards rak, matte business cards rak, glossy business cards rak, custom business cards rak, corporate business cards rak, executive business cards rak, printing company rak, printing services uae, corporate printing rak, digital printing rak, offset printing rak, business cards with raised print rak, business cards with metallic finish rak, business cards with spot gloss rak, business cards with embossing rak, business cards with hot stamping rak, business cards with letterpress rak, thermography business cards rak, laminated business cards rak, uv coated business cards rak, silk business cards rak, uncoated business cards rak, recycled business cards rak, eco friendly business cards rak, sustainable business cards rak, FSC certified business cards rak, cotton business cards rak, kraft business cards rak, textured business cards rak, linen business cards rak, metal business cards rak, plastic business cards rak, clear business cards rak, transparent business cards rak, folded business cards rak, square business cards rak, rounded corner business cards rak, die cut business cards rak, custom shaped business cards rak, painted edge business cards rak, gilded edge business cards rak, triplex business cards rak, duplex business cards rak',
    areas: ['RAK City', 'Al Hamra', 'Al Nakheel', 'Al Dhait', 'Industrial Area', 'Jazirat Al Hamra'],
  },
}

const SERVICES = [
  {
    icon: FileText,
    title: 'Business Cards Printing',
    desc: 'Luxury business cards with premium finishes including soft-touch, foil stamping, and painted edges.',
  },
  {
    icon: Box,
    title: 'Custom Packaging',
    desc: 'Custom boxes, product packaging, and kraft bags with premium printing and branding.',
  },
  {
    icon: Layers,
    title: 'Marketing Materials',
    desc: 'Brochures, flyers, catalogs, and promotional materials with high-quality offset printing.',
  },
  {
    icon: Printer,
    title: 'Large Format Printing',
    desc: 'Banners, signage, exhibition stands, and large-format displays for events and retail.',
  },
  {
    icon: Building2,
    title: 'Corporate Branding',
    desc: 'Complete corporate identity solutions including stationery, uniforms, and branded merchandise.',
  },
  {
    icon: Star,
    title: 'Premium Finishes',
    desc: 'Specialty finishes like spot UV, embossing, debossing, foil stamping, and die-cutting.',
  },
]

const WHY_CHOOSE_US = [
  'Fast delivery across the emirate',
  'Premium quality printing materials',
  'Competitive pricing with no hidden fees',
  'Expert design and print consultation',
  'Bulk order discounts available',
  'Eco-friendly printing options',
]

export default function LocationLandingPage({ locationKey }) {
  const locationData = LOCATION_DATA[locationKey]

  if (!locationData) {
    return <div>Location not found</div>
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
    url: `https://0nprint.com/printing-services-${locationKey}`,
    telephone: '+971-50-1234567',
    email: '0nprint183@gmail.com',
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
    priceRange: '$$',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '08:30',
        closes: '18:30',
      },
    ],
  }

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
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
                  Premium Printing Services in {locationData.name}
                </h1>
                <p className="text-lg md:text-xl text-slate-600 mb-8">
                  {locationData.description}
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

          {/* Service Areas */}
          <Reveal>
            <section className="py-12 mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 text-center">
                Areas We Serve in {locationData.name}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                {locationData.areas.map((area, index) => (
                  <motion.div
                    key={area}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-lg p-4 shadow-sm border border-slate-200 text-center hover:shadow-md transition-shadow"
                  >
                    <MapPin className="h-5 w-5 text-accent mx-auto mb-2" />
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
                Our Printing Services in {locationData.name}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {SERVICES.map((service, index) => (
                  <motion.div
                    key={service.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-shadow"
                  >
                    <service.icon className="h-10 w-10 text-accent mb-4" />
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">{service.title}</h3>
                    <p className="text-slate-600">{service.desc}</p>
                  </motion.div>
                ))}
              </div>
            </section>
          </Reveal>

          {/* Why Choose Us */}
          <Reveal>
            <section className="py-16 mb-16 bg-gradient-to-r from-accent/5 to-accent/10 rounded-2xl">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center">
                Why Choose ONPRINT in {locationData.name}?
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {WHY_CHOOSE_US.map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="h-6 w-6 text-accent shrink-0 mt-0.5" />
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
                Ready to Get Started?
              </h2>
              <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
                Contact us today for a free quote on your printing project in {locationData.name}. 
                We deliver across the entire emirate with fast turnaround times.
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
                  <Phone className="h-8 w-8 text-accent mx-auto mb-3" />
                  <h3 className="font-semibold text-slate-900 mb-1">Call Us</h3>
                  <p className="text-slate-600">+971 50 123 4567</p>
                </div>
                <div>
                  <Mail className="h-8 w-8 text-accent mx-auto mb-3" />
                  <h3 className="font-semibold text-slate-900 mb-1">Email Us</h3>
                  <p className="text-slate-600">0nprint183@gmail.com</p>
                </div>
                <div>
                  <Clock className="h-8 w-8 text-accent mx-auto mb-3" />
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
