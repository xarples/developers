FROM node:14-buster AS deps
# FROM node:14.8.0-alpine3.12 AS deps

WORKDIR /usr/src/accounts

RUN npm install --global npm

COPY ./package*.json ./lerna.json ./
COPY ./packages/developers-frontend/package.json ./packages/developers-frontend/

RUN npm install --production
RUN cp -R node_modules node_modules_production
RUN npm install

COPY ./packages/developers-frontend ./packages/developers-frontend

RUN npm run generate
RUN npm run build

EXPOSE 5002

ENV HOST 0.0.0.0
ENV PORT 5002
ENV NODE_ENV production

CMD [ "npm", "run", "dev"]