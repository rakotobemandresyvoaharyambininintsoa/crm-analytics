FROM node:22-bookworm

# Créer un utilisateur non-root dédié à l'application
RUN groupadd -r appgroup && useradd -r -g appgroup appuser

WORKDIR /app

# Copier uniquement les manifests d'abord (meilleur cache Docker)
COPY package.json package-lock.json ./

# Installer avec les versions exactes du lockfile, sans exécuter de scripts non désirés
RUN npm ci --ignore-scripts

# Copier le reste du code source (le .dockerignore exclut les fichiers sensibles)
COPY . .

# Générer le client Prisma avec une version figée
# ⚠️ Remplacez "5.20.0" par la version exacte de "prisma" dans votre package.json
RUN npx --yes --ignore-scripts prisma@7.8.0 generate

RUN npm run build

# Basculer sur l'utilisateur non-root avant l'exécution
USER appuser

EXPOSE 3000

ENV NODE_ENV=production

CMD ["npm", "start"]
