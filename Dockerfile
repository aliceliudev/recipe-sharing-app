# Multi-stage build for React frontend
FROM node:20-alpine AS build

# Set build argument for backend URL
ARG VITE_BACKEND_URL="https://fictional-space-garbanzo-p66j5w76p7ghrq7v-3001.app.github.dev/api/v1"

# Set environment variable for Vite build
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}

# Debug: Print the backend URL being used
RUN echo "Building frontend with VITE_BACKEND_URL=${VITE_BACKEND_URL}"

# Install dependencies needed for native modules
RUN apk add --no-cache python3 make g++

# Set working directory
WORKDIR /build

# Copy package files
COPY package*.json ./

# Install dependencies (including dev dependencies for build)
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage with nginx
FROM nginx:alpine AS final

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built application
COPY --from=build /build/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
