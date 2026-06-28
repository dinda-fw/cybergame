import React, { useState } from 'react';
import Header from '../../components/Header';
import { Search, ShieldAlert, ShieldCheck, CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react';

const UrlChecker = ({ navigate, backTo }) => {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('idle'); // idle, scanning, result
  const [analysisResult, setAnalysisResult] = useState(null);

  const analyzeUrl = (inputUrl) => {
    let lowerUrl = inputUrl.toLowerCase().trim();
    if (!lowerUrl) return null;
    
    const hasExplicitHttp = lowerUrl.startsWith('http://');
    
    // assume http for parsing if no protocol is given
    if (!lowerUrl.startsWith('http')) {
      lowerUrl = 'http://' + lowerUrl;
    }

    let parsedUrl;
    try {
      parsedUrl = new URL(lowerUrl);
    } catch (e) {
      return { isDangerous: true, reasons: ['Format URL tidak valid atau rusak.'], dangerScore: 5 };
    }

    const domain = parsedUrl.hostname;
    const reasons = [];
    let dangerScore = 0;

    // 1. Check Protocol
    if (parsedUrl.protocol === 'http:' && hasExplicitHttp) {
      reasons.push('Menggunakan koneksi HTTP yang tidak dienkripsi (rentan penyadapan jaringan).');
      dangerScore += 1;
    }

    // 2. Suspicious TLDs
    const suspiciousTLDs = ['.xyz', '.tk', '.cc', '.top', '.club', '.online', '.site', '.click', '.info'];
    if (suspiciousTLDs.some(tld => domain.endsWith(tld))) {
      reasons.push('Menggunakan ekstensi domain murah/gratis yang sering dipakai untuk penipuan.');
      dangerScore += 2;
    }

    // 3. IP Address instead of domain
    const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    if (ipRegex.test(domain)) {
      reasons.push('Domain berupa alamat IP, biasanya digunakan hacker untuk menyembunyikan identitas asli server.');
      dangerScore += 3;
    }

    // 4. Suspicious Keywords in domain
    const suspiciousKeywords = ['login', 'update', 'verify', 'secure', 'account', 'free', 'admin', 'password', 'recovery', 'bonus'];
    if (suspiciousKeywords.some(kw => domain.includes(kw))) {
      reasons.push('Nama domain mengandung kata pancingan (social engineering) untuk mengecoh pengguna.');
      dangerScore += 2;
    }

    // 5. Typosquatting (Micros0ft, g00gle)
    const famousBrands = ['google', 'microsoft', 'facebook', 'instagram', 'twitter', 'apple', 'amazon', 'netflix', 'whatsapp', 'bca', 'bri', 'mandiri', 'bni', 'paypal'];
    // Normalize to detect l33t speak
    const normalizedDomain = domain.replace(/0/g, 'o').replace(/1/g, 'i').replace(/3/g, 'e').replace(/5/g, 's').replace(/4/g, 'a');
    
    const isDirectMatch = famousBrands.some(brand => domain.includes(brand));
    const isTypoMatch = famousBrands.some(brand => normalizedDomain.includes(brand));

    if (!isDirectMatch && isTypoMatch) {
      reasons.push('Terindikasi Typosquatting (sengaja meniru brand terkenal dengan ejaan yang mirip untuk menipu).');
      dangerScore += 3;
    } else if (isDirectMatch) {
      // Check if it's the actual brand or an impersonation
      const isActualBrand = famousBrands.some(brand => 
        domain === `${brand}.com` || domain === `www.${brand}.com` || 
        domain === `${brand}.co.id` || domain === `www.${brand}.co.id` ||
        domain === `${brand}.id` || domain === `www.${brand}.id`
      );
      
      if (!isActualBrand) {
         reasons.push('Domain mengandung nama brand terkenal tetapi bukan domain utamanya (kemungkinan URL palsu).');
         dangerScore += 2;
      }
    }

    // 6. Abnormally long domain
    if (domain.length > 30) {
      reasons.push('Panjang nama domain tidak wajar dan berpotensi mencurigakan.');
      dangerScore += 1;
    }

    return {
      isDangerous: dangerScore >= 2, // Threshold to be considered dangerous
      isWarning: dangerScore === 1,
      reasons: reasons.length > 0 ? reasons : ['Tidak ditemukan pola ancaman dari domain ini.'],
      dangerScore
    };
  };

  const handleScan = () => {
    if (!url.trim()) return;
    setStatus('scanning');
    
    // Simulate API call and Analysis
    setTimeout(() => {
      const result = analyzeUrl(url);
      setAnalysisResult(result);
      setStatus('result');
    }, 1500);
  };

  return (
    <div className="flex-column h-full">
      <Header title="URL Checker Scanner" showBack={true} onBack={() => navigate(backTo || 'dashboard')} />
      
      <div className="content-area flex-column" style={{ padding: '1rem', gap: '1rem' }}>
        <div className="glass-card flex-column" style={{ padding: '1.5rem', gap: '1rem' }}>
          <h3 className="font-bold text-center">Analisis Tautan Keamanan</h3>
          <p className="text-center text-muted" style={{ fontSize: '1.15rem' }}>Masukkan URL untuk memeriksa ancaman phishing, malware, atau penipuan.</p>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input 
              type="text" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleScan()}
              style={{ flexGrow: 1, padding: '10px 15px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem' }}
              placeholder="Contoh: www.microsoft.com"
            />
            <button className="btn btn-primary" style={{ padding: '10px 15px', borderRadius: '8px' }} onClick={handleScan}>
              <Search size={20} />
            </button>
          </div>
        </div>

        {status === 'scanning' && (
          <div className="flex-column flex-center" style={{ marginTop: '2rem', gap: '1rem' }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', border: '4px solid #e2e8f0', borderTopColor: 'var(--primary-blue)', animation: 'spin 1s linear infinite' }} />
            <p className="font-bold" style={{ color: 'var(--primary-blue)' }}>Mesin Heuristik Sedang Menganalisis...</p>
            <style>{`
              @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            `}</style>
          </div>
        )}

        {status === 'result' && analysisResult && (
          <div className="animate-fade-in flex-column" style={{ gap: '1rem' }}>
            <h3 className="font-bold">Laporan Diagnostik</h3>
            
            {analysisResult.isDangerous ? (
              <>
                <div className="glass-card" style={{ background: '#fee2e2', borderColor: '#fca5a5', color: '#0f172a' }}>
                  <div className="flex-row" style={{ alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <ShieldAlert size={28} className="text-danger" />
                    <span className="font-bold text-danger" style={{ fontSize: '1.2rem' }}>Status: URL BERBAHAYA</span>
                  </div>
                  
                  <p className="font-bold" style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Bukti Ancaman:</p>
                  <ul style={{ listStyle: 'none', padding: 0, fontSize: '1.15rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {analysisResult.reasons.map((r, i) => (
                      <li key={i} className="flex-row" style={{ gap: '8px', alignItems: 'flex-start' }}>
                        <CheckCircle2 size={18} className="text-danger" style={{ flexShrink: 0, marginTop: '2px' }} /> 
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : analysisResult.isWarning ? (
              <div className="glass-card" style={{ background: '#fffbeb', borderColor: '#fcd34d', color: '#0f172a' }}>
                <div className="flex-row" style={{ alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <AlertTriangle size={28} className="text-warning" />
                  <span className="font-bold text-warning" style={{ fontSize: '1.2rem' }}>Status: MENCURIGAKAN</span>
                </div>
                <p className="font-bold" style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Bukti Potensi Ancaman:</p>
                <ul style={{ listStyle: 'none', padding: 0, fontSize: '1.15rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {analysisResult.reasons.map((r, i) => (
                    <li key={i} className="flex-row" style={{ gap: '8px', alignItems: 'flex-start' }}>
                      <AlertCircle size={18} className="text-warning" style={{ flexShrink: 0, marginTop: '2px' }} /> 
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="glass-card" style={{ background: '#dcfce7', borderColor: '#86efac', color: '#0f172a' }}>
                <div className="flex-row" style={{ alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <ShieldCheck size={28} className="text-success" />
                  <span className="font-bold text-success" style={{ fontSize: '1.2rem' }}>Status: URL AMAN</span>
                </div>
                <p style={{ fontSize: '1.15rem' }}>Domain ini terlihat bersih. {analysisResult.reasons[0]}</p>
                <p style={{ fontSize: '1.1rem', marginTop: '0.5rem', opacity: 0.8 }}>Namun, selalu periksa halaman yang sedang Anda kunjungi dengan hati-hati.</p>
              </div>
            )}
            
            <div className="glass-card" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'var(--border-blue)' }}>
               <div className="flex-row" style={{ alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <AlertCircle size={20} className="text-primary" />
                  <span className="font-bold text-primary">Info Cyber Mentor</span>
               </div>
               <p style={{ fontSize: '1.1rem', lineHeight: '1.5' }}>
                  Penipu seringkali membuat domain yang mirip secara visual (seperti micros<strong>0</strong>ft atau g<strong>00</strong>gle), atau menyisipkan kata "login/update" pada nama domain untuk meyakinkan korban. Alat ini mendeteksi pola tersebut!
               </p>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default UrlChecker;
