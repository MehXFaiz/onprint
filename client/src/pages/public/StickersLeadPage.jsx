import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, Clock, CheckCircle, Sparkles, Award, Shield, Zap } from 'lucide-react'
import SEOHead from '../SEOHead'

const StickersLeadPage = () => {
  // Add Service and ContactPoint schema markup for lead generation
  useEffect(() => {
    const serviceSchema = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Custom Sticker Printing Quote Service',
      description: 'Get free quotes for custom stickers in Dubai. Die-cut, vinyl, holographic, and clear stickers with express delivery.',
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
      serviceType: 'Sticker Printing',
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Sticker Printing Services',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Die-Cut Stickers',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Vinyl Stickers',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Holographic Stickers',
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
    stickerType: '',
    message: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Lead submitted:', formData)
    alert('Thank you! We will contact you within 24 hours.')
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const stickerTypes = [
    'Die-Cut Stickers',
    'Kiss-Cut Stickers',
    'Vinyl Stickers',
    'Clear Transparent Stickers',
    'Holographic Stickers',
    'Foil Stickers',
    'Bumper Stickers',
    'Window Decals',
    'Product Labels',
    'Not Sure / Need Advice'
  ]

  const quantities = [
    '50 - 100 stickers',
    '100 - 250 stickers',
    '250 - 500 stickers',
    '500 - 1,000 stickers',
    '1,000 - 2,500 stickers',
    '2,500 - 5,000 stickers',
    '5,000+ stickers'
  ]

  const benefits = [
    { icon: Sparkles, title: 'Custom Shapes', desc: 'Any shape, any size with precision die-cut technology' },
    { icon: Award, title: 'Premium Materials', desc: 'Waterproof vinyl, holographic, and specialty finishes' },
    { icon: Shield, title: 'Volume Discounts', desc: 'Save up to 40% on bulk sticker orders' },
    { icon: Zap, title: 'Fast Production', desc: 'Express same-day delivery in Dubai available' }
  ]

  const useCases = [
    'Product branding and packaging',
    'Event giveaways and promotions',
    'Vehicle decals and window stickers',
    'Laptop and device customization',
    'Retail displays and signage',
    'Wedding and party favors'
  ]

  const testimonials = [
    { name: 'Fatima Ali', company: 'Artisan Bakery Dubai', text: 'Our custom stickers look amazing! The colors are vibrant and they stick perfectly on our packaging.' },
    { name: 'James Wilson', company: 'Events UAE', text: 'Ordered 10,000 stickers for our event. Delivered on time with excellent quality. Will order again.' },
    { name: 'Aisha Khan', company: 'Startup Dubai', text: 'The holographic stickers are stunning. Perfect for our product launch. Great value for money.' }
  ]

  return (
    <>
      <SEOHead
        title="Get Free Quote for Custom Stickers Dubai | Sticker Printing | ONPRINT"
        description="Request a free quote for custom stickers in Dubai. Die-cut, vinyl, holographic, and clear stickers with express delivery. Best prices on bulk sticker printing."
        keywords="stickers quote dubai, custom stickers price dubai, sticker printing cost uae, die cut stickers quote, vinyl stickers dubai, free quote stickers uae, bulk sticker printing, custom sticker quotation"
        h1="Get Your Free Stickers Quote"
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 px-4">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10"></div>
          <div className="max-w-6xl mx-auto relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Get Your Free <span className="text-purple-400">Stickers Quote</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Custom die-cut, vinyl, and holographic stickers in Dubai. Perfect for branding, events, and promotions.
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
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
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
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
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
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
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
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                        placeholder="Your company"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Sticker Type *</label>
                    <select
                      name="stickerType"
                      required
                      value={formData.stickerType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="">Select sticker type</option>
                      {stickerTypes.map((type) => (
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
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
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
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                      placeholder="Tell us about your design, size, finish, or any questions..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105"
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
                        <div className="flex-shrink-0 w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                          <benefit.icon className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-1">{benefit.title}</h3>
                          <p className="text-gray-400">{benefit.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Use Cases */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
                  <h2 className="text-2xl font-bold text-white mb-6">Perfect For</h2>
                  <div className="grid gap-3">
                    {useCases.map((useCase, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0" />
                        <span className="text-gray-300">{useCase}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Testimonials */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
                  <h2 className="text-2xl font-bold text-white mb-6">What Our Clients Say</h2>
                  <div className="space-y-6">
                    {testimonials.map((testimonial, index) => (
                      <div key={index} className="border-l-4 border-purple-500 pl-4">
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
                      <Phone className="w-6 h-6 text-purple-400" />
                      <div>
                        <p className="text-gray-400 text-sm">Phone / WhatsApp</p>
                        <p className="text-white font-semibold">+971 4 800 PRINT</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Mail className="w-6 h-6 text-purple-400" />
                      <div>
                        <p className="text-gray-400 text-sm">Email</p>
                        <p className="text-white font-semibold">0nprint183@gmail.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Clock className="w-6 h-6 text-purple-400" />
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
        <section className="py-16 px-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Limited Time Offer</h2>
            <p className="text-xl text-gray-300 mb-6">
              Get 20% OFF your first sticker order when you request a quote today!
            </p>
            <p className="text-gray-400 mb-8">
              Offer expires at midnight. Custom stickers at unbeatable prices.
            </p>
            <button
              onClick={() => document.querySelector('form').scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105"
            >
              Claim Your 20% Discount Now
            </button>
          </div>
        </section>
      </div>
    </>
  )
}

export default StickersLeadPage
