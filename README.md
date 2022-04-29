# EVE-API

GraphQL server for [eve-warehouse](https://github.com/dariusbakunas/eve-warehouse)

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

## References

* [apollo-server-fastify](https://www.apollographql.com/docs/apollo-server/integrations/middleware/#apollo-server-fastify)
