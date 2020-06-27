# EVE-API

GraphQL server for [eve-app](https://github.com/dariusbakunas/eve-app)

[![Build Status](https://travis-ci.org/dariusbakunas/eve-api.svg?branch=master)](https://travis-ci.org/dariusbakunas/eve-api)
[![Coverage Status](https://coveralls.io/repos/github/dariusbakunas/eve-api/badge.svg?branch=master)](https://coveralls.io/github/dariusbakunas/eve-api?branch=master)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/9ceef682a36b4338a64d2692ff4d1395)](https://www.codacy.com/manual/dariusbakunas/eve-api?utm_source=github.com&utm_medium=referral&utm_content=dariusbakunas/eve-api&utm_campaign=Badge_Grade)

## Requirements

For development, you will only need Node.js and a node global package, Yarn, installed in your environement.

## Install

    $ git clone https://github.com/dariusbakunas/eve-api.git
    $ cd eve-api
    $ yarn install

## Configure

Open `.env` then edit it with your settings. You will need:

### Auth0 settings

- AUTH0_DOMAIN=
- AUTH0_AUDIENCE=

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

### Encryption settings

- TOKEN_SECRET=

### Optional

- NODE_ENV=development
- DB_PORT=3306
- LOG_LEVEL=info

## Running the project

    $ yarn dev

### Links:

- [schema documentation](https://dariusbakunas.github.io/eve-api/schema/index.html)
