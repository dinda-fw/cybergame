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
import BossBattle from './screens/features/BossBattle';
import ResultsDashboard from './screens/ResultsDashboard';
import Login from './screens/Login';
import Leaderboard from './screens/Leaderboard';

const DEFAULT_GAME_STATE = {
  xp: 1500,
  level: 'Cyber Rookie',
  badges: 3,
  currentLevel: 1, // 1: Kantin, 2: Aula, 3: RuangGuru, 4: Lab, 5: Server, 6: Boss
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

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [gameState, setGameState] = useState(DEFAULT_GAME_STATE);
  const [leaderboardBackTo, setLeaderboardBackTo] = useState('dashboard');
  const [urlDetectiveBackTo, setUrlDetectiveBackTo] = useState('dashboard');

  const updateLeaderboard = (username, xp) => {
    try {
      const boardStr = localStorage.getItem('cyberLeaderboard');
      let board = boardStr ? JSON.parse(boardStr) : [];
      
      const existingIdx = board.findIndex(item => item.username.toLowerCase() === username.toLowerCase());
      if (existingIdx !== -1) {
        board[existingIdx].xp = Math.max(board[existingIdx].xp, xp);
      } else {
        board.push({ username, xp });
      }
      
      board.sort((a, b) => b.xp - a.xp);
      localStorage.setItem('cyberLeaderboard', JSON.stringify(board));
    } catch (e) {
      console.error(e);
    }
  };

  // Initialize Auth State
  useEffect(() => {
    const savedUser = localStorage.getItem('cyberShieldUser');
    if (savedUser) {
      setCurrentUser(savedUser);
      const savedState = localStorage.getItem(`cyberShieldGameState_${savedUser}`);
      if (savedState) {
        setGameState(JSON.parse(savedState));
      }
    }
  }, []);

  // Save Game State when it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`cyberShieldGameState_${currentUser}`, JSON.stringify(gameState));
    }
  }, [gameState, currentUser]);

  const handleLogin = (username) => {
    setCurrentUser(username);
    localStorage.setItem('cyberShieldUser', username);
    
    const savedState = localStorage.getItem(`cyberShieldGameState_${username}`);
    let finalState;
    if (savedState) {
      finalState = JSON.parse(savedState);
      setGameState(finalState);
    } else {
      finalState = DEFAULT_GAME_STATE;
      setGameState(DEFAULT_GAME_STATE);
    }
    
    updateLeaderboard(username, finalState.xp);
    setCurrentScreen('dashboard');
    return true;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('cyberShieldUser');
    setGameState(DEFAULT_GAME_STATE);
  };

  const navigate = (screen, options = {}) => {
    if (options.backTo && screen === 'url_detective') {
      setUrlDetectiveBackTo(options.backTo);
    } else if (screen === 'url_detective') {
      setUrlDetectiveBackTo('dashboard');
    }
    setCurrentScreen(screen);
  };

  const addXP = (amount) => {
    setGameState(prev => {
      const newXp = prev.xp + amount;
      updateLeaderboard(currentUser, newXp);
      return {
        ...prev,
        xp: newXp,
        level: newXp > 2000 ? 'Cyber Defender' : prev.level
      };
    });
  };

  const completeMission = (missionId, xpEarned) => {
    if (!gameState.completedMissions.includes(missionId)) {
      setGameState(prev => {
        const newComps = { ...prev.competencies };
        if (missionId === 'mission_ruangguru') newComps.awareness = Math.min(100, newComps.awareness + 50);
        if (missionId === 'mission_labkomputer') newComps.awareness = Math.min(100, newComps.awareness + 50);
        if (missionId === 'mission_kantin') newComps.networkSecurity = Math.min(100, newComps.networkSecurity + 50);
        if (missionId === 'mission_aula') newComps.socialEngineering = Math.min(100, newComps.socialEngineering + 100);
        if (missionId === 'mission_serverroom') newComps.urlDetection = Math.min(100, newComps.urlDetection + 100);
        if (missionId === 'boss_battle') {
          newComps.passwordSecurity = Math.min(100, newComps.passwordSecurity + 100);
          newComps.networkSecurity = Math.min(100, newComps.networkSecurity + 50);
        }

        const newXp = prev.xp + xpEarned;
        updateLeaderboard(currentUser, newXp);

        return {
          ...prev,
          competencies: newComps,
          completedMissions: [...prev.completedMissions, missionId],
          xp: newXp,
          currentLevel: prev.currentLevel + 1
        };
      });
    }
  };

  const recordMistake = (location, explanation) => {
    setGameState(prev => {
      const currentMistakes = prev.mistakes || [];
      // Prevent exact duplicate mistakes to avoid spamming the results screen
      if (!currentMistakes.find(m => m.explanation === explanation)) {
        
        // Deduct competencies slightly if they make mistakes
        const newComps = { ...prev.competencies };
        if (location.includes("Ruang Guru") || location.includes("Lab Komputer")) newComps.awareness = Math.max(0, newComps.awareness - 20);
        if (location.includes("Kantin")) newComps.networkSecurity = Math.max(0, newComps.networkSecurity - 20);
        if (location.includes("Aula")) newComps.socialEngineering = Math.max(0, newComps.socialEngineering - 20);
        if (location.includes("Server Room")) newComps.urlDetection = Math.max(0, newComps.urlDetection - 20);
        if (location.includes("Boss Battle")) {
          newComps.passwordSecurity = Math.max(0, newComps.passwordSecurity - 10);
          newComps.networkSecurity = Math.max(0, newComps.networkSecurity - 10);
        }

        return {
          ...prev,
          competencies: newComps,
          mistakes: [...currentMistakes, { location, explanation }]
        };
      }
      return prev;
    });
  };

  const resetGame = () => {
    setGameState(prev => ({
      ...prev,
      currentLevel: 1,
      completedMissions: [],
      xp: 1500,
      mistakes: [],
      competencies: {
        awareness: 0,
        urlDetection: 0,
        passwordSecurity: 0,
        socialEngineering: 0,
        networkSecurity: 0
      }
    }));
    setCurrentScreen('dashboard');
  };

  // Screen router
  const renderScreen = () => {
    if (!currentUser) {
      return <Login onLogin={handleLogin} />;
    }

    switch (currentScreen) {
      case 'dashboard':
        return <Dashboard navigate={navigate} gameState={gameState} onLogout={handleLogout} username={currentUser} onReset={resetGame} setLeaderboardBackTo={setLeaderboardBackTo} />;
      case 'schoolMap':
        return <SchoolMap navigate={navigate} gameState={gameState} />;
      case 'mission_ruangguru':
        return <RuangGuru navigate={navigate} completeMission={completeMission} addXP={addXP} recordMistake={recordMistake} username={currentUser} />;
      case 'mission_labkomputer':
        return <LabKomputer navigate={navigate} completeMission={completeMission} addXP={addXP} recordMistake={recordMistake} username={currentUser} />;
      case 'mission_kantin':
        return <Kantin navigate={navigate} completeMission={completeMission} addXP={addXP} recordMistake={recordMistake} username={currentUser} />;
      case 'mission_aula':
        return <Aula navigate={navigate} completeMission={completeMission} addXP={addXP} recordMistake={recordMistake} username={currentUser} />;
      case 'mission_serverroom':
        return <ServerRoom navigate={navigate} completeMission={completeMission} addXP={addXP} recordMistake={recordMistake} username={currentUser} />;
      case 'url_detective':
        return <UrlDetective navigate={navigate} backTo={urlDetectiveBackTo} />;
      case 'cyber_scan':
        return <CyberScanChallenge navigate={navigate} addXP={addXP} />;
      case 'boss_battle':
        return <BossBattle navigate={navigate} completeMission={completeMission} addXP={addXP} recordMistake={recordMistake} />;
      case 'results':
        return <ResultsDashboard navigate={navigate} gameState={gameState} resetGame={resetGame} setLeaderboardBackTo={setLeaderboardBackTo} />;
      case 'leaderboard':
        return <Leaderboard navigate={navigate} username={currentUser} currentXp={gameState.xp} backTo={leaderboardBackTo} />;
      default:
        return <Dashboard navigate={navigate} gameState={gameState} onLogout={handleLogout} username={currentUser} onReset={resetGame} setLeaderboardBackTo={setLeaderboardBackTo} />;
    }
  };

  return (
    <div className="screen-container">
      {renderScreen()}
    </div>
  );
}

export default App;
