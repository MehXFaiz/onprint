const fs = require('fs');
const path = require('path');

// 1. Update Button.jsx
const btnPath = path.join(__dirname, '..', 'client', 'src', 'components', 'Button.jsx');
let btnContent = fs.readFileSync(btnPath, 'utf8');

const oldBase = `focus-visible:outline-[#D4AF65]`;
const newBase = `focus-visible:outline-[#795C43]`;
btnContent = btnContent.replace(oldBase, newBase);

const oldVariants = `const variants = {
  primary:
    'border-[#D4AF65] bg-[#D4AF65] text-[#040A18] hover:bg-[#C49E52] hover:border-[#C49E52] shadow-[0_4px_14px_rgba(212,175,101,0.28)] hover:shadow-[0_8px_24px_rgba(212,175,101,0.38)]',
  accent:
    'border-[#D4AF65] bg-[#D4AF65] text-[#040A18] hover:bg-[#C49E52] hover:border-[#C49E52] shadow-[0_4px_14px_rgba(212,175,101,0.28)]',
  secondary:
    'border-[#122240] bg-[#081226] text-[#F5F2EB] hover:bg-[#122240] hover:border-[#D4AF65] hover:text-[#D4AF65] shadow-xs',
  outline:
    'border-[#D4AF65] bg-transparent text-[#F5F2EB] hover:border-[#C49E52] hover:bg-[#D4AF65] hover:text-[#040A18] shadow-2xs',
  darkOutline:
    'border-[#D4AF65] bg-transparent text-[#F5F2EB] hover:bg-[#D4AF65] hover:text-[#040A18] hover:border-[#D4AF65] shadow-xs',
  navyOutline:
    'border-[#122240] bg-[#081226] text-[#F5F2EB] hover:border-[#D4AF65] hover:text-[#D4AF65] shadow-xs',
  whatsapp:
    'border-[#25D366] bg-[#25D366] text-white hover:bg-[#20ba59] hover:border-[#20ba59] shadow-sm shadow-emerald-600/20',
  ghost:
    'border-transparent bg-transparent text-[#B0BECE] hover:text-[#D4AF65] hover:bg-[#081226]',
}`;

const newVariants = `const variants = {
  primary:
    'border-[#795C43] bg-[#795C43] text-white hover:bg-[#5D442E] hover:border-[#5D442E] shadow-[0_4px_14px_rgba(121,92,67,0.25)] hover:shadow-[0_8px_24px_rgba(121,92,67,0.38)]',
  accent:
    'border-[#C5A989] bg-[#C5A989] text-[#352719] hover:bg-[#A98968] hover:border-[#A98968] hover:text-white shadow-[0_4px_14px_rgba(197,169,137,0.28)]',
  secondary:
    'border-[#DED2C1] bg-[#FAF8F3] text-[#352719] hover:bg-[#EDE3D5] hover:border-[#C5A989] hover:text-[#795C43] shadow-xs',
  outline:
    'border-[#795C43] bg-transparent text-[#795C43] hover:border-[#795C43] hover:bg-[#795C43] hover:text-white shadow-2xs',
  darkOutline:
    'border-[#352719] bg-transparent text-[#352719] hover:bg-[#352719] hover:text-white hover:border-[#352719] shadow-xs',
  navyOutline:
    'border-[#DED2C1] bg-[#EDE3D5] text-[#352719] hover:border-[#795C43] hover:text-[#795C43] shadow-xs',
  whatsapp:
    'border-[#25D366] bg-[#25D366] text-white hover:bg-[#20ba59] hover:border-[#20ba59] shadow-sm shadow-emerald-600/20',
  ghost:
    'border-transparent bg-transparent text-[#756657] hover:text-[#795C43] hover:bg-[#EDE3D5]',
}`;

if (btnContent.includes(oldVariants)) {
  btnContent = btnContent.replace(oldVariants, newVariants);
} else if (btnContent.includes(oldVariants.replace(/\n/g, '\r\n'))) {
  btnContent = btnContent.replace(oldVariants.replace(/\n/g, '\r\n'), newVariants.replace(/\n/g, '\r\n'));
}

fs.writeFileSync(btnPath, btnContent, 'utf8');
console.log('Successfully updated Button.jsx');

// 2. Update Logo.jsx
const logoPath = path.join(__dirname, '..', 'client', 'src', 'components', 'Logo.jsx');
let logoContent = fs.readFileSync(logoPath, 'utf8');

logoContent = logoContent
  .replace(/text-\[#F5F2EB\]/g, 'text-[#352719]')
  .replace(/text-\[#D4AF65\]/g, 'text-[#795C43]')
  .replace(/rgba\(214,188,138,0\.55\)/g, 'rgba(197,169,137,0.4)');

fs.writeFileSync(logoPath, logoContent, 'utf8');
console.log('Successfully updated Logo.jsx');
