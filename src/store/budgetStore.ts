import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';
import { callOpenAI } from '../lib/openai';

interface Budget {
  id: string;
  name: string;
  amount: number;
}

interface Expense {
  id: string;
  description: string;
  amount: number;
  budget_id: string;
  date: string;
}

interface BudgetStore {
  budgets: Budget[];
  expenses: Expense[];
  loading: boolean;
  error: string | null;
  fetchBudgets: () => Promise<void>;
  fetchExpenses: () => Promise<void>;
  addBudget: (name: string, amount: number) => Promise<void>;
  updateBudget: (id: string, amount: number) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  addExpenseWithAI: (input: string | { image: string }) => Promise<any>;
  getSpentByBudget: (budgetId: string) => number;
}

const isCurrentMonth = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  return date.getMonth() === now.getMonth() && 
         date.getFullYear() === now.getFullYear();
};

export const useBudgetStore = create<BudgetStore>((set, get) => ({
  budgets: [],
  expenses: [],
  loading: false,
  error: null,

  fetchBudgets: async () => {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ budgets: data || [] });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  fetchExpenses: async () => {
    try {
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .gte('date', firstDayOfMonth)
        .lte('date', lastDayOfMonth)
        .order('date', { ascending: false });

      if (error) throw error;
      set({ expenses: data || [] });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  addBudget: async (name: string, amount: number) => {
    try {
      const { error } = await supabase
        .from('budgets')
        .insert([{ name, amount }]);

      if (error) throw error;
      await get().fetchBudgets();
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  updateBudget: async (id: string, amount: number) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('budgets')
        .update({ amount })
        .eq('id', id);

      if (error) throw error;
      await get().fetchBudgets();
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteBudget: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await get().fetchBudgets();
      await get().fetchExpenses();
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteExpense: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await get().fetchExpenses();
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  addExpenseWithAI: async (input: string | { image: string }) => {
    set({ loading: true, error: null });
    try {
      const { budgets } = get();
      const response = await callOpenAI(input, budgets);

      if (!response.transactions || !response.transactions.length) {
        throw new Error('No valid transactions found');
      }

      const { error } = await supabase
        .from('expenses')
        .insert(
          response.transactions.map(t => ({
            description: t.Description,
            amount: t.Amount,
            date: t.Date,
            budget_id: t.BudgetID
          }))
        );

      if (error) throw error;
      await get().fetchExpenses();
      set({ loading: false });
      return response;
    } catch (error: any) {
      console.error('Add expense error:', error);
      set({ loading: false, error: error.message });
      throw error;
    }
  },

  getSpentByBudget: (budgetId: string) => {
    const { expenses } = get();
    return expenses
      .filter(expense => expense.budget_id === budgetId)
      .reduce((total, expense) => total + Number(expense.amount), 0);
  },
}));