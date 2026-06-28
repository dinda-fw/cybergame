import React, { useState } from 'react';
import Header from '../components/Header';
import ProgressBar from '../components/ProgressBar';
import { Award, MessageSquare, Send, Trophy, Lightbulb, ShieldAlert } from 'lucide-react';

const ResultsDashboard = ({ navigate, gameState, resetGame, setLeaderboardBackTo }) => {
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'ai', text: 'Halo! Saya Cyber Mentor AI. Ada yang ingin kamu tanyakan tentang keamanan siber atau kendala misimu tadi?' }
  ]);

  const comps = gameState.competencies;

  // Mencari kompetensi terendah untuk memberikan rekomendasi aksi nyata di dunia asli
  const getLowestCompetency = () => {
    const list = [
      { name: 'Cyber Awareness', score: comps.awareness, tip: 'Selalu bersikap waspada dan jangan mudah tergiur hadiah gratis atau panik saat menerima pesan darurat di ponselmu.' },
      { name: 'URL Detection', score: comps.urlDetection, tip: 'Periksa karakter alamat link satu per satu. Ingat, peretas sering mengganti huruf dengan angka kembar (seperti g00gle atau goog1e).' },
      { name: 'Password Security', score: comps.passwordSecurity, tip: 'Gunakan kata sandi unik yang menggabungkan huruf, angka, dan simbol, serta aktifkan Verifikasi 2 Langkah (2FA) di akun belajarmu.' },
      { name: 'Social Engineering', score: comps.socialEngineering, tip: 'Jika menerima pesan mendesak dari guru atau teman, verifikasi langsung secara offline (tatap muka) sebelum melakukan perintah mereka.' },
      { name: 'Network Security', score: comps.networkSecurity, tip: 'Matikan fitur auto-connect Wi-Fi di HP kamu dan hindari bertransaksi digital menggunakan Wi-Fi umum gratisan tanpa sandi.' }
    ];
    return list.sort((a, b) => a.score - b.score)[0];
  };

  const lowestComp = getLowestCompetency();

  // Menentukan gelar keahlian agen berdasarkan performa keseluruhan
  const getAgentTitle = () => {
    if (comps.awareness >= 80 && comps.socialEngineering >= 80) return { title: "The Unshakable Defender", desc: "Kamu sangat tenang dan kebal dari manipulasi psikologis penipu siber!" };
    if (comps.urlDetection < 60) return { title: "Detektif Lengah", desc: "Pertahananmu kuat, tapi matamu masih sering terkecoh oleh detail domain palsu." };
    return { title: "Cyber Shield Apprentice", desc: "Kamu memiliki potensi hebat, ayo tingkatkan kejelianmu melindungi sekolah!" };
  };

  const agentRank = getAgentTitle();

  const handleSendChat = () => {
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatHistory(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');

    setTimeout(() => {
      let aiResponse = "Maaf, saya masih belajar menganalisis itu. Tapi ingat, kunci utama pertahanan siber adalah selalu konfirmasi langsung secara offline!";
      const lower = userMsg.toLowerCase();

      if (lower.includes('phishing')) {
        aiResponse = "Phishing adalah taktik penipuan digital di mana pelaku menyamar menjadi pihak tepercaya (seperti admin sekolah, bank, atau Google) lewat email atau link palsu untuk mencuri password kamu.";
      } else if (lower.includes('social engineering') || lower.includes('rekayasa sosial') || lower.includes('manipulasi')) {
        aiResponse = "Social Engineering (Rekayasa Sosial) adalah trik hacker untuk memanipulasi pikiran dan perasaanmu (membuat panik, takut, atau tergiur hadiah) agar kamu sukarela menyerahkan data atau kode OTP.";
      } else if (lower.includes('url') || lower.includes('link')) {
        aiResponse = "Periksa domain utamanya sebelum tanda slash (/). Jika tautannya seperti 'kemdikbud.go.id.auth-server.net', domain aslinya adalah auth-server.net, yang berarti itu adalah web tiruan berbahaya!";
      } else if (lower.includes('malware') || lower.includes('virus')) {
        aiResponse = "Malware adalah program jahat. Hati-hati dengan file dokumen palsu berekstensi .apk di HP atau .exe di komputer karena itu bisa memata-matai atau mengunci datamu!";
      }

      setChatHistory(prev => [...prev, { sender: 'ai', text: aiResponse }]);
    }, 800000 / 800000); // instant simulated delay
  };

  return (
    <div className="flex-column h-full">
      <Header title="Dashboard Hasil Petualangan" showBack={true} onBack={() => navigate('dashboard')} />

      <div className="content-area scroll-y flex-column" style={{ padding: '1rem', gap: '1.5rem' }}>

        {/* Competencies Dashboard */}
        <div className="cyber-card flex-column" style={{ gap: '1rem' }}>
          <h3 className="font-bold text-center text-glow">Laporan Hasil Petualangan</h3>

          <div className="flex-column" style={{ gap: '14px' }}>
            <div>
              <div className="flex-row space-between" style={{ fontSize: '0.85rem', marginBottom: '4px' }}>
                <div>
                  <span className="font-semibold block">Cyber Awareness</span>
                  <span className="text-muted" style={{ fontSize: '0.7rem', display: 'block' }}>Tingkat kewaspadaan umum menghadapi ancaman siber digital.</span>
                </div>
                <span className="font-bold">{comps.awareness}%</span>
              </div>
              <ProgressBar progress={comps.awareness} />
            </div>

            <div>
              <div className="flex-row space-between" style={{ fontSize: '0.85rem', marginBottom: '4px' }}>
                <div>
                  <span className="font-semibold block">URL Detection</span>
                  <span className="text-muted" style={{ fontSize: '0.7rem', display: 'block' }}>Kejelian menganalisis keaslian alamat domain website dan link phishing.</span>
                </div>
                <span className="font-bold">{comps.urlDetection}%</span>
              </div>
              <ProgressBar progress={comps.urlDetection} colorClass="bg-warning" />
            </div>

            <div>
              <div className="flex-row space-between" style={{ fontSize: '0.85rem', marginBottom: '4px' }}>
                <div>
                  <span className="font-semibold block">Password Security</span>
                  <span className="text-muted" style={{ fontSize: '0.7rem', display: 'block' }}>Pemahaman proteksi akun pribadi, kerahasiaan sandi, dan kode OTP.</span>
                </div>
                <span className="font-bold">{comps.passwordSecurity}%</span>
              </div>
              <ProgressBar progress={comps.passwordSecurity} />
            </div>

            <div>
              <div className="flex-row space-between" style={{ fontSize: '0.85rem', marginBottom: '4px' }}>
                <div>
                  <span className="font-semibold block">Social Engineering</span>
                  <span className="text-muted" style={{ fontSize: '0.7rem', display: 'block' }}>Ketahanan psikologis dari manipulasi kepanikan, gertakan, atau hadiah palsu.</span>
                </div>
                <span className="font-bold">{comps.socialEngineering}%</span>
              </div>
              <ProgressBar progress={comps.socialEngineering} colorClass="bg-danger" />
            </div>

            <div>
              <div className="flex-row space-between" style={{ fontSize: '0.85rem', marginBottom: '4px' }}>
                <div>
                  <span className="font-semibold block">Network Security</span>
                  <span className="text-muted" style={{ fontSize: '0.7rem', display: 'block' }}>Keahlian mendeteksi enkripsi jaringan aman dan bahaya Wi-Fi palsu.</span>
                </div>
                <span className="font-bold">{comps.networkSecurity}%</span>
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

        {/* Gelar Agen & Penghargaan */}
        <div className="cyber-card flex-column" style={{ alignItems: 'center', position: 'relative' }}>
          <div style={{ background: 'rgba(0, 240, 255, 0.1)', padding: '16px', borderRadius: '50%', marginBottom: '8px', border: '1px solid var(--secondary-color)', boxShadow: '0 0 15px rgba(0, 240, 255, 0.3)' }}>
            <Award size={48} color="var(--secondary-color)" />
          </div>
          <h4 className="font-bold mt-2 text-center text-glow-neon" style={{ fontSize: '1.2rem' }}>Gelar: {agentRank.title}</h4>
          <p className="text-center mt-1 text-muted" style={{ fontSize: '0.85rem', maxWidth: '80%' }}>
            {agentRank.desc}
          </p>
        </div>

        {/* Glosarium Edukasi Pintar (Mengatasi Kebingungan Siswa) */}
        <div className="cyber-card flex-row" style={{ background: 'rgba(0, 240, 255, 0.05)', borderColor: 'rgba(0, 240, 255, 0.3)', gap: '12px', alignItems: 'center' }}>
          <Lightbulb size={32} color="var(--secondary-color)" style={{ flexShrink: 0 }} />
          <div>
            <span className="font-bold block text-secondary" style={{ fontSize: '0.9rem' }}>Pahami Istilah: Social Engineering (Rekayasa Sosial)</span>
            <p className="text-muted" style={{ fontSize: '0.8rem', lineHeight: '1.4', marginTop: '4px', textAlign: 'justify' }}>
              Adalah trik peretas untuk mencuri datamu <strong>bukan dengan merusak sistem komputer</strong>, melainkan dengan <strong>memanipulasi emosi dan pikiranmu</strong> (membuatmu panik takut tidak bisa ujian, atau tergiur hadiah bonus kuota) agar kamu secara tidak sadar menyerahkan password atau kode OTP akunmu sendiri.
            </p>
          </div>
        </div>

        {/* Real-World Action Recommendations */}
        <div className="cyber-card flex-row" style={{ background: 'rgba(251, 191, 36, 0.05)', borderColor: 'rgba(251, 191, 36, 0.3)', gap: '12px', alignItems: 'center' }}>
          <ShieldAlert size={32} color="#fbbf24" style={{ flexShrink: 0 }} />
          <div>
            <span className="font-bold block" style={{ fontSize: '0.9rem', color: '#fbbf24' }}>Rekomendasi Aksi Nyata Esok Hari</span>
            <p className="text-muted" style={{ fontSize: '0.8rem', lineHeight: '1.4', marginTop: '4px' }}>
              Berdasarkan kelemahan terkecilmu di aspek <strong>{lowestComp.name}</strong>, lakukan ini di dunia nyata: <span style={{ color: 'var(--text-main)' }}>{lowestComp.tip}</span>
            </p>
          </div>
        </div>

        {/* Evaluation Section */}
        <div className="cyber-card flex-column" style={{ gap: '1rem' }}>
          <h3 className="font-bold text-center text-glow-neon">Evaluasi & Saran Perbaikan</h3>

          {!gameState.mistakes || gameState.mistakes.length === 0 ? (
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid var(--success-green)' }}>
              <p className="text-success font-bold" style={{ margin: 0 }}>Luar Biasa!</p>
              <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Anda menyelesaikan semua misi tanpa melakukan kesalahan. Jaringan sekolah sepenuhnya aman di tanganmu!</p>
            </div>
          ) : (
            <div className="flex-column" style={{ gap: '0.8rem' }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Berikut adalah beberapa kelalaian taktik yang sempat meloloskan ancaman siber:</p>
              {gameState.mistakes.map((mistake, idx) => (
                <div key={idx} style={{ background: 'rgba(239, 68, 68, 0.08)', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid var(--danger-red)', border: '1px solid rgba(239, 68, 68, 0.2)', borderLeftWidth: '4px' }}>
                  <p className="text-danger font-bold" style={{ margin: 0, fontSize: '0.9rem' }}>📍 {mistake.location}</p>
                  <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', lineHeight: '1.45', color: 'rgba(255,255,255,0.85)' }}>{mistake.explanation}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cyber Mentor AI Chatbot (UI Optimized for Dark Theme) */}
        <div className="cyber-card flex-column" style={{ padding: 0, overflow: 'hidden', height: '320px', flexShrink: 0, borderColor: 'rgba(255,255,255,0.1)' }}>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px 15px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <MessageSquare size={18} color="var(--secondary-color)" />
            <span className="font-bold" style={{ fontSize: '0.9rem' }}>Konsultasi Cyber Mentor AI</span>
          </div>

          <div className="scroll-y" style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: '10px', background: 'rgba(0,0,0,0.2)', flexGrow: 1 }}>
            {chatHistory.map((chat, idx) => (
              <div key={idx} style={{
                alignSelf: chat.sender === 'ai' ? 'flex-start' : 'flex-end',
                background: chat.sender === 'ai' ? 'rgba(255,255,255,0.1)' : 'var(--secondary-color)',
                color: chat.sender === 'ai' ? 'var(--text-main)' : '#000',
                padding: '8px 12px',
                borderRadius: chat.sender === 'ai' ? '0 12px 12px 12px' : '12px 0 12px 12px',
                maxWidth: '85%',
                fontSize: '0.85rem',
                lineHeight: '1.4',
                boxShadow: chat.sender === 'user' ? '0 0 10px rgba(0, 240, 255, 0.2)' : 'none'
              }}>
                {chat.text}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', padding: '10px', background: 'rgba(0,0,0,0.4)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
              placeholder="Tanyakan arti istilah atau minta tips pertahanan..."
              style={{ flexGrow: 1, padding: '8px 14px', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '20px', fontSize: '0.85rem', outline: 'none', background: 'rgba(0,0,0,0.3)', color: 'white' }}
            />
            <button
              onClick={handleSendChat}
              className="cyber-btn"
              style={{ borderRadius: '50%', width: 36, height: 36, display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '8px', padding: 0, minWidth: 36 }}
            >
              <Send size={14} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResultsDashboard;