# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
COPY vite.config.ts ./
COPY drizzle.config.ts ./
COPY tailwind.config.ts ./
COPY postcss.config.js ./

# Install dependencies
RUN npm ci

# Copy source code
COPY client ./client
COPY server ./server
COPY shared ./shared
COPY scripts ./scripts

# Build application
RUN npm run build

# Runtime stage
FROM node:20-alpine
WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy package files for production dependencies
COPY package*.json ./

# Install all dependencies (needed for drizzle-kit)
RUN npm ci

# Copy built application from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=builder /app/shared ./shared

# Expose port
EXPOSE 5000

# Use dumb-init to handle signals properly
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

# Start application (skip migration for now)
CMD ["node", "dist/index.js"]
