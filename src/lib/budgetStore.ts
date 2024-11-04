import { supabase } from './supabaseClient';

export interface Budget {
  id: string;
  name: string;
  amount: number;
  created_at?: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  budget_id: string;
  date: string;
  receipt_url?: string;
  created_at?: string;
}

export async function getBudgets(): Promise<Budget[]> {
  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching budgets:', error);
    throw error;
  }

  return data || [];
}

export async function addBudget(name: string, amount: number): Promise<Budget> {
  const { data, error } = await supabase
    .from('budgets')
    .insert([{ name, amount }])
    .select()
    .single();

  if (error) {
    console.error('Error adding budget:', error);
    throw error;
  }

  return data;
}

export async function addExpense(
  description: string,
  amount: number,
  budgetId: string,
  date: string,
  receiptUrl?: string
): Promise<Expense> {
  const { data, error } = await supabase
    .from('expenses')
    .insert([{
      description,
      amount,
      budget_id: budgetId,
      date,
      receipt_url: receiptUrl
    }])
    .select()
    .single();

  if (error) {
    console.error('Add expense error:', error);
    throw error;
  }

  return data;
}

export async function getExpensesByBudget(budgetId: string): Promise<Expense[]> {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('budget_id', budgetId)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching expenses:', error);
    throw error;
  }

  return data || [];
}

export async function getSpentByBudget(budgetId: string): Promise<number> {
  const expenses = await getExpensesByBudget(budgetId);
  return expenses.reduce((total, expense) => total + Number(expense.amount), 0);
}