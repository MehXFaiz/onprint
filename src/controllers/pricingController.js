const initialData = require('../data/initialData')
const { pool } = require('../config/database')

// Volume Discount Tier Rules
const VOLUME_TIERS = [
  { minQuantity: 5000, discountPct: 35, label: '35% Bulk Tier Discount' },
  { minQuantity: 2500, discountPct: 25, label: '25% Volume Tier Discount' },
  { minQuantity: 1000, discountPct: 20, label: '20% Trade Tier Discount' },
  { minQuantity: 500, discountPct: 12, label: '12% Studio Tier Discount' },
  { minQuantity: 250, discountPct: 6, label: '6% Small Batch Discount' },
  { minQuantity: 0, discountPct: 0, label: 'Standard Rate' },
]

// Standard Finishes Reference Pricing (AED)
const FINISH_RATES = {
  foil_gold: { label: '24K Gold Foil Stamping', setupCost: 65, perUnit: 0.12 },
  foil_silver: { label: 'Silver Holographic Foil', setupCost: 65, perUnit: 0.12 },
  foil_rose_gold: { label: 'Rose Gold Foil', setupCost: 70, perUnit: 0.14 },
  raised_uv: { label: 'Raised 3D Spot UV (Scodix)', setupCost: 55, perUnit: 0.10 },
  emboss: { label: 'Blind Letterpress Debossing / Embossing', setupCost: 75, perUnit: 0.08 },
  painted_edges: { label: 'Painted / Gilded Edges', setupCost: 80, perUnit: 0.15 },
  die_cut: { label: 'Custom Precision Die-Cutting', setupCost: 60, perUnit: 0.05 },
  velvet_lam: { label: 'Soft-Touch Velvet Lamination', setupCost: 35, perUnit: 0.05 },
  matte_lam: { label: 'Anti-Scratch Matte Lamination', setupCost: 20, perUnit: 0.03 },
}

/**
 * Server-authoritative Price Calculation Engine
 * POST /api/pricing/calculate
 */
async function calculatePrice(req, res) {
  try {
    const {
      productSlug,
      productId,
      quantity = 100,
      size,
      material,
      finish,
      finishes = [],
      deliveryUrgency = 'standard',
    } = req.body

    const qty = Math.max(1, parseInt(quantity, 10) || 100)

    // 1. Locate product definition
    let product = null
    try {
      if (productId) {
        const [rows] = await pool.query('SELECT * FROM products WHERE id = ? LIMIT 1', [productId])
        if (rows && rows.length > 0) product = rows[0]
      }
      if (!product && productSlug) {
        const [rows] = await pool.query('SELECT * FROM products WHERE slug = ? LIMIT 1', [productSlug])
        if (rows && rows.length > 0) product = rows[0]
      }
    } catch {
      // DB offline fallback
    }

    if (!product) {
      product = (initialData.products || []).find(
        (p) => (productSlug && p.slug === productSlug) || (productId && (p.id === productId || p._id === productId))
      )
    }

    const baseBatchPrice = product?.price ? Number(product.price) : 50.00
    const minQty = product?.minimumQuantity ? Number(product.minimumQuantity) : 100
    const rawUnitBase = baseBatchPrice / (minQty || 1)

    // 2. Volume Discount
    const activeTier = VOLUME_TIERS.find((t) => qty >= t.minQuantity) || VOLUME_TIERS[VOLUME_TIERS.length - 1]
    const discountMultiplier = 1 - activeTier.discountPct / 100

    // 3. Option Modifiers
    const sizeMod = Number(size?.priceModifier || 0)
    const matMod = Number(material?.priceModifier || 0)
    const singleFinishMod = Number(finish?.priceModifier || 0)

    // Multi-finish calculation if array passed
    let multiFinishCost = 0
    if (Array.isArray(finishes) && finishes.length > 0) {
      for (const fKey of finishes) {
        const rate = FINISH_RATES[fKey]
        if (rate) {
          multiFinishCost += rate.setupCost + rate.perUnit * qty
        }
      }
    }

    // Base production calculation
    const unitWithStock = (rawUnitBase * discountMultiplier) + (sizeMod / (minQty || 100)) + (matMod / (minQty || 100))
    let subtotal = (unitWithStock * qty) + singleFinishMod + multiFinishCost

    // Ensure price never falls below bare minimum threshold
    subtotal = Math.max(subtotal, 40)

    // 4. Delivery Urgency fee
    let urgencyFee = 0
    if (deliveryUrgency === 'sameday_rush') {
      urgencyFee = 150
    } else if (deliveryUrgency === 'express_24h') {
      urgencyFee = 75
    }

    const preVatTotal = Math.round((subtotal + urgencyFee) * 100) / 100
    const vatRate = 0.05 // UAE 5% VAT
    const vatAmount = Math.round(preVatTotal * vatRate * 100) / 100
    const totalAmount = Math.round((preVatTotal + vatAmount) * 100) / 100
    const unitPrice = Math.round((preVatTotal / qty) * 100) / 100

    return res.status(200).json({
      success: true,
      data: {
        quantity: qty,
        unitPrice,
        baseSubtotal: Math.round(subtotal * 100) / 100,
        urgencyFee,
        deliveryUrgency,
        volumeTier: {
          minQuantity: activeTier.minQuantity,
          discountPercentage: activeTier.discountPct,
          label: activeTier.label,
        },
        vatRate: '5%',
        vatAmount,
        totalAmount,
        currency: 'AED',
        breakdownText: `AED ${unitPrice.toFixed(2)}/unit + 5% UAE VAT (AED ${vatAmount.toFixed(2)}) = AED ${totalAmount.toFixed(2)} Total`,
      },
    })
  } catch (error) {
    console.error('[Pricing] Calculation error:', error)
    return res.status(500).json({
      success: false,
      error: 'Unable to calculate price at this moment',
      details: error.message,
    })
  }
}

/**
 * Get available volume tiers and finishes pricing table
 * GET /api/pricing/tiers
 */
function getPricingTiers(_req, res) {
  return res.status(200).json({
    success: true,
    data: {
      volumeTiers: VOLUME_TIERS,
      finishRates: FINISH_RATES,
      vatRate: 0.05,
      currency: 'AED',
    },
  })
}

module.exports = {
  calculatePrice,
  getPricingTiers,
  VOLUME_TIERS,
  FINISH_RATES,
}
