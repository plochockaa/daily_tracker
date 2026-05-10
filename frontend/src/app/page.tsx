'use client';

import { useState } from 'react';
import MealPlanning from '@/components/MealPlanning';
import Tasks from '@/components/Tasks';
import Finances from '@/components/Finances';

type Tab = 'meals' | 'tasks' | 'finances';

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: 'meals', label: 'Meal Planning', icon: '🍽️' },
  { key: 'tasks', label: 'Tasks', icon: '✓' },
  { key: 'finances', label: 'Finances', icon: '💰' },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('meals');

  return (
    <main className="min-h-screen bg-[#0d0d1a] text-white">
      <div className="container mx-auto px-4 py-10 max-w-7xl">

        <header className="mb-10 text-center">
          <h1 className="text-5xl font-bold text-white mb-3 flex items-center justify-center gap-3">
            <span className="text-pink-500">♥</span>
            Daily Tracker
          </h1>
          <p className="text-gray-400 italic text-lg">For my love, A</p>
        </header>

        <div className="bg-[#1a1a2e] rounded-2xl mb-6 p-1.5">
          <nav className="flex gap-1">
            {TABS.map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  activeTab === key
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/40'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{icon}</span>
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div className="bg-[#1a1a2e] rounded-2xl p-6">
          <div className={activeTab !== 'meals' ? 'hidden' : ''}><MealPlanning /></div>
          <div className={activeTab !== 'tasks' ? 'hidden' : ''}><Tasks /></div>
          <div className={activeTab !== 'finances' ? 'hidden' : ''}><Finances /></div>
        </div>

      </div>
    </main>
  );
}
