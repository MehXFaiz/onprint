const mongoose = require('mongoose')

const seoTaskSchema = new mongoose.Schema(
  {
    id: { type: Number, index: true },
    title: { type: String, required: true },
    description: { type: String, default: null },
    category: { type: String, default: 'onpage', index: true },
    priority: { type: String, default: 'medium', index: true },
    status: { type: String, default: 'pending', index: true },
    assigned_to: { type: String, default: 'Admin' },
    due_date: { type: Date, default: null },
    completed_at: { type: Date, default: null },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

module.exports = mongoose.models.SeoTask || mongoose.model('SeoTask', seoTaskSchema)
