import React, { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './screens/Dashboard';
import SchoolMap from './screens/SchoolMap';
import RuangGuru from './screens/missions/RuangGuru';
import LabKomputer from './screens/missions/LabKomputer';
import Kantin from './screens/missions/Kantin';
import Aula from './screens/missions/Aula';
import ServerRoom from './screens/missions/ServerRoom';
import UrlDetective from './screens/features/UrlDetective';
import CyberScanChallenge from './screens/features/CyberScanChallenge';
import ResultsDashboard from './screens/ResultsDashboard';
import Login from './screens/Login';
import Leaderboard from './screens/Leaderboard';

const DEFAULT_GAME_STATE = {
  xp: 0,
  level: 'Cyber Rookie',
  badges: 3,
  currentLevel: 1, // 1: Kantin, 2: Aula, 3: RuangGuru, 4: Lab, 5: Server (Max 5)
  competencies: {
    awareness: 0,
    urlDetection: 0,
    passwordSecurity: 0,
    socialEngineering: 0,
    networkSecurity: 0
  },
  completedMissions: [],
  mistakes: []
};

const API_URL = '/api';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [gameState, setGameState] = useState(DEFAULT_GAME_STATE);
  const [leaderboardBackTo, setLeaderboardBackTo] = useState('dashboard');
  const [urlDetectiveBackTo, setUrlDetectiveBackTo] = useState('dashboard');

  const saveProgressToBackend = async (stateToSave, usernameToSave) => {
    try {
      const res = await fetch(`${API_URL}/save-progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: usernameToSave,
          ...stateToSave
        })
      });
      if (!res.ok) throw new Error('API failed');
    } catch (e) {
      console.warn("Backend unavailable, saving progress to localStorage");
      const users = JSON.parse(localStorage.getItem('cybergame_users') || '{}');
      if (users[usernameToSave]) {
        users[usernameToSave] = { ...users[usernameToSave], ...stateToSave };
        localStorage.setItem('cybergame_users', JSON.stringify(users));
      }
    }
  };

  useEffect(() => {
    if (currentUser && gameState !== DEFAULT_GAME_STATE) {
      saveProgressToBackend(gameState, currentUser);
    }
  }, [gameState, currentUser]);

  useEffect(() => {
    const checkLogin = async () => {
      const savedUser = localStorage.getItem('cyberShieldUser');
      if (savedUser) {
        try {
          const res = await fetch(`${API_URL}/user/${savedUser}`);
          if (!res.ok) throw new Error('API failed');
          const user = await res.json();
          setCurrentUser(savedUser);
          setGameState({
            xp: user.xp,
            level: user.level,
            badges: user.badges,
            currentLevel: user.currentLevel,
            competencies: {
              awareness: user.awareness,
              urlDetection: user.urlDetection,
              passwordSecurity: user.passwordSecurity,
              socialEngineering: user.socialEngineering,
              networkSecurity: user.networkSecurity
            },
            completedMissions: user.completedMissions || [],
            mistakes: user.mistakes || []
          });
        } catch (e) {
          console.warn("Backend offline, relying on localstorage");
          const users = JSON.parse(localStorage.getItem('cybergame_users') || '{}');
          const user = users[savedUser];
          if (user) {
            setCurrentUser(savedUser);
            setGameState({
              xp: user.xp || 0,
              level: user.level || 'Cyber Rookie',
              badges: user.badges || 3,
              currentLevel: user.currentLevel || 1,
              competencies: user.competencies || {
                awareness: user.awareness || 0,
                urlDetection: user.urlDetection || 0,
                passwordSecurity: user.passwordSecurity || 0,
                socialEngineering: user.socialEngineering || 0,
                networkSecurity: user.networkSecurity || 0
              },
              completedMissions: user.completedMissions || [],
              mistakes: user.mistakes || []
            });
          }
        }
      }
    };
    checkLogin();
  }, []);

  const handleLogin = async (username, className) => {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, className })
      });
      if (!res.ok) throw new Error('API failed');
      const data = await res.json();
      
      setCurrentUser(username);
      localStorage.setItem('cyberShieldUser', username);
      
      const user = data.user;
      const finalState = {
        xp: user.xp,
        level: user.level,
        badges: user.badges,
        currentLevel: user.currentLevel,
        competencies: {
          awareness: user.awareness,
          urlDetection: user.urlDetection,
          passwordSecurity: user.passwordSecurity,
          socialEngineering: user.socialEngineering,
          networkSecurity: user.networkSecurity
        },
        completedMissions: user.completedMissions || [],
        mistakes: user.mistakes || []
      };
      
      setGameState(finalState);
      setCurrentScreen('dashboard');
      return true;
    } catch (e) {
      console.warn("Backend unavailable, using localStorage for login");
      const users = JSON.parse(localStorage.getItem('cybergame_users') || '{}');
      let user = users[username];
      if (!user) {
        user = {
          username,
          class_name: className,
          xp: 0,
          level: 'Cyber Rookie',
          badges: 3,
          currentLevel: 1,
          competencies: { awareness: 0, urlDetection: 0, passwordSecurity: 0, socialEngineering: 0, networkSecurity: 0 },
          completedMissions: [],
          mistakes: []
        };
        users[username] = user;
        localStorage.setItem('cybergame_users', JSON.stringify(users));
      }
      
      setCurrentUser(username);
      localStorage.setItem('cyberShieldUser', username);
      setGameState({
        xp: user.xp || 0,
        level: user.level || 'Cyber Rookie',
        badges: user.badges || 3,
        currentLevel: user.currentLevel || 1,
        competencies: user.competencies || {
          awareness: user.awareness || 0,
          urlDetection: user.urlDetection || 0,
          passwordSecurity: user.passwordSecurity || 0,
          socialEngineering: user.socialEngineering || 0,
          networkSecurity: user.networkSecurity || 0
        },
        completedMissions: user.completedMissions || [],
        mistakes: user.mistakes || []
      });
      setCurrentScreen('dashboard');
      return true;
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('cyberShieldUser');
    setGameState(DEFAULT_GAME_STATE);
  };

  const navigate = (screen, options = {}) => {
    if (screen === 'url_detective') {
      setUrlDetectiveBackTo(options.backTo || currentScreen);
      setCurrentScreen('url_detective');
      return;
    }

    if (screen === 'schoolMap' && gameState.completedMissions.length >= 5) {
      setCurrentScreen('results');
      return;
    }

    setCurrentScreen(screen);
  };

  const addXP = (amount) => {
    setGameState(prev => {
      const newXp = prev.xp + amount;
      const newState = {
        ...prev,
        xp: newXp,
        level: newXp > 2000 ? 'Cyber Defender' : prev.level
      };
      return newState;
    });
  };

  const completeMission = (missionId, xpEarned) => {
    if (!gameState.completedMissions.includes(missionId)) {
      setGameState(prev => {
        const newComps = { ...prev.competencies };
        if (missionId === 'mission_ruangguru') {
          newComps.awareness = Math.min(100, newComps.awareness + 50);
          newComps.passwordSecurity = Math.min(100, newComps.passwordSecurity + 50);
        }
        if (missionId === 'mission_labkomputer') {
          newComps.awareness = Math.min(100, newComps.awareness + 50);
        }
        if (missionId === 'mission_kantin') {
          newComps.networkSecurity = Math.min(100, newComps.networkSecurity + 100); // Kantin is the only network mission
        }
        if (missionId === 'mission_aula') {
          newComps.socialEngineering = Math.min(100, newComps.socialEngineering + 100);
          newComps.passwordSecurity = Math.min(100, newComps.passwordSecurity + 50);
        }
        if (missionId === 'mission_serverroom') {
          newComps.urlDetection = Math.min(100, newComps.urlDetection + 100);
        }

        const newXp = prev.xp + xpEarned;
        const newState = {
          ...prev,
          competencies: newComps,
          completedMissions: [...prev.completedMissions, missionId],
          xp: newXp,
          level: newXp > 2000 ? 'Cyber Defender' : prev.level,
          currentLevel: prev.currentLevel + 1
        };
        return newState;
      });
    }
  };

  const recordMistake = (location, explanation) => {
    setGameState(prev => {
      const currentMistakes = prev.mistakes || [];
      if (!currentMistakes.find(m => m.explanation === explanation)) {
        const newComps = { ...prev.competencies };
        if (location.includes("Ruang Guru")) {
          newComps.awareness = Math.max(0, newComps.awareness - 20);
          newComps.passwordSecurity = Math.max(0, newComps.passwordSecurity - 20);
        }
        if (location.includes("Lab Komputer")) {
          newComps.awareness = Math.max(0, newComps.awareness - 20);
        }
        if (location.includes("Kantin")) {
          newComps.networkSecurity = Math.max(0, newComps.networkSecurity - 20);
        }
        if (location.includes("Aula")) {
          newComps.socialEngineering = Math.max(0, newComps.socialEngineering - 20);
          newComps.passwordSecurity = Math.max(0, newComps.passwordSecurity - 20);
        }
        if (location.includes("Server Room")) {
          newComps.urlDetection = Math.max(0, newComps.urlDetection - 20);
        }

        const newState = {
          ...prev,
          mistakes: [...currentMistakes, { location, explanation }],
          competencies: newComps
        };
        return newState;
      }
      return prev;
    });
  };

  const resetGame = () => {
    setGameState(DEFAULT_GAME_STATE);
    saveProgressToBackend(DEFAULT_GAME_STATE, currentUser);
    setCurrentScreen('dashboard');
  };

  const renderScreen = () => {
    if (!currentUser) {
      return <Login onLogin={handleLogin} />;
    }

    const screenToRender = currentScreen === 'url_detective' ? urlDetectiveBackTo : currentScreen;

    switch (screenToRender) {
      case 'dashboard':
        return <Dashboard navigate={navigate} gameState={gameState} onLogout={handleLogout} username={currentUser} onReset={resetGame} setLeaderboardBackTo={setLeaderboardBackTo} />;
      case 'schoolMap':
        return <SchoolMap navigate={navigate} gameState={gameState} username={currentUser} />;
      case 'mission_ruangguru':
        return <RuangGuru navigate={navigate} completeMission={completeMission} addXP={addXP} recordMistake={recordMistake} username={currentUser} gameState={gameState} />;
      case 'mission_labkomputer':
        return <LabKomputer navigate={navigate} completeMission={completeMission} addXP={addXP} recordMistake={recordMistake} username={currentUser} gameState={gameState} />;
      case 'mission_kantin':
        return <Kantin navigate={navigate} completeMission={completeMission} addXP={addXP} recordMistake={recordMistake} username={currentUser} gameState={gameState} />;
      case 'mission_aula':
        return <Aula navigate={navigate} completeMission={completeMission} addXP={addXP} recordMistake={recordMistake} username={currentUser} gameState={gameState} />;
      case 'serverroom': // just in case
      case 'mission_serverroom':
        return <ServerRoom navigate={navigate} completeMission={completeMission} addXP={addXP} recordMistake={recordMistake} username={currentUser} gameState={gameState} />;
      case 'cyber_scan':
        return <CyberScanChallenge navigate={navigate} addXP={addXP} />;
      case 'results':
        return <ResultsDashboard navigate={navigate} gameState={gameState} resetGame={resetGame} setLeaderboardBackTo={setLeaderboardBackTo} />;
      case 'leaderboard':
        return <Leaderboard navigate={navigate} username={currentUser} currentXp={gameState.xp} backTo={leaderboardBackTo} />;
      default:
        return <Dashboard navigate={navigate} gameState={gameState} onLogout={handleLogout} username={currentUser} onReset={resetGame} setLeaderboardBackTo={setLeaderboardBackTo} />;
    }
  };

  const activeScreen = currentScreen === 'url_detective' ? urlDetectiveBackTo : currentScreen;
  const isMap = activeScreen === 'schoolMap';
  const needsLandscape = !['login', 'dashboard', 'leaderboard', 'results'].includes(currentScreen);

  useEffect(() => {
    const metaViewport = document.querySelector('meta[name=viewport]');
    const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
    
    if (metaViewport) {
      if (needsLandscape && isMobile) {
        // Force desktop width on mobile to trigger native zoom out
        metaViewport.setAttribute('content', 'width=1100, viewport-fit=cover');
      } else {
        // Normal responsive width for dashboard/login or desktop
        metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0, viewport-fit=cover');
      }
    }
  }, [needsLandscape]);

  return (
    <div className={`screen-container ${needsLandscape ? 'require-landscape' : ''}`} style={{ position: 'relative', height: isMap ? '100dvh' : 'auto', overflow: isMap ? 'hidden' : 'visible' }}>
      {needsLandscape && (
        <div className="landscape-overlay">
          <div className="landscape-overlay-icon">📱</div>
          <h2 className="text-glow-neon" style={{marginTop: '20px', marginBottom: '10px'}}>Putar Perangkat Anda</h2>
          <p style={{fontSize: '1.1rem', maxWidth: '400px', lineHeight: '1.5'}}>
            Misi ini wajib dimainkan dalam mode Lanskap (Layar Miring) agar tampilan tidak berantakan dan pengalaman bermain maksimal.
          </p>
        </div>
      )}
      <div className="screen-content-wrapper" style={{ display: currentScreen === 'url_detective' ? 'none' : 'flex', flex: 1, width: '100%', flexDirection: 'column', overflow: isMap ? 'hidden' : 'visible', minHeight: 0 }}>
        {renderScreen()}
      </div>
      {currentScreen === 'url_detective' && (
        <div className="screen-content-wrapper" style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
          <UrlDetective navigate={navigate} backTo={urlDetectiveBackTo} />
        </div>
      )}
    </div>
  );
}

export default App;
