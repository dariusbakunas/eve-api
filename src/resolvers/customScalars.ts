import { GraphQLDate, GraphQLTime, GraphQLDateTime } from 'graphql-iso-date';

const resolverMap = {
  Date: GraphQLDate,
  DateTime: GraphQLDateTime,
  Time: GraphQLTime,
};

export default resolverMap;
