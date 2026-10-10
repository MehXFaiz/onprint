const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    id: { type: Number, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password_hash: { type: String, required: true },
    phone: { type: String, default: null },
    role: { type: String, default: 'customer', enum: ['customer', 'admin', 'administrator'] },
    status: { type: String, default: 'active', enum: ['active', 'inactive'] },
    last_login_at: { type: Date, default: null },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

module.exports = mongoose.models.User || mongoose.model('User', userSchema)
