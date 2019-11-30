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
  state: 'active' | 'cancelled' | 'expired';
  type_id: number;
  volume_remain: number;
  volume_total: number;
}

export interface IEsiCharacterInfo {
  alliance_id?: number;
  ancestry_id?: number;
  birthday: string;
  bloodline_id: number;
  corporation_id: number;
  description?: string;
  faction_id?: number;
  gender: string;
  name: string;
  race_id: number;
  security_status: number;
  title: string;
}

export interface IEsiCorporationInfo {
  alliance_id?: number;
  ceo_id: number;
  creator_id: number;
  date_founded?: string;
  description?: string;
  faction_id?: number;
  home_station_id?: number;
  member_count: number;
  name: string;
  shares?: number;
  tax_rate: number;
  ticker: string;
  url?: string;
  war_eligible?: boolean;
}

export interface IEsiAllianceInfo {
  creator_corporation_id: number;
  creator_id: number;
  date_founded: string;
  executor_corporation_id?: number;
  faction_id?: number;
  name: string;
  ticker: string;
}

export interface IEsiCharacterSkills {
  skills: Array<{
    active_skill_level: number;
    skill_id: number;
    skillpoints_in_skill: number;
    trained_skill_level: number;
  }>;
  total_sp: number;
  unallocated_sp?: number;
}
