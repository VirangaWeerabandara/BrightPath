FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy the rest of the application
COPY . .

# Environment variables will be supplied through docker-compose
ENV PORT=4000
ENV NODE_ENV=production

# Expose application port
EXPOSE 4000

# Start the application
CMD ["node", "server.js"]