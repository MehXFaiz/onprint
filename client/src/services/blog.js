import api from './api'
import { DEFAULT_BLOG_GUIDES } from '../data/defaultBlogGuides'

export { DEFAULT_BLOG_GUIDES }

/**
 * Fetch public published blog posts with pagination, search, and category/product filters
 */
export async function getPublicBlogs(params = {}) {
  try {
    const { data } = await api.get('/blogs', { params })
    if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
      return data
    }
  } catch {
    // Fallback if API server is offline or database empty
  }

  let filtered = [...DEFAULT_BLOG_GUIDES]
  if (params.category && params.category !== 'All') {
    filtered = filtered.filter((b) => b.category.toLowerCase().includes(params.category.toLowerCase()))
  }
  if (params.search) {
    const q = params.search.toLowerCase()
    filtered = filtered.filter((b) => b.title.toLowerCase().includes(q) || b.excerpt.toLowerCase().includes(q))
  }

  return {
    success: true,
    data: filtered,
    pagination: {
      page: params.page || 1,
      limit: params.limit || 12,
      total: filtered.length,
      totalPages: 1,
    },
  }
}

/**
 * Fetch a single blog post by slug (includes related blogs, related product, and category)
 */
export async function getPublicBlogBySlug(slug) {
  try {
    const { data } = await api.get(`/blogs/${slug}`)
    if (data?.data) {
      return data.data
    }
  } catch {
    // Fallback if API server is offline
  }

  const found = DEFAULT_BLOG_GUIDES.find((b) => b.slug === slug)
  if (found) {
    return {
      ...found,
      relatedBlogs: DEFAULT_BLOG_GUIDES.filter((b) => b.slug !== slug).slice(0, 3),
    }
  }
  return null
}

/**
 * Fetch a single blog post for Admin by ID or slug
 */
export async function getAdminBlogById(id) {
  const { data } = await api.get(`/blogs/${id}`)
  return data?.data
}

/**
 * Fetch all blogs for Admin dashboard with statistics and filters
 */
export async function getAdminBlogs(params = {}) {
  const { data } = await api.get('/blogs/admin', { params })
  return data
}

/**
 * Fetch blog dashboard KPI statistics
 */
export async function getBlogStats() {
  const { data } = await api.get('/blogs/stats')
  return data?.data
}

/**
 * Create a new blog post (Admin)
 */
export async function createBlog(payload) {
  const { data } = await api.post('/blogs', payload)
  return data
}

/**
 * Update an existing blog post (Admin)
 */
export async function updateBlog(id, payload) {
  const { data } = await api.put(`/blogs/${id}`, payload)
  return data
}

/**
 * Delete a single blog post (Admin)
 */
export async function deleteBlog(id) {
  const { data } = await api.delete(`/blogs/${id}`)
  return data
}

/**
 * Bulk delete blog posts (Admin)
 */
export async function bulkDeleteBlogs(blogIds) {
  const { data } = await api.post('/blogs/bulk-delete', { blogIds })
  return data
}

/**
 * Publish blog (Admin)
 */
export async function publishBlog(id) {
  const { data } = await api.patch(`/blogs/${id}/publish`)
  return data
}

/**
 * Unpublish blog / Save as Draft (Admin)
 */
export async function unpublishBlog(id) {
  const { data } = await api.patch(`/blogs/${id}/unpublish`)
  return data
}

/**
 * Toggle featured state (Admin)
 */
export async function toggleFeaturedBlog(id) {
  const { data } = await api.patch(`/blogs/${id}/featured`)
  return data
}

/**
 * AI Content and SEO Generator (Admin)
 */
export async function generateBlogContent(payload) {
  const { data } = await api.post('/blogs/generate-content', payload)
  return data?.data
}

/**
 * AI Image Generator & Matcher (Admin)
 */
export async function generateBlogImage(payload) {
  const { data } = await api.post('/blogs/generate-image', payload)
  return data?.data
}

/**
 * AI-powered Blog SEO Generator (Admin)
 * Generates meta title, meta description, focus keyword, secondary keywords,
 * slug, canonical, og tags, structured data, and FAQs.
 */
export async function generateBlogSeo(payload, id = null) {
  const url = id ? `/blogs/${id}/generate-seo` : '/blogs/generate-seo'
  const { data } = await api.post(url, payload)
  return data?.data || data
}

/**
 * Real-time Blog SEO Analysis (Admin)
 * Evaluates 16 on-page & technical factors and returns 0-100 score + checklist + recommendations.
 */
export async function analyzeBlogSeo(payload, id = null) {
  const url = id ? `/blogs/${id}/analyze-seo` : '/blogs/analyze-seo'
  const { data } = await api.post(url, payload)
  return data?.data || data
}

/**
 * Fetch Blog SEO Dashboard Metrics & Opportunities (Admin)
 */
export async function getBlogSeoMetrics() {
  const { data } = await api.get('/blogs/seo-metrics')
  return data?.data || data
}

// Backwards-compatible aliases
export const getBlogPosts = async (params = {}) => {
  const res = await getPublicBlogs(params)
  return res?.data || []
}
export const getBlogPostBySlug = getPublicBlogBySlug
export const createBlogPost = createBlog
export const updateBlogPost = updateBlog
export const deleteBlogPost = deleteBlog
