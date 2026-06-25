import React, { useState } from 'react';
import Header from '../components/Header';
import ProgressBar from '../components/ProgressBar';
import { Award, MessageSquare, Send, Trophy } from 'lucide-react';

const ResultsDashboard = ({ navigate, gameState, resetGame, setLeaderboardBackTo }) => {
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'ai', text: 'Halo! Saya Cyber Mentor AI. Ada yang ingin kamu tanyakan tentang keamanan siber?' }
  ]);

  const comps = gameState.competencies;

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    
    const userMsg = chatInput;
    setChatHistory(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');

    // Simulate AI response
    setTimeout(() => {
      let aiResponse = "Maaf, saya masih belajar. Tapi ingat, jangan pernah klik link sembarangan!";
      const lower = userMsg.toLowerCase();
      
      if (lower.includes('phishing')) {
        aiResponse = "Phishing adalah penipuan di mana pelaku menyamar sebagai entitas terpercaya (seperti bank atau admin) untuk mencuri informasi sensitif seperti password atau nomor kartu kredit.";
      } else if (lower.includes('berbahaya') || lower.includes('url')) {
        aiResponse = "URL berbahaya biasanya memiliki ejaan yang sedikit diubah (typosquatting), ekstensi aneh (.xyz, .tk), atau meminta data pribadi di halaman yang tidak dienkripsi (HTTP).";
      } else if (lower.includes('malware')) {
        aiResponse = "Malware adalah perangkat lunak berbahaya yang dirancang untuk merusak atau menyusup ke sistem komputer tanpa persetujuan pemiliknya. Contohnya virus, worm, trojan, dan ransomware.";
      }
      
      setChatHistory(prev => [...prev, { sender: 'ai', text: aiResponse }]);
    }, 1000);
  };

  return (
    <div className="flex-column h-full">
      <Header title="Hasil Belajar" showBack={true} onBack={() => navigate('dashboard')} />
      
      <div className="content-area scroll-y flex-column" style={{ padding: '1rem', gap: '1.5rem' }}>
        
        {/* Competencies Dashboard */}
        <div className="cyber-card flex-column" style={{ gap: '1rem' }}>
          <h3 className="font-bold text-center">Dashboard Kompetensi</h3>
          
          <div className="flex-column" style={{ gap: '10px' }}>
            <div>
              <div className="flex-row space-between" style={{ fontSize: '0.85rem', marginBottom: '4px' }}>
                <span className="font-semibold">Cyber Awareness</span>
                <span>{comps.awareness}%</span>
              </div>
              <ProgressBar progress={comps.awareness} />
            </div>
            
            <div>
              <div className="flex-row space-between" style={{ fontSize: '0.85rem', marginBottom: '4px' }}>
                <span className="font-semibold">URL Detection</span>
                <span>{comps.urlDetection}%</span>
              </div>
              <ProgressBar progress={comps.urlDetection} colorClass="bg-warning" />
            </div>
            
            <div>
              <div className="flex-row space-between" style={{ fontSize: '0.85rem', marginBottom: '4px' }}>
                <span className="font-semibold">Password Security</span>
                <span>{comps.passwordSecurity}%</span>
              </div>
              <ProgressBar progress={comps.passwordSecurity} />
            </div>
            
            <div>
              <div className="flex-row space-between" style={{ fontSize: '0.85rem', marginBottom: '4px' }}>
                <span className="font-semibold">Social Engineering</span>
                <span>{comps.socialEngineering}%</span>
              </div>
              <ProgressBar progress={comps.socialEngineering} colorClass="bg-danger" />
            </div>
            
            <div>
              <div className="flex-row space-between" style={{ fontSize: '0.85rem', marginBottom: '4px' }}>
                <span className="font-semibold">Network Security</span>
                <span>{comps.networkSecurity}%</span>
              </div>
              <ProgressBar progress={comps.networkSecurity} colorClass="bg-primary" />
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }} className="mt-4">
              <button className="btn cyber-btn" onClick={resetGame} style={{ flex: 1, borderColor: 'var(--text-main)', color: 'var(--text-main)' }}>
                Ulangi Petualangan
              </button>
              <button 
                className="btn cyber-btn" 
                onClick={() => { setLeaderboardBackTo('results'); navigate('leaderboard'); }} 
                style={{ flex: 1, borderColor: '#fbbf24', color: '#fbbf24' }}
              >
                <Trophy size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                Peringkat
              </button>
            </div>
          </div>
        </div>

        {/* Certificate / Badge */}
        <div className="cyber-card flex-column" style={{ alignItems: 'center' }}>
          <div style={{ background: 'rgba(0, 240, 255, 0.1)', padding: '16px', borderRadius: '50%', marginBottom: '8px', border: '1px solid var(--secondary-color)', boxShadow: '0 0 15px rgba(0, 240, 255, 0.3)' }}>
            <Award size={48} color="var(--secondary-color)" />
          </div>
          <h4 className="font-bold mt-2 text-center text-glow">Selamat, Kamu Cyber Defender!</h4>
          <p className="text-center mt-2 text-muted" style={{ fontSize: '0.85rem' }}>
            Anda telah berhasil melindungi jaringan sekolah dari serangan.
          </p>
        </div>

        {/* Evaluation Section */}
        <div className="cyber-card flex-column" style={{ gap: '1rem' }}>
          <h3 className="font-bold text-center text-glow-neon">Evaluasi & Saran Perbaikan</h3>
          
          {!gameState.mistakes || gameState.mistakes.length === 0 ? (
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid var(--success-green)' }}>
              <p className="text-success font-bold" style={{ margin: 0 }}>Luar Biasa!</p>
              <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Anda menyelesaikan semua misi tanpa melakukan kesalahan. Insting keamanan siber Anda sangat tajam!</p>
            </div>
          ) : (
            <div className="flex-column" style={{ gap: '0.8rem' }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Berikut adalah celah keamanan yang perlu Anda waspadai berdasarkan pengerjaan misi:</p>
              {gameState.mistakes.map((mistake, idx) => (
                <div key={idx} style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid var(--danger-red)' }}>
                  <p className="text-danger font-bold" style={{ margin: 0, fontSize: '0.95rem' }}>{mistake.location}</p>
                  <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', lineHeight: '1.4' }}>{mistake.explanation}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cyber Mentor AI Chatbot */}
        <div className="glass-card flex-column" style={{ padding: 0, overflow: 'hidden', height: '300px', flexShrink: 0 }}>
          <div style={{ background: '#1e293b', color: 'white', padding: '10px 15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={20} />
            <span className="font-bold">Cyber Mentor AI</span>
          </div>
          
          <div className="scroll-y" style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: '10px', background: '#f8fafc' }}>
            {chatHistory.map((chat, idx) => (
              <div key={idx} style={{
                alignSelf: chat.sender === 'ai' ? 'flex-start' : 'flex-end',
                background: chat.sender === 'ai' ? '#e2e8f0' : 'var(--primary-blue)',
                color: chat.sender === 'ai' ? '#1e293b' : 'white',
                padding: '8px 12px',
                borderRadius: chat.sender === 'ai' ? '0 12px 12px 12px' : '12px 0 12px 12px',
                maxWidth: '85%',
                fontSize: '0.85rem'
              }}>
                {chat.text}
              </div>
            ))}
          </div>
          
          <div style={{ display: 'flex', padding: '10px', background: 'white', borderTop: '1px solid #e2e8f0' }}>
            <input 
              type="text" 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
              placeholder="Tanya apa saja..."
              style={{ flexGrow: 1, padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '20px', fontSize: '0.9rem', outline: 'none' }}
            />
            <button 
              onClick={handleSendChat}
              style={{ background: 'var(--primary-blue)', color: 'white', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '8px', cursor: 'pointer' }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResultsDashboard;
