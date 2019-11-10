### Migrations

- Create new migration:

        % knex migrate:make migration_name -x ts

* Run migration:

        % npm run db:migrate

- Rollback:

        % npm run db:rollback

* Create new seed:

        % knex seed:make seed_name

- Run specific seed:

        % npm run db:seed -- --specific=seed-filename.js

- Install Helm chart:

        % helm install charts/eve-api --name eve-api --set "dbPassword"='P@ssw0rd' --set "sendgridKey"='sendgridkey'

- Upgrade Helm chart:

        % helm upgrade eve-api charts/eve-api --set "dbPassword"="P@ssw0rd" --set "sendgridKey"="sendgridkey"  --set=image.tag=xx
