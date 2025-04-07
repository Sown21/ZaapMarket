FROM node:23.10.0 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN npx prisma generate
RUN npm run build

FROM node:23.10.0 AS runtime

WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3000
USER node
CMD ["npm", "start"]