import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import { Timer, ShieldAlert, CheckCircle, Target, Terminal } from 'lucide-react';

const CyberScanChallenge = ({ navigate, addXP }) => {
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const items = [
    { text: "http://login-bca.com", safe: false },
    { text: "https://google.com", safe: true },
    { text: "Email: 'Menang Undian 1M! Klik link ini'", safe: false },
    { text: "WiFi: 'Starbucks_Free_NoPass'", safe: false },
    { text: "WhatsApp: 'Halo kak, dari JNE ada paket'", safe: false },
    { text: "https://kemdikbud.go.id", safe: true },
    { text: "WiFi: 'Library_WPA3_Staff'", safe: true },
    { text: "Email: 'Laporan Nilai Semester Ganjil.pdf'", safe: true }
  ];

  useEffect(() => {
    let timer;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isPlaying) {
      setIsPlaying(false);
      setGameOver(true);
      addXP(score * 10);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft, score, addXP]);

  const startGame = () => {
    setIsPlaying(true);
    setGameOver(false);
    setScore(0);
    setTimeLeft(60);
    nextItem();
  };

  const nextItem = () => {
    const randomIdx = Math.floor(Math.random() * items.length);
    setCurrentItem(items[randomIdx]);
  };

  const handleChoice = (chooseSafe) => {
    if (chooseSafe === currentItem.safe) {
      setScore(prev => prev + 1);
    } else {
      setTimeLeft(prev => Math.max(0, prev - 5)); // Penalty 5s
    }
    nextItem();
  };

  return (
    <div className="flex-column h-full">
      <Header title="Cyber Challenge" showBack={true} onBack={() => navigate('dashboard')} />
      
      <div className="content-area flex-column" style={{ padding: '1rem', gap: '1rem', flex: 1 }}>
        
        {!isPlaying && !gameOver && (
          <div className="glass-card flex-column flex-center text-center" style={{ padding: '2rem', flex: 1, justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: 120, height: 120, marginBottom: '2rem' }}>
              <div style={{ position: 'absolute', inset: 0, border: '4px solid var(--primary-color)', borderRadius: '50%', animation: 'spin 4s linear infinite', borderTopColor: 'transparent', opacity: 0.5 }} />
              <div style={{ position: 'absolute', inset: 10, border: '4px solid var(--secondary-color)', borderRadius: '50%', animation: 'spin-reverse 3s linear infinite', borderBottomColor: 'transparent', opacity: 0.5 }} />
              <div className="flex-center" style={{ width: '100%', height: '100%' }}>
                <Terminal size={48} color="var(--text-main)" />
              </div>
            </div>
            <h3 className="font-bold text-glow">Cyber Challenge</h3>
            <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)' }}>Deteksi URL, Email, dan Chat dengan cepat! Waktumu 60 detik.</p>
            <p style={{ fontSize: '1.05rem', color: 'var(--danger-red)' }}>Salah tebak = penalti waktu 5 detik!</p>
            <button className="cyber-btn" onClick={startGame}>Mulai Tantangan</button>
          </div>
        )}

        {isPlaying && (
          <div className="flex-column animate-fade-in h-full">
            <div className="cyber-card flex-row space-between" style={{ padding: '0.5rem 1rem', marginBottom: '2rem' }}>
              <div className="flex-row" style={{ alignItems: 'center', gap: '0.5rem' }}>
                <Timer size={20} className={timeLeft <= 10 ? 'text-danger' : 'text-primary'} color={timeLeft <= 10 ? 'var(--danger-red)' : 'var(--primary-color)'} />
                <span className="font-bold" style={{ color: timeLeft <= 10 ? 'var(--danger-red)' : 'var(--primary-color)' }}>{timeLeft}s</span>
              </div>
              <div className="font-bold text-glow-neon">Skor: {score}</div>
            </div>

            <div className="cyber-card flex-center text-center" style={{ minHeight: '200px', marginBottom: '2rem', background: 'rgba(0, 240, 255, 0.05)', borderColor: 'var(--primary-color)' }}>
              <h2 className="text-glow" style={{ fontSize: '1.2rem', wordBreak: 'break-word', margin: 0 }}>{currentItem?.text}</h2>
            </div>

            <div className="flex-row" style={{ gap: '1rem' }}>
              <button className="btn btn-danger w-full" onClick={() => handleChoice(false)} style={{ height: '80px', fontSize: '1.2rem' }}>
                <ShieldAlert size={28} /> BAHAYA
              </button>
              <button className="btn btn-success w-full" onClick={() => handleChoice(true)} style={{ height: '80px', fontSize: '1.2rem' }}>
                <CheckCircle size={28} /> AMAN
              </button>
            </div>
          </div>
        )}

        {gameOver && (
          <div className="cyber-card flex-column text-center animate-fade-in" style={{ gap: '1rem', margin: 'auto' }}>
            <Trophy size={48} color="var(--secondary-color)" style={{ alignSelf: 'center' }} />
            <h3 className="font-bold text-glow-neon">Waktu Habis!</h3>
            <p style={{ fontSize: '1.2rem' }}>Skor Akhir: <strong style={{ color: 'var(--primary-color)' }}>{score}</strong></p>
            <p className="font-bold" style={{ color: 'var(--success-green)' }}>+{score * 10} XP Didapatkan</p>
            <button className="cyber-btn mt-2" onClick={() => navigate('dashboard')}>Selesai</button>
            <button className="cyber-btn mt-2" style={{ background: 'transparent', border: '1px solid var(--primary-color)', color: 'var(--primary-color)' }} onClick={startGame}>Main Lagi</button>
          </div>
        )}
      </div>
    </div>
  );
};
import { Trophy } from 'lucide-react';

export default CyberScanChallenge;
