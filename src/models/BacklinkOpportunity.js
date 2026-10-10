const mongoose = require('mongoose')

const backlinkOpportunitySchema = new mongoose.Schema(
  {
    id: { type: Number, index: true },
    website_name: { type: String, required: true },
    domain: { type: String, required: true, index: true },
    website_url: { type: String, required: true },
    category: { type: String, required: true, index: true },
    submission_method: { type: String, default: 'Online Form' },
    domain_authority: { type: Number, default: 0 },
    priority: { type: String, default: 'Medium', index: true },
    country: { type: String, default: 'UAE' },
    city: { type: String, default: 'Dubai' },
    relevance: { type: String, default: 'High' },
    link_type: { type: String, default: null },
    follow_type: { type: String, default: 'Follow' },
    contact_url: { type: String, default: null },
    submission_url: { type: String, default: null },
    target_url: { type: String, required: true },
    target_anchor_text: { type: String, default: null },
    status: { type: String, default: 'Planned', index: true },
    date_added: { type: Date, default: null },
    date_submitted: { type: Date, default: null },
    date_live: { type: Date, default: null },
    live_url: { type: String, default: null },
    notes: { type: String, default: null },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

module.exports = mongoose.models.BacklinkOpportunity || mongoose.model('BacklinkOpportunity', backlinkOpportunitySchema)
