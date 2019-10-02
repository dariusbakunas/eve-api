import { IResolvers } from 'graphql-tools';

const getCharacterInfo = async (
  { id },
  args,
  { dataSources },
  { fieldName }
) => {
  const info = await dataSources.esiApi.getCharacterInfo(id);
  return info[fieldName === 'securityStatus' ? 'security_status' : fieldName];
};

const resolverMap: IResolvers = {
  Character: {
    scopes: parent => {
      return parent.scopes.split(' ');
    },
    birthday: getCharacterInfo,
    corporation: async ({ id }, args, { dataSources }) => {
      const {
        corporation_id: corporationId,
      } = await dataSources.esiApi.getCharacterInfo(id);
      const corporationInfo = await dataSources.esiApi.getCorporationInfo(
        corporationId
      );

      return {
        id: corporationId,
        ...corporationInfo,
      };
    },
    gender: getCharacterInfo,
    securityStatus: getCharacterInfo,
  },
};

export default resolverMap;
