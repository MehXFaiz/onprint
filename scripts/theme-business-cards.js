const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'client', 'src', 'pages', 'public', 'BusinessCardLandingPage.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Global gold & dark updates
content = content.replace(/#D4AF65/g, '#D6BC8A');
content = content.replace(/#B89245/g, '#D6BC8A');
content = content.replace(/#101D35/g, '#101C35');
content = content.replace(/#162542/g, '#1B2943');
content = content.replace(/#28395A/g, '#263654');

// Root wrapper
content = content.replace(
  'className="bg-white text-slate-900 pt-4 sm:pt-6 pb-12 sm:pb-16"',
  'className="bg-[#101C35] text-[#F5F1E8] pt-4 sm:pt-6 pb-12 sm:pb-16"'
);

// Sections
content = content.replaceAll('bg-slate-50', 'bg-[#101C35]');
content = content.replaceAll('bg-white', 'bg-[#1B2943]');
content = content.replaceAll('border-slate-200', 'border-[#263654]');
content = content.replaceAll('text-slate-900', 'text-[#F5F1E8]');
content = content.replaceAll('text-slate-800', 'text-[#F5F1E8]');
content = content.replaceAll('text-slate-700', 'text-[#A0AEC0]');
content = content.replaceAll('text-slate-600', 'text-[#A0AEC0]');

fs.writeFileSync(filePath, content, 'utf8');
console.log('BusinessCardLandingPage successfully updated to luxury dark navy theme.');
