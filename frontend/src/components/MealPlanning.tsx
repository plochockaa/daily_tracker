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

  useEffect(() => {
    loadMeals();
  }, [weekStart]);

  const loadMeals = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<Meal[]>(`/meals?week_start_date=${weekStart}`);
      const mealMap: Record<string, string> = {};
      response.data.forEach((meal) => {
        const key = `${meal.day_of_week}-${meal.meal_time}`;
        mealMap[key] = meal.description || '';
      });
      setMeals(mealMap);
    } catch (error) {
      console.error('Error loading meals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMealChange = (day: DayOfWeek, mealTime: MealTime, value: string) => {
    const key = `${day}-${mealTime}`;
    setMeals({ ...meals, [key]: value });
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

  const goToPreviousWeek = () => {
    const prevWeek = format(
      addDays(new Date(weekStart), -7),
      'yyyy-MM-dd'
    );
    setWeekStart(prevWeek);
  };

  const goToNextWeek = () => {
    const nextWeek = format(
      addDays(new Date(weekStart), 7),
      'yyyy-MM-dd'
    );
    setWeekStart(nextWeek);
  };

  const goToCurrentWeek = () => {
    setWeekStart(format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd'));
  };

  if (loading) {
    return <div className="text-center py-8">Loading meal plan...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Weekly Meal Plan</h2>
        <div className="flex gap-2">
          <button
            onClick={goToPreviousWeek}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm font-medium"
          >
            ← Previous
          </button>
          <button
            onClick={goToCurrentWeek}
            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-md text-sm font-medium"
          >
            This Week
          </button>
          <button
            onClick={goToNextWeek}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm font-medium"
          >
            Next →
          </button>
        </div>
      </div>

      <div className="text-sm text-gray-600 mb-4">
        Week of {format(new Date(weekStart), 'MMM dd, yyyy')}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-gray-300 bg-gray-100 px-4 py-2 text-left font-semibold">
                Meal
              </th>
              {DAYS_OF_WEEK.map((day, index) => (
                <th
                  key={day}
                  className="border border-gray-300 bg-gray-100 px-4 py-2 text-left font-semibold capitalize"
                >
                  <div>{day}</div>
                  <div className="text-xs font-normal text-gray-500">
                    {format(addDays(new Date(weekStart + 'T00:00:00'), index), 'MMM d')}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MEAL_TIMES.map((mealTime) => (
              <tr key={mealTime}>
                <td className="border border-gray-300 bg-gray-50 px-4 py-2 font-medium capitalize">
                  {mealTime}
                </td>
                {DAYS_OF_WEEK.map((day) => {
                  const key = `${day}-${mealTime}`;
                  return (
                    <td key={key} className="border border-gray-300 px-2 py-2">
                      <input
                        type="text"
                        value={meals[key] || ''}
                        onChange={(e) => handleMealChange(day, mealTime, e.target.value)}
                        onBlur={() => handleMealBlur(day, mealTime)}
                        className="w-full px-2 py-1 border-none focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
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
