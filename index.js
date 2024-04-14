const http = require('http');
const { Server } = require('socket.io');
const execute = require('./functions/execute');
const port = process.env.PORT || 3000;
const httpServer = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'response from server' }));
});
const workerSystemObject = require('./config');
const loadBalancer = require('./LoadBalancerWrr');
// loadBalancer.workers.push(
//   { weight: 5, originalWeight: 5, taskQueue: [] },
//   { weight: 3, originalWeight: 3, taskQueue: [] },
//   { weight: 1, originalWeight: 1, taskQueue: [] },
// );
for (let i = 0; i < 300; i++) {
  loadBalancer.addRequest('Task ' + i);
}

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  },
});
const adminNamespace = io.of('/admin');
loadBalancer.setAdminNamespace(adminNamespace);
const registerConnectionHandler = require('./handlers/connectionHandler');
const store = require('./store');

const onConnection = (socket) => {
  console.log(`Client with socketId: ${socket.id} connected.`);
  registerConnectionHandler(io, socket);
  loadBalancer.addSocket(socket);
  socket.emit('connection:info-object', workerSystemObject);
};
setTimeout(() => {
  execute(loadBalancer);
}, 10000);

io.on('connection', onConnection);
adminNamespace.on('connection', async (socket) => {
  socket.emit('admin:connections', store.getClients());
});
httpServer.listen(port);
