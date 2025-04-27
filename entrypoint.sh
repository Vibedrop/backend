#!/bin/sh

# Vänta tills databasen är redo
echo "Väntar på databas..."
until nc -z -v -w30 vibedrop-infra-db 5432
do
  echo "Databasen inte redo än - väntar 5 sekunder..."
  sleep 5
done

echo "Databasen är redo!"

# Kör databas-migreringar
echo "Kör databas-migreringar..."
npm run migrate

# Generera Prisma-klienten
echo "Genererar Prisma-klient..."
npx prisma generate

# Starta applikationen
echo "Startar applikationen..."
exec npm start
