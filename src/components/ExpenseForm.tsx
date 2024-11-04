import React, { useState } from 'react';
import { Camera, AlertCircle } from 'lucide-react';
import { Budget, Expense } from '../types';

interface ExpenseFormProps {
  budgetId: string;
  budget: Budget;
  onSubmit: (expense: Expense) => void;
}

function ExpenseForm({ budgetId, budget, onSubmit }: ExpenseFormProps) {
  const [input, setInput] = useState('');
  const [receipt, setReceipt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const parseExpenseInput = (input: string): { amount: number; description: string } | null => {
    const numberPattern = /\d+(\.\d{1,2})?/;
    const match = input.match(numberPattern);
    
    if (!match) return null;
    
    const amount = parseFloat(match[0]);
    const description = input.replace(match[0], '').trim();
    
    if (!description) return null;
    
    return { amount, description };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsed = parseExpenseInput(input);
    if (!parsed) {
      setError('Please enter both an amount and description (e.g., "12.99 coffee" or "coffee 12.99")');
      return;
    }

    const expense: Expense = {
      id: Date.now().toString(),
      budgetId,
      amount: parsed.amount,
      description: parsed.description,
      receipt,
      timestamp: new Date().toISOString(),
    };

    onSubmit(expense);
    setInput('');
    setReceipt(null);
  };

  const handleImageCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceipt(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Add Expense to {budget.name}</h2>
      </div>

      <div>
        <label htmlFor="expense" className="block text-sm font-medium text-gray-700 mb-1">
          Enter Expense
        </label>
        <input
          type="text"
          id="expense"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError(null);
          }}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
          placeholder="12.99 coffee"
          autoFocus
          required
        />
        {error && (
          <div className="mt-2 text-red-500 text-sm flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Receipt (optional)
        </label>
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageCapture}
            className="hidden"
            id="camera"
          />
          <label
            htmlFor="camera"
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 cursor-pointer"
          >
            <Camera className="w-5 h-5" />
            Take Photo
          </label>
          {receipt && (
            <div className="mt-2">
              <img
                src={receipt}
                alt="Receipt"
                className="w-full h-32 object-cover rounded-lg"
              />
            </div>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white rounded-lg py-3 px-4 hover:bg-blue-700 transition-colors"
      >
        Save Expense
      </button>
    </form>
  );
}

export default ExpenseForm;