import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { useBudgetStore } from '../store/budgetStore';

export default function AddBudgetForm() {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const addBudget = useBudgetStore(state => state.addBudget);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!name.trim()) {
        throw new Error('Please enter a budget name');
      }

      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        throw new Error('Please enter a valid amount');
      }

      await addBudget(name.trim(), parsedAmount);
      
      // Close modal and reset form
      const dialog = document.getElementById('add-budget-modal') as HTMLDialogElement;
      if (dialog) {
        dialog.close();
      }
      setName('');
      setAmount('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add budget');
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog id="add-budget-modal" className="rounded-lg shadow-xl p-0">
      <div className="bg-white rounded-lg p-6 w-[32rem] max-w-full">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Create New Budget</h2>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Budget Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="500"
              min="0"
              step="0.01"
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
              onClick={() => {
                const dialog = document.getElementById('add-budget-modal') as HTMLDialogElement;
                if (dialog) {
                  dialog.close();
                }
                setName('');
                setAmount('');
                setError(null);
              }}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 bg-blue-600 text-white rounded-lg py-2 px-4 hover:bg-blue-700 transition-colors ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Add Budget
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}