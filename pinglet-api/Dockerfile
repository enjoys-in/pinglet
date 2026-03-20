# Base image
FROM oven/bun:1-alpine AS builder

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package.json bun.lockb ./

# Copy scripts and patches needed by postinstall
COPY scripts ./scripts
COPY patches ./patches

# Install all dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN bun run build

# Production image
FROM oven/bun:1-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package.json bun.lockb ./

# Copy scripts and patches needed by postinstall
COPY scripts ./scripts
COPY patches ./patches

# Install only production dependencies
RUN bun install --frozen-lockfile --production

# Copy built assets from builder stage
COPY --from=builder /usr/src/app/build ./build
# Copy public assets for static file serving
COPY --from=builder /usr/src/app/public ./public
# Copy tsconfig.json because it is required by tsconfig-paths in main.js
COPY --from=builder /usr/src/app/tsconfig.json ./

# Expose the API port
EXPOSE 8888

# Start the application using Bun runtime directly
CMD ["bun", "run", "./build/main.js"]
