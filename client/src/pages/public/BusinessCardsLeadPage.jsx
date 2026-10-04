import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, Clock, CheckCircle, Sparkles, Award, Shield, Zap } from 'lucide-react'
import SEOHead from '../SEOHead'

const BusinessCardsLeadPage = () => {
  // Add Service and ContactPoint schema markup for lead generation
  useEffect(() => {
    const serviceSchema = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Business Card Printing Quote Service',
      description: 'Get free quotes for premium business cards in Dubai. Luxury gold foil, soft touch, spot UV, and embossed cards with express delivery.',
      provider: {
        '@type': 'LocalBusiness',
        name: 'ONPRINT',
        '@id': 'https://0nprint.com/#organization',
        telephone: '+971 4 800 PRINT',
        email: '0nprint183@gmail.com',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Al Quoz',
          addressLocality: 'Dubai',
          addressRegion: 'Dubai',
          addressCountry: 'AE',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 25.1328,
          longitude: 55.2348,
        },
        openingHoursSpecification: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          opens: '08:30',
          closes: '18:30',
        },
      },
      areaServed: [
        { '@type': 'City', name: 'Dubai' },
        { '@type': 'City', name: 'Abu Dhabi' },
        { '@type': 'City', name: 'Sharjah' },
        { '@type': 'Country', name: 'United Arab Emirates' },
      ],
      serviceType: 'Business Card Printing',
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Business Card Printing Services',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Luxury Gold Foil Business Cards',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Soft Touch Velvet Business Cards',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Spot UV Business Cards',
            },
          },
        ],
      },
    }

    const contactPointSchema = {
      '@context': 'https://schema.org',
      '@type': 'ContactPoint',
      telephone: '+971 4 800 PRINT',
      contactType: 'sales',
      areaServed: 'AE',
      availableLanguage: ['English', 'Arabic', 'Urdu'],
      email: '0nprint183@gmail.com',
    }

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = JSON.stringify([serviceSchema, contactPointSchema])
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    quantity: '',
    cardType: '',
    message: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    console.log('Lead submitted:', formData)
    alert('Thank you! We will contact you within 24 hours.')
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const cardTypes = [
    'Luxury Gold Foil Cards',
    'Soft Touch Velvet Cards',
    'Spot UV Gloss Cards',
    'Embossed/Debossed Cards',
    'Metal Business Cards',
    'Standard PVC Cards',
    'Painted Edge Cards',
    'Not Sure / Need Advice'
  ]

  const quantities = [
    '100 - 250 cards',
    '250 - 500 cards',
    '500 - 1,000 cards',
    '1,000 - 2,500 cards',
    '2,500 - 5,000 cards',
    '5,000+ cards'
  ]

  const benefits = [
    { icon: Sparkles, title: 'Premium Quality', desc: '350gsm-600gsm luxury stocks with superior print resolution' },
    { icon: Award, title: 'Fast Turnaround', desc: 'Express same-day delivery available in Dubai' },
    { icon: Shield, title: 'Price Match Guarantee', desc: 'Best prices on luxury business cards in UAE' },
    { icon: Zap, title: 'Free Design Review', desc: 'Expert designers review your artwork at no cost' }
  ]

  const testimonials = [
    { name: 'Ahmed Al Falasi', company: 'Dubai Properties', text: 'Best business cards we\'ve ever ordered. The gold foil quality is unmatched!' },
    { name: 'Sarah Johnson', company: 'Design Studio Dubai', text: 'Fast, professional, and the soft touch finish is incredible. Highly recommend.' },
    { name: 'Mohammed Hassan', company: 'Tech Solutions UAE', text: 'Ordered 5,000 cards with spot UV. Delivered in 48 hours. Amazing service.' }
  ]

  return (
    <>
      <SEOHead
        title="Get Free Quote for Business Cards Dubai | Luxury Business Card Printing | ONPRINT"
        description="Request a free quote for premium business cards in Dubai. Luxury gold foil, soft touch, spot UV, and embossed cards with express delivery. Best prices guaranteed."
        keywords="business cards quote dubai, business card printing price dubai, luxury business cards cost, free quote business cards uae, custom business cards price, foil business cards quote, same day business cards dubai, business card printing quotation"
        h1="Get Your Free Business Cards Quote"
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 px-4">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-orange-500/10"></div>
          <div className="max-w-6xl mx-auto relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Get Your Free <span className="text-yellow-400">Business Cards Quote</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Premium luxury business cards in Dubai. Best prices, fastest turnaround, and unmatched quality.
                Get your personalized quote within 2 hours.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span>Free Quote</span>
                </div>
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span>Response in 2 Hours</span>
                </div>
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span>No Obligation</span>
                </div>
              </div>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Lead Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Request Your Free Quote</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-2">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                        placeholder="+971 XX XXX XXXX"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-2">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Company Name</label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                        placeholder="Your company"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Card Type *</label>
                    <select
                      name="cardType"
                      required
                      value={formData.cardType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                    >
                      <option value="">Select card type</option>
                      {cardTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Quantity *</label>
                    <select
                      name="quantity"
                      required
                      value={formData.quantity}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                    >
                      <option value="">Select quantity</option>
                      {quantities.map((qty) => (
                        <option key={qty} value={qty}>{qty}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Additional Requirements</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                      placeholder="Tell us about your design, special finishes, or any questions..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all transform hover:scale-105"
                  >
                    Get My Free Quote Now
                  </button>

                  <p className="text-center text-gray-400 text-sm">
                    We respect your privacy. Your information will never be shared.
                  </p>
                </form>
              </motion.div>

              {/* Benefits Section */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="space-y-8"
              >
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
                  <h2 className="text-2xl font-bold text-white mb-6">Why Choose ONPRINT?</h2>
                  <div className="grid gap-6">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                          <benefit.icon className="w-6 h-6 text-yellow-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-1">{benefit.title}</h3>
                          <p className="text-gray-400">{benefit.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Testimonials */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
                  <h2 className="text-2xl font-bold text-white mb-6">What Our Clients Say</h2>
                  <div className="space-y-6">
                    {testimonials.map((testimonial, index) => (
                      <div key={index} className="border-l-4 border-yellow-500 pl-4">
                        <p className="text-gray-300 italic mb-2">"{testimonial.text}"</p>
                        <p className="text-white font-semibold">{testimonial.name}</p>
                        <p className="text-gray-400 text-sm">{testimonial.company}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
                  <h2 className="text-2xl font-bold text-white mb-6">Contact Us Directly</h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Phone className="w-6 h-6 text-yellow-400" />
                      <div>
                        <p className="text-gray-400 text-sm">Phone / WhatsApp</p>
                        <p className="text-white font-semibold">+971 4 800 PRINT</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Mail className="w-6 h-6 text-yellow-400" />
                      <div>
                        <p className="text-gray-400 text-sm">Email</p>
                        <p className="text-white font-semibold">0nprint183@gmail.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Clock className="w-6 h-6 text-yellow-400" />
                      <div>
                        <p className="text-gray-400 text-sm">Working Hours</p>
                        <p className="text-white font-semibold">Mon-Sat: 8:30 AM - 6:30 PM</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Urgency Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Limited Time Offer</h2>
            <p className="text-xl text-gray-300 mb-6">
              Get 15% OFF your first order when you request a quote today!
            </p>
            <p className="text-gray-400 mb-8">
              Offer expires at midnight. Don't miss out on premium business cards at unbeatable prices.
            </p>
            <button
              onClick={() => document.querySelector('form').scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all transform hover:scale-105"
            >
              Claim Your 15% Discount Now
            </button>
          </div>
        </section>
      </div>
    </>
  )
}

export default BusinessCardsLeadPage
