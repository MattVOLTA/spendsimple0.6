import React, { useState } from 'react';
import { AlertCircle, Trash2 } from 'lucide-react';
import { useBudgetStore } from '../store/budgetStore';

interface EditBudgetModalProps {
  id: string;
  initialName: string;
  initialAmount: number;
}

export default function EditBudgetModal({ id, initialName, initialAmount }: EditBudgetModalProps) {
  const [amount, setAmount] = useState(initialAmount.toString());
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { updateBudget, deleteBudget } = useBudgetStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        throw new Error('Please enter a valid amount');
      }

      await updateBudget(id, parsedAmount);
      
      const dialog = document.getElementById(`edit-budget-modal-${id}`) as HTMLDialogElement;
      if (dialog) {
        dialog.close();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update budget');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!isDeleting) {
      setIsDeleting(true);
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await deleteBudget(id);
      const dialog = document.getElementById(`edit-budget-modal-${id}`) as HTMLDialogElement;
      if (dialog) {
        dialog.close();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete budget');
    } finally {
      setLoading(false);
      setIsDeleting(false);
    }
  };

  return (
    <dialog id={`edit-budget-modal-${id}`} className="rounded-lg shadow-xl p-0">
      <div className="bg-white rounded-lg p-6 w-[32rem] max-w-full">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Update Budget: {initialName}</h2>
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              New Amount
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
              autoFocus
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
              onClick={handleDelete}
              className={`flex items-center justify-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={loading}
            >
              <Trash2 className="w-4 h-4" />
              {isDeleting ? 'Confirm Delete?' : 'Delete'}
            </button>
            <button
              type="button"
              onClick={() => {
                const dialog = document.getElementById(`edit-budget-modal-${id}`) as HTMLDialogElement;
                if (dialog) {
                  dialog.close();
                }
                setAmount(initialAmount.toString());
                setError(null);
                setIsDeleting(false);
              }}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 bg-[#141414] text-white rounded-lg py-2 px-4 hover:bg-[#141414]/90 transition-colors ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Update Budget
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}