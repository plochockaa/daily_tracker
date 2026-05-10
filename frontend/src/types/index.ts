// Type definitions for the application

export type DayOfWeek = 
  | 'monday' 
  | 'tuesday' 
  | 'wednesday' 
  | 'thursday' 
  | 'friday' 
  | 'saturday' 
  | 'sunday';

export type MealTime = 'breakfast' | 'lunch' | 'snack' | 'dinner';

export interface Meal {
  id: number;
  day_of_week: DayOfWeek;
  meal_time: MealTime;
  description: string | null;
  week_start_date: string;
  created_at: string;
  updated_at: string;
}

export interface MealCreate {
  day_of_week: DayOfWeek;
  meal_time: MealTime;
  description?: string;
  week_start_date: string;
}

export interface Task {
  id: number;
  name: string;
  day_of_week: DayOfWeek;
  week_start_date: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface TaskCreate {
  name: string;
  day_of_week: DayOfWeek;
  week_start_date: string;
  completed?: boolean;
}

export interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string | null;
  date: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ExpenseCreate {
  description: string;
  amount: number;
  category?: string;
  date?: string;
  notes?: string;
}

export interface ExpenseSummary {
  total_amount: number;
  count: number;
  start_date: string;
  end_date: string;
  by_category: Record<string, number>;
}

export const DAYS_OF_WEEK: DayOfWeek[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

export const MEAL_TIMES: MealTime[] = ['breakfast', 'lunch', 'snack', 'dinner'];

export const DEFAULT_TASKS = ['shower', 'shampoo', 'workout', 'tango'];
