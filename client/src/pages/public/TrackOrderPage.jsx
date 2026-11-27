import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MessageCircle, PackageCheck } from 'lucide-react'
import Container from '../../components/Container'
import Button from '../../components/Button'
import SEOHead from '../../components/SEOHead'
import Breadcrumbs from '../../components/Breadcrumbs'
import WhatsAppIcon from '../../components/WhatsAppIcon'
import { getWhatsAppUrl, openWhatsAppDirectly } from '../../utils/whatsapp'

export default function TrackOrderPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [reference, setReference] = useState(searchParams.get('order') || searchParams.get('ref') || '')
  const [messageReady, setMessageReady] = useState(false)

  const whatsappUrl = getWhatsAppUrl({
    title: 'ORDER STATUS REQUEST',
    specifications: reference.trim()
      ? `Order or quote reference: ${reference.trim()}`
      : 'Please help me check the status of my order.',
    pageUrl: 'https://www.0nprint.com/track-order',
  })

  function handleSubmit(event) {
    event.preventDefault()
    if (!reference.trim()) return

    setSearchParams({ order: reference.trim() }, { replace: true })
    openWhatsAppDirectly(whatsappUrl, { allowSameTabFallback: true })
    setMessageReady(true)
  }

  return (
    <div className="min-h-[65vh] bg-[#F5F0E7] py-12 text-[#352719] sm:py-16">
      <SEOHead
        title="Order Status Help | ONPRINT Dubai"
        description="Ask the ONPRINT team for an order update using WhatsApp. Online order tracking is not available on this frontend-only site."
        canonicalPath="/track-order"
        noindex
      />

      <Container className="max-w-3xl">
        <Breadcrumbs items={[{ name: 'Order Status Help' }]} />

        <section className="mt-6 rounded-3xl border border-[#DED2C1] bg-[#FAF8F3] p-6 shadow-sm sm:p-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#795C43]/10 text-[#795C43]">
            <PackageCheck className="h-7 w-7" />
          </div>
          <h1 className="font-display mt-5 text-center text-3xl font-extrabold tracking-tight sm:text-4xl">
            Need an Order Update?
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-relaxed text-[#756657]">
            Enter your order or quote reference to prepare a WhatsApp message for our team. This site does not store orders or provide live tracking.
          </p>

          <form onSubmit={handleSubmit} className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
            <label className="sr-only" htmlFor="order-reference">Order or quote reference</label>
            <input
              id="order-reference"
              type="text"
              value={reference}
              onChange={(event) => {
                setReference(event.target.value)
                setMessageReady(false)
              }}
              placeholder="Order or quote reference"
              autoComplete="off"
              required
              className="min-w-0 flex-1 rounded-xl border border-[#DED2C1] bg-white px-4 py-3 text-sm text-[#352719] placeholder:text-[#756657] focus:border-[#795C43] focus:outline-none focus:ring-2 focus:ring-[#795C43]/20"
            />
            <Button type="submit" variant="accent" icon={false} className="justify-center gap-2">
              <WhatsAppIcon className="h-4 w-4 fill-current" />
              Ask on WhatsApp
            </Button>
          </form>

          {messageReady && (
            <p role="status" className="mt-5 flex items-center justify-center gap-2 text-center text-sm font-semibold text-[#795C43]">
              <MessageCircle className="h-4 w-4" />
              WhatsApp is ready. Review the reference and tap Send to reach our team.
            </p>
          )}

          <p className="mt-6 text-center text-xs text-[#756657]">
            You can also contact us at{' '}
            <a className="font-semibold text-[#795C43] underline" href="mailto:0nprint183@gmail.com">
              0nprint183@gmail.com
            </a>
            .
          </p>
        </section>
      </Container>
    </div>
  )
}
