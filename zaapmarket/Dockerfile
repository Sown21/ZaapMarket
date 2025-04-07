# Utiliser une version LTS stable de Node.js
FROM node:23.10-alpine

# Désactiver la télémétrie Next.js
ENV NEXT_TELEMETRY_DISABLED=1

# Configurer le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances avec cache
RUN npm install --legacy-peer-deps

# Copier le code source
COPY . .

# Build de l'application
RUN npm run build

# Exposer le port et démarrer l'app
EXPOSE 3000
CMD ["npm", "start"]
