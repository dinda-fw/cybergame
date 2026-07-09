import React from 'react';
import { ArrowLeft, User, Shield, Clock } from 'lucide-react';

const Header = ({ title, showBack, onBack, xp, level, actions, timeLeft }) => {
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };
  return (
    <div className="app-header custom-header" style={{ 
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '12px',
      padding: '12px 16px', 
      alignItems: 'center', 
      background: 'rgba(11, 16, 30, 0.95)',
      borderBottom: '1px solid var(--border-blue)',
      boxShadow: '0 4px 20px rgba(0, 240, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
        {showBack && (
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--secondary-color)' }}>
            <ArrowLeft size={24} />
          </button>
        )}
        <h2 className="font-bold text-glow" style={{ fontSize: '1.1rem', margin: 0, letterSpacing: '0.5px', lineHeight: 1.2 }}>{title}</h2>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'row', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
        {actions && (
          <div className="flex-row" style={{ gap: '8px' }}>
            {actions}
          </div>
        )}
        {xp !== undefined && (
          <div className="flex-row" style={{ gap: '16px', alignItems: 'center' }}>
            <div className="text-right header-xp-text" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <div className="font-bold text-glow-neon" style={{ fontSize: '0.9rem' }}>XP: {xp}</div>
              <div className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{level}</div>
            </div>
            <div className="header-shield-icon" style={{ width: 40, height: 40, borderRadius: '4px', backgroundColor: 'rgba(136, 204, 20, 0.2)', border: '1px solid var(--primary-color)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Shield size={20} color="var(--primary-color)" />
            </div>
          </div>
        )}
        {timeLeft !== undefined && (
          <div className="header-timer" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '6px', background: timeLeft <= 10 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(0,0,0,0.4)', border: timeLeft <= 10 ? '1px solid #ef4444' : '1px solid var(--border-blue)', padding: '4px 10px', borderRadius: '8px' }}>
            <Clock size={18} color={timeLeft <= 10 ? '#ef4444' : 'var(--text-main)'} className={timeLeft <= 10 ? 'animate-pulse' : ''} />
            <span className="font-bold" style={{ color: timeLeft <= 10 ? '#ef4444' : 'var(--text-main)', fontSize: '1rem', letterSpacing: '1px' }}>
              {formatTime(timeLeft)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
