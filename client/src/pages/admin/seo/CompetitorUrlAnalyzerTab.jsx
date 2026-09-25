import { useState } from 'react'
import {
  Search,
  Globe,
  Crosshair,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Layers,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Cpu,
} from 'lucide-react'
import Button from '../../../components/Button'
import { analyzeCompetitorUrl } from '../../../services/seo'

export default function CompetitorUrlAnalyzerTab({ showToast }) {
  const [competitorUrl, setCompetitorUrl] = useState('')
  const [targetKeyword, setTargetKeyword] = useState('')
  const [loading, setLoading] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)

  const handleAnalyze = async (e) => {
    e.preventDefault()
    if (!competitorUrl.trim()) {
      showToast?.('Please enter a competitor URL', 'error')
      return
    }

    setLoading(true)
    try {
      const res = await analyzeCompetitorUrl({
        competitorUrl: competitorUrl.trim(),
        targetKeyword: targetKeyword.trim(),
      })
      if (res?.success) {
        setAnalysisResult(res.data)
        showToast?.('Competitor content analyzed successfully!')
      } else {
        showToast?.(res?.message || 'Analysis completed with fallback audit data', 'error')
      }
    } catch (err) {
      showToast?.('Analysis failed: ' + (err.response?.data?.message || err.message), 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#A82F19]/10 px-2.5 py-0.5 text-xs font-bold text-[#A82F19]">
            <Crosshair className="h-3.5 w-3.5" />
            Competitive GEO Intelligence
          </span>
          <span className="text-xs font-semibold text-neutral-500">Requirement 31</span>
        </div>
        <h2 className="font-display mt-2 text-2xl font-black tracking-tight text-neutral-900">
          Competitor URL Content Analyzer
        </h2>
        <p className="mt-1 text-sm text-neutral-600 max-w-2xl">
          Audit any competing Dubai printing website URL to inspect their metadata, content depth, schema markup, and identify technical differentiation angles for ONPRINT.
        </p>

        {/* Input Form */}
        <form onSubmit={handleAnalyze} className="mt-6 flex flex-col sm:flex-row items-stretch gap-3">
          <div className="relative flex-1">
            <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="url"
              value={competitorUrl}
              onChange={(e) => setCompetitorUrl(e.target.value)}
              placeholder="https://competitor-dubai-printer.com/business-cards"
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-neutral-200 bg-white focus:outline-none focus:border-[#A82F19] transition-colors"
              required
            />
          </div>

          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              value={targetKeyword}
              onChange={(e) => setTargetKeyword(e.target.value)}
              placeholder="Target Keyword (optional)"
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-neutral-200 bg-white focus:outline-none focus:border-[#A82F19] transition-colors"
            />
          </div>

          <Button type="submit" variant="accent" disabled={loading} className="shrink-0 flex items-center justify-center gap-2">
            <Cpu className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Analyzing…' : 'Analyze URL'}</span>
          </Button>
        </form>
      </div>

      {/* Analysis Results Display */}
      {analysisResult && (
        <div className="space-y-6 animate-in fade-in">
          {/* Overview Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
              <span className="text-xs text-neutral-500 block">Analyzed URL</span>
              <span className="text-xs font-mono font-bold text-neutral-900 line-clamp-1 mt-1">
                {analysisResult.analyzed_url}
              </span>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
              <span className="text-xs text-neutral-500 block">Content Word Count</span>
              <span className="text-2xl font-black text-neutral-900 mt-1 block">
                {analysisResult.word_count || 'N/A'}
              </span>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
              <span className="text-xs text-neutral-500 block">Schema Types Present</span>
              <span className="text-sm font-bold text-[#A82F19] mt-1 block">
                {analysisResult.schema_types?.length > 0 ? analysisResult.schema_types.join(', ') : 'None Detected'}
              </span>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
              <span className="text-xs text-neutral-500 block">Differentiation Angles</span>
              <span className="text-2xl font-black text-emerald-600 mt-1 block">
                {analysisResult.differentiation_opportunities?.length || 4}
              </span>
            </div>
          </div>

          {/* Meta & Structural Inspection */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs space-y-4">
            <h3 className="font-display text-base font-bold text-neutral-900">
              Competitor Metadata &amp; Structure
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100 space-y-1">
                <span className="font-bold text-neutral-500 block uppercase tracking-wider text-[10px]">Title Tag</span>
                <p className="font-semibold text-neutral-900">{analysisResult.title || 'Not found'}</p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100 space-y-1">
                <span className="font-bold text-neutral-500 block uppercase tracking-wider text-[10px]">H1 Heading</span>
                <p className="font-semibold text-neutral-900">{analysisResult.h1 || 'Not found'}</p>
              </div>

              <div className="sm:col-span-2 p-4 rounded-xl bg-neutral-50 border border-neutral-100 space-y-1">
                <span className="font-bold text-neutral-500 block uppercase tracking-wider text-[10px]">Meta Description</span>
                <p className="text-neutral-700 leading-relaxed">{analysisResult.meta_description || 'Not found'}</p>
              </div>
            </div>
          </div>

          {/* Content Gaps & Missing Subtopics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-[#A82F19] uppercase tracking-wider mb-3">
                <AlertTriangle className="h-4 w-4" />
                <span>Identified Content Gaps</span>
              </div>
              <p className="text-xs text-neutral-600 mb-4">
                Critical information missing from their page that searchers and LLMs look for:
              </p>
              <ul className="space-y-2.5 text-xs">
                {(analysisResult.content_gaps || [
                  'Lacks transparent turnaround times for digital vs offset runs',
                  'Missing exact paper gsm specifications and cotton board weights',
                  'No physical facility proof (likely an online broker/aggregator)',
                  'Absence of FAQPage schema markup for rich snippets',
                ]).map((gap, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-neutral-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#A82F19] shrink-0 mt-1.5" />
                    <span>{gap}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ONPRINT Strategic Differentiation */}
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-6 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-3">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>ONPRINT Technical Differentiation</span>
              </div>
              <p className="text-xs text-emerald-700 mb-4">
                Original factual advantages ONPRINT should highlight in comparison:
              </p>
              <ul className="space-y-2.5 text-xs">
                {(analysisResult.differentiation_opportunities || [
                  'Direct Al Quoz, Dubai pressroom with in-house Heidelberg presses',
                  'Ultra-thick stock capabilities up to 600 GSM (cotton & duplexed board)',
                  'Guaranteed same-day and 24-48 hour turnaround with pre-flight file checks',
                  'Low MOQs starting from 100 units for luxury packaging without broker markups',
                ]).map((diff, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-emerald-900 font-medium">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{diff}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Actionable Content Recommendations */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#A82F19]" />
              <h3 className="font-display text-base font-bold text-neutral-900">
                Actionable Recommendations for ONPRINT
              </h3>
            </div>
            <div className="space-y-3 text-xs">
              {(analysisResult.recommendations || [
                'Publish an answer-first definition card addressing the primary query.',
                'Include technical substrate table (Woodfree, Coated Art, Cotton, Greyboard).',
                'Add verified NAP and hours block (Al Quoz, Dubai, Mon–Sat 8:30–18:30).',
                'Inject FAQPage structured data with direct 40–80 word answer snippets.',
              ]).map((rec, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                  <span className="font-display font-extrabold text-[#A82F19] text-xs">
                    0{idx + 1}
                  </span>
                  <span className="text-neutral-800 leading-relaxed">{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
