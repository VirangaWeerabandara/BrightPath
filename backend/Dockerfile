# Force rebuild: v2
FROM node:18-alpine

WORKDIR /app

# Copy package files and install production deps
COPY package*.json ./
RUN npm ci --only=production

# Copy app source - this layer changes when code changes
COPY . .

# Environment variables will be supplied through docker-compose
ENV PORT=4000
ENV NODE_ENV=production

# Expose application port
EXPOSE 4000

# Start the application
CMD ["node", "server.js"]