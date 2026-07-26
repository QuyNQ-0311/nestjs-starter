# Build stage
FROM node:24-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma.config.ts ./
COPY prisma ./prisma

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Generate Prisma client (DATABASE_URL is only validated, not connected to, by `prisma generate`)
ENV DATABASE_URL="postgresql://user:password@localhost:5432/db"
RUN npm run db:generate

# Build application
RUN npm run build

# Production stage
FROM node:24-alpine AS production

WORKDIR /app

# Install production dependencies only
COPY package*.json ./
COPY prisma.config.ts ./
COPY prisma ./prisma

RUN npm ci --omit=dev --legacy-peer-deps && \
    npm cache clean --force

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

USER nestjs

EXPOSE 3000

CMD ["node", "dist/main.js"]

