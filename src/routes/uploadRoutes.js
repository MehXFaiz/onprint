const path = require('path')
const fs = require('fs')
const express = require('express')
const multer = require('multer')
const ApiError = require('../utils/ApiError')
const { authenticateToken, requireAdmin } = require('../middleware/auth')

const router = express.Router()

// Ensure /uploads and /uploads/artwork directories exist
const UPLOADS_DIR = path.join(__dirname, '..', '..', 'uploads')
const ARTWORK_DIR = path.join(UPLOADS_DIR, 'artwork')
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true })
}
if (!fs.existsSync(ARTWORK_DIR)) {
  fs.mkdirSync(ARTWORK_DIR, { recursive: true })
}

// Slugify filename for SEO friendly URL generation
function slugifyFilename(originalName) {
  const ext = path.extname(originalName).toLowerCase()
  const nameWithoutExt = path.basename(originalName, ext)
  const cleanName = nameWithoutExt
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '') || 'image'

  return `${cleanName}-${Date.now()}${ext}`
}

// Secure artwork filename generator
function secureArtworkFilename(originalName) {
  const ext = path.extname(originalName).toLowerCase()
  const cleanBase = path.basename(originalName, ext)
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '_')
    .slice(0, 30)
  const randomSuffix = Math.random().toString(36).substring(2, 8)
  return `onprint-art-${cleanBase || 'file'}-${Date.now()}-${randomSuffix}${ext}`
}

// Multer Storage Configuration for Catalog/CMS Images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR)
  },
  filename: (req, file, cb) => {
    const filename = slugifyFilename(file.originalname)
    cb(null, filename)
  },
})

// Multer Storage Configuration for Customer Artwork
const artworkStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, ARTWORK_DIR)
  },
  filename: (req, file, cb) => {
    const filename = secureArtworkFilename(file.originalname)
    cb(null, filename)
  },
})

// File Filter (MIME Type Validation)
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
]

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype.toLowerCase())) {
    cb(null, true)
  } else {
    cb(new Error('Invalid file type. Only JPG, PNG, WEBP, GIF, and SVG images are allowed.'))
  }
}

// Customer Artwork Filter: PDF, AI, EPS, PSD, TIFF, JPG, PNG, ZIP
const ALLOWED_ARTWORK_EXTS = ['.pdf', '.ai', '.eps', '.psd', '.tiff', '.tif', '.jpg', '.jpeg', '.png', '.zip']
const artworkFileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase()
  if (ALLOWED_ARTWORK_EXTS.includes(ext)) {
    cb(null, true)
  } else {
    cb(new Error(`File format ${ext} is not supported. Supported artwork formats: PDF, AI, EPS, PSD, TIFF, JPG, PNG, ZIP.`))
  }
}

// Configure Multer Middleware (5MB limit for regular images)
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
})

// Configure Multer Middleware (50MB limit for customer artwork)
const uploadArtwork = multer({
  storage: artworkStorage,
  fileFilter: artworkFileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
})

// Helper middleware for custom Multer error handling
function handleMulterUpload(uploadMiddleware, maxMb = 5) {
  return (req, res, next) => {
    uploadMiddleware(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(new ApiError(400, `File size exceeds maximum allowed limit of ${maxMb}MB. For larger artwork files, please provide a WeTransfer or Dropbox link in project notes.`))
        }
        return next(new ApiError(400, `Upload error: ${err.message}`))
      } else if (err) {
        return next(new ApiError(400, err.message))
      }
      next()
    })
  }
}

// Single Image Upload Endpoint
router.post(
  '/image',
  authenticateToken,
  requireAdmin,
  handleMulterUpload(upload.single('file')),
  async (req, res, next) => {
    try {
      if (!req.file) {
        throw new ApiError(400, 'Please select an image file to upload.')
      }

      const relativeUrl = `/uploads/${req.file.filename}`
      console.log(`[Upload] Single image uploaded successfully: ${relativeUrl}`)

      const cleanOriginal = req.file.originalname.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9]+/g, ' ').trim()
      const seoSuggestedAlt = `${cleanOriginal} commercial printing Dubai | ONPRINT`
      const seoSuggestedFilename = `${cleanOriginal.toLowerCase().replace(/\s+/g, '-')}-dubai-onprint.webp`

      res.status(201).json({
        success: true,
        message: 'Image uploaded successfully',
        url: relativeUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        seoSuggestions: {
          suggestedAlt: seoSuggestedAlt,
          suggestedFilename: seoSuggestedFilename,
          recommendedDimensions: '1200x800 px (3:2 ratio)',
          formatAdvice: req.file.mimetype === 'image/webp' ? 'Optimal WebP format' : 'Consider converting to WebP for 30% faster mobile loading',
          lazyLoadingTag: 'loading="lazy" decoding="async"',
        },
      })
    } catch (err) {
      next(err)
    }
  }
)

// Multiple Image Upload Endpoint (Up to 10 files)
router.post(
  '/images',
  authenticateToken,
  requireAdmin,
  handleMulterUpload(upload.array('files', 10)),
  async (req, res, next) => {
    try {
      if (!req.files || req.files.length === 0) {
        throw new ApiError(400, 'Please select at least one image file to upload.')
      }

      const uploadedFiles = req.files.map((file) => ({
        url: `/uploads/${file.filename}`,
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
      }))

      console.log(`[Upload] ${uploadedFiles.length} images uploaded successfully`)

      res.status(201).json({
        success: true,
        message: `${uploadedFiles.length} images uploaded successfully`,
        data: uploadedFiles,
        urls: uploadedFiles.map((f) => f.url),
      })
    } catch (err) {
      next(err)
    }
  }
)

// Customer Artwork Upload Endpoint (Supports up to 10 files, PDF/AI/EPS/PSD/TIFF/JPG/PNG/ZIP up to 50MB)
router.post(
  '/artwork',
  handleMulterUpload(uploadArtwork.array('files', 10), 50),
  async (req, res, next) => {
    try {
      if (!req.files || req.files.length === 0) {
        throw new ApiError(400, 'Please select at least one artwork file to upload.')
      }

      const uploadedFiles = req.files.map((file) => ({
        url: `/uploads/artwork/${file.filename}`,
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
      }))

      console.log(`[Upload] Customer artwork files uploaded successfully: ${uploadedFiles.map((f) => f.filename).join(', ')}`)

      res.status(201).json({
        success: true,
        message: `${uploadedFiles.length} artwork file(s) uploaded successfully`,
        data: uploadedFiles,
        urls: uploadedFiles.map((f) => f.url),
        filenames: uploadedFiles.map((f) => f.filename),
      })
    } catch (err) {
      next(err)
    }
  }
)

module.exports = router
