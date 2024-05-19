const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const port = process.env.PORT || 3000;
const execute = require('./functions/execute');

const workerSystemObject = require('./config');
const loadBalancer = require('./LoadBalancerWRR');

const Router = require('./Router');
const loggingRouter = require('./routers/loggingRouter');
const requestRouter = require('./routers/requestRouter');
const systemInfoRouter = require('./routers/systemInfoRouter');
const taskRouter = require('./routers/taskRouter');

const MongoService = require('./services/mongoService');
const StatisticService = require('./services/statisticService');
const LoggerService = require('./services/loggerService');

const consoleLoger = require('./functions/consoleLoger');

const mongoService = new MongoService(
  'mongodb+srv://dest-server:wT8wFdXnq6WKycDA@dest-server.kwnevwd.mongodb.net/?retryWrites=true&w=majority&appName=dest-server',
);

const loggerService = new LoggerService(mongoService.getMongoClient());
const statisticService = new StatisticService(
  mongoService.getMongoClient(),
  'dest-server',
  'statistic',
);

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

const httpServer = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
});
httpServer.on('request', (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    res.end();
    return;
  }
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

for (let i = 0; i < 100; i++) {
  loadBalancer.addSingleRequest({
    A: [
      [5, 2, -1],
      [-4, 7, 3],
      [2, -2, 4],
    ],
    b: [12, 24, 9],
    method: 'jacobi',
    tolerance: 0.01,
    maxIterations: 100,
  });
}

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  },
});

const router = new Router();

router.registerRouter('logs', loggingRouter(loggerService));
router.registerRouter('requests', requestRouter());
router.registerRouter('system', systemInfoRouter(io));
router.registerRouter('task', taskRouter());

const adminNamespace = io.of('/admin');
loadBalancer.setAdminNamespace(adminNamespace);
const registerConnectionHandler = require('./handlers/connectionHandler');
const store = require('./store');

loadBalancer.startSendingRequestInfo(); // можливо потрібно перейти на http при спілкуванні адміна та сервера...

setTimeout(() => {
  execute(loadBalancer);
}, 10000);

setInterval(async () => {
  if (store.tempLogs.length !== 0) {
    try {
      await loggerService.addItems('dest-server', 'logs', store.tempLogs);
      store.tempLogs = [];
    } catch (error) {
      console.log(error);
    }
  }
}, 10000);

const onConnection = (socket) => {
  console.log(`Client with socketId: ${socket.id} connected.`);
  registerConnectionHandler(io, socket, loggerService);
  loadBalancer.addSocket(socket);
  socket.emit('connection:info-object', workerSystemObject);
};

io.on('connection', onConnection);
adminNamespace.on('connection', async (socket) => {
  socket.emit('admin:connections', store.getClients());
});
process.on('SIGINT', async () => {
  await mongoService.closeConnection();
  process.exit(0);
});
httpServer.listen(port);
