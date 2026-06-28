import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import { Server, ShieldCheck, ShieldAlert, CheckCircle, AlertOctagon, Search, AlertTriangle } from 'lucide-react';
import { questionBank } from '../../data/questionBank';

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

const ServerRoom = ({ navigate, completeMission, addXP, recordMistake, username }) => {
  const [status, setStatus] = useState('playing'); // playing, checking, success, fail, timeUp
  const [urls, setUrls] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    const shuffled = deterministicShuffle(username, questionBank.serverRoom).slice(0, 8);
    const initialUrls = shuffled.map(q => ({ ...q, zone: 'unassigned' }));
    setUrls(initialUrls);
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

  const handleDragStart = (e, id) => {
    if (status !== 'playing') return;
    e.dataTransfer.setData('urlId', id);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // allow drop
  };

  const handleDrop = (e, zone) => {
    if (status !== 'playing') return;
    e.preventDefault();
    const id = e.dataTransfer.getData('urlId');
    setUrls(prev => prev.map(u => u.id === id ? { ...u, zone } : u));
  };

  const checkAnswers = () => {
    setStatus('checking');
    let correct = true;
    
    urls.forEach(u => {
      if (u.zone === 'unassigned') {
        correct = false;
      } else if (u.type === 'safe' && u.zone !== 'safe') {
        correct = false;
      } else if (u.type === 'danger' && u.zone !== 'danger') {
        correct = false;
      }
    });

    setTimeout(() => {
      if (correct) {
        setStatus('success');
        completeMission('mission_serverroom', 0);
      } else {
        setStatus('fail');
        addXP(-50);
        completeMission('mission_serverroom', 0);
        if (recordMistake) recordMistake("Misi: Server Room", "Gagal mengklasifikasikan URL yang aman dan berbahaya dengan tepat pada firewall. Beberapa URL phishing lolos ke jaringan sekolah.");
      }
    }, 1000);
  };

  const handleRetry = () => {
    setTimeLeft(120);
    const shuffled = deterministicShuffle(username, questionBank.serverRoom).slice(0, 8);
    const initialUrls = shuffled.map(q => ({ ...q, zone: 'unassigned' }));
    setUrls(initialUrls);
    setStatus('playing');
  };

  const unassignedUrls = urls.filter(u => u.zone === 'unassigned');
  const safeUrls = urls.filter(u => u.zone === 'safe');
  const dangerUrls = urls.filter(u => u.zone === 'danger');

  const allAssigned = urls.every(u => u.zone !== 'unassigned');

  return (
    <div className="flex-column h-full">
      <Header title="Misi: Server Room" showBack={true} onBack={() => navigate('schoolMap')} timeLeft={timeLeft} />
      
      <div className="content-area flex-column" style={{ padding: '0.5rem', gap: '0.5rem' }}>
        <h3 className="font-bold text-center mt-2 text-glow-neon">Misi: Penjaga Gerbang Server</h3>
        <div style={{ background: 'rgba(0, 240, 255, 0.1)', borderLeft: '3px solid var(--primary-color)', padding: '10px', borderRadius: '4px', marginBottom: '0.5rem' }}>
          <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>Tugas: Analisis setiap URL di bawah ini. Tarik (drag & drop) URL yang menurutmu aman ke "Zona Aman", dan URL phishing/berbahaya ke "Zona Bahaya".</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
           <button className="btn flex-row" style={{ background: 'var(--primary-color)', color: 'white', borderRadius: '8px', padding: '6px 12px', fontSize: '1.1rem', width: '100%', justifyContent: 'center' }} onClick={() => navigate('url_detective', { backTo: 'mission_serverroom' })}>
              <Search size={16} style={{ marginRight: '8px' }}/> Cek Web yang Mencurigakan
           </button>
        </div>

        {/* Unassigned URLs */}
        <div 
          style={{ minHeight: '60px', padding: '10px', background: '#e2e8f0', borderRadius: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'unassigned')}
        >
          {unassignedUrls.length === 0 && <span style={{ fontSize: '1.05rem', color: 'var(--text-muted)' }}>Semua alamat web sudah dimasukkan</span>}
          {unassignedUrls.map(u => (
            <div
              key={u.id}
              draggable={status === 'playing'}
              onDragStart={(e) => handleDragStart(e, u.id)}
              style={{ padding: '6px 12px', background: 'white', color: '#0f172a', borderRadius: '20px', fontSize: '1.05rem', cursor: status === 'playing' ? 'grab' : 'default', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
            >
              {u.url}
            </div>
          ))}
        </div>

        {/* Drop Zones */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', flexGrow: 1, marginTop: '10px' }}>
          
          {/* Safe Zone */}
          <div 
            className="flex-column cyber-card"
            style={{ padding: '10px', background: 'rgba(16, 185, 129, 0.1)', borderColor: '#86efac' }}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'safe')}
          >
            <div className="flex-center flex-column text-success font-bold mb-4">
              <ShieldCheck size={32} />
              <span>Zona Aman</span>
            </div>
            <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {safeUrls.map(u => {
                let bgColor = 'white';
                let textColor = '#0f172a';
                if (status === 'fail' || status === 'success') {
                  bgColor = u.type === 'danger' ? '#fca5a5' : '#86efac';
                  textColor = u.type === 'danger' ? '#991b1b' : '#166534';
                }
                return (
                  <div key={u.id} draggable={status === 'playing'} onDragStart={(e) => handleDragStart(e, u.id)} style={{ padding: '6px', background: bgColor, color: textColor, borderRadius: '8px', fontSize: '1rem', textAlign: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                    {u.url}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Danger Zone */}
          <div 
            className="flex-column cyber-card"
            style={{ padding: '10px', background: 'rgba(239, 68, 68, 0.1)', borderColor: '#fca5a5' }}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'danger')}
          >
            <div className="flex-center flex-column text-danger font-bold mb-4">
              <AlertOctagon size={32} />
              <span>Zona Bahaya (Penipuan)</span>
            </div>
            <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {dangerUrls.map(u => {
                let bgColor = 'white';
                let textColor = '#0f172a';
                if (status === 'fail' || status === 'success') {
                  bgColor = u.type === 'danger' ? '#fca5a5' : '#86efac';
                  textColor = u.type === 'danger' ? '#991b1b' : '#166534';
                }
                return (
                  <div key={u.id} draggable={status === 'playing'} onDragStart={(e) => handleDragStart(e, u.id)} style={{ padding: '6px', background: bgColor, color: textColor, borderRadius: '8px', fontSize: '1rem', textAlign: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                    {u.url}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {status === 'playing' && (
          <button 
            className="btn cyber-btn mt-2" 
            disabled={!allAssigned}
            onClick={checkAnswers}
            style={{ opacity: allAssigned ? 1 : 0.5 }}
          >
            Verifikasi Jaringan
          </button>
        )}

        {status === 'checking' && (
          <div className="cyber-card flex-center mt-2" style={{ padding: '1rem' }}>
            <Server className="text-primary animate-pulse" size={32} />
            <span className="font-bold ml-2">Mengecek Jawaban...</span>
          </div>
        )}

        {status === 'success' && (
          <div className="glass-card flex-column text-center animate-fade-in mt-2" style={{ borderColor: 'var(--success-green)', gap: '0.5rem', padding: '1rem' }}>
            <h3 className="text-success font-bold">Server Berhasil Dijaga!</h3>
            <p style={{ fontSize: '1.1rem' }}>Pintar sekali! Semua web palsu berhasil diblokir.</p>
            <div style={{ fontSize: '1.05rem', background: 'rgba(255,255,255,0.1)', padding: '8px', borderRadius: '8px', textAlign: 'left', marginTop: '4px' }}>
              <strong>Keterangan hasil:</strong><br/>
              <span style={{ color: '#ef4444' }}>■ Merah</span> = Link Berbahaya (Phishing/Penipuan)<br/>
              <span style={{ color: '#10b981' }}>■ Hijau</span> = Link Aman
            </div>
            <p className="font-bold text-success">+150 XP</p>
            <button className="btn btn-primary mt-2" onClick={() => navigate('schoolMap')}>Kembali ke Peta</button>
          </div>
        )}

        {status === 'fail' && (
          <div className="glass-card flex-column text-center animate-fade-in mt-2" style={{ borderColor: 'var(--danger-red)', gap: '0.5rem', padding: '1rem' }}>
            <h3 className="text-danger font-bold">Wah, ada yang salah!</h3>
            <p style={{ fontSize: '1.1rem' }}>Ada web yang salah tempat. Penipu berhasil masuk ke server sekolah!</p>
            <div style={{ fontSize: '1.05rem', background: 'rgba(255,255,255,0.1)', padding: '8px', borderRadius: '8px', textAlign: 'left', marginTop: '4px' }}>
              <strong>Keterangan hasil:</strong><br/>
              <span style={{ color: '#ef4444' }}>■ Merah</span> = Link Berbahaya (Phishing/Penipuan)<br/>
              <span style={{ color: '#10b981' }}>■ Hijau</span> = Link Aman
            </div>
            <p className="font-bold text-danger">-50 XP</p>
            <button className="btn btn-outline mt-2" onClick={() => navigate('schoolMap')}>Lanjut ke Map</button>
          </div>
        )}

        {status === 'timeUp' && (
          <div className="glass-card flex-column text-center animate-fade-in mt-2" style={{ borderColor: 'var(--warning-yellow)', gap: '0.5rem', padding: '1rem' }}>
            <h3 className="text-warning font-bold">Waktu Habis!</h3>
            <p style={{ fontSize: '1.1rem' }}>Kamu kehabisan waktu! Peretas berhasil masuk ke dalam server sistem sekolah.</p>
            <button className="btn cyber-btn mt-2" onClick={handleRetry}>Coba Lagi</button>
            <button className="btn btn-outline mt-2" onClick={() => navigate('schoolMap')}>Kembali ke Peta</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServerRoom;
