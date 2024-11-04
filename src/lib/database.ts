import { createClient } from '@supabase/supabase-js';
import { Budget, Expense } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function addExpense(budgetId: string, amount: number, description: string): Promise<void> {
  // Convert amount to cents to store as integer
  const amountInCents = Math.round(amount * 100);
  
  const { error } = await supabase
    .from('expenses')
    .insert([
      {
        budget_id: budgetId,
        amount: amountInCents,
        description
      }
    ]);

  if (error) {
    console.error('Add expense error:', error);
    throw error;
  }
}

export async function getBudgets(): Promise<Budget[]> {
  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .order('name');

  if (error) {
    console.error('Get budgets error:', error);
    throw error;
  }

  return data.map(budget => ({
    ...budget,
    amount: budget.amount / 100, // Convert cents back to dollars
    spent: budget.spent / 100 // Convert cents back to dollars
  }));
}

export async function getExpenses(budgetId: string): Promise<Expense[]> {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('budget_id', budgetId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Get expenses error:', error);
    throw error;
  }

  return data.map(expense => ({
    ...expense,
    amount: expense.amount / 100 // Convert cents back to dollars
  }));
}