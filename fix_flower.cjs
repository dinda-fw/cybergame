const fs = require('fs');
const file = '/Users/mac/Downloads/cybergame/src/screens/SchoolMap.jsx';
let content = fs.readFileSync(file, 'utf8');

const badPartRegex = /\/\/\s*──\s*Flower\s*──.*?_drawGround\(\)\s*\{/s;

const replacement = `// ── Flower ──
          g.clear();
          g.fillStyle(0xfca5a5).fillCircle(4, 4, 3);
          g.fillStyle(0xf87171).fillCircle(2, 2, 3);
          g.fillStyle(0xef4444).fillCircle(6, 2, 3);
          g.fillStyle(0xdc2626).fillCircle(4, 5, 2);
          g.fillStyle(0x22c55e).fillRect(3, 4, 2, 5); // stem
          g.generateTexture('flower', 8, 8);
        }

        // ══════════════════════════════════════════════════════════════════════
        // WORLD GENERATION (Ground, Roads, Fences, Decor)
        // ══════════════════════════════════════════════════════════════════════
        _drawGround() {`;

content = content.replace(badPartRegex, replacement);
fs.writeFileSync(file, content);
console.log('Successfully fixed the Flower texture generation and _drawGround.');
