import React from 'react';
import Header from '../components/Header';
import { MapPin, CheckCircle, Lock } from 'lucide-react';

const SchoolMap = ({ navigate, gameState }) => {
    const locations = [
    { id: 'aula', label: 'Lvl 1: Aula Sekolah', route: 'mission_aula', levelRequired: 1, x: 55, y: 35, iconColor: '#8B5CF6' },
    { id: 'kantin', label: 'Lvl 2: Kantin', route: 'mission_kantin', levelRequired: 2, x: 75, y: 80, iconColor: '#F59E0B' },
    { id: 'serverroom', label: 'Lvl 3: Ruang Server', route: 'mission_serverroom', levelRequired: 3, x: 80, y: 55, iconColor: '#10B981' },
    { id: 'ruangguru', label: 'Lvl 4: Ruang Guru', route: 'mission_ruangguru', levelRequired: 4, x: 25, y: 20, iconColor: '#EF4444' },
    { id: 'labkomputer', label: 'Lvl 5: Lab Komputer', route: 'mission_labkomputer', levelRequired: 5, x: 25, y: 65, iconColor: '#3B82F6' }
  ];

  return (
    <div className="flex-column h-full">
      <Header 
        title="Peta Sekolah" 
        showBack={true} 
        onBack={() => navigate('dashboard')} 
        xp={gameState.xp} 
        level={gameState.level} 
      />
      
      <div className="content-area flex-column" style={{ position: 'relative', padding: 0 }}>
        {/* Map Background */}
        <div style={{ 
          width: '100%', 
          height: '100%', 
          position: 'relative',
          overflow: 'hidden',
          backgroundImage: "url('/peta sekolah.png')",
          backgroundSize: 'cover',
          backgroundPosition: '15% top',
          backgroundColor: '#0b101e'
        }}>
          {/* Cyberpunk Dark Overlay */}
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(11, 16, 30, 0.3)',
            zIndex: 1,
            pointerEvents: 'none'
          }} />
          {locations.map(loc => {
            const isCompleted = gameState.completedMissions.includes(loc.route);
            const isLocked = gameState.currentLevel < loc.levelRequired;
            return (
              <div 
                key={loc.id}
                style={{
                  position: 'absolute',
                  top: `${loc.y}%`,
                  left: `${loc.x}%`,
                  transform: 'translate(-50%, -50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: isLocked ? 'not-allowed' : 'pointer',
                  opacity: isLocked ? 0.7 : 1,
                  zIndex: 2
                }}
                onClick={() => !isLocked && navigate(loc.route)}
                className="animate-fade-in"
              >
                <div style={{ 
                  background: 'rgba(18, 25, 43, 0.9)', 
                  padding: '8px', 
                  borderRadius: '12px', 
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontWeight: 'bold',
                  fontSize: '0.85rem',
                  border: isCompleted ? '2px solid #10B981' : isLocked ? '2px solid #94a3b8' : 'none',
                  color: isLocked ? '#94a3b8' : 'var(--text-main)',
                  zIndex: 10,
                  whiteSpace: 'nowrap'
                }}>
                  {loc.label}
                  {isCompleted && <CheckCircle size={16} color="#10B981" />}
                  {isLocked && <Lock size={16} color="#94a3b8" />}
                </div>
                <div style={{
                  width: 2,
                  height: 20,
                  background: isLocked ? '#94a3b8' : loc.iconColor
                }} />
                <div style={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  background: isLocked ? '#cbd5e1' : loc.iconColor,
                  border: '3px solid white',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }} />
              </div>
            );
          })}
          
          {/* Boss Battle Pin - appears only if all basic missions are complete */}
          {gameState.completedMissions.length >= 5 && (
            <div 
              style={{
                position: 'absolute',
                top: '50%',
                left: '62%',
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                animation: 'pulse 2s infinite',
                zIndex: 2
              }}
              onClick={() => navigate('boss_battle')}
            >
              <div style={{ position: 'relative' }}>
                 <img src="/icon6.png" style={{ width: 100, height: 100, filter: 'drop-shadow(0 0 10px rgba(239,68,68,0.8))' }} alt="Boss Level" />
                 <div style={{ 
                    position: 'absolute',
                    bottom: -20,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#EF4444', 
                    color: 'white',
                    padding: '4px 8px', 
                    borderRadius: '8px', 
                    boxShadow: '0 4px 10px rgba(239,68,68,0.5)',
                    fontWeight: 'bold',
                    fontSize: '0.8rem',
                    whiteSpace: 'nowrap'
                  }}>
                    FINAL MISSION
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchoolMap;
