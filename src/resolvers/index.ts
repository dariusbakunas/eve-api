import merge from 'lodash.merge';
import Query from './query';
import Character from './character';
import Mutation from './mutation';

export default merge(Query, Character, Mutation);
