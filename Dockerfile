# Stage 1: Build the application
FROM node:18-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Run the application
FROM node:18-alpine
WORKDIR /app
COPY --from=base /app/dist /app/dist
COPY package.json package-lock.json ./
RUN npm install --production

# (Optional: if you need an entrypoint script, copy it here)
# COPY entrypoint.sh /usr/local/bin/entrypoint.sh
# RUN chmod +x /usr/local/bin/entrypoint.sh

ENV PORT=3000
EXPOSE 3000

# Use CMD so that you can override entrypoint if needed.
CMD ["node", "dist/index.js"]
ENTRYPOINT sh
