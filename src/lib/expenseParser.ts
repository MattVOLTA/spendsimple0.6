import { callOpenAI } from './openai';
import type { Budget } from '../types';

interface ParsedExpense {
  Description: string;
  Amount: number;
  Date: string;
  Budget: string;
  BudgetID: string;
}

export async function parseExpenseWithAI(
  input: string | { image: string },
  budgets: Budget[]
): Promise<ParsedExpense> {
  try {
    if (!budgets || budgets.length === 0) {
      throw new Error('No budgets available for expense categorization');
    }

    let prompt: string;
    
    if (typeof input === 'string') {
      if (!input.trim()) {
        throw new Error('Expense input cannot be empty');
      }
      prompt = `Parse this expense: ${input}`;
    } else if (input.image) {
      if (!input.image.trim()) {
        throw new Error('Image URL cannot be empty');
      }
      prompt = `Process this receipt image URL: ${input.image}`;
    } else {
      throw new Error('Invalid input format');
    }

    const response = await callOpenAI(prompt, budgets);

    if (!response?.transactions?.[0]) {
      throw new Error('No valid transaction found in OpenAI response');
    }

    const transaction = response.transactions[0];

    // Detailed validation of the transaction data
    if (!transaction.Description?.trim()) {
      throw new Error('Missing or invalid description');
    }
    if (typeof transaction.Amount !== 'number' || isNaN(transaction.Amount)) {
      throw new Error('Invalid amount format');
    }
    if (!transaction.Date?.match(/^\d{4}-\d{2}-\d{2}$/)) {
      throw new Error('Invalid date format');
    }
    if (!transaction.Budget?.trim()) {
      throw new Error('Missing budget name');
    }
    if (!transaction.BudgetID?.trim()) {
      throw new Error('Missing budget ID');
    }

    // Verify the budget exists
    const budgetExists = budgets.some(b => b.id === transaction.BudgetID);
    if (!budgetExists) {
      throw new Error('Invalid budget ID');
    }

    return {
      Description: transaction.Description,
      Amount: Number(transaction.Amount.toFixed(2)),
      Date: transaction.Date,
      Budget: transaction.Budget,
      BudgetID: transaction.BudgetID
    };
  } catch (error: any) {
    console.error('Parse error:', {
      message: error.message,
      details: error
    });
    throw new Error(`Failed to parse expense: ${error.message}`);
  }
}