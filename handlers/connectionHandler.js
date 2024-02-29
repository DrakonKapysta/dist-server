module.exports = (io, socket) => {
  socket.on('disconnect', (reason) => {
    console.log(`Client with socketId: ${socket.id} disconnected`);
  });
};
