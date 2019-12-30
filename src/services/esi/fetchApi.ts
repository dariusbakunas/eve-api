import { IEsiBlueprint, IEsiMarketOrder, IEsiPagedResponse } from './esiTypes';
import request from '../../utils/request';

export const getMarketOrders = async (regionId: number, page: number): Promise<IEsiPagedResponse<IEsiMarketOrder[]>> => {
  const { data, headers } = await request<IEsiMarketOrder[]>(`${process.env.EVE_ESI_URL}/markets/${regionId}/orders?page=${page}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 4000,
    retries: 3,
  });

  const pages = headers.get('x-pages');

  return {
    pages: pages ? +pages : 1,
    data,
  };
};

export const getCharacterBlueprints = async (characterId: number, token: string): Promise<IEsiPagedResponse<IEsiBlueprint[]>> => {
  const { data, headers } = await request<IEsiBlueprint[]>(`${process.env.EVE_ESI_URL}/characters/${characterId}/blueprints`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const pages = headers.get('x-pages');

  return {
    pages: pages ? +pages : 1,
    data,
  };
};
