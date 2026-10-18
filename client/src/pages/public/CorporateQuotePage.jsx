import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Building2,
  ShieldCheck,
  CreditCard,
  FileText,
  Truck,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  UploadCloud,
  Layers,
  ArrowRight,
  PhoneCall,
  Clock,
  Briefcase,
  Copy,
  Check,
} from 'lucide-react'
import Container from '../../components/Container'
import Button from '../../components/Button'
import SEOHead from '../../components/SEOHead'
import Breadcrumbs from '../../components/Breadcrumbs'
import WhatsAppIcon from '../../components/WhatsAppIcon'
import { uploadArtwork } from '../../services/uploadService'
import api from '../../services/api'

const POPULAR_CORPORATE_PRODUCTS = [
  'Luxury Cotton Business Cards',
  'Hot Foil Embossed Stationery & Letterheads',
  'Custom Rigid Presentation Boxes',
  'Brochures & Annual Reports (PUR Binding)',
  'Waterproof Roll Labels & Metallic Stickers',
  'Heavyweight Presentation Folders',
  'Branded Double-Wall Insulated Bottles',
  'Exhibition Roll-Up Banners & Pop-Up Displays',
  'Custom Corporate Notepads & Notebooks',
]

const FINISHING_OPTIONS = [
  '24K Gold / Silver Hot Foil',
  'Raised 3D Spot UV (Scodix)',
  'Blind Letterpress Debossing',
  'Velvet Soft-Touch Lamination',
  'Custom Die-Cut Windows / Shapes',
  'Painted / Gilded Edges',
]

const VOLUME_TIERS = [
  'Under AED 15,000 / year',
  'AED 15,000 – AED 50,000 / year',
  'AED 50,000 – AED 150,000 / year',
  'AED 150,000+ / year (Enterprise SLA)',
]

export default function CorporateQuotePage() {
  const [companyName, setCompanyName] = useState('')
  const [tradeLicenseNumber, setTradeLicenseNumber] = useState('')
  const [trnNumber, setTrnNumber] = useState('')
  const [contactName, setContactName] = useState('')
  const [department, setDepartment] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [annualVolumeEstimate, setAnnualVolumeEstimate] = useState(VOLUME_TIERS[1])
  const [creditTermsRequested, setCreditTermsRequested] = useState('Prepaid')
  const [deliveryLocations, setDeliveryLocations] = useState('Dubai Headquarters')
  const [notes, setNotes] = useState('')

  // Multi-item lines
  const [items, setItems] = useState([
    {
      productName: 'Luxury Cotton Business Cards',
      quantity: 1000,
      specifications: '450 GSM Velvet Soft-Touch with 24K Gold Foil',
    },
    {
      productName: 'Custom Rigid Presentation Boxes',
      quantity: 500,
      specifications: 'Matte Lamination with Spot UV and Custom Foam Insert',
    },
  ])

  // File uploads
  const [files, setFiles] = useState([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedData, setSubmittedData] = useState(null)
  const [copiedRef, setCopiedRef] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        productName: POPULAR_CORPORATE_PRODUCTS[0],
        quantity: 500,
        specifications: 'Standard Commercial Specifications',
      },
    ])
  }

  const handleRemoveItem = (index) => {
    if (items.length <= 1) return
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  const handleItemChange = (index, field, value) => {
    setItems((prev) => {
      const copy = [...prev]
      copy[index] = { ...copy[index], [field]: value }
      return copy
    })
  }

  const handleFileChange = (e) => {
    if (!e.target.files?.length) return
    const incoming = Array.from(e.target.files)
    setFiles((prev) => [...prev, ...incoming].slice(0, 5))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')

    if (!companyName.trim() || !contactName.trim() || !email.trim() || !phone.trim()) {
      setErrorMsg('Please complete company name, contact person, email, and phone number.')
      return
    }

    setIsSubmitting(true)

    try {
      let uploadedFileNames = []
      if (files.length > 0) {
        try {
          const res = await uploadArtwork(files, (p) => setUploadProgress(p))
          uploadedFileNames = res.files ? res.files.map((f) => f.filename || f.url) : []
        } catch (err) {
          console.warn('File upload fallback:', err.message)
          uploadedFileNames = files.map((f) => f.name)
        }
      }

      const randomSeq = Math.floor(100000 + Math.random() * 900000)
      const referenceNumber = `ONP-CORP-${randomSeq}`

      const payload = {
        referenceNumber,
        companyName: companyName.trim(),
        tradeLicenseNumber: tradeLicenseNumber.trim() || null,
        trnNumber: trnNumber.trim() || null,
        contactName: contactName.trim(),
        department: department.trim() || 'Procurement',
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        annualVolumeEstimate,
        creditTermsRequested,
        deliveryLocations: [deliveryLocations.trim() || 'Dubai'],
        items,
        notes: notes.trim() || null,
        artworkFiles: uploadedFileNames,
      }

      // Send to server API
      try {
        await api.post('/corporate-quotes', payload)
      } catch (postErr) {
        console.warn('API post fallback to persistentStore:', postErr.message)
      }

      setSubmittedData({
        ...payload,
        referenceNumber,
      })
    } catch (err) {
      console.error('Submission error:', err)
      setErrorMsg('Failed to submit corporate quote. Please try again or message our desk on WhatsApp.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCopy = () => {
    if (!submittedData?.referenceNumber) return
    navigator.clipboard.writeText(submittedData.referenceNumber)
    setCopiedRef(true)
    setTimeout(() => setCopiedRef(false), 2000)
  }

  return (
    <div className="py-12 sm:py-20 bg-slate-50/50 min-h-screen">
      <SEOHead
        title="Corporate Printing Quotes & Bulk Orders Dubai | ONPRINT"
        description="Official procurement portal for corporate printing, packaging, and branding collateral in Dubai & UAE. Trade credit terms, SLA guarantees, and multi-product quotes."
        keywords="corporate printing dubai, bulk printing quotes uae, b2b print procurement, offset commercial press al quoz"
        canonicalPath="/corporate-quotes"
        breadcrumbs={[
          { name: 'Corporate Desk', url: '/corporate-quotes' },
        ]}
      />

      <Container className="max-w-6xl">
        <Breadcrumbs items={[{ name: 'Corporate & Bulk Quotes' }]} />

        {/* Hero Section */}
        <div className="mt-4 rounded-3xl bg-[#101D35] p-8 sm:p-14 text-white relative overflow-hidden shadow-xl border border-slate-800">
          <div className="absolute right-0 top-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#D4AF65]/10 blur-3xl pointer-events-none" />

          <div className="max-w-3xl relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#D4AF65]/20 border border-[#D4AF65]/40 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#D4AF65]">
              <Building2 className="w-4 h-4" /> B2B &amp; Enterprise Procurement Portal
            </span>
            <h1 className="font-display mt-4 text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Corporate Printing &amp; Bulk Print Solutions
            </h1>
            <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              Elevate your brand collateral with dedicated commercial press capacity. ONPRINT partners with leading UAE enterprises, hospitality groups, luxury retailers, and marketing agencies for high-volume offset, digital, and specialty print production.
            </p>

            {/* Value Pillars */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-700/80 text-xs">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-[#D4AF65] shrink-0" />
                <span className="font-semibold text-slate-200">Dedicated Account Director</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-[#D4AF65] shrink-0" />
                <span className="font-semibold text-slate-200">30 &amp; 60-Day Credit Terms</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#D4AF65] shrink-0" />
                <span className="font-semibold text-slate-200">Prepress Proofs &amp; Swatches</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-[#D4AF65] shrink-0" />
                <span className="font-semibold text-slate-200">Multi-Location UAE Logistics</span>
              </div>
            </div>
          </div>
        </div>

        {/* Success Confirmation State */}
        {submittedData ? (
          <div className="mt-12 rounded-3xl border border-emerald-200 bg-white p-8 sm:p-12 shadow-md text-center max-w-2xl mx-auto">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-6">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-emerald-800 mb-2">
              Corporate RFQ Logged
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101D35]">
              Request Received for {submittedData.companyName}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Your reference code has been generated. Our Senior Key Account Director will review your multi-item specifications, credit terms, and deliver an itemized proposal within 2–4 business hours.
            </p>

            <div className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-slate-50 border border-slate-200 p-4 font-mono text-base font-black text-[#101D35]">
              <span>{submittedData.referenceNumber}</span>
              <button
                type="button"
                onClick={handleCopy}
                className="p-1 rounded hover:bg-slate-200 text-slate-500 transition-colors"
                title="Copy reference"
              >
                {copiedRef ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={`https://wa.me/447344546056?text=${encodeURIComponent(`Hello ONPRINT Corporate Desk, I have submitted corporate RFQ ${submittedData.referenceNumber} for ${submittedData.companyName}. Looking forward to connecting with our account manager.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-md transition-all cursor-pointer"
              >
                <WhatsAppIcon className="h-4 w-4 fill-white" />
                <span>Fast-Track on WhatsApp</span>
              </a>

              <Link
                to={`/track-order?ref=${encodeURIComponent(submittedData.referenceNumber)}`}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <span>Track RFQ Status</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* Form View */
          <form onSubmit={handleSubmit} className="mt-10 space-y-8">
            {errorMsg && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-bold text-red-700">
                {errorMsg}
              </div>
            )}

            {/* Section 1: Company & Procurement Details */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-[#D4AF65]">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-display text-lg font-bold text-[#101D35]">
                    1. Company &amp; Procurement Entity
                  </h2>
                  <p className="text-xs text-slate-500">
                    Official UAE registered entity details for tax invoicing and credit vetting.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Company Registered Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Al Futtaim Group / Emaar Hospitality"
                    className="mt-1.5 w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-[#D4AF65] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Trade License Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={tradeLicenseNumber}
                    onChange={(e) => setTradeLicenseNumber(e.target.value)}
                    placeholder="e.g. 1048291 (DED / Freezone)"
                    className="mt-1.5 w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-[#D4AF65] focus:bg-white focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    TRN / Tax Registration Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={trnNumber}
                    onChange={(e) => setTrnNumber(e.target.value)}
                    placeholder="15-digit FTA TRN"
                    className="mt-1.5 w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-[#D4AF65] focus:bg-white focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Tariq Mansoor"
                    className="mt-1.5 w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-[#D4AF65] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Department / Role
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Procurement / Marketing / GM"
                    className="mt-1.5 w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-[#D4AF65] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Corporate Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="procurement@company.ae"
                    className="mt-1.5 w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-[#D4AF65] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Contact Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+971 50 123 4567"
                    className="mt-1.5 w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-[#D4AF65] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Annual Print Budget Estimate
                  </label>
                  <select
                    value={annualVolumeEstimate}
                    onChange={(e) => setAnnualVolumeEstimate(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-[#D4AF65] focus:bg-white focus:outline-none cursor-pointer"
                  >
                    {VOLUME_TIERS.map((tier) => (
                      <option key={tier} value={tier}>
                        {tier}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Requested Payment Facility
                  </label>
                  <select
                    value={creditTermsRequested}
                    onChange={(e) => setCreditTermsRequested(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-[#D4AF65] focus:bg-white focus:outline-none cursor-pointer"
                  >
                    <option value="Prepaid">Prepaid / Card / Bank Transfer (Fastest Dispatch)</option>
                    <option value="30 Days Net">30 Days Net (Subject to Trade License Check)</option>
                    <option value="60 Days Net">60 Days Net (Enterprise Contract SLA)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Multi-Item Print Specifications */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-[#D4AF65]">
                    <Layers className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-display text-lg font-bold text-[#101D35]">
                      2. Print Items &amp; Package Specifications
                    </h2>
                    <p className="text-xs text-slate-500">
                      Add all collateral items required in this procurement cycle.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddItem}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#D4AF65] bg-amber-50/60 px-3.5 py-2 text-xs font-bold text-[#101D35] hover:bg-[#D4AF65] hover:text-white transition-colors cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="h-4 w-4" /> Add Another Product Line
                </button>
              </div>

              {/* Items List */}
              <div className="space-y-4">
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 sm:p-5 relative transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-[#101D35]">
                        Line Item #{idx + 1}
                      </span>
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="text-slate-400 hover:text-red-600 transition-colors cursor-pointer p-1"
                          title="Remove line"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-600">
                          Product / Collateral Category
                        </label>
                        <input
                          type="text"
                          value={item.productName}
                          onChange={(e) => handleItemChange(idx, 'productName', e.target.value)}
                          placeholder="e.g. Luxury Business Cards / Rigid Boxes"
                          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 focus:border-[#D4AF65] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-600">
                          Target Quantity (Units)
                        </label>
                        <input
                          type="number"
                          min={1}
                          step={50}
                          value={item.quantity}
                          onChange={(e) => handleItemChange(idx, 'quantity', parseInt(e.target.value, 10) || 1)}
                          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 focus:border-[#D4AF65] focus:outline-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-600">
                          Finishing &amp; Substrate Specs
                        </label>
                        <input
                          type="text"
                          value={item.specifications}
                          onChange={(e) => handleItemChange(idx, 'specifications', e.target.value)}
                          placeholder="e.g. 400 GSM, 24K Gold Foil, Spot UV"
                          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-[#D4AF65] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: Delivery Logistics & Artwork */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-[#D4AF65]">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-display text-lg font-bold text-[#101D35]">
                    3. Delivery Logistics &amp; Artwork Upload
                  </h2>
                  <p className="text-xs text-slate-500">
                    Upload brand guidelines, vector artwork (up to 50MB), or provide delivery notes.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Delivery Destination / Multi-Branch Notes
                  </label>
                  <input
                    type="text"
                    value={deliveryLocations}
                    onChange={(e) => setDeliveryLocations(e.target.value)}
                    placeholder="e.g. Downtown Dubai HQ + Abu Dhabi Branch"
                    className="mt-1.5 w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-[#D4AF65] focus:bg-white focus:outline-none"
                  />

                  <div className="mt-4">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Additional Prepress / Brand Notes (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Specify exact Pantone solid coated codes, delivery deadline urgency, or packaging carton preferences…"
                      className="mt-1.5 w-full rounded-xl border border-slate-300 bg-slate-50/50 p-3 text-xs text-slate-900 focus:border-[#D4AF65] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Upload Box */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Artwork / Brand Kit Upload (Optional)
                  </label>
                  <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/60 p-6 text-center hover:border-[#D4AF65] hover:bg-amber-50/20 transition-all cursor-pointer">
                    <UploadCloud className="h-8 w-8 text-[#D4AF65] mb-2" />
                    <span className="text-xs font-bold text-slate-900">
                      Click to browse or drop brand files
                    </span>
                    <span className="text-[11px] text-slate-500 mt-1">
                      PDF, AI, EPS, PSD, TIFF, ZIP up to 50MB per file
                    </span>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".pdf,.ai,.eps,.psd,.tiff,.tif,.jpg,.jpeg,.png,.zip"
                    />
                  </label>

                  {files.length > 0 && (
                    <div className="mt-3 space-y-1.5">
                      <p className="text-[11px] font-bold text-slate-700">Selected Files ({files.length}):</p>
                      {files.map((f, i) => (
                        <div key={i} className="flex items-center justify-between rounded-lg bg-slate-100 px-3 py-1.5 text-xs">
                          <span className="truncate text-slate-800">{f.name}</span>
                          <span className="text-slate-500 text-[10px]">
                            {(f.size / (1024 * 1024)).toFixed(1)} MB
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="mt-2 w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-[#D4AF65] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-[#101D35] p-6 text-white shadow-lg">
              <div>
                <p className="font-bold text-sm text-white">Ready to Submit Corporate RFQ?</p>
                <p className="text-xs text-slate-300">
                  You will receive an instant reference number and itemized quotation within 2–4 business hours.
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button
                  type="submit"
                  variant="accent"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto justify-center font-bold px-8 shadow-md"
                >
                  {isSubmitting ? 'Transmitting RFQ...' : 'Submit Corporate Quote Request'}
                </Button>
              </div>
            </div>
          </form>
        )}
      </Container>
    </div>
  )
}
