import React from 'react';

interface BudgetCardProps {
  name: string;
  amount: number;
  spent: number;
  loading?: boolean;
  id: string;
}

function BudgetCard({ id, name, amount, spent, loading = false }: BudgetCardProps) {
  const remaining = amount - spent;
  const progress = (spent / amount) * 100;
  const isOverBudget = spent > amount;

  const handleClick = () => {
    const dialog = document.getElementById(`edit-budget-modal-${id}`) as HTMLDialogElement;
    if (dialog) {
      dialog.showModal();
    }
  };

  return (
    <div 
      onClick={handleClick}
      className="bg-white rounded-2xl shadow-sm p-6 transition-all hover:shadow-md cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-indigo-900">{name}</h3>
        <div className="text-right">
          <p className="text-sm text-slate-500">Budget</p>
          <p className="text-lg font-semibold">${amount.toFixed(0)}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-500">Spent</span>
            <span className={isOverBudget ? 'text-brand-coral font-medium' : 'text-slate-700'}>
              ${spent.toFixed(0)}
            </span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                isOverBudget ? 'bg-brand-coral' : 'bg-brand-blue'
              }`}
              style={{ width: `${Math.min(100, progress)}%` }}
            />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-500">Remaining</span>
          <span className={`font-medium ${remaining < 0 ? 'text-brand-coral' : 'text-brand-blue'}`}>
            ${remaining.toFixed(0)}
          </span>
        </div>

        {loading && (
          <div className="text-sm text-slate-400 animate-pulse">
            Updating...
          </div>
        )}
      </div>
    </div>
  );
}

export default BudgetCard;