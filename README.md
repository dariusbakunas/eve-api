# EVE-API

GraphQL server for [eve-app](https://github.com/dariusbakunas/eve-app)

| master                                                                                                                                                                 | dev |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| [![Build Status](https://travis-ci.org/dariusbakunas/eve-api.svg?branch=master)](https://travis-ci.org/dariusbakunas/eve-api)                                          |     |
| [![Coverage Status](https://coveralls.io/repos/github/dariusbakunas/eve-api/badge.svg?branch=master)](https://coveralls.io/github/dariusbakunas/eve-api?branch=master) |     |

## Requirements

For development, you will only need Node.js and a node global package, Yarn, installed in your environement.

## Install

    $ git clone https://github.com/dariusbakunas/eve-api.git
    $ cd eve-api
    $ yarn install

## Configure

Open `.env` then edit it with your settings. You will need:

- AUTH0_DOMAIN=
- AUTH0_AUDIENCE=
- DEV_DB_USERNAME=
- DEV_DB_PASSWORD=
- DEV_DB_HOST=
- DEV_DB_DATABASE=
- NODE_ENV=development
- EVE_CLIENT_ID=
- EVE_CLIENT_SECRET=
- EVE_LOGIN_URL=https://login.eveonline.com
- EVE_ESI_URL=https://esi.evetech.net/latest
- REDIS_HOST=
- REDIS_PASSWORD=
- TOKEN_SECRET=
- LOG_LEVEL=info

## Running the project

    $ yarn dev

### Links:

- [schema documentation](https://dariusbakunas.github.io/eve-api/schema/index.html)
