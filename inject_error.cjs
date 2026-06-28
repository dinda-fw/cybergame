const fs = require('fs');
const file = '/Users/mac/Downloads/cybergame/src/screens/SchoolMap.jsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('window.onerror')) {
  content = content.replace("import React, { useEffect", "window.onerror = function(m,s,l,c,e) { alert('Runtime Error: ' + m + '\\nLine: ' + l); };\nimport React, { useEffect");
  fs.writeFileSync(file, content);
  console.log('Injected onerror');
}
