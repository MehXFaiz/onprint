const mongoose = require('mongoose')

const seoExperimentSchema = new mongoose.Schema(
  {
    id: { type: Number, index: true },
    page_url: { type: String, required: true, index: true },
    test_type: { type: String, required: true },
    control_value: { type: String, required: true },
    variant_value: { type: String, required: true },
    hypothesis: { type: String, default: null },
    status: { type: String, default: 'running', index: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, default: null },
    baseline_clicks: { type: Number, default: 0 },
    baseline_impressions: { type: Number, default: 0 },
    baseline_ctr: { type: Number, default: 0.0 },
    variant_clicks: { type: Number, default: 0 },
    variant_impressions: { type: Number, default: 0 },
    variant_ctr: { type: Number, default: 0.0 },
    winner: { type: String, default: 'inconclusive' },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

module.exports = mongoose.models.SeoExperiment || mongoose.model('SeoExperiment', seoExperimentSchema)
