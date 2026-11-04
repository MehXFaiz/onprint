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
console.log(`Processing ${files.length} files in client/src...`);

let modifiedFilesCount = 0;

files.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // 1. Specific compound patterns first
  // Selection
  content = content.replace(/selection:bg-\[#D4AF65\] selection:text-\[#040A18\]/g, 'selection:bg-[#C5A989] selection:text-[#352719]');
  content = content.replace(/selection:bg-\[#D4AF65\]/g, 'selection:bg-[#C5A989]');
  content = content.replace(/selection:text-\[#040A18\]/g, 'selection:text-[#352719]');

  // Buttons with gold bg and dark navy text -> dark brown bg with white text
  content = content.replace(/bg-\[#D4AF65\] text-\[#040A18\]/g, 'bg-[#795C43] text-white');
  content = content.replace(/bg-\[#D4AF65\] hover:bg-\[#C49E52\] (?:[^"'\s]+ )*text-\[#040A18\]/g, (match) => {
    return match.replace('text-[#040A18]', 'text-white').replace('bg-[#D4AF65]', 'bg-[#795C43]').replace('hover:bg-[#C49E52]', 'hover:bg-[#5D442E]');
  });
  content = content.replace(/bg-\[#D4AF65\] hover:bg-\[#C8B185\] text-\[#040A18\]/g, 'bg-[#795C43] hover:bg-[#5D442E] text-white');

  // Residual text-[#040A18]
  content = content.replace(/text-\[#040A18\]/g, 'text-white');

  // 2. Gradients
  content = content.replace(/from-\[#040A18\]/g, 'from-[#F5F0E7]');
  content = content.replace(/via-\[#040A18\]/g, 'via-[#F5F0E7]');
  content = content.replace(/to-\[#040A18\]/g, 'to-[#F5F0E7]');

  content = content.replace(/from-\[#020611\]/g, 'from-[#EDE3D5]');
  content = content.replace(/via-\[#020611\]/g, 'via-[#EDE3D5]');
  content = content.replace(/to-\[#020611\]/g, 'to-[#EDE3D5]');

  content = content.replace(/from-\[#081226\]/g, 'from-[#FAF8F3]');
  content = content.replace(/via-\[#081226\]/g, 'via-[#FAF8F3]');
  content = content.replace(/to-\[#081226\]/g, 'to-[#FAF8F3]');

  content = content.replace(/from-\[#0B1833\]/g, 'from-[#EDE3D5]');
  content = content.replace(/to-\[#0B1833\]/g, 'to-[#EDE3D5]');

  // 3. Backgrounds
  content = content.replace(/bg-\[#040A18\]/g, 'bg-[#F5F0E7]');
  content = content.replace(/bg-\[#020611\]/g, 'bg-[#EDE3D5]');
  content = content.replace(/bg-\[#081226\]/g, 'bg-[#FAF8F3]');
  content = content.replace(/bg-\[#0E1B33\]/g, 'bg-[#EDE3D5]');
  content = content.replace(/bg-\[#0B1426\]/g, 'bg-[#EDE3D5]');
  content = content.replace(/bg-\[#0B1833\]/g, 'bg-[#EDE3D5]');

  // Hover backgrounds
  content = content.replace(/hover:bg-\[#040A18\]/g, 'hover:bg-[#F5F0E7]');
  content = content.replace(/hover:bg-\[#081226\]/g, 'hover:bg-[#FAF8F3]');
  content = content.replace(/hover:bg-\[#020611\]/g, 'hover:bg-[#EDE3D5]');
  content = content.replace(/hover:bg-\[#122240\]/g, 'hover:bg-[#EDE3D5]');

  // 4. Borders & Divides
  content = content.replace(/border-\[#122240\]/g, 'border-[#DED2C1]');
  content = content.replace(/hover:border-\[#122240\]/g, 'hover:border-[#DED2C1]');
  content = content.replace(/divide-\[#122240\]/g, 'divide-[#DED2C1]');
  content = content.replace(/ring-\[#122240\]/g, 'ring-[#DED2C1]');
  content = content.replace(/outline-\[#122240\]/g, 'outline-[#DED2C1]');

  // 5. Text & Placeholders
  content = content.replace(/text-\[#F5F2EB\]/g, 'text-[#352719]');
  content = content.replace(/text-\[#F5F3EE\]/g, 'text-[#352719]');
  content = content.replace(/hover:text-\[#F5F2EB\]/g, 'hover:text-[#352719]');
  
  content = content.replace(/text-\[#B0BECE\]/g, 'text-[#756657]');
  content = content.replace(/hover:text-\[#B0BECE\]/g, 'hover:text-[#756657]');
  content = content.replace(/text-\[#8E9BB5\]/g, 'text-[#756657]');
  content = content.replace(/text-\[#A0AEC0\]/g, 'text-[#756657]');
  content = content.replace(/text-\[#52647D\]/g, 'text-[#756657]');

  content = content.replace(/placeholder:text-\[#B0BECE\]/g, 'placeholder:text-[#756657]');
  content = content.replace(/placeholder:text-\[#52647D\]/g, 'placeholder:text-[#756657]');
  content = content.replace(/placeholder-\[#B0BECE\]/g, 'placeholder-[#756657]');
  content = content.replace(/placeholder-\[#8E9BB5\]/g, 'placeholder-[#756657]');

  // 6. Gold Accents & Highlights -> Rich Brown
  content = content.replace(/text-\[#D4AF65\]/g, 'text-[#795C43]');
  content = content.replace(/hover:text-\[#D4AF65\]/g, 'hover:text-[#795C43]');
  content = content.replace(/text-\[#D6C29A\]/g, 'text-[#795C43]');
  content = content.replace(/text-\[#C49E52\]/g, 'text-[#5D442E]');
  content = content.replace(/hover:text-\[#C49E52\]/g, 'hover:text-[#5D442E]');

  content = content.replace(/border-\[#D4AF65\]/g, 'border-[#C5A989]');
  content = content.replace(/hover:border-\[#D4AF65\]/g, 'hover:border-[#795C43]');
  content = content.replace(/border-\[#D6C29A\]/g, 'border-[#C5A989]');
  content = content.replace(/border-\[#C49E52\]/g, 'border-[#5D442E]');
  content = content.replace(/hover:border-\[#C49E52\]/g, 'hover:border-[#5D442E]');

  content = content.replace(/bg-\[#D4AF65\]/g, 'bg-[#795C43]');
  content = content.replace(/hover:bg-\[#D4AF65\]/g, 'hover:bg-[#5D442E]');
  content = content.replace(/bg-\[#D6C29A\]/g, 'bg-[#C5A989]');
  content = content.replace(/hover:bg-\[#C49E52\]/g, 'hover:bg-[#5D442E]');
  content = content.replace(/hover:bg-\[#C8B185\]/g, 'hover:bg-[#5D442E]');

  // 7. Opacity variants
  // bg-[#D4AF65]/10, 20, 30 -> bg-[#C5A989]/15, 25, 35
  content = content.replace(/bg-\[#D4AF65\]\/10/g, 'bg-[#C5A989]/15');
  content = content.replace(/bg-\[#D4AF65\]\/20/g, 'bg-[#C5A989]/25');
  content = content.replace(/bg-\[#D4AF65\]\/30/g, 'bg-[#C5A989]/35');
  content = content.replace(/hover:bg-\[#D4AF65\]\/10/g, 'hover:bg-[#C5A989]/20');
  content = content.replace(/hover:bg-\[#D4AF65\]\/20/g, 'hover:bg-[#C5A989]/30');
  content = content.replace(/hover:bg-\[#D4AF65\]\/30/g, 'hover:bg-[#C5A989]/40');
  content = content.replace(/border-\[#D4AF65\]\/30/g, 'border-[#DED2C1]');
  content = content.replace(/border-\[#D4AF65\]\/20/g, 'border-[#DED2C1]');
  content = content.replace(/border-\[#D4AF65\]\/10/g, 'border-[#DED2C1]');

  // 8. Shadows with old rgba
  content = content.replace(/rgba\(212,\s*175,\s*101,\s*([\d\.]+)\)/g, 'rgba(121, 92, 67, $1)');
  content = content.replace(/rgba\(212,175,101,([\d\.]+)\)/g, 'rgba(121,92,67,$1)');
  content = content.replace(/rgba\(2,\s*6,\s*17,\s*([\d\.]+)\)/g, 'rgba(121, 92, 67, 0.08)');
  content = content.replace(/rgba\(2,6,17,([\d\.]+)\)/g, 'rgba(121,92,67,0.08)');
  content = content.replace(/rgba\(11,\s*20,\s*38,\s*([\d\.]+)\)/g, 'rgba(121, 92, 67, 0.1)');
  content = content.replace(/rgba\(11,20,38,([\d\.]+)\)/g, 'rgba(121,92,67,0.1)');
  content = content.replace(/rgba\(16,\s*29,\s*53,\s*([\d\.]+)\)/g, 'rgba(121, 92, 67, 0.1)');
  content = content.replace(/rgba\(16,29,53,([\d\.]+)\)/g, 'rgba(121,92,67,0.1)');
  content = content.replace(/rgba\(214,\s*194,\s*154,\s*([\d\.]+)\)/g, 'rgba(197, 169, 137, $1)');
  content = content.replace(/rgba\(214,194,154,([\d\.]+)\)/g, 'rgba(197,169,137,$1)');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    modifiedFilesCount++;
  }
});

console.log(`Successfully transformed ${modifiedFilesCount} files to the new Beige & Light Brown design system!`);
