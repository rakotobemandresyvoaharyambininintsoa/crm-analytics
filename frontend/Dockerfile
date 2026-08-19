FROM node:22-bookworm

# Créer un utilisateur non-root dédié à l'application
RUN groupadd -r appgroup && useradd -r -g appgroup appuser

WORKDIR /app

# Copier uniquement les manifests d'abord (meilleur cache Docker)
COPY package.json package-lock.json ./

# Installer avec les versions exactes du lockfile, sans exécuter de scripts non désirés
RUN npm ci --ignore-scripts

# Copier explicitement uniquement le code nécessaire au build
# (exclut volontairement .env, .env.example, README.md, AUDIT.md,
#  docker-compose.yml, export.py, scripts/, node_modules, .next, etc.)
COPY app ./app
COPY components ./components
COPY lib ./lib
COPY public ./public
COPY prisma ./prisma
COPY utils ./utils
COPY middleware.ts ./
COPY next.config.ts ./
COPY next-env.d.ts ./
COPY tsconfig.json ./
COPY postcss.config.mjs ./
COPY prisma.config.ts ./

# Générer le client Prisma avec une version figée
RUN npx --yes --ignore-scripts prisma@7.8.0 generate

RUN npm run build

# Basculer sur l'utilisateur non-root avant l'exécution
USER appuser

EXPOSE 3000

ENV NODE_ENV=production

CMD ["npm", "start"]
