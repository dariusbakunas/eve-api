import Alliance from './alliance';
import Blueprint from './blueprint';
import Character from './character';
import Corporation from './corporation';
import CustomScalars from './customScalars';
import IndustryJobs from './industryJobs';
import InvCategory from './invCategory';
import InvGroup from './invGroup';
import InvItems from './invItems';
import merge from 'lodash.merge';
import Mutation from './mutation';
import Processing from './processing';
import Query from './query';
import User from './user';
import Wallet from './wallet';
import Warehouse from './warehouse';

export default merge(
  Query,
  Alliance,
  Blueprint,
  Character,
  Corporation,
  InvCategory,
  InvItems,
  InvGroup,
  IndustryJobs,
  Mutation,
  CustomScalars,
  User,
  Wallet,
  Processing,
  Warehouse
);
