"""
FastAPI application - all endpoints in one file for simplicity.
"""
import os
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date
from typing import List, Optional
from pydantic import BaseModel

from app.database import get_db, init_db, Meal, Task, Expense

# Initialize database on startup
init_db()

# Create FastAPI app
app = FastAPI(title="Productivity Tracker API", version="1.0.0")

# CORS - allow frontend to connect (set ALLOWED_ORIGINS env var in production)
_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in _origins.split(",")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic schemas
class MealCreate(BaseModel):
    day_of_week: str
    meal_time: str
    description: Optional[str] = None
    week_start_date: date

class TaskCreate(BaseModel):
    name: str
    day_of_week: str
    week_start_date: date
    completed: bool = False

class ExpenseCreate(BaseModel):
    description: str
    amount: float
    category: Optional[str] = None
    date: date
    notes: Optional[str] = None

# Health check
@app.get("/health")
def health_check():
    return {"status": "healthy", "version": "1.0.0"}

# Root endpoint
@app.get("/")
def root():
    return {
        "message": "Productivity Tracker API",
        "docs": "/docs",
        "health": "/health"
    }

# ========== MEALS ENDPOINTS ==========

@app.get("/api/v1/meals")
def get_meals(week_start_date: date, db: Session = Depends(get_db)):
    """Get all meals for a specific week."""
    meals = db.query(Meal).filter(Meal.week_start_date == week_start_date).all()
    return meals

@app.post("/api/v1/meals")
def create_meal(meal: MealCreate, db: Session = Depends(get_db)):
    """Create or update a meal."""
    # Check if meal exists
    existing = db.query(Meal).filter(
        Meal.day_of_week == meal.day_of_week,
        Meal.meal_time == meal.meal_time,
        Meal.week_start_date == meal.week_start_date
    ).first()
    
    if existing:
        existing.description = meal.description
        db.commit()
        db.refresh(existing)
        return existing
    
    new_meal = Meal(**meal.model_dump())
    db.add(new_meal)
    db.commit()
    db.refresh(new_meal)
    return new_meal

@app.delete("/api/v1/meals/{meal_id}")
def delete_meal(meal_id: int, db: Session = Depends(get_db)):
    """Delete a meal."""
    meal = db.query(Meal).filter(Meal.id == meal_id).first()
    if not meal:
        raise HTTPException(status_code=404, detail="Meal not found")
    db.delete(meal)
    db.commit()
    return {"message": "Meal deleted"}

# ========== TASKS ENDPOINTS ==========

@app.get("/api/v1/tasks")
def get_tasks(week_start_date: date, db: Session = Depends(get_db)):
    """Get all tasks for a specific week."""
    tasks = db.query(Task).filter(Task.week_start_date == week_start_date).all()
    return tasks

@app.post("/api/v1/tasks")
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    """Create a new task."""
    new_task = Task(**task.model_dump())
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

@app.post("/api/v1/tasks/batch")
def create_tasks_batch(tasks: List[TaskCreate], db: Session = Depends(get_db)):
    """Create multiple tasks at once."""
    new_tasks = [Task(**task.model_dump()) for task in tasks]
    db.add_all(new_tasks)
    db.commit()
    for task in new_tasks:
        db.refresh(task)
    return new_tasks

@app.patch("/api/v1/tasks/{task_id}")
def update_task(task_id: int, completed: bool, db: Session = Depends(get_db)):
    """Toggle task completion."""
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    task.completed = completed
    db.commit()
    db.refresh(task)
    return task

@app.delete("/api/v1/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    """Delete a task."""
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
    return {"message": "Task deleted"}

# ========== EXPENSES ENDPOINTS ==========

@app.get("/api/v1/expenses")
def get_expenses(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get expenses with optional filters."""
    query = db.query(Expense)
    if start_date:
        query = query.filter(Expense.date >= start_date)
    if end_date:
        query = query.filter(Expense.date <= end_date)
    expenses = query.order_by(Expense.date.desc()).limit(limit).all()
    return expenses

@app.post("/api/v1/expenses")
def create_expense(expense: ExpenseCreate, db: Session = Depends(get_db)):
    """Create a new expense."""
    new_expense = Expense(**expense.model_dump())
    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)
    return new_expense

@app.delete("/api/v1/expenses/{expense_id}")
def delete_expense(expense_id: int, db: Session = Depends(get_db)):
    """Delete an expense."""
    expense = db.query(Expense).filter(Expense.id == expense_id).first()
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    db.delete(expense)
    db.commit()
    return {"message": "Expense deleted"}

@app.get("/api/v1/expenses/summary")
def get_expense_summary(
    start_date: date,
    end_date: date,
    db: Session = Depends(get_db)
):
    """Get expense summary for a date range."""
    summary = db.query(
        func.sum(Expense.amount).label("total"),
        func.count(Expense.id).label("count")
    ).filter(
        Expense.date >= start_date,
        Expense.date <= end_date
    ).first()
    
    by_category = db.query(
        Expense.category,
        func.sum(Expense.amount).label("total")
    ).filter(
        Expense.date >= start_date,
        Expense.date <= end_date
    ).group_by(Expense.category).all()
    
    return {
        "total_amount": float(summary.total) if summary.total else 0.0,
        "count": summary.count if summary.count else 0,
        "start_date": start_date,
        "end_date": end_date,
        "by_category": {cat or "Uncategorized": float(total) for cat, total in by_category}
    }
