import React, { useState } from 'react';
import { User, RefreshCcw, GraduationCap } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [className, setClassName] = useState('');
  const [error, setError] = useState('');
  const [isNotRobot, setIsNotRobot] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!username.trim()) {
      setError('Harap masukkan nama panggilanmu!');
      return;
    }

    if (!className.trim()) {
      setError('Harap masukkan kelasmu!');
      return;
    }

    if (!isNotRobot) {
      setError('Harap centang verifikasi "Saya bukan robot"!');
      return;
    }

    onLogin(username.trim(), className.trim());
  };

  return (
    <div className="flex-column h-full flex-center" style={{ padding: '20px' }}>
      <div className="cyber-card flex-column w-full" style={{ maxWidth: '400px', alignItems: 'center' }}>
        <img src="/icon5.png" alt="CyberShield Logo" style={{ width: 80, height: 80, marginBottom: '16px' }} />
        <h1 className="text-glow" style={{ fontSize: '2.2rem', margin: 0, textAlign: 'center', letterSpacing: '2px' }}>
          CYBERSHIELD GAME
        </h1>
        <p className="text-muted text-center" style={{ marginBottom: '24px' }}>
          Masukkan nama panggilanmu untuk mulai bermain dan bersaing di Papan Peringkat!
        </p>

        {error && (
          <div style={{ color: 'var(--danger-red)', marginBottom: '16px', textAlign: 'center', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex-column w-full" style={{ gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <User size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              className="cyber-input w-full" 
              placeholder="Nama" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ padding: '16px 16px 16px 44px', boxSizing: 'border-box', fontSize: '1.1rem', borderRadius: '8px', border: '1px solid var(--border-blue)', background: 'rgba(255, 255, 255, 0.05)', color: 'white' }}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <GraduationCap size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              className="cyber-input w-full" 
              placeholder="Kelas (contoh: 11 TKJ 1)" 
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              style={{ padding: '16px 16px 16px 44px', boxSizing: 'border-box', fontSize: '1.1rem', borderRadius: '8px', border: '1px solid var(--border-blue)', background: 'rgba(255, 255, 255, 0.05)', color: 'white' }}
            />
          </div>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            background: '#fafafa', 
            padding: '10px 14px', 
            borderRadius: '3px', 
            border: '1px solid #d3d3d3',
            color: '#222',
            boxShadow: '0 0 4px rgba(0,0,0,0.1)',
            marginTop: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <input 
                type="checkbox" 
                id="robot-check" 
                checked={isNotRobot}
                onChange={(e) => { setIsNotRobot(e.target.checked); setError(''); }}
                style={{ width: '28px', height: '28px', marginRight: '12px', cursor: 'pointer', accentColor: '#0052cc' }}
              />
              <label htmlFor="robot-check" style={{ cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>
                Saya bukan robot
              </label>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <RefreshCcw size={26} color="#4285f4" strokeWidth={2.5} />
              <span style={{ fontSize: '10px', marginTop: '2px', color: '#555' }}>reCAPTCHA</span>
              <span style={{ fontSize: '8px', color: '#555' }}>Privacy - Terms</span>
            </div>
          </div>

          <button type="submit" className="cyber-btn w-full mt-2" style={{ padding: '16px', fontSize: '1.1rem' }}>
            Mulai Bermain
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
