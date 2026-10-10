const mongoose = require('mongoose')

const seoIntegrationSchema = new mongoose.Schema(
  {
    id: { type: Number, index: true },
    integration_name: { type: String, required: true, unique: true, trim: true },
    is_connected: { type: Boolean, default: false },
    config: { type: mongoose.Schema.Types.Mixed, default: null },
    last_synced_at: { type: Date, default: null },
    error_message: { type: String, default: null },
  },
  {
    timestamps: { createdAt: false, updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

module.exports = mongoose.models.SeoIntegration || mongoose.model('SeoIntegration', seoIntegrationSchema)
