# Stage 1: Build the Vite app
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy project files
COPY . .

# Build production version
RUN npm run build

# Stage 2: Run with a Node.js static server
FROM node:18-alpine

WORKDIR /app

# Install "serve" globally to serve static files
RUN npm install -g serve

# Copy built app from builder
COPY --from=builder /app/dist ./dist

# Expose port 5000
EXPOSE 5000

# Run the static server on port 5000
CMD ["serve", "-s", "dist", "-l", "5000"]
