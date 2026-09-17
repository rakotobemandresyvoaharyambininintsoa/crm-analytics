FROM node:22-bookworm

RUN groupadd -r appgroup && useradd -r -g appgroup appuser

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --ignore-scripts

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

RUN npx --yes --ignore-scripts prisma@7.8.0 generate

RUN npm run build

USER appuser

EXPOSE 3000

ENV NODE_ENV=production

CMD ["npm", "start"]
