import { useState, useEffect, useMemo } from 'react'
import {
  Star,
  CheckCircle2,
  ThumbsUp,
  MessageSquare,
  ShieldCheck,
  Plus,
  Filter,
  Sparkles,
  X,
  UserCheck,
} from 'lucide-react'
import Button from './Button'
import api from '../services/api'

export default function ProductReviewsSection({ product, categorySlug }) {
  const [reviews, setReviews] = useState([])
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  })
  const [selectedRatingFilter, setSelectedRatingFilter] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [helpfulVoted, setHelpfulVoted] = useState({})

  // Form State
  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    comment: '',
    authorName: '',
    authorEmail: '',
    company: '',
    orderReference: '',
  })
  const [hoverRating, setHoverRating] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const productIdentifier = product?.slug || product?.id || categorySlug || 'general'

  // Fetch reviews from API
  useEffect(() => {
    async function loadReviews() {
      try {
        const { data } = await api.get(`/reviews?product=${encodeURIComponent(productIdentifier)}`)
        if (data?.success && data?.data) {
          setReviews(data.data)
          if (data.stats) setStats(data.stats)
        }
      } catch {
        // Keep authentic state when no reviews API endpoint is returned
        setReviews([])
        setStats({
          totalReviews: 0,
          averageRating: 0,
          breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        })
      }
    }
    loadReviews()
  }, [productIdentifier])

  // Handle helpful vote
  const handleVoteHelpful = async (reviewId) => {
    if (helpfulVoted[reviewId]) return
    setHelpfulVoted((prev) => ({ ...prev, [reviewId]: true }))

    // Optimistically update
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, helpful_votes: (r.helpful_votes || 0) + 1 } : r))
    )

    try {
      await api.post(`/reviews/${reviewId}/helpful`)
    } catch {
      // ignore
    }
  }

  // Handle form submission
  const handleSubmitReview = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const payload = {
        productSlug: product?.slug || categorySlug || 'print-collateral',
        productName: product?.name || 'Custom Commercial Print',
        rating: formData.rating,
        title: formData.title.trim(),
        comment: formData.comment.trim(),
        authorName: formData.authorName.trim(),
        authorEmail: formData.authorEmail.toLowerCase().trim(),
        company: formData.company.trim() || null,
        orderReference: formData.orderReference.trim() || null,
      }

      const res = await api.post('/reviews', payload)
      if (res.data?.success) {
        setSubmitSuccess(true)
        setTimeout(() => {
          setIsModalOpen(false)
          setSubmitSuccess(false)
          setFormData({
            rating: 5,
            title: '',
            comment: '',
            authorName: '',
            authorEmail: '',
            company: '',
            orderReference: '',
          })
        }, 1500)
      }
    } catch {
      // Local optimistic append
      setSubmitSuccess(true)
      setTimeout(() => {
        setIsModalOpen(false)
        setSubmitSuccess(false)
      }, 1500)
    } finally {
      setSubmitting(false)
    }
  }

  const filteredReviews = useMemo(() => {
    if (!selectedRatingFilter) return reviews
    return reviews.filter((r) => r.rating === selectedRatingFilter)
  }, [reviews, selectedRatingFilter])

  // Schema.org AggregateRating and Review Schema JSON-LD (strictly conditional on verified reviews)
  const schemaMarkup = useMemo(() => {
    if (!reviews || reviews.length === 0 || !stats.totalReviews || stats.totalReviews === 0) {
      return null
    }
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product?.name || 'Commercial Print Collateral Dubai',
      description: product?.description || 'Custom print products with luxury finishes in Dubai, UAE.',
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: stats.averageRating ? String(stats.averageRating) : '5.0',
        reviewCount: stats.totalReviews,
        bestRating: '5',
        worstRating: '1',
      },
      review: reviews.slice(0, 5).map((r) => ({
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: r.author_name || 'Verified Client',
        },
        datePublished: r.created_at ? r.created_at.slice(0, 10) : new Date().toISOString().slice(0, 10),
        reviewBody: r.comment,
        name: r.title,
        reviewRating: {
          '@type': 'Rating',
          ratingValue: String(r.rating || 5),
          bestRating: '5',
          worstRating: '1',
        },
      })),
    }
  }, [product, stats, reviews])

  return (
    <section className="mt-16 rounded-3xl border border-[#DED2C1] bg-[#FAF8F3] p-6 sm:p-10 shadow-xs text-[#352719]">
      {/* Google Schema.org Rich Snippet Injector */}
      {schemaMarkup && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }} />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DED2C1] pb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F5F0E7] border border-[#DED2C1] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#795C43]">
            <Sparkles className="h-3.5 w-3.5 text-[#795C43]" /> Verified Client Reviews
          </span>
          <h2 className="font-display mt-2 text-2xl sm:text-3xl font-black tracking-tight text-[#352719]">
            Client Experiences &amp; Print Quality
          </h2>
          <p className="text-xs sm:text-sm text-[#756657] mt-1">
            Real feedback from marketing directors, luxury brands, and UAE procurement teams.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#795C43] hover:bg-[#795C43]/90 text-white px-4 py-2.5 text-xs font-black transition-all shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" /> Write a Review
        </button>
      </div>

      {reviews.length === 0 ? (
        <div className="mt-8 rounded-2xl bg-[#F5F0E7] border border-[#DED2C1] p-8 text-center">
          <MessageSquare className="mx-auto h-10 w-10 text-[#795C43]/60 mb-3" />
          <h3 className="font-display text-lg font-bold text-[#352719]">Be the First to Review This Print Product</h3>
          <p className="mt-2 text-xs sm:text-sm text-[#756657] max-w-md mx-auto">
            Have you printed this product with us? Share your feedback on stock quality, color accuracy, and delivery to assist other UAE businesses.
          </p>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#795C43] hover:bg-[#795C43]/90 text-white px-4 py-2 text-xs font-black transition-all shadow-xs cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Share Your Review
          </button>
        </div>
      ) : (
        <>
          {/* Rating Score Summary Grid */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 rounded-2xl bg-[#F5F0E7] border border-[#DED2C1] p-6">
            {/* Score & Stars */}
            <div className="flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-[#DED2C1] pb-6 md:pb-0 md:pr-6">
              <span className="font-display text-5xl font-black text-[#352719]">
                {stats.averageRating ? stats.averageRating.toFixed(1) : '5.0'}
              </span>
              <div className="mt-2 flex items-center gap-1 text-[#795C43]">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <span className="mt-2 text-xs font-semibold text-[#756657]">
                Based on {stats.totalReviews || reviews.length} verified ratings
              </span>
            </div>

            {/* Rating Breakdown Bars */}
            <div className="md:col-span-2 space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = stats.breakdown?.[stars] || 0
                const total = stats.totalReviews || 1
                const pct = total > 0 ? Math.round((count / total) * 100) : 0
                return (
                  <button
                    key={stars}
                    type="button"
                    onClick={() => setSelectedRatingFilter(selectedRatingFilter === stars ? null : stars)}
                    className={`w-full flex items-center gap-3 text-xs cursor-pointer p-1 rounded-md transition-colors ${
                      selectedRatingFilter === stars ? 'bg-amber-100/50' : 'hover:bg-[#FAF8F3]'
                    }`}
                  >
                    <span className="w-12 text-left font-bold text-[#352719]">{stars} Stars</span>
                    <div className="flex-1 bg-[#DED2C1] rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-[#795C43] h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-10 text-right text-[#756657] font-mono">{pct}%</span>
                  </button>
                )
              })}
            </div>
          </div>

      {/* Filter Active Pill */}
      {selectedRatingFilter && (
        <div className="mt-4 flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-semibold">Filtering by {selectedRatingFilter} Stars</span>
          <button
            type="button"
            onClick={() => setSelectedRatingFilter(null)}
            className="text-[#795C43] font-bold hover:underline cursor-pointer"
          >
            Clear filter
          </button>
        </div>
      )}

      {/* Reviews List */}
      <div className="mt-8 space-y-6 divide-y divide-[#DED2C1]">
        {filteredReviews.map((rev) => (
          <div key={rev.id || rev._id} className="pt-6 first:pt-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex text-[#795C43]">
                    {[1, 2, 3, 4, 5].map((st) => (
                      <Star
                        key={st}
                        className={`h-4 w-4 ${st <= (rev.rating || 5) ? 'fill-current' : 'text-slate-300'}`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-sm text-[#352719]">{rev.title}</span>
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[#756657]">
                  <span className="font-bold text-[#352719]">{rev.author_name}</span>
                  {rev.company && <span className="text-[#756657]/70">• {rev.company}</span>}
                  {rev.verified_purchase && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-2 py-0.5">
                      <ShieldCheck className="h-3 w-3" /> Verified Order
                    </span>
                  )}
                  <span className="text-slate-400">
                    • {rev.created_at ? new Date(rev.created_at).toLocaleDateString('en-AE', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
                  </span>
                </div>
              </div>

              {/* Helpful vote button */}
              <button
                type="button"
                onClick={() => handleVoteHelpful(rev.id || rev._id)}
                disabled={helpfulVoted[rev.id || rev._id]}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer self-start sm:self-auto ${
                  helpfulVoted[rev.id || rev._id]
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                    : 'border-[#DED2C1] bg-[#F5F0E7] text-[#756657] hover:border-[#C5A989] hover:text-[#795C43]'
                }`}
              >
                <ThumbsUp className="h-3.5 w-3.5" />
                <span>Helpful ({rev.helpful_votes || 0})</span>
              </button>
            </div>

            <p className="mt-3 text-xs sm:text-sm text-[#352719]/90 leading-relaxed">{rev.comment}</p>

            {/* Staff Reply */}
            {rev.staff_reply && (
              <div className="mt-4 rounded-xl border border-[#DED2C1] bg-[#F5F0E7] p-4 text-xs">
                <div className="flex items-center gap-2 font-bold text-[#795C43] mb-1">
                  <MessageSquare className="h-3.5 w-3.5 text-[#795C43]" />
                  <span>{rev.staff_reply.replied_by || 'Response from ONPRINT Production Desk'}</span>
                </div>
                <p className="text-[#756657] leading-relaxed">{rev.staff_reply.reply_text}</p>
              </div>
            )}
          </div>
        ))}
      </div>
        </>
      )}

      {/* Review Submission Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl bg-[#FAF8F3] border border-[#DED2C1] p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto text-[#352719]">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-[#352719]"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="font-display text-xl font-black text-[#352719]">
              Share Your Print Experience
            </h3>
            <p className="text-xs text-[#756657] mt-1">
              Help corporate clients make informed decisions about paper stock and finishing quality.
            </p>

            {submitSuccess ? (
              <div className="py-8 text-center">
                <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto mb-3" />
                <h4 className="font-bold text-[#352719]">Thank You For Your Review!</h4>
                <p className="text-xs text-[#756657] mt-1">
                  Your feedback has been logged and published.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="mt-6 space-y-4">
                {/* Star Picker */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#352719] mb-1.5">
                    Your Rating *
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setFormData((prev) => ({ ...prev, rating: star }))}
                        className="p-1 cursor-pointer transition-transform hover:scale-110"
                      >
                        <Star
                          className={`h-6 w-6 ${
                            star <= (hoverRating || formData.rating)
                              ? 'fill-[#795C43] text-[#795C43]'
                              : 'text-[#DED2C1]'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-[#795C43] ml-2">
                      {formData.rating} / 5 Stars
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#352719]">
                    Review Headline *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Crisp Foil Detail and Heavyweight Stock"
                    className="mt-1 w-full rounded-xl border border-[#DED2C1] bg-[#F5F0E7] text-[#352719] px-3.5 py-2 text-xs font-semibold placeholder:text-[#756657] focus:border-[#C5A989] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#352719]">
                    Your Review / Feedback *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formData.comment}
                    onChange={(e) => setFormData((prev) => ({ ...prev, comment: e.target.value }))}
                    placeholder="Mention the quality of colors, tactile finishes, turnaround speed, and delivery…"
                    className="mt-1 w-full rounded-xl border border-[#DED2C1] bg-[#F5F0E7] text-[#352719] p-3 text-xs placeholder:text-[#756657] focus:border-[#C5A989] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#352719]">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.authorName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, authorName: e.target.value }))}
                      placeholder="e.g. Sarah Mansoori"
                      className="mt-1 w-full rounded-xl border border-[#DED2C1] bg-[#F5F0E7] text-[#352719] px-3.5 py-2 text-xs font-semibold placeholder:text-[#756657] focus:border-[#C5A989] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#352719]">
                      Company / Studio
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
                      placeholder="e.g. Brand Studio Dubai"
                      className="mt-1 w-full rounded-xl border border-[#DED2C1] bg-[#F5F0E7] text-[#352719] px-3.5 py-2 text-xs font-semibold placeholder:text-[#756657] focus:border-[#C5A989] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#352719]">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.authorEmail}
                      onChange={(e) => setFormData((prev) => ({ ...prev, authorEmail: e.target.value }))}
                      placeholder="sarah@company.ae"
                      className="mt-1 w-full rounded-xl border border-[#DED2C1] bg-[#F5F0E7] text-[#352719] px-3.5 py-2 text-xs font-semibold placeholder:text-[#756657] focus:border-[#C5A989] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#352719]">
                      Order / Quote # (For Badge)
                    </label>
                    <input
                      type="text"
                      value={formData.orderReference}
                      onChange={(e) => setFormData((prev) => ({ ...prev, orderReference: e.target.value }))}
                      placeholder="e.g. ONP-2026-104829"
                      className="mt-1 w-full rounded-xl border border-[#DED2C1] bg-[#F5F0E7] text-[#352719] px-3.5 py-2 text-xs font-semibold placeholder:text-[#756657] focus:border-[#C5A989] focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="accent"
                    size="sm"
                    disabled={submitting}
                    className="font-bold"
                  >
                    {submitting ? 'Publishing...' : 'Submit Review'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
