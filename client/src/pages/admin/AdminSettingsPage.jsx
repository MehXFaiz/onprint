import { useState } from 'react'
import { Settings, Save, CheckCircle2, Building, Mail, Phone, MapPin, Globe, Shield } from 'lucide-react'
import Button from '../../components/Button'
import ImageUploader from '../../components/ImageUploader'

export default function AdminSettingsPage() {
  const [toast, setToast] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    studioName: 'ONPRINT Printing & Packaging Studio',
    tagline: 'Business Printing & Executive Stationery Dubai',
    supportEmail: 'support@onprint.ae',
    salesEmail: 'sales@onprint.ae',
    phone: '+971 4 800 PRINT',
    whatsapp: '+971 50 123 4567',
    address: 'Warehouse 14, Al Quoz Industrial Area 3, Dubai, United Arab Emirates',
    currency: 'AED',
    minOrderAmount: '100',
    vatRate: '5',
    enableOnlineQuote: true,
    maintenanceMode: false,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setToast('Website & Studio Settings saved successfully.')
      setTimeout(() => setToast(null), 4000)
    }, 400)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl bg-neutral-900 border border-neutral-700 px-4 py-3 text-xs font-bold text-white shadow-2xl">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#A82F19]">
            <Settings className="h-4 w-4" />
            <span>Platform Configuration</span>
          </div>
          <h1 className="font-display mt-1 text-2xl font-black text-neutral-900">
            Website & Studio Settings
          </h1>
          <p className="mt-0.5 text-xs text-neutral-500">
            Configure studio brand details, customer service contact info, tax parameters, and store operation settings.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Studio Identity */}
        <div className="rounded-3xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-5">
          <div className="border-b border-neutral-100 pb-4">
            <h3 className="font-display text-base font-bold text-neutral-900 flex items-center gap-2">
              <Building className="h-4 w-4 text-[#A82F19]" />
              Studio Branding & Identity
            </h3>
            <p className="text-xs text-neutral-500">Business identity shown in footers, invoices, and customer communications.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Studio / Business Name *
              </label>
              <input
                type="text"
                required
                value={form.studioName}
                onChange={(e) => setForm({ ...form, studioName: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-xs text-neutral-900 focus:border-[#A82F19] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Brand Tagline
              </label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-xs text-neutral-900 focus:border-[#A82F19] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <ImageUploader
              label="Official Studio Logo"
              value={form.logoImage || '/assets/logo.png'}
              onChange={(url) => setForm((prev) => ({ ...prev, logoImage: url }))}
              altText="ONPRINT Studio Logo"
              description="Upload primary brand logo (PNG, WEBP, SVG up to 5MB)"
            />

            <ImageUploader
              label="Homepage Hero Banner Image"
              value={form.heroBannerImage || '/assets/products/1 (1).jpg'}
              onChange={(url) => setForm((prev) => ({ ...prev, heroBannerImage: url }))}
              altText="ONPRINT Dubai Banner"
              description="Upload main storefront hero banner (JPG, WEBP up to 5MB)"
            />
          </div>
        </div>

        {/* Section 2: Contact Information */}
        <div className="rounded-3xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-5">
          <div className="border-b border-neutral-100 pb-4">
            <h3 className="font-display text-base font-bold text-neutral-900 flex items-center gap-2">
              <Mail className="h-4 w-4 text-[#A82F19]" />
              Customer Contact & Dispatch Info
            </h3>
            <p className="text-xs text-neutral-500">Email addresses and phone numbers displayed on the website contact page.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Support Email Address
              </label>
              <input
                type="email"
                value={form.supportEmail}
                onChange={(e) => setForm({ ...form, supportEmail: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-xs text-neutral-900 focus:border-[#A82F19] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Sales & Quotes Email
              </label>
              <input
                type="email"
                value={form.salesEmail}
                onChange={(e) => setForm({ ...form, salesEmail: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-xs text-neutral-900 focus:border-[#A82F19] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Landline Phone
              </label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-xs text-neutral-900 focus:border-[#A82F19] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                WhatsApp Hotline
              </label>
              <input
                type="text"
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-xs text-neutral-900 focus:border-[#A82F19] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              Dubai Studio Physical Address
            </label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-xs text-neutral-900 focus:border-[#A82F19] focus:outline-none"
            />
          </div>
        </div>

        {/* Section 3: Commercial Parameters */}
        <div className="rounded-3xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-5">
          <div className="border-b border-neutral-100 pb-4">
            <h3 className="font-display text-base font-bold text-neutral-900 flex items-center gap-2">
              <Globe className="h-4 w-4 text-[#A82F19]" />
              Commercial & Tax Parameters
            </h3>
            <p className="text-xs text-neutral-500">VAT calculations, default currency, and quote submission controls.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Default Currency
              </label>
              <input
                type="text"
                readOnly
                value={form.currency}
                className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-neutral-100 px-3.5 py-2.5 text-xs font-bold text-neutral-700 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                UAE VAT Rate (%)
              </label>
              <input
                type="number"
                value={form.vatRate}
                onChange={(e) => setForm({ ...form, vatRate: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-xs text-neutral-900 focus:border-[#A82F19] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Minimum Order Amount (AED)
              </label>
              <input
                type="number"
                value={form.minOrderAmount}
                onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-xs text-neutral-900 focus:border-[#A82F19] focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="relative flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.enableOnlineQuote}
                onChange={(e) => setForm({ ...form, enableOnlineQuote: e.target.checked })}
                className="h-4 w-4 rounded border-neutral-300 text-[#A82F19] focus:ring-[#A82F19]"
              />
              <span className="text-xs font-bold text-neutral-900">Allow Online Custom Quote Requests</span>
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 rounded-2xl bg-white p-4 border border-neutral-200/80 shadow-xs">
          <Button
            type="submit"
            variant="accent"
            icon={false}
            disabled={submitting}
            className="!px-6 shadow-md shadow-[#A82F19]/20"
          >
            <Save className="h-4 w-4 mr-1.5" />
            {submitting ? 'Saving Settings...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  )
}
