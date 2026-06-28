const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const http = require('http');
const SocketManager = require('./socket/SocketManager');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const socketManager = new SocketManager(server);

const dbPath = path.resolve(__dirname, 'cybergame.db');
const db = new sqlite3.Database(dbPath);

// Initialize DB
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      class_name TEXT,
      xp INTEGER DEFAULT 0,
      level TEXT DEFAULT 'Cyber Rookie',
      badges INTEGER DEFAULT 3,
      currentLevel INTEGER DEFAULT 1,
      awareness INTEGER DEFAULT 0,
      urlDetection INTEGER DEFAULT 0,
      passwordSecurity INTEGER DEFAULT 0,
      socialEngineering INTEGER DEFAULT 0,
      networkSecurity INTEGER DEFAULT 0,
      completedMissions TEXT DEFAULT '[]',
      mistakes TEXT DEFAULT '[]',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Seed initial mock players if empty
  db.get("SELECT count(*) as count FROM users", (err, row) => {
    if (row.count === 0) {
      const stmt = db.prepare("INSERT INTO users (username, class_name, xp) VALUES (?, ?, ?)");
      stmt.run('Budi_Cyber', '10A', 2800);
      stmt.run('Siti_Secure', '10B', 2450);
      stmt.run('Hacker_Noob', '11A', 1900);
      stmt.run('Agus_Defender', '11C', 1650);
      stmt.run('Roni_Admin', '12B', 1250);
      stmt.finalize();
    }
  });
});

// Login or Create User
app.post('/api/login', (req, res) => {
  try {
    const { username, className } = req.body;
    if (!username) return res.status(400).json({ error: 'Username required' });
    
    db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      
      if (user) {
        try {
          user.completedMissions = JSON.parse(user.completedMissions || '[]');
          user.mistakes = JSON.parse(user.mistakes || '[]');
        } catch (e) {
          user.completedMissions = [];
          user.mistakes = [];
        }
        res.json({ message: 'Login successful', user });
      } else {
        db.run("INSERT INTO users (username, class_name, xp) VALUES (?, ?, 0)", [username, className || ''], function(err) {
          if (err) return res.status(500).json({ error: 'Failed to create user' });
          
          db.get("SELECT * FROM users WHERE id = ?", [this.lastID], (err, newUser) => {
            if (err || !newUser) return res.status(500).json({ error: 'User created but failed to fetch' });
            newUser.completedMissions = [];
            newUser.mistakes = [];
            res.json({ message: 'User created', user: newUser });
          });
        });
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Save Progress
app.post('/api/save-progress', (req, res) => {
  try {
    const { username, xp, level, currentLevel, competencies, completedMissions, mistakes } = req.body;
    if (!username) return res.status(400).json({ error: 'Username required' });
    
    const query = `
      UPDATE users SET 
        xp = ?, level = ?, currentLevel = ?, 
        awareness = ?, urlDetection = ?, passwordSecurity = ?, socialEngineering = ?, networkSecurity = ?,
        completedMissions = ?, mistakes = ?
      WHERE username = ?
    `;
    
    const safeCompetencies = competencies || {};
    
    db.run(query, [
      xp || 0, level || 'Cyber Rookie', currentLevel || 1,
      safeCompetencies.awareness || 0, safeCompetencies.urlDetection || 0, safeCompetencies.passwordSecurity || 0, safeCompetencies.socialEngineering || 0, safeCompetencies.networkSecurity || 0,
      JSON.stringify(completedMissions || []), JSON.stringify(mistakes || []),
      username
    ], function(err) {
      if (err) return res.status(500).json({ error: 'Failed to save progress' });
      res.json({ message: 'Progress saved successfully' });
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Leaderboard
app.get('/api/leaderboard', (req, res) => {
  try {
    db.all("SELECT username, class_name, xp FROM users ORDER BY xp DESC", (err, rows) => {
      if (err) return res.status(500).json({ error: 'Failed to fetch leaderboard' });
      res.json(rows || []);
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get User Detail
app.get('/api/user/:username', (req, res) => {
  try {
    db.get("SELECT * FROM users WHERE username = ?", [req.params.username], (err, user) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      if (!user) return res.status(404).json({ error: 'User not found' });
      
      try {
        user.completedMissions = JSON.parse(user.completedMissions || '[]');
        user.mistakes = JSON.parse(user.mistakes || '[]');
      } catch (e) {
        user.completedMissions = [];
        user.mistakes = [];
      }
      res.json(user);
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server (HTTP + Socket.IO) running on http://localhost:${PORT}`);
});
