const calculateWeight = require('../functions/calculateWeight');
const loadBalancer = require('../LoadBalancerWRR');
const store = require('../store');
const path = require('path');
const weights = [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]; // замінити на динамічні потім.

module.exports = (io, socket, db) => {
  socket.on('disconnect', (reason) => {
    store.removeClient(socket.id);
    io.of('/admin').emit('admin:removeConnection', socket.id);
    loadBalancer.removeWorker(socket.id);
    console.log(socket.id + ' disconnected');
  });
  socket.on('connection:send-info', (payload) => {
    payload.clientIp = socket.handshake.address;
    const cpusObj = payload.currentLoad.cpus;
    payload.cpu.speed = payload.cpu.speed + ' GHz';
    const newMemLayout = {};
    payload.memLayout.forEach((clockObj, index) => {
      newMemLayout[`clockSpeed${index + 1}`] = clockObj.clockSpeed + ' MHz';
    });
    payload.mem.total = (payload.mem.total / 1000000000).toFixed(2) + ' GB';
    payload.mem.free = (payload.mem.free / 1000000000).toFixed(2) + ' GB';
    payload.mem.used = (payload.mem.used / 1000000000).toFixed(2) + ' GB';
    payload.mem = { ...payload.mem, ...newMemLayout };

    payload.currentLoad.cpus = cpusObj.map((cpu) => cpu.load);
    console.log(payload);
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
    store.addLog(
      'New connection - Worker with id: ' +
        socket.id +
        ' connected to the server.',
    );
    store.addNewConnectionToStat();
    io.of('/admin').emit('admin:newConnection', {
      socketId: socket.id,
      ...payload,
    });
  });
};
