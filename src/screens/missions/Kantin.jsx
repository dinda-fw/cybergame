import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import { Wifi, Shield, ShieldAlert, CheckCircle, AlertTriangle, Fingerprint, Lock, Unlock, Key, Activity, ServerCrash } from 'lucide-react';
import { questionBank } from '../../data/questionBank';

const Kantin = ({ navigate, completeMission, addXP, recordMistake, gameState }) => {
  const [status, setStatus] = useState('playing'); // playing, checking, success, fail, timeUp, connecting
  const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedNetworkId, setSelectedNetworkId] = useState(null);
  const [failMessage, setFailMessage] = useState({ title: '', desc: '' });
  
  // Entire level timer
  const [timeLeft, setTimeLeft] = useState(60);

  // Initialize mission
  useEffect(() => {
    setCurrentIndex(0);
        setSelectedNetworkId(null);
    setTimeLeft(60);
    setStatus('playing');
  }, []);

  // Timer effect
  useEffect(() => {
    if (status !== 'playing' && status !== 'connecting') return;
    if (timeLeft <= 0) {
      setStatus('timeUp');
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, status]);

  const scenario = questionBank.kantin[currentIndex];

  const handleNetworkSelect = (id) => {
    if (status !== 'playing') return;
    setSelectedNetworkId(id);
  };

  const handleAction = (actionType) => {
    if (!scenario || status !== 'playing') return;

    if (actionType === 'connect') {
      if (!selectedNetworkId) return;
      setStatus('connecting');
      
      setTimeout(() => {
        // Evaluate the Connect action
        const isCorrect = (scenario.correctAction === `connect_id_${selectedNetworkId}`);
        
        if (isCorrect) {
          if (currentIndex < questionBank.kantin.length - 1) {
            // Next scenario
            addXP(30);
            setStatus('correct');
          } else {
            // Finished all 3
            setStatus('success');
            completeMission('mission_kantin', 150);
          }
        } else {
          if (scenario.correctAction.startsWith('report_')) {
             setFailMessage({ title: 'SALAH TINDAKAN!', desc: 'Tugasmu adalah melaporkan jaringan palsu, bukan menyambung ke jaringan manapun!' });
          } else {
             setFailMessage({ title: 'YAH, DATAMU DICURI!', desc: 'Kamu menyambungkan perangkat ke jaringan yang tidak aman. Hacker berhasil mencuri datamu!' });
          }
          setStatus('fail');
          addXP(-50);
          if (recordMistake) recordMistake("Misi: Area Kantin", `Kesalahan pengambilan keputusan pada skenario Wi-Fi. ${scenario.explanation}`);
        }
      }, 1500);

    } else if (actionType === 'vpn') {
      setVpnActive(prev => !prev);
    } else if (actionType === 'report') {
      if (!selectedNetworkId) return;
      
      const isCorrect = (scenario.correctAction === `report_id_${selectedNetworkId}`); 
      if (isCorrect) {
        if (currentIndex < questionBank.kantin.length - 1) {
          addXP(30);
          setStatus('correct');
        } else {
          setStatus('success');
          completeMission('mission_kantin', 150);
        }
      } else {
        if (scenario.correctAction.startsWith('connect_')) {
           setFailMessage({ title: 'SALAH TINDAKAN!', desc: 'Tugasmu sekarang adalah mencari jaringan yang aman untuk menyambung, bukan melaporkan.' });
        } else {
           setFailMessage({ title: 'SALAH LAPORAN!', desc: 'Kamu salah sasaran. Jaringan yang kamu laporkan bukan jaringan palsu buatan hacker!' });
        }
        setStatus('fail');
        addXP(-50);
        if (recordMistake) recordMistake("Misi: Area Kantin", `Salah melaporkan Access Point. ${scenario.explanation}`);
      }
    }
  };

  const handleNext = () => {
    setCurrentIndex(prev => prev + 1);
    setSelectedNetworkId(null);
    setStatus('playing');
  };

  const handleRetry = () => {
    setCurrentIndex(0);
        setSelectedNetworkId(null);
    setTimeLeft(60);
    setStatus('playing');
  };

  if (!scenario) return <div>Loading...</div>;

  const selectedNet = scenario.networks.find(n => n.id === selectedNetworkId);

  return (
    <div className="flex-column h-full" style={{ background: '#080c14' }}>
      <Header title="Wi-Fi Analyzer Simulator" showBack={true} onBack={() => navigate('schoolMap')} timeLeft={timeLeft} xp={gameState?.xp} level={gameState?.level} />
      
      <div className="content-area flex-column" style={{ padding: '0.5rem', gap: '0.5rem', flexGrow: 1 }}>
        
        {/* Top Info Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ padding: '10px', background: 'rgba(255, 165, 0, 0.1)', border: '1px solid #F59E0B', borderRadius: '8px', borderLeft: '4px solid #F59E0B' }}>
            <p style={{ margin: 0, fontWeight: 'bold', color: '#F59E0B', fontSize: '1.1rem' }}>Studi Kasus - Misi {currentIndex + 1}/2</p>
            <p style={{ margin: '5px 0 0 0', lineHeight: '1.4', fontSize: '1.1rem' }}>{scenario.caseDescription}</p>
          </div>
          <div style={{ padding: '10px', background: 'rgba(0, 240, 255, 0.1)', border: '1px solid var(--border-blue)', borderRadius: '8px', borderLeft: '4px solid var(--primary-color)' }}>
            <p style={{ margin: 0, fontWeight: 'bold', color: 'var(--text-main)', fontSize: '1.1rem' }}>{scenario.instruction}</p>
          </div>
        </div>

        <div className="flex-row mobile-col" style={{ gap: '10px', flexGrow: 1, minHeight: 0 }}>
          
          {/* Left Panel: Network Scan List */}
          <div className="mobile-w-full" style={{ width: '40%', background: 'rgba(11, 16, 30, 0.8)', border: '1px solid var(--border-blue)', borderRadius: '12px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            <div style={{ padding: '10px', background: 'rgba(0, 240, 255, 0.1)', borderBottom: '1px solid var(--border-blue)', fontWeight: 'bold', fontSize: '1.05rem', display: 'flex', justifyContent: 'space-between' }}>
              <span>DAFTAR WI-FI</span>
              <span className="text-glow" style={{ fontSize: '1.2rem' }}>{scenario.networks.length} DITEMUKAN</span>
            </div>
            <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {scenario.networks.map(net => {
                const isSelected = selectedNetworkId === net.id;
                return (
                  <div 
                    key={net.id}
                    onClick={() => handleNetworkSelect(net.id)}
                    className={`flex-row ${isSelected ? 'cyber-card' : ''}`}
                    style={{ 
                      alignItems: 'center', justifyContent: 'space-between', padding: '10px', 
                      borderRadius: '8px', cursor: status === 'playing' ? 'pointer' : 'default',
                      background: isSelected ? 'rgba(0, 240, 255, 0.1)' : 'rgba(255,255,255,0.02)',
                      border: isSelected ? '1px solid var(--primary-color)' : '1px solid transparent'
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: isSelected ? 'var(--primary-color)' : 'white' }}>{net.name}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <div style={{ width: '40px', height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ width: net.signal, height: '100%', background: parseInt(net.signal) > 80 ? 'var(--success-green)' : parseInt(net.signal) > 50 ? 'var(--warning-yellow)' : 'var(--danger-red)' }} />
                        </div>
                        <span style={{ fontSize: '1.15rem', color: 'var(--text-muted)' }}>{net.signal}</span>
                      </div>
                    </div>
                    {net.secure && <Lock size={16} color="#888888" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Panel: Inspection Monitor Screen */}
          <div className="mobile-w-full" style={{ width: '60%', background: '#0a0f1a', border: '1px solid var(--border-blue)', borderRadius: '12px', display: 'flex', flexDirection: 'column', position: 'relative', overflowY: 'auto' }}>
            <div style={{ padding: '10px', background: 'rgba(0, 240, 255, 0.1)', borderBottom: '1px solid var(--border-blue)', fontWeight: 'bold', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={16} /> LAYAR PEMERIKSAAN INFORMASI
            </div>
            
            {selectedNet ? (
              <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: '15px', flexGrow: 1, overflowY: 'auto' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--primary-color)', textShadow: '0 0 5px rgba(0,240,255,0.5)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Wifi size={20} /> {selectedNet.name}
                </h3>
                
                <div style={{ background: 'rgba(0,0,0,0.4)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '1.05rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Jenis Keamanan:</span>
                      <span style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>{selectedNet.type}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>BSSID (MAC):</span>
                      <span style={{ fontFamily: 'monospace', color: 'var(--text-main)' }}>{selectedNet.mac}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Kekuatan Sinyal:</span>
                      <span>{selectedNet.signal}</span>
                    </div>
                  </div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.2)', padding: '10px', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '5px', color: 'var(--text-main)', fontSize: '1.1rem', fontWeight: 'bold' }}>
                    <Shield size={14} /> 
                    STATUS KEAMANAN
                  </div>
                  <p style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-main)', lineHeight: '1.4' }}>
                    {selectedNet.status}
                  </p>
                  <p style={{ margin: '8px 0 0 0', fontSize: '1rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    "{selectedNet.desc}"
                  </p>
                </div>
              </div>
            ) : (
              <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                Pilih salah satu Wi-Fi untuk dicek keamanannya
              </div>
            )}
            
            {/* Overlays */}
            {status !== 'playing' && (
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px', zIndex: 10 }}>
                {status === 'correct' && (
                  <>
                    <CheckCircle size={50} color="var(--success-green)" />
                    <h3 style={{ color: 'var(--success-green)', marginTop: '15px' }}>Tindakan Benar!</h3>
                    <p style={{ fontSize: '1.1rem', textAlign: 'center', margin: '10px 0' }}>{scenario.explanation}</p>
                    <p style={{ color: 'var(--success-green)', fontWeight: 'bold' }}>+30 XP</p>
                    <button className="btn cyber-btn mt-4" onClick={handleNext}>Lanjut ke Misi Berikutnya</button>
                  </>
                )}
                {status === 'connecting' && (
                  <>
                    <Activity size={40} className="text-primary animate-pulse" />
                    <h3 className="text-primary mt-2">Menyambungkan...</h3>
                    <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)' }}>'Mencoba masuk...'</p>
                  </>
                )}
                {status === 'success' && (
                  <>
                    <Shield size={50} color="var(--primary-color)" />
                    <h3 style={{ color: 'var(--primary-color)', marginTop: '15px', textShadow: '0 0 10px rgba(0,240,255,0.5)' }}>MISI BERHASIL!</h3>
                    <p style={{ fontSize: '1.1rem', textAlign: 'center', margin: '10px 0' }}>Wah hebat! Kamu berhasil menjaga datamu dari ancaman hacker di internet.</p>
                    <p style={{ color: 'var(--success-green)', fontWeight: 'bold' }}>+150 XP</p>
                    <button className="btn cyber-btn mt-4" onClick={() => navigate('schoolMap')}>Kembali ke Peta</button>
                  </>
                )}
                {status === 'fail' && (
                  <>
                    <ServerCrash size={50} color="var(--danger-red)" />
                    <h3 style={{ color: 'var(--danger-red)', marginTop: '15px' }}>{failMessage.title || 'GAGAL!'}</h3>
                    <p style={{ fontSize: '1.1rem', textAlign: 'center', margin: '10px 0' }}>{failMessage.desc}</p>
                    <p style={{ fontSize: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>{scenario.explanation}</p>
                    <button className="btn cyber-btn mt-4" onClick={handleRetry}>Coba Lagi</button>
                    <button className="btn btn-outline mt-2" onClick={() => navigate('schoolMap')}>Kembali ke Peta</button>
                  </>
                )}
                {status === 'timeUp' && (
                  <>
                    <AlertTriangle size={50} color="var(--warning-yellow)" />
                    <h3 style={{ color: 'var(--warning-yellow)', marginTop: '15px' }}>WAKTU HABIS!</h3>
                    <p style={{ fontSize: '1.1rem', textAlign: 'center', margin: '10px 0' }}>Waktu habis (60s)! Kamu belum selesai mengamankan jaringan.</p>
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
            disabled={status !== 'playing' || !selectedNetworkId}
            className="btn hover-glow" 
            style={{ flex: 1, background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--success-green)', color: 'white', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', fontSize: '1.05rem', fontWeight: 'bold', opacity: (status !== 'playing' || !selectedNetworkId) ? 0.5 : 1 }}
            onClick={() => handleAction('connect')}
          >
            <Wifi size={16} /> SAMBUNGKAN KE WI-FI
          </button>
          
          <button 
            disabled={status !== 'playing' || !selectedNetworkId}
            className="btn hover-glow" 
            style={{ flex: 1, background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger-red)', color: 'white', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', fontSize: '1.05rem', fontWeight: 'bold', opacity: (status !== 'playing' || !selectedNetworkId) ? 0.5 : 1 }}
            onClick={() => handleAction('report')}
          >
            <ShieldAlert size={16} /> LAPORKAN WI-FI PALSU
          </button>
        </div>

      </div>
    </div>
  );
};

export default Kantin;
