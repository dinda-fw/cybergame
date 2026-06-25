import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { Trophy, ArrowLeft, Award, Sparkles } from 'lucide-react';

const Leaderboard = ({ navigate, username, currentXp, backTo = 'dashboard' }) => {
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    // Fictional mock players
    const mockPlayers = [
      { username: 'Budi_Cyber', xp: 2800, isMock: true },
      { username: 'Siti_Secure', xp: 2450, isMock: true },
      { username: 'Hacker_Noob', xp: 1900, isMock: true },
      { username: 'Agus_Defender', xp: 1650, isMock: true },
      { username: 'Roni_Admin', xp: 1250, isMock: true }
    ];

    try {
      const stored = localStorage.getItem('cyberLeaderboard');
      let parsed = stored ? JSON.parse(stored) : [];
      
      // Merge stored with mock, filter duplicates of same username (ignore case)
      const allPlayers = [...parsed];
      mockPlayers.forEach(mock => {
        if (!allPlayers.some(p => p.username.toLowerCase() === mock.username.toLowerCase())) {
          allPlayers.push(mock);
        }
      });

      // Sort by XP descending
      allPlayers.sort((a, b) => b.xp - a.xp);
      setLeaderboardData(allPlayers);
    } catch (e) {
      setLeaderboardData(mockPlayers);
    }
  }, []);

  return (
    <div className="flex-column h-full">
      <Header 
        title="Papan Peringkat" 
        showBack={true} 
        onBack={() => navigate(backTo)} 
      />
      
      <div className="content-area scroll-y flex-column" style={{ padding: '1.5rem', gap: '1rem' }}>
        
        {/* Banner */}
        <div className="cyber-card flex-row flex-center" style={{ gap: '1rem', background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.1) 0%, rgba(136, 204, 20, 0.1) 100%)', borderColor: 'var(--primary-color)' }}>
          <Trophy size={36} color="var(--warning-yellow)" className="animate-bounce" />
          <div>
            <h3 className="font-bold text-glow" style={{ margin: 0 }}>Cyber Champion Board</h3>
            <p className="text-muted" style={{ fontSize: '0.8rem', margin: 0 }}>Lihat siapa penjaga keamanan sekolah terbaik!</p>
          </div>
        </div>

        {/* Leaderboard list */}
        <div className="cyber-card flex-column" style={{ padding: '0.5rem', gap: '0.5rem' }}>
          {leaderboardData.map((player, idx) => {
            const isCurrentUser = player.username.toLowerCase() === username.toLowerCase();
            const rank = idx + 1;
            
            // styling top 3
            let rankBadge = `${rank}`;
            let rankColor = 'var(--text-main)';
            let cardBg = isCurrentUser ? 'rgba(0, 240, 255, 0.15)' : 'rgba(0,0,0,0.2)';
            let borderColor = isCurrentUser ? 'var(--secondary-color)' : 'var(--glass-border)';

            if (rank === 1) {
              rankBadge = '🥇';
              rankColor = '#fbbf24'; // Gold
            } else if (rank === 2) {
              rankBadge = '🥈';
              rankColor = '#cbd5e1'; // Silver
            } else if (rank === 3) {
              rankBadge = '🥉';
              rankColor = '#b45309'; // Bronze
            }

            return (
              <div 
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 16px',
                  background: cardBg,
                  borderRadius: '12px',
                  border: `1px solid ${borderColor}`,
                  gap: '12px',
                  transition: 'all 0.2s',
                  boxShadow: isCurrentUser ? '0 0 10px rgba(0, 240, 255, 0.2)' : 'none'
                }}
              >
                {/* Position */}
                <div style={{ width: '30px', fontSize: '1.2rem', fontWeight: 'bold', display: 'flex', justifyContent: 'center', color: rankColor }}>
                  {rankBadge}
                </div>

                {/* Nickname */}
                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <span className="font-bold" style={{ color: isCurrentUser ? 'var(--secondary-color)' : 'var(--text-main)', fontSize: '1rem' }}>
                    {player.username} {isCurrentUser && <span style={{ fontSize: '0.75rem', padding: '2px 6px', background: 'var(--secondary-color)', color: '#000', borderRadius: '4px', marginLeft: '4px' }}>KAMU</span>}
                  </span>
                  {player.isMock && <span className="text-muted" style={{ fontSize: '0.7rem' }}>murid</span>}
                </div>

                {/* XP */}
                <div style={{ textAlign: 'right' }}>
                  <span className="font-bold text-glow-neon" style={{ fontSize: '1.1rem', color: 'var(--primary-color)' }}>
                    {player.xp} XP
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <button 
          className="btn cyber-btn mt-4" 
          onClick={() => navigate(backTo)}
          style={{ width: '100%' }}
        >
          <ArrowLeft size={16} style={{ marginRight: '8px', display: 'inline', verticalAlign: 'middle' }} />
          Kembali
        </button>

      </div>
    </div>
  );
};

export default Leaderboard;
