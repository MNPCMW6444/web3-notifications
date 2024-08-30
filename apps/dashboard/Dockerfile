ARG DEP_HASH
FROM 654654441147.dkr.ecr.us-east-1.amazonaws.com/web3/base:$DEP_HASH as builder
WORKDIR /app
COPY package.json nx.json tsconfig.base.json ./
COPY apps/dashboard/ apps/dashboard/
RUN npm run build:dashboard

FROM node:lts-slim
WORKDIR /app
COPY --from=builder /app .
CMD ["node", "dist/apps/dashboard/server.js"]
EXPOSE 3500

