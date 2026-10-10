const mongoose = require('mongoose')

const seoBacklinkOpportunity200Schema = new mongoose.Schema(
  {
    id: { type: Number, index: true },
    website: { type: String, required: true },
    domain: { type: String, required: true, index: true },
    url: { type: String, required: true },
    country: { type: String, default: 'United Arab Emirates' },
    city: { type: String, default: 'Dubai' },
    industry: { type: String, required: true, index: true },
    relevance: { type: String, default: 'High', index: true },
    link_opportunity: { type: String, required: true },
    submission_url: { type: String, default: null },
    contact_url: { type: String, default: null },
    link_type: { type: String, default: 'Directory Profile' },
    follow_type: { type: String, default: 'Follow' },
    target_onprint_url: { type: String, required: true },
    anchor_text: { type: String, default: null },
    status: { type: String, default: 'Prospect', index: true },
    date: { type: Date, default: null },
    link_url: { type: String, default: null },
    link_attribute: { type: String, default: 'follow' },
    notes: { type: String, default: null },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

module.exports = mongoose.models.SeoBacklinkOpportunity200 || mongoose.model('SeoBacklinkOpportunity200', seoBacklinkOpportunity200Schema)
