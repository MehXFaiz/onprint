const mongoose = require('mongoose')

const pageSeoHistorySchema = new mongoose.Schema(
  {
    id: { type: Number, index: true },
    page_seo_id: { type: Number, required: true, index: true },
    page_url: { type: String, required: true },
    field_changed: { type: String, required: true },
    old_value: { type: String, default: null },
    new_value: { type: String, default: null },
    changed_by: { type: String, default: 'Admin' },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

module.exports = mongoose.models.PageSeoHistory || mongoose.model('PageSeoHistory', pageSeoHistorySchema)
