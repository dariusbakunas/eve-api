FROM node:16.18.1-bullseye-slim AS build

LABEL build=eve-api

RUN apt-get update && apt-get install -y --no-install-recommends dumb-init

WORKDIR /usr/src/app
COPY package.json yarn.lock /usr/src/app/
RUN yarn cache clean && yarn install --production

FROM node:16.18.1-bullseye-slim

ENV NODE_ENV production
COPY --from=build /usr/bin/dumb-init /usr/bin/dumb-init
USER node
WORKDIR /usr/src/app
COPY --chown=node:node --from=build /usr/src/app/node_modules /usr/src/app/node_modules
COPY --chown=node:node build /usr/src/app/build
COPY --chown=node:node config /usr/src/app/config
CMD ["dumb-init", "node", "build/index.js"]
