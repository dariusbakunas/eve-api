### Migrations

* Create new migration: 

        % knex migrate:make migration_name -x ts
        
* Run migration:

        % npm run db:migrate
        
* Rollback:

        % npm run db:rollback
        
* Create new seed:

        % knex seed:make seed_name
        
* Run specific seed:

        % npm run db:seed -- --specific=seed-filename.js
