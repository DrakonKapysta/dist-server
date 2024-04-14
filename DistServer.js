const http = require('http');
const { Server } = require('socket.io');
module.exports = class DistServer {
  io = null;
  constructor(port, oprions) {
    this.io = new Server(http.createServer().listen(port), oprions);
  }
};
