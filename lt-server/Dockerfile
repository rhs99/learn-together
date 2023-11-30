FROM node:20.10-slim
RUN npm install -g nodemon
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "run", "dev"]
