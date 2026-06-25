import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import { Mail, ShieldAlert, CheckCircle, Search, AlertTriangle, ArrowRight } from 'lucide-react';
import { questionBank } from '../../data/questionBank';

const renderTextWithLinks = (text) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  return parts.map((part, i) => {
    if (part.match(urlRegex)) {
      return <span key={i} style={{ color: '#3b82f6', textDecoration: 'underline' }}>{part}</span>;
    }
    return part;
  });
};

const deterministicShuffle = (username, items) => {
  const name = username || 'guest';
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const random = () => {
    const x = Math.sin(hash++) * 10000;
    return x - Math.floor(x);
  };
  
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const RuangGuru = ({ navigate, completeMission, addXP, recordMistake, username }) => {
  const [status, setStatus] = useState('playing'); // playing, correct, success, fail, timeUp
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [consecutiveWins, setConsecutiveWins] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [failMessage, setFailMessage] = useState({ title: '', desc: '' });

  useEffect(() => {
    const shuffled = deterministicShuffle(username, questionBank.ruangGuru);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setConsecutiveWins(0);
    setTimeLeft(60);
    setStatus('playing');
  }, [username]);

  useEffect(() => {
    if (status !== 'playing') return;
    if (timeLeft <= 0) {
      setStatus('timeUp');
      setConsecutiveWins(0);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, status]);

  const handleChoice = (isPhishingFlagged) => {
    const question = questions[currentIndex];
    if (!question) return;

    if (isPhishingFlagged === question.isPhishing) {
      const newWins = consecutiveWins + 1;
      setConsecutiveWins(newWins);
      
      if (newWins >= 3) {
        setStatus('success');
        completeMission('mission_ruangguru', 150);
      } else {
        setStatus('correct');
        addXP(20);
      }
    } else {
      if (isPhishingFlagged) {
         setFailMessage({ title: 'SALAH LAPORAN!', desc: 'Email ini sebenarnya aman, tetapi kamu melaporkannya sebagai penipuan. Pesan penting dari sekolah jadi tidak bisa dibaca.' });
      } else {
         setFailMessage({ title: 'YAH, KAMU TERTIPU!', desc: 'Kamu menganggap email palsu ini aman. Sekarang akunmu berhasil dibajak oleh penipu.' });
      }
      setStatus('fail');
      addXP(-20);
      setConsecutiveWins(0); // Reset progress on failure
      if (recordMistake) recordMistake("Misi: Ruang Guru", `Gagal mendeteksi apakah email dari ${question.sender} adalah phishing atau aman. ${question.explanation}`);
    }
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % questions.length);
    setTimeLeft(60);
    setStatus('playing');
  };

  const handleRetry = () => {
    setCurrentIndex(prev => (prev + 1) % questions.length);
    setTimeLeft(60);
    setStatus('playing');
  };

  const question = questions[currentIndex];

  if (!question) return <div>Loading...</div>;

  return (
    <div className="flex-column h-full">
      <Header title="Misi: Ruang Guru" showBack={true} onBack={() => navigate('schoolMap')} timeLeft={timeLeft} />
      
      <div className="content-area flex-column" style={{ padding: '1rem', gap: '1rem' }}>
        <h3 className="font-bold text-center text-glow-neon">Misi: Detektif Kotak Masuk Email</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '-0.5rem', marginBottom: '0.5rem' }}>
          <div style={{ background: 'rgba(255, 165, 0, 0.1)', borderLeft: '3px solid #F59E0B', padding: '10px', borderRadius: '4px' }}>
            <p style={{ margin: 0, fontSize: '0.85rem' }}><span style={{fontWeight: 'bold', color: '#F59E0B'}}>Studi Kasus:</span> Beberapa guru melaporkan menerima email aneh yang mendesak mereka untuk membuka tautan atau lampiran penting. Ada kemungkinan ini adalah serangan penipuan.</p>
          </div>
          <div style={{ background: 'rgba(0, 240, 255, 0.1)', borderLeft: '3px solid var(--primary-color)', padding: '10px', borderRadius: '4px' }}>
            <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 'bold' }}>{question.instruction}</p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '0.5rem' }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: '30%', height: '8px', borderRadius: '4px',
              background: i < consecutiveWins ? 'var(--success-green)' : 'rgba(255,255,255,0.2)',
              boxShadow: i < consecutiveWins ? '0 0 10px var(--success-green)' : 'none',
              transition: 'all 0.3s'
            }} />
          ))}
        </div>
        <p className="text-center" style={{ fontSize: '0.85rem', marginTop: '-0.5rem' }}>Kamu harus menebak 3 email dengan benar berturut-turut untuk menang!</p>

        <div className="cyber-card" style={{ padding: '0' }}>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderTopLeftRadius: '16px', borderTopRightRadius: '16px', borderBottom: '1px solid var(--border-blue)' }}>
            <div className="flex-row" style={{ alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Mail size={24} color="var(--text-muted)" />
              <h4 style={{ margin: 0 }}>Kotak Masuk Email</h4>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: '8px' }}>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Dari: <span style={{ color: 'var(--danger-red)', fontWeight: 'bold' }}>{question.sender}</span></p>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Subjek: {question.subject}</p>
            </div>
          </div>
          <div style={{ padding: '1.5rem', fontSize: '0.95rem', color: 'var(--text-main)', background: 'transparent' }}>
            <p>Yth. Bapak/Ibu Guru,</p>
            <p style={{ marginTop: '0.5rem', lineHeight: '1.5' }}>{renderTextWithLinks(question.body)}</p>
            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <button className="btn cyber-btn" style={{ width: '100%', borderRadius: '8px' }}>Klik Link / Buka File (Hati-Hati!)</button>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.5rem' }}>
           <button className="btn flex-row" style={{ background: 'var(--primary-color)', color: 'white', borderRadius: '8px', padding: '8px 16px', fontSize: '0.9rem', width: '100%', justifyContent: 'center' }} onClick={() => navigate('url_detective', { backTo: 'mission_ruangguru' })}>
              <Search size={18} style={{ marginRight: '8px' }}/> Cek Link di Alat Pemeriksa
           </button>
        </div>

        {status === 'playing' && (
          <div className="flex-row space-between mt-4">
            <button className="btn hover-glow" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--text-main)', border: '1px solid rgba(255,255,255,0.2)' }} onClick={() => handleChoice(true)}>
              <ShieldAlert size={18} /> LAPORKAN PENIPUAN
            </button>
            <button className="btn hover-glow" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--text-main)', border: '1px solid rgba(255,255,255,0.2)' }} onClick={() => handleChoice(false)}>
              <CheckCircle size={18} /> EMAIL INI AMAN
            </button>
          </div>
        )}

        {status === 'correct' && (
           <div className="cyber-card flex-column text-center animate-fade-in mt-2" style={{ borderColor: 'var(--success-green)', gap: '0.5rem' }}>
            <CheckCircle size={40} className="text-success" style={{ alignSelf: 'center' }} />
            <h3 className="text-success font-bold">Betul Sekali!</h3>
            <p style={{ fontSize: '0.9rem' }}>{question.explanation}</p>
            <p className="font-bold text-success">+20 XP</p>
            <button className="btn cyber-btn mt-2 flex-row flex-center" onClick={handleNext}>
              Lanjut <ArrowRight size={18} style={{ marginLeft: '4px' }}/>
            </button>
          </div>
        )}

        {status === 'success' && (
          <div className="cyber-card flex-column text-center animate-fade-in mt-2" style={{ borderColor: 'var(--success-green)', gap: '0.5rem' }}>
            <CheckCircle size={40} className="text-success" style={{ alignSelf: 'center' }} />
            <h3 className="text-success font-bold">Luar Biasa!</h3>
            <p style={{ fontSize: '0.9rem' }}>Kamu berhasil menebak 3 email dengan benar! Sekarang semua guru aman dari penipuan.</p>
            <p className="font-bold text-success">+150 XP</p>
            <button className="btn cyber-btn mt-2" onClick={() => navigate('schoolMap')}>Kembali ke Peta</button>
          </div>
        )}

        {status === 'fail' && (
          <div className="cyber-card flex-column text-center animate-fade-in mt-2" style={{ borderColor: 'var(--danger-red)', gap: '0.5rem' }}>
            <ShieldAlert size={40} className="text-danger" style={{ alignSelf: 'center' }} />
            <h3 className="text-danger font-bold">{failMessage.title || 'Ups, Tebakanmu Salah!'}</h3>
            <p style={{ fontSize: '0.9rem' }}>{failMessage.desc}</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{question.explanation}</p>
            <p className="font-bold text-danger">Ayo mengulang dari awal ya. Tetap semangat!</p>
            <button className="btn cyber-btn mt-2" onClick={handleRetry}>Coba Lagi</button>
            <button className="btn btn-outline mt-2" onClick={() => navigate('schoolMap')}>Kembali ke Peta</button>
          </div>
        )}

        {status === 'timeUp' && (
          <div className="cyber-card flex-column text-center animate-fade-in mt-2" style={{ borderColor: 'var(--warning-yellow)', gap: '0.5rem' }}>
            <AlertTriangle size={40} className="text-warning" style={{ alignSelf: 'center' }} />
            <h3 className="text-warning font-bold">Waktu Habis!</h3>
            <p style={{ fontSize: '0.9rem' }}>Kamu terlalu lama berpikir, sehingga virusnya keburu masuk. Ayo coba lagi!</p>
            <button className="btn cyber-btn mt-2" onClick={handleRetry}>Coba Lagi</button>
            <button className="btn btn-outline mt-2" onClick={() => navigate('schoolMap')}>Kembali ke Peta</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RuangGuru;
