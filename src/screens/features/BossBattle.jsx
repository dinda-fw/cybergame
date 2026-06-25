import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import { ShieldAlert, Server, Database, Wifi, Clock, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

const BossBattle = ({ navigate, completeMission, addXP, recordMistake }) => {
  // Game States
  const [timeLeft, setTimeLeft] = useState(40); // 40 seconds
  const [serverStatus, setServerStatus] = useState(40);
  const [dbStatus, setDbStatus] = useState(65);
  const [netStatus, setNetStatus] = useState(80);
  const [currentEvent, setCurrentEvent] = useState(0);
  const [gameStatus, setGameStatus] = useState('playing'); // playing, win, lose
  const [points, setPoints] = useState(0);
  const [message, setMessage] = useState(null); // toast message

  const events = [
    {
      id: 1,
      title: "Event 1",
      desc: "Email mencurigakan masuk ke server.",
      detail: "Dari: admin@dapodik-verifikasi.xyz",
      options: [
        { text: "A. Hapus", isCorrect: true },
        { text: "B. Karantina", isCorrect: false },
        { text: "C. Buka", isCorrect: false }
      ]
    },
    {
      id: 2,
      title: "Event 2",
      desc: "IP 185.32.xxx.xxx melakukan 300 request/detik",
      detail: "Terdeteksi potensi serangan DDoS",
      options: [
        { text: "Block Firewall", isCorrect: true },
        { text: "Allow", isCorrect: false },
        { text: "Ignore", isCorrect: false }
      ]
    },
    {
      id: 3,
      title: "Event 3",
      desc: "Guru menerima permintaan OTP",
      detail: "Ada SMS masuk meminta OTP login e-rapor",
      options: [
        { text: "Edukasi Guru", isCorrect: true },
        { text: "Kirim OTP", isCorrect: false },
        { text: "Abaikan", isCorrect: false }
      ]
    }
  ];

  // Timer
  useEffect(() => {
    if (gameStatus !== 'playing') return;
    
    if (timeLeft <= 0) {
      setGameStatus('lose');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, gameStatus]);

  // Win/Lose condition
  useEffect(() => {
    if (gameStatus !== 'playing') return;

    if (serverStatus <= 0) {
      setGameStatus('lose');
    } else if (currentEvent >= events.length && !message) {
      setGameStatus('win');
      completeMission('boss_battle', 500 + points); // 500 base XP + points
      if (points > 0) addXP(points); // Points earned during events
    }
  }, [serverStatus, currentEvent, gameStatus, events.length, completeMission, addXP, points, message]);

  const handleChoice = (isCorrect) => {
    if (isCorrect) {
      setPoints(prev => prev + 20);
      showMessage("Tindakan Tepat! +20 Security Points", "success");
    } else {
      setServerStatus(prev => Math.max(0, prev - 10));
      showMessage("Tindakan Salah! Server Integrity -10%", "error");
      if (recordMistake) recordMistake("Boss Battle: Server Pusat", `Salah memilih tindakan pada situasi: ${events[currentEvent].desc}`);
    }

    // Move to next event after a short delay
    setTimeout(() => {
      setCurrentEvent(prev => prev + 1);
    }, 1500);
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 1500);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const renderProgressBar = (label, value, icon, color) => (
    <div className="flex-column" style={{ gap: '4px' }}>
      <div className="flex-row space-between" style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>
        <div className="flex-row" style={{ alignItems: 'center', gap: '4px' }}>
          {icon} {label}
        </div>
        <span>{value}%</span>
      </div>
      <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ width: `${value}%`, height: '100%', background: color, transition: 'width 0.3s' }} />
      </div>
    </div>
  );

  return (
    <div className="flex-column h-full">
      <Header title="Darurat: Server Pusat" showBack={true} onBack={() => navigate('schoolMap')} />
      
      <div className="content-area flex-column" style={{ padding: '1rem', gap: '1rem', overflowY: 'auto' }}>
        
        {/* Alert Header */}
        <div className="cyber-card flex-row animate-pulse" style={{ background: 'rgba(220, 38, 38, 0.2)', borderColor: 'var(--danger-red)', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <ShieldAlert size={28} className="text-danger" />
          <h2 className="font-bold text-danger text-glow" style={{ margin: 0 }}>🚨 ALERT LEVEL: KRITIS</h2>
        </div>

        {/* Status Panel */}
        <div className="cyber-card flex-column" style={{ gap: '1rem', background: '#0b141a' }}>
          <div className="flex-row space-between" style={{ alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
            <h3 className="font-bold">System Status</h3>
            <div className="flex-row" style={{ alignItems: 'center', gap: '8px', color: timeLeft <= 30 ? 'var(--danger-red)' : 'var(--primary-color)' }}>
              <Clock size={20} />
              <span className="font-bold" style={{ fontSize: '1.2rem', fontFamily: 'monospace' }}>{formatTime(timeLeft)}</span>
            </div>
          </div>
          
          {renderProgressBar("Server Nilai", serverStatus, <Server size={14} />, serverStatus > 20 ? 'var(--warning-yellow)' : 'var(--danger-red)')}
          {renderProgressBar("Database", dbStatus, <Database size={14} />, 'var(--primary-color)')}
          {renderProgressBar("Jaringan", netStatus, <Wifi size={14} />, 'var(--success-green)')}
        </div>

        {/* Message Toast */}
        {message && (
          <div className={`cyber-card flex-row animate-fade-in`} style={{ padding: '0.8rem', justifyContent: 'center', background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', borderColor: message.type === 'success' ? 'var(--success-green)' : 'var(--danger-red)' }}>
            <span className={`font-bold ${message.type === 'success' ? 'text-success' : 'text-danger'}`}>{message.text}</span>
          </div>
        )}

        {/* Events */}
        {gameStatus === 'playing' && currentEvent < events.length && !message && (
          <div className="cyber-card flex-column animate-fade-in" style={{ gap: '1rem', flexGrow: 1 }}>
            <h3 className="font-bold text-glow-neon" style={{ borderBottom: '1px solid var(--primary-color)', paddingBottom: '0.5rem' }}>
              {events[currentEvent].title}
            </h3>
            <p style={{ fontSize: '1.1rem', margin: '0.5rem 0' }}>{events[currentEvent].desc}</p>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '8px', borderLeft: '4px solid var(--warning-yellow)', fontFamily: 'monospace' }}>
              {events[currentEvent].detail}
            </div>

            <div className="flex-column" style={{ gap: '0.5rem', marginTop: 'auto' }}>
              <p className="text-muted" style={{ fontSize: '0.85rem' }}>Pilih tindakan:</p>
              {events[currentEvent].options.map((opt, i) => (
                <button 
                  key={i} 
                  className="btn" 
                  style={{ background: 'rgba(0,0,0,0.3)', color: 'var(--text-main)', border: '1px solid var(--primary-color)', textAlign: 'left', padding: '12px', justifyContent: 'flex-start', borderRadius: '4px' }}
                  onClick={() => handleChoice(opt.isCorrect)}
                >
                  {opt.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Game Over / Win Screens */}
        {gameStatus === 'win' && (
          <div className="cyber-card flex-column text-center animate-fade-in mt-4" style={{ borderColor: 'var(--success-green)', gap: '0.5rem', padding: '1.5rem', background: 'rgba(16, 185, 129, 0.1)' }}>
            <CheckCircle2 size={48} className="text-success" style={{ alignSelf: 'center' }} />
            <h2 className="text-success font-bold">MISSION COMPLETE!</h2>
            <p style={{ fontSize: '0.9rem' }}>Kamu berhasil mengatasi semua ancaman dan menyelamatkan server sekolah!</p>
            <p className="font-bold text-success" style={{ fontSize: '1.2rem' }}>+500 XP (Dasar) + {points} XP (Bonus)</p>
            <button className="btn cyber-btn mt-4" onClick={() => navigate('results')}>Lihat Hasil Akhir</button>
          </div>
        )}

        {gameStatus === 'lose' && (
          <div className="cyber-card flex-column text-center animate-fade-in mt-4" style={{ borderColor: 'var(--danger-red)', gap: '0.5rem', padding: '1.5rem', background: 'rgba(220, 38, 38, 0.1)' }}>
            <XCircle size={48} className="text-danger" style={{ alignSelf: 'center' }} />
            <h2 className="text-danger font-bold">SYSTEM BREACHED!</h2>
            <p style={{ fontSize: '0.9rem' }}>Pertahanan runtuh. Data sekolah berhasil diretas oleh penyerang.</p>
            <button className="btn cyber-btn mt-4" style={{ background: 'transparent', color: 'var(--danger-red)', border: '1px solid var(--danger-red)' }} onClick={() => navigate('results')}>Selesai / Lihat Hasil</button>
          </div>
        )}

      </div>
    </div>
  );
};

export default BossBattle;
