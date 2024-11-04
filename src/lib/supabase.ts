import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export async function addExpense(amount: number, description: string, budgetId: number, receiptUrl?: string) {
  const { data, error } = await supabase
    .from('expenses')
    .insert([
      {
        amount: Number(amount.toFixed(2)), // Ensure 2 decimal places
        description,
        budget_id: budgetId,
        receipt_url: receiptUrl
      }
    ])
    .select();

  if (error) throw error;
  return data;
}

export async function getBudgets() {
  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}

export async function getExpenses() {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function addBudget(name: string, amount: number) {
  const { data, error } = await supabase
    .from('budgets')
    .insert([
      {
        name,
        amount: Number(amount.toFixed(2)), // Ensure 2 decimal places
        user_id: 'default' // Replace with actual user ID when auth is implemented
      }
    ])
    .select();

  if (error) throw error;
  return data;
}