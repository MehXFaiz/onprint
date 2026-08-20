import api from './api'

export async function getCategories(params = {}) {
  const { data } = await api.get('/categories', { params })
  return data?.data || []
}

export async function getCategoryById(id) {
  const { data } = await api.get(`/categories/${id}`)
  return data?.data || null
}

export async function createCategory(categoryData) {
  const payload = {
    name: categoryData.name,
    slug: categoryData.slug,
    description: categoryData.description || '',
    image: categoryData.image || categoryData.image_url || '',
    image_url: categoryData.image_url || categoryData.image || '',
    status: categoryData.status || 'active',
    display_order: Number(categoryData.display_order ?? categoryData.displayOrder ?? 0),
    displayOrder: Number(categoryData.display_order ?? categoryData.displayOrder ?? 0),
    seo_title: categoryData.seo_title || categoryData.seoTitle,
    seo_description: categoryData.seo_description || categoryData.seoDescription,
    seo_keywords: categoryData.seo_keywords || categoryData.seoKeywords,
    seo_heading: categoryData.seo_heading || categoryData.seoHeading,
    image_alt: categoryData.image_alt || categoryData.imageAlt,
    canonical_url: categoryData.canonical_url || categoryData.canonicalUrl,
  }

  const { data } = await api.post('/categories', payload)
  return data
}

export async function updateCategory(id, categoryData) {
  const payload = {
    name: categoryData.name,
    slug: categoryData.slug,
    description: categoryData.description || '',
    image: categoryData.image || categoryData.image_url || '',
    image_url: categoryData.image_url || categoryData.image || '',
    status: categoryData.status || 'active',
    display_order: Number(categoryData.display_order ?? categoryData.displayOrder ?? 0),
    displayOrder: Number(categoryData.display_order ?? categoryData.displayOrder ?? 0),
    seo_title: categoryData.seo_title || categoryData.seoTitle,
    seo_description: categoryData.seo_description || categoryData.seoDescription,
    seo_keywords: categoryData.seo_keywords || categoryData.seoKeywords,
    seo_heading: categoryData.seo_heading || categoryData.seoHeading,
    image_alt: categoryData.image_alt || categoryData.imageAlt,
    canonical_url: categoryData.canonical_url || categoryData.canonicalUrl,
  }

  const { data } = await api.put(`/categories/${id}`, payload)
  return data
}

export async function updateCategoryStatus(id, status) {
  const { data } = await api.patch(`/categories/${id}/status`, { status })
  return data
}

export async function deleteCategory(id) {
  const { data } = await api.delete(`/categories/${id}`)
  return data
}

export async function uploadCategoryImage(id, file) {
  const formData = new FormData()
  formData.append('file', file)

  const { data } = await api.post(`/categories/${id}/image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return data
}

