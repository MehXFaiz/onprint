const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'client', 'src', 'pages', 'public', 'HomePage.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Global gold & dark hex updates
content = content.replace(/#D4AF65/g, '#D6BC8A');
content = content.replace(/#B89245/g, '#D6BC8A');

// Hero section adjustments
content = content.replace('bg-slate-50', 'bg-[#101C35]');
content = content.replace(
  '<div className="mb-3.5 flex items-center justify-between gap-2 rounded-2xl border border-slate-200/90 bg-slate-100 p-1.5 shadow-2xs">',
  '<div className="mb-3.5 flex items-center justify-between gap-2 rounded-2xl border border-[#263654] bg-[#1B2943] p-1.5 shadow-2xs">'
);
content = content.replace(
  'absolute inset-0 rounded-xl bg-white shadow-xs border border-slate-200/80 -z-10',
  'absolute inset-0 rounded-xl bg-[#101C35] shadow-xs border border-[#263654] -z-10'
);
content = content.replace(
  'border border-slate-200/90 bg-white p-2 shadow-[0_20px_45px_-10px_rgba(15,23,42,0.08)]',
  'border border-[#263654] bg-[#1B2943] p-2 shadow-[0_20px_45px_-10px_rgba(11,20,38,0.75)]'
);
content = content.replace(
  'rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white relative group flex-1 overflow-hidden p-1.5 sm:p-2 block shadow-xs hover:border-[#D6BC8A] hover:shadow-lg transition-all',
  'rounded-2xl sm:rounded-3xl border border-[#263654] bg-[#1B2943] relative group flex-1 overflow-hidden p-1.5 sm:p-2 block shadow-xs hover:border-[#D6BC8A] hover:shadow-lg transition-all'
);
content = content.replace(
  'flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-slate-50 border border-slate-200/90 px-3.5 sm:px-4 py-3 text-xs shadow-xs text-slate-800',
  'flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-[#1B2943] border border-[#263654] px-3.5 sm:px-4 py-3 text-xs shadow-xs text-[#F5F1E8]'
);

// 2. Core Printing Services Section
content = content.replace(
  'section className="bg-slate-50 py-16 sm:py-24 border-b border-slate-200/90"',
  'section className="bg-[#0B1426] py-16 sm:py-24 border-b border-[#263654] text-[#F5F1E8]"'
);
content = content.replace(
  'border-b border-slate-200',
  'border-b border-[#263654]'
);
content = content.replace(
  'text-slate-900',
  'text-[#F5F1E8]'
);
content = content.replace(
  'text-slate-600',
  'text-[#A0AEC0]'
);

// Replace 8 cards background
content = content.replaceAll(
  'rounded-3xl border border-slate-200 bg-white group h-full flex flex-col justify-between overflow-hidden p-5 shadow-xs hover:border-[#D6BC8A] hover:shadow-xl transition-all duration-300 card-hover-lift hover-shimmer',
  'rounded-3xl border border-[#263654] bg-[#1B2943] text-[#F5F1E8] group h-full flex flex-col justify-between overflow-hidden p-5 shadow-xs hover:border-[#D6BC8A] hover:shadow-xl transition-all duration-300 card-hover-lift hover-shimmer'
);
content = content.replaceAll(
  'aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-100 mb-4 border border-slate-200',
  'aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#0B1426] mb-4 border border-[#263654]'
);
content = content.replaceAll(
  'pt-2 border-t border-slate-100 space-y-1 text-[11px] font-medium text-slate-600',
  'pt-2 border-t border-[#263654] space-y-1 text-[11px] font-medium text-[#A0AEC0]'
);
content = content.replaceAll(
  'mt-5 pt-4 border-t border-slate-100 space-y-2',
  'mt-5 pt-4 border-t border-[#263654] space-y-2'
);
content = content.replaceAll(
  'bg-white/95 border border-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-800 backdrop-blur-xs shadow-xs',
  'bg-[#101C35]/90 border border-[#263654] px-2 py-0.5 text-[10px] font-bold text-[#F5F1E8] backdrop-blur-xs shadow-xs'
);
content = content.replaceAll(
  'text-slate-600 hover:text-[#D6BC8A]',
  'text-[#A0AEC0] hover:text-[#D6BC8A]'
);

// 8. Featured Products Section
content = content.replace(
  'section className="border-t border-slate-200 bg-white py-16 sm:py-24"',
  'section className="border-t border-[#263654] bg-[#101C35] py-16 sm:py-24 text-[#F5F1E8]"'
);

// 9. Selected Press Work / Portfolio
content = content.replace(
  'section className="border-t border-slate-200 bg-slate-50 py-16 sm:py-24"',
  'section className="border-t border-[#263654] bg-[#0B1426] py-16 sm:py-24 text-[#F5F1E8]"'
);
content = content.replaceAll(
  'group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-[#D6BC8A] hover:shadow-xl',
  'group flex h-full flex-col overflow-hidden rounded-2xl border border-[#263654] bg-[#1B2943] text-[#F5F1E8] shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-[#D6BC8A] hover:shadow-xl'
);
content = content.replaceAll(
  'relative aspect-[4/3] w-full overflow-hidden bg-slate-100',
  'relative aspect-[4/3] w-full overflow-hidden bg-[#0B1426]'
);
content = content.replaceAll(
  'mt-4 border-t border-slate-100 pt-3',
  'mt-4 border-t border-[#263654] pt-3'
);

// 10. Why Choose Us & Production Process
content = content.replace(
  'section id="production-process" className="py-16 sm:py-24 bg-white border-t border-slate-200"',
  'section id="production-process" className="py-16 sm:py-24 bg-[#101C35] border-t border-[#263654] text-[#F5F1E8]"'
);
content = content.replaceAll(
  'h-full rounded-2xl border border-slate-200 bg-slate-50/80 p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-[#D6BC8A] hover:shadow-xl hover:bg-white group',
  'h-full rounded-2xl border border-[#263654] bg-[#1B2943] text-[#F5F1E8] p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-[#D6BC8A] hover:shadow-xl hover:bg-[#263654]/40 group'
);
content = content.replaceAll(
  'bg-[#D6BC8A] font-display text-xs font-bold text-[#0F172A]',
  'bg-[#D6BC8A] font-display text-xs font-bold text-[#101C35]'
);
content = content.replaceAll(
  'rounded-2xl border border-slate-200 bg-slate-50/80 p-5 h-full card-hover-lift hover-shimmer shadow-xs hover:border-[#D6BC8A] hover:bg-white',
  'rounded-2xl border border-[#263654] bg-[#1B2943] text-[#F5F1E8] p-5 h-full card-hover-lift hover-shimmer shadow-xs hover:border-[#D6BC8A]'
);
content = content.replaceAll(
  'inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-slate-200 text-[#D6BC8A] text-xs font-bold shadow-2xs',
  'inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#101C35] border border-[#263654] text-[#D6BC8A] text-xs font-bold shadow-2xs'
);

// 11. Blog Section
content = content.replaceAll(
  'flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-[#D6BC8A] hover:shadow-xl',
  'flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-[#263654] bg-[#1B2943] text-[#F5F1E8] p-5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-[#D6BC8A] hover:shadow-xl'
);
content = content.replaceAll(
  'aspect-[16/10] overflow-hidden rounded-xl bg-slate-100',
  'aspect-[16/10] overflow-hidden rounded-xl bg-[#0B1426]'
);
content = content.replaceAll(
  'rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[#D6BC8A] uppercase tracking-wider',
  'rounded-full bg-[#101C35] border border-[#263654] px-2.5 py-0.5 text-[#D6BC8A] uppercase tracking-wider'
);

// 12. FAQ Section
content = content.replace(
  'section className="border-t border-slate-200 bg-white py-16 sm:py-24"',
  'section className="border-t border-[#263654] bg-[#101C35] py-16 sm:py-24 text-[#F5F1E8]"'
);
content = content.replace(
  'divide-y divide-slate-200 border-t border-b border-slate-200',
  'divide-y divide-[#263654] border-t border-b border-[#263654]'
);

// 13. Bottom CTA Section
content = content.replace(
  'border-t border-slate-800 bg-slate-950 py-16 sm:py-20 text-white relative overflow-hidden',
  'border-t border-[#263654] bg-[#0B1426] py-16 sm:py-20 text-[#F5F1E8] relative overflow-hidden'
);
content = content.replaceAll(
  'border border-slate-800 bg-slate-900 px-3 py-2.5 text-xs font-bold text-white',
  'border border-[#263654] bg-[#1B2943] px-3 py-2.5 text-xs font-bold text-[#F5F1E8]'
);
content = content.replace(
  '!rounded-full !bg-[#D6BC8A] hover:!bg-[#B89245] shadow-lg shadow-[#D6BC8A]/25 text-center justify-center font-black !py-3.5 !px-5 sm:!px-8 !text-[#0F172A]',
  '!rounded-full !bg-[#D6BC8A] hover:!bg-[#C4A870] shadow-lg shadow-[#D6BC8A]/25 text-center justify-center font-black !py-3.5 !px-5 sm:!px-8 !text-[#101C35]'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('HomePage successfully styled to luxury dark navy theme.');
