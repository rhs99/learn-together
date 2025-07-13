#!/usr/bin/env node

/**
 * Production server startup script
 */
const { connectDB, startServer } = require('./src/index');

// Start server and connect to database
connectDB()
  .then(() => startServer())
  .then(server => {
    console.log('Learn Together server started successfully');
    
    // Handle graceful shutdown
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
