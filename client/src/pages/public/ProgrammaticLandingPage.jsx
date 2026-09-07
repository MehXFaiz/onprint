import { useState, useEffect } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import {
  MapPin,
  Clock,
  Truck,
  ShieldCheck,
  ChevronDown,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Printer,
  Package,
  FileText,
  CreditCard,
  PhoneCall,
  Info,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Container from '../../components/Container'
import Button from '../../components/Button'
import Breadcrumbs from '../../components/Breadcrumbs'
import SEOHead from '../../components/SEOHead'
import { getProgrammaticPage } from '../../services/seo'

export default function ProgrammaticLandingPage() {
  const { slug } = useParams()
  const location = useLocation()
  const isLocation = location.pathname.startsWith('/printing-services')
  const pageType = isLocation ? 'location' : 'use_case'

  const [pageData, setPageData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [openFaq, setOpenFaq] = useState(0)

  useEffect(() => {
    let isMounted = true
    async function fetchPage() {
      setLoading(true)
      try {
        const res = await getProgrammaticPage(slug, pageType)
        if (res?.success && res.data && isMounted) {
          setPageData(res.data)
        }
      } catch (err) {
        console.warn('Could not fetch programmatic page from API, using fallback:', err.message)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    fetchPage()
    return () => {
      isMounted = false
    }
  }, [slug, pageType])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#A82F19] border-t-transparent" />
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            Loading Specifications...
          </span>
        </div>
      </div>
    )
  }

  if (!pageData) {
    return (
      <Container className="py-20 text-center">
        <h1 className="text-2xl font-bold text-neutral-900">Printing Service Location Not Found</h1>
        <p className="mt-2 text-sm text-neutral-600">
          The requested location or commercial solution could not be found.
        </p>
        <div className="mt-6">
          <Link to="/services">
            <Button variant="accent" size="md">
              View All Services
            </Button>
          </Link>
        </div>
      </Container>
    )
  }

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: isLocation ? 'Printing Services by Location' : 'Commercial Solutions', url: isLocation ? '/services' : '/categories' },
    { name: pageData.name, url: isLocation ? `/printing-services/${pageData.slug}` : `/printing-solutions/${pageData.slug}` },
  ]

  return (
    <div className="bg-background text-neutral-900 pb-20">
      <SEOHead
        title={pageData.title}
        description={pageData.metaDescription}
        canonicalPath={isLocation ? `/printing-services/${pageData.slug}` : `/printing-solutions/${pageData.slug}`}
        breadcrumbs={breadcrumbs}
        faqList={pageData.faqs || []}
      />

      {/* Hero Header */}
      <section className="relative overflow-hidden bg-neutral-950 text-white pt-10 pb-16 sm:pb-20 border-b border-neutral-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(168,47,25,0.15),transparent_50%)]" />
        <Container className="relative z-10">
          <Breadcrumbs items={breadcrumbs} className="text-neutral-400 mb-6" />

          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#A82F19]/20 border border-[#A82F19]/40 px-3.5 py-1 text-xs font-extrabold text-[#FF7A59] mb-4">
              {isLocation ? <MapPin className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
              <span>{isLocation ? `Dubai Coverage: ${pageData.name}` : 'Commercial Industry Solution'}</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              {pageData.h1}
            </h1>

            <p className="mt-4 text-base sm:text-lg text-neutral-300 leading-relaxed max-w-3xl">
              {pageData.subheading}
            </p>

            {/* Quick Action Badges */}
            <div className="mt-8 flex flex-wrap items-center gap-3 text-xs font-bold text-neutral-300">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 border border-neutral-800 px-3 py-1.5">
                <Clock className="h-3.5 w-3.5 text-[#FF7A59]" />
                Same-Day Dispatch
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 border border-neutral-800 px-3 py-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                100% Pantone Precision
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 border border-neutral-800 px-3 py-1.5">
                <Truck className="h-3.5 w-3.5 text-blue-400" />
                Direct Doorstep Delivery
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link to="/get-a-quote">
                <Button variant="accent" size="lg" className="shadow-lg shadow-[#A82F19]/25 font-bold">
                  Request Instant Quote
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <a href="tel:+9714800PRINT">
                <Button variant="outline" size="lg" className="border-neutral-700 text-white hover:bg-neutral-900 font-bold">
                  <PhoneCall className="h-4 w-4 mr-2 text-[#FF7A59]" />
                  +971 4 800 PRINT
                </Button>
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* Logistics & Key Specs Card */}
      {pageData.logistics && (
        <section className="relative -mt-6 z-20">
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-md">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-[#A82F19]/10 p-2.5 text-[#A82F19] shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xs font-extrabold uppercase tracking-wider text-neutral-500">Turnaround Time</h2>
                  <p className="mt-1 text-sm font-bold text-neutral-900">{pageData.logistics.turnaround}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 border-t md:border-t-0 md:border-l border-neutral-100 pt-4 md:pt-0 md:pl-6">
                <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600 shrink-0">
                  <Printer className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xs font-extrabold uppercase tracking-wider text-neutral-500">Production Facility</h2>
                  <p className="mt-1 text-sm font-bold text-neutral-900">{pageData.logistics.dispatchHub}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 border-t md:border-t-0 md:border-l border-neutral-100 pt-4 md:pt-0 md:pl-6">
                <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600 shrink-0">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xs font-extrabold uppercase tracking-wider text-neutral-500">Delivery Policy</h2>
                  <p className="mt-1 text-sm font-bold text-neutral-900">{pageData.logistics.deliveryFee}</p>
                </div>
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* In-Depth Content Sections */}
      <section className="py-14 sm:py-18">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Main Editorial Content */}
            <div className="lg:col-span-8 space-y-8">
              {pageData.contentSections?.map((section, idx) => (
                <div key={idx} className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs">
                  <h2 className="font-display text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
                    {section.title}
                  </h2>
                  <p className="mt-4 text-sm sm:text-base text-neutral-600 leading-relaxed">
                    {section.content}
                  </p>
                </div>
              ))}

              {/* Popular Products or Recommended Packages Grid */}
              {pageData.popularProducts && pageData.popularProducts.length > 0 && (
                <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs">
                  <h2 className="font-display text-xl font-black text-neutral-900 tracking-tight mb-5">
                    Popular Print Products in {pageData.name}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {pageData.popularProducts.map((prod, idx) => (
                      <Link
                        key={idx}
                        to={`/categories/${prod.slug}`}
                        className="group flex flex-col justify-between rounded-xl border border-neutral-200/80 p-4 transition-all hover:border-[#A82F19] hover:shadow-xs bg-neutral-50/50"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <h3 className="font-bold text-sm text-neutral-900 group-hover:text-[#A82F19] transition-colors">
                              {prod.name}
                            </h3>
                            <ArrowRight className="h-3.5 w-3.5 text-neutral-400 group-hover:text-[#A82F19] transition-transform group-hover:translate-x-1" />
                          </div>
                          <p className="mt-1.5 text-xs text-neutral-500 leading-relaxed">
                            {prod.highlight}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Packages for Use Cases */}
              {pageData.recommendedPackages && pageData.recommendedPackages.length > 0 && (
                <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs">
                  <h2 className="font-display text-xl font-black text-neutral-900 tracking-tight mb-5">
                    Recommended Production Packages
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {pageData.recommendedPackages.map((pkg, idx) => (
                      <div key={idx} className="rounded-xl border border-neutral-200 p-5 bg-neutral-50/50 flex flex-col justify-between">
                        <div>
                          <h3 className="font-extrabold text-sm text-neutral-900">{pkg.title}</h3>
                          <ul className="mt-3 space-y-1.5 text-xs text-neutral-600">
                            {pkg.items?.map((item, itemIdx) => (
                              <li key={itemIdx} className="flex items-start gap-2">
                                <CheckCircle2 className="h-3.5 w-3.5 text-[#A82F19] shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="mt-5 pt-3 border-t border-neutral-200/60">
                          <Link to="/get-a-quote">
                            <Button variant="outline" size="sm" className="w-full text-xs font-bold border-neutral-300">
                              Order This Package
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQ Section */}
              {pageData.faqs && pageData.faqs.length > 0 && (
                <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-[#A82F19] uppercase tracking-wider mb-2">
                    <Info className="h-4 w-4" />
                    <span>Frequently Asked Questions</span>
                  </div>
                  <h2 className="font-display text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
                    {isLocation ? `${pageData.name} Printing FAQ` : `${pageData.name} FAQ`}
                  </h2>

                  <div className="mt-6 divide-y divide-neutral-100">
                    {pageData.faqs.map((faq, idx) => {
                      const isOpen = openFaq === idx
                      return (
                        <div key={idx} className="py-4">
                          <button
                            type="button"
                            onClick={() => setOpenFaq(isOpen ? null : idx)}
                            className="flex w-full items-center justify-between text-left text-sm font-bold text-neutral-900 hover:text-[#A82F19] transition-colors"
                          >
                            <span>{faq.question}</span>
                            <ChevronDown
                              className={`h-4 w-4 text-neutral-400 transition-transform ${
                                isOpen ? 'rotate-180 text-[#A82F19]' : ''
                              }`}
                            />
                          </button>
                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <p className="mt-2.5 text-xs sm:text-sm text-neutral-600 leading-relaxed pr-4">
                                  {faq.answer}
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar: Contact & Quick Links */}
            <div className="lg:col-span-4 space-y-6">
              {/* Quick Quote Widget Card */}
              <div className="rounded-2xl border border-neutral-900 bg-neutral-950 p-6 text-white shadow-xl">
                <h3 className="font-display text-lg font-black tracking-tight">
                  Need Fast Commercial Print in Dubai?
                </h3>
                <p className="mt-2 text-xs text-neutral-400 leading-relaxed">
                  Send us your artwork or specifications. Get a tailored quotation within 15 minutes during business hours.
                </p>

                <div className="mt-5 space-y-3">
                  <Link to="/get-a-quote" className="block w-full">
                    <Button variant="accent" size="md" className="w-full font-bold shadow-md shadow-[#A82F19]/25">
                      Request Bespoke Estimate
                    </Button>
                  </Link>

                  <a href="tel:+9714800PRINT" className="block w-full">
                    <Button variant="outline" size="md" className="w-full border-neutral-700 text-white hover:bg-neutral-900 text-xs font-bold">
                      <PhoneCall className="h-3.5 w-3.5 mr-2 text-[#FF7A59]" />
                      Direct Line: +971 4 800 PRINT
                    </Button>
                  </a>
                </div>

                <div className="mt-6 pt-5 border-t border-neutral-800 text-[11px] text-neutral-400 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>Free sample box delivered across Dubai</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>Corporate 30-day billing available</span>
                  </div>
                </div>
              </div>

              {/* Related Categories Navigation */}
              <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs">
                <h3 className="font-display text-sm font-black uppercase tracking-wider text-neutral-900 mb-3">
                  Key Printing Disciplines
                </h3>
                <nav className="space-y-1.5 text-xs font-bold">
                  <Link
                    to="/categories/brochures-printing"
                    className="flex items-center justify-between p-2 rounded-lg text-neutral-700 hover:bg-neutral-50 hover:text-[#A82F19] transition-colors"
                  >
                    <span>Brochures &amp; Catalogs</span>
                    <ArrowRight className="h-3 w-3 text-neutral-400" />
                  </Link>
                  <Link
                    to="/categories/business-cards-printing"
                    className="flex items-center justify-between p-2 rounded-lg text-neutral-700 hover:bg-neutral-50 hover:text-[#A82F19] transition-colors"
                  >
                    <span>Luxury Business Cards</span>
                    <ArrowRight className="h-3 w-3 text-neutral-400" />
                  </Link>
                  <Link
                    to="/categories/flyers-printing-in-dubai"
                    className="flex items-center justify-between p-2 rounded-lg text-neutral-700 hover:bg-neutral-50 hover:text-[#A82F19] transition-colors"
                  >
                    <span>Commercial Flyers &amp; Menus</span>
                    <ArrowRight className="h-3 w-3 text-neutral-400" />
                  </Link>
                  <Link
                    to="/categories/id-card-printing-dubai"
                    className="flex items-center justify-between p-2 rounded-lg text-neutral-700 hover:bg-neutral-50 hover:text-[#A82F19] transition-colors"
                  >
                    <span>Corporate PVC ID Cards</span>
                    <ArrowRight className="h-3 w-3 text-neutral-400" />
                  </Link>
                  <Link
                    to="/categories/letterheads-printing-dubai"
                    className="flex items-center justify-between p-2 rounded-lg text-neutral-700 hover:bg-neutral-50 hover:text-[#A82F19] transition-colors"
                  >
                    <span>Official Letterheads</span>
                    <ArrowRight className="h-3 w-3 text-neutral-400" />
                  </Link>
                </nav>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
