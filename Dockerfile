# Dockerfile.base
FROM node:lts as base
WORKDIR /app
COPY package.json .npmrc ./
RUN npm i
