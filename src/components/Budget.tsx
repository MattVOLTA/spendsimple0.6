import React from 'react';

interface BudgetProps {
  total: number;
  spent: number;
  remaining: number;
}

function Budget({ total, spent, remaining }: BudgetProps) {
  const percentage = (spent / total) * 100;
  const barColor = percentage > 90 ? 'bg-red-500' : percentage > 70 ? 'bg-yellow-500' : 'bg-green-500';

  return (
    <div className="bg-white rounded-xl p-4 shadow-lg">
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <p className="text-sm text-gray-500">Budget</p>
          <p className="text-lg font-bold text-gray-900">${Math.round(total)}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Spent</p>
          <p className="text-lg font-bold text-gray-900">${Math.round(spent)}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Remaining</p>
          <p className="text-lg font-bold text-gray-900">${Math.round(remaining)}</p>
        </div>
      </div>
      
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} transition-all duration-500`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
}

export default Budget;