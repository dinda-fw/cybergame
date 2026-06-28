class PlayerManager {
  constructor() {
    this.players = {}; // { socketId: { id, username, x, y, direction, isMoving, ... } }
  }

  addPlayer(socketId, playerData) {
    // Generate a random spawn offset around the school gate
    const offsetX = Math.floor(Math.random() * 100) - 50;
    const offsetY = Math.floor(Math.random() * 100) - 50;

    const player = {
      id: socketId,
      userId: playerData.userId,
      username: playerData.username,
      x: 1600 + offsetX,
      y: 1580 + offsetY,
      direction: 'down',
      isMoving: false
    };

    this.players[socketId] = player;
    return player;
  }

  removePlayer(socketId) {
    if (this.players[socketId]) {
      const username = this.players[socketId].username;
      delete this.players[socketId];
      return username;
    }
    return null;
  }

  updatePlayer(socketId, moveData) {
    const player = this.players[socketId];
    if (!player) return null;

    if (typeof moveData.x === 'number' && !isNaN(moveData.x) && moveData.x >= 0 && moveData.x <= 3200) {
      player.x = moveData.x;
    }
    if (typeof moveData.y === 'number' && !isNaN(moveData.y) && moveData.y >= 0 && moveData.y <= 2400) {
      player.y = moveData.y;
    }
    if (['up', 'down', 'left', 'right'].includes(moveData.direction)) {
      player.direction = moveData.direction;
    }
    
    player.isMoving = !!moveData.isMoving;

    return player;
  }

  getAllPlayers() {
    return Object.values(this.players);
  }
}

module.exports = PlayerManager;
