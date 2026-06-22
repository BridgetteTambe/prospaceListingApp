import 'dotenv/config';
import http from 'http';
import { Server } from 'socket.io';

import app from './src/app.js';
import connectDB from './src/config/db.js';
import { initSocket } from './src/socket/index.js';

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();

  const server = http.createServer(app);

  const io = new Server(server, {
    cors: { origin: process.env.CLIENT_URL || '*' },
  });

  // Make io available to controllers via req.app.get('io')
  app.set('io', io);
  initSocket(io);

  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

start();
