const mongoose = require('mongoose')

const pageSeoSchema = new mongoose.Schema(
  {
    id: { type: Number, index: true },
    page_type: { type: String, required: true, index: true },
    page_id: { type: Number, default: null },
    url: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, default: null },
    meta_title: { type: String, default: null },
    meta_description: { type: String, default: null },
    focus_keyword: { type: String, default: null, index: true },
    secondary_keywords: { type: String, default: null },
    h1: { type: String, default: null },
    seo_content: { type: String, default: null },
    canonical_url: { type: String, default: null },
    robots_index: { type: String, default: 'index' },
    robots_follow: { type: String, default: 'follow' },
    og_title: { type: String, default: null },
    og_description: { type: String, default: null },
    og_image: { type: String, default: null },
    twitter_title: { type: String, default: null },
    twitter_description: { type: String, default: null },
    twitter_image: { type: String, default: null },
    schema_type: { type: String, default: null },
    schema_markup: { type: String, default: null },
    seo_score: { type: Number, default: 0, index: true },
    readability_score: { type: Number, default: 0 },
    search_intent: { type: String, default: 'Commercial' },
    focus_entity: { type: String, default: null },
    related_entities: { type: String, default: null },
    faq_content: { type: String, default: null },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

module.exports = mongoose.models.PageSeo || mongoose.model('PageSeo', pageSeoSchema)
