const store = require('../store');
module.exports = (io, socket) => {
  socket.on('disconnect', (reason) => {
    console.log(`Client with socketId: ${socket.id} disconnected`);
  });
  socket.on('connection:send-info', (payload) => {
    store.setPayload(socket.id, payload);
    console.log(store.getClients());
  });
};
