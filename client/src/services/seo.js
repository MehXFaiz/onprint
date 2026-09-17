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

export async function getKeywordTargets(params = {}) {
  const { data } = await api.get('/seo/keyword-targets', { params })
  return data
}

export async function createKeywordTarget(payload) {
  const { data } = await api.post('/seo/keyword-targets', payload)
  return data
}

export async function updateKeywordTarget(id, payload) {
  const { data } = await api.put(`/seo/keyword-targets/${id}`, payload)
  return data
}

export async function deleteKeywordTarget(id) {
  const { data } = await api.delete(`/seo/keyword-targets/${id}`)
  return data
}

export async function getBacklinks(params = {}) {
  const { data } = await api.get('/seo/backlinks', { params })
  return data
}

export async function createBacklink(payload) {
  const { data } = await api.post('/seo/backlinks', payload)
  return data
}

export async function getOutreach(params = {}) {
  const { data } = await api.get('/seo/outreach', { params })
  return data
}

export async function createOutreach(payload) {
  const { data } = await api.post('/seo/outreach', payload)
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

// ==========================================
// PAGE-BY-PAGE AI SEO SYSTEM API CLIENT
// ==========================================

export async function getPageSeoByUrl(url) {
  const { data } = await api.get('/seo/by-url', { params: { url } })
  return data
}

export async function getSeoPagesList(params = {}) {
  const { data } = await api.get('/seo/pages', { params })
  return data
}

export async function getPageSeoDetail(id) {
  const { data } = await api.get(`/seo/pages/${id}`)
  return data
}

export async function createPageSeo(payload) {
  const { data } = await api.post('/seo/pages', payload)
  return data
}

export async function updatePageSeo(id, payload) {
  const { data } = await api.put(`/seo/pages/${id}`, payload)
  return data
}

export async function analyzePageSeoWithAi(id) {
  const { data } = await api.post(`/seo/pages/${id}/analyze`)
  return data
}

export async function optimizePageSeoWithAi(id) {
  const { data } = await api.post(`/seo/pages/${id}/optimize`)
  return data
}

export async function getSeoScoreOverview() {
  const { data } = await api.get('/seo/score')
  return data
}

export async function runFullSeoAudit() {
  const { data } = await api.post('/seo/audit')
  return data
}

export async function getSeoAuditIssues() {
  const { data } = await api.get('/seo/issues')
  return data
}

export async function getCannibalizationReport() {
  const { data } = await api.get('/seo/cannibalization')
  return data
}

export async function rollbackPageSeoHistory(historyId) {
  const { data } = await api.post(`/seo/history/${historyId}/rollback`)
  return data
}

export async function getPageSeoHistory(pageId) {
  const { data } = await api.get('/seo/history', { params: { page_seo_id: pageId } })
  return data
}

// 150 Legitimate UAE Backlink Opportunities
export async function getBacklinkOpportunities(params = {}) {
  const { data } = await api.get('/seo/backlink-opportunities', { params })
  return data
}

export async function createBacklinkOpportunity(payload) {
  const { data } = await api.post('/seo/backlink-opportunities', payload)
  return data
}

export async function updateBacklinkOpportunity(id, payload) {
  const { data } = await api.put(`/seo/backlink-opportunities/${id}`, payload)
  return data
}

export async function deleteBacklinkOpportunity(id) {
  const { data } = await api.delete(`/seo/backlink-opportunities/${id}`)
  return data
}

// 200 Additional Backlink Opportunities (B1–B10) CRM
export async function getBacklinkOpportunities200(params = {}) {
  const { data } = await api.get('/seo/backlink-opportunities-200', { params })
  return data
}

export async function createBacklinkOpportunity200(payload) {
  const { data } = await api.post('/seo/backlink-opportunities-200', payload)
  return data
}

export async function updateBacklinkOpportunity200(id, payload) {
  const { data } = await api.put(`/seo/backlink-opportunities-200/${id}`, payload)
  return data
}

export async function deleteBacklinkOpportunity200(id) {
  const { data } = await api.delete(`/seo/backlink-opportunities-200/${id}`)
  return data
}

// AI & GEO Visibility Tracking
export async function getAiVisibility() {
  const { data } = await api.get('/seo/ai-visibility')
  return data
}

export async function updateAiVisibility(id, payload) {
  const { data } = await api.put(`/seo/ai-visibility/${id}`, payload)
  return data
}

// GEO FAQ Database Manager (Requirement 27)
export async function getGeoFaqs(params = {}) {
  const { data } = await api.get('/seo/geo-faqs', { params })
  return data
}

export async function getGeoFaqsByUrl(url) {
  const { data } = await api.get('/seo/faqs/by-url', { params: { url } })
  return data
}

export async function createGeoFaq(payload) {
  const { data } = await api.post('/seo/geo-faqs', payload)
  return data
}

export async function updateGeoFaq(id, payload) {
  const { data } = await api.put(`/seo/geo-faqs/${id}`, payload)
  return data
}

export async function deleteGeoFaq(id) {
  const { data } = await api.delete(`/seo/geo-faqs/${id}`)
  return data
}

// GEO Content Knowledge Manager (Requirement 28)
export async function getGeoContent(params = {}) {
  const { data } = await api.get('/seo/geo-content', { params })
  return data
}

export async function createGeoContent(payload) {
  const { data } = await api.post('/seo/geo-content', payload)
  return data
}

export async function updateGeoContent(id, payload) {
  const { data } = await api.put(`/seo/geo-content/${id}`, payload)
  return data
}

export async function deleteGeoContent(id) {
  const { data } = await api.delete(`/seo/geo-content/${id}`)
  return data
}

// GEO Real Citation Verification Logs (Requirement 30)
export async function getCitationLogs(params = {}) {
  const { data } = await api.get('/seo/citation-logs', { params })
  return data
}

export async function createCitationLog(payload) {
  const { data } = await api.post('/seo/citation-logs', payload)
  return data
}
// Competitor URL Content Analyzer (Requirement 31)
export async function analyzeCompetitorUrl(payload) {
  const { data } = await api.post('/seo/competitor-url-analysis', payload)
  return data
}

// GEO 9-Pillar Scorecard (Requirement 41)
export async function getGeoScorecard() {
  const { data } = await api.get('/seo/geo-scorecard')
  return data
}

// Requirement 1 & 9: Complete SEO Crawl Inventory & Orphan Pages
export async function getSeoInventory(params = {}) {
  const { data } = await api.get('/seo/inventory', { params })
  return data
}

// Requirements 35 & 36: Organic Conversion Dashboard & Stats
export async function getConversionStats(params = {}) {
  const { data } = await api.get('/seo/conversions/stats', { params })
  return data
}

// Requirement 28: 404 & Redirect Manager
export async function getRedirects(params = {}) {
  const { data } = await api.get('/seo/redirects', { params })
  return data
}

export async function createRedirect(payload) {
  const { data } = await api.post('/seo/redirects', payload)
  return data
}

export async function updateRedirect(id, payload) {
  const { data } = await api.put(`/seo/redirects/${id}`, payload)
  return data
}

export async function deleteRedirect(id) {
  const { data } = await api.delete(`/seo/redirects/${id}`)
  return data
}

// Requirement 30: Brand Mention Tracker
export async function getBrandMentions(params = {}) {
  const { data } = await api.get('/seo/brand-mentions', { params })
  return data
}

export async function createBrandMention(payload) {
  const { data } = await api.post('/seo/brand-mentions', payload)
  return data
}

export async function updateBrandMention(id, payload) {
  const { data } = await api.put(`/seo/brand-mentions/${id}`, payload)
  return data
}

export async function deleteBrandMention(id) {
  const { data } = await api.delete(`/seo/brand-mentions/${id}`)
  return data
}

// Requirement 34: SEO Experiments (A/B Testing)
export async function getSeoExperiments(params = {}) {
  const { data } = await api.get('/seo/experiments', { params })
  return data
}

export async function createSeoExperiment(payload) {
  const { data } = await api.post('/seo/experiments', payload)
  return data
}

export async function updateSeoExperiment(id, payload) {
  const { data } = await api.put(`/seo/experiments/${id}`, payload)
  return data
}

export async function deleteSeoExperiment(id) {
  const { data } = await api.delete(`/seo/experiments/${id}`)
  return data
}

// Requirement 14: Content Decay & Refresh Tracking
export async function getContentDecay(params = {}) {
  const { data } = await api.get('/seo/content-decay', { params })
  return data
}

export async function updateContentDecay(id, payload) {
  const { data } = await api.put(`/seo/content-decay/${id}`, payload)
  return data
}

// Requirement 38 & 41: Monthly SEO Automation Report & Roadmap
export async function getMonthlyReport(year, month) {
  const { data } = await api.get('/seo/monthly-report', { params: { year, month } })
  return data
}
