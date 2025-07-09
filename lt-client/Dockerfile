FROM node:22.17-slim

# Install dependencies for file watching
RUN apt-get update && apt-get install -y \
    inotify-tools \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose the development port
EXPOSE 3000

# Start the development server
CMD ["npm", "run", "start"]