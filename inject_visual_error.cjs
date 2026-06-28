const fs = require('fs');
const file = '/Users/mac/Downloads/cybergame/src/screens/SchoolMap.jsx';
let content = fs.readFileSync(file, 'utf8');

const errorOverlay = `window.onerror = function(m, s, l, c, e) {
  const errDiv = document.createElement('div');
  errDiv.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:#ff0000;color:#fff;z-index:999999;font-family:monospace;padding:20px;box-sizing:border-box;overflow:auto;';
  errDiv.innerHTML = '<h2>RUNTIME ERROR</h2><p><b>Message:</b> ' + m + '</p><p><b>Line:</b> ' + l + '</p><p><b>Stack:</b><br/>' + (e ? e.stack.replace(/\\n/g, '<br/>') : 'No stack') + '</p>';
  document.body.appendChild(errDiv);
};`;

content = content.replace(/window\.onerror.*?\n/, errorOverlay + '\n');
fs.writeFileSync(file, content);
