const mongoose = require('mongoose')

const corporateItemSchema = new mongoose.Schema(
  {
    product_name: { type: String, required: true },
    quantity: { type: Number, required: true },
    specifications: { type: String, default: null },
    estimated_frequency: { type: String, default: 'One-off' },
  },
  { _id: false }
)

const corporateQuoteSchema = new mongoose.Schema(
  {
    id: { type: Number, index: true },
    reference_number: { type: String, required: true, unique: true, trim: true },
    company_name: { type: String, required: true, trim: true },
    contact_name: { type: String, required: true, trim: true },
    department: { type: String, default: null },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true },
    trade_license_number: { type: String, default: null },
    trn_number: { type: String, default: null },
    annual_volume_estimate: { type: String, default: null },
    credit_terms_requested: {
      type: String,
      enum: ['Prepaid', '30-day invoice', '30 Days Net', '60 Days Net', 'PDC', 'Custom Contract'],
      default: 'Prepaid',
    },

    delivery_locations: [{ type: String }],
    items: { type: [corporateItemSchema], default: [] },
    notes: { type: String, default: null },
    artwork_files: [{ type: String }],
    status: {
      type: String,
      enum: [
        'New',
        'Under Review',
        'Assigned to Account Manager',
        'Quote Prepared',
        'Proposal Sent',
        'Contract Approved',
        'Declined',
      ],
      default: 'New',
      index: true,
    },
    assigned_account_manager: { type: String, default: 'Senior Corporate Desk' },
    staff_notes: { type: String, default: null },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

module.exports =
  mongoose.models.CorporateQuote || mongoose.model('CorporateQuote', corporateQuoteSchema)
