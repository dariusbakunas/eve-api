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

export interface IEsiSkillQueueItem {
  finish_date?: string;
  finished_level: number;
  level_end_sp?: number;
  level_start_sp?: number;
  queue_position: number;
  skill_id: number;
  start_date?: string;
  training_start_sp?: number;
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

export interface IEsiBlueprint {
  item_id: number;
  location_flag: string;
  location_id: number;
  material_efficiency: number;
  quantity: number;
  runs: number;
  time_efficiency: number;
  type_id: number;
}

export interface IEsiCharacterMarketOrder {
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

export interface IEsiMarketOrder {
  duration: number;
  is_buy_order: boolean;
  issued: string;
  location_id: number;
  min_volume: number;
  order_id: number;
  price: number;
  range: number;
  system_id: number;
  type_id: number;
  volume_remain: number;
  volume_total: number;
}

export interface IEsiPagedResponse<T> {
  pages: number;
  data: T;
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

export interface IEsiIndustryJob {
  activity_id: number;
  blueprint_id: number;
  blueprint_location_id: number;
  blueprint_type_id: number;
  completed_character_id?: number;
  completed_date?: string;
  cost?: number;
  duration: number;
  end_date: string;
  facility_id: number;
  installer_id: number;
  job_id: number;
  licensed_runs?: number;
  output_location_id: number;
  pause_date?: string;
  probability?: number;
  product_type_id?: number;
  runs: number;
  start_date: string;
  station_id: string;
  status: 'active' | 'cancelled' | 'delivered' | 'paused' | 'ready' | 'reverted';
  successful_runs?: number;
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
