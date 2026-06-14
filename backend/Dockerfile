FROM oven/bun:alpine AS builder

WORKDIR /usr/src/app

# Copy package files and lockfile (lockfile is required for reproducible installs)
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

# Install production dependencies in a separate directory
WORKDIR /usr/src/prod-app
COPY package.json bun.lock ./
RUN bun install --production --frozen-lockfile

# Runner stage stays on Node.js alpine for production stability
FROM node:20-alpine

WORKDIR /usr/src/app
COPY package.json ./
COPY --from=builder /usr/src/prod-app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"]
