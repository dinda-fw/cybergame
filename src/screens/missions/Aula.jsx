import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import { MessageCircle, User, ShieldAlert, CheckCircle, Search, AlertTriangle } from 'lucide-react';
import { questionBank } from '../../data/questionBank';

const renderTextWithLinks = (text) => {
  // Regex to match URLs (http/https) and .apk filenames
  const urlRegex = /(https?:\/\/[^\s]+|[a-zA-Z0-9_-]+\.apk)/g;
  const parts = text.split(urlRegex);
  return parts.map((part, i) => {
    if (part.match(urlRegex)) {
      return (
        <span 
          key={i} 
          style={{ 
            color: '#3b82f6', 
            textDecoration: 'underline', 
            fontWeight: 'bold', 
            cursor: 'pointer',
            padding: '2px 4px',
            background: 'rgba(59, 130, 246, 0.1)',
            borderRadius: '4px'
          }}
        >
          {part}
        </span>
      );
    }
    return part;
  });
};

const Aula = ({ navigate, completeMission, addXP, recordMistake, username, gameState }) => {
  const [status, setStatus] = useState('playing'); // playing, success, fail, timeUp
  const [scenario, setScenario] = useState(null);
  const [timeLeft, setTimeLeft] = useState(120);

  useEffect(() => {
    let hash = 0;
    const name = username || 'guest';
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % questionBank.aula.length;
    setScenario(questionBank.aula[index]);
    setTimeLeft(120);
    setStatus('playing');
  }, [username]);

  useEffect(() => {
    if (status !== 'playing') return;
    if (timeLeft <= 0) {
      setStatus('timeUp');
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, status]);

  const handleChoice = (isSafeFlagged) => {
    if (!scenario) return;

    if (isSafeFlagged) {
      setStatus('success');
      completeMission('mission_aula', 100);
    } else {
      setStatus('fail');
      completeMission('mission_aula', -50);
      if (recordMistake) recordMistake("Misi: Aula Sekolah", `Memilih respon yang salah pada insiden Social Engineering. ${scenario.explanation}`);
    }
  };

  const handleRetry = () => {
    setTimeLeft(120);
    setStatus('playing');
  };

  if (!scenario) return <div>Loading...</div>;

  return (
    <div className="flex-column h-full">
      <Header title="Misi: Aula Sekolah" showBack={true} onBack={() => navigate('schoolMap')} timeLeft={timeLeft} xp={gameState?.xp} level={gameState?.level} />
      
      <div className="content-area flex-column" style={{ padding: '0.5rem', gap: '0.5rem' }}>
        <h3 className="font-bold text-center mt-2 text-glow-neon">Misi: Hindari Penipuan Pesan</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
          <div style={{ background: 'rgba(255, 165, 0, 0.1)', borderLeft: '3px solid #F59E0B', padding: '10px', borderRadius: '4px' }}>
            <p style={{ margin: 0, fontSize: '1.1rem' }}><span style={{fontWeight: 'bold', color: '#F59E0B'}}>Studi Kasus:</span> Hari ini ponsel seluruh warga sekolah mendadak dibanjiri berbagai pesan acak dari hacker, Pesan-pesan ini sengaja memanfaatkan rasa panik atau umpan hadiah gratis agar kamu tergiur dan langsung mengklik tautan tanpa berpikir panjang. Yuk, bantu amankan sekolah dengan mendeteksi modus penipuan massal ini sebelum ada korban lainya.</p>
          </div>
          <div style={{ background: 'rgba(0, 240, 255, 0.1)', borderLeft: '3px solid var(--primary-color)', padding: '10px', borderRadius: '4px' }}>
            <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>{scenario.instruction}</p>
          </div>
        </div>
        
        <div className="cyber-card flex-column" style={{ padding: 0, background: '#0b141a', flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {/* WhatsApp Header Mockup */}
          <div style={{ background: '#202c33', padding: '10px 15px', color: '#e9edef', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: '#ccc', borderRadius: '50%', width: 40, height: 40, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <User size={24} color="white" />
            </div>
            <div>
              <p className="font-bold" style={{ margin: 0, fontSize: '1rem' }}>{scenario.sender}</p>
              <p style={{ margin: 0, fontSize: '1rem', opacity: 0.8 }}>Online</p>
            </div>
          </div>
          
          {/* Chat Body */}
          <div style={{ padding: '15px', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto' }}>
            <div style={{ alignSelf: 'flex-start', background: '#202c33', color: '#e9edef', padding: '10px 15px', borderRadius: '0 12px 12px 12px', maxWidth: '85%', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
              <p style={{ margin: 0, fontSize: '1.15rem' }}>{renderTextWithLinks(scenario.message)}</p>
            </div>

            {status === 'playing' && (
              <div className="flex-column animate-fade-in" style={{ gap: '0.5rem', marginTop: 'auto' }}>
                <p className="text-center font-bold" style={{ color: 'var(--primary-color)', fontSize: '1.05rem', background: 'rgba(255,255,255,0.05)', padding: '5px', borderRadius: '8px' }}>
                  Pilih balasan yang paling aman:
                </p>
                {scenario.options.map((opt, i) => (
                  <button 
                    key={i} 
                    className="btn hover-glow" 
                    style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--text-main)', border: '1px solid rgba(255,255,255,0.2)' }} 
                    onClick={() => handleChoice(opt.isSafe)}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            )}

            {status === 'success' && (
              <div style={{ alignSelf: 'flex-end', background: '#005c4b', color: '#e9edef', padding: '10px 15px', borderRadius: '12px 0 12px 12px', maxWidth: '85%', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                <p style={{ margin: 0, fontSize: '1.15rem' }}>*Nomor ini telah diblokir dan dilaporkan*</p>
              </div>
            )}

            {status === 'fail' && (
              <div style={{ alignSelf: 'flex-end', background: '#005c4b', color: '#e9edef', padding: '10px 15px', borderRadius: '12px 0 12px 12px', maxWidth: '85%', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                <p style={{ margin: 0, fontSize: '1.15rem' }}>*Pesan Terkirim*</p>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.5rem' }}>
           <button className="btn flex-row" style={{ background: 'var(--primary-color)', color: 'white', borderRadius: '8px', padding: '8px 16px', fontSize: '1.15rem', width: '100%', justifyContent: 'center' }} onClick={() => navigate('url_detective', { backTo: 'mission_aula' })}>
              <Search size={18} style={{ marginRight: '8px' }}/> Cek Link di Alat Pemeriksa
           </button>
        </div>

        {status === 'success' && (
          <div className="cyber-card flex-column text-center animate-fade-in mt-2" style={{ borderColor: 'var(--success-green)', gap: '0.5rem', padding: '1rem' }}>
            <h3 className="text-success font-bold">Pintar Sekali!</h3>
            <p style={{ fontSize: '1.1rem' }}>{scenario.explanation}</p>
            <p className="font-bold text-success">+100 XP</p>
            <button className="btn cyber-btn mt-2" onClick={() => navigate('schoolMap')}>Kembali ke Peta</button>
          </div>
        )}

        {status === 'fail' && (
          <div className="cyber-card flex-column text-center animate-fade-in mt-2" style={{ borderColor: 'var(--danger-red)', gap: '0.5rem', padding: '1rem' }}>
            <h3 className="text-danger font-bold">Yah, Anda Tertipu!</h3>
            <p style={{ fontSize: '1.1rem' }}>{scenario.failMessage}</p>
            <p className="font-bold text-danger">-50 XP</p>
            <button className="btn btn-outline mt-2" onClick={() => navigate('schoolMap')}>Lanjut ke Map</button>
          </div>
        )}

        {status === 'timeUp' && (
          <div className="cyber-card flex-column text-center animate-fade-in mt-2" style={{ borderColor: 'var(--warning-yellow)', gap: '0.5rem', padding: '1rem' }}>
            <h3 className="text-warning font-bold">Waktu Habis!</h3>
            <p style={{ fontSize: '1.1rem' }}>Anda terlalu lama mengambil tindakan!</p>
            <button className="btn cyber-btn mt-2" onClick={handleRetry}>Coba Lagi</button>
            <button className="btn btn-outline mt-2" onClick={() => navigate('schoolMap')}>Kembali ke Peta</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Aula;
