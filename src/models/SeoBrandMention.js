const mongoose = require('mongoose')

const seoBrandMentionSchema = new mongoose.Schema(
  {
    id: { type: Number, index: true },
    mention_source: { type: String, required: true, index: true },
    source_url: { type: String, required: true },
    brand_query: { type: String, default: 'ONPRINT' },
    snippet: { type: String, default: null },
    has_link: { type: Boolean, default: false, index: true },
    linking_url: { type: String, default: null },
    domain_authority: { type: Number, default: 30 },
    sentiment: { type: String, default: 'positive' },
    outreach_status: { type: String, default: 'uncontacted', index: true },
    notes: { type: String, default: null },
    date_discovered: { type: Date, default: null },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

module.exports = mongoose.models.SeoBrandMention || mongoose.model('SeoBrandMention', seoBrandMentionSchema)
