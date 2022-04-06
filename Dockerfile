FROM node as builder
WORKDIR /app
COPY package.json .
COPY tsconfig.json .
RUN npm install
COPY src ./src
RUN npm run build

FROM node
WORKDIR /app
ENV NODE_ENV=production
ENV LOG_DIR=/data/logs

COPY --chown=1000:1000 package.json .
RUN npm install

USER 1000

COPY --chown=1000:1000 --from=builder /app/dist .
COPY --chown=1000:1000 static ./static

EXPOSE 1536

CMD ["node", "index.js"]