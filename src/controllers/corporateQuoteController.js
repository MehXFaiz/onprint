const { CorporateQuote } = require('../models')
const persistentStore = require('../data/persistentStore')
const ApiError = require('../utils/ApiError')
const { notifyCorporateQuote } = require('../utils/notificationService')

async function createCorporateQuote(req, res, next) {
  try {
    const {
      companyName,
      contactName,
      department,
      email,
      phone,
      tradeLicenseNumber,
      trnNumber,
      annualVolumeEstimate,
      creditTermsRequested,
      deliveryLocations,
      items,
      notes,
      artworkFiles,
    } = req.body

    if (!companyName || !contactName || !email || !phone) {
      throw new ApiError(400, 'Company name, contact person name, email, and phone number are required.')
    }

    const randomSeq = Math.floor(100000 + Math.random() * 900000)
    const referenceNumber = req.body.referenceNumber || `ONP-CORP-${randomSeq}`

    // 1. Persist to store
    const localEntry = persistentStore.addCorporateQuote({
      referenceNumber,
      companyName: companyName.trim(),
      contactName: contactName.trim(),
      department: department ? department.trim() : null,
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      tradeLicenseNumber: tradeLicenseNumber ? tradeLicenseNumber.trim() : null,
      trnNumber: trnNumber ? trnNumber.trim() : null,
      annualVolumeEstimate: annualVolumeEstimate || 'Not specified',
      creditTermsRequested: creditTermsRequested || 'Prepaid',
      deliveryLocations: Array.isArray(deliveryLocations) ? deliveryLocations : [deliveryLocations || 'Dubai'],
      items: Array.isArray(items) ? items : [],
      notes: notes ? notes.trim() : null,
      artworkFiles: Array.isArray(artworkFiles) ? artworkFiles : [],
      status: 'New',
      assignedAccountManager: 'Senior Corporate Account Executive',
    })

    // 2. Persist to MongoDB if connected
    try {
      if (CorporateQuote) {
        await CorporateQuote.create({
          reference_number: referenceNumber,
          company_name: companyName.trim(),
          contact_name: contactName.trim(),
          department: department ? department.trim() : null,
          email: email.toLowerCase().trim(),
          phone: phone.trim(),
          trade_license_number: tradeLicenseNumber ? tradeLicenseNumber.trim() : null,
          trn_number: trnNumber ? trnNumber.trim() : null,
          annual_volume_estimate: annualVolumeEstimate || null,
          credit_terms_requested: creditTermsRequested || 'Prepaid',
          delivery_locations: Array.isArray(deliveryLocations) ? deliveryLocations : [deliveryLocations || 'Dubai'],
          items: Array.isArray(items)
            ? items.map((i) => ({
                product_name: i.product_name || i.productName || 'Print Product',
                quantity: i.quantity || 1,
                specifications: i.specifications || i.specs || null,
              }))
            : [],
          notes: notes ? notes.trim() : null,
          artwork_files: Array.isArray(artworkFiles) ? artworkFiles : [],
          status: 'New',
          assigned_account_manager: 'Senior Corporate Account Executive',
        })
      }
    } catch (dbErr) {
      console.warn('[CorporateQuote Controller] MongoDB create note:', dbErr.message)
    }

    // 3. Trigger internal and customer notifications
    if (typeof notifyCorporateQuote === 'function') {
      notifyCorporateQuote({
        referenceNumber,
        companyName,
        contactName,
        department,
        email,
        phone,
        tradeLicenseNumber,
        trnNumber,
        annualVolumeEstimate,
        creditTermsRequested,
        items,
      }).catch(() => {})
    }

    try {
      const { sendNotification } = require('../services/notificationService')
      sendNotification({
        eventType: 'corporate_inquiry',
        recipientEmail: email,
        recipientPhone: phone,
        recipientName: contactName,
        referenceNumber,
        payload: {
          companyName,
          itemsCount: items.length,
          creditTerms: creditTermsRequested,
        },
      }).catch(() => {})
    } catch (notifErr) {
      console.warn('[CorporateQuote Controller] Notification warning:', notifErr.message)
    }


    res.status(201).json({
      success: true,
      message: 'Corporate procurement enquiry submitted successfully. Your dedicated account executive will contact you within 4 business hours.',
      data: {
        id: localEntry.id,
        referenceNumber,
        status: 'New',
        assignedAccountManager: 'Senior Corporate Account Executive',
      },
    })
  } catch (err) {
    next(err)
  }
}

async function listCorporateQuotes(req, res, next) {
  try {
    let quotes = []
    try {
      if (CorporateQuote) {
        const docs = await CorporateQuote.find({}).sort({ created_at: -1 }).lean()
        if (docs.length > 0) {
          quotes = docs.map((d) => ({
            id: d.id || d._id,
            referenceNumber: d.reference_number,
            companyName: d.company_name,
            contactName: d.contact_name,
            department: d.department,
            email: d.email,
            phone: d.phone,
            tradeLicenseNumber: d.trade_license_number,
            trnNumber: d.trn_number,
            annualVolumeEstimate: d.annual_volume_estimate,
            creditTermsRequested: d.credit_terms_requested,
            deliveryLocations: d.delivery_locations,
            items: d.items,
            notes: d.notes,
            status: d.status,
            assignedAccountManager: d.assigned_account_manager,
            staffNotes: d.staff_notes,
            createdAt: d.created_at,
          }))
        }
      }
    } catch {
      // fallback
    }

    if (quotes.length === 0) {
      quotes = persistentStore.getCorporateQuotes()
    }

    res.json({ success: true, data: quotes })
  } catch (err) {
    next(err)
  }
}

async function getCorporateQuoteById(req, res, next) {
  try {
    const { id } = req.params
    let item = null
    try {
      if (CorporateQuote) {
        const found = await CorporateQuote.findOne({
          $or: [{ reference_number: id }, { _id: id }],
        }).lean()
        if (found) {
          item = {
            id: found.id || found._id,
            referenceNumber: found.reference_number,
            companyName: found.company_name,
            contactName: found.contact_name,
            department: found.department,
            email: found.email,
            phone: found.phone,
            tradeLicenseNumber: found.trade_license_number,
            trnNumber: found.trn_number,
            annualVolumeEstimate: found.annual_volume_estimate,
            creditTermsRequested: found.credit_terms_requested,
            deliveryLocations: found.delivery_locations,
            items: found.items,
            notes: found.notes,
            status: found.status,
            assignedAccountManager: found.assigned_account_manager,
            staffNotes: found.staff_notes,
            createdAt: found.created_at,
          }
        }
      }
    } catch {
      // fallback
    }

    if (!item) {
      item = persistentStore.getCorporateQuote(id)
    }

    if (!item) {
      throw new ApiError(404, 'Corporate quote enquiry not found')
    }

    res.json({ success: true, data: item })
  } catch (err) {
    next(err)
  }
}

async function updateCorporateQuoteStatus(req, res, next) {
  try {
    const { id } = req.params
    const { status, staffNotes } = req.body
    if (!status) throw new ApiError(400, 'Status is required')

    persistentStore.updateCorporateQuoteStatus(id, status, staffNotes)

    try {
      if (CorporateQuote) {
        await CorporateQuote.updateOne(
          { $or: [{ reference_number: id }, { _id: id }] },
          { $set: { status, staff_notes: staffNotes, updated_at: new Date() } }
        )
      }
    } catch {
      // fallback
    }

    res.json({
      success: true,
      message: `Corporate enquiry status updated to ${status}`,
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  createCorporateQuote,
  listCorporateQuotes,
  getCorporateQuoteById,
  updateCorporateQuoteStatus,
}
