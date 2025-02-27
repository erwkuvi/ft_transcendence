#FROM node:18-alpine AS builder
#
## Set working directory in the container
#WORKDIR /app
#
## Copy package.json and install dependencies
#COPY package.json package-lock.json ./
#RUN npm install
#
## Copy all files and build the project
#COPY . .
#RUN npm run build
#
## --- Second stage: Nginx for serving the built files ---
#FROM nginx:alpine
#
## Copy built React files to Nginx public folder
#COPY --from=builder /app/build /usr/share/nginx/html
#
## Expose port 80
#EXPOSE 80
#
## Start Nginx
#CMD ["nginx", "-g", "daemon off;"]

# --- First stage: Build React App ---
FROM node:20-alpine AS builder

# Set working directory in the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install --omit=dev


# Copy all files and build the project
COPY . .
RUN npm run build

# --- Second stage: Use Nginx for serving static files ---
FROM nginx:1.23.1-alpine

# Set non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

RUN mkdir -p /var/cache/nginx/client_temp && \
    chown -R appuser:appgroup /var/cache/nginx
# Copy built React files to Nginx public folder
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
# Expose port 80
EXPOSE 80

# Use non-root user
USER appuser

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]





