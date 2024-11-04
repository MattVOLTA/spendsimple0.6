import React, { useEffect } from 'react';
import { useBudgetStore } from './store/budgetStore';
import { useAuthStore } from './store/authStore';
import BudgetCard from './components/BudgetCard';
import AddBudgetForm from './components/AddBudgetForm';
import GlobalExpenseInput from './components/GlobalExpenseInput';
import SpendingOverview from './components/SpendingOverview';
import EditBudgetModal from './components/EditBudgetModal';
import Auth from './components/Auth';

function App() {
  const { 
    budgets, 
    expenses,
    loading,
    error,
    fetchBudgets, 
    fetchExpenses,
    getSpentByBudget
  } = useBudgetStore();

  const { user, checkSession } = useAuthStore();

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  useEffect(() => {
    if (user) {
      fetchBudgets();
      fetchExpenses();
    }
  }, [user, fetchBudgets, fetchExpenses]);

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <img 
              src="https://stackblitz.com/storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBNEdLRXc9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--c05c4c62a7da7593d173dfa985de2eee30b998e9/logo.png" 
              alt="Spend Simple Logo" 
              className="h-12 w-12 object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold text-indigo-900">Spend Simple</h1>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-sm text-slate-600 mb-1">Total Budget</p>
              <p className="text-2xl font-bold text-indigo-900">
                ${budgets.reduce((sum, budget) => sum + budget.amount, 0).toFixed(2)}
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-sm text-slate-600 mb-1">Total Spent</p>
              <p className="text-2xl font-bold text-indigo-900">
                ${budgets.reduce((sum, budget) => sum + getSpentByBudget(budget.id), 0).toFixed(2)}
              </p>
            </div>
          </div>

          <GlobalExpenseInput />
        </div>

        <SpendingOverview 
          budgets={budgets} 
          getSpentByBudget={getSpentByBudget} 
        />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mt-6">
            {error}
          </div>
        )}

        {/* Budget Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {budgets.map(budget => (
            <React.Fragment key={budget.id}>
              <BudgetCard
                id={budget.id}
                name={budget.name}
                amount={budget.amount}
                spent={getSpentByBudget(budget.id)}
                loading={loading}
              />
              <EditBudgetModal
                id={budget.id}
                initialName={budget.name}
                initialAmount={budget.amount}
              />
            </React.Fragment>
          ))}
        </div>
      </div>

      <AddBudgetForm />
    </div>
  );
}

export default App;