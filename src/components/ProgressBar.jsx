import React from 'react';

const ProgressBar = ({ progress, colorClass = "bg-primary" }) => {
  return (
    <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
      <div 
        style={{ 
          width: `${Math.min(100, Math.max(0, progress))}%`, 
          height: '100%', 
          backgroundColor: colorClass === 'bg-primary' ? 'var(--secondary-color)' : colorClass === 'bg-success' ? 'var(--success-green)' : 'var(--primary-color)',
          boxShadow: colorClass === 'bg-primary' ? '0 0 10px var(--secondary-color)' : '0 0 10px var(--primary-color)',
          transition: 'width 0.3s ease'
        }} 
      />
    </div>
  );
};

export default ProgressBar;
