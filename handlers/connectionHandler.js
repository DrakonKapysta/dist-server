const store = require('../store');

module.exports = (io, socket) => {
  socket.on('disconnect', (reason) => {
    store.removeClient(socket.id);
    io.of('/admin').emit('admin:removeConnection', socket.id);
  });
  socket.on('connection:send-info', (payload) => {
    payload.clientIp = socket.handshake.address;
    const cpusObj = payload.currentLoad.cpus;
    payload.currentLoad.cpus = cpusObj.map((cpu) => cpu.load);
    store.setPayload(socket.id, payload);
    console.log(payload);
    io.of('/admin').emit('admin:newConnection', {
      socketId: socket.id,
      ...payload,
    });
  });
};
