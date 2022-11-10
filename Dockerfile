FROM node:16.18.1-bullseye-slim AS build
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init
WORKDIR /usr/src/app
COPY src tsconfig.json package.json yarn.lock /usr/src/app/
RUN yarn && yarn build