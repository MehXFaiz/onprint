const mongoose = require('mongoose')

const newsletterSubscriberSchema = new mongoose.Schema(
  {
    id: { type: Number, index: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    status: { type: String, default: 'subscribed', index: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

module.exports = mongoose.models.NewsletterSubscriber || mongoose.model('NewsletterSubscriber', newsletterSubscriberSchema)
