const fs = require('fs');
const path = require('path');

const files = [
  'src/App.jsx',
  'src/screens/Leaderboard.jsx'
];

files.forEach(file => {
  const fullPath = path.resolve(__dirname, file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    content = content.replace(/\\\$/g, '$');
    content = content.replace(/\\`/g, '`');
    fs.writeFileSync(fullPath, content);
    console.log("Fixed syntax in", file);
  }
});
