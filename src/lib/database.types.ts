export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      budgets: {
        Row: {
          id: number
          created_at: string
          name: string
          amount: number
          user_id: string
        }
        Insert: {
          id?: number
          created_at?: string
          name: string
          amount: number
          user_id: string
        }
        Update: {
          id?: number
          created_at?: string
          name?: string
          amount?: number
          user_id?: string
        }
      }
      expenses: {
        Row: {
          id: number
          created_at: string
          amount: number
          description: string
          budget_id: number
          receipt_url?: string
          user_id: string
        }
        Insert: {
          id?: number
          created_at?: string
          amount: number
          description: string
          budget_id: number
          receipt_url?: string
          user_id: string
        }
        Update: {
          id?: number
          created_at?: string
          amount?: number
          description?: string
          budget_id?: number
          receipt_url?: string
          user_id?: string
        }
      }
    }
  }
}