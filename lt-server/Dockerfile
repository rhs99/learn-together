FROM node:22.17-slim
RUN npm install -g nodemon
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .

# Set environment variable for tests in Docker
ENV DOCKER_ENV=true

EXPOSE 5000
CMD ["npm", "run", "dev"]
