const fs = require('fs');
const sql = fs.readFileSync('onprintdb.sql', 'utf8');

// Find all categories inserted in sql
const catMatches = sql.match(/INSERT INTO `categories`[\s\S]*?;/);
if (catMatches) {
  console.log(catMatches[0].slice(0, 1000));
}

// Find lines with stationery or office in onprintdb.sql
const lines = sql.split('\n');
lines.forEach((line, i) => {
  if (line.includes('office-stationery') || line.includes('cat-office-stationery') || line.includes('Stationery')) {
    console.log(i + 1, line.slice(0, 120));
  }
});
