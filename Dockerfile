FROM node:lts-alpine as dependencies
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm install

FROM node:lts-alpine AS builder
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
ENV NODE_OPTIONS=--max-old-space-size=4096
ENV NEXT_TELEMETRY_DISABLED 1
ARG NODE_ENV
ENV NODE_ENV="${NODE_ENV}"
RUN npm run build

FROM node:lts-alpine AS runner
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED 1
COPY --from=builder /app/.next/standalone ./standalone
COPY --from=builder /app/public /app/standalone/public
COPY --from=builder /app/.next/static /app/standalone/.next/static
EXPOSE 3000
ENV PORT 3000
CMD [ "node" , "./standalone/server.js" ]