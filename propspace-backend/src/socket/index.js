// Wires up the real-time layer. Controllers emit events
// (property:new / property:updated / property:deleted) via req.app.get('io').
export const initSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Clients can scope updates to a city room if desired
    socket.on('join:city', (city) => socket.join(`city:${city}`));
    socket.on('leave:city', (city) => socket.leave(`city:${city}`));

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};
