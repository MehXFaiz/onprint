const fs = require('fs');
const path = require('path');

// 1. stickerLinkableGuidesData.js
const guidePath = path.join(__dirname, '..', 'src', 'data', 'stickerLinkableGuidesData.js');
if (fs.existsSync(guidePath)) {
  let content = fs.readFileSync(guidePath, 'utf8');
  content = content.replace(/text-\[#D4AF65\]/g, 'text-[#795C43]');
  fs.writeFileSync(guidePath, content, 'utf8');
  console.log('Updated stickerLinkableGuidesData.js');
}

// 2. notificationService.js
['src/services/notificationService.js', 'src/utils/notificationService.js'].forEach(p => {
  const file = path.join(__dirname, '..', p);
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content
      .replace(/background-color: #101D35;/g, 'background-color: #795C43;')
      .replace(/color: #101D35;/g, 'color: #FFFFFF;')
      .replace(/background-color: #D4AF65;/g, 'background-color: #795C43;')
      .replace(/border-bottom: 3px solid #D4AF65;/g, 'border-bottom: 3px solid #C5A989;')
      .replace(/border-left: 4px solid #D4AF65;/g, 'border-left: 4px solid #795C43;')
      .replace(/style="color: #D4AF65;/g, 'style="color: #795C43;')
      .replace(/rgba\(212,175,101,0\.4\)/g, 'rgba(121,92,67,0.3)');
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated ' + p);
  }
});
