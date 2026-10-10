const mongoose = require('mongoose')

const seoIssueSchema = new mongoose.Schema(
  {
    id: { type: Number, index: true },
    audit_id: { type: Number, default: null, index: true },
    entity_type: { type: String, required: true },
    entity_id: { type: Number, default: null },
    url: { type: String, default: null },
    issue_type: { type: String, required: true },
    category: { type: String, default: 'onpage', index: true },
    severity: { type: String, default: 'medium', index: true },
    title: { type: String, required: true },
    description: { type: String, default: null },
    recommendation: { type: String, default: null },
    resolved: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

module.exports = mongoose.models.SeoIssue || mongoose.model('SeoIssue', seoIssueSchema)
