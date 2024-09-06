ARG DEP_HASH
FROM 654654441147.dkr.ecr.us-east-1.amazonaws.com/web3/base:$DEP_HASH as builder
WORKDIR /app
COPY package.json nx.json tsconfig.base.json ./
COPY apps/aave/ apps/aave/
RUN npx nx build aave

FROM node:lts
WORKDIR /app
COPY --from=builder /app .
CMD ["npm", "start"]
EXPOSE 3001

