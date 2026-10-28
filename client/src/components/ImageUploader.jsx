import { useState, useRef } from 'react'
import { UploadCloud, Image as ImageIcon, X, RefreshCw, AlertCircle, CheckCircle2, Loader2, Tag } from 'lucide-react'
import { uploadImage, uploadImages } from '../services/uploadService'

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export default function ImageUploader({
  value, // string for single, string[] or object[] for multiple
  onChange, // (value, altText) => void
  altText = '',
  onAltTextChange,
  multiple = false,
  label = 'Upload Image',
  description = 'JPG, PNG, WEBP or SVG up to 5MB',
  maxFiles = 10,
  className = '',
}) {
  const fileInputRef = useRef(null)
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)

  // Normalize single / multiple values
  const imageList = Array.isArray(value)
    ? value.map((item) => (typeof item === 'string' ? { url: item, alt: altText || '' } : item))
    : value
    ? [{ url: typeof value === 'string' ? value : value.url, alt: altText || '' }]
    : []

  const validateFile = (file) => {
    if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
      return 'Invalid file format. Only JPG, PNG, WEBP, GIF, and SVG images are allowed.'
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File "${file.name}" exceeds the maximum 5MB size limit.`
    }
    return null
  }

  const handleFiles = async (files) => {
    setError(null)
    const fileArray = Array.from(files)
    if (fileArray.length === 0) return

    // Validate files
    for (const file of fileArray) {
      const err = validateFile(file)
      if (err) {
        setError(err)
        return
      }
    }

    setUploading(true)
    setProgress(10)

    try {
      if (multiple) {
        const res = await uploadImages(fileArray, (pct) => setProgress(pct))
        const newUrls = res.urls || (res.data ? res.data.map((d) => d.url) : [])
        const updatedList = [
          ...imageList.map((i) => (typeof i === 'string' ? i : i.url)),
          ...newUrls,
        ].slice(0, maxFiles)
        onChange(updatedList)
      } else {
        const res = await uploadImage(fileArray[0], (pct) => setProgress(pct))
        onChange(res.url, altText)
      }
    } catch (err) {
      setError(err?.message || 'Failed to upload image. Please try again.')
    } finally {
      setUploading(false)
      setProgress(0)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleRemove = (indexToRemove) => {
    if (multiple) {
      const updated = imageList
        .filter((_, idx) => idx !== indexToRemove)
        .map((item) => (typeof item === 'string' ? item : item.url))
      onChange(updated)
    } else {
      onChange('', '')
    }
  }

  const getFilenameFromUrl = (url) => {
    if (!url) return ''
    if (url.startsWith('blob:')) return 'Newly Selected Image'
    return url.split('/').pop() || url
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-200">
        {label}
      </label>

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-2 rounded-2xl border border-red-500/40 bg-red-500/10 p-3.5 text-xs font-semibold text-red-300">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="ml-auto p-1 hover:bg-red-500/20 rounded-lg transition-colors"
          >
            <X className="h-3.5 w-3.5 text-red-400" />
          </button>
        </div>
      )}

      {/* Single Mode Preview Display */}
      {!multiple && imageList.length > 0 && (
        <div className="rounded-3xl border border-[#122240] bg-[#040A18] p-4 sm:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-[#122240] bg-[#081226] shadow-xs flex items-center justify-center relative group">
              <img
                src={imageList[0].url}
                alt={altText || 'Preview'}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = '/assets/products/1 (1).jpg'
                }}
              />
            </div>

            <div className="flex-1 min-w-0 text-center sm:text-left space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold text-white">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">{getFilenameFromUrl(imageList[0].url)}</span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono truncate">{imageList[0].url}</p>

              <div className="pt-2 flex items-center justify-center sm:justify-start gap-2">
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#122240] bg-[#081226] px-3 py-1.5 text-xs font-bold text-slate-200 hover:border-[#D4AF65] hover:text-[#D4AF65] transition-colors cursor-pointer"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Replace
                </button>

                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => handleRemove(0)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/40 bg-red-500/15 px-3 py-1.5 text-xs font-bold text-red-300 hover:bg-red-500/25 transition-colors cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                  Remove
                </button>
              </div>
            </div>
          </div>

          {/* SEO Alt Text Input */}
          {onAltTextChange && (
            <div className="pt-2 border-t border-[#122240]">
              <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#D4AF65] mb-1">
                <Tag className="h-3 w-3 text-[#D4AF65]" />
                SEO Image Alt Text
              </label>
              <input
                type="text"
                value={altText}
                onChange={(e) => onAltTextChange(e.target.value)}
                placeholder="Descriptive alt text for Google SEO (e.g. Mug Printing in Dubai)"
                className="w-full rounded-xl border border-[#122240] bg-[#081226] px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-[#D4AF65] focus:outline-none focus:ring-1 focus:ring-[#D4AF65]"
              />
            </div>
          )}
        </div>
      )}

      {/* Multi Mode Gallery Display */}
      {multiple && imageList.length > 0 && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {imageList.map((item, idx) => (
              <div
                key={idx}
                className="group relative rounded-2xl border border-[#122240] bg-[#040A18] p-2 shadow-xs space-y-1.5"
              >
                <div className="h-24 w-full overflow-hidden rounded-xl bg-[#081226] flex items-center justify-center relative">
                  <img
                    src={item.url}
                    alt={item.alt || `Product Image ${idx + 1}`}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = '/assets/products/1 (1).jpg'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemove(idx)}
                    className="absolute top-1 right-1 rounded-lg bg-neutral-900/80 p-1 text-white opacity-90 hover:bg-red-600 transition-colors cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="text-[10px] text-slate-400 font-mono truncate px-1">
                  {getFilenameFromUrl(item.url)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Dropzone (Show if single without image, or multiple mode) */}
      {(!multiple && imageList.length === 0) || multiple ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-6 sm:p-8 text-center transition-all cursor-pointer ${
            dragActive
              ? 'border-[#D4AF65] bg-[#D4AF65]/15 scale-[0.99]'
              : 'border-[#122240] bg-[#040A18]/60 hover:border-[#D4AF65] hover:bg-[#040A18]'
          } ${uploading ? 'opacity-70 pointer-events-none' : ''}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple={multiple}
            accept={ALLOWED_TYPES.join(',')}
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
          />

          {uploading ? (
            <div className="space-y-3 flex flex-col items-center py-2">
              <Loader2 className="h-8 w-8 animate-spin text-[#D4AF65]" />
              <div className="text-xs font-bold text-white">Uploading Image ({progress}%)...</div>
              <div className="w-48 h-1.5 bg-[#081226] rounded-full overflow-hidden border border-[#122240]">
                <div
                  className="h-full bg-[#D4AF65] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3 flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D4AF65]/15 text-[#D4AF65] border border-[#D4AF65]/30">
                <UploadCloud className="h-6 w-6" />
              </div>

              <div>
                <div className="text-xs font-bold text-white">
                  <span className="text-[#D4AF65]">Click to choose file</span> or drag & drop image here
                </div>
                <p className="text-[11px] text-slate-400 mt-1">{description}</p>
              </div>

              <div className="rounded-xl border border-[#122240] bg-[#081226] px-4 py-2 text-xs font-bold text-slate-200 shadow-xs hover:border-[#D4AF65] hover:text-[#D4AF65] transition-colors">
                Choose File
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}
