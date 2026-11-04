const fs = require('fs');
['client/src/layouts/AdminLayout.jsx', 'client/src/pages/admin/AdminLoginPage.jsx'].forEach(p => {
  let content = fs.readFileSync(p, 'utf8');
  content = content.replace(/<Logo variant="light"/g, '<Logo variant="default"');
  fs.writeFileSync(p, content, 'utf8');
  console.log('Updated ' + p);
});
