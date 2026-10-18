const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema(
  {
    id: { type: Number, index: true },
    product_id: { type: Number, default: null, index: true },
    product_slug: { type: String, default: null, index: true },
    product_name: { type: String, default: 'General Commercial Print' },
    customer_name: { type: String, required: true, trim: true },
    company: { type: String, default: null },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true, trim: true },
    comment: { type: String, required: true, trim: true },
    verified_purchase: { type: Boolean, default: false },
    order_number: { type: String, default: null },
    status: {
      type: String,
      enum: ['pending', 'approved', 'flagged', 'rejected'],
      default: 'approved',
      index: true,
    },
    helpful_votes: { type: Number, default: 0 },
    staff_response: {
      type: new mongoose.Schema(
        {
          response: { type: String, default: null },
          responder_name: { type: String, default: 'ONPRINT Production Team' },
          responded_at: { type: Date, default: null },
        },
        { _id: false }
      ),
      default: null,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

module.exports = mongoose.models.Review || mongoose.model('Review', reviewSchema)
