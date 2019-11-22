export interface IEsiWalletTransaction {
  client_id: number;
  date: string;
  is_buy: boolean;
  is_personal: boolean;
  journal_ref_id: number;
  location_id: number;
  quantity: number;
  transaction_id: number;
  type_id: number;
  unit_price: number;
}

export interface IEsiJournalEntry {
  amount?: number;
  balance?: number;
  context_id?: number;
  context_id_type?: string;
  date: string;
  description: string;
  first_party_id?: number;
  id: number;
  reason?: string;
  ref_type: string;
  second_party_id?: number;
  tax?: number;
  tax_receiver_id?: number;
}

export interface IEsiBookmark {
  bookmark_id: number;
  coordinates?: {
    x: number;
    y: number;
    z: number;
  };
  created: string;
  creator_id: number;
  folder_id?: number;
  item?: {
    item_id: number;
    type_id: number;
  };
  label: string;
  location_id: number;
  notes: string;
}

export interface IEsiMarketOrder {
  duration: number;
  escrow?: number;
  is_buy_order?: boolean;
  is_corporation: boolean;
  issued: string;
  location_id: number;
  min_volume?: number;
  order_id: number;
  price: number;
  range: string;
  region_id: number;
  type_id: number;
  volume_remain: number;
  volume_total: number;
}
