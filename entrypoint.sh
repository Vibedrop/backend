#!/bin/sh

# Detta entrypoint-script kör först Prisma-migreringar för att uppdatera databasen
# och startar sedan applikationen. Säkerställer DATABSE_URL env och att migreringen sker
# endast en gång i körmiljön.

echo "Kör databas-migreringar..."
npm run migrate   # Kör migreringsscriptet definierat i package.json

echo "Startar applikationen..."
exec npm start   # 'exec' ersätter processen med appen, vilket är bra för signalhantering
