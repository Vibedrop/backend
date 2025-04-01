# Stage 1: Build the application
FROM node:18-alpine AS base

# Set the working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the TypeScript code
RUN npm run build

# Stage 2: Run the application
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy the compiled files from the build stage
COPY --from=base /app/dist /app/dist
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm install --production

# Copy the entrypoint script
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Use the entrypoint script
ENTRYPOINT ["sh", "/usr/local/bin/entrypoint.sh"]
