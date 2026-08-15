const path = require('path')
const fs = require('fs')
const express = require('express')
const multer = require('multer')
const ApiError = require('../utils/ApiError')

const router = express.Router()

// Ensure /uploads directory exists
const UPLOADS_DIR = path.join(__dirname, '..', '..', 'uploads')
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true })
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

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR)
  },
  filename: (req, file, cb) => {
    const filename = slugifyFilename(file.originalname)
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

// Configure Multer Middleware (5MB File Size Limit)
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
})

// Helper middleware for custom Multer error handling
function handleMulterUpload(uploadMiddleware) {
  return (req, res, next) => {
    uploadMiddleware(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(new ApiError(400, 'File size exceeds maximum allowed limit of 5MB.'))
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
  handleMulterUpload(upload.single('file')),
  async (req, res, next) => {
    try {
      if (!req.file) {
        throw new ApiError(400, 'Please select an image file to upload.')
      }

      const relativeUrl = `/uploads/${req.file.filename}`
      console.log(`[Upload] Single image uploaded successfully: ${relativeUrl}`)

      res.status(201).json({
        success: true,
        message: 'Image uploaded successfully',
        url: relativeUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
      })
    } catch (err) {
      next(err)
    }
  }
)

// Multiple Image Upload Endpoint (Up to 10 files)
router.post(
  '/images',
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

module.exports = router
