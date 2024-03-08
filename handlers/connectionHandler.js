const store = require('../store');
module.exports = (io, socket) => {
  socket.on('disconnect', (reason) => {
    store.removeClient(socket.id);
    io.of('/admin').emit('admin:removeConnection', socket.id);
  });
  socket.on('connection:send-info', (payload) => {
    payload.clientIp = socket.handshake.address;
    store.setPayload(socket.id, payload);
    io.of('/admin').emit('admin:newConnection', {
      socketId: socket.id,
      ...payload,
    });
  });
};
