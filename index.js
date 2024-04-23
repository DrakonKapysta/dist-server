const http = require('http');
const { Server } = require('socket.io');

const port = process.env.PORT || 3000;
const execute = require('./functions/execute');

const workerSystemObject = require('./config');
const loadBalancer = require('./LoadBalancerWrr');

const Router = require('./Router');
const loggingRouter = require('./routers/loggingRouter');

const MongoService = require('./services/mongoService');

const db = new MongoService(
  'mongodb+srv://dest-server:wT8wFdXnq6WKycDA@dest-server.kwnevwd.mongodb.net/?retryWrites=true&w=majority&appName=dest-server',
);

const router = new Router();

router.registerRouter('logs', loggingRouter(db));

const bodyParserMiddleware = require('./middlewares/bodyParserMiddleware');
const loggerMiddleware = require('./middlewares/loggerMiddleware');
const jsonParserMiddleware = require('./middlewares/jsonParser');
const urlParserMiddleware = require('./middlewares/urlParserMiddleware');

const middlewares = [
  bodyParserMiddleware,
  loggerMiddleware,
  jsonParserMiddleware,
  urlParserMiddleware,
];

const httpServer = http.createServer();
httpServer.on('request', (req, res) => {
  let middlewareIndex = 0;
  function runMiddleware() {
    if (middlewareIndex < middlewares.length) {
      middlewares[middlewareIndex](req, res, () => {
        middlewareIndex++;
        runMiddleware();
      });
    } else {
      router.startRouting(req, res);
    }
  }
  runMiddleware();
});

// loadBalancer.workers.push(
//   { weight: 5, originalWeight: 5, taskQueue: [] },
//   { weight: 3, originalWeight: 3, taskQueue: [] },
//   { weight: 1, originalWeight: 1, taskQueue: [] },
// );

for (let i = 0; i < 5000; i++) {
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
  registerConnectionHandler(io, socket, db);
  loadBalancer.addSocket(socket);
  socket.emit('connection:info-object', workerSystemObject);
};
loadBalancer.startSendingRequestInfo(); // можливо потрібно перейти на http при спілкуванні адміна та сервера...

setTimeout(() => {
  execute(loadBalancer);
}, 10000);

setInterval(async () => {
  if (store.tempLogs.length !== 0) {
    try {
      await db.addItems('dest-server', 'logs', store.tempLogs);
      store.tempLogs = [];
    } catch (error) {
      console.log(error);
    }
  }
}, 10000);

io.on('connection', onConnection);
adminNamespace.on('connection', async (socket) => {
  socket.emit('admin:connections', store.getClients());
});
process.on('SIGINT', async () => {
  await db.closeConnection();
  process.exit(0);
});
httpServer.listen(port);
