const fs = require('fs');
const path = require('path');

// 1. LoginPage.jsx
const loginPath = path.join(__dirname, '..', 'client', 'src', 'pages', 'public', 'LoginPage.jsx');
let login = fs.readFileSync(loginPath, 'utf8');
login = login.replace(/#D4AF65/g, '#D6BC8A');
login = login.replace(/#B89245/g, '#D6BC8A');
login = login.replace(/#101D35/g, '#101C35');
login = login.replace(/#162542/g, '#1B2943');
login = login.replace(/#28395A/g, '#263654');
login = login.replaceAll('text-white', 'text-[#F5F1E8]');
login = login.replaceAll('text-slate-400', 'text-[#A0AEC0]');
login = login.replaceAll('text-slate-200', 'text-[#F5F1E8]');
fs.writeFileSync(loginPath, login, 'utf8');

// 2. RegisterPage.jsx
const registerPath = path.join(__dirname, '..', 'client', 'src', 'pages', 'public', 'RegisterPage.jsx');
let reg = fs.readFileSync(registerPath, 'utf8');
reg = reg.replace(/#D4AF65/g, '#D6BC8A');
reg = reg.replace(/#B89245/g, '#D6BC8A');
reg = reg.replace(/#101D35/g, '#101C35');
reg = reg.replace(/#162542/g, '#1B2943');
reg = reg.replace(/#28395A/g, '#263654');
reg = reg.replaceAll('text-white', 'text-[#F5F1E8]');
reg = reg.replaceAll('text-slate-400', 'text-[#A0AEC0]');
reg = reg.replaceAll('text-slate-200', 'text-[#F5F1E8]');
fs.writeFileSync(registerPath, reg, 'utf8');

console.log('Auth pages updated to luxury dark navy theme.');
