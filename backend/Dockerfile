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

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Expose application port
EXPOSE 4000

# Start the application
CMD ["node", "server.js"]