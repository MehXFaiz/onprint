const mongoose = require('mongoose')

const geoCompetitorAuditSchema = new mongoose.Schema(
  {
    id: { type: Number, index: true },
    competitor_url: { type: String, required: true },
    competitor_name: { type: String, default: null },
    analysis_json: { type: mongoose.Schema.Types.Mixed, default: null },
    recommendations_json: { type: mongoose.Schema.Types.Mixed, default: null },
    audited_at: { type: Date, default: Date.now },
  },
  {
    timestamps: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

module.exports = mongoose.models.GeoCompetitorAudit || mongoose.model('GeoCompetitorAudit', geoCompetitorAuditSchema)
