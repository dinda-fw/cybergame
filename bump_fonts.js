const fs = require('fs');
const glob = require('glob');

// Use hardcoded files to avoid needing glob dependency
const files = [
  'src/screens/missions/Kantin.jsx',
  'src/screens/missions/Aula.jsx',
  'src/screens/missions/LabKomputer.jsx',
  'src/screens/missions/RuangGuru.jsx',
  'src/screens/missions/ServerRoom.jsx',
  'src/screens/features/UrlDetective.jsx',
  'src/screens/features/CyberScanChallenge.jsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Bump rem values
    content = content.replace(/0\.65rem/g, '0.9rem');
    content = content.replace(/0\.7rem/g, '0.95rem');
    content = content.replace(/0\.75rem/g, '1rem');
    content = content.replace(/0\.8rem/g, '1.05rem');
    content = content.replace(/0\.85rem/g, '1.1rem');
    content = content.replace(/0\.9rem/g, '1.15rem');
    content = content.replace(/0\.95rem/g, '1.2rem');
    
    fs.writeFileSync(file, content);
    console.log("Bumped fonts in", file);
  }
});
