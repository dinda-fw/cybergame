const fs = require('fs');
const file = '/Users/mac/Downloads/cybergame/src/screens/SchoolMap.jsx';
let content = fs.readFileSync(file, 'utf8');

const newMissions = `const MISSIONS = [
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
    wx: 1600, wy: 350, bw: 300, bh: 210,
    color: 0xDC2626, roof: 0xB91C1C, cssColor: '#DC2626',
  },
  {
    id: 'labkomputer', label: 'Lab Komputer', misi: 'Misi 5',
    route: 'mission_labkomputer', missionId: 'mission_labkomputer', levelRequired: 5,
    wx: 2600, wy: 350, bw: 300, bh: 210,
    color: 0x2563EB, roof: 0x1D4ED8, cssColor: '#2563EB',
  }
];`;

content = content.replace(/const MISSIONS = \[[\s\S]*?\];/m, newMissions);

fs.writeFileSync(file, content);
console.log("Missions auto-calculated and snapped!");
