# Stage 1: Build the application
FROM node:18-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

CMD ["node", "dist/index.js"]

# Stage 2: Run the application
FROM node:18-alpine
WORKDIR /app
COPY --from=base /app/dist /app/dist
COPY package.json package-lock.json ./
RUN npm install --production

ENV PORT=3000
EXPOSE 3000

# Simple cmd to run app
CMD ["node", "dist/index.js"]
# Comment to trigger stuff
