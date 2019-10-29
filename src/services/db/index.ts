import { Model } from 'objection';
import Knex from 'knex';
import { Scope } from './models/scope';
import { User } from './models/user';
import { Character } from './models/character';
import { Invitation } from './models/invitation';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import config from '../../../knexfile';

const knex = Knex(config[process.env.NODE_ENV]);

//knex.migrate.latest();
Model.knex(knex);

const db = {
  Character,
  User,
  Scope,
  Invitation,
};

export default db;
