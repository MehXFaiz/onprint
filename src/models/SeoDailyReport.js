const mongoose = require('mongoose')

const seoDailyReportSchema = new mongoose.Schema(
  {
    id: { type: Number, index: true },
    report_date: { type: Date, required: true, unique: true, index: true },
    health_score: { type: Number, default: 0 },
    technical_score: { type: Number, default: 0 },
    onpage_score: { type: Number, default: 0 },
    content_score: { type: Number, default: 0 },
    structured_data_score: { type: Number, default: 0 },
    total_pages_scanned: { type: Number, default: 0 },
    critical_issues: { type: Number, default: 0 },
    high_issues: { type: Number, default: 0 },
    medium_issues: { type: Number, default: 0 },
    low_issues: { type: Number, default: 0 },
    pending_recommendations: { type: Number, default: 0 },
    applied_changes_today: { type: Number, default: 0 },
    organic_clicks: { type: Number, default: 0 },
    organic_impressions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    impressions: { type: Number, default: 0 },
    ctr: { type: Number, default: 0.0 },
    avg_position: { type: Number, default: 0.0 },
    top_gaining_keywords: { type: mongoose.Schema.Types.Mixed, default: null },
    top_losing_keywords: { type: mongoose.Schema.Types.Mixed, default: null },
    top_opportunities: { type: mongoose.Schema.Types.Mixed, default: null },
    technical_issues: { type: mongoose.Schema.Types.Mixed, default: null },
    content_opportunities: { type: mongoose.Schema.Types.Mixed, default: null },
    ai_recommendations: { type: mongoose.Schema.Types.Mixed, default: null },
    changes_applied: { type: mongoose.Schema.Types.Mixed, default: null },
    changes_pending: { type: mongoose.Schema.Types.Mixed, default: null },
    executive_summary: { type: String, default: null },
    report_summary: { type: String, default: null },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

module.exports = mongoose.models.SeoDailyReport || mongoose.model('SeoDailyReport', seoDailyReportSchema)
