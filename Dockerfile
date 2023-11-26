FROM node:lts-alpine as builder
WORKDIR /app
COPY . .
ENV NODE_OPTIONS=--max-old-space-size=4096
RUN npm install
RUN npm run build

FROM node:lts-alpine as runner
WORKDIR /app
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
CMD ["node_modules/.bin/next", "start"]