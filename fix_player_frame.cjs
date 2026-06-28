const fs = require('fs');
const file = '/Users/mac/Downloads/cybergame/src/screens/SchoolMap.jsx';
let content = fs.readFileSync(file, 'utf8');

const drawPlayerFrameStr = `        // ── Helper: Draw player frame to graphics ─────────────────────
        _drawPlayerFrame(g, dir, frame) {
          // Shadow
          g.fillStyle(0x000000, 0.2).fillEllipse(13, 36, 18, 6);
          // Legs
          g.fillStyle(0x1e293b);
          if (frame === 0) {
            g.fillRect(9, 28, 4, 10).fillRect(14, 28, 4, 10);
          } else {
            g.fillRect(9, 28, 4, 8).fillRect(14, 28, 4, 12);
          }
          // Body (School Uniform)
          g.fillStyle(0xf8fafc).fillRect(8, 14, 10, 14); // White shirt
          g.fillStyle(0x0f172a).fillRect(8, 22, 10, 6);  // Dark pants/skirt
          // Head
          g.fillStyle(0xfcd34d).fillCircle(13, 10, 8);
          // Hair
          g.fillStyle(0x451a03);
          if (dir === 'down') {
            g.fillRect(5, 2, 16, 6).fillRect(5, 6, 4, 6).fillRect(17, 6, 4, 6);
            // Eyes
            g.fillStyle(0x000000).fillRect(9, 10, 2, 2).fillRect(15, 10, 2, 2);
          } else if (dir === 'up') {
            g.fillRect(5, 2, 16, 12);
          } else if (dir === 'left') {
            g.fillRect(5, 2, 14, 6).fillRect(15, 6, 4, 10);
            g.fillStyle(0x000000).fillRect(8, 10, 2, 2);
          } else if (dir === 'right') {
            g.fillRect(7, 2, 14, 6).fillRect(7, 6, 4, 10);
            g.fillStyle(0x000000).fillRect(16, 10, 2, 2);
          }
        }

        // ══════════════════════════════════════════════════════════════════════
        // WORLD GENERATION (Ground, Roads, Fences, Decor)
        // ══════════════════════════════════════════════════════════════════════
        _drawGround() {`;

content = content.replace(/\/\/\s*══════════════════════════════════════════════════════════════════════\s*\/\/\s*WORLD GENERATION \(Ground, Roads, Fences, Decor\)\s*\/\/\s*══════════════════════════════════════════════════════════════════════\s*_drawGround\(\) \{/, drawPlayerFrameStr);

// I will also remove the visual error handler to restore it to normal
content = content.replace(/window\.onerror = function[\s\S]*?document\.body\.appendChild\(errDiv\);\n};\n/, "");

fs.writeFileSync(file, content);
console.log("Fixed missing _drawPlayerFrame!");
