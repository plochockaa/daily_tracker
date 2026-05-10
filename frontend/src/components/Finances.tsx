'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import apiClient from '@/lib/api';
import { Expense, ExpenseCreate } from '@/types';

export default function Finances() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<ExpenseCreate>({
    description: '',
    amount: 0,
    category: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    notes: '',
  });

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<Expense[]>('/expenses?limit=50');
      setExpenses(response.data);
    } catch (error) {
      console.error('Error loading expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiClient.post<Expense>('/expenses', formData);
      setExpenses([response.data, ...expenses]);
      setFormData({
        description: '',
        amount: 0,
        category: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        notes: '',
      });
      setShowForm(false);
    } catch (error) {
      console.error('Error creating expense:', error);
    }
  };

  const deleteExpense = async (id: number) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;
    try {
      await apiClient.delete(`/expenses/${id}`);
      setExpenses(expenses.filter((exp) => exp.id !== id));
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const getTotalAmount = () =>
    expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2);

  const inputClass = "w-full px-3 py-2 bg-[#0d0d1a] border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all text-sm";
  const labelClass = "block text-sm font-medium text-gray-400 mb-1";

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading expenses...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Expense Tracking</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium transition-all"
        >
          {showForm ? 'Cancel' : '+ Add Expense'}
        </button>
      </div>

      <div className="mb-6 p-5 bg-[#0d0d1a] border border-gray-800 rounded-xl">
        <div className="text-sm text-gray-500">Total Expenses</div>
        <div className="text-4xl font-bold text-violet-400 mt-1">${getTotalAmount()}</div>
        <div className="text-sm text-gray-600 mt-1">{expenses.length} transactions</div>
      </div>

      {showForm && (
        <div className="mb-6 p-6 bg-[#0d0d1a] border border-gray-800 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-4">Add New Expense</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Description *</label>
                <input
                  type="text"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={inputClass}
                  placeholder="Coffee, groceries, etc."
                />
              </div>
              <div>
                <label className={labelClass}>Amount * (£)</label>
                <input
                  type="number"
                  required
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                  className={inputClass}
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className={labelClass}>Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className={inputClass}
                  placeholder="Food, Transport, etc."
                />
              </div>
              <div>
                <label className={labelClass}>Date *</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={2}
                className={inputClass}
                placeholder="Additional details..."
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium text-sm transition-all"
              >
                Add Expense
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg font-medium text-sm transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-2">
        <h3 className="text-base font-semibold text-gray-400 uppercase tracking-wider mb-3">Recent Expenses</h3>
        {expenses.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            No expenses yet. Add your first expense above.
          </div>
        ) : (
          expenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between p-4 bg-[#0d0d1a] border border-gray-800 rounded-xl hover:border-gray-700 transition-all"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-white">{expense.description}</h4>
                  {expense.category && (
                    <span className="px-2 py-0.5 text-xs bg-violet-900/50 text-violet-300 rounded-md border border-violet-800/50">
                      {expense.category}
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {format(new Date(expense.date + 'T00:00:00'), 'MMM dd, yyyy')}
                </div>
                {expense.notes && (
                  <div className="text-sm text-gray-500 mt-1">{expense.notes}</div>
                )}
              </div>
              <div className="flex items-center gap-4">
                <div className="text-lg font-bold text-white">
                  £{expense.amount.toFixed(2)}
                </div>
                <button
                  onClick={() => deleteExpense(expense.id)}
                  className="text-gray-600 hover:text-red-400 text-sm transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
