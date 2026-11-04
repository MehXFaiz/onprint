const fs = require('fs');
const path = require('path');

const storeFile = path.join(__dirname, '..', 'src', 'data', 'persistentStore.js');
let content = fs.readFileSync(storeFile, 'utf8');

const targetImport = `const { BUSINESS_CARD_BACKLINK_PROSPECTS } = require('../services/businessCardLinkBuildingService')`;
const newImport = `const { BUSINESS_CARD_BACKLINK_PROSPECTS } = require('../services/businessCardLinkBuildingService')
const { PAGE_SEO_MASTER_LIST } = require('./pageSeoMasterData')`;

content = content.replace(targetImport, newImport);

const functionsToAdd = `
function getKeywords() {
  const store = loadStore()
  return Array.isArray(store.keywords) ? store.keywords : []
}

function getBacklinks() {
  const store = loadStore()
  return Array.isArray(store.backlinks) ? store.backlinks : []
}

function getPageSeoList() {
  const store = loadStore()
  const overrides = store.page_seo || {}
  return PAGE_SEO_MASTER_LIST.map((p) => {
    const override = overrides[p.url] || overrides[String(p.id)] || {}
    return { ...p, ...override }
  })
}

function updatePageSeoItem(urlOrId, updates) {
  const store = loadStore()
  if (!store.page_seo) store.page_seo = {}
  store.page_seo[urlOrId] = { ...(store.page_seo[urlOrId] || {}), ...updates }
  saveStore(store)
  return store.page_seo[urlOrId]
}
`;

const targetExport = `  addNotificationLog,
  getNotificationLogs,`;
const newExport = `  addNotificationLog,
  getNotificationLogs,
  getKeywords,
  getBacklinks,
  getPageSeoList,
  updatePageSeoItem,`;

content = content.replace(targetExport, newExport);

// Append functions before module.exports
const exportIdx = content.indexOf('module.exports = {');
if (exportIdx !== -1) {
  content = content.slice(0, exportIdx) + functionsToAdd + '\n' + content.slice(exportIdx);
}

fs.writeFileSync(storeFile, content, 'utf8');
console.log('Successfully updated persistentStore.js with keywords, backlinks & pageSeo master access.');
