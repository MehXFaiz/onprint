const mongoose = require('mongoose')

const contactMessageSchema = new mongoose.Schema(
  {
    id: { type: Number, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, default: null },
    company: { type: String, default: null },
    subject: { type: String, default: 'Direct Studio Inquiry' },
    message: { type: String, required: true, trim: true },
    status: { type: String, default: 'unread', enum: ['unread', 'read', 'replied'], index: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

module.exports = mongoose.models.ContactMessage || mongoose.model('ContactMessage', contactMessageSchema)
