FROM node:22-bookworm-slim

RUN apt-get update && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app/backend

COPY backend/package.json backend/package-lock.json ./
COPY backend/prisma ./prisma
RUN npm ci --omit=dev && npx prisma generate

COPY --chown=node:node backend/src ./src
COPY --chown=node:node docs/openapi.yaml /app/docs/openapi.yaml

ENV NODE_ENV=production
USER node
EXPOSE 5000
CMD ["sh", "-c", "npx prisma migrate deploy && exec node src/server.js"]
