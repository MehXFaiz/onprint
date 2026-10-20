const fs = require('fs');
const path = require('path');

// 1. CorporateQuotePage.jsx
const corpPath = path.join(__dirname, '..', 'client', 'src', 'pages', 'public', 'CorporateQuotePage.jsx');
let corp = fs.readFileSync(corpPath, 'utf8');
corp = corp.replace(/#D4AF65/g, '#D6BC8A');
corp = corp.replace(/#B89245/g, '#D6BC8A');
corp = corp.replace(/#101D35/g, '#101C35');
corp = corp.replace(/#162542/g, '#1B2943');
corp = corp.replace(/#28395A/g, '#263654');
corp = corp.replace('bg-slate-50/50 min-h-screen', 'bg-[#101C35] text-[#F5F1E8] min-h-screen');
corp = corp.replace('border border-slate-800', 'border border-[#263654]');
corp = corp.replace('border-t border-slate-700/80', 'border-t border-[#263654]');
corp = corp.replaceAll('text-slate-300', 'text-[#A0AEC0]');
corp = corp.replaceAll('text-slate-200', 'text-[#F5F1E8]');
fs.writeFileSync(corpPath, corp, 'utf8');

// 2. GetQuotePage.jsx
const quotePath = path.join(__dirname, '..', 'client', 'src', 'pages', 'public', 'GetQuotePage.jsx');
let quote = fs.readFileSync(quotePath, 'utf8');
quote = quote.replace(/#D4AF65/g, '#D6BC8A');
quote = quote.replace(/#B89245/g, '#D6BC8A');
quote = quote.replace(/#0F172A/g, '#101C35');
quote = quote.replace(/#101D35/g, '#101C35');
quote = quote.replace('div className="py-16 sm:py-24"', 'div className="py-16 sm:py-24 bg-[#101C35] text-[#F5F1E8]"');
quote = quote.replaceAll('rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 md:p-10 shadow-lg', 'rounded-3xl border border-[#263654] bg-[#1B2943] p-6 sm:p-8 md:p-10 shadow-xl text-[#F5F1E8]');
quote = quote.replaceAll('border border-slate-200 bg-slate-50', 'border border-[#263654] bg-[#101C35]');
quote = quote.replaceAll('border-slate-200 bg-white', 'border-[#263654] bg-[#101C35]');
quote = quote.replaceAll('border-slate-200', 'border-[#263654]');
quote = quote.replaceAll('text-slate-900', 'text-[#F5F1E8]');
quote = quote.replaceAll('text-slate-800', 'text-[#F5F1E8]');
quote = quote.replaceAll('text-slate-700', 'text-[#F5F1E8]');
quote = quote.replaceAll('text-slate-600', 'text-[#A0AEC0]');
quote = quote.replaceAll('text-slate-500', 'text-[#94A3B8]');
quote = quote.replaceAll('bg-amber-100/70', 'bg-[#101C35]');
quote = quote.replaceAll('border-amber-200', 'border-[#263654]');
quote = quote.replaceAll('bg-amber-50', 'bg-[#101C35]');
fs.writeFileSync(quotePath, quote, 'utf8');

console.log('Quote pages updated to luxury dark navy theme.');
