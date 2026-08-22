import api from './api'

export const defaultBlogPosts = []

const BLOG_STORAGE_KEY = 'onprint_admin_blog_posts'

export function getStoredBlogPosts() {
  try {
    const saved = localStorage.getItem(BLOG_STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed)) {
        const clean = parsed.filter((p) => {
          const id = String(p._id || p.id || '')
          return !['blog-1', 'blog-2', 'blog-3', 'blog-4', '1', '2', '3', '4'].includes(id)
        })
        return clean
      }
    }
  } catch {
    // ignore
  }
  return defaultBlogPosts
}

export function saveStoredBlogPosts(posts) {
  try {
    localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(posts))
  } catch {
    // ignore
  }
}

export async function getBlogPosts(params = {}) {
  try {
    const { data } = await api.get('/blog', { params })
    if (data?.data && data.data.length > 0) return data.data
  } catch {
    // fallback
  }

  let list = getStoredBlogPosts()
  if (params.category && params.category !== 'All') {
    list = list.filter((p) => p.category.toLowerCase() === params.category.toLowerCase())
  }
  if (params.search || params.q) {
    const term = (params.search || params.q).toLowerCase()
    list = list.filter((p) => p.title.toLowerCase().includes(term) || p.excerpt.toLowerCase().includes(term))
  }
  return list
}

export async function getBlogPostBySlug(slug) {
  try {
    const { data } = await api.get(`/blog/${slug}`)
    if (data?.data) return data.data
  } catch {
    // fallback
  }

  const all = getStoredBlogPosts()
  const found = all.find((p) => p.slug === slug || String(p.id) === slug || p._id === slug)
  if (found) {
    const related = all.filter((p) => p.slug !== found.slug).slice(0, 3)
    return { ...found, related }
  }
  throw new Error('Blog article not found')
}

export async function createBlogPost(payload) {
  try {
    const { data } = await api.post('/blog', payload)
    return data
  } catch (err) {
    if (err.message === 'Network Error' || !err.response) {
      const all = getStoredBlogPosts()
      const newPost = {
        _id: `blog-${Date.now()}`,
        id: Date.now(),
        ...payload,
        publishedAt: new Date().toISOString(),
        active: true,
      }
      saveStoredBlogPosts([newPost, ...all])
      return { success: true, data: newPost }
    }
    throw err
  }
}

export async function updateBlogPost(id, payload) {
  try {
    const { data } = await api.put(`/blog/${id}`, payload)
    return data
  } catch (err) {
    if (err.message === 'Network Error' || !err.response) {
      const all = getStoredBlogPosts()
      const updated = all.map((p) => (String(p.id) === String(id) || p._id === id ? { ...p, ...payload } : p))
      saveStoredBlogPosts(updated)
      return { success: true, message: 'Article updated' }
    }
    throw err
  }
}

export async function deleteBlogPost(id) {
  try {
    const { data } = await api.delete(`/blog/${id}`)
    return data
  } catch (err) {
    if (err.message === 'Network Error' || !err.response) {
      const all = getStoredBlogPosts()
      const updated = all.filter((p) => String(p.id) !== String(id) && p._id !== id)
      saveStoredBlogPosts(updated)
      return { success: true, message: 'Article deleted' }
    }
    throw err
  }
}
