import React, { useState } from 'react';
import { format } from 'date-fns';
import { Trash2, Loader2 } from 'lucide-react';
import { useBudgetStore } from '../store/budgetStore';

interface ExpenseListProps {
  id: string;
  budgetName: string;
  expenses: Array<{
    id: string;
    description: string;
    amount: number;
    date: string;
  }>;
}

export default function ExpenseList({ id, budgetName, expenses }: ExpenseListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const deleteExpense = useBudgetStore(state => state.deleteExpense);

  const handleDelete = async (expenseId: string) => {
    if (deletingId !== expenseId) {
      setDeletingId(expenseId);
      return;
    }

    setLoading(true);
    try {
      await deleteExpense(expenseId);
      setDeletingId(null);
    } catch (error) {
      console.error('Failed to delete expense:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog id={`expense-list-modal-${id}`} className="rounded-lg shadow-xl p-0">
      <div className="bg-white rounded-lg p-6 w-[32rem] max-w-full">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">{budgetName} Expenses</h2>
        </div>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {expenses.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No expenses for this month</p>
          ) : (
            expenses.map((expense) => (
              <div 
                key={expense.id} 
                className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{expense.description}</p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(expense.date), 'MMM d, yyyy')}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-semibold text-gray-900">
                    ${expense.amount.toFixed(2)}
                  </p>
                  <button
                    onClick={() => handleDelete(expense.id)}
                    disabled={loading}
                    className={`p-2 rounded-lg transition-colors ${
                      deletingId === expense.id
                        ? 'bg-red-100 text-red-600 hover:bg-red-200'
                        : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                    }`}
                  >
                    {loading && deletingId === expense.id ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-6">
          <button
            onClick={() => {
              const dialog = document.getElementById(`expense-list-modal-${id}`) as HTMLDialogElement;
              if (dialog) {
                dialog.close();
              }
              setDeletingId(null);
            }}
            className="w-full px-4 py-2 bg-[#141414] text-white rounded-lg hover:bg-[#141414]/90 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
}