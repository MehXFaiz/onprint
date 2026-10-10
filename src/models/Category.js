const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema(
  {
    id: { type: Number, index: true },
    category_key: { type: String, default: null },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: '' },
    image: { type: String, default: null },
    image_url: { type: String, default: null },
    status: { type: String, default: 'active' },
    display_order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    seo_title: { type: String, default: null },
    seo_description: { type: String, default: null },
    seo_keywords: { type: String, default: null },
    seo_heading: { type: String, default: null },
    canonical_url: { type: String, default: null },
    image_alt: { type: String, default: null },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

module.exports = mongoose.models.Category || mongoose.model('Category', categorySchema)
