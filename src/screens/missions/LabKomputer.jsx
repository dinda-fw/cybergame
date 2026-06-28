import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import { Monitor, ShieldAlert, CheckCircle, AlertTriangle, Zap, Search, ShieldCheck, Cpu, HardDrive, Activity } from 'lucide-react';
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

const LabKomputer = ({ navigate, completeMission, addXP, recordMistake, username }) => {
  const [status, setStatus] = useState('playing'); // playing, correct, success, fail, timeUp
  const [pcs, setPcs] = useState([]);
  const [selectedPCId, setSelectedPCId] = useState(null);
  
  // Progress tracking
  const [processedPcs, setProcessedPcs] = useState([]); // Array of { id, isCorrect }
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    const shuffled = deterministicShuffle(username, questionBank.labKomputer);
    setPcs(shuffled);
    setSelectedPCId(shuffled[0]?.id);
    setProcessedPcs([]);
    setTimeLeft(60);
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

  const handleAction = (actionType) => {
    const selectedPC = pcs.find(p => p.id === selectedPCId);
    if (!selectedPC) return;

    const isCorrect = selectedPC.correctAction === actionType;
    setProcessedPcs(prev => [...prev, { id: selectedPCId, isCorrect }]);

    if (isCorrect) {
      setStatus('correct');
      addXP(50);
    } else {
      setStatus('fail');
      addXP(-10); // slight penalty for wrong
      if (recordMistake) {
        let expectedActionText = 'KOMPUTER AMAN';
        if (selectedPC.correctAction === 'isolasi') expectedActionText = 'CABUT KABEL INTERNET';
        if (selectedPC.correctAction === 'scan') expectedActionText = 'SCAN ANTIVIRUS';
        recordMistake("Misi: Lab Komputer", `Salah mengambil tindakan pada ${selectedPC.name}. Seharusnya: ${expectedActionText}. ${selectedPC.explanation || ''}`);
      }
    }
  };

  const handleNext = () => {
    if (processedPcs.length >= pcs.length) {
      setStatus('success');
      completeMission('mission_labkomputer', 0);
      return;
    }
    // Select the next unprocessed PC automatically
    const nextUnprocessed = pcs.find(p => !processedPcs.some(proc => proc.id === p.id));
    if (nextUnprocessed) {
      setSelectedPCId(nextUnprocessed.id);
    }
    setTimeLeft(60);
    setStatus('playing');
  };

  const handleRetry = () => {
    const shuffled = deterministicShuffle(username, questionBank.labKomputer);
    setPcs(shuffled);
    setSelectedPCId(shuffled[0]?.id);
    setProcessedPcs([]);
    setTimeLeft(60);
    setStatus('playing');
  };

  if (pcs.length === 0) return <div>Loading...</div>;

  const selectedPC = pcs.find(p => p.id === selectedPCId);
  const isLastPc = processedPcs.length >= pcs.length;

  return (
    <div className="flex-column h-full" style={{ background: '#080c14' }}>
      <Header title="Misi: Penyelamat Lab Komputer" showBack={true} onBack={() => navigate('schoolMap')} timeLeft={timeLeft} />
      
      <div className="content-area flex-column" style={{ padding: '0.5rem', gap: '0.5rem', flexGrow: 1 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '0.5rem' }}>
          <div style={{ background: 'rgba(255, 165, 0, 0.1)', borderLeft: '3px solid #F59E0B', padding: '10px', borderRadius: '4px' }}>
            <p style={{ margin: 0, fontSize: '1.1rem', lineHeight: '1.4' }}><span style={{fontWeight: 'bold', color: '#F59E0B'}}>Studi Kasus:</span> Lab Komputer sekolah sedang diserang oleh berbagai macam virus! Kamu harus bertindak sebagai detektif untuk memeriksa kelima komputer di lab ini satu per satu.</p>
          </div>
          <div style={{ background: 'rgba(0, 240, 255, 0.1)', borderLeft: '3px solid var(--primary-color)', padding: '10px', borderRadius: '4px' }}>
            <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold', lineHeight: '1.4' }}>
              Tugas: Klik komputer di daftar kiri, baca "LAPORAN KELUHAN" di layar kanan, lalu pilih salah satu tombol tindakan di bawah:
              <br/><span style={{fontWeight: 'normal'}}>• <span style={{color: 'var(--danger-red)'}}>CABUT KABEL INTERNET:</span> Jika virus sangat berbahaya (mencuri data atau mengunci file).</span>
              <br/><span style={{fontWeight: 'normal'}}>• <span style={{color: 'var(--warning-yellow)'}}>SCAN ANTIVIRUS:</span> Jika hanya ada virus pembuat iklan yang mengganggu layar.</span>
              <br/><span style={{fontWeight: 'normal'}}>• <span style={{color: 'var(--success-green)'}}>KOMPUTER AMAN:</span> Jika komputernya berjalan lancar dan tidak ada keluhan aneh.</span>
            </p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '0.5rem' }}>
          {pcs.map((pc) => {
            const processedInfo = processedPcs.find(p => p.id === pc.id);
            let bgColor = 'rgba(255,255,255,0.1)';
            let shadow = 'none';
            if (processedInfo) {
              bgColor = processedInfo.isCorrect ? 'var(--success-green)' : 'var(--danger-red)';
              shadow = `0 0 10px ${bgColor}`;
            }
            return (
              <div key={pc.id} style={{
                width: `${100 / pcs.length}%`, height: '6px', borderRadius: '4px',
                background: bgColor,
                boxShadow: shadow,
                transition: 'all 0.3s'
              }} />
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: '10px', flexGrow: 1, height: '100%', overflow: 'hidden' }}>
          
          {/* Left Panel: PC List */}
          <div style={{ width: '35%', background: 'rgba(11, 16, 30, 0.8)', border: '1px solid var(--border-blue)', borderRadius: '12px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            <div style={{ padding: '10px', background: 'rgba(0, 240, 255, 0.1)', borderBottom: '1px solid var(--border-blue)', fontWeight: 'bold', fontSize: '1.1rem' }}>
              DAFTAR KOMPUTER
            </div>
            <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {pcs.map(pc => {
                const processedInfo = processedPcs.find(p => p.id === pc.id);
                const isResolved = !!processedInfo;
                const isSelected = selectedPCId === pc.id;
                
                let iconColor = '#64748b';
                let statusText = 'Scanning...';
                if (isResolved) {
                  iconColor = processedInfo.isCorrect ? '#10B981' : '#EF4444';
                  statusText = processedInfo.isCorrect ? 'AMAN' : 'SALAH';
                } else if (isSelected) {
                  iconColor = 'var(--primary-color)';
                }

                return (
                  <div 
                    key={pc.id}
                    onClick={() => { if (status === 'playing' && !isResolved) setSelectedPCId(pc.id); }}
                    className={`flex-row ${isSelected ? 'cyber-card' : ''}`}
                    style={{ 
                      alignItems: 'center', gap: '10px', padding: '10px', 
                      borderRadius: '8px', cursor: (status === 'playing' && !isResolved) ? 'pointer' : 'default',
                      background: isSelected ? 'rgba(0, 240, 255, 0.1)' : 'rgba(255,255,255,0.02)',
                      border: isSelected ? '1px solid var(--primary-color)' : '1px solid transparent',
                      opacity: isResolved ? 0.5 : 1
                    }}
                  >
                    <Monitor size={24} color={iconColor} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '1.05rem', fontWeight: 'bold', color: isSelected ? 'var(--primary-color)' : 'white' }}>{pc.name.split(' ')[0]}</span>
                      <span style={{ fontSize: '1.15rem', color: isResolved && !processedInfo.isCorrect ? 'var(--danger-red)' : 'var(--text-muted)' }}>{statusText}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Panel: Telemetry Monitor */}
          <div style={{ width: '65%', background: '#0a0f1a', border: '1px solid var(--border-blue)', borderRadius: '12px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <div style={{ padding: '10px', background: 'rgba(0, 240, 255, 0.1)', borderBottom: '1px solid var(--border-blue)', fontWeight: 'bold', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={16} /> KONDISI MESIN
            </div>
            
            {selectedPC && (
              <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: '15px', flexGrow: 1, overflowY: 'auto' }}>
                <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--primary-color)', textShadow: '0 0 5px rgba(0,240,255,0.5)' }}>{selectedPC.name}</h3>
                
                {/* Resource Bars */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div style={{ background: 'rgba(0,0,0,0.4)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', marginBottom: '5px', color: 'var(--text-muted)' }}>
                      <span><Cpu size={12} style={{ display: 'inline', marginRight: '4px' }}/> BEBAN MESIN (CPU)</span>
                      <span style={{ color: parseInt(selectedPC.telemetry.cpuUsage || '0') > 80 ? 'var(--danger-red)' : 'var(--success-green)' }}>{selectedPC.telemetry.cpuUsage || '0%'}</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: '#1e293b', borderRadius: '3px' }}>
                      <div style={{ width: selectedPC.telemetry.cpuUsage || '0%', height: '100%', background: parseInt(selectedPC.telemetry.cpuUsage || '0') > 80 ? 'var(--danger-red)' : 'var(--success-green)', borderRadius: '3px', boxShadow: `0 0 5px ${parseInt(selectedPC.telemetry.cpuUsage || '0') > 80 ? 'var(--danger-red)' : 'var(--success-green)'}` }} />
                    </div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.4)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', marginBottom: '5px', color: 'var(--text-muted)' }}>
                      <span>BEBAN GAMBAR (GPU)</span>
                      <span style={{ color: parseInt(selectedPC.telemetry.gpuUsage || '0') > 80 ? 'var(--warning-yellow)' : 'var(--success-green)' }}>{selectedPC.telemetry.gpuUsage || '0%'}</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: '#1e293b', borderRadius: '3px' }}>
                      <div style={{ width: selectedPC.telemetry.gpuUsage || '0%', height: '100%', background: parseInt(selectedPC.telemetry.gpuUsage || '0') > 80 ? 'var(--warning-yellow)' : 'var(--success-green)', borderRadius: '3px' }} />
                    </div>
                  </div>
                </div>

                {/* System State Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '1.05rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Aplikasi Berjalan:</span>
                    <span style={{ fontFamily: 'monospace', color: (selectedPC.telemetry.backgroundProcess || '').includes('.exe') || (selectedPC.telemetry.backgroundProcess || '').includes('.vbs') || (selectedPC.telemetry.backgroundProcess || '').includes('.sh') ? 'var(--warning-yellow)' : 'var(--primary-color)' }}>{selectedPC.telemetry.backgroundProcess || 'None'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Kondisi Kipas:</span>
                    <span style={{ color: (selectedPC.telemetry.fanSpeed || '').includes('Max') ? 'var(--danger-red)' : 'var(--success-green)' }}>{selectedPC.telemetry.fanSpeed || 'Normal'}</span>
                  </div>
                  {selectedPC.telemetry.networkTraffic && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Internet Keluar:</span>
                      <span style={{ color: 'var(--danger-red)' }}>{selectedPC.telemetry.networkTraffic}</span>
                    </div>
                  )}
                </div>

                {/* Symptoms / Alert Log */}
                <div style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '10px', borderRadius: '8px', marginTop: 'auto' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '5px', color: 'var(--danger-red)', fontSize: '1.05rem', fontWeight: 'bold' }}>
                    <HardDrive size={14} /> LAPORAN KELUHAN
                  </div>
                  <p style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-main)', fontStyle: 'italic', lineHeight: '1.4' }}>
                    "{selectedPC.symptom}"
                  </p>
                </div>
              </div>
            )}
            
            {/* Status Overlays */}
            {status !== 'playing' && (
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px', zIndex: 10 }}>
                {status === 'correct' && (
                  <>
                    <CheckCircle size={50} color="var(--success-green)" />
                    <h3 style={{ color: 'var(--success-green)', marginTop: '15px' }}>Tindakan Benar!</h3>
                    <p style={{ fontSize: '1.1rem', textAlign: 'center', margin: '10px 0' }}>{selectedPC?.explanation || 'Tindakan yang tepat! Sistem berhasil diamankan.'}</p>
                    <p style={{ color: 'var(--success-green)', fontWeight: 'bold' }}>+30 XP</p>
                    <button className="btn cyber-btn mt-4" onClick={handleNext}>{isLastPc ? 'Selesaikan Misi' : 'Periksa Komputer Lain'}</button>
                  </>
                )}
                {status === 'success' && (
                  <>
                    <ShieldCheck size={50} color="var(--primary-color)" />
                    <h3 style={{ color: 'var(--primary-color)', marginTop: '15px', textShadow: '0 0 10px rgba(0,240,255,0.5)' }}>SEMUA KOMPUTER DIPERIKSA!</h3>
                    <p style={{ fontSize: '1.1rem', textAlign: 'center', margin: '10px 0' }}>Hore! Kamu berhasil memeriksa seluruh komputer di lab.</p>
                    <button className="btn cyber-btn mt-4" onClick={() => navigate('schoolMap')}>Kembali ke Peta</button>
                  </>
                )}
                {status === 'fail' && (
                  <>
                    <ShieldAlert size={50} color="var(--danger-red)" />
                    <h3 style={{ color: 'var(--danger-red)', marginTop: '15px' }}>YAH, TINDAKANMU SALAH!</h3>
                    <p style={{ fontSize: '1.1rem', textAlign: 'center', margin: '10px 0' }}>Tindakanmu kurang tepat untuk komputer ini.</p>
                    <p style={{ fontSize: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>{selectedPC?.explanation}</p>
                    <button className="btn cyber-btn mt-4" onClick={handleNext}>{isLastPc ? 'Selesaikan Misi' : 'Lanjut ke Komputer Berikutnya'}</button>
                  </>
                )}
                {status === 'timeUp' && (
                  <>
                    <AlertTriangle size={50} color="var(--warning-yellow)" />
                    <h3 style={{ color: 'var(--warning-yellow)', marginTop: '15px' }}>WAKTU HABIS!</h3>
                    <p style={{ fontSize: '1.1rem', textAlign: 'center', margin: '10px 0' }}>Waktu habis! Virus telah merusak semua komputer.</p>
                    <button className="btn cyber-btn mt-4" onClick={handleRetry}>Coba Lagi</button>
                    <button className="btn btn-outline mt-2" onClick={() => navigate('schoolMap')}>Kembali ke Peta</button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Footer */}
        <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
          <button 
            disabled={status !== 'playing'}
            className="btn hover-glow" 
            style={{ flex: 1, background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger-red)', color: 'white', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', fontSize: '1.05rem', fontWeight: 'bold', opacity: status !== 'playing' ? 0.5 : 1 }}
            onClick={() => handleAction('isolasi')}
          >
            <Zap size={16} /> CABUT KABEL INTERNET
          </button>
          <button 
            disabled={status !== 'playing'}
            className="btn hover-glow" 
            style={{ flex: 1, background: 'rgba(245, 158, 11, 0.1)', border: '1px solid var(--warning-yellow)', color: 'white', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', fontSize: '1.05rem', fontWeight: 'bold', opacity: status !== 'playing' ? 0.5 : 1 }}
            onClick={() => handleAction('scan')}
          >
            <Search size={16} /> SCAN ANTIVIRUS
          </button>
          <button 
            disabled={status !== 'playing'}
            className="btn hover-glow" 
            style={{ flex: 1, background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--success-green)', color: 'white', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', fontSize: '1.05rem', fontWeight: 'bold', opacity: status !== 'playing' ? 0.5 : 1 }}
            onClick={() => handleAction('secure')}
          >
            <ShieldCheck size={16} /> KOMPUTER AMAN
          </button>
        </div>

      </div>
    </div>
  );
};

export default LabKomputer;
