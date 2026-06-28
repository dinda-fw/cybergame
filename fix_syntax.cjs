const fs = require('fs');
const file = '/Users/mac/Downloads/cybergame/src/screens/SchoolMap.jsx';
let content = fs.readFileSync(file, 'utf8');

const startIdx = content.indexOf('_drawGrassAndRoads() {');
const endIdx = content.indexOf('_createFountain() {');

if (startIdx !== -1 && endIdx !== -1) {
  const newGrassAndRoads = `        _drawGrassAndRoads() {
          const g = this.add.graphics().setDepth(0);
          
          // Background Grass
          g.fillStyle(0x65a30d).fillRect(0, 0, WORLD_W, WORLD_H);
          g.fillStyle(0x4d7c0f, 0.4);
          for (let i = 0; i < 600; i++) {
            g.fillRect(Phaser.Math.Between(0, WORLD_W), Phaser.Math.Between(0, WORLD_H),
                       Phaser.Math.Between(2, 6), Phaser.Math.Between(2, 6));
          }

          const roadColor = 0x475569;
          const roadW = 112;
          const roadH = roadW/2;
          const swW = 34;

          // H-Shape road layout
          // Roads
          g.fillStyle(roadColor);
          g.fillRect(600 - roadH, 600 - roadH, 2000 + roadW, roadW); // Top Horizontal
          g.fillRect(600 - roadH, 1800 - roadH, 2000 + roadW, roadW); // Bottom Horizontal
          g.fillRect(600 - roadH, 600 - roadH, roadW, 1200 + roadW); // Left Vertical
          g.fillRect(2600 - roadH, 600 - roadH, roadW, 1200 + roadW); // Right Vertical
          g.fillRect(1600 - roadH, 600 - roadH, roadW, 1800 + roadW); // Main Vertical

          // Central Plaza
          g.fillStyle(0xb0bec5);
          g.fillRect(1300, 900, 600, 600); // 600x600 plaza at (1600, 1200)

          // Sidewalks
          g.fillStyle(0xb0bec5);
          
          // Horizontal Sidewalks
          g.fillRect(600 - roadH - swW, 600 - roadH - swW, 2000 + roadW + swW*2, swW); // Top H Top
          g.fillRect(600 - roadH - swW, 600 + roadH, 2000 + roadW + swW*2, swW); // Top H Bot
          g.fillRect(600 - roadH - swW, 1800 - roadH - swW, 2000 + roadW + swW*2, swW); // Bot H Top
          g.fillRect(600 - roadH - swW, 1800 + roadH, 2000 + roadW + swW*2, swW); // Bot H Bot
          
          // Vertical Sidewalks
          g.fillRect(600 - roadH - swW, 600 - roadH - swW, swW, 1200 + roadW + swW*2); // Left V Left
          g.fillRect(600 + roadH, 600 - roadH - swW, swW, 1200 + roadW + swW*2); // Left V Right
          g.fillRect(2600 - roadH - swW, 600 - roadH - swW, swW, 1200 + roadW + swW*2); // Right V Left
          g.fillRect(2600 + roadH, 600 - roadH - swW, swW, 1200 + roadW + swW*2); // Right V Right
          g.fillRect(1600 - roadH - swW, 600 - roadH - swW, swW, 1800 + roadW + swW*2); // Main V Left
          g.fillRect(1600 + roadH, 600 - roadH - swW, swW, 1800 + roadW + swW*2); // Main V Right

          // Fix intersections (draw road over sidewalk where they cross)
          g.fillStyle(roadColor);
          g.fillRect(600 - roadH - swW, 600 - roadH, roadW + swW*2, roadW); // Top-Left
          g.fillRect(1600 - roadH - swW, 600 - roadH, roadW + swW*2, roadW); // Top-Mid
          g.fillRect(2600 - roadH - swW, 600 - roadH, roadW + swW*2, roadW); // Top-Right
          g.fillRect(600 - roadH - swW, 1800 - roadH, roadW + swW*2, roadW); // Bot-Left
          g.fillRect(1600 - roadH - swW, 1800 - roadH, roadW + swW*2, roadW); // Bot-Mid
          g.fillRect(2600 - roadH - swW, 1800 - roadH, roadW + swW*2, roadW); // Bot-Right
          
          // Connect Main Vertical through Plaza (drawn on top of plaza)
          g.fillRect(1600 - roadH, 600 - roadH, roadW, 1800 + roadW);

          // Zebra crosswalks 
          g.fillStyle(0xf8fafc, 0.85);
          const zebraW = 14;
          const drawZebra = (cx, cy) => {
            for (let i = 0; i < 5; i++) {
              g.fillRect(cx - roadH + i * 24, cy - roadH - swW, zebraW, swW); // North
              g.fillRect(cx - roadH + i * 24, cy + roadH, zebraW, swW);       // South
              g.fillRect(cx - roadH - swW, cy - roadH + i * 24, swW, zebraW); // West
              g.fillRect(cx + roadH, cy - roadH + i * 24, swW, zebraW);       // East
            }
          };
          drawZebra(600, 600); drawZebra(1600, 600); drawZebra(2600, 600);
          drawZebra(600, 1800); drawZebra(1600, 1800); drawZebra(2600, 1800);

          // ── Parking lot ──
          g.fillStyle(0x94a3b8, 0.5).fillRect(100, WORLD_H - 400, 200, 380);
          g.fillStyle(0xffffff, 0.8);
          for (let i = 0; i < 6; i++) g.fillRect(100, WORLD_H - 400 + i * 63, 200, 3);
          g.fillRect(300, WORLD_H - 400, 3, 380);
          // Car outlines in parking
          [[120, WORLD_H - 380],[120, WORLD_H - 315],[120, WORLD_H - 252]].forEach(([x,y])=>{
            g.fillStyle(0xbfdbfe,0.6).fillRoundedRect(x,y,60,50,5);
            g.fillStyle(0x7dd3fc,0.4).fillRoundedRect(x+6,y+8,48,24,4);
          });

          // ── School gate arch (bottom center) ──
          g.fillStyle(0xfef3c7, 0.55).fillRect(WORLD_W/2 - 180, WORLD_H - 280, 360, 280);
          g.fillStyle(0xfbbf24);
          g.fillRect(WORLD_W/2 - 90, WORLD_H - 240, 36, 100);
          g.fillRect(WORLD_W/2 + 54, WORLD_H - 240, 36, 100);
          g.fillStyle(0xf59e0b);
          g.fillRect(WORLD_W/2 - 90, WORLD_H - 256, 36, 36);
          g.fillRect(WORLD_W/2 + 54, WORLD_H - 256, 36, 36);
          this.add.text(WORLD_W/2, WORLD_H - 260, 'GERBANG SEKOLAH', {
            fontSize: '18px', fontFamily: '"Inter", sans-serif',
            fontStyle: 'bold', color: '#78350f', stroke: '#fef9c3', strokeThickness: 3
          }).setOrigin(0.5).setDepth(3);

          // ── Directional signs ──
          [
            [WORLD_W/2 + 200, 1000, '→ Lab & Server Room →', '#1e3a8a'],
            [WORLD_W/2 - 200, 1000, '← Ruang Guru & Kantin ←', '#7c2d12'],
            [WORLD_W/2, WORLD_H - 320, '▼ Gerbang Sekolah', '#dc2626'],
            [WORLD_W/2, 500, '▲ Aula Sekolah', '#4c1d95'],
          ].forEach(([x, y, txt, col]) => {
            const sg = this.add.graphics().setDepth(4);
            sg.fillStyle(0xfef9c3, 0.95).fillRoundedRect(-80, -26, 160, 52, 8);
            sg.lineStyle(2, 0xca8a04).strokeRoundedRect(-80, -26, 160, 52, 8);
            sg.x = x; sg.y = y;
            this.add.text(x, y, txt, {
              fontSize: '12px', fontFamily: '"Inter", sans-serif',
              fontStyle: 'bold', color: col, align: 'center'
            }).setOrigin(0.5).setDepth(5);
          });

          // ── Flag pole ──
          const fp = this.add.graphics().setDepth(3);
          fp.fillStyle(0x64748b).fillRect(-4, -110, 8, 110);
          fp.fillStyle(0xef4444).fillRect(0, -110, 44, 19.5); // Indonesian Flag (Red on top)
          fp.fillStyle(0xffffff).fillRect(0, -90.5, 44, 19.5); // Indonesian Flag (White on bottom)
          fp.x = WORLD_W/2; fp.y = 1100;
          this.tweens.add({ targets: fp, scaleX: 0.92, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
        }

        `;
  content = content.substring(0, startIdx) + newGrassAndRoads + content.substring(endIdx);
  fs.writeFileSync(file, content);
  console.log('Successfully replaced _drawGrassAndRoads and removed the syntax error.');
} else {
  console.log('Could not find start or end index.');
}
