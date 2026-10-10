const mongoose = require('mongoose')

const seoRedirectSchema = new mongoose.Schema(
  {
    id: { type: Number, index: true },
    old_url: { type: String, required: true, unique: true, trim: true },
    new_url: { type: String, required: true, trim: true },
    redirect_type: { type: String, default: '301', enum: ['301', '302', '307'] },
    status: { type: String, default: 'active', enum: ['active', 'inactive'], index: true },
    hit_count: { type: Number, default: 0 },
    notes: { type: String, default: null },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

module.exports = mongoose.models.SeoRedirect || mongoose.model('SeoRedirect', seoRedirectSchema)
