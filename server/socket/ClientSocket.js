class ClientSocket {
  constructor(socket, io, playerManager) {
    this.socket = socket;
    this.io = io;
    this.playerManager = playerManager;

    this.setupListeners();
  }

  setupListeners() {
    this.socket.on('join', (data) => this.handleJoin(data));
    this.socket.on('move', (data) => this.handleMove(data));
    this.socket.on('disconnect', () => this.handleDisconnect());
  }

  handleJoin(data) {
    if (!data.username) return;

    const player = this.playerManager.addPlayer(this.socket.id, data);
    this.socket.join('campus');
    this.socket.emit('playersList', this.playerManager.getAllPlayers());
    this.socket.to('campus').emit('playerJoined', player);
    
    console.log(`[Socket] Player joined: ${player.username} (${this.socket.id})`);
  }

  handleMove(data) {
    const updatedPlayer = this.playerManager.updatePlayer(this.socket.id, data);
    if (updatedPlayer) {
      this.socket.to('campus').emit('playerMoved', {
        id: updatedPlayer.id,
        x: updatedPlayer.x,
        y: updatedPlayer.y,
        direction: updatedPlayer.direction,
        isMoving: updatedPlayer.isMoving
      });
    }
  }

  handleDisconnect() {
    const username = this.playerManager.removePlayer(this.socket.id);
    if (username) {
      this.io.to('campus').emit('playerLeft', this.socket.id);
      console.log(`[Socket] Player disconnected: ${username} (${this.socket.id})`);
    }
  }
}

module.exports = ClientSocket;
