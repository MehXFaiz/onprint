import api from './api'

/**
 * SEO Management API Client
 */

export async function getSeoDashboard() {
  const { data } = await api.get('/seo/dashboard')
  return data
}

export async function getSeoAudit() {
  const { data } = await api.get('/seo/audit-details')
  return data
}

export async function triggerSeoAudit() {
  const { data } = await api.post('/seo/audit-trigger')
  return data
}

export async function getSeoRecommendations(params = {}) {
  const { data } = await api.get('/seo/recommendations', { params })
  return data
}

export async function triggerAiAnalysis(options = {}) {
  const { data } = await api.post('/seo/recommendations/analyze', options)
  return data
}

export async function approveRecommendation(id, notes = '') {
  const { data } = await api.post(`/seo/recommendations/${id}/approve`, { notes })
  return data
}

export async function rejectRecommendation(id, notes = '') {
  const { data } = await api.post(`/seo/recommendations/${id}/reject`, { notes })
  return data
}

export async function applyRecommendation(id) {
  const { data } = await api.post(`/seo/recommendations/${id}/apply`)
  return data
}

export async function bulkApplyRecommendations() {
  const { data } = await api.post('/seo/recommendations/bulk-apply')
  return data
}

export async function getSeoHistory(params = {}) {
  const { data } = await api.get('/seo/history', { params })
  return data
}

export async function rollbackSeoChange(id) {
  const { data } = await api.post(`/seo/history/${id}/rollback`)
  return data
}

export async function getDailyReports(params = {}) {
  const { data } = await api.get('/seo/reports', { params })
  return data
}

export async function getDailyReportByDate(date) {
  const { data } = await api.get(`/seo/reports/${date}`)
  return data
}

export async function getSeoKeywords() {
  const { data } = await api.get('/seo/keywords')
  return data
}

export async function getSeoPages() {
  const { data } = await api.get('/seo/pages')
  return data
}

export async function getSearchConsoleStatus() {
  const { data } = await api.get('/seo/search-console/status')
  return data
}

export async function connectSearchConsole(credentials) {
  const { data } = await api.post('/seo/search-console/connect', credentials)
  return data
}

export async function syncSearchConsole() {
  const { data } = await api.post('/seo/search-console/sync')
  return data
}

export async function getSeoSettings() {
  const { data } = await api.get('/seo/settings')
  return data
}

export async function updateSeoSettings(settings) {
  const { data } = await api.put('/seo/settings', settings)
  return data
}

export async function runDailySeo(options = {}) {
  const { data } = await api.post('/seo/run-daily', options)
  return data
}

export async function getSeoLogs(params = {}) {
  const { data } = await api.get('/seo/logs', { params })
  return data
}

export async function getSeoOpportunities() {
  const { data } = await api.get('/seo/opportunities')
  return data
}

export async function getInternalLinks() {
  const { data } = await api.get('/seo/internal-links')
  return data
}

export async function getCompetitorAnalysis() {
  const { data } = await api.get('/seo/competitor-analysis')
  return data
}

export async function getImageAudit() {
  const { data } = await api.get('/seo/image-audit')
  return data
}

export async function updateImageAlt(payload) {
  const { data } = await api.post('/seo/image-update', payload)
  return data
}

export async function getSafetyQueue() {
  const { data } = await api.get('/seo/safety-queue')
  return data
}

export async function validateSeoChange(change) {
  const { data } = await api.post('/seo/validate-change', change)
  return data
}

export async function getProgrammaticPages() {
  const { data } = await api.get('/seo/landing-pages')
  return data
}

export async function getProgrammaticPage(slug, type) {
  const { data } = await api.get(`/seo/landing-pages/${slug}`, { params: { type } })
  return data
}

