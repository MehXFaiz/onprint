import { useState } from 'react'
import { Settings, Save, CheckCircle2, Building, Mail, Phone, MapPin, Globe, Shield } from 'lucide-react'
import Button from '../../components/Button'
import ImageUploader from '../../components/ImageUploader'

export default function AdminSettingsPage() {
  const [toast, setToast] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    studioName: 'ONPRINT Printing & Branding Studio',
    tagline: 'Business Printing & Executive Stationery Dubai',
    supportEmail: 'support@onprint.ae',
    salesEmail: 'sales@onprint.ae',
    phone: '+44 7344546056',
    whatsapp: '+44 7344546056',
    address: 'Al Quoz, Dubai, United Arab Emirates',
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
        <div className="fixed top-6 right-6 left-4 sm:left-auto max-w-[calc(100vw-2rem)] z-50 flex items-center gap-2.5 rounded-2xl bg-neutral-900 border border-neutral-700 px-4 py-3 text-xs font-bold text-white shadow-2xl">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#14213D] p-6 rounded-3xl border border-[#1E2C4F] shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D6C29A]">
            <Settings className="h-4 w-4" />
            <span>Platform Configuration</span>
          </div>
          <h1 className="font-display mt-1 text-2xl font-black text-[#F5F3EE]">
            Website & Studio Settings
          </h1>
          <p className="mt-0.5 text-xs text-[#B8C2D9]">
            Configure studio brand details, customer service contact info, tax parameters, and store operation settings.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Studio Identity */}
        <div className="rounded-3xl border border-[#1E2C4F] bg-[#14213D] p-6 sm:p-8 shadow-xs space-y-5">
          <div className="border-b border-[#1E2C4F] pb-4">
            <h3 className="font-display text-base font-bold text-[#F5F3EE] flex items-center gap-2">
              <Building className="h-4 w-4 text-[#D6C29A]" />
              Studio Branding & Identity
            </h3>
            <p className="text-xs text-[#B8C2D9]">Business identity shown in footers, invoices, and customer communications.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#F5F3EE]">
                Studio / Business Name *
              </label>
              <input
                type="text"
                required
                value={form.studioName}
                onChange={(e) => setForm({ ...form, studioName: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-[#1E2C4F] bg-[#14213D] px-3.5 py-2.5 text-xs text-[#F5F3EE] focus:border-[#D6C29A] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#F5F3EE]">
                Brand Tagline
              </label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-[#1E2C4F] bg-[#14213D] px-3.5 py-2.5 text-xs text-[#F5F3EE] focus:border-[#D6C29A] focus:outline-none"
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
        <div className="rounded-3xl border border-[#1E2C4F] bg-[#14213D] p-6 sm:p-8 shadow-xs space-y-5">
          <div className="border-b border-[#1E2C4F] pb-4">
            <h3 className="font-display text-base font-bold text-[#F5F3EE] flex items-center gap-2">
              <Mail className="h-4 w-4 text-[#D6C29A]" />
              Customer Contact & Dispatch Info
            </h3>
            <p className="text-xs text-[#B8C2D9]">Email addresses and phone numbers displayed on the website contact page.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#F5F3EE]">
                Support Email Address
              </label>
              <input
                type="email"
                value={form.supportEmail}
                onChange={(e) => setForm({ ...form, supportEmail: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-[#1E2C4F] bg-[#14213D] px-3.5 py-2.5 text-xs text-[#F5F3EE] focus:border-[#D6C29A] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#F5F3EE]">
                Sales & Quotes Email
              </label>
              <input
                type="email"
                value={form.salesEmail}
                onChange={(e) => setForm({ ...form, salesEmail: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-[#1E2C4F] bg-[#14213D] px-3.5 py-2.5 text-xs text-[#F5F3EE] focus:border-[#D6C29A] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#F5F3EE]">
                Landline Phone
              </label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-[#1E2C4F] bg-[#14213D] px-3.5 py-2.5 text-xs text-[#F5F3EE] focus:border-[#D6C29A] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#F5F3EE]">
                WhatsApp Hotline
              </label>
              <input
                type="text"
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-[#1E2C4F] bg-[#14213D] px-3.5 py-2.5 text-xs text-[#F5F3EE] focus:border-[#D6C29A] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#F5F3EE]">
              Dubai Studio Physical Address
            </label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="mt-1.5 w-full rounded-xl border border-[#1E2C4F] bg-[#14213D] px-3.5 py-2.5 text-xs text-[#F5F3EE] focus:border-[#D6C29A] focus:outline-none"
            />
          </div>
        </div>

        {/* Section 3: Commercial Parameters */}
        <div className="rounded-3xl border border-[#1E2C4F] bg-[#14213D] p-6 sm:p-8 shadow-xs space-y-5">
          <div className="border-b border-[#1E2C4F] pb-4">
            <h3 className="font-display text-base font-bold text-[#F5F3EE] flex items-center gap-2">
              <Globe className="h-4 w-4 text-[#D6C29A]" />
              Commercial & Tax Parameters
            </h3>
            <p className="text-xs text-[#B8C2D9]">VAT calculations, default currency, and quote submission controls.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#F5F3EE]">
                Default Currency
              </label>
              <input
                type="text"
                readOnly
                value={form.currency}
                className="mt-1.5 w-full rounded-xl border border-[#1E2C4F] bg-neutral-100 px-3.5 py-2.5 text-xs font-bold text-[#F5F3EE] cursor-not-allowed"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#F5F3EE]">
                UAE VAT Rate (%)
              </label>
              <input
                type="number"
                value={form.vatRate}
                onChange={(e) => setForm({ ...form, vatRate: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-[#1E2C4F] bg-[#14213D] px-3.5 py-2.5 text-xs text-[#F5F3EE] focus:border-[#D6C29A] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#F5F3EE]">
                Minimum Order Amount (AED)
              </label>
              <input
                type="number"
                value={form.minOrderAmount}
                onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-[#1E2C4F] bg-[#14213D] px-3.5 py-2.5 text-xs text-[#F5F3EE] focus:border-[#D6C29A] focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="relative flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.enableOnlineQuote}
                onChange={(e) => setForm({ ...form, enableOnlineQuote: e.target.checked })}
                className="h-4 w-4 rounded border-[#1E2C4F] text-[#D6C29A] focus:ring-[#D6C29A]"
              />
              <span className="text-xs font-bold text-[#F5F3EE]">Allow Online Custom Quote Requests</span>
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 rounded-2xl bg-[#14213D] p-4 border border-[#1E2C4F] shadow-xs">
          <Button
            type="submit"
            variant="accent"
            icon={false}
            disabled={submitting}
            className="!px-6 shadow-md shadow-[#D6C29A]/20"
          >
            <Save className="h-4 w-4 mr-1.5" />
            {submitting ? 'Saving Settings...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  )
}
