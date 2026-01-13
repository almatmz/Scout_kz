# Backend Dockerfile for Scout. kz
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Create uploads directory for video files
RUN mkdir -p uploads

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application source
COPY . . 

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

# Start the application
CMD ["node", "server.js"]