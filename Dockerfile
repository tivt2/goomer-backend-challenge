FROM node:22.3.0-alpine

RUN apk add --no-cache bash

WORKDIR /home/app

COPY package*.json .

RUN npm ci --omit=dev

COPY ./dist ./dist
COPY ./migrations ./migrations
COPY migrate.js migrate.js

CMD node migrate.js up && node ./dist/index.js
