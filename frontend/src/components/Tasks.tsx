'use client';

import { useState, useEffect } from 'react';
import { startOfWeek, format, addDays } from 'date-fns';
import apiClient from '@/lib/api';
import { DAYS_OF_WEEK, DEFAULT_TASKS, Task, TaskCreate, DayOfWeek } from '@/types';

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [weekStart, setWeekStart] = useState(() =>
    format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd')
  );
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(false);

  const weekStartDate = new Date(weekStart + 'T00:00:00');
  const weekEndDate = addDays(weekStartDate, 6);
  const weekLabel = `${format(weekStartDate, 'MMM d')} - ${format(weekEndDate, 'MMM d, yyyy')}`;
  const currentWeekStart = format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');
  const isCurrentWeek = weekStart === currentWeekStart;

  useEffect(() => {
    setTasks([]);
    setApiError(false);
    loadTasks();
  }, [weekStart]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<Task[]>(`/tasks?week_start_date=${weekStart}`);
      setTasks(response.data);
      if (response.data.length === 0) {
        await initializeDefaultTasks();
      }
    } catch (error) {
      setApiError(true);
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeDefaultTasks = async () => {
    const tasksToCreate: TaskCreate[] = [];
    DAYS_OF_WEEK.forEach((day) => {
      DEFAULT_TASKS.forEach((taskName) => {
        tasksToCreate.push({ name: taskName, day_of_week: day, week_start_date: weekStart, completed: false });
      });
    });
    try {
      const response = await apiClient.post<Task[]>('/tasks/batch', tasksToCreate);
      setTasks(response.data);
    } catch (error) {
      console.error('Error initializing tasks:', error);
    }
  };

  const toggleTask = async (taskId: number, currentStatus: boolean) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !currentStatus } : t));
    try {
      await apiClient.patch<Task>(`/tasks/${taskId}?completed=${!currentStatus}`);
    } catch (error) {
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: currentStatus } : t));
      console.error('Error toggling task:', error);
    }
  };

  const createAndToggleTask = async (day: DayOfWeek, taskName: string) => {
    const tempId = Date.now();
    const optimistic: Task = {
      id: tempId, name: taskName, day_of_week: day,
      week_start_date: weekStart, completed: true, created_at: '', updated_at: '',
    };
    setTasks(prev => [...prev, optimistic]);
    try {
      const response = await apiClient.post<Task>('/tasks', {
        name: taskName, day_of_week: day, week_start_date: weekStart, completed: true,
      });
      setTasks(prev => prev.map(t => t.id === tempId ? response.data : t));
    } catch (error) {
      setTasks(prev => prev.filter(t => t.id !== tempId));
      console.error('Error creating task:', error);
    }
  };

  const getTaskStatus = (day: DayOfWeek, taskName: string): Task | undefined =>
    tasks.find((t) => t.day_of_week === day && t.name === taskName);

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

      {apiError && (
        <div className="mb-4 p-3 bg-red-950 border border-red-800 rounded-lg text-sm text-red-400">
          Could not connect to the server. Check that your backend is deployed and <code>NEXT_PUBLIC_API_URL</code> is set correctly in Vercel.
        </div>
      )}

      {loading && <div className="text-center py-2 text-gray-600 text-sm">Syncing...</div>}

      <div className="overflow-x-auto rounded-xl border border-gray-800">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-[#0d0d1a]">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 border-b border-r border-gray-800 w-28">
                Activity
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
            {DEFAULT_TASKS.map((taskName, rowIndex) => (
              <tr key={taskName} className={rowIndex % 2 === 0 ? 'bg-[#1a1a2e]' : 'bg-[#161628]'}>
                <td className="px-4 py-3 text-sm font-semibold text-gray-300 capitalize border-r border-gray-800">
                  {taskName}
                </td>
                {DAYS_OF_WEEK.map((day) => {
                  const task = getTaskStatus(day, taskName);
                  return (
                    <td key={`${day}-${taskName}`} className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={task?.completed ?? false}
                        onChange={() =>
                          task
                            ? toggleTask(task.id, task.completed)
                            : createAndToggleTask(day, taskName)
                        }
                        className="w-5 h-5 cursor-pointer accent-violet-500 rounded"
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
