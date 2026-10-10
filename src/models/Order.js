const mongoose = require('mongoose')

const orderItemSchema = new mongoose.Schema(
  {
    product_id: { type: Number, default: null },
    product_name: { type: String, default: 'Custom Item' },
    quantity: { type: Number, default: 1 },
    unit_price: { type: Number, default: 0.0 },
    subtotal: { type: Number, default: 0.0 },
  },
  { _id: false }
)

const orderSchema = new mongoose.Schema(
  {
    id: { type: Number, index: true },
    order_number: { type: String, required: true, unique: true, trim: true },
    user_id: { type: Number, default: null, index: true },
    customer_name: { type: String, required: true, trim: true },
    customer_email: { type: String, required: true, lowercase: true, trim: true },
    customer_phone: { type: String, default: null },
    company: { type: String, default: null },
    shipping_address: { type: String, default: null },
    status: { type: String, default: 'Pending', index: true },
    payment_status: { type: String, default: 'unpaid', index: true },
    total_amount: { type: Number, default: 0.0 },
    subtotal: { type: Number, default: 0.0 },
    tax: { type: Number, default: 0.0 },
    shipping: { type: Number, default: 0.0 },
    total_price: { type: Number, default: 0.0 },
    currency: { type: String, default: 'AED' },
    notes: { type: String, default: null },
    specs: { type: String, default: null },
    artwork_file: { type: String, default: null },
    items: { type: [orderItemSchema], default: [] },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema)
