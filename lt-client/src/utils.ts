const Util = {
  CONSTANTS: {
    SERVER_URL: import.meta.env.VITE_SERVER_URL || 'http://localhost:5000',
    WEBSOCKET_URL: import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:5000',
    CLIENT_URL: import.meta.env.VITE_CLIENT_URL || 'http://localhost:3000',
  },
};

export default Util;
