# Use the official Node.js image (same version as your local system)
FROM node:22
# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (including bcrypt)
RUN apt-get update && apt-get install -y python3 g++ make && \
    npm install

# Copy the rest of the app files
COPY . .

# Expose the port your backend uses
EXPOSE 4000

# Start the application
CMD ["node", "server.js"]
