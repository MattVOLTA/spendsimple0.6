import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Budget } from '../types';

interface BudgetFormProps {
  onSubmit: (budget: Budget) => void;
  onClose: () => void;
}

function BudgetForm({ onSubmit, onClose }: BudgetFormProps) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please enter a budget name');
      return;
    }

    const parsedAmount = Math.round(parseFloat(amount));
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    const budget: Budget = {
      id: Date.now().toString(),
      name: name.trim(),
      amount: parsedAmount,
    };

    onSubmit(budget);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Budget Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Monthly Groceries"
          autoFocus
          required
        />
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
          Amount
        </label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="500"
          min="0"
          step="1"
          required
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white rounded-lg py-3 px-4 hover:bg-blue-700 transition-colors"
        >
          Add Budget
        </button>
      </div>
    </form>
  );
}

export default BudgetForm;