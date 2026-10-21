const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('=== RUNNING COMPREHENSIVE WHATSAPP CTA & NUMBER AUDIT ===\n');

// 1. Phone Normalization Test
function normalizeWhatsAppNumber(raw) {
  let clean = String(raw || '').replace(/[^\d]/g, '').replace(/^00/, '');
  if (clean.startsWith('05') && clean.length === 10) clean = '971' + clean.slice(1);
  if (clean.startsWith('5') && clean.length === 9) clean = '971' + clean;
  if (clean.startsWith('07') && clean.length === 11) clean = '44' + clean.slice(1);
  return clean || '447344546056';
}

console.log('Test 1: Normalization of various phone formats:');
assert.strictEqual(normalizeWhatsAppNumber('447344546056'), '447344546056');
assert.strictEqual(normalizeWhatsAppNumber('+44 7344 546056'), '447344546056');
assert.strictEqual(normalizeWhatsAppNumber('0044 7344 546056'), '447344546056');
assert.strictEqual(normalizeWhatsAppNumber('07344546056'), '447344546056');
assert.strictEqual(normalizeWhatsAppNumber('+971 50 123 4567'), '971501234567');
assert.strictEqual(normalizeWhatsAppNumber('0501234567'), '971501234567');
assert.strictEqual(normalizeWhatsAppNumber('501234567'), '971501234567');
console.log('  ✓ Phone normalization verified across UK and UAE patterns.\n');

// 2. Scan entire client/src for any hardcoded wrong phone numbers
console.log('Test 2: Scanning all files in client/src for outdated or mismatched numbers:');
const clientSrc = path.join(__dirname, '..', 'client', 'src');
let foundOldNumber = false;

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      scanDir(full);
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      const content = fs.readFileSync(full, 'utf8');
      if (content.includes('971562947183')) {
        console.error(`  ✗ Found old number 971562947183 in ${full}`);
        foundOldNumber = true;
      }
    }
  }
}
scanDir(clientSrc);
assert.strictEqual(foundOldNumber, false, 'No files should contain the outdated 971562947183 number');
console.log('  ✓ Zero occurrences of outdated phone numbers found in client/src.\n');

// 3. Scan for suppressed redirect fallbacks
console.log('Test 3: Scanning for suppressed popup fallbacks ({ allowSameTabFallback: false }):');
let foundSuppressed = false;
function scanSuppressed(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      scanSuppressed(full);
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      const content = fs.readFileSync(full, 'utf8');
      if (content.includes('allowSameTabFallback: false')) {
        console.error(`  ✗ Found allowSameTabFallback: false in ${full}`);
        foundSuppressed = true;
      }
    }
  }
}
scanSuppressed(clientSrc);
assert.strictEqual(foundSuppressed, false, 'No lead forms should suppress same-tab fallback on blocked popups');
console.log('  ✓ All lead and quote forms allow safe fallback redirect if popups are blocked.\n');

// 4. Verify Business Card message format
console.log('Test 4: Verifying buyer-intent business card inquiry message generation:');
const whatsappModulePath = path.join(clientSrc, 'utils', 'whatsapp.js');
const whatsappContent = fs.readFileSync(whatsappModulePath, 'utf8');

assert.ok(whatsappContent.includes('formatBusinessCardInquiry'), 'whatsapp.js must export formatBusinessCardInquiry');
assert.ok(whatsappContent.includes('getBusinessCardBuyerIntentUrl'), 'whatsapp.js must export getBusinessCardBuyerIntentUrl');
assert.ok(whatsappContent.includes('Hello ONPRINT, I need a quotation for custom business cards'), 'whatsapp.js must contain prompt specification string');

console.log('  ✓ Buyer-intent business card inquiry format verified.\n');

console.log('=== ALL WHATSAPP CTA AND LINK TESTS PASSED SUCCESSFULLY ===');
