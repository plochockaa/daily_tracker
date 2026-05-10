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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTasks([]);
    loadTasks();
  }, [weekStart]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<Task[]>(`/tasks?week_start_date=${weekStart}`);
      setTasks(response.data);

      // Initialize default tasks if none exist
      if (response.data.length === 0) {
        await initializeDefaultTasks();
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeDefaultTasks = async () => {
    const tasksToCreate: TaskCreate[] = [];
    DAYS_OF_WEEK.forEach((day) => {
      DEFAULT_TASKS.forEach((taskName) => {
        tasksToCreate.push({
          name: taskName,
          day_of_week: day,
          week_start_date: weekStart,
          completed: false,
        });
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
    try {
      const taskData: TaskCreate = {
        name: taskName,
        day_of_week: day,
        week_start_date: weekStart,
        completed: true,
      };
      const response = await apiClient.post<Task>('/tasks', taskData);
      setTasks([...tasks, response.data]);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const getTaskStatus = (day: DayOfWeek, taskName: string): Task | undefined => {
    return tasks.find((t) => t.day_of_week === day && t.name === taskName);
  };

  const goToPreviousWeek = () => {
    const prevWeek = format(addDays(new Date(weekStart + 'T00:00:00'), -7), 'yyyy-MM-dd');
    setWeekStart(prevWeek);
  };

  const goToNextWeek = () => {
    const nextWeek = format(addDays(new Date(weekStart + 'T00:00:00'), 7), 'yyyy-MM-dd');
    setWeekStart(nextWeek);
  };

  const goToCurrentWeek = () => {
    setWeekStart(format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd'));
  };

  if (loading) {
    return <div className="text-center py-8">Loading tasks...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Weekly Tasks</h2>
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
        Week of {format(new Date(weekStart + 'T00:00:00'), 'MMM dd, yyyy')}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-gray-300 bg-gray-100 px-4 py-2 text-left font-semibold">
                Activity
              </th>
              {DAYS_OF_WEEK.map((day) => (
                <th
                  key={day}
                  className="border border-gray-300 bg-gray-100 px-4 py-2 text-center font-semibold capitalize"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DEFAULT_TASKS.map((taskName) => (
              <tr key={taskName}>
                <td className="border border-gray-300 bg-gray-50 px-4 py-2 font-medium capitalize">
                  {taskName}
                </td>
                {DAYS_OF_WEEK.map((day) => {
                  const task = getTaskStatus(day, taskName);
                  return (
                    <td key={`${day}-${taskName}`} className="border border-gray-300 px-4 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={task?.completed ?? false}
                        onChange={() =>
                          task
                            ? toggleTask(task.id, task.completed)
                            : createAndToggleTask(day, taskName)
                        }
                        className="w-5 h-5 cursor-pointer accent-primary-500"
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
