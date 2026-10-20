const fs = require('fs');
const path = require('path');

const finishPath = path.join(__dirname, '..', 'client', 'src', 'pages', 'public', 'FinishingShowcasePage.jsx');
let finish = fs.readFileSync(finishPath, 'utf8');

finish = finish.replace(/#D4AF65/g, '#D6BC8A');
finish = finish.replace(/#B89245/g, '#D6BC8A');
finish = finish.replace(/#101D35/g, '#101C35');
finish = finish.replace(/#162542/g, '#1B2943');
finish = finish.replace(/#28395A/g, '#263654');
finish = finish.replaceAll('text-white', 'text-[#F5F1E8]');
finish = finish.replaceAll('text-slate-300', 'text-[#A0AEC0]');
finish = finish.replaceAll('text-slate-400', 'text-[#6B7C96]');

fs.writeFileSync(finishPath, finish, 'utf8');
console.log('FinishingShowcasePage updated.');
