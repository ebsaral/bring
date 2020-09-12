# from base image node
FROM node:8.11-slim

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm install

COPY . .

CMD npm start