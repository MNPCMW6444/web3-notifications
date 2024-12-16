# Stage 1: Builder
ARG DEP_HASH
FROM 654654441147.dkr.ecr.us-east-1.amazonaws.com/web3/base:$DEP_HASH as builder
WORKDIR /app
COPY package.json nx.json tsconfig.base.json ./
COPY apps/server/ apps/server/
RUN npm install
RUN npm run build:server

# Stage 2: Final image
FROM node:lts-slim

# Install necessary dependencies for Puppeteer and Chrome
RUN apt-get update && apt-get install -y \
    wget \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libgtk-3-0 \
    libnss3 \
    libdrm2 \
    libx11-xcb1 \
    libx11-6 \
    libxext6 \
    libxfixes3 \
    libxtst6 \
    libxrender1 \
    libxcb1 \
    libxss1 \
    libdbus-glib-1-2 \
    && rm -rf /var/lib/apt/lists/*

# Install Chrome (You can use Chromium instead if you prefer)
RUN wget -qO- https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb \
    && apt-get install -y ./google-chrome-stable_current_amd64.deb \
    && rm google-chrome-stable_current_amd64.deb

# Set environment variables to run Puppeteer in Docker
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome

# Copy built server files from the builder stage
WORKDIR /app
COPY --from=builder /app .

# Expose port and set command
EXPOSE 3450
CMD ["node", "dist/apps/server/index.mjs"]
