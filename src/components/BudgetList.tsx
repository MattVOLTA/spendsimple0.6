import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Budget } from '../types';
import BudgetCard from './BudgetCard';

interface BudgetListProps {
  budgets: Budget[];
  expenses: { [key: string]: number };
  onAddClick: () => void;
  onBudgetSelect: (budgetId: string) => void;
}

function BudgetList({ budgets, expenses, onAddClick, onBudgetSelect }: BudgetListProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Your Budgets</h2>
        <button
          onClick={onAddClick}
          className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
        >
          <PlusCircle className="w-5 h-5" />
          <span>New Budget</span>
        </button>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2">
        {budgets.map((budget) => (
          <BudgetCard
            key={budget.id}
            budget={budget}
            spent={expenses[budget.id] || 0}
            onClick={() => onBudgetSelect(budget.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default BudgetList;