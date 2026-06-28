const fs = require('fs');
const path = require('path');

const files = [
  'src/screens/missions/Kantin.jsx',
  'src/screens/missions/Aula.jsx',
  'src/screens/missions/LabKomputer.jsx',
  'src/screens/missions/RuangGuru.jsx',
  'src/screens/missions/ServerRoom.jsx'
];

files.forEach(file => {
  const fullPath = path.resolve(__dirname, file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Normalize step XP to 50
    content = content.replace(/addXP\(30\)/g, 'addXP(50)');
    content = content.replace(/addXP\(20\)/g, 'addXP(50)');
    content = content.replace(/addXP\(50\)/g, 'addXP(50)');
    
    // Normalize completion bonus to 0, so total is just steps * 50
    content = content.replace(/completeMission\(([^,]+),\s*\d+\)/g, 'completeMission($1, 0)');
    
    fs.writeFileSync(fullPath, content);
    console.log("Bumped XP in", file);
  }
});
