import { GraphQLDate, GraphQLDateTime, GraphQLTime } from 'graphql-iso-date';

const resolverMap = {
  Date: GraphQLDate,
  DateTime: GraphQLDateTime,
  Time: GraphQLTime,
};

export default resolverMap;
