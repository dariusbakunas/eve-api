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