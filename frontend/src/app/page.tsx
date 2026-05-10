'use client';

import { useState } from 'react';
import MealPlanning from '@/components/MealPlanning';
import Tasks from '@/components/Tasks';
import Finances from '@/components/Finances';

type Tab = 'meals' | 'tasks' | 'finances';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('meals');

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Daily Tracker
          </h1>
          <p className="text-gray-600 italic">
            For my love, A
          </p>
        </header>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <nav className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('meals')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'meals'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              🍽️ Meal Planning
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'tasks'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              ✓ Tasks
            </button>
            <button
              onClick={() => setActiveTab('finances')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'finances'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              💰 Finances
            </button>
          </nav>
        </div>

        {/* Tab Content — keep all mounted so state isn't lost on tab switch */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className={activeTab !== 'meals' ? 'hidden' : ''}><MealPlanning /></div>
          <div className={activeTab !== 'tasks' ? 'hidden' : ''}><Tasks /></div>
          <div className={activeTab !== 'finances' ? 'hidden' : ''}><Finances /></div>
        </div>
      </div>
    </main>
  );
}
