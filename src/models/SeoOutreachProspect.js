const mongoose = require('mongoose')

const seoOutreachProspectSchema = new mongoose.Schema(
  {
    id: { type: Number, index: true },
    website_domain: { type: String, required: true, index: true },
    contact_name: { type: String, default: null },
    contact_email: { type: String, default: null },
    website_category: { type: String, default: null },
    relevance: { type: String, default: 'unknown' },
    authority: { type: Number, default: null },
    outreach_status: { type: String, default: 'Prospect', index: true },
    date_contacted: { type: Date, default: null },
    follow_up_date: { type: Date, default: null },
    response: { type: String, default: null },
    link_obtained: { type: Boolean, default: false },
    target_url: { type: String, default: null },
    anchor_text: { type: String, default: null },
    notes: { type: String, default: null },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

module.exports = mongoose.models.SeoOutreachProspect || mongoose.model('SeoOutreachProspect', seoOutreachProspectSchema)
