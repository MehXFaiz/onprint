const mongoose = require('mongoose')

const specificationOptionSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    priceModifier: { type: Number, default: 0 },
  },
  { _id: false },
)

const specificationsSchema = new mongoose.Schema(
  {
    sizes: { type: [specificationOptionSchema], default: [] },
    materials: { type: [specificationOptionSchema], default: [] },
    finishes: { type: [specificationOptionSchema], default: [] },
  },
  { _id: false },
)

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    description: { type: String, default: '' },
    shortDescription: { type: String, default: '' },
    images: { type: [String], default: [] },
    price: { type: Number, default: null }, // null → "Request a Quote" instead of a fixed price
    minimumQuantity: { type: Number, default: 1 },
    specifications: { type: specificationsSchema, default: () => ({}) },
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
)

module.exports = mongoose.model('Product', productSchema)
