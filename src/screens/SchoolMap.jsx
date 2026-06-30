/**
 * SchoolMap.jsx
 * Interactive 2D campus map powered by Phaser 3 inside a React component.
 * Features: walking avatar, building collision, NPC dialog, mission locks,
 * animated decorations, React UI overlay, and a virtual D-Pad for mobile.
 */
import React, { useEffect, useRef, useState } from 'react';
import Header from '../components/Header';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, X } from 'lucide-react';
// ─── Virtual World Dimensions (pixels) ───────────────────────────────────────
const WORLD_W = 3200;
const WORLD_H = 2400;

// ─── Mission Building Definitions ────────────────────────────────────────────
const MISSIONS = [
  {
    id: 'aula', label: 'Aula Sekolah', misi: 'Misi 1',
    route: 'mission_aula', missionId: 'mission_aula', levelRequired: 1,
    wx: 600, wy: 335, bw: 340, bh: 240,
    color: 0x7C3AED, roof: 0x5B21B6, cssColor: '#7C3AED',
  },
  {
    id: 'kantin', label: 'Kantin Sekolah', misi: 'Misi 2',
    route: 'mission_kantin', missionId: 'mission_kantin', levelRequired: 2,
    wx: 600, wy: 2050, bw: 300, bh: 210,
    color: 0xD97706, roof: 0xB45309, cssColor: '#D97706',
  },
  {
    id: 'serverroom', label: 'Ruang Server', misi: 'Misi 3',
    route: 'mission_serverroom', missionId: 'mission_serverroom', levelRequired: 3,
    wx: 2600, wy: 2050, bw: 300, bh: 210,
    color: 0x059669, roof: 0x047857, cssColor: '#059669',
  },
  {
    id: 'ruangguru', label: 'Ruang Guru', misi: 'Misi 4',
    route: 'mission_ruangguru', missionId: 'mission_ruangguru', levelRequired: 4,
    wx: 2600, wy: 350, bw: 300, bh: 210,
    color: 0xDC2626, roof: 0xB91C1C, cssColor: '#DC2626',
  },
  {
    id: 'labkomputer', label: 'Lab Komputer', misi: 'Misi 5',
    route: 'mission_labkomputer', missionId: 'mission_labkomputer', levelRequired: 5,
    wx: 1600, wy: 350, bw: 300, bh: 210,
    color: 0x2563EB, roof: 0x1D4ED8, cssColor: '#2563EB',
  }
];

// ─── NPC Data ─────────────────────────────────────────────────────────────────
const NPCS = [
  {
    id: 'penjaga', name: 'Pak Aris', role: 'Penjaga Sekolah',
    wx: 1600, wy: 1400, bodyColor: 0x1e40af,
    dialog: '👋 Selamat datang di CyberShield Game! Jaga keamanan data kamu ya di dunia digital. Jalankan misi sesuai petunjuk yg diberikan',
  },
  {
    id: 'guru', name: 'Bu Umi', role: 'Guru TKJ',
    wx: 1100, wy: 680, bodyColor: 0x7c3aed,
    dialog: 'Ingat! Jangan lupa literasi digitalnya di tingkatkan agar tidak mudah terkena phising',
  },
  {
    id: 'it', name: 'Pak Edi', role: 'Admin Jaringan',
    wx: 2600, wy: 1850, bodyColor: 0x065f46,
    dialog: 'Jika ada kasus mengenai keamanan jaringan dan data, silahkan laporkan ke saya.',
  },
  {
    id: 'siswa', name: 'Alya', role: 'Siswa Kelas XI',
    wx: 600, wy: 1850, bodyColor: 0xc2410c,
    dialog: '😊 Hei! Aku udah selesaiin misi Kantin nih! Jangan pernah klik WIFI publik sembarangan yaa agar datamu tidak di curi!',
  },
];

// ─── Fixed tree positions (no random, consistent layout) ──────────────────────
const TREE_POSITIONS = [
  // Around fountain / center yard
  [1380, 430], [1820, 430], [1380, 730], [1820, 730],
  // Road edges - left column
  [180, 950], [180, 1100], [180, 1250], [180, 1400], [180, 1550],
  // Road edges - right column
  [3020, 950], [3020, 1100], [3020, 1250], [3020, 1400], [3020, 1550],
  // Top road sides
  [850, 200], [1050, 200], [1250, 200], [1600, 200], [1950, 200], [2150, 200], [2350, 200],
  // Bottom area
  [850, 2250], [1050, 2250], [1250, 2250], [1950, 2250], [2150, 2250],
  // Near buildings
  [330, 420], [680, 420], [330, 780], [680, 780],
  [2520, 420], [2920, 420], [2520, 780], [2920, 780],
  [330, 1580], [680, 1580], [330, 1940], [680, 1940],
  [2520, 1580], [2920, 1580], [2520, 1940], [2920, 1940],
];

// ─── Lamp positions (not currently used in scene — lamps are placed inline) ───

// ─────────────────────────────────────────────────────────────────────────────
// REACT COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const SchoolMap = ({ navigate, gameState, username }) => {
  const containerRef = useRef(null);
  const gameRef = useRef(null);
  const bridgeRef = useRef({
    navigate, gameState, username,
    setNearby: null, setDialog: null,
    dpad: { up: false, down: false, left: false, right: false }
  });

  const [nearby, setNearby] = useState(null);
  const [dialog, setDialog] = useState(null);
  const [notification, setNotification] = useState(null);
  const notifTimer = useRef(null);

  bridgeRef.current.navigate = navigate;
  bridgeRef.current.gameState = gameState;
  bridgeRef.current.username = username;
  bridgeRef.current.setNearby = setNearby;
  bridgeRef.current.setDialog = setDialog;
  // ── Phaser initialization ──────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;
    const bridge = bridgeRef; // captured once; always reads .current inside Phaser

    import('phaser').then(({ default: Phaser }) => {
      if (!containerRef.current || gameRef.current) return;

      // ════════════════════════════════════════════════════════════════════════
      // PHASER SCENE
      // ════════════════════════════════════════════════════════════════════════
      class CampusScene extends Phaser.Scene {
        constructor() { super({ key: 'CampusScene' }); }

        // ── Preload: generate all textures procedurally ─────────────────────
        preload() {
          this._genTextures();
          this.load.svg('bld_labkomputer', 'assets/refrencebuilding/labkom.svg');
          this.load.svg('bld_serverroom', 'assets/refrencebuilding/ruangserver.svg');
          this.load.svg('bld_ruangguru', 'assets/refrencebuilding/ruangguru.svg');
          this.load.svg('bld_kantin', 'assets/refrencebuilding/kantin.svg');
        }

        // ── Create: build the world ─────────────────────────────────────────
        create() {
          // ⚠️ CRITICAL: set physics world bounds to full virtual world size,
          // otherwise setCollideWorldBounds() only blocks at canvas pixel boundary
          this.physics.world.setBounds(0, 0, WORLD_W, WORLD_H);

          this._drawGround();
          this._createFountain();
          this._createDecorations();
          this._createBuildings();
          this._createNPCs();
          this._createPlayer();
          this._setupCamera();
          this._setupInput();

          // Scene state
          this._walkFrame = 0;
          this._walkTick = 0;
          this._lastDir = 'down';
          this._isMoving = false;
          this._nearbyBld = null;
          this._glowStates = {};   // track glow per building to avoid per-frame tween spam

        }

        // ── Update: called every frame ──────────────────────────────────────
        update() {
          this._movePlayer();
          this._updateAnim();
          this._checkProximity();

          if (this._playerNameText) {
            this._playerNameText.setPosition(this._player.x, this._player.y - 45);
          }
        }

        // ══════════════════════════════════════════════════════════════════════
        // TEXTURE GENERATION (procedural, no external assets)
        // ══════════════════════════════════════════════════════════════════════
        _genTextures() {
          const g = this.make.graphics({ x: 0, y: 0, add: false });

          // ── 1px transparent pixel (used for invisible collision bodies) ──
          g.clear().fillStyle(0xffffff, 0).fillRect(0, 0, 1, 1);
          g.generateTexture('pixel', 1, 1);

          // ── Player sprite frames: 4 directions × 2 walk frames ───────────
          ['down', 'up', 'left', 'right'].forEach(dir => {
            [0, 1].forEach(frame => {
              g.clear();
              this._drawPlayerFrame(g, dir, frame);
              g.generateTexture(`p-${dir}-${frame}`, 26, 40);
            });
          });

          // ── Tree ─────────────────────────────────────────────────────────
          g.clear();
          // Trunk
          g.fillStyle(0x713f12).fillRect(11, 30, 10, 16);
          // Shadow
          g.fillStyle(0x000000, 0.15).fillEllipse(16, 47, 20, 6);
          // Leaves layers
          g.fillStyle(0x16a34a).fillCircle(16, 26, 17);
          g.fillStyle(0x15803d, 0.7).fillCircle(9, 32, 11).fillCircle(23, 30, 11);
          g.fillStyle(0x22c55e, 0.6).fillCircle(16, 20, 11);
          g.fillStyle(0x4ade80, 0.4).fillCircle(16, 16, 7);
          g.generateTexture('tree', 32, 48);

          // ── Lamp ─────────────────────────────────────────────────────────
          g.clear();
          g.fillStyle(0x475569).fillRect(5, 15, 6, 32); // pole
          g.fillStyle(0x334155).fillRect(2, 11, 12, 6);  // arm
          g.fillStyle(0xfef9c3).fillCircle(8, 10, 9);    // bulb
          g.fillStyle(0xfef3c7, 0.5).fillCircle(8, 10, 14); // glow
          g.generateTexture('lamp', 16, 47);

          // ── Bench ────────────────────────────────────────────────────────
          g.clear();
          g.fillStyle(0x92400e).fillRect(0, 12, 44, 7);  // seat
          g.fillStyle(0x78350f).fillRect(3, 19, 5, 9).fillRect(36, 19, 5, 9); // legs
          g.fillStyle(0xa16207).fillRect(0, 5, 44, 7);   // back rest
          g.generateTexture('bench', 44, 28);

          // ── Fountain ─────────────────────────────────────────────────────
          g.clear();
          // Outer basin
          g.fillStyle(0x1e3a8a, 0.9).fillCircle(64, 64, 64);
          g.fillStyle(0x1d4ed8, 0.8).fillCircle(64, 64, 54);
          g.fillStyle(0x2563eb, 0.8).fillCircle(64, 64, 42);
          g.fillStyle(0x3b82f6, 0.7).fillCircle(64, 64, 30);
          g.fillStyle(0x60a5fa, 0.8).fillCircle(64, 64, 18);
          g.fillStyle(0x93c5fd, 0.9).fillCircle(64, 64, 9);
          g.fillStyle(0xe0f2fe, 1).fillCircle(64, 64, 5);
          g.generateTexture('fountain', 128, 128);

          // ── Flower ──
          g.clear();
          g.fillStyle(0xfca5a5).fillCircle(4, 4, 3);
          g.fillStyle(0xf87171).fillCircle(2, 2, 3);
          g.fillStyle(0xef4444).fillCircle(6, 2, 3);
          g.fillStyle(0xdc2626).fillCircle(4, 5, 2);
          g.fillStyle(0x22c55e).fillRect(3, 4, 2, 5); // stem
          g.generateTexture('flower', 8, 8);
        }

        // ── Helper: Draw player frame to graphics ─────────────────────
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
        _drawGround() {
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
          const roadH = roadW / 2;
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
          g.fillRect(600 - roadH - swW, 600 - roadH - swW, 2000 + roadW + swW * 2, swW); // Top H Top
          g.fillRect(600 - roadH - swW, 600 + roadH, 2000 + roadW + swW * 2, swW); // Top H Bot
          g.fillRect(600 - roadH - swW, 1800 - roadH - swW, 2000 + roadW + swW * 2, swW); // Bot H Top
          g.fillRect(600 - roadH - swW, 1800 + roadH, 2000 + roadW + swW * 2, swW); // Bot H Bot

          // Vertical Sidewalks
          g.fillRect(600 - roadH - swW, 600 - roadH - swW, swW, 1200 + roadW + swW * 2); // Left V Left
          g.fillRect(600 + roadH, 600 - roadH - swW, swW, 1200 + roadW + swW * 2); // Left V Right
          g.fillRect(2600 - roadH - swW, 600 - roadH - swW, swW, 1200 + roadW + swW * 2); // Right V Left
          g.fillRect(2600 + roadH, 600 - roadH - swW, swW, 1200 + roadW + swW * 2); // Right V Right
          g.fillRect(1600 - roadH - swW, 600 - roadH - swW, swW, 1800 + roadW + swW * 2); // Main V Left
          g.fillRect(1600 + roadH, 600 - roadH - swW, swW, 1800 + roadW + swW * 2); // Main V Right

          // Fix intersections (draw road over sidewalk where they cross)
          g.fillStyle(roadColor);
          g.fillRect(600 - roadH - swW, 600 - roadH, roadW + swW * 2, roadW); // Top-Left
          g.fillRect(1600 - roadH - swW, 600 - roadH, roadW + swW * 2, roadW); // Top-Mid
          g.fillRect(2600 - roadH - swW, 600 - roadH, roadW + swW * 2, roadW); // Top-Right
          g.fillRect(600 - roadH - swW, 1800 - roadH, roadW + swW * 2, roadW); // Bot-Left
          g.fillRect(1600 - roadH - swW, 1800 - roadH, roadW + swW * 2, roadW); // Bot-Mid
          g.fillRect(2600 - roadH - swW, 1800 - roadH, roadW + swW * 2, roadW); // Bot-Right

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
          [[120, WORLD_H - 380], [120, WORLD_H - 315], [120, WORLD_H - 252]].forEach(([x, y]) => {
            g.fillStyle(0xbfdbfe, 0.6).fillRoundedRect(x, y, 60, 50, 5);
            g.fillStyle(0x7dd3fc, 0.4).fillRoundedRect(x + 6, y + 8, 48, 24, 4);
          });

          // ── School gate arch (bottom center) ──
          g.fillStyle(0xfef3c7, 0.55).fillRect(WORLD_W / 2 - 180, WORLD_H - 280, 360, 280);
          g.fillStyle(0xfbbf24);
          g.fillRect(WORLD_W / 2 - 90, WORLD_H - 240, 36, 100);
          g.fillRect(WORLD_W / 2 + 54, WORLD_H - 240, 36, 100);
          g.fillStyle(0xf59e0b);
          g.fillRect(WORLD_W / 2 - 90, WORLD_H - 256, 36, 36);
          g.fillRect(WORLD_W / 2 + 54, WORLD_H - 256, 36, 36);
          this.add.text(WORLD_W / 2, WORLD_H - 260, 'GERBANG SEKOLAH', {
            fontSize: '18px', fontFamily: '"Inter", sans-serif',
            fontStyle: 'bold', color: '#78350f', stroke: '#fef9c3', strokeThickness: 3
          }).setOrigin(0.5).setDepth(3);

          // ── Directional signs ──
          [
            [WORLD_W / 2 + 200, 1000, '→ Lab & Server Room →', '#1e3a8a'],
            [WORLD_W / 2 - 200, 1000, '← Ruang Guru & Kantin ←', '#7c2d12'],
            [WORLD_W / 2, WORLD_H - 320, '▼ Gerbang Sekolah', '#dc2626'],
            [WORLD_W / 2, 500, '▲ Ruang Guru', '#4c1d95'],
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
          fp.x = WORLD_W / 2; fp.y = 1100;
          this.tweens.add({ targets: fp, scaleX: 0.92, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
        }

        _createFountain() {
          const cx = WORLD_W / 2, cy = 1200;
          const f = this.add.image(cx, cy, 'fountain').setScale(1.6).setDepth(2);
          // Animated water jets
          for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const jet = this.add.graphics().setDepth(3);
            jet.fillStyle(0x93c5fd, 0.75).fillEllipse(0, 0, 6, 20);
            jet.x = cx + Math.cos(angle) * 32;
            jet.y = cy + Math.sin(angle) * 22;
            this.tweens.add({
              targets: jet, y: jet.y - 26, alpha: 0.1,
              duration: 680 + i * 90, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
            });
          }
          // Fountain label
          this.add.text(cx, cy - 125, '⛲ Taman Sekolah', {
            fontSize: '16px', fontFamily: '"Inter", sans-serif', fontStyle: 'bold',
            color: '#064e3b', stroke: '#d1fae5', strokeThickness: 4,
          }).setOrigin(0.5).setDepth(4);
        }

        _createDecorations() {
          // Trees (wind sway tween on each)
          TREE_POSITIONS.forEach(([x, y]) => {
            const t = this.add.image(x, y, 'tree').setDepth(2);
            this.tweens.add({
              targets: t, scaleX: 1.04,
              duration: 1300 + ((x * y) % 500), yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
            });
          });

          // Street lamps
          const lamps = [
            [WORLD_W / 2 - 180, WORLD_H / 2 - 120], [WORLD_W / 2 + 180, WORLD_H / 2 - 120],
            [WORLD_W / 2 - 180, WORLD_H / 2 + 120], [WORLD_W / 2 + 180, WORLD_H / 2 + 120],
            [WORLD_W / 2, 390], [380, WORLD_H / 2], [WORLD_W - 380, WORLD_H / 2], [WORLD_W / 2, WORLD_H - 390],
            [780, 780], [2420, 780], [780, 1620], [2420, 1620],
          ];
          lamps.forEach(([x, y]) => this.add.image(x, y, 'lamp').setDepth(2));

          // Benches near buildings and fountain
          [[400, 2050], [800, 2050], [1300, 1150], [1900, 1150]].forEach(([x, y]) =>
            this.add.image(x, y, 'bench').setDepth(2)
          );

          // Fixed flower clusters
          [
            [350, 350], [400, 360], [370, 380],
            [2850, 350], [2900, 360], [2870, 380],
            [350, 1800], [400, 1810], [370, 1830],
            [2850, 1800], [2900, 1810], [2870, 1830],
            [WORLD_W / 2 - 450, 580], [WORLD_W / 2 + 450, 580],
            [WORLD_W / 2 - 450, 680], [WORLD_W / 2 + 450, 680],
            [700, 1200], [750, 1210], [720, 1230],
            [2450, 1200], [2500, 1210], [2470, 1230],
          ].forEach(([x, y]) => this.add.image(x, y, 'flower').setDepth(1));

          // (Extra buildings removed — only 5 mission buildings remain)
        }

        // ══════════════════════════════════════════════════════════════════════
        // BUILDING VISUAL SYSTEM — Reference: dist/assets/refrencebuilding/
        // Style: pixel-art semi-isometric, cream walls, teal roof, dark outline
        // ══════════════════════════════════════════════════════════════════════

        // ─── Palette (matches all 5 reference PNGs) ───────────────────────────
        // WALL_MAIN  : 0xD4B896  cream/peach main facade
        // WALL_SIDE  : 0xB89070  darker side (left depth face)
        // WALL_LIGHT : 0xE8D4B8  light highlight strip
        // ROOF_TOP   : 0x5BA88F  flat green teal roof surface
        // ROOF_SIDE  : 0x4A7A6A  darker teal (roof side face / fascia)
        // ROOF_EDGE  : 0x6B8FA8  blue-gray roof edging strip
        // WIN_GLASS  : 0xA8C8DC  blue-tinted window glass
        // WIN_FRAME  : 0x7898A8  window frame
        // WIN_SHINE  : 0xD8ECFA  window highlight
        // DOOR_WOOD  : 0x8B6040  wooden door
        // DOOR_DARK  : 0x5C3A1E  dark door frame
        // OUTLINE    : 0x2C2C2C  near-black outline
        // STEP_CLR   : 0xC8B090  step color
        // SIGN_BG    : 0xEEDDBB  signboard background

        /** Pixel-art style window with blue glass + outline */
        _win(g, x, y, w, h) {
          // Outer outline
          g.fillStyle(0x2C2C2C, 1).fillRect(x - 2, y - 2, w + 4, h + 4);
          // Frame (slightly lighter outline color)
          g.fillStyle(0x7898A8, 1).fillRect(x - 1, y - 1, w + 2, h + 2);
          // Glass
          g.fillStyle(0xA8C8DC, 1).fillRect(x, y, w, h);
          // Shine highlight (top-left corner)
          g.fillStyle(0xD8ECFA, 0.85).fillRect(x + 2, y + 2, Math.floor(w * 0.4), Math.floor(h * 0.35));
          // Cross divider
          g.fillStyle(0x7898A8, 1)
            .fillRect(x + Math.floor(w / 2) - 1, y, 2, h)
            .fillRect(x, y + Math.floor(h / 2) - 1, w, 2);
        }

        /** Small single window (for side panels) */
        _winSm(g, x, y, w = 28, h = 22) {
          g.fillStyle(0x2C2C2C, 1).fillRect(x - 2, y - 2, w + 4, h + 4);
          g.fillStyle(0x7898A8, 1).fillRect(x - 1, y - 1, w + 2, h + 2);
          g.fillStyle(0xA8C8DC, 1).fillRect(x, y, w, h);
          g.fillStyle(0xD8ECFA, 0.8).fillRect(x + 2, y + 2, Math.floor(w * 0.45), Math.floor(h * 0.4));
          g.fillStyle(0x7898A8, 1).fillRect(x + Math.floor(w / 2) - 1, y, 2, h);
        }

        /** Pixel-art wooden door */
        _door(g, cx, y, w = 40, h = 54) {
          // Outline
          g.fillStyle(0x2C2C2C, 1).fillRect(cx - w / 2 - 2, y - 2, w + 4, h + 4);
          // Frame
          g.fillStyle(0x5C3A1E, 1).fillRect(cx - w / 2 - 1, y - 1, w + 2, h + 2);
          // Left panel
          g.fillStyle(0x8B6040, 1).fillRect(cx - w / 2, y, w / 2 - 2, h);
          // Right panel
          g.fillStyle(0x9B7050, 1).fillRect(cx + 2, y, w / 2 - 2, h);
          // Door panels detail
          const ph = Math.floor(h * 0.35);
          g.fillStyle(0x7A5030, 0.5)
            .fillRect(cx - w / 2 + 4, y + 5, w / 2 - 8, ph)
            .fillRect(cx + 4, y + 5, w / 2 - 8, ph)
            .fillRect(cx - w / 2 + 4, y + ph + 10, w / 2 - 8, h - ph - 20)
            .fillRect(cx + 4, y + ph + 10, w / 2 - 8, h - ph - 20);
          // Handle
          g.fillStyle(0xD4A030, 1).fillCircle(cx - 3, y + h / 2, 4);
        }

        /** Concrete steps — pixel chunky style */
        _steps(g, cx, bottomY, w, count = 2, sh = 6) {
          for (let i = 0; i < count; i++) {
            const sw = w - i * 18;
            const sy = bottomY - (count - i) * sh;
            // Tread
            g.fillStyle(0xC8B090, 1).fillRect(cx - sw / 2, sy, sw, sh);
            // Riser (dark)
            g.fillStyle(0x2C2C2C, 0.3).fillRect(cx - sw / 2, sy + sh - 1, sw, 1);
            // Outline
            g.lineStyle(1, 0x2C2C2C, 0.4);
            g.strokeRect(cx - sw / 2, sy, sw, sh);
          }
        }

        /** Reference-style AC unit (boxy, pixel) */
        _ac(g, x, y, w = 38, h = 24) {
          g.fillStyle(0x2C2C2C, 1).fillRect(x - 1, y - 1, w + 2, h + 2);
          g.fillStyle(0xC0C8CC, 1).fillRect(x, y, w, h);
          g.fillStyle(0x8898A0, 1)
            .fillRect(x + 2, y + 6, w - 4, 2)
            .fillRect(x + 2, y + 10, w - 4, 2)
            .fillRect(x + 2, y + 14, w - 4, 2);
          g.fillStyle(0x5BA88F, 0.6).fillRect(x + w - 12, y + 2, 10, h - 4);
        }

        /** Signboard (flat white panel with dark text area) */
        _sign(g, cx, y, w, h = 28, text = '') {
          g.fillStyle(0x2C2C2C, 1).fillRect(cx - w / 2 - 2, y - 2, w + 4, h + 4);
          g.fillStyle(0x5C3A1E, 1).fillRect(cx - w / 2 - 1, y - 1, w + 2, h + 2);
          g.fillStyle(0xEEDDBB, 1).fillRect(cx - w / 2, y, w, h);
          // subtle inner border
          g.lineStyle(1, 0xA89070, 0.5);
          g.strokeRect(cx - w / 2 + 3, y + 3, w - 6, h - 6);
        }

        /** Pixel plant pot */
        _plant(g, x, y, scale = 1) {
          const s = scale;
          // Pot body
          g.fillStyle(0x2C2C2C, 1).fillRect(x - 9 * s, y - 10 * s, 18 * s, 16 * s);
          g.fillStyle(0xA05820, 1).fillRect(x - 8 * s, y - 9 * s, 16 * s, 14 * s);
          g.fillStyle(0xC07030, 0.5).fillRect(x - 6 * s, y - 9 * s, 6 * s, 4 * s);
          // Pot rim
          g.fillStyle(0x2C2C2C, 1).fillRect(x - 10 * s, y - 12 * s, 20 * s, 4 * s);
          g.fillStyle(0xC07030, 1).fillRect(x - 9 * s, y - 11 * s, 18 * s, 3 * s);
          // Plant
          g.fillStyle(0x2C2C2C, 1).fillCircle(x, y - 19 * s, 12 * s + 1);
          g.fillStyle(0x4A8A38, 1).fillCircle(x, y - 19 * s, 12 * s);
          g.fillStyle(0x5CAA48, 0.7).fillCircle(x - 4 * s, y - 22 * s, 8 * s);
          g.fillStyle(0x6ABB58, 0.5).fillCircle(x + 4 * s, y - 21 * s, 7 * s);
        }

        /** Pixel bush cluster */
        _bush(g, x, y) {
          g.fillStyle(0x2C2C2C, 1).fillEllipse(x, y, 34, 22);
          g.fillStyle(0x4A8A38, 1).fillEllipse(x, y - 1, 30, 18);
          g.fillStyle(0x5CAA48, 0.6).fillEllipse(x - 7, y - 3, 20, 14);
          g.fillStyle(0x6ABB58, 0.4).fillEllipse(x + 6, y - 2, 16, 12);
        }

        /** Lamp post (pixel) */
        _lamp(g, x, y) {
          g.fillStyle(0x2C2C2C, 1).fillRect(x - 3, y - 38, 6, 38);
          g.fillStyle(0x445566, 1).fillRect(x - 2, y - 38, 4, 36);
          g.fillStyle(0x2C2C2C, 1).fillRect(x - 9, y - 42, 18, 7);
          g.fillStyle(0x556677, 1).fillRect(x - 8, y - 41, 16, 5);
          g.fillStyle(0x2C2C2C, 1).fillCircle(x, y - 45, 8);
          g.fillStyle(0xFFF4CC, 1).fillCircle(x, y - 45, 7);
          g.fillStyle(0xFFFFE8, 0.5).fillCircle(x, y - 45, 11);
        }

        /** Ventilation grill (industrial) */
        _vent(g, x, y, w = 44, h = 40) {
          g.fillStyle(0x2C2C2C, 1).fillRect(x - 1, y - 1, w + 2, h + 2);
          g.fillStyle(0x8898A0, 1).fillRect(x, y, w, h);
          g.fillStyle(0x445566, 1);
          for (let r = 0; r < 5; r++) g.fillRect(x + 3, y + 4 + r * 7, w - 6, 4);
          g.fillStyle(0xAABBCC, 0.4);
          for (let r = 0; r < 5; r++) g.fillRect(x + 3, y + 4 + r * 7, w - 6, 1);
        }

        /** Non-mission building (Perpustakaan / Lapangan) — reference style */
        _drawExtraBuilding(cx, cy, bw, bh, wallC, roofC, label) {
          const g = this.add.graphics().setDepth(3);
          const L = cx - bw / 2, T = cy - bh / 2;

          // ── Shadow ────────────────────────────────────────────────────────
          g.fillStyle(0x000000, 0.18).fillRect(L + 10, T + 12, bw + 6, bh + 6);

          // ── Isometric side face (left depth wall) ─────────────────────────
          g.fillStyle(0x2C2C2C, 1).fillRect(L - 12, T + 14, 14, bh + 2);
          g.fillStyle(0xA09070, 1).fillRect(L - 11, T + 15, 12, bh);
          g.fillStyle(0xB8A080, 0.4).fillRect(L - 9, T + 15, 4, bh);

          // ── Main wall outline + face ──────────────────────────────────────
          g.fillStyle(0x2C2C2C, 1).fillRect(L - 1, T - 1, bw + 2, bh + 2);
          g.fillStyle(0xD4B896, 1).fillRect(L, T, bw, bh);
          g.fillStyle(0xE0C8A8, 0.3).fillRect(L, T, bw, Math.floor(bh * 0.4)); // upper lighter

          // ── Roof outline + flat surface + fascia ──────────────────────────
          const roofH = 28;
          g.fillStyle(0x2C2C2C, 1).fillRect(L - 1, T - roofH - 1, bw + 2, roofH + 2);
          g.fillStyle(0x5BA88F, 1).fillRect(L, T - roofH, bw, roofH);
          g.fillStyle(0x7BCAAC, 0.35).fillRect(L + 4, T - roofH + 3, bw - 8, 8);
          // Fascia
          g.fillStyle(0x2C2C2C, 1).fillRect(L - 1, T - roofH - 6, bw + 2, 8);
          g.fillStyle(0x6B8FA8, 1).fillRect(L, T - roofH - 5, bw, 6);

          // ── Signboard ─────────────────────────────────────────────────────
          this._sign(g, cx, T + 4, Math.min(bw - 20, 120), 22);

          // ── Windows ───────────────────────────────────────────────────────
          const wn = Math.max(2, Math.floor((bw - 40) / 52));
          const wgap = (bw - 40) / Math.max(1, wn - 1);
          for (let i = 0; i < wn; i++) {
            this._win(g, L + 20 + i * wgap - 16, T + 38, 32, 28);
          }

          // ── Door ──────────────────────────────────────────────────────────
          this._door(g, cx, T + bh - 50, 36, 48);
          this._steps(g, cx, T + bh, 60, 2, 5);

          // ── Plants ────────────────────────────────────────────────────────
          this._plant(g, L + 16, T + bh - 4, 0.8);
          this._plant(g, L + bw - 16, T + bh - 4, 0.8);

          // ── Label ─────────────────────────────────────────────────────────
          this.add.text(cx, T - roofH + 8, label, {
            fontSize: '11px', fontFamily: '"Inter",sans-serif', fontStyle: 'bold',
            color: '#2C2C2C',
          }).setOrigin(0.5).setDepth(5);
        }

        // ══════════════════════════════════════════════════════════════════════
        // PER-BUILDING METHODS — styled after reference images
        // ══════════════════════════════════════════════════════════════════════

        /**
         * AULA SEKOLAH — 2-story, wide glass facade, grand stairs, flag pole
         * Reference: aulasekolah.png (purple outline building, 3-section facade)
         */
        _drawAula(g, m, locked) {
          const { wx: cx, wy: cy, bw: W, bh: H } = m; const L = cx - W / 2, T = cy - H / 2;
          const sideW = 16;
          const roofH = 34;

          // Shadow
          g.fillStyle(0x000000, 0.2).fillRect(L + sideW + 8, T + 12, W + 8, H + 8);

          // Iso left side
          g.fillStyle(0x2C2C2C, 1).fillRect(L - sideW - 1, T + 14, sideW + 2, H + 2);
          g.fillStyle(0x9A7860, 1).fillRect(L - sideW, T + 15, sideW, H);
          g.fillStyle(0xB09078, 0.4).fillRect(L - sideW + 2, T + 15, 5, H);

          // Main facade outline + wall
          g.fillStyle(0x2C2C2C, 1).fillRect(L - 1, T - 1, W + 2, H + 2);
          g.fillStyle(0xD4B896, 1).fillRect(L, T, W, H);
          g.fillStyle(0xE8D4B8, 0.4).fillRect(L, T, W, Math.floor(H * 0.5)); // upper lighter

          // Flat roof + iso top
          g.fillStyle(0x2C2C2C, 1).fillRect(L - sideW - 1, T - roofH - 1, W + sideW + 2, roofH + 2);
          g.fillStyle(0x5BA88F, 1).fillRect(L - sideW, T - roofH, W + sideW, roofH);
          g.fillStyle(0x7BCAAC, 0.35).fillRect(L - sideW + 4, T - roofH + 5, W - 8, 10);
          g.fillStyle(0x4A7A6A, 1).fillRect(L - sideW - 1, T - roofH - 1, sideW + 1, roofH + 2);
          g.fillStyle(0x3A6A5A, 1).fillRect(L - sideW, T - roofH, sideW, roofH);

          // Fascia (blue-gray strip just below roof)
          g.fillStyle(0x2C2C2C, 1).fillRect(L - 1, T - roofH - 8, W + 2, 9);
          g.fillStyle(0x6B8FA8, 1).fillRect(L, T - roofH - 7, W, 7);

          if (locked) { g.fillStyle(0x1E293B, 0.65).fillRect(L, T, W, H); return; }

          // Floor divider (2-story)
          const mid = T + Math.floor(H * 0.47);
          g.fillStyle(0x2C2C2C, 0.3).fillRect(L, mid, W, 3);
          g.fillStyle(0xE8D4B8, 0.6).fillRect(L, mid, W, 2);

          // Upper floor: 4 windows evenly spaced
          const uWW = 42, uWH = Math.floor((mid - T) - 22);
          const uSpan = W - 32;
          for (let i = 0; i < 4; i++) this._win(g, L + 16 + i * (uSpan / 3), T + 12, uWW, uWH);

          // Lower center: glass entrance block
          const eW = Math.floor(W * 0.40), eH = Math.floor(H - mid + T) - 8;
          const eL = cx - eW / 2, eT = mid + 4;
          g.fillStyle(0x2C2C2C, 1).fillRect(eL - 2, eT - 2, eW + 4, eH + 4);
          g.fillStyle(0xB8D0E0, 1).fillRect(eL, eT, eW, eH);
          g.fillStyle(0xD8EEFA, 0.55).fillRect(eL + 4, eT + 4, eW - 8, Math.floor(eH * 0.35));
          // Pillars
          g.fillStyle(0x2C2C2C, 1).fillRect(eL - 2, eT - 2, 8, eH + 4).fillRect(eL + eW - 6, eT - 2, 8, eH + 4);
          g.fillStyle(0xDDC8A8, 1).fillRect(eL - 1, eT - 1, 6, eH + 2).fillRect(eL + eW - 5, eT - 1, 6, eH + 2);

          // Lower side windows
          const sWW = Math.floor((eL - L - 24) / 1), sWH = Math.floor(eH * 0.7);
          const sWT = eT + 6;
          this._win(g, L + 10, sWT, Math.min(sWW, 44), sWH);
          this._win(g, eL + eW + 10, sWT, Math.min(sWW, 44), sWH);

          // AULA sign above entrance
          this._sign(g, cx, eT - 14, Math.floor(eW * 0.85), 22);
          this.add.text(cx, eT - 3, 'AULA', {
            fontSize: '11px', fontFamily: '"Inter",sans-serif', fontStyle: 'bold', color: '#5C3A1E'
          }).setOrigin(0.5, 0.5).setDepth(5);

          // Door
          const dW = Math.floor(eW * 0.48), dH = Math.floor(eH * 0.68);
          this._door(g, cx, eT + eH - dH - 2, dW, dH);

          // Grand steps
          this._steps(g, cx, cy + H / 2, Math.floor(W * 0.55), 3, 6);

          // Bendera Indonesia (merah atas, putih bawah)
          const pX = L + 10, pY = T - roofH - 54;
          g.fillStyle(0x2C2C2C, 1).fillRect(pX, pY, 4, 58);
          g.fillStyle(0x444444, 1).fillRect(pX + 1, pY + 1, 3, 56);
          // Merah (atas)
          g.fillStyle(0xCC0000, 1).fillRect(pX + 4, pY, 32, 14);
          g.fillStyle(0xEE1111, 0.4).fillRect(pX + 5, pY + 2, 14, 4);
          // Putih (bawah)
          g.fillStyle(0xFFFFFF, 1).fillRect(pX + 4, pY + 14, 32, 14);
          g.fillStyle(0xF0F0F0, 0.5).fillRect(pX + 5, pY + 15, 10, 5);

          // Plants & lamps
          this._plant(g, cx - Math.floor(W * 0.35), cy + H / 2 - 2);
          this._plant(g, cx + Math.floor(W * 0.35), cy + H / 2 - 2);
          this._lamp(g, cx - Math.floor(W * 0.25), cy + H / 2 - 4);
          this._lamp(g, cx + Math.floor(W * 0.25), cy + H / 2 - 4);
          this._bush(g, L + 12, cy + H / 2 - 8);
          this._bush(g, L + W - 12, cy + H / 2 - 8);
        }
        /**
         * LAB KOMPUTER — 2-story, 6 windows, sign band, antenna
         * Reference: labkomputer.png
         */
        _drawLab(g, m, locked) {
          const { wx: cx, wy: cy, bw: W, bh: H } = m; const L = cx - W / 2, T = cy - H / 2;
          const sideW = 14;
          const roofH = 30;

          // Shadow
          g.fillStyle(0x000000, 0.18).fillRect(L + sideW + 6, T + 12, W + 6, H + 8);

          // Iso side
          g.fillStyle(0x2C2C2C, 1).fillRect(L - sideW - 1, T + 12, sideW + 2, H + 2);
          g.fillStyle(0x9A7860, 1).fillRect(L - sideW, T + 13, sideW, H);
          g.fillStyle(0xB09078, 0.35).fillRect(L - sideW + 2, T + 13, 4, H);

          // Main wall
          g.fillStyle(0x2C2C2C, 1).fillRect(L - 1, T - 1, W + 2, H + 2);
          g.fillStyle(0xD4B896, 1).fillRect(L, T, W, H);
          g.fillStyle(0xDDC8A8, 0.3).fillRect(L, T, W, Math.floor(H * 0.5));

          // Flat roof + iso top
          g.fillStyle(0x2C2C2C, 1).fillRect(L - sideW - 1, T - roofH - 1, W + sideW + 2, roofH + 2);
          g.fillStyle(0x5BA88F, 1).fillRect(L - sideW, T - roofH, W + sideW, roofH);
          g.fillStyle(0x7BCAAC, 0.35).fillRect(L - sideW + 4, T - roofH + 5, W - 6, 9);
          g.fillStyle(0x4A7A6A, 1).fillRect(L - sideW - 1, T - roofH - 1, sideW + 1, roofH + 2);
          g.fillStyle(0x3A6A5A, 1).fillRect(L - sideW, T - roofH, sideW, roofH);

          // Sign fascia band at top of wall
          g.fillStyle(0x2C2C2C, 1).fillRect(L - 1, T - roofH - 11, W + 2, 12);
          g.fillStyle(0xEEDDBB, 1).fillRect(L, T - roofH - 10, W, 10);
          g.lineStyle(1, 0xA89070, 0.5); g.strokeRect(L + 4, T - roofH - 9, W - 8, 8);
          this.add.text(cx, T - roofH - 5, '⌨  LAB KOMPUTER', {
            fontSize: '11px', fontFamily: '"Courier New",monospace', fontStyle: 'bold', color: '#2C2C2C'
          }).setOrigin(0.5, 0.5).setDepth(5);

          if (locked) { g.fillStyle(0x1E293B, 0.65).fillRect(L, T, W, H); return; }

          // Floor divider
          const mid = T + Math.floor(H * 0.46);
          g.fillStyle(0x2C2C2C, 0.25).fillRect(L, mid, W, 3);
          g.fillStyle(0xDDC8A8, 0.5).fillRect(L, mid, W, 2);

          // 3 windows upper floor
          const wW = Math.floor((W - 36) / 3) - 4, wHu = Math.floor((mid - T) - 18);
          const wGap = (W - 28) / 2;
          for (let i = 0; i < 3; i++) this._win(g, L + 14 + i * wGap, T + 10, wW, Math.max(30, wHu));

          // 3 windows lower floor (left & right of center door)
          const wHl = Math.floor((cy + H / 2 - mid) - 28);
          this._win(g, L + 14, mid + 8, wW, Math.max(28, wHl));
          this._win(g, L + W - 14 - wW, mid + 8, wW, Math.max(28, wHl));
          // Center window (smaller, above door)
          this._winSm(g, cx - 18, mid + 8, 36, Math.max(18, Math.floor(wHl * 0.5)));

          // Center door
          const dH = Math.floor((cy + H / 2 - mid) * 0.72);
          this._door(g, cx, mid + Math.floor((cy + H / 2 - mid) - dH) - 2, Math.floor(W * 0.22), dH);

          // Antenna top-right on roof
          const ax = L + W - 14;
          g.fillStyle(0x2C2C2C, 1).fillRect(ax, T - roofH - 30, 3, 32);
          g.fillStyle(0x556677, 1).fillRect(ax + 1, T - roofH - 29, 2, 30);
          g.fillStyle(0xDD4444, 1).fillCircle(ax + 1, T - roofH - 31, 4);

          // 2 AC on roof
          this._ac(g, L + 6, T - roofH + 5, Math.floor(W * 0.22), 20);
          this._ac(g, cx - Math.floor(W * 0.11), T - roofH + 5, Math.floor(W * 0.22), 20);

          // Side vent stripes
          for (let r = 0; r < 5; r++) g.fillStyle(0x2C2C2C, 0.2).fillRect(L - sideW, T + 45 + r * 14, sideW, 8);

          // Steps + plants
          this._steps(g, cx, cy + H / 2, Math.floor(W * 0.4), 2, 6);
          this._plant(g, L + 12, cy + H / 2 - 2, 0.9);
          this._plant(g, L + W - 12, cy + H / 2 - 2, 0.9);
          this._lamp(g, cx - Math.floor(W * 0.27), cy + H / 2 - 2);
          this._lamp(g, cx + Math.floor(W * 0.27), cy + H / 2 - 2);
        }
        _drawServer(g, m, locked) {
          const { wx: cx, wy: cy, bw: W, bh: H } = m; const L = cx - W / 2, T = cy - H / 2;
          const sideW = 18;
          const roofH = 28;

          // Shadow
          g.fillStyle(0x000000, 0.22).fillRect(L + sideW + 6, T + 14, W + 8, H + 8);

          // Iso side
          g.fillStyle(0x2C2C2C, 1).fillRect(L - sideW - 1, T + 12, sideW + 2, H + 2);
          g.fillStyle(0x8A7060, 1).fillRect(L - sideW, T + 13, sideW, H);
          g.fillStyle(0xA09078, 0.3).fillRect(L - sideW + 2, T + 13, 5, H);

          // Main wall (slightly darker — industrial)
          g.fillStyle(0x2C2C2C, 1).fillRect(L - 1, T - 1, W + 2, H + 2);
          g.fillStyle(0xC8B488, 1).fillRect(L, T, W, H);

          // Flat roof + iso
          g.fillStyle(0x2C2C2C, 1).fillRect(L - sideW - 1, T - roofH - 1, W + sideW + 2, roofH + 2);
          g.fillStyle(0x5BA88F, 1).fillRect(L - sideW, T - roofH, W + sideW, roofH);
          g.fillStyle(0x7BCAAC, 0.3).fillRect(L - sideW + 4, T - roofH + 5, W - 6, 8);
          g.fillStyle(0x4A7A6A, 1).fillRect(L - sideW - 1, T - roofH - 1, sideW + 1, roofH + 2);
          g.fillStyle(0x3A6A5A, 1).fillRect(L - sideW, T - roofH, sideW, roofH);

          // Sign fascia
          g.fillStyle(0x2C2C2C, 1).fillRect(L - 1, T - roofH - 11, W + 2, 12);
          g.fillStyle(0xEEDDBB, 1).fillRect(L, T - roofH - 10, W, 10);
          g.lineStyle(1, 0xA89070, 0.5); g.strokeRect(L + 4, T - roofH - 9, W - 8, 8);
          this.add.text(cx, T - roofH - 5, '🖥  RUANG SERVER', {
            fontSize: '10px', fontFamily: '"Courier New",monospace', fontStyle: 'bold', color: '#1E293B'
          }).setOrigin(0.5, 0.5).setDepth(5);

          if (locked) { g.fillStyle(0x1E293B, 0.65).fillRect(L, T, W, H); return; }

          // LEFT zone: 2 large AC units
          const acW = Math.floor(W * 0.22), acH = Math.floor(H * 0.28);
          const acY = T + Math.floor(H * 0.12);
          this._ac(g, L + 8, acY, acW, acH);
          this._ac(g, L + acW + 14, acY, acW, acH);

          // Ventilation grill below ACs
          const vW = acW * 2 + 14, vH = Math.floor(H * 0.22);
          this._vent(g, L + 8, acY + acH + 6, vW, vH);

          // RIGHT zone: 1 window + door
          const rZoneX = L + Math.floor(W * 0.58);
          const winW = Math.floor(W * 0.22), winH = Math.floor(H * 0.35);
          this._win(g, rZoneX, T + 12, winW, winH);
          const dW = Math.floor(W * 0.18), dH = Math.floor(H * 0.5);
          const dX = L + W - dW - 16;
          this._door(g, dX + dW / 2, T + H - dH - 2, dW, dH);

          // Warning sign ⚠ near door
          const wsx = dX - 22, wsy = T + H - 36;
          g.fillStyle(0xFBBF24, 1).fillTriangle(wsx + 10, wsy, wsx, wsy + 16, wsx + 20, wsy + 16);
          g.fillStyle(0x1E293B, 1).fillRect(wsx + 9, wsy + 6, 2, 6).fillRect(wsx + 9, wsy + 13, 2, 2);

          // Security keypad
          const kx = dX + dW + 4, ky = T + H - 42;
          g.fillStyle(0x2C2C2C, 1).fillRect(kx, ky, 14, 22);
          g.fillStyle(0x334155, 1).fillRect(kx + 1, ky + 1, 12, 20);
          for (let r = 0; r < 3; r++) for (let c = 0; c < 2; c++)
            g.fillStyle(0x4F8EF7, 0.85).fillRect(kx + 3 + c * 5, ky + 4 + r * 6, 3, 4);

          // Steps + greenery
          this._steps(g, dX + dW / 2, cy + H / 2, dW + 22, 2, 5);
          this._bush(g, L + W - 12, cy + H / 2 - 6);
          this._bush(g, cx, cy + H / 2 - 6);
          this._lamp(g, L + W - 18, cy + H / 2 - 2);
        }
        _drawGuru(g, m, locked) {
          const { wx: cx, wy: cy, bw: W, bh: H } = m; const L = cx - W / 2, T = cy - H / 2;
          const sideW = 14;
          const roofH = 28;

          // Shadow
          g.fillStyle(0x000000, 0.18).fillRect(L + sideW + 6, T + 12, W + 6, H + 8);

          // Iso side
          g.fillStyle(0x2C2C2C, 1).fillRect(L - sideW - 1, T + 12, sideW + 2, H + 2);
          g.fillStyle(0x9A7860, 1).fillRect(L - sideW, T + 13, sideW, H);
          g.fillStyle(0xB09078, 0.35).fillRect(L - sideW + 2, T + 13, 4, H);

          // Main wall
          g.fillStyle(0x2C2C2C, 1).fillRect(L - 1, T - 1, W + 2, H + 2);
          g.fillStyle(0xD4B896, 1).fillRect(L, T, W, H);
          g.fillStyle(0xDCC8A4, 0.35).fillRect(L, T, W, Math.floor(H * 0.45));

          // Flat roof + iso
          g.fillStyle(0x2C2C2C, 1).fillRect(L - sideW - 1, T - roofH - 1, W + sideW + 2, roofH + 2);
          g.fillStyle(0x5BA88F, 1).fillRect(L - sideW, T - roofH, W + sideW, roofH);
          g.fillStyle(0x7BCAAC, 0.3).fillRect(L - sideW + 4, T - roofH + 5, W - 8, 8);
          g.fillStyle(0x4A7A6A, 1).fillRect(L - sideW - 1, T - roofH - 1, sideW + 1, roofH + 2);
          g.fillStyle(0x3A6A5A, 1).fillRect(L - sideW, T - roofH, sideW, roofH);

          // Sign fascia
          g.fillStyle(0x2C2C2C, 1).fillRect(L - 1, T - roofH - 11, W + 2, 12);
          g.fillStyle(0xEEDDBB, 1).fillRect(L, T - roofH - 10, W, 10);
          g.lineStyle(1, 0xA89070, 0.5); g.strokeRect(L + 4, T - roofH - 9, W - 8, 8);
          this.add.text(cx, T - roofH - 5, 'RUANG GURU', {
            fontSize: '12px', fontFamily: '"Inter",sans-serif', fontStyle: 'bold', color: '#2C2C2C'
          }).setOrigin(0.5, 0.5).setDepth(5);

          if (locked) { g.fillStyle(0x1E293B, 0.65).fillRect(L, T, W, H); return; }

          // 3 windows (left two-thirds of building)
          const wW = Math.floor(W * 0.18), wH = Math.floor(H * 0.44);
          const wY = T + Math.floor(H * 0.12);
          const wGap = Math.floor((W * 0.6 - wW * 3) / 2);
          for (let i = 0; i < 3; i++) this._win(g, L + 10 + i * (wW + wGap + 4), wY, wW, wH);

          // Wide decorative panel between windows and door
          g.fillStyle(0xE0C8A0, 0.3).fillRect(cx - 8, T + 8, 4, Math.floor(H * 0.5));

          // Door (right side)
          const dW = Math.floor(W * 0.2), dH = Math.floor(H * 0.56);
          const dX = L + W - dW - 12;
          this._door(g, dX + dW / 2, T + H - dH - 2, dW, dH);

          // Transom window above door
          this._winSm(g, dX, T + Math.floor(H * 0.08), dW, Math.floor(H * 0.16));

          // Steps under door
          this._steps(g, dX + dW / 2, cy + H / 2, dW + 18, 2, 5);

          // AC unit on iso side wall
          this._ac(g, L - sideW - 1, T + H - 52, 28, 18);

          // Plants + lamp
          this._plant(g, L + 12, cy + H / 2 - 2, 0.85);
          this._plant(g, L + W - 12, cy + H / 2 - 2, 0.85);
          this._lamp(g, cx - 8, cy + H / 2 - 2);
          this._bush(g, dX + dW + 8, cy + H / 2 - 6);
        }
        _drawKantin(g, m, locked) {
          const { wx: cx, wy: cy, bw: W, bh: H } = m; const L = cx - W / 2, T = cy - H / 2;
          const sideW = 16;
          const roofH = 26;

          // Shadow
          g.fillStyle(0x000000, 0.18).fillRect(L + sideW + 6, T + 14, W + 8, H + 8);

          // Iso side — GREEN (matches reference)
          g.fillStyle(0x2C2C2C, 1).fillRect(L - sideW - 1, T + 12, sideW + 2, H + 2);
          g.fillStyle(0x4A7A50, 1).fillRect(L - sideW, T + 13, sideW, H);
          g.fillStyle(0x60A068, 0.4).fillRect(L - sideW + 2, T + 13, 4, H);

          // Main wall — warm
          g.fillStyle(0x2C2C2C, 1).fillRect(L - 1, T - 1, W + 2, H + 2);
          g.fillStyle(0xD8C090, 1).fillRect(L, T, W, H);

          // Flat roof + iso top
          g.fillStyle(0x2C2C2C, 1).fillRect(L - sideW - 1, T - roofH - 1, W + sideW + 2, roofH + 2);
          g.fillStyle(0x5BA88F, 1).fillRect(L - sideW, T - roofH, W + sideW, roofH);
          g.fillStyle(0x7BCAAC, 0.3).fillRect(L - sideW + 4, T - roofH + 4, W - 6, 8);
          g.fillStyle(0x4A7A6A, 1).fillRect(L - sideW - 1, T - roofH - 1, sideW + 1, roofH + 2);
          g.fillStyle(0x3A6A5A, 1).fillRect(L - sideW, T - roofH, sideW, roofH);

          // PURPLE fascia band (like reference top trim)
          g.fillStyle(0x2C2C2C, 1).fillRect(L - 1, T - roofH - 9, W + 2, 10);
          g.fillStyle(0x7C54A8, 1).fillRect(L, T - roofH - 8, W, 8);
          g.fillStyle(0x9870C0, 0.4).fillRect(L + 4, T - roofH - 7, W - 8, 3);

          // Sign band (pink/cream like reference)
          g.fillStyle(0x2C2C2C, 1).fillRect(cx - Math.floor(W * 0.42), T - roofH + 4, Math.floor(W * 0.84), 16);
          g.fillStyle(0xF4D0C0, 1).fillRect(cx - Math.floor(W * 0.41), T - roofH + 5, Math.floor(W * 0.82), 14);

          if (locked) { g.fillStyle(0x1E293B, 0.65).fillRect(L, T, W, H); return; }

          this.add.text(cx, T - roofH + 12, '🍽  KANTIN', {
            fontSize: '11px', fontFamily: '"Inter",sans-serif', fontStyle: 'bold', color: '#5C3A1E'
          }).setOrigin(0.5, 0.5).setDepth(5);

          // Green AWNING above counter (like reference)
          const awY = T - roofH - 22;
          g.fillStyle(0x2C2C2C, 1).fillRect(L - 4, awY, W + 8, 14);
          g.fillStyle(0x3A8A50, 1).fillRect(L - 3, awY + 1, W + 6, 12);
          g.fillStyle(0x5AB870, 0.45).fillRect(L - 1, awY + 2, W + 2, 5);
          // Awning fringe triangles
          const fCount = 8, fW = (W + 6) / fCount;
          for (let i = 0; i < fCount; i++) {
            g.fillStyle(i % 2 === 0 ? 0x2A7A40 : 0x4AAA60, 1);
            g.fillTriangle(L - 3 + i * fW, awY + 13, L - 3 + (i + 1) * fW, awY + 13, L - 3 + (i + 0.5) * fW, awY + 20);
          }

          // Open counter top rail
          const ctY = T + Math.floor(H * 0.3);
          g.fillStyle(0x2C2C2C, 1).fillRect(L + 4, ctY, W - 8, 4);
          g.fillStyle(0xA89070, 1).fillRect(L + 5, ctY + 1, W - 10, 3);

          // Open dark serving area
          g.fillStyle(0x2C2C2C, 1).fillRect(L + 4, ctY + 4, W - 8, H - (ctY - T) - 10);
          g.fillStyle(0x18202C, 1).fillRect(L + 5, ctY + 5, W - 10, H - (ctY - T) - 12);
          // Shelf inside
          g.fillStyle(0x8A7050, 0.9).fillRect(L + 10, T + H - 28, W - 20, 7);
          // Food tray hints
          g.fillStyle(0xE88040, 0.6).fillRect(L + 18, T + H - 24, 16, 4);
          g.fillStyle(0xE04040, 0.6).fillRect(L + 40, T + H - 24, 14, 4);
          g.fillStyle(0x40A040, 0.6).fillRect(L + 62, T + H - 24, 12, 4);

          // 2 small windows above counter
          const swW = Math.floor(W * 0.17), swH = Math.floor((ctY - T) - 14);
          this._winSm(g, L + 10, T + 8, swW, Math.max(16, swH));
          this._winSm(g, L + W - swW - 10, T + 8, swW, Math.max(16, swH));

          // Outdoor side tables
          [[L - 38, cy - 6], [L + W + 8, cy - 6]].forEach(([tx, ty]) => {
            g.fillStyle(0x2C2C2C, 1).fillRect(tx - 1, ty - 1, 30, 20);
            g.fillStyle(0xE8C870, 1).fillRect(tx, ty, 28, 18);
            g.fillStyle(0xF0D888, 0.5).fillRect(tx + 3, ty + 2, 12, 7);
            g.fillStyle(0x6A5030, 1).fillRect(tx + 12, ty + 16, 4, 8);
          });

          this._bush(g, L + 12, cy + H / 2 - 6);
          this._bush(g, L + W - 12, cy + H / 2 - 6);
          this._plant(g, cx - Math.floor(W * 0.35), cy + H / 2 - 2, 0.85);
          this._plant(g, cx + Math.floor(W * 0.35), cy + H / 2 - 2, 0.85);
        }
        // ══════════════════════════════════════════════════════════════════════
        _createBuildings() {
          this._colliders = [];
          this._zones = [];

          MISSIONS.forEach(m => {
            const gs = bridge.current.gameState;
            const completed = gs.completedMissions.includes(m.missionId);
            const locked = gs.currentLevel < m.levelRequired;

            // ── Draw detailed building visual ──────────────────────────────
            const g = this.add.graphics().setDepth(3);
            if (m.id === 'aula') {
              this._drawAula(g, m, locked);
            } else {
              this.add.image(m.wx, m.wy, 'bld_' + m.id).setDepth(3);
            }

            // ── Building label (depth 6 = above building) ─────────────────
            this.add.text(m.wx, m.wy - m.bh / 2 + 16,
              `${m.misi}: ${m.label}`, {
              fontSize: '14px', fontFamily: '"Inter", sans-serif', fontStyle: 'bold',
              color: '#FFFFFF', stroke: 'rgba(20,10,0,0.95)', strokeThickness: 5,
            }).setOrigin(0.5).setDepth(6);

            // ── Floating mission marker ───────────────────────────────────
            const markerEmoji = locked ? '🔒' : completed ? '✅' : '❗';
            const marker = this.add.text(m.wx, m.wy - m.bh / 2 - 44, markerEmoji, {
              fontSize: '30px',
            }).setOrigin(0.5).setDepth(6);
            this.tweens.add({
              targets: marker, y: marker.y - 16,
              duration: 900 + (m.wx % 300), yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
            });

            // ── Glow ring (shown when player approaches) ──────────────────
            const glow = this.add.graphics().setDepth(2).setAlpha(0);
            glow.fillStyle(m.color, 0.15)
              .fillRect(m.wx - m.bw / 2 - 16, m.wy - m.bh / 2 - 16, m.bw + 32, m.bh + 32);
            glow.lineStyle(3, m.color, 0.8)
              .strokeRect(m.wx - m.bw / 2 - 16, m.wy - m.bh / 2 - 16, m.bw + 32, m.bh + 32);

            // ── Physics collision body (UNCHANGED) ────────────────────────
            const body = this.physics.add.staticImage(m.wx, m.wy - 36, 'pixel');
            body.setDisplaySize(m.bw, m.bh - 64).refreshBody();
            this._colliders.push(body);

            this._zones.push({
              ...m, completed, locked, glowObj: glow,
              doorY: m.wy + m.bh / 2 - 30,
            });
          });
        }
        _createNPCs() {
          NPCS.forEach(npc => {
            // Body graphics (drawn as interactive object)
            const g = this.add.graphics()
              .setDepth(5)
              .setInteractive(
                new Phaser.Geom.Rectangle(-18, -30, 36, 52),
                Phaser.Geom.Rectangle.Contains
              );

            // Shadow
            g.fillStyle(0x000000, 0.18).fillEllipse(0, 26, 26, 8);
            // Legs
            g.fillStyle(0x1e293b).fillRect(-9, 12, 8, 14).fillRect(2, 12, 8, 14);
            // Shoes
            g.fillStyle(0x374151).fillRect(-11, 25, 10, 5).fillRect(2, 25, 10, 5);
            // Shirt body
            g.fillStyle(npc.bodyColor).fillRoundedRect(-12, 0, 24, 14, 4);
            // Belt
            g.fillStyle(0x78350f, 0.7).fillRect(-12, 12, 24, 3);
            // Arms
            g.fillStyle(0xfde68a).fillRect(-17, 1, 6, 10).fillRect(12, 1, 6, 10);
            // Neck
            g.fillStyle(0xfde68a).fillRect(-4, -4, 8, 6);
            // Head
            g.fillStyle(0xfde68a).fillCircle(0, -12, 11);
            // Hair
            g.fillStyle(0x1e293b).fillRect(-10, -22, 20, 9).fillCircle(0, -20, 10);
            // Eyes
            g.fillStyle(0x1e293b).fillRect(-5, -14, 3, 3).fillRect(4, -14, 3, 3);
            // Mouth (smile)
            g.fillStyle(0x7f1d1d, 0.8).fillRect(-3, -8, 7, 2);

            g.x = npc.wx;
            g.y = npc.wy;

            // Idle bounce
            this.tweens.add({
              targets: g, y: npc.wy - 6,
              duration: 800 + (npc.wx % 250), yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
            });

            // Name tag
            this.add.text(npc.wx, npc.wy - 46, npc.name, {
              fontSize: '11px', fontFamily: '"Inter", sans-serif', fontStyle: 'bold',
              backgroundColor: '#fef9c3', color: '#78350f', padding: { x: 5, y: 2 },
            }).setOrigin(0.5).setDepth(7);

            // Chat bubble indicator
            const bubble = this.add.text(npc.wx + 18, npc.wy - 36, '💬', {
              fontSize: '14px',
            }).setOrigin(0.5).setDepth(7);
            this.tweens.add({ targets: bubble, alpha: 0.25, duration: 550, yoyo: true, repeat: -1 });

            // Interactions
            g.on('pointerdown', () =>
              bridge.current.setDialog({ name: `${npc.name} — ${npc.role}`, text: npc.dialog })
            );
            g.on('pointerover', () => { g.setScale(1.12); this.input.setDefaultCursor('pointer'); });
            g.on('pointerout', () => { g.setScale(1); this.input.setDefaultCursor('default'); });
          });
        }

        // ══════════════════════════════════════════════════════════════════════
        // PLAYER
        // ══════════════════════════════════════════════════════════════════════
        _createPlayer() {
          let spawnX = WORLD_W / 2;
          let spawnY = WORLD_H / 2 + 380;
          const lastBldId = sessionStorage.getItem('lastSchoolBuildingId');
          if (lastBldId) {
            const b = MISSIONS.find(m => m.id === lastBldId);
            if (b) {
              spawnX = b.wx;
              spawnY = (b.id === 'kantin' || b.id === 'serverroom') ? b.wy - b.bh / 2 - 50 : b.wy + b.bh / 2 + 50;
            }
          }
          this._player = this.physics.add.image(spawnX, spawnY, 'p-down-0');
          this._player.setScale(2.4).setDepth(8).setCollideWorldBounds(true);
          // Add collision with all building bodies
          this._colliders.forEach(c => this.physics.add.collider(this._player, c));

          const authenticatedName = bridge.current.username || 'Guest';
          this._playerNameText = this.add.text(spawnX, spawnY - 45, authenticatedName, {
            fontSize: '12px', fontFamily: '"Inter", sans-serif', fontStyle: 'bold',
            color: '#22c55e', stroke: '#000000', strokeThickness: 3,
          }).setOrigin(0.5).setDepth(9);
        }


        _setupCamera() {
          this.cameras.main
            .startFollow(this._player, true, 0.08, 0.08)
            .setBounds(0, 0, WORLD_W, WORLD_H);
          // Lower zoom so player can see more of the 3200x2400 world at once
          // On mobile, force a minimum zoom of 0.6 to prevent tiny rendering
          const zoom = Math.max(0.6, Math.min(0.75, Math.max(0.4, Math.min(
            this.scale.width / 1400,
            this.scale.height / 900
          ))));
          this.cameras.main.setZoom(zoom);
        }

        _setupInput() {
          this._cursors = this.input.keyboard.createCursorKeys();
          this._wasd = this.input.keyboard.addKeys('W,A,S,D');
          this._eKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        }

        // ══════════════════════════════════════════════════════════════════════
        // UPDATE METHODS
        // ══════════════════════════════════════════════════════════════════════
        _movePlayer() {
          const { _cursors: cur, _wasd: w } = this;
          const dpad = bridge.current.dpad;
          const SPEED = 210;
          let vx = 0, vy = 0;

          if (cur.left.isDown || w.A.isDown || dpad.left) { vx = -SPEED; this._lastDir = 'left'; }
          else if (cur.right.isDown || w.D.isDown || dpad.right) { vx = SPEED; this._lastDir = 'right'; }
          if (cur.up.isDown || w.W.isDown || dpad.up) { vy = -SPEED; this._lastDir = 'up'; }
          else if (cur.down.isDown || w.S.isDown || dpad.down) { vy = SPEED; this._lastDir = 'down'; }

          // Normalize diagonal
          if (vx !== 0 && vy !== 0) { vx *= 0.707; vy *= 0.707; }

          this._player.setVelocity(vx, vy);
          this._isMoving = (vx !== 0 || vy !== 0);
        }

        _updateAnim() {
          if (this._isMoving) {
            this._walkTick++;
            if (this._walkTick > 7) { this._walkFrame = (this._walkFrame + 1) % 2; this._walkTick = 0; }
          } else {
            this._walkFrame = 0;
          }
          const key = `p-${this._lastDir}-${this._walkFrame}`;
          if (this._player.texture.key !== key) this._player.setTexture(key);
        }

        _checkProximity() {
          const px = this._player.x;
          const py = this._player.y;
          const MARGIN = 60; // 60px padding as requested

          let found = null;
          for (const z of this._zones) {
            const left = z.wx - z.bw / 2 - MARGIN;
            const right = z.wx + z.bw / 2 + MARGIN;
            const top = z.wy - z.bh / 2 - MARGIN;
            const bottom = z.wy + z.bh / 2 + MARGIN;
            const near = (px >= left && px <= right && py >= top && py <= bottom);

            // Only update tween when near-state CHANGES (not every frame)
            const wasNear = this._glowStates[z.id];
            if (near !== wasNear) {
              this._glowStates[z.id] = near;
              this.tweens.killTweensOf(z.glowObj);
              this.tweens.add({ targets: z.glowObj, alpha: near ? 1 : 0, duration: 200 });
            }

            if (near) found = z;
          }

          // Only trigger React setState when nearby building changes
          if (found?.id !== this._nearbyBld?.id) {
            this._nearbyBld = found;
            bridge.current.setNearby(found ? { ...found } : null);
          }

          // E key to enter building
          if (Phaser.Input.Keyboard.JustDown(this._eKey) && this._nearbyBld) {
            this._tryEnter(this._nearbyBld);
          }
        }

        _tryEnter(building) {
          const gs = bridge.current.gameState;
          if (gs.currentLevel >= building.levelRequired) {
            sessionStorage.setItem('lastSchoolBuildingId', building.id);
            bridge.current.navigate(building.route);
          }
          // React handles the "denied" notification via UI overlay
        }
      } // end CampusScene

      // ── Instantiate Phaser.Game ───────────────────────────────────────────
      const game = new Phaser.Game({
        type: Phaser.AUTO,
        parent: containerRef.current,
        physics: { default: 'arcade', arcade: { gravity: { y: 0 }, debug: false } },
        scene: [CampusScene],
        backgroundColor: '#4ade80',
        scale: {
          mode: Phaser.Scale.RESIZE,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
        render: { antialias: true, pixelArt: false },
      });

      gameRef.current = game;
    }).catch(err => console.error('[SchoolMap] Phaser load error:', err));

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []); // only on mount — bridge ref gives always-fresh data

  // ── Handle entering a room (called from React UI) ─────────────────────────
  const handleEnter = (building) => {
    if (!building) return;
    if (gameState.currentLevel < building.levelRequired) {
      if (notifTimer.current) clearTimeout(notifTimer.current);
      setNotification(`Selesaikan Misi ${building.levelRequired - 1} terlebih dahulu!`);
      notifTimer.current = setTimeout(() => setNotification(null), 3000);
      return;
    }
    sessionStorage.setItem('lastSchoolBuildingId', building.id);
    navigate(building.route);
  };

  // ── D-Pad virtual controller (updates bridgeRef, read by Phaser update loop)
  const dpress = (dir) => { bridgeRef.current.dpad[dir] = true; };
  const drelease = (dir) => { bridgeRef.current.dpad[dir] = false; };

  const nbLocked = nearby ? gameState.currentLevel < nearby.levelRequired : false;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#050810', overflow: 'hidden' }}>
      <Header
        title="Peta Sekolah"
        showBack={true}
        onBack={() => navigate('dashboard')}
        xp={gameState.xp}
        level={gameState.level}
      />

      {/* ── Control hint bar ───────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap',
        padding: '4px 12px', background: 'rgba(0,240,255,0.07)',
        borderBottom: '1px solid rgba(0,240,255,0.12)',
        fontSize: '0.72rem', color: 'rgba(180,210,240,0.72)', flexShrink: 0,
      }}>
        <span>⌨️ <strong style={{ color: '#00f0ff' }}>WASD / ↑↓←→</strong> bergerak</span>
        <span><kbd style={kbdStyle}>E</kbd> Masuk</span>
        <span>Klik NPC untuk dialog</span>
        <span>D-Pad kanan bawah</span>
      </div>

      {/* ── Main game area ─────────────────────────────────────────────────── */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>

        {/* Phaser canvas is mounted here */}
        <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

        {/* ── Access Denied Notification ───────────────────────────────────── */}
        {notification && (
          <div style={{
            position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)',
            background: 'rgba(20,6,6,0.97)', border: '2px solid #EF4444',
            borderRadius: '14px', padding: '10px 22px',
            color: '#fca5a5', fontWeight: 'bold', fontSize: '0.82rem',
            backdropFilter: 'blur(10px)', boxShadow: '0 0 24px rgba(239,68,68,0.45)',
            zIndex: 50, display: 'flex', alignItems: 'center', gap: '8px',
            whiteSpace: 'nowrap', animation: 'mapIn 0.2s ease-out',
          }}>
            🔒 {notification}
          </div>
        )}

        {/* ── Building approach prompt ─────────────────────────────────────── */}
        {nearby && (
          <div style={{
            position: 'absolute', bottom: '108px', left: '50%',
            transform: 'translateX(-50%)', zIndex: 40, animation: 'mapIn 0.2s ease-out',
          }}>
            {nbLocked ? (
              <div style={{
                background: 'rgba(18,6,6,0.98)', border: '2px solid #EF4444',
                borderRadius: '18px', padding: '14px 24px', textAlign: 'center',
                backdropFilter: 'blur(12px)', boxShadow: '0 0 24px rgba(239,68,68,0.3)',
                color: 'white', minWidth: '200px',
              }}>
                <div style={{ fontSize: '2rem', lineHeight: 1 }}>🔒</div>
                <div style={{ fontWeight: 'bold', color: '#EF4444', marginTop: '6px', fontSize: '0.9rem' }}>
                  Akses Ditolak
                </div>
                <div style={{ fontSize: '0.72rem', color: '#fca5a5', marginTop: '4px' }}>
                  Selesaikan misi sesuai urutanya terlebih dahulu.
                </div>
              </div>
            ) : (
              <button
                onClick={() => handleEnter(nearby)}
                style={{
                  background: 'rgba(4,12,30,0.98)',
                  border: `2.5px solid ${nearby.cssColor}`,
                  borderRadius: '18px', padding: '14px 28px',
                  backdropFilter: 'blur(14px)',
                  boxShadow: `0 0 32px ${nearby.cssColor}55, 0 4px 24px rgba(0,0,0,0.6)`,
                  color: 'white', cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                  minWidth: '220px', maxWidth: '90vw', WebkitTapHighlightColor: 'transparent',
                }}
                onPointerDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
                onPointerUp={e => e.currentTarget.style.transform = 'scale(1)'}
                onPointerLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <div style={{ fontSize: '1.8rem', lineHeight: 1 }}>🚪</div>
                <div style={{ fontWeight: 'bold', fontSize: '1rem', color: nearby.cssColor, letterSpacing: '0.02em' }}>
                  [E] Masuk
                </div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(200,220,255,0.9)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span>{nearby.label}</span>
                </div>
              </button>
            )}
          </div>
        )}

        {/* ── NPC Dialog Box ───────────────────────────────────────────────── */}
        {dialog && (
          <div style={{
            position: 'absolute', bottom: '108px', left: '50%',
            transform: 'translateX(-50%)', zIndex: 45,
            animation: 'mapIn 0.2s ease-out', width: 'min(400px, 92vw)',
          }}>
            <div style={{
              background: 'rgba(4,12,30,0.98)', border: '2px solid rgba(0,240,255,0.35)',
              borderRadius: '18px', padding: '16px 20px',
              backdropFilter: 'blur(14px)',
              boxShadow: '0 0 30px rgba(0,240,255,0.18), 0 8px 32px rgba(0,0,0,0.7)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#00f0ff' }}>
                  💬 {dialog.name}
                </div>
                <button onClick={() => setDialog(null)} style={{
                  background: 'none', border: 'none', color: 'rgba(255,255,255,0.45)',
                  cursor: 'pointer', fontSize: '1.1rem', padding: '2px 6px',
                }}>✕</button>
              </div>
              <div style={{
                background: 'rgba(0,240,255,0.06)', borderRadius: '10px',
                padding: '12px 14px', fontSize: '0.85rem',
                color: 'rgba(220,240,255,0.92)', lineHeight: '1.55',
                borderLeft: '3px solid rgba(0,240,255,0.4)',
              }}>
                {dialog.text}
              </div>
              <button onClick={() => setDialog(null)} style={{
                marginTop: '12px', width: '100%', padding: '8px',
                background: 'rgba(0,240,255,0.12)',
                border: '1px solid rgba(0,240,255,0.3)',
                borderRadius: '10px', color: '#00f0ff',
                fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer',
              }}>
                Tutup
              </button>
            </div>
          </div>
        )}

        {/* ── Mission Progress Panel (top-right) ──────────────────────────── */}
        <div style={{
          position: 'absolute', top: 10, right: 10, zIndex: 30,
          background: 'rgba(4,12,28,0.96)', border: '1px solid rgba(0,240,255,0.2)',
          borderRadius: '12px', padding: '8px 12px',
          backdropFilter: 'blur(10px)', boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
          minWidth: '160px',
        }}>
          <div style={{ color: '#00f0ff', fontWeight: 'bold', fontSize: '0.7rem', marginBottom: '6px', letterSpacing: '0.05em' }}>
            PROGRES MISI {gameState.completedMissions.length}/5
          </div>
          {MISSIONS.map(m => {
            const done = gameState.completedMissions.includes(m.missionId);
            const locked = gameState.currentLevel < m.levelRequired;
            return (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px', opacity: locked ? 0.4 : 1 }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                  background: done ? '#00f0ff' : locked ? '#475569' : m.cssColor,
                  boxShadow: done ? '0 0 5px #00f0ff' : 'none',
                }} />
                <span style={{ fontSize: '0.67rem', color: done ? '#00f0ff' : 'rgba(180,200,225,0.7)' }}>
                  {m.misi}: {m.label}
                </span>
                {done && <span style={{ fontSize: '0.6rem' }}>✅</span>}
                {locked && <span style={{ fontSize: '0.6rem' }}>🔒</span>}
              </div>
            );
          })}
        </div>

        {/* ── Virtual D-Pad (mobile) ───────────────────────────────────────── */}
        <div style={{
          position: 'absolute', right: 14, bottom: 14, zIndex: 30,
          display: 'grid',
          gridTemplateAreas: '". u ." "l . r" ". d ."',
          gridTemplateColumns: '54px 54px 54px',
          gridTemplateRows: '54px 54px 54px',
          gap: '4px',
        }}>
          {[
            { area: 'u', dir: 'up', icon: <ChevronUp size={22} /> },
            { area: 'd', dir: 'down', icon: <ChevronDown size={22} /> },
            { area: 'l', dir: 'left', icon: <ChevronLeft size={22} /> },
            { area: 'r', dir: 'right', icon: <ChevronRight size={22} /> },
          ].map(({ area, dir, icon }) => (
            <button
              key={dir}
              onPointerDown={e => { e.preventDefault(); dpress(dir); }}
              onPointerUp={() => drelease(dir)}
              onPointerLeave={() => drelease(dir)}
              style={{
                gridArea: area,
                background: 'rgba(6,16,40,0.88)', border: '1.5px solid rgba(0,240,255,0.4)',
                borderRadius: '12px', color: 'rgba(0,240,255,0.9)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', backdropFilter: 'blur(8px)',
                boxShadow: '0 2px 10px rgba(0,0,0,0.6)',
                touchAction: 'none', userSelect: 'none', WebkitUserSelect: 'none',
              }}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes mapIn {
          from { opacity: 0; transform: translateX(-50%) translateY(8px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        #phaser-canvas-container canvas { display: block !important; }
      `}</style>
    </div>
  );
};

// ─── Shared style for keyboard badges ─────────────────────────────────────────
const kbdStyle = {
  background: 'rgba(255,255,255,0.12)',
  border: '1px solid rgba(255,255,255,0.25)',
  padding: '1px 7px', borderRadius: '5px',
  fontFamily: 'monospace', fontWeight: 'bold', fontSize: '0.75rem',
  color: '#00f0ff',
};

export default SchoolMap;
