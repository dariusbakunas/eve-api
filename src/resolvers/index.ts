import Alliance from './alliance';
import Character from './character';
import Corporation from './corporation';
import CustomScalars from './customScalars';
import InvItems from './invItems';
import merge from 'lodash.merge';
import Mutation from './mutation';
import Processing from './processing';
import Query from './query';
import User from './user';
import Wallet from './wallet';
import Warehouse from './warehouse';

export default merge(Query, Alliance, Character, Corporation, InvItems, Mutation, CustomScalars, User, Wallet, Processing, Warehouse);
