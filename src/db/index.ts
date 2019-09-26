import { Model } from 'objection';
import Knex from 'knex';
import { Scope } from './models/scope';
// @ts-ignore
import config from "../../knexfile";

const knex = Knex(config[process.env.NODE_ENV]);

Model.knex(knex);

const db = {};

const models = [
  Scope,
];

models.forEach((model) => {
  db[model.name] = model;
})

export default db;
