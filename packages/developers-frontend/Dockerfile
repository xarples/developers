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

RUN cp -R node_modules node_modules_development

FROM alpine:3.12 AS release

ARG V=14.17.1
ARG FILE=node-v$V-linux-x64-musl.tar.xz

RUN apk add --no-cache libstdc++ \
  && apk add --no-cache --virtual .deps curl \
  && curl -fsSLO --compressed \
  "https://unofficial-builds.nodejs.org/download/release/v$V/$FILE" \
  && tar -xJf $FILE -C /usr/local --strip-components=1 \
  && rm -f $FILE /usr/local/bin/npm /usr/local/bin/npx \
  && rm -rf /usr/local/lib/node_modules \
  && apk del .deps

WORKDIR /usr/src/accounts

COPY --from=deps /usr/src/accounts/node_modules_production ./node_modules
COPY --from=deps /usr/src/accounts/packages/developers-frontend/.nuxt  ./packages/developers-frontend/.nuxt
COPY --from=deps /usr/src/accounts/packages/developers-frontend/dist  ./packages/developers-frontend/dist
COPY --from=deps /usr/src/accounts/packages/developers-frontend/package.json ./packages/developers-frontend/
COPY --from=deps /usr/src/accounts/packages/developers-frontend/nuxt.config.js ./packages/developers-frontend/

EXPOSE 5002

ENV HOST 0.0.0.0
ENV PORT 5002
ENV NODE_ENV production

CMD [ "node", "./packages/developers-frontend/dist/index.js" ]