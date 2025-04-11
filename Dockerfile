# === Stage 1: Bygg applikationen ===
FROM node:18-alpine AS builder
WORKDIR /app

# Kopiera package-filer och installera
COPY package.json package-lock.json ./
RUN npm install

# Kopiera all källkod
COPY . .

# 1) Bygg TypeScript
RUN npm run build

# 2) Generera Prisma-klienten
RUN npx prisma generate

# === Stage 2: Skapa produktionsimage ===
FROM node:18-alpine
WORKDIR /app

COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/prisma /app/prisma
COPY package.json package-lock.json ./

COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

ENV PORT=3000
EXPOSE 3000

CMD ["/app/entrypoint.sh"]

