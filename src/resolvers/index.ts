import merge from 'lodash.merge';
import Query from './query';
import Alliance from './alliance';
import Character from './character';
import Corporation from './corporation';
import Mutation from './mutation';
import User from './user';
import CustomScalars from './customScalars';
import Wallet from './wallet';

export default merge(Query, Alliance, Character, Corporation, Mutation, CustomScalars, User, Wallet);
