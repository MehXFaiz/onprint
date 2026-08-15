import api from './api'

export async function getCategories(params = {}) {
  const { data } = await api.get('/categories', { params })
  return data?.data || []
}

export async function getCategoryById(id) {
  const { data } = await api.get(`/categories/${id}`)
  return data?.data
}

export async function createCategory(categoryData) {
  const { data } = await api.post('/categories', categoryData)
  return data
}

export async function updateCategory(id, categoryData) {
  const { data } = await api.put(`/categories/${id}`, categoryData)
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
