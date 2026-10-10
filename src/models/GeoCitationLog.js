const mongoose = require('mongoose')

const geoCitationLogSchema = new mongoose.Schema(
  {
    id: { type: Number, index: true },
    query: { type: String, required: true },
    date_checked: { type: Date, required: true },
    platform: { type: String, required: true, index: true },
    onprint_mentioned: { type: Boolean, default: false },
    onprint_url: { type: String, default: null },
    citation_source: { type: String, default: null },
    competitors_mentioned: { type: mongoose.Schema.Types.Mixed, default: null },
    notes: { type: String, default: null },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

module.exports = mongoose.models.GeoCitationLog || mongoose.model('GeoCitationLog', geoCitationLogSchema)
