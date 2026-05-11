
export interface FaxRequest {
  id: string;
  sender_phone: string;
  receiver_phone: string;
  status: 'PENDING' | 'ANALYZING' | 'APPROVED' | 'REJECTED' | 'EXECUTED';
  raw_text?: string;
  intent_data?: any;
  amount_jpy?: number;
  solana_pda?: string;
  created_at: Date;
}

export interface User {
  id: string;
  wallet_address?: string;
  world_id_nullifier?: string;
  role: 'SENIOR' | 'CAREGIVER';
}
