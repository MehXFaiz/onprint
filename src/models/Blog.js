const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema(
  {
    id: { type: Number, index: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    excerpt: { type: String, default: '' },
    content: { type: String, required: true },
    featured_image: { type: String, default: null },
    image_alt: { type: String, default: null },
    category_id: { type: Number, default: null, index: true },
    category: {
      id: { type: Number },
      name: { type: String },
      slug: { type: String },
    },
    product_id: { type: Number, default: null, index: true },
    author_id: { type: Number, default: null },
    author_name: { type: String, default: 'ONPRINT Editorial Team' },
    status: { type: String, default: 'draft', enum: ['draft', 'published', 'scheduled'], index: true },
    is_featured: { type: Boolean, default: false, index: true },
    seo_title: { type: String, default: null },
    meta_title: { type: String, default: null },
    meta_description: { type: String, default: null },
    focus_keyword: { type: String, default: null },
    secondary_keywords: { type: String, default: null },
    canonical_url: { type: String, default: null },
    og_title: { type: String, default: null },
    og_description: { type: String, default: null },
    og_image: { type: String, default: null },
    schema_type: { type: String, default: 'BlogPosting' },
    reading_time: { type: Number, default: 3 },
    target_location: { type: String, default: null },
    robots_index: { type: String, default: 'index' },
    robots_follow: { type: String, default: 'follow' },
    seo_score: { type: Number, default: 0 },
    readability_score: { type: Number, default: 0 },
    keyword_density: { type: Number, default: 0.0 },
    word_count: { type: Number, default: 0 },
    seo_suggestions: { type: mongoose.Schema.Types.Mixed, default: null },
    schema_markup: { type: String, default: null },
    faqs: [
      {
        question: { type: String },
        answer: { type: String },
      },
    ],
    published_at: { type: Date, default: Date.now, index: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

module.exports = mongoose.models.Blog || mongoose.model('Blog', blogSchema)
