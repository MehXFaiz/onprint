import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SectionHeading from '../../components/SectionHeading'
import ServiceCard from '../../components/ServiceCard'
import ProductCard from '../../components/ProductCard'
import LoadingState from '../../components/LoadingState'
import EmptyState from '../../components/EmptyState'
import { getServices } from '../../services/services'
import { getProducts } from '../../services/products'

const whyUs = [
  { title: 'Premium Quality', description: 'Vivid color, sharp detail and finishes that hold up.' },
  { title: 'Fast Turnaround', description: 'Reliable production timelines, even on tight deadlines.' },
  { title: 'Full Customization', description: 'Sizes, materials and finishes tailored to your project.' },
  { title: 'Trusted Reliability', description: 'Consistent quality, order after order.' },
]

const processSteps = [
  { step: '1', title: 'Request', description: 'Tell us what you need — product, quantity and specs.' },
  { step: '2', title: 'Quote', description: 'We review your request and send back pricing.' },
  { step: '3', title: 'Approve', description: 'Approve the quote and confirm your artwork.' },
  { step: '4', title: 'Print', description: 'Your job goes into production.' },
  { step: '5', title: 'Deliver', description: 'Your finished order ships or is ready for pickup.' },
]

export default function HomePage() {
  const [services, setServices] = useState(null)
  const [products, setProducts] = useState(null)

  useEffect(() => {
    getServices()
      .then((data) => setServices(data.slice(0, 8)))
      .catch(() => setServices([]))

    getProducts({ featured: true })
      .then((res) => setProducts(res.data.slice(0, 4)))
      .catch(() => setProducts([]))
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-50 to-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 py-16 md:grid-cols-2 md:py-24">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-ink-900 sm:text-5xl">
              Your Ideas. <span className="text-brand-600">Our Print.</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-ink-500">
              Professional printing solutions for businesses, brands and individuals — from
              business cards to large-format banners.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/get-a-quote"
                className="rounded-md bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700"
              >
                Get a Quote
              </Link>
              <Link
                to="/services"
                className="rounded-md border border-gray-300 px-6 py-3 text-sm font-semibold text-ink-900 hover:border-brand-600 hover:text-brand-600"
              >
                Explore Services
              </Link>
            </div>
          </div>
          <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100 shadow-xl">
            <img
              src="https://picsum.photos/seed/onprint-hero/1000/750"
              alt="Professional printing in progress"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Why ONPRINT */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {whyUs.map((item) => (
            <div key={item.title} className="rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-ink-900">{item.title}</h3>
              <p className="mt-2 text-sm text-ink-500">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="What We Offer"
            title="Our Services"
            subtitle="From everyday stationery to large-format signage, ONPRINT covers every printing need."
          />
          <div className="mt-10">
            {services === null && <LoadingState label="Loading services…" />}
            {services?.length === 0 && (
              <EmptyState title="Services coming soon" note="Check back shortly, or explore our product catalog." />
            )}
            {services && services.length > 0 && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {services.map((service) => (
                  <ServiceCard key={service._id} service={service} />
                ))}
              </div>
            )}
          </div>
          <div className="mt-10 text-center">
            <Link to="/services" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
              View All Services →
            </Link>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <SectionHeading
          eyebrow="Popular Picks"
          title="Featured Products"
          subtitle="A few of our most requested print products."
        />
        <div className="mt-10">
          {products === null && <LoadingState label="Loading products…" />}
          {products?.length === 0 && (
            <EmptyState title="Products coming soon" note="Our catalog is being stocked — check back shortly." />
          )}
          {products && products.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
        <div className="mt-10 text-center">
          <Link to="/products" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
            View All Products →
          </Link>
        </div>
      </section>

      {/* Process */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading eyebrow="How It Works" title="From Request to Delivery" />
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {processSteps.map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                  {item.step}
                </div>
                <h3 className="mt-3 font-semibold text-ink-900">{item.title}</h3>
                <p className="mt-1 text-sm text-ink-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-600">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 py-16 text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Ready to start your next print project?</h2>
          <p className="max-w-xl text-brand-50">
            Tell us what you need and we’ll get back to you with a detailed quote.
          </p>
          <Link
            to="/get-a-quote"
            className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-brand-600 hover:bg-gray-100"
          >
            Get a Quote
          </Link>
        </div>
      </section>
    </div>
  )
}
