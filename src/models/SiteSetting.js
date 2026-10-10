const mongoose = require('mongoose')

const siteSettingSchema = new mongoose.Schema(
  {
    id: { type: Number, index: true },
    setting_key: { type: String, required: true, unique: true, trim: true },
    setting_value: { type: String, default: null },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

module.exports = mongoose.models.SiteSetting || mongoose.model('SiteSetting', siteSettingSchema)
