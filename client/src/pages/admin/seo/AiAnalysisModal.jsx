import { useState, useEffect } from 'react'
import {
  X,
  Sparkles,
  ArrowRight,
  Check,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Layers,
  Edit3,
} from 'lucide-react'
import Button from '../../../components/Button'
import { analyzePageSeoWithAi, updatePageSeo } from '../../../services/seo'

export default function AiAnalysisModal({
  page,
  isOpen,
  onClose,
  onApplied,
}) {
  const [loading, setLoading] = useState(true)
  const [analysis, setAnalysis] = useState(null)
  const [editableRec, setEditableRec] = useState({})
  const [isEditing, setIsEditing] = useState(false)
  const [applying, setApplying] = useState(false)
  const [statusMessage, setStatusMessage] = useState(null)

  useEffect(() => {
    if (page && isOpen) {
      loadAiAnalysis(page.id)
    }
  }, [page, isOpen])

  const loadAiAnalysis = async (pageId) => {
    try {
      setLoading(true)
      setStatusMessage(null)
      const res = await analyzePageSeoWithAi(pageId)
      if (res?.success) {
        setAnalysis(res.data)
        const rec = res.data.recommendation
        setEditableRec({
          meta_title: rec.metaTitle || '',
          meta_description: rec.metaDescription || '',
          focus_keyword: rec.focusKeyword || '',
          secondary_keywords: rec.secondaryKeywords || '',
          h1: rec.h1 || '',
          schema_type: rec.schemaType || 'WebPage',
        })
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.response?.data?.message || err.message })
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !page) return null

  const handleApply = async () => {
    try {
      setApplying(true)
      setStatusMessage(null)

      const payload = {
        meta_title: editableRec.meta_title,
        meta_description: editableRec.meta_description,
        focus_keyword: editableRec.focus_keyword,
        secondary_keywords: editableRec.secondary_keywords,
        h1: editableRec.h1,
        schema_type: editableRec.schema_type,
        og_title: editableRec.meta_title,
        og_description: editableRec.meta_description,
        twitter_title: editableRec.meta_title,
        twitter_description: editableRec.meta_description,
      }

      const res = await updatePageSeo(page.id, payload)
      if (res?.success) {
        setStatusMessage({ type: 'success', text: 'AI Recommendations applied successfully!' })
        if (onApplied) onApplied(res.data)
        setTimeout(() => {
          onClose()
        }, 1200)
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.response?.data?.message || err.message })
    } finally {
      setApplying(false)
    }
  }

  const current = analysis?.current || {}
  const rec = editableRec

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#A82F19]/10 text-[#A82F19] flex items-center justify-center">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-black text-lg text-neutral-900 tracking-tight">
                  AI Page SEO Optimizer
                </h2>
                <span className="rounded-full bg-neutral-200 px-2 py-0.5 text-[10px] font-bold text-neutral-700 uppercase">
                  {page.page_type}
                </span>
              </div>
              <p className="text-xs text-neutral-500 font-mono mt-0.5">
                Target URL: <strong className="text-neutral-800">{page.url}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-3 py-1.5 rounded-lg border border-neutral-300 text-xs font-bold text-neutral-700 hover:bg-neutral-100 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Edit3 className="h-3.5 w-3.5" />
              {isEditing ? 'Done Editing' : 'Edit Recommendations'}
            </button>
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Notification Banner */}
        {statusMessage && (
          <div
            className={`px-6 py-2.5 text-xs font-bold flex items-center gap-2 ${
              statusMessage.type === 'error'
                ? 'bg-red-50 text-red-700 border-b border-red-200'
                : 'bg-emerald-50 text-emerald-700 border-b border-emerald-200'
            }`}
          >
            {statusMessage.type === 'error' ? (
              <AlertTriangle className="h-4 w-4 shrink-0 text-red-600" />
            ) : (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <Sparkles className="h-8 w-8 text-[#A82F19] animate-spin mx-auto" />
              <div className="text-sm font-bold text-neutral-900">
                Running Neural On-Page Audit &amp; SERP Strategy Engine...
              </div>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Analyzing search intent, target keywords, SERP click triggers, and Dubai market competitors.
              </p>
            </div>
          ) : analysis ? (
            <div className="space-y-6">
              {/* Score Progression & Strategy Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                  <span className="text-[10px] font-extrabold uppercase text-neutral-400">Current Health Score</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-2xl font-black ${
                        (current.seoScore || page.seo_score) >= 80
                          ? 'text-emerald-700'
                          : (current.seoScore || page.seo_score) >= 60
                          ? 'text-amber-700'
                          : 'text-red-700'
                      }`}
                    >
                      {current.seoScore || page.seo_score || 50}/100
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-1">Based on existing tags and keywords</p>
                </div>

                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                  <span className="text-[10px] font-extrabold uppercase text-neutral-400">Projected Health Score</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-2xl font-black text-emerald-600">
                      {analysis.recommendation?.projectedScore || 94}/100
                    </span>
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-1">Upon applying these AI recommendations</p>
                </div>

                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                  <span className="text-[10px] font-extrabold uppercase text-neutral-400">Target Search Intent</span>
                  <div className="text-xs font-bold text-neutral-900 mt-1 uppercase tracking-wider">
                    {analysis.recommendation?.searchIntent || 'Commercial Investigation'}
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-1">Optimized for Dubai B2B purchase intent</p>
                </div>
              </div>

              {/* Strategy Rationale */}
              <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
                <div className="flex items-start gap-2.5">
                  <Cpu className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900">AI Strategy Rationale</h4>
                    <p className="text-xs text-neutral-700 mt-0.5 leading-relaxed">
                      {analysis.recommendation?.rationale ||
                        'Aligns meta tags with target Dubai search keywords, ensures optimal length for Google mobile & desktop display, and improves CTR with authentic commercial propositions.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Side-by-Side Comparison Table */}
              <div className="rounded-xl border border-neutral-200 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-neutral-200">
                  {/* Left Column: CURRENT */}
                  <div className="p-5 bg-neutral-50/50 space-y-4">
                    <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                      <span className="text-xs font-black text-neutral-500 uppercase tracking-wider">
                        Current Page SEO
                      </span>
                      <span className="text-[10px] text-neutral-400 font-mono">Live in DB</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Focus Keyword</span>
                      <div className="text-xs font-bold text-neutral-800 bg-white p-2.5 rounded-lg border border-neutral-200">
                        {current.focusKeyword || page.focus_keyword || '(None set)'}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-neutral-400 uppercase">Meta Title</span>
                        <span className="text-[10px] font-mono text-neutral-400">
                          {(current.metaTitle || page.meta_title || '').length} chars
                        </span>
                      </div>
                      <div className="text-xs text-neutral-800 bg-white p-2.5 rounded-lg border border-neutral-200">
                        {current.metaTitle || page.meta_title || '(None set)'}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-neutral-400 uppercase">Meta Description</span>
                        <span className="text-[10px] font-mono text-neutral-400">
                          {(current.metaDescription || page.meta_description || '').length} chars
                        </span>
                      </div>
                      <div className="text-xs text-neutral-800 bg-white p-2.5 rounded-lg border border-neutral-200 leading-relaxed">
                        {current.metaDescription || page.meta_description || '(None set)'}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">H1 Heading</span>
                      <div className="text-xs text-neutral-800 bg-white p-2.5 rounded-lg border border-neutral-200">
                        {current.h1 || page.h1 || '(None set)'}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Schema Type</span>
                      <div className="text-xs font-mono text-neutral-800 bg-white p-2.5 rounded-lg border border-neutral-200">
                        {current.schemaType || page.schema_type || 'WebPage'}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: AI RECOMMENDATION */}
                  <div className="p-5 bg-white space-y-4">
                    <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-[#A82F19]" />
                        <span className="text-xs font-black text-[#A82F19] uppercase tracking-wider">
                          AI Recommendation
                        </span>
                      </div>
                      {isEditing && (
                        <span className="text-[10px] text-amber-600 font-bold bg-amber-50 rounded px-1.5 py-0.5">
                          Editable Mode
                        </span>
                      )}
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Focus Keyword</span>
                      {isEditing ? (
                        <input
                          type="text"
                          value={rec.focus_keyword}
                          onChange={(e) => setEditableRec({ ...rec, focus_keyword: e.target.value })}
                          className="w-full text-xs font-bold text-neutral-900 bg-neutral-50 p-2 rounded-lg border border-[#A82F19] focus:outline-none"
                        />
                      ) : (
                        <div className="text-xs font-bold text-neutral-900 bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-200">
                          {rec.focus_keyword}
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-neutral-400 uppercase">Meta Title</span>
                        <span
                          className={`text-[10px] font-mono font-bold ${
                            rec.meta_title.length >= 50 && rec.meta_title.length <= 60
                              ? 'text-emerald-600'
                              : 'text-amber-600'
                          }`}
                        >
                          {rec.meta_title.length} / 60 chars
                        </span>
                      </div>
                      {isEditing ? (
                        <input
                          type="text"
                          value={rec.meta_title}
                          onChange={(e) => setEditableRec({ ...rec, meta_title: e.target.value })}
                          className="w-full text-xs font-bold text-neutral-900 bg-neutral-50 p-2 rounded-lg border border-[#A82F19] focus:outline-none"
                        />
                      ) : (
                        <div className="text-xs font-bold text-neutral-900 bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-200">
                          {rec.meta_title}
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-neutral-400 uppercase">Meta Description</span>
                        <span
                          className={`text-[10px] font-mono font-bold ${
                            rec.meta_description.length >= 140 && rec.meta_description.length <= 160
                              ? 'text-emerald-600'
                              : 'text-amber-600'
                          }`}
                        >
                          {rec.meta_description.length} / 160 chars
                        </span>
                      </div>
                      {isEditing ? (
                        <textarea
                          rows={3}
                          value={rec.meta_description}
                          onChange={(e) => setEditableRec({ ...rec, meta_description: e.target.value })}
                          className="w-full text-xs text-neutral-900 bg-neutral-50 p-2 rounded-lg border border-[#A82F19] focus:outline-none leading-relaxed"
                        />
                      ) : (
                        <div className="text-xs text-neutral-900 bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-200 leading-relaxed">
                          {rec.meta_description}
                        </div>
                      )}
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">H1 Heading</span>
                      {isEditing ? (
                        <input
                          type="text"
                          value={rec.h1}
                          onChange={(e) => setEditableRec({ ...rec, h1: e.target.value })}
                          className="w-full text-xs text-neutral-900 bg-neutral-50 p-2 rounded-lg border border-[#A82F19] focus:outline-none"
                        />
                      ) : (
                        <div className="text-xs text-neutral-900 bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-200">
                          {rec.h1}
                        </div>
                      )}
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Schema Type</span>
                      {isEditing ? (
                        <select
                          value={rec.schema_type}
                          onChange={(e) => setEditableRec({ ...rec, schema_type: e.target.value })}
                          className="w-full text-xs font-mono text-neutral-900 bg-neutral-50 p-2 rounded-lg border border-[#A82F19] focus:outline-none"
                        >
                          <option value="WebPage">WebPage</option>
                          <option value="Service">Service</option>
                          <option value="Product">Product</option>
                          <option value="Article">Article</option>
                          <option value="CollectionPage">CollectionPage</option>
                          <option value="ContactPage">ContactPage</option>
                          <option value="AboutPage">AboutPage</option>
                          <option value="FAQPage">FAQPage</option>
                          <option value="LocalBusiness">LocalBusiness</option>
                        </select>
                      ) : (
                        <div className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-200">
                          {rec.schema_type}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50/80 flex items-center justify-between shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={applying}
            className="text-xs font-bold"
          >
            Cancel
          </Button>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="accent"
              size="sm"
              onClick={handleApply}
              disabled={applying || loading}
              className="text-xs font-bold shadow-md shadow-[#A82F19]/20"
            >
              <Check className="h-3.5 w-3.5 mr-1.5" />
              {applying ? 'Applying Changes...' : 'Apply Recommendations'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
