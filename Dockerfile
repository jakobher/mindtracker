FROM node:18-alpine

WORKDIR /usr/src/app

# Copy package.json and package-lock.json first to use Docker-cache
COPY package*.json ./

# Install dependencys
RUN npm ci --only=production

# Copy the rest of the application
COPY . .

# Expose port
EXPOSE 3000

# Run the application
CMD ["node", "src/server.js"]