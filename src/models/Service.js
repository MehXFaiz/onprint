const mongoose = require('mongoose')

const serviceSchema = new mongoose.Schema(
  {
    id: { type: Number, index: true },
    service_key: { type: String, default: null },
    category_id: { type: Number, default: null, index: true },
    category_slug: { type: String, default: null },
    category: {
      id: { type: Number },
      _id: { type: String },
      name: { type: String },
      slug: { type: String },
    },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    short_description: { type: String, default: '' },
    description: { type: String, default: '' },
    image: { type: String, default: null },
    display_order: { type: Number, default: 0 },
    active: { type: Boolean, default: true, index: true },
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

module.exports = mongoose.models.Service || mongoose.model('Service', serviceSchema)
