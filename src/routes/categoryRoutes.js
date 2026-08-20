const path = require('path')
const fs = require('fs')
const express = require('express')
const multer = require('multer')
const {
  listCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  updateCategoryStatus,
  deleteCategory,
  uploadCategoryImage,
} = require('../controllers/categoryController')
const { authenticateToken, requireAdmin } = require('../middleware/auth')
const ApiError = require('../utils/ApiError')

const router = express.Router()

// Ensure /uploads/categories directory exists
const UPLOADS_DIR = path.join(__dirname, '..', '..', 'uploads', 'categories')
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true })
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    const nameWithoutExt = path.basename(file.originalname, ext)
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '') || 'category'

    cb(null, `${nameWithoutExt}-${Date.now()}${ext}`)
  },
})

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

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
})

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

router.get('/', listCategories)
router.get('/:id', getCategoryById)
router.post('/', authenticateToken, requireAdmin, createCategory)
router.put('/:id', authenticateToken, requireAdmin, updateCategory)
router.patch('/:id/status', authenticateToken, requireAdmin, updateCategoryStatus)
router.delete('/:id', authenticateToken, requireAdmin, deleteCategory)
router.post('/:id/image', authenticateToken, requireAdmin, handleMulterUpload(upload.single('file')), uploadCategoryImage)

module.exports = router
