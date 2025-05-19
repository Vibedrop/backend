#!/bin/sh

# Väntar max 60 sekunder på att databasen ska svara
echo "Väntar på databas..."
MAX_RETRIES=12
RETRIES=0

until nc -z -v -w5 vibedrop-infra-db 5432
do
  echo "Databasen inte redo än – väntar 5 sekunder..."
  sleep 5
  RETRIES=$((RETRIES+1))
  if [ "$RETRIES" -ge "$MAX_RETRIES" ]; then
    echo "Timeout: Kunde inte nå databasen inom 60 sekunder. Avbryter."
    exit 1
  fi
done

echo "Databasen är redo!"

echo "DEBUG: POSTGRES_PASSWORD=$POSTGRES_PASSWORD"
echo "DEBUG: DATABASE_URL=$DATABASE_URL"

# Kör migrering – icke-blockerande och failar mjukt
echo "Försöker köra 'prisma migrate deploy'..."
npx prisma migrate deploy || echo "Migrering misslyckades, men applikationen startar ändå."

# Starta applikationen
echo "Startar applikationen..."
exec npm start

