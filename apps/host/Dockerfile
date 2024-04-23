ARG DEP_HASH
FROM 767397939121.dkr.ecr.us-east-1.amazonaws.com/base:$DEP_HASH as builder
WORKDIR /app
COPY package.json nx.json tsconfig.base.json ./
COPY libs/shared libs/shared
COPY libs/shared-react libs/shared-react
COPY apps/host/ apps/host/
RUN npm run build:host

FROM node:lts-slim
WORKDIR /app
COPY --from=builder /app .
CMD ["node", "dist/apps/host/server.js"]
EXPOSE 4200

