const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      if (!full.includes('node_modules') && !full.includes('.git') && !full.includes('dist')) {
        results = results.concat(walk(full));
      }
    } else {
      if (/\.(jsx?|tsx?)$/.test(file)) results.push(full);
    }
  });
  return results;
}

const files = walk(path.join(__dirname, '..', 'client', 'src'));
let cleanedFilesCount = 0;

files.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // Spinners & outlines
  content = content.replace(/border-t-\[#D4AF65\]/g, 'border-t-[#795C43]');
  content = content.replace(/focus-visible:outline-\[#D4AF65\]/g, 'focus-visible:outline-[#795C43]');
  content = content.replace(/focus:ring-\[#D4AF65\]/g, 'focus:ring-[#795C43]');
  content = content.replace(/focus:ring-\[#D4AF65\]\/20/g, 'focus:ring-[#795C43]/20');
  content = content.replace(/focus:ring-\[#D4AF65\]\/30/g, 'focus:ring-[#795C43]/30');
  content = content.replace(/ring-\[#D4AF65\]/g, 'ring-[#795C43]');
  content = content.replace(/ring-\[#D4AF65\]\/20/g, 'ring-[#795C43]/20');
  content = content.replace(/ring-\[#D4AF65\]\/30/g, 'ring-[#795C43]/30');
  content = content.replace(/ring-\[#D4AF65\]\/40/g, 'ring-[#795C43]/40');

  // Shadows
  content = content.replace(/shadow-\[#D4AF65\]\/15/g, 'shadow-[#795C43]/15');
  content = content.replace(/shadow-\[#D4AF65\]\/20/g, 'shadow-[#795C43]/20');
  content = content.replace(/shadow-\[#D4AF65\]\/25/g, 'shadow-[#795C43]/25');
  content = content.replace(/shadow-\[#D4AF65\]\/30/g, 'shadow-[#795C43]/30');

  // Skeletons and remaining #122240
  content = content.replace(/bg-\[#122240\]\/60/g, 'bg-[#DED2C1]/60');
  content = content.replace(/bg-\[#122240\]\/50/g, 'bg-[#DED2C1]/50');
  content = content.replace(/bg-\[#122240\]/g, 'bg-[#DED2C1]');
  content = content.replace(/border-\[#122240\]\/60/g, 'border-[#DED2C1]/60');
  content = content.replace(/text-\[#122240\]/g, 'text-[#DED2C1]');

  // Fills & SVGs
  content = content.replace(/fill-\[#D4AF65\]/g, 'fill-[#795C43]');

  // In InfiniteProductMarquee and LoadingScreen
  content = content.replace(/#081226 0%, #040A18 100%/g, '#FAF8F3 0%, #F5F0E7 100%');
  content = content.replace(/#020611/g, '#EDE3D5');
  content = content.replace(/#040A18/g, '#352719');
  content = content.replace(/#081226/g, '#FAF8F3');

  // Remaining #D4AF65 everywhere
  content = content.replace(/#D4AF65/g, '#795C43');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    cleanedFilesCount++;
  }
});

console.log(`Cleaned remaining tokens across ${cleanedFilesCount} files.`);
