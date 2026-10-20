const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'client', 'src', 'pages', 'public', 'ProductsPage.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Colors
content = content.replace(/#D4AF65/g, '#D6BC8A');
content = content.replace(/#B89245/g, '#D6BC8A');

// Root container background
content = content.replace(
  'py-10 sm:py-16 bg-[#F5F2EB]/40 min-h-screen',
  'py-10 sm:py-16 bg-[#101C35] text-[#F5F1E8] min-h-screen'
);

// Heading
content = content.replace(
  'text-[#101D35] sm:text-4xl lg:text-5xl',
  'text-[#F5F1E8] sm:text-4xl lg:text-5xl'
);
content = content.replace(
  'text-[#343D4F] sm:text-base',
  'text-[#A0AEC0] sm:text-base'
);

// Search input
content = content.replace(
  'border border-slate-300 bg-white pl-10 pr-9 py-2.5 text-xs font-semibold text-[#101D35] transition-all focus:border-[#D6BC8A] focus:outline-none shadow-xs',
  'border border-[#263654] bg-[#1B2943] pl-10 pr-9 py-2.5 text-xs font-semibold text-[#F5F1E8] placeholder:text-[#52647D] transition-all focus:border-[#D6BC8A] focus:outline-none shadow-xs'
);

// Border divider
content = content.replaceAll(
  'border-b border-slate-200',
  'border-b border-[#263654]'
);
content = content.replaceAll(
  'border-t border-slate-200',
  'border-t border-[#263654]'
);
content = content.replaceAll(
  'border-t border-slate-200/80',
  'border-t border-[#263654]'
);

// Department buttons
content = content.replace(
  `!activeDeptParam && !activeCategoryParam
                  ? 'bg-[#101D35] text-white shadow-md'
                  : 'border border-slate-300 bg-white text-slate-700 hover:border-[#101D35] hover:text-[#101D35]'`,
  `!activeDeptParam && !activeCategoryParam
                  ? 'bg-[#D6BC8A] text-[#101C35] shadow-md font-black'
                  : 'border border-[#263654] bg-[#1B2943] text-[#F5F1E8] hover:border-[#D6BC8A] hover:text-[#D6BC8A]'`
);

content = content.replace(
  `isSelected
                      ? 'bg-[#101D35] text-white shadow-md'
                      : 'border border-slate-300 bg-white text-slate-700 hover:border-[#101D35] hover:text-[#101D35]'`,
  `isSelected
                      ? 'bg-[#D6BC8A] text-[#101C35] shadow-md font-black'
                      : 'border border-[#263654] bg-[#1B2943] text-[#F5F1E8] hover:border-[#D6BC8A] hover:text-[#D6BC8A]'`
);

// Subcategory filter buttons
content = content.replace(
  `!activeCategoryParam
                    ? 'bg-[#D6BC8A] text-[#101D35]'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'`,
  `!activeCategoryParam
                    ? 'bg-[#D6BC8A] text-[#101C35] font-black'
                    : 'bg-[#1B2943] border border-[#263654] text-[#F5F1E8] hover:bg-[#263654]'`
);

content = content.replace(
  `isSubSelected
                        ? 'bg-[#D6BC8A] text-[#101D35]'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'`,
  `isSubSelected
                        ? 'bg-[#D6BC8A] text-[#101C35] font-black'
                        : 'bg-[#1B2943] border border-[#263654] text-[#F5F1E8] hover:bg-[#263654]'`
);

// Sort selector
content = content.replace(
  'rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-[#101D35] focus:border-[#D6BC8A] focus:outline-none',
  'rounded-xl border border-[#263654] bg-[#1B2943] px-3 py-1.5 text-xs font-semibold text-[#F5F1E8] focus:border-[#D6BC8A] focus:outline-none'
);

// Pagination buttons
content = content.replaceAll(
  'border border-slate-300 bg-white px-3 text-xs font-bold text-slate-700 hover:bg-slate-50',
  'border border-[#263654] bg-[#1B2943] px-3 text-xs font-bold text-[#F5F1E8] hover:bg-[#263654]'
);

content = content.replace(
  `isCurr
                      ? 'bg-[#101D35] text-white shadow-xs'
                      : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'`,
  `isCurr
                      ? 'bg-[#D6BC8A] text-[#101C35] font-black shadow-xs'
                      : 'border border-[#263654] bg-[#1B2943] text-[#F5F1E8] hover:bg-[#263654]'`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('ProductsPage successfully styled to luxury dark navy theme.');
