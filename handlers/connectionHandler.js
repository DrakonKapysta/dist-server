const calculateWeight = require('../functions/calculateWeight');
const loadBalancer = require('../LoadBalancerWrr');
const store = require('../store');
const weights = [5, 3, 2];

module.exports = (io, socket) => {
  socket.on('disconnect', (reason) => {
    store.removeClient(socket.id);
    io.of('/admin').emit('admin:removeConnection', socket.id);
  });
  socket.on('connection:send-info', (payload) => {
    payload.clientIp = socket.handshake.address;
    const cpusObj = payload.currentLoad.cpus;

    payload.currentLoad.cpus = cpusObj.map((cpu) => cpu.load);
    payload.requests = {
      totalRequestCount: 0,
      totalErrorRequests: 0,
      totalSuccessfulRequests: 0,
    };
    payload.socketId = socket.id;
    const weight = weights.shift();
    payload.weight = weight;
    payload.originalWeight = weight;
    payload.taskQueue = [];

    //const workerWeight = calculateWeight({ ...payload.cpu, memory: 2400 });
    //loadBalancer.setMaxWeight(workerWeight); for iwrr

    store.setPayload(socket.id, payload);
    //console.log(payload);
    loadBalancer.addWorker(store.getClientInfo(socket.id));
    //console.log('Client info : ' + store.getClientInfo(socket.id).weight);
    io.of('/admin').emit('admin:newConnection', {
      socketId: socket.id,
      ...payload,
    });
  });
};
