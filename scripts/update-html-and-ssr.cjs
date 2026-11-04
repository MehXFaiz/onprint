const fs = require('fs');
const path = require('path');

// 1. Update client/index.html
const htmlPath = path.join(__dirname, '..', 'client', 'index.html');
let htmlContent = fs.readFileSync(htmlPath, 'utf8');

htmlContent = htmlContent
  .replace(/content="#040A18"/g, 'content="#F5F0E7"')
  .replace(/background-color: #040A18 !important;/g, 'background-color: #F5F0E7 !important;')
  .replace(/color: #F5F2EB !important;/g, 'color: #352719 !important;')
  .replace(/background-color: #040A18;/g, 'background-color: #F5F0E7;')
  .replace(/color: #F5F3EE;/g, 'color: #352719;')
  .replace(/style="background-color: #040A18; color: #F5F3EE;/g, 'style="background-color: #F5F0E7; color: #352719;')
  .replace(/color: #D4AF65;/g, 'color: #795C43;');

fs.writeFileSync(htmlPath, htmlContent, 'utf8');
console.log('Successfully updated client/index.html');

// 2. Update src/app.js
const appPath = path.join(__dirname, '..', 'src', 'app.js');
let appContent = fs.readFileSync(appPath, 'utf8');

appContent = appContent
  .replace(/background: #040A18;/g, 'background: #F5F0E7;')
  .replace(/color: #F5F2EB;/g, 'color: #352719;')
  .replace(/background-color: #040A18;/g, 'background-color: #F5F0E7;')
  .replace(/color: #F5F3EE;/g, 'color: #352719;')
  .replace(/style="color: #D4AF65;/g, 'style="color: #795C43;')
  .replace(/background: #D4AF65;/g, 'background: #795C43; color: #FFFFFF;')
  .replace(/color: #101D35;/g, 'color: #FFFFFF;');

fs.writeFileSync(appPath, appContent, 'utf8');
console.log('Successfully updated src/app.js');
