# Dockerfile.base
FROM node:lts AS base
WORKDIR /app
COPY package.json .npmrc .eslintrc.json .eslintrc.json .eslintignore  ./
RUN npm i
