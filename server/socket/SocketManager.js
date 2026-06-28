const { Server } = require('socket.io');
const PlayerManager = require('./PlayerManager');
const ClientSocket = require('./ClientSocket');

class SocketManager {
  constructor(httpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });
    
    this.playerManager = new PlayerManager();
    this.setupIO();
  }

  setupIO() {
    this.io.on('connection', (socket) => {
      console.log(`[Socket] New connection: ${socket.id}`);
      new ClientSocket(socket, this.io, this.playerManager);
    });
  }
}

module.exports = SocketManager;
