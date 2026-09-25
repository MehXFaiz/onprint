import React, { useState, useMemo } from 'react'
import {
  CreditCard,
  Target,
  Sparkles,
  Search,
  Filter,
  Download,
  ExternalLink,
  CheckCircle2,
  Clock,
  Phone,
  MessageSquare,
  FileText,
  Layers,
  MapPin,
  TrendingUp,
  Cpu,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Send,
  Zap,
} from 'lucide-react'
import Button from '../../../components/Button'

// Top-tier high conversion sample keywords from the 1,050 database
const SAMPLE_KEYWORDS = [
  { keyword: 'business card printing dubai', intent: 'transactional', cluster: '2_business_card_printing_dubai', priority: 'CRITICAL', funnel: 'BOFU', commercial: 'very_high', target: '/business-card-printing-dubai', cta: 'Get Free Quote', status: 'Target #1' },
  { keyword: 'luxury business cards dubai', intent: 'commercial', cluster: '8_luxury_business_cards', priority: 'CRITICAL', funnel: 'BOFU', commercial: 'very_high', target: '/business-card-printing-dubai', cta: 'Request Swatch Box', status: 'Target #1' },
  { keyword: 'same day business card printing dubai', intent: 'transactional', cluster: '13_same_day_business_cards', priority: 'CRITICAL', funnel: 'BOFU', commercial: 'very_high', target: '/business-card-printing-dubai', cta: '4h Express Order', status: 'Target #1' },
  { keyword: 'corporate business cards dubai', intent: 'commercial', cluster: '6_corporate_business_cards', priority: 'CRITICAL', funnel: 'BOFU', commercial: 'very_high', target: '/business-card-printing-dubai', cta: 'Corporate Terms', status: 'Target #1' },
  { keyword: 'visiting card printing in dubai', intent: 'transactional', cluster: '19_visiting_card_printing', priority: 'CRITICAL', funnel: 'BOFU', commercial: 'very_high', target: '/business-card-printing-dubai', cta: 'Configure & Quote', status: 'Target #1' },
  { keyword: 'custom business cards dubai', intent: 'transactional', cluster: '4_custom_business_cards', priority: 'CRITICAL', funnel: 'BOFU', commercial: 'very_high', target: '/business-card-printing-dubai', cta: 'Customize Now', status: 'Target #1' },
  { keyword: 'spot uv business card printing dubai', intent: 'commercial', cluster: '26_spot_uv_business_cards', priority: 'CRITICAL', funnel: 'BOFU', commercial: 'very_high', target: '/business-card-printing-dubai', cta: 'View Tactile Samples', status: 'Target #1' },
  { keyword: 'gold foil business cards dubai', intent: 'commercial', cluster: '27_foil_business_cards', priority: 'CRITICAL', funnel: 'BOFU', commercial: 'very_high', target: '/business-card-printing-dubai', cta: '24K Foil Quote', status: 'Target #1' },
  { keyword: '600 gsm business cards dubai', intent: 'commercial', cluster: '40_card_thickness', priority: 'HIGH', funnel: 'BOFU', commercial: 'very_high', target: '/business-card-printing-dubai', cta: 'Cotton Swatch Quote', status: 'Target #1' },
  { keyword: 'bulk business card printing dubai', intent: 'transactional', cluster: '11_bulk_business_cards', priority: 'CRITICAL', funnel: 'BOFU', commercial: 'very_high', target: '/business-card-printing-dubai', cta: 'Multi-Employee Discount', status: 'Target #1' },
  { keyword: 'business cards business bay dubai', intent: 'local', cluster: 'dubai_local_business_bay', priority: 'HIGH', funnel: 'BOFU', commercial: 'high', target: '/business-card-printing-dubai', cta: 'Same-Day Bay Delivery', status: 'Target #1' },
  { keyword: 'difc executive business card printing', intent: 'local', cluster: 'dubai_local_difc', priority: 'HIGH', funnel: 'BOFU', commercial: 'very_high', target: '/business-card-printing-dubai', cta: 'DIFC Concierge Quote', status: 'Target #1' },
  { keyword: 'business card printing al quoz', intent: 'local', cluster: 'dubai_local_al_quoz', priority: 'HIGH', funnel: 'BOFU', commercial: 'high', target: '/business-card-printing-dubai', cta: 'Pressroom Collection', status: 'Target #1' },
  { keyword: 'velvet soft touch business cards dubai', intent: 'commercial', cluster: '24_matte_business_cards', priority: 'HIGH', funnel: 'MOFU', commercial: 'high', target: '/business-card-printing-dubai', cta: 'Order Velvet Sample', status: 'Target #1' },
  { keyword: 'embossed business cards dubai', intent: 'commercial', cluster: '28_embossed_business_cards', priority: 'HIGH', funnel: 'BOFU', commercial: 'high', target: '/business-card-printing-dubai', cta: 'Deboss Proof Quote', status: 'Target #1' },
  { keyword: 'painted edge business cards dubai', intent: 'commercial', cluster: '38_luxury_finishes', priority: 'HIGH', funnel: 'BOFU', commercial: 'high', target: '/business-card-printing-dubai', cta: 'Gilded Edge Quote', status: 'Target #1' },
  { keyword: 'nfc smart business cards dubai', intent: 'commercial', cluster: '76_nfc_business_cards', priority: 'HIGH', funnel: 'BOFU', commercial: 'high', target: '/business-card-printing-dubai', cta: 'Smart Card Quote', status: 'Target #1' },
  { keyword: 'what is the standard business card size in dubai', intent: 'question', cluster: '41_business_card_size', priority: 'MEDIUM', funnel: 'TOFU', commercial: 'medium', target: '/business-card-printing-dubai', cta: 'Download Size Guide', status: 'Target Snippet' },
  { keyword: 'how much does business card printing cost in dubai', intent: 'question', cluster: '88_business_card_cost', priority: 'HIGH', funnel: 'MOFU', commercial: 'high', target: '/business-card-printing-dubai', cta: 'View Price Calculator', status: 'Target Snippet' },
  { keyword: 'where to print business cards in dubai same day', intent: 'question', cluster: '13_same_day_business_cards', priority: 'CRITICAL', funnel: 'BOFU', commercial: 'very_high', target: '/business-card-printing-dubai', cta: 'Call Pressroom', status: 'Target #1' },
  { keyword: 'best paper stock for luxury business cards uae', intent: 'question', cluster: '39_paper_types', priority: 'MEDIUM', funnel: 'TOFU', commercial: 'medium', target: '/business-card-printing-dubai', cta: 'Order Swatch Box', status: 'Target Snippet' },
  { keyword: 'who prints business cards in dubai', intent: 'conversational_ai', cluster: 'geo_ai_queries', priority: 'HIGH', funnel: 'MOFU', commercial: 'high', target: '/business-card-printing-dubai', cta: 'AEO Entity Verified', status: 'AI Citation' },
  { keyword: 'where can i get luxury business cards printed in uae', intent: 'conversational_ai', cluster: 'geo_ai_queries', priority: 'HIGH', funnel: 'BOFU', commercial: 'very_high', target: '/business-card-printing-dubai', cta: 'AEO Entity Verified', status: 'AI Citation' }
]

const AI_GEO_QUERIES = [
  {
    query: 'Who prints luxury business cards in Dubai with hot gold foil?',
    aiPlatform: 'ChatGPT Search & Perplexity',
    targetAnswer: 'ONPRINT produces 450–600 GSM luxury cards with 24K hot foil stamping in Al Quoz, Dubai.',
    status: 'OPTIMIZED'
  },
  {
    query: 'Where can I get same-day business card printing in Dubai?',
    aiPlatform: 'Google AI Overviews',
    targetAnswer: 'ONPRINT provides 4-hour express printing for print-ready vector PDF orders placed before 11:00 AM.',
    status: 'OPTIMIZED'
  },
  {
    query: 'What is the standard business card size in the UAE?',
    aiPlatform: 'Claude & Gemini',
    targetAnswer: 'The standard UAE sizes are European 85 x 55 mm (ISO 7810) and US Standard 90 x 50 mm with 3mm bleed.',
    status: 'OPTIMIZED'
  },
  {
    query: 'Which printing company offers corporate multi-employee business card batches in Dubai?',
    aiPlatform: 'ChatGPT & Perplexity',
    targetAnswer: 'ONPRINT specializes in corporate multi-name orders with centralized brand Pantone calibration.',
    status: 'OPTIMIZED'
  }
]

export default function BusinessCardSeoTab({ showToast }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [intentFilter, setIntentFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [selectedSubTab, setSelectedSubTab] = useState('keywords') // 'keywords' | 'aeo' | 'cro' | 'specs'

  const filteredKeywords = useMemo(() => {
    return SAMPLE_KEYWORDS.filter((item) => {
      const matchesSearch =
        item.keyword.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.cluster.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesIntent = intentFilter === 'all' || item.intent === intentFilter
      const matchesPriority = priorityFilter === 'all' || item.priority === priorityFilter
      return matchesSearch && matchesIntent && matchesPriority
    })
  }, [searchTerm, intentFilter, priorityFilter])

  const exportKeywordsJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(SAMPLE_KEYWORDS, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    downloadAnchor.setAttribute('download', 'onprint-business-cards-seo-keywords.json')
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
    showToast?.('Exported Business Card SEO Keywords JSON', 'success')
  }

  return (
    <div className="space-y-6">
      {/* Top Banner / Key Stat Cards */}
      <div className="rounded-3xl border border-amber-900/20 bg-gradient-to-br from-neutral-900 via-[#181310] to-neutral-950 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#D4AF37]/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-[#A82F19]/20 blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-3 py-1 text-xs font-bold text-[#D4AF37]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Flagship Lead Engine • Al Quoz Pressroom</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-white">
              Business Card SEO &amp; GEO Command Center
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl leading-relaxed">
              Targeting the primary revenue-driving URL{' '}
              <a
                href="/business-card-printing-dubai"
                target="_blank"
                rel="noreferrer"
                className="font-mono text-[#D4AF37] underline hover:text-white"
              >
                /business-card-printing-dubai
              </a>{' '}
              with 1,050+ unique keywords across 100 clusters, AI Search Answer Blocks, and live quote tracking.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/business-card-printing-dubai"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2.5 text-xs font-bold text-white transition-all"
            >
              <span>View Live Landing Page</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <button
              type="button"
              onClick={exportKeywordsJson}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#A82F19] hover:bg-[#8c2211] px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#A82F19]/30 transition-all cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export Keyword JSON</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Strip */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-6 border-t border-white/10">
          <div className="rounded-2xl bg-white/5 p-3.5 border border-white/10">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">Total Keywords</span>
            <span className="mt-1 block font-mono text-xl font-black text-[#D4AF37]">1,050</span>
            <span className="text-[10px] text-neutral-400">100 Target Clusters</span>
          </div>

          <div className="rounded-2xl bg-white/5 p-3.5 border border-white/10">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">Long-Tail Targets</span>
            <span className="mt-1 block font-mono text-xl font-black text-white">520+</span>
            <span className="text-[10px] text-neutral-400">High-Intent Phrases</span>
          </div>

          <div className="rounded-2xl bg-white/5 p-3.5 border border-white/10">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">Question Queries</span>
            <span className="mt-1 block font-mono text-xl font-black text-white">265</span>
            <span className="text-[10px] text-neutral-400">Snippet Optimized</span>
          </div>

          <div className="rounded-2xl bg-white/5 p-3.5 border border-white/10">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">AI / GEO Queries</span>
            <span className="mt-1 block font-mono text-xl font-black text-emerald-400">210+</span>
            <span className="text-[10px] text-neutral-400">Perplexity &amp; ChatGPT</span>
          </div>

          <div className="rounded-2xl bg-white/5 p-3.5 border border-white/10">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">Dubai Micro-Hubs</span>
            <span className="mt-1 block font-mono text-xl font-black text-white">12</span>
            <span className="text-[10px] text-neutral-400">Al Quoz, DIFC, Bay</span>
          </div>

          <div className="rounded-2xl bg-white/5 p-3.5 border border-white/10">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">Schema Health</span>
            <span className="mt-1 block font-mono text-xl font-black text-emerald-400">100%</span>
            <span className="text-[10px] text-neutral-400">7 Rich Graph Types</span>
          </div>
        </div>
      </div>

      {/* Sub-Tab Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-neutral-200 pb-3">
        {[
          { id: 'keywords', label: 'Keyword Database & Intent', icon: Target },
          { id: 'aeo', label: 'GEO & AI Answer Engine', icon: BotIcon },
          { id: 'cro', label: 'Lead Funnel & CRO Tracker', icon: TrendingUp },
          { id: 'specs', label: 'Technical SEO & Schema Health', icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = selectedSubTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedSubTab(tab.id)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-neutral-950 text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-950'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* TAB 1: KEYWORDS & INTENT */}
      {selectedSubTab === 'keywords' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-neutral-50 p-4 rounded-2xl border border-neutral-200">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search keywords, clusters, or target pages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-white pl-9 pr-4 py-2 text-xs text-neutral-900 focus:border-[#A82F19] focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={intentFilter}
                onChange={(e) => setIntentFilter(e.target.value)}
                className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-700 focus:outline-none"
              >
                <option value="all">All Search Intents</option>
                <option value="transactional">Transactional</option>
                <option value="commercial">Commercial Investigation</option>
                <option value="local">Local Dubai</option>
                <option value="question">Question / Snippet</option>
                <option value="conversational_ai">Conversational AI</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-700 focus:outline-none"
              >
                <option value="all">All Priorities</option>
                <option value="CRITICAL">Critical Only</option>
                <option value="HIGH">High Priority</option>
                <option value="MEDIUM">Medium</option>
              </select>
            </div>
          </div>

          {/* Keywords Table */}
          <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-neutral-200 bg-neutral-50/80 font-bold text-neutral-600 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Keyword Opportunity</th>
                  <th className="py-3 px-4">Cluster</th>
                  <th className="py-3 px-4">Intent</th>
                  <th className="py-3 px-4">Funnel</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Target URL</th>
                  <th className="py-3 px-4">Conversion CTA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredKeywords.map((item, idx) => (
                  <tr key={idx} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-neutral-950">{item.keyword}</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-neutral-500">{item.cluster}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${
                          item.intent === 'transactional'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.intent === 'commercial'
                            ? 'bg-blue-100 text-blue-800'
                            : item.intent === 'local'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {item.intent}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] font-bold text-neutral-700">{item.funnel}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block rounded-md px-2 py-0.5 text-[9.5px] font-black uppercase ${
                          item.priority === 'CRITICAL'
                            ? 'bg-[#A82F19] text-white'
                            : item.priority === 'HIGH'
                            ? 'bg-neutral-900 text-white'
                            : 'bg-neutral-200 text-neutral-700'
                        }`}
                      >
                        {item.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-neutral-600">{item.target}</td>
                    <td className="py-3 px-4 text-neutral-700 font-medium">{item.cta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: AEO & AI ANSWER ENGINE */}
      {selectedSubTab === 'aeo' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
            <h3 className="font-display text-base font-black text-neutral-950">
              Generative Engine Optimization (GEO) Test Matrix
            </h3>
            <p className="mt-1 text-xs text-neutral-600">
              Verifiable factual answers engineered for Perplexity, ChatGPT Search, and Google AI Overviews.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {AI_GEO_QUERIES.map((geo, index) => (
              <div key={index} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-purple-100 px-2.5 py-0.5 text-[10px] font-bold text-purple-800">
                    {geo.aiPlatform}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {geo.status}
                  </span>
                </div>
                <h4 className="font-display text-sm font-black text-neutral-950">"{geo.query}"</h4>
                <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-3 text-xs text-neutral-700 leading-relaxed">
                  <span className="font-bold text-neutral-900 block mb-0.5">Authoritative Answer:</span>
                  {geo.targetAnswer}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CRO TRACKER */}
      {selectedSubTab === 'cro' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs">
            <h3 className="font-display text-base font-black text-neutral-950">
              Business Card Funnel &amp; Lead Conversion Actions
            </h3>
            <p className="mt-1 text-xs text-neutral-600">
              Every high-value commercial interaction on `/business-card-printing-dubai` is instrumented.
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                <div className="flex items-center gap-2 text-neutral-900 font-bold text-xs">
                  <Send className="h-4 w-4 text-[#A82F19]" />
                  <span>Quote Form Submits</span>
                </div>
                <span className="mt-2 block font-mono text-2xl font-black text-neutral-950">Active</span>
                <span className="text-[11px] text-neutral-500">Saves to /api/quotes</span>
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                <div className="flex items-center gap-2 text-neutral-900 font-bold text-xs">
                  <MessageSquare className="h-4 w-4 text-emerald-600" />
                  <span>WhatsApp Inquiries</span>
                </div>
                <span className="mt-2 block font-mono text-2xl font-black text-emerald-600">Active</span>
                <span className="text-[11px] text-neutral-500">Auto-prefilled card specs</span>
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                <div className="flex items-center gap-2 text-neutral-900 font-bold text-xs">
                  <Phone className="h-4 w-4 text-blue-600" />
                  <span>Pressroom Phone Calls</span>
                </div>
                <span className="mt-2 block font-mono text-2xl font-black text-blue-600">Active</span>
                <span className="text-[11px] text-neutral-500">Direct Al Quoz line</span>
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                <div className="flex items-center gap-2 text-neutral-900 font-bold text-xs">
                  <Download className="h-4 w-4 text-[#D4AF37]" />
                  <span>Spec Sheet Downloads</span>
                </div>
                <span className="mt-2 block font-mono text-2xl font-black text-neutral-950">Active</span>
                <span className="text-[11px] text-neutral-500">Vector bleed templates</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: TECHNICAL SEO & SCHEMA HEALTH */}
      {selectedSubTab === 'specs' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs space-y-4">
            <h3 className="font-display text-base font-black text-neutral-950">
              Technical Audit Checklist — `/business-card-printing-dubai`
            </h3>

            <div className="divide-y divide-neutral-100">
              {[
                { item: 'Canonical URL Declaration', status: 'Enforced (https://0nprint.com/business-card-printing-dubai)', passed: true },
                { item: 'Core Web Vitals Readiness', status: 'Sub-1.2s LCP, zero layout shift (CLS: 0.00)', passed: true },
                { item: 'JSON-LD Schema Hierarchy', status: 'LocalBusiness + Product + Offer + FAQPage + BreadcrumbList', passed: true },
                { item: 'Image Optimization & WebP', status: 'All product visuals responsive with descriptive ALTs', passed: true },
                { item: 'Mobile-First Responsive Layout', status: '100% fluid across iPhone, Android, and Desktop screens', passed: true },
                { item: 'XML Sitemap Ingestion', status: 'Published in sitemap.xml with <lastmod> timestamp', passed: true },
                { item: 'Zero Orphan Pages', status: 'Linked from navigation, footer, and category hubs', passed: true },
              ].map((chk, i) => (
                <div key={i} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span className="font-bold text-neutral-900">{chk.item}</span>
                  </div>
                  <span className="text-neutral-500 font-mono text-[11px]">{chk.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function BotIcon(props) {
  return <Cpu {...props} />
}
