export interface Budget {
  id: string;
  name: string;
  amount: number;
  created_at?: string;
}

export interface Expense {
  id: string;
  amount: number;
  description: string;
  budget_id: string;
  created_at?: string;
  receipt_url?: string;
}