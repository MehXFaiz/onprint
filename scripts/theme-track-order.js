const fs = require('fs');
const path = require('path');

const trackPath = path.join(__dirname, '..', 'client', 'src', 'pages', 'public', 'TrackOrderPage.jsx');
let track = fs.readFileSync(trackPath, 'utf8');

track = track.replace(/#D4AF65/g, '#D6BC8A');
track = track.replace(/#B89245/g, '#D6BC8A');
track = track.replace(/#101D35/g, '#101C35');
track = track.replace(/#162542/g, '#1B2943');
track = track.replace(/#28395A/g, '#263654');
track = track.replace('bg-slate-50/50 min-h-[75vh]', 'bg-[#101C35] text-[#F5F1E8] min-h-[75vh]');
track = track.replaceAll('text-slate-300', 'text-[#A0AEC0]');
track = track.replaceAll('text-slate-400', 'text-[#6B7C96]');

fs.writeFileSync(trackPath, track, 'utf8');
console.log('TrackOrderPage updated to luxury dark navy theme.');
