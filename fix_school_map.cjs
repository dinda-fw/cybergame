const fs = require('fs');
const file = '/Users/mac/Downloads/cybergame/src/screens/SchoolMap.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Update MISSIONS array coordinates
content = content.replace(/id: 'aula'[\s\S]*?wx: \d+, wy: \d+/, `id: 'aula', label: 'Aula Sekolah', misi: 'Misi 1',\n    route: 'mission_aula', missionId: 'mission_aula', levelRequired: 1,\n    wx: 600, wy: 390`);
content = content.replace(/id: 'kantin'[\s\S]*?wx: \d+, wy: \d+/, `id: 'kantin', label: 'Kantin Sekolah', misi: 'Misi 2',\n    route: 'mission_kantin', missionId: 'mission_kantin', levelRequired: 2,\n    wx: 600, wy: 1605`);
content = content.replace(/id: 'serverroom'[\s\S]*?wx: \d+, wy: \d+/, `id: 'serverroom', label: 'Ruang Server', misi: 'Misi 3',\n    route: 'mission_serverroom', missionId: 'mission_serverroom', levelRequired: 3,\n    wx: 2600, wy: 1605`);
content = content.replace(/id: 'ruangguru'[\s\S]*?wx: \d+, wy: \d+/, `id: 'ruangguru', label: 'Ruang Guru', misi: 'Misi 4',\n    route: 'mission_ruangguru', missionId: 'mission_ruangguru', levelRequired: 4,\n    wx: 1100, wy: 390`);
content = content.replace(/id: 'labkomputer'[\s\S]*?wx: \d+, wy: \d+/, `id: 'labkomputer', label: 'Lab Komputer', misi: 'Misi 5',\n    route: 'mission_labkomputer', missionId: 'mission_labkomputer', levelRequired: 5,\n    wx: 2600, wy: 390`);

// 2. Add SVG loading in preload()
content = content.replace(/preload\(\) \{\n\s*this\._genTextures\(\);\n\s*\}/, `preload() {\n          this._genTextures();\n          this.load.svg('bld_labkomputer', 'assets/refrencebuilding/labkom.svg');\n          this.load.svg('bld_serverroom', 'assets/refrencebuilding/ruangserver.svg');\n          this.load.svg('bld_ruangguru', 'assets/refrencebuilding/ruangguru.svg');\n          this.load.svg('bld_kantin', 'assets/refrencebuilding/kantin.svg');\n        }`);

// 3. Replace _drawGrassAndRoads body
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
        }`;

content = content.replace(/_drawGrassAndRoads\(\) \{[\s\S]*?\}\n\n\s*_createFountain\(\)/, newGrassAndRoads + '\n\n        _createFountain()');

// 4. Update Fountain position
content = content.replace(/const cx = WORLD_W\/2, cy = 580;/, 'const cx = WORLD_W/2, cy = 1200;');

// 5. Replace _createBuildings
content = content.replace(/switch \(m\.id\) \{[\s\S]*?\}/, `if (m.id === 'aula') {
                this._drawAula(g, m, locked);
              } else {
                this.add.image(m.wx, m.wy, 'bld_' + m.id).setDepth(3);
              }`);

// 6. Update Decoration coordinates (Trees, lamps, benches, flowers)
// Since we have fixed structures in the script, we replace the decoration code inside _createDecorations()
content = content.replace(/_createDecorations\(\) \{[\s\S]*?\}\n\n\s*\/\/\s*═*?\n\s*\_createBuildings\(\)/, `_createDecorations() {
          TREE_POSITIONS.forEach(([x, y]) => {
            const tree = this.add.image(x, y, 'tree').setDepth(3).setScale(1.8);
            this.tweens.add({
              targets: tree, scaleX: 1.85, scaleY: 1.75,
              duration: Phaser.Math.Between(1500, 2200), yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
            });
            const tb = this.physics.add.staticImage(x, y + 20, 'pixel');
            tb.setDisplaySize(20, 20).refreshBody();
            this._colliders.push(tb);
          });

          const lamps = [
            [600, 400], [1600, 400], [2600, 400],
            [600, 800], [1600, 800], [2600, 800],
            [600, 1600], [1600, 1600], [2600, 1600],
            [600, 2000], [1600, 2000], [2600, 2000]
          ];
          lamps.forEach(([x, y]) => this.add.image(x, y, 'lamp').setDepth(2));

          // Benches near fountain
          [[1400, 1200], [1800, 1200], [1400, 1280], [1800, 1280]].forEach(([x, y]) =>
            this.add.image(x, y, 'bench').setDepth(2)
          );

          // Fixed flower clusters
          [
            [550,550],[650,550],[1550,550],[1650,550],[2550,550],[2650,550],
            [550,1750],[650,1750],[1550,1750],[1650,1750],[2550,1750],[2650,1750],
          ].forEach(([x, y]) => this.add.image(x, y, 'flower').setDepth(1));
        }

        // ══════════════════════════════════════════════════════════════════════
        _createBuildings()`);

fs.writeFileSync(file, content);
console.log('Successfully updated SchoolMap.jsx');
