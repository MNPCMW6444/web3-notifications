ARG DEP_HASH
FROM 654654441147.dkr.ecr.us-east-1.amazonaws.com/web3/base:$DEP_HASH as builder
WORKDIR /app
COPY package.json nx.json tsconfig.base.json ./
COPY apps/aave/ apps/aave/
RUN npx nx build aave

FROM node:lts
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder app/apps/aave/public ./public
# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next
# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs app/apps/aave/.next/standalone/apps/aave ./
COPY --from=builder --chown=nextjs:nodejs app/apps/aave/.next/standalone/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs app/apps/aave/.next/static ./.next/static
USER nextjs
EXPOSE 3001
ENV PORT 3001
# server.js is created by next build from the standalone output
CMD HOSTNAME="0.0.0.0" node server.js
