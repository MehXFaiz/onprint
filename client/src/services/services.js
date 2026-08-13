import api from './api'

export async function getServices() {
  const { data } = await api.get('/services')
  return data.data
}

export async function getServiceBySlug(slug) {
  const { data } = await api.get(`/services/${slug}`)
  return data.data
}
