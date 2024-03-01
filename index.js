const http = require('http');
const { Server } = require('socket.io');

const httpServer = http.createServer();
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  },
});
const adminNamespace = io.of('/admin');

const registerConnectionHandler = require('./handlers/connectionHandler');

const onConnection = (socket) => {
  console.log(`Client with socketId: ${socket.id} connected.`);
  registerConnectionHandler(io, socket);
};

io.on('connection', onConnection);
io.httpServer.listen(process.env.PORT || 8080);
