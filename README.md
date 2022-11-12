# EVE-API

GraphQL server for [eve-warehouse](https://github.com/dariusbakunas/eve-warehouse)

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/dariusbakunas/eve-api/tree/refactor.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/dariusbakunas/eve-api/tree/refactor)

[![Coverage Status](https://coveralls.io/repos/github/dariusbakunas/eve-api/badge.svg?branch=refactor)](https://coveralls.io/github/dariusbakunas/eve-api?branch=refactor)

## Requirements

For development, you will only need Node.js and a node global package (preferably with nvm), Yarn, installed in your environment.

## Install

```bash
$ git clone https://github.com/dariusbakunas/eve-api.git
$ cd eve-api
$ yarn install
```

## Configure

Open `.env` then edit it with your settings. You will need:

Generate initial migration:

```bash
prisma db pull
mkdir -p prisma/migrations/init
prisma migrate diff --preview-feature --from-empty --to-schema-datamodel prisma/schema.prisma --script > prisma/migrations/init/migration.sql
prisma migrate resolve --applied init
```

### Database settings

- DB_USER=
- DB_PASSWORD=
- DB_HOST=
- DB_NAME=

### Eve ESI settings

- EVE_CLIENT_ID=
- EVE_CLIENT_SECRET=
- EVE_LOGIN_URL=https://login.eveonline.com
- EVE_ESI_URL=https://esi.evetech.net/latest

### DB Schema Migrations

```bash
prisma migrate dev --name <migration name>
```

## References

* [apollo-server-fastify](https://www.apollographql.com/docs/apollo-server/integrations/middleware/#apollo-server-fastify)
