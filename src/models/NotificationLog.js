const mongoose = require('mongoose')

const notificationLogSchema = new mongoose.Schema(
  {
    id: { type: Number, index: true },
    idempotency_key: { type: String, unique: true, index: true },
    event_type: {
      type: String,
      required: true,
      enum: [
        'quote_received',
        'quote_prepared',
        'order_confirmed',
        'proof_ready',
        'artwork_approved',
        'production_milestone',
        'order_dispatched',
        'order_delivered',
        'contact_inquiry',
        'corporate_inquiry',
      ],
      index: true,
    },
    recipient_email: { type: String, required: true, lowercase: true, trim: true },
    recipient_phone: { type: String, default: null },
    recipient_name: { type: String, default: null },
    reference_number: { type: String, default: null, index: true },
    channel: {
      type: String,
      enum: ['email', 'whatsapp', 'system_log'],
      default: 'email',
    },
    subject: { type: String, default: null },
    payload_summary: { type: mongoose.Schema.Types.Mixed, default: {} },
    status: {
      type: String,
      enum: ['sent', 'delivered', 'failed', 'skipped'],
      default: 'sent',
      index: true,
    },
    provider_message_id: { type: String, default: null },
    error_message: { type: String, default: null },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

module.exports =
  mongoose.models.NotificationLog || mongoose.model('NotificationLog', notificationLogSchema)
