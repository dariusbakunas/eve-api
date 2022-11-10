import merge from 'lodash.merge';
import { characterResolvers } from "./character";
import { corporationResolvers } from './corporation';

export default merge(
  characterResolvers,
  corporationResolvers
)
