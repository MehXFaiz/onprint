const mongoose = require('mongoose')

const quoteItemSchema = new mongoose.Schema(
  {
    product_id: { type: Number, default: null },
    product_name: { type: String, default: 'Custom Print Job' },
    quantity: { type: Number, default: 1 },
    unit_price: { type: Number, default: 0.0 },
    subtotal: { type: Number, default: 0.0 },
    options: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  { _id: false }
)

const quoteSchema = new mongoose.Schema(
  {
    id: { type: Number, index: true },
    quote_number: { type: String, required: true, unique: true, trim: true },
    order_number: { type: String, trim: true },
    user_id: { type: Number, default: null, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, default: null },
    company: { type: String, default: null },
    notes: { type: String, default: null },
    specs: { type: String, default: null },
    artwork_file: { type: String, default: null },
    product_name: { type: String, default: null },
    quantity: { type: Number, default: 1 },
    total_price: { type: Number, default: 0.0 },
    status: { type: String, default: 'Pending', index: true },
    items: { type: [quoteItemSchema], default: [] },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

module.exports = mongoose.models.Quote || mongoose.model('Quote', quoteSchema)
