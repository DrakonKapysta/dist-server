const http = require('http');
const { Server } = require('socket.io');
const port = process.env.PORT || 3000;
const httpServer = http.createServer();
const workerSystemObject = require('./config');

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  },
});
const adminNamespace = io.of('/admin');

const registerConnectionHandler = require('./handlers/connectionHandler');
const store = require('./store');

const onConnection = (socket) => {
  console.log(`Client with socketId: ${socket.id} connected.`);
  registerConnectionHandler(io, socket);
  socket.emit('connection:info-object', workerSystemObject);
};

io.on('connection', onConnection);
adminNamespace.on('connection', async (socket) => {
  // const workers = await io.fetchSockets();
  // const workersInfo = [];
  // for (const worker of workers) {
  //   console.log(worker.id);
  // }
  socket.emit('admin:connections', store.getClients());
});
httpServer.listen(port);
