const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'client', 'src', 'components', 'SiteHeader.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replacements
content = content.replace(/#D4AF65/g, '#D6BC8A');
content = content.replace(/#B89245/g, '#D6BC8A');
content = content.replace(/#101D35/g, '#101C35');

// Top header bar
content = content.replace(
  'sticky top-0 z-50 w-full select-none bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs transition-all duration-200 text-slate-900',
  'sticky top-0 z-50 w-full select-none bg-[#101C35]/95 backdrop-blur-md border-b border-[#263654] shadow-md transition-all duration-200 text-[#F5F1E8]'
);

// Utility bar
content = content.replace(
  'bg-slate-50 border-b border-slate-200/80 text-[11px] text-slate-600 py-1.5',
  'bg-[#0B1426] border-b border-[#263654] text-[11px] text-[#A0AEC0] py-1.5'
);

// Navigation glider
content = content.replace(
  'bg-slate-100/90 px-2.5 py-1 2xl:px-3 2xl:py-1.5 rounded-full border border-slate-200/90 shadow-2xs backdrop-blur-md relative shrink-0',
  'bg-[#1B2943]/90 px-2.5 py-1 2xl:px-3 2xl:py-1.5 rounded-full border border-[#263654] shadow-2xs backdrop-blur-md relative shrink-0'
);

// Glider hover capsule
content = content.replaceAll(
  'absolute inset-0 rounded-full bg-white shadow-xs border border-slate-200/80 text-slate-900 -z-10',
  'absolute inset-0 rounded-full bg-[#101C35] shadow-xs border border-[#263654] text-[#F5F1E8] -z-10'
);

// Mega-menu panel
content = content.replace(
  'absolute left-0 sm:-left-8 lg:-left-20 xl:left-0 top-full mt-3 w-[min(960px,calc(100vw-32px))] max-w-[calc(100vw-32px)] rounded-3xl border border-slate-200 bg-white/98 backdrop-blur-2xl p-5 shadow-[0_28px_64px_-12px_rgba(15,23,42,0.18)] z-50 text-slate-900',
  'absolute left-0 sm:-left-8 lg:-left-20 xl:left-0 top-full mt-3 w-[min(960px,calc(100vw-32px))] max-w-[calc(100vw-32px)] rounded-3xl border border-[#263654] bg-[#1B2943]/98 backdrop-blur-2xl p-5 shadow-[0_28px_64px_-12px_rgba(11,20,38,0.85)] z-50 text-[#F5F1E8]'
);

// Left column in mega-menu
content = content.replace(
  'col-span-5 border-r border-slate-200/80 pr-4 flex flex-col justify-between',
  'col-span-5 border-r border-[#263654] pr-4 flex flex-col justify-between'
);

// Company dropdown panel
content = content.replace(
  'absolute left-1/2 -translate-x-1/2 top-full mt-3 w-64 rounded-2xl border border-slate-200 bg-white/98 backdrop-blur-2xl p-2 shadow-2xl z-50 text-slate-900',
  'absolute left-1/2 -translate-x-1/2 top-full mt-3 w-64 rounded-2xl border border-[#263654] bg-[#1B2943]/98 backdrop-blur-2xl p-2 shadow-2xl z-50 text-[#F5F1E8]'
);

// WhatsApp popover panel
content = content.replace(
  'fixed right-3 left-3 sm:left-auto sm:absolute sm:right-0 top-16 sm:top-full sm:mt-2.5 sm:w-76 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl z-50 text-slate-900',
  'fixed right-3 left-3 sm:left-auto sm:absolute sm:right-0 top-16 sm:top-full sm:mt-2.5 sm:w-76 rounded-2xl border border-[#263654] bg-[#1B2943] p-4 shadow-2xl z-50 text-[#F5F1E8]'
);

// Search modal panel
content = content.replace(
  'w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-2xl text-slate-900',
  'w-full max-w-2xl rounded-3xl border border-[#263654] bg-[#1B2943] p-4 sm:p-6 shadow-2xl text-[#F5F1E8]'
);

// Mobile drawer container
content = content.replace(
  'relative ml-auto flex h-full w-full max-w-md flex-col bg-white border-l border-slate-200 shadow-2xl z-50 overflow-hidden text-slate-900',
  'relative ml-auto flex h-full w-full max-w-md flex-col bg-[#101C35] border-l border-[#263654] shadow-2xl z-50 overflow-hidden text-[#F5F1E8]'
);

// Drawer footer
content = content.replace(
  'border-t border-slate-200 p-4 space-y-2 shrink-0 bg-slate-50',
  'border-t border-[#263654] p-4 space-y-2 shrink-0 bg-[#0B1426]'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('SiteHeader successfully styled to luxury dark navy theme.');
