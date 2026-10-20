const fs = require('fs');
const path = require('path');

// 1. CategoriesPage.jsx
const catPagePath = path.join(__dirname, '..', 'client', 'src', 'pages', 'public', 'CategoriesPage.jsx');
let catPage = fs.readFileSync(catPagePath, 'utf8');

catPage = catPage.replace(/#D4AF65/g, '#D6BC8A');
catPage = catPage.replace(/#B89245/g, '#D6BC8A');
catPage = catPage.replace(/#101D35/g, '#101C35');
catPage = catPage.replace(/#162542/g, '#1B2943');
catPage = catPage.replace(/#28395A/g, '#263654');
fs.writeFileSync(catPagePath, catPage, 'utf8');

// 2. CategoryDetailPage.jsx
const catDetailPath = path.join(__dirname, '..', 'client', 'src', 'pages', 'public', 'CategoryDetailPage.jsx');
let catDetail = fs.readFileSync(catDetailPath, 'utf8');

catDetail = catDetail.replace(/#D4AF65/g, '#D6BC8A');
catDetail = catDetail.replace(/#B89245/g, '#D6BC8A');
catDetail = catDetail.replace(/#101D35/g, '#101C35');
catDetail = catDetail.replace(/#162542/g, '#1B2943');
catDetail = catDetail.replace(/#28395A/g, '#263654');
fs.writeFileSync(catDetailPath, catDetail, 'utf8');

console.log('Categories pages updated to luxury dark navy theme.');
