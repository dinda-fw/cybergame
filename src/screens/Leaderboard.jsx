import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { Trophy, ArrowLeft, X, Shield, ServerCrash, CheckCircle } from 'lucide-react';

const API_URL = '/api';

const Leaderboard = ({ navigate, username, currentXp, backTo = 'dashboard' }) => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(`${API_URL}/leaderboard`);
        if (!res.ok) throw new Error('API failed');
        const data = await res.json();
        setLeaderboardData(data);
      } catch (e) {
        console.warn("Backend offline, generating leaderboard from localstorage");
        const users = JSON.parse(localStorage.getItem('cybergame_users') || '{}');
        const data = Object.values(users).sort((a, b) => (b.xp || 0) - (a.xp || 0));
        setLeaderboardData(data);
      }
    };
    fetchLeaderboard();
  }, []);

  const handleUserClick = async (clickedUsername) => {
    try {
      const res = await fetch(`${API_URL}/user/${clickedUsername}`);
      if (!res.ok) throw new Error('API failed');
      const userDetail = await res.json();
      setSelectedUser(userDetail);
      setIsModalOpen(true);
    } catch (e) {
      console.warn("Backend offline, getting user detail from localstorage");
      const users = JSON.parse(localStorage.getItem('cybergame_users') || '{}');
      const user = users[clickedUsername];
      if (user) {
        setSelectedUser(user);
        setIsModalOpen(true);
      }
    }
  };

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
            <p className="text-muted" style={{ fontSize: '0.8rem', margin: 0 }}>Klik nama siswa untuk melihat Laporan Belajarnya!</p>
          </div>
        </div>

        {/* Leaderboard list */}
        <div className="cyber-card flex-column" style={{ padding: '0.5rem', gap: '0.5rem' }}>
          {leaderboardData.map((player, idx) => {
            const isCurrentUser = player.username.toLowerCase() === username.toLowerCase();
            const rank = idx + 1;

            let rankBadge = `${rank}`;
            let rankColor = 'var(--text-main)';
            let cardBg = isCurrentUser ? 'rgba(0, 240, 255, 0.15)' : 'rgba(0,0,0,0.2)';
            let borderColor = isCurrentUser ? 'var(--secondary-color)' : 'var(--glass-border)';

            if (rank === 1) { rankBadge = '🥇'; rankColor = '#fbbf24'; }
            else if (rank === 2) { rankBadge = '🥈'; rankColor = '#cbd5e1'; }
            else if (rank === 3) { rankBadge = '🥉'; rankColor = '#b45309'; }

            return (
              <div
                key={idx}
                onClick={() => handleUserClick(player.username)}
                style={{
                  display: 'flex', alignItems: 'center', padding: '12px 16px',
                  background: cardBg, borderRadius: '12px', border: `1px solid ${borderColor}`,
                  gap: '12px', transition: 'all 0.2s',
                  boxShadow: isCurrentUser ? '0 0 10px rgba(0, 240, 255, 0.2)' : 'none',
                  cursor: 'pointer'
                }}
                className="hover-glow"
              >
                <div style={{ width: '30px', fontSize: '1.2rem', fontWeight: 'bold', display: 'flex', justifyContent: 'center', color: rankColor }}>
                  {rankBadge}
                </div>
                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <span className="font-bold" style={{ color: isCurrentUser ? 'var(--secondary-color)' : 'var(--text-main)', fontSize: '1rem' }}>
                    {player.username} {isCurrentUser && <span style={{ fontSize: '0.75rem', padding: '2px 6px', background: 'var(--secondary-color)', color: '#000', borderRadius: '4px', marginLeft: '4px' }}>KAMU</span>}
                  </span>
                  <span className="text-muted" style={{ fontSize: '0.8rem' }}>{player.class_name || 'Murid'}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="font-bold text-glow-neon" style={{ fontSize: '1.1rem', color: 'var(--primary-color)' }}>
                    {player.xp} XP
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <button className="btn cyber-btn mt-4" onClick={() => navigate(backTo)} style={{ width: '100%' }}>
          <ArrowLeft size={16} style={{ marginRight: '8px', display: 'inline', verticalAlign: 'middle' }} />
          Kembali
        </button>
      </div>

      {/* Detail Modal */}
      {isModalOpen && selectedUser && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)',
          zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
        }}>
          <div className="cyber-card flex-column" style={{ width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="flex-row space-between" style={{ alignItems: 'center', borderBottom: '1px solid var(--border-blue)', paddingBottom: '10px', marginBottom: '15px' }}>
              <h2 className="text-glow" style={{ margin: 0, fontSize: '1.5rem' }}>Detail Siswa</h2>
              <X size={24} color="white" style={{ cursor: 'pointer' }} onClick={() => setIsModalOpen(false)} />
            </div>

            <div className="flex-row mobile-col" style={{ gap: '15px', marginBottom: '20px' }}>
              <div style={{ background: 'rgba(0,240,255,0.1)', padding: '15px', borderRadius: '12px', flex: 1, border: '1px solid var(--secondary-color)' }}>
                <div className="text-muted" style={{ fontSize: '0.9rem' }}>Nama</div>
                <div className="font-bold" style={{ fontSize: '1.2rem', color: 'white' }}>{selectedUser.username}</div>
                <div className="text-muted" style={{ fontSize: '0.9rem', marginTop: '5px' }}>Kelas</div>
                <div className="font-bold" style={{ fontSize: '1.1rem', color: 'white' }}>{selectedUser.class_name}</div>
              </div>
              <div style={{ background: 'rgba(136,204,20,0.1)', padding: '15px', borderRadius: '12px', flex: 1, border: '1px solid var(--primary-color)' }}>
                <div className="text-muted" style={{ fontSize: '0.9rem' }}>Poin XP</div>
                <div className="font-bold text-glow-neon" style={{ fontSize: '1.5rem', color: 'var(--primary-color)' }}>{selectedUser.xp}</div>
                <div className="text-muted" style={{ fontSize: '0.9rem', marginTop: '5px' }}>Level Saat Ini</div>
                <div className="font-bold" style={{ fontSize: '1.1rem', color: 'white' }}>Level {selectedUser.currentLevel}</div>
              </div>
            </div>

            <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '5px', marginBottom: '10px' }}>Riwayat Misi</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
              {selectedUser.completedMissions.length === 0 ? <span className="text-muted">Belum ada misi yang diselesaikan</span> : null}
              {selectedUser.completedMissions.map((mission, idx) => (
                <div key={idx} style={{ background: 'var(--success-green)', color: '#000', padding: '5px 10px', borderRadius: '15px', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <CheckCircle size={14} /> {mission.replace('mission_', '').toUpperCase()}
                </div>
              ))}
            </div>

            <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '5px', marginBottom: '10px', color: 'var(--danger-red)' }}>Riwayat Kesalahan</h3>
            <div className="flex-column" style={{ gap: '10px' }}>
              {selectedUser.mistakes.length === 0 ? <span className="text-muted">Tidak ada kesalahan (Sempurna!)</span> : null}
              {selectedUser.mistakes.map((mistake, idx) => (
                <div key={idx} style={{ background: 'rgba(239,68,68,0.1)', borderLeft: '4px solid var(--danger-red)', padding: '10px', borderRadius: '0 8px 8px 0' }}>
                  <div className="font-bold" style={{ color: 'var(--danger-red)', fontSize: '0.9rem', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '5px' }}><ServerCrash size={14} /> {mistake.location}</div>
                  <div style={{ fontSize: '0.9rem', color: 'white' }}>{mistake.explanation}</div>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
