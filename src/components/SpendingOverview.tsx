import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Plus } from 'lucide-react';
import { useBudgetStore } from '../store/budgetStore';
import ExpenseList from './ExpenseList';

ChartJS.register(ArcElement, Tooltip, Legend);

interface SpendingOverviewProps {
  budgets: Array<{ id: string; name: string; amount: number }>;
  getSpentByBudget: (id: string) => number;
}

// Define a larger color palette
const colorPalette = [
  '#38BDF8', // brand-blue
  '#FB923C', // brand-orange
  '#F87171', // brand-coral
  '#4F46E5', // brand-purple
  '#10B981', // emerald
  '#8B5CF6', // violet
  '#EC4899', // pink
  '#F59E0B', // amber
  '#6366F1', // indigo
  '#14B8A6', // teal
  '#06B6D4', // cyan
  '#D946EF', // fuchsia
  '#84CC16', // lime
  '#3B82F6', // blue
  '#EF4444', // red
];

// Function to get unique colors for each budget
const getUniqueColors = (count: number) => {
  // If we have more budgets than colors, we'll generate additional colors
  if (count <= colorPalette.length) {
    return colorPalette.slice(0, count);
  }

  // Generate additional colors by adjusting hue
  const colors = [...colorPalette];
  const baseHue = Math.random() * 360;
  
  for (let i = colorPalette.length; i < count; i++) {
    const hue = (baseHue + (i * 137.5)) % 360; // Golden angle approximation
    colors.push(`hsl(${hue}, 70%, 50%)`);
  }

  return colors;
};

export default function SpendingOverview({ budgets, getSpentByBudget }: SpendingOverviewProps) {
  const expenses = useBudgetStore(state => state.expenses);

  const spendingData = budgets.map(budget => ({
    name: budget.name,
    spent: getSpentByBudget(budget.id)
  }));

  const colors = getUniqueColors(budgets.length);

  const data = {
    labels: spendingData.map(d => d.name),
    datasets: [
      {
        data: spendingData.map(d => d.spent),
        backgroundColor: colors,
        borderWidth: 0
      }
    ]
  };

  const options = {
    cutout: '70%',
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            return `$${value.toFixed(0)}`;
          }
        }
      }
    }
  };

  const totalSpent = spendingData.reduce((sum, item) => sum + item.spent, 0);

  const handleBudgetClick = (budgetId: string) => {
    const dialog = document.getElementById(`expense-list-modal-${budgetId}`) as HTMLDialogElement;
    if (dialog) {
      dialog.showModal();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-indigo-900">Spending Overview</h2>
        <button
          onClick={() => document.getElementById('add-budget-modal')?.showModal()}
          className="bg-[#141414] text-white rounded-xl transition-colors hover:bg-[#141414]/90"
        >
          <span className="hidden sm:block px-4 py-2">Add Budget</span>
          <span className="sm:hidden p-3 w-[46px] h-[46px] flex items-center justify-center">
            <Plus className="w-5 h-5" />
          </span>
        </button>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Chart */}
        <div className="relative w-64 h-64 mx-auto">
          <Doughnut data={data} options={options} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-sm text-slate-500">Total Spent</p>
              <p className="text-2xl font-bold text-indigo-900">${totalSpent.toFixed(0)}</p>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="grid gap-4">
          {budgets.map((budget, index) => (
            <React.Fragment key={budget.id}>
              <div 
                onClick={() => handleBudgetClick(budget.id)}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: colors[index] }}
                  />
                  <span className="font-medium text-indigo-900">{budget.name}</span>
                </div>
                <span className="text-slate-700">${getSpentByBudget(budget.id).toFixed(0)}</span>
              </div>
              <ExpenseList
                id={budget.id}
                budgetName={budget.name}
                expenses={expenses.filter(e => e.budget_id === budget.id)}
              />
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}