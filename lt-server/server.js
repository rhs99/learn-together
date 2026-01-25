#!/usr/bin/env node

const { connectDB, startServer } = require('./src/index');
const Config = require('./src/config');

const dbUrl = Config.USE_REMOTE_DB
  ? Config.REMOTE_MONGODB_URI
  : Config.MONGODB_URI;
const dbName = 'lt-db';

connectDB(dbUrl, dbName)
  .then(() => startServer())
  .then(server => {
    console.log('Learn Together server started successfully');

    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received: closing server');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });
  })
  .catch(error => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
