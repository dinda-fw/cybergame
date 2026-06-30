import React, { useState } from 'react';
import Header from '../components/Header';
import { Map, Shield, Search, Book, User, ChevronDown, Trophy, ShieldAlert, Info, X } from 'lucide-react';

const Dashboard = ({ navigate, gameState, onLogout, username, onReset, setLeaderboardBackTo }) => {
  const [expandedModule, setExpandedModule] = useState(null);
  const [showAbout, setShowAbout] = useState(false);
  return (
    <div className="flex-column h-full">
      <div style={{ position: 'relative' }}>
        <Header
          title="CyberShield Game"
          showBack={false}
          xp={gameState.xp}
          level={gameState.level}
          actions={
            <>
              <button
                onClick={() => { if (window.confirm('Yakin ingin reset progres?')) onReset(); }}
                style={{ background: 'none', border: '1px solid var(--primary-color)', color: 'var(--primary-color)', borderRadius: '4px', padding: '4px 8px', fontSize: '0.8rem', cursor: 'pointer' }}
              >
                Restart
              </button>
              <button
                onClick={onLogout}
                style={{ background: 'none', border: '1px solid var(--danger-red)', color: 'var(--danger-red)', borderRadius: '4px', padding: '4px 8px', fontSize: '0.8rem', cursor: 'pointer' }}
              >
                Logout
              </button>
            </>
          }
        />
      </div>

      <div className="content-area" style={{ flex: 1, overflowY: 'auto' }}>

        {/* Cyberpunk Hero Section */}
        <div className="cyber-card mb-4 flex-column" style={{ position: 'relative', overflow: 'hidden', padding: 0 }}>
          <div style={{ position: 'relative', zIndex: 2, padding: '2rem' }}>
            <h2 className="text-glow" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Hallo {username}!</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: '100%' }}>
              Suatu hari di sekolah, terdapat beberapa kejadian dan kasus aneh terkait serangan siber dan phishing. Mulailah petualanganmu sekarang untuk mengungkap semua kasus tersebut, dan lakukan tindakan terbaik demi melindungi keamanan sekolah kita!
            </p>
            <button
              className="cyber-btn"
              onClick={() => {
                if (gameState.completedMissions.length >= 5) {
                  navigate('results');
                } else {
                  navigate('schoolMap');
                }
              }}
            >
              {gameState.completedMissions.length >= 5 ? (
                <>
                  <Book size={18} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
                  Lihat Hasil Belajar
                </>
              ) : (
                <>
                  <Map size={18} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
                  {gameState.completedMissions.length > 0 ? 'Lanjutkan Misi' : 'Mulai Petualangan'}
                </>
              )}
            </button>
          </div>
          <div style={{
            position: 'absolute',
            right: '-5%',
            bottom: '-10%',
            width: '45%',
            height: '110%',
            backgroundImage: 'url(/icon7.png)',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right bottom',
            zIndex: 1,
            opacity: 0.8
          }} />
        </div>

        <div className="dashboard-grid">
          <div className="cyber-card flex-column flex-center animate-fade-in" onClick={() => navigate('cyber_scan')} style={{ cursor: 'pointer', padding: '10px' }}>
            <Shield size={28} color="var(--primary-color)" className="mb-1" />
            <span className="font-semibold" style={{ color: 'var(--primary-color)', fontSize: '0.85rem' }}>Cyber Challenge</span>
            <span className="text-muted" style={{ fontSize: '0.7rem' }}>test speed</span>
          </div>

          <div className="cyber-card flex-column flex-center animate-fade-in" onClick={() => navigate('url_detective')} style={{ cursor: 'pointer', padding: '10px' }}>
            <Search size={28} color="var(--secondary-color)" className="mb-1" />
            <span className="font-semibold" style={{ color: 'var(--secondary-color)', fontSize: '0.85rem' }}>URL Checker</span>
            <span className="text-muted" style={{ fontSize: '0.7rem' }}>Cek link phishing</span>
          </div>

          <div className="cyber-card flex-column flex-center animate-fade-in" onClick={() => { setLeaderboardBackTo('dashboard'); navigate('leaderboard'); }} style={{ cursor: 'pointer', padding: '10px' }}>
            <Trophy size={28} color="#fbbf24" className="mb-1" />
            <span className="font-semibold" style={{ color: '#fbbf24', fontSize: '0.85rem' }}>Leaderboard</span>
            <span className="text-muted" style={{ fontSize: '0.7rem' }}>Papan Peringkat</span>
          </div>
        </div>

        {/* Tombol Tentang Kami */}
        <div
          className="cyber-card mb-4 flex-row"
          onClick={() => setShowAbout(true)}
          style={{ cursor: 'pointer', padding: '14px', alignItems: 'center', justifyContent: 'center', background: 'rgba(0, 240, 255, 0.05)', border: '1px solid rgba(0, 240, 255, 0.3)' }}
        >
          <Info size={24} color="var(--primary-color)" style={{ marginRight: '10px' }} />
          <span className="font-bold text-glow" style={{ color: 'var(--primary-color)', fontSize: '0.95rem' }}>Tentang Cybershield Game & Panduan Bermain</span>
        </div>

        <h3 className="mb-2 text-glow-neon mt-4">Sekilas insight</h3>

        {/* Modul 1 */}
        <div
          className="cyber-card mb-3 flex-column"
          style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
          onClick={() => setExpandedModule(expandedModule === 1 ? null : 1)}
        >
          <div className="flex-row space-between" style={{ alignItems: 'center' }}>
            <div className="flex-row" style={{ alignItems: 'center', flexGrow: 1 }}>
              <div style={{ background: 'rgba(0, 240, 255, 0.1)', padding: '12px', borderRadius: '8px', marginRight: '16px' }}>
                <Book size={24} color="var(--secondary-color)" />
              </div>
              <div>
                <div className="font-bold">Dasar Keamanan Siber</div>
                <div className="text-muted" style={{ fontSize: '0.85rem' }}>Pahami konsep CIA Triad & pentingnya proteksi data</div>
              </div>
            </div>
            <div style={{ transform: expandedModule === 1 ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }}>
              <ChevronDown size={20} />
            </div>
          </div>

          {expandedModule === 1 && (
            <div className="animate-fade-in flex-column" style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', gap: '1rem' }}>
              <img src="/icon5.png" alt="Cyber Basics" style={{ width: '100%', height: '140px', objectFit: 'contain', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }} />
              <p style={{ fontSize: '0.9rem', lineHeight: '1.6', textAlign: 'justify' }}>
                <strong>Keamanan Siber (Cyber Security)</strong> adalah segala upaya yang kita lakukan untuk melindungi perangkat komputer, jaringan internet, data, dan aplikasi dari akses ilegal, pencurian, atau kerusakan oleh peretas (hacker). Sebagai siswa, kita sangat bergantung pada teknologi untuk belajar daring, mencari tugas, hingga bersenang-senang dengan game online. Karena itu, keamanan siber adalah benteng utama kita di dunia maya.
                <br /><br />
                Para ahli IT dunia menggunakan model pertahanan standar yang disebut <strong>CIA Triad</strong>. Konsep utama dari pilar keamanan ini dirancang khusus untuk memastikan keamanan informasi tetap terjaga, yaitu:
                <br /><br />
                1. 🔒 <span className="text-primary font-bold">Confidentiality (Kerahasiaan)</span>: Menjaga data pribadi penting (seperti password akun belajar, foto pribadi, alamat rumah, hingga nilai sekolah) agar tidak bisa diintip atau disebarluaskan oleh orang yang tidak berhak. Cara paling ampuh adalah dengan tidak membagikan password ke siapa pun dan mengaktifkan fitur 2FA (Verifikasi Dua Langkah).
                <br /><br />
                2. 📝 <span className="text-success font-bold">Integrity (Integritas)</span>: Menjamin bahwa data kita tidak diubah, dimanipulasi, atau dirusak oleh peretas saat disimpan atau dikirim di internet. Data harus selalu asli dan tepercaya. Contohnya, jangan sampai nilai rapormu di server sekolah tiba-tiba diutak-atik atau diubah oleh pihak luar.
                <br /><br />
                3. ⚡ <span className="text-warning font-bold">Availability (Ketersediaan)</span>: Memastikan sistem belajar online, WiFi sekolah, atau portal pembelajaran selalu aktif dan siap diakses kapan pun kita membutuhkannya. Jika peretas menyerang server sekolah hingga mati (DDoS), maka ketersediaan layanan akan terganggu dan kegiatan belajar terhambat.
              </p>
            </div>
          )}
        </div>

        {/* Modul 2 */}
        <div
          className="cyber-card flex-column mb-4"
          style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
          onClick={() => setExpandedModule(expandedModule === 2 ? null : 2)}
        >
          <div className="flex-row space-between" style={{ alignItems: 'center' }}>
            <div className="flex-row" style={{ alignItems: 'center', flexGrow: 1 }}>
              <div style={{ background: 'rgba(136, 204, 20, 0.1)', padding: '12px', borderRadius: '8px', marginRight: '16px' }}>
                <User size={24} color="var(--primary-color)" />
              </div>
              <div>
                <div className="font-bold">Ciri-Ciri Serangan Siber</div>
                <div className="text-muted" style={{ fontSize: '0.85rem' }}>Kenali tanda-tanda bahaya dan penipuan di internet</div>
              </div>
            </div>
            <div style={{ transform: expandedModule === 2 ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }}>
              <ChevronDown size={20} />
            </div>
          </div>

          {expandedModule === 2 && (
            <div className="animate-fade-in flex-column" style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', gap: '1rem' }}>
              <img src="/icon1.png" alt="Cyber Attack Features" style={{ width: '100%', height: '140px', objectFit: 'contain', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }} />
              <p style={{ fontSize: '0.9rem', lineHeight: '1.6', textAlign: 'justify' }}>
                Di internet, bahaya jarang sekali menampakkan dirinya secara terang-terangan. Sering kali peretas menyamarkan serangannya agar terlihat seperti pesan biasa, tawaran menguntungkan, atau bahkan peringatan resmi dari sekolah. Sebagai siswa yang cerdas, mengenali <strong>ciri-ciri serangan siber</strong> sejak dini adalah kunci keselamatan:
                <br /><br />
                ⚠️ <span className="text-danger font-semibold">1. Menimbulkan Rasa Panik atau Mendesak (Urgensi Palsu)</span>:
                <br />
                Jika kamu menerima pesan chat atau email bernada ancaman seperti <em>"Akun sosial mediamu akan dihapus dalam 5 menit, segera verifikasi data diri di link ini!"</em>, atau iming-iming menggiurkan seperti <em>"Selamat! Kamu memenangkan beasiswa 5 Juta, klaim sekarang sebelum waktu habis!"</em>. Ini trik psikologis (Social Engineering) untuk membuatmu panik sehingga mengabaikan akal sehat.
                <br /><br />
                🔗 <span className="text-warning font-semibold">2. Tautan (URL) yang Sedikit Salah atau Typo</span>:
                <br />
                Peretas sering kali membuat tautan yang menyerupai nama website asli, namun ejaannya dipelintir tipis. Misalnya <code>www.micros0ft.com</code> (menggunakan angka nol bukan huruf 'o'), <code>g00gle.com</code>, atau <code>kemendikbud-kuotagratis.xyz</code>. Selalu periksa karakter per karakter sebelum menekan link tersebut!
                <br /><br />
                🔑 <span className="text-primary font-semibold">3. Meminta Kode Rahasia / OTP secara Tidak Wajar</span>:
                <br />
                Layanan resmi yang aman (seperti bank, admin IT sekolah, atau game developer) **tidak akan pernah** meminta password, PIN, atau kode OTP (One-Time Password) milikmu melalui chat pribadi WhatsApp, Telegram, atau Instagram dengan alasan apa pun.
                <br /><br />
                💻 <span className="text-success font-semibold">4. Perangkat Mendadak Lemot, Panas, atau Muncul Pop-up Aneh</span>:
                <br />
                Apabila HP atau laptop belajarmu mendadak beroperasi sangat lambat, baterai cepat terkuras habis padahal tidak digunakan, atau layar tiba-tiba memunculkan iklan bermunculan secara otomatis, itu pertanda kuat perangkatmu telah disusupi program jahat (Malware atau Spyware).
              </p>
            </div>
          )}
        </div>

        {/* Modul 3 */}
        <div
          className="cyber-card flex-column mb-4"
          style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
          onClick={() => setExpandedModule(expandedModule === 3 ? null : 3)}
        >
          <div className="flex-row space-between" style={{ alignItems: 'center' }}>
            <div className="flex-row" style={{ alignItems: 'center', flexGrow: 1 }}>
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '12px', borderRadius: '8px', marginRight: '16px' }}>
                <ShieldAlert size={24} color="var(--danger-red)" />
              </div>
              <div>
                <div className="font-bold">Jenis-Jenis Serangan Siber</div>
                <div className="text-muted" style={{ fontSize: '0.85rem' }}>Kenali metode serangan yang dihadapi dalam permainan ini</div>
              </div>
            </div>
            <div style={{ transform: expandedModule === 3 ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }}>
              <ChevronDown size={20} />
            </div>
          </div>

          {expandedModule === 3 && (
            <div className="animate-fade-in flex-column" style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', gap: '1rem' }}>
              <img src="/icon3.png" alt="Types of Cyber Attacks" style={{ width: '100%', height: '140px', objectFit: 'contain', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }} />
              <p style={{ fontSize: '0.9rem', lineHeight: '1.6', textAlign: 'justify' }}>
                Di dalam dunia CyberShield Academy ini, kamu akan berhadapan dengan beberapa jenis serangan siber yang sering terjadi di dunia nyata. Berikut adalah jenis-jenis serangan yang akan kamu temukan:
                <br /><br />
                🎣 <span className="text-danger font-semibold">1. Phishing & Rekayasa Sosial (Social Engineering)</span>:
                <br />
                Peretas menyamar sebagai pihak tepercaya (seperti guru, kepala sekolah, atau teman) untuk memanipulasi korban agar menyerahkan data pribadi, password, atau kode OTP. <strong>(Ditemukan di: Misi Aula & Server Room)</strong>.
                <br /><br />
                🦠 <span className="text-warning font-semibold">2. Malware & Trojan (Program Jahat)</span>:
                <br />
                Peretas menyembunyikan virus atau program jahat di dalam file yang terlihat normal (seperti dokumen tugas atau software bajakan). Jika diunduh, program ini akan menginfeksi perangkatmu, mencuri data, atau bahkan memberikan peretas akses penuh untuk mengendalikan perangkatmu dari jarak jauh. <strong>(Ditemukan di: Misi Lab Komputer)</strong>.
                <br /><br />
                📡 <span className="text-primary font-semibold">3. Serangan Man-in-the-Middle (Wi-Fi Palsu / Evil Twin)</span>:
                <br />
                Peretas membuat jaringan Wi-Fi palsu tanpa sandi dengan nama yang sangat mirip dengan Wi-Fi resmi (seperti Wi-Fi kantin atau perpustakaan). Jika kamu terhubung, peretas dapat menyadap dan mencuri semua data, password, dan aktivitas yang kamu lakukan melalui jaringan tersebut. <strong>(Ditemukan di: Misi Kantin)</strong>.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Modal Tentang Kami */}
      {showAbout && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          zIndex: 1000,
          display: 'flex', flexDirection: 'column',
          padding: '20px',
          backdropFilter: 'blur(5px)',
          animation: 'fadeIn 0.3s ease'
        }}>
          <div className="cyber-card" style={{ flex: 1, overflowY: 'auto', position: 'relative', display: 'flex', flexDirection: 'column' }}>
            <button
              onClick={() => setShowAbout(false)}
              style={{ position: 'absolute', right: '15px', top: '15px', background: 'none', border: 'none', color: 'var(--text-color)', cursor: 'pointer', zIndex: 2 }}
            >
              <X size={28} />
            </button>

            <h2 className="text-glow-neon mb-4" style={{ textAlign: 'center', marginTop: '10px', fontSize: '2rem' }}>Tentang CyberShield</h2>

            <div style={{ color: 'var(--text-color)', fontSize: '0.9rem', lineHeight: '1.6', paddingBottom: '20px' }}>
              <div style={{ background: 'rgba(0,240,255,0.1)', padding: '15px', borderRadius: '8px', marginBottom: '20px', borderLeft: '4px solid var(--primary-color)' }}>
                <p style={{ margin: 0, textAlign: 'justify' }}>
                  <strong>CyberShield Game</strong> adalah platform edukasi interaktif berbasis <em>gamification</em> yang dirancang khusus untuk peningkatan literasi digital dan keamanan jaringan bagi siswa.
                  Platform ini diciptakan untuk berkompetisi di ajang lomba <strong>LIDM (Lomba Inovasi Digital Mahasiswa)</strong>, dan dirancang serta dikembangkan secara penuh oleh <strong style={{ color: 'var(--danger-red)' }}>Tim Dinasty Cyber</strong> dari <strong>Universitas Negeri Surabaya (UNESA)</strong>.
                </p>
              </div>

              <h3 style={{ color: 'var(--secondary-color)', marginBottom: '10px', marginTop: '20px' }}><Map size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} /> Cara Bermain & Eksplorasi</h3>
              <p style={{ textAlign: 'justify', marginBottom: '15px' }}>
                Klik tombol <strong>"Mulai Petualangan"</strong> untuk memasuki lingkungan sekolah <em>(School Map)</em>. Kamu dapat bergerak menggunakan layar sentuh (D-Pad virtual) atau keyboard (W,A,S,D / Arah).
                Jelajahi sekolah dan hampiri bangunan yang memiliki ikon (!). Tekan tombol <strong>[E]</strong> (atau tombol "Masuk" yang muncul di layar) untuk memulai misi. Misi harus diselesaikan secara berurutan sesuai tingkat kesulitan.
              </p>

              <h3 style={{ color: 'var(--warning-color)', marginBottom: '10px', marginTop: '20px' }}><ShieldAlert size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} /> Daftar Misi Keamanan</h3>
              <ul style={{ paddingLeft: '20px', marginBottom: '15px', textAlign: 'justify' }}>
                <li style={{ marginBottom: '8px' }}><strong>Aula (Misi 1):</strong> Mengidentifikasi upaya rekayasa sosial <em>(Social Engineering)</em> dan penipuan <em>(scam)</em> yang sering terjadi di media sosial.</li>
                <li style={{ marginBottom: '8px' }}><strong>Kantin (Misi 2):</strong> Belajar tentang bahaya Wi-Fi Publik palsu <em>(Man-in-the-Middle)</em> dan keamanan jaringan dasar.</li>
                <li style={{ marginBottom: '8px' }}><strong>Ruang Server (Misi 3):</strong> Praktik mendeteksi dan analisis tautan URL berbahaya</li>
                <li style={{ marginBottom: '8px' }}><strong>Ruang Guru (Misi 4):</strong> Mengamankan data dari ancaman <em>Phishing</em> melalui email dan pesan teks.</li>
                <li style={{ marginBottom: '8px' }}><strong>Lab Komputer (Misi 5):</strong> Memahami jenis jenis serangan <em>Malware</em>, <em>Ransomware</em>, serta mitigasi penangananya.</li>
              </ul>

              <h3 style={{ color: 'var(--primary-color)', marginBottom: '10px', marginTop: '20px' }}><Search size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} /> Fitur-Fitur Unggulan</h3>
              <ul style={{ paddingLeft: '20px', marginBottom: '15px', textAlign: 'justify' }}>
                <li style={{ marginBottom: '8px' }}><strong>Multiplayer Real-time:</strong> Bertemu dan berkeliling kampus bersama pemain lain secara langsung!</li>
                <li style={{ marginBottom: '8px' }}><strong>URL Checker (Detektif Tautan):</strong> Fitur interaktif untuk menganalisis dan mendeteksi apakah sebuah link aman atau merupakan link <em>phishing</em>.</li>
                <li style={{ marginBottom: '8px' }}><strong>Leaderboard (Papan Peringkat):</strong> Kompetisi nilai <em>(XP)</em> secara <em>real-time</em> antar sesama siswa yang memainkan platform ini.</li>
                <li style={{ marginBottom: '8px' }}><strong>Hasil Belajar Terstruktur:</strong> Evaluasi di akhir permainan yang menampilkan letak kesalahan dan metrik kompetensi keamanan siber kamu.</li>
                <li style={{ marginBottom: '8px' }}><strong>NPC & Chatbot Interaktif:</strong> Seluruh penghuni sekolah siap berinteraksi dan memberikan edukasi tips keamanan siber secara dinamis.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
