'use client';

import { useState, useEffect } from 'react';
import { startOfWeek, format, addDays } from 'date-fns';
import apiClient from '@/lib/api';
import { DAYS_OF_WEEK, MEAL_TIMES, Meal, MealCreate, DayOfWeek, MealTime } from '@/types';

export default function MealPlanning() {
  const [meals, setMeals] = useState<Record<string, string>>({});
  const [weekStart, setWeekStart] = useState(() =>
    format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd')
  );
  const [loading, setLoading] = useState(true);

  const weekStartDate = new Date(weekStart + 'T00:00:00');
  const weekEndDate = addDays(weekStartDate, 6);
  const weekLabel = `${format(weekStartDate, 'MMM d')} - ${format(weekEndDate, 'MMM d, yyyy')}`;
  const currentWeekStart = format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');
  const isCurrentWeek = weekStart === currentWeekStart;

  useEffect(() => {
    setMeals({});
    loadMeals();
  }, [weekStart]);

  const loadMeals = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<Meal[]>(`/meals?week_start_date=${weekStart}`);
      const mealMap: Record<string, string> = {};
      response.data.forEach((meal) => {
        mealMap[`${meal.day_of_week}-${meal.meal_time}`] = meal.description || '';
      });
      setMeals(mealMap);
    } catch (error) {
      console.error('Error loading meals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMealChange = (day: DayOfWeek, mealTime: MealTime, value: string) => {
    setMeals({ ...meals, [`${day}-${mealTime}`]: value });
  };

  const handleMealBlur = async (day: DayOfWeek, mealTime: MealTime) => {
    const key = `${day}-${mealTime}`;
    try {
      const mealData: MealCreate = {
        day_of_week: day,
        meal_time: mealTime,
        description: meals[key] || '',
        week_start_date: weekStart,
      };
      await apiClient.post('/meals', mealData);
    } catch (error) {
      console.error('Error saving meal:', error);
    }
  };

  const goToPreviousWeek = () =>
    setWeekStart(format(addDays(new Date(weekStart + 'T00:00:00'), -7), 'yyyy-MM-dd'));

  const goToNextWeek = () =>
    setWeekStart(format(addDays(new Date(weekStart + 'T00:00:00'), 7), 'yyyy-MM-dd'));

  const goToCurrentWeek = () =>
    setWeekStart(format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd'));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goToPreviousWeek}
          className="px-4 py-2 bg-[#0d0d1a] hover:bg-gray-800 border border-gray-700 rounded-lg text-sm font-medium text-gray-300 hover:text-white transition-all"
        >
          ← Previous
        </button>
        <div className="text-center">
          <div className="text-white font-semibold text-lg">{weekLabel}</div>
          <button
            onClick={goToCurrentWeek}
            className={`text-xs uppercase tracking-widest font-medium transition-colors ${
              isCurrentWeek ? 'text-violet-400 cursor-default' : 'text-gray-500 hover:text-violet-400'
            }`}
          >
            This Week
          </button>
        </div>
        <button
          onClick={goToNextWeek}
          className="px-4 py-2 bg-[#0d0d1a] hover:bg-gray-800 border border-gray-700 rounded-lg text-sm font-medium text-gray-300 hover:text-white transition-all"
        >
          Next →
        </button>
      </div>

      {loading && <div className="text-center py-4 text-gray-500 text-sm">Loading...</div>}

      <div className="overflow-x-auto rounded-xl border border-gray-800">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-[#0d0d1a]">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 border-b border-r border-gray-800 w-24">
                Meal
              </th>
              {DAYS_OF_WEEK.map((day, index) => (
                <th key={day} className="px-2 py-3 text-center border-b border-gray-800">
                  <div className="text-sm font-semibold text-white capitalize">{day}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {format(addDays(weekStartDate, index), 'MMM d')}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MEAL_TIMES.map((mealTime, rowIndex) => (
              <tr key={mealTime} className={rowIndex % 2 === 0 ? 'bg-[#1a1a2e]' : 'bg-[#161628]'}>
                <td className="px-4 py-3 text-sm font-semibold text-gray-300 capitalize border-r border-gray-800">
                  {mealTime}
                </td>
                {DAYS_OF_WEEK.map((day) => {
                  const key = `${day}-${mealTime}`;
                  return (
                    <td key={key} className="px-2 py-2">
                      <input
                        type="text"
                        value={meals[key] || ''}
                        onChange={(e) => handleMealChange(day, mealTime, e.target.value)}
                        onBlur={() => handleMealBlur(day, mealTime)}
                        className="w-full px-3 py-1.5 bg-[#0d0d1a] border border-gray-700 rounded-lg text-sm text-white placeholder-gray-700 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                        placeholder="Enter meal..."
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
