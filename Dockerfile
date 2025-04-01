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

# Install PM2 to manage the Node process
RUN npm install -g pm2

# Set environment variables
ENV PORT=3000

# Expose the port that the app uses
EXPOSE 3000

# Run the application using PM2
CMD ["pm2-runtime", "dist/index.js"]
