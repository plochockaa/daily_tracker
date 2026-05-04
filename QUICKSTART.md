# Productivity Tracker - Quick Start Guide

Get up and running with Productivity Tracker in under 5 minutes!

## Prerequisites

Make sure you have these installed:
- [Docker](https://docs.docker.com/get-docker/) (v20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2.0+)

That's it! Everything else runs in containers.

## 🚀 Fast Start (3 Steps)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/productivity-tracker.git
cd productivity-tracker
```

### 2. Start the Application

```bash
docker-compose up -d
```

This command will:
- Download the necessary Docker images
- Start PostgreSQL database
- Start the FastAPI backend
- Start the Next.js frontend
- Run database migrations

### 3. Open Your Browser

- **Frontend Application**: http://localhost:3000
- **API Documentation**: http://localhost:8000/docs
- **API Health Check**: http://localhost:8000/health

🎉 **You're ready to go!** Start tracking your meals, tasks, and expenses.

## 📱 Using the Application

### Meal Planning
1. Click the "Meal Planning" tab
2. Click on any cell in the weekly grid
3. Type your meal (e.g., "Chicken Salad")
4. Changes save automatically!

### Tasks
1. Click the "Tasks" tab
2. Check off activities as you complete them
3. Track shower, shampoo, workout across the week
4. Your progress persists automatically

### Finances
1. Click the "Finances" tab
2. Click "+ Add Expense"
3. Fill in description, amount, category, and date
4. Submit to track your spending

## 🛑 Stopping the Application

```bash
docker-compose down
```

To remove all data and start fresh:
```bash
docker-compose down -v
```

## 🔍 Viewing Logs

See what's happening:
```bash
# All services
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# Frontend only
docker-compose logs -f frontend

# Database only
docker-compose logs -f db
```

## 🔧 Common Commands

```bash
# Restart all services
docker-compose restart

# Restart just the backend
docker-compose restart backend

# View running containers
docker-compose ps

# Access backend shell
docker-compose exec backend /bin/bash

# Access database shell
docker-compose exec db psql -U productivity -d productivity_tracker
```

## 🐛 Troubleshooting

### Port Already in Use

If ports 3000 or 8000 are already in use:

```bash
# Check what's using the port
lsof -i :3000
lsof -i :8000

# Kill the process or change ports in docker-compose.yml
```

### Database Connection Issues

```bash
# Check if database is healthy
docker-compose ps

# Restart database
docker-compose restart db

# View database logs
docker-compose logs db
```

### Frontend Not Loading

```bash
# Clear Next.js cache
docker-compose down
docker volume rm productivity-tracker_frontend_node_modules
docker-compose up -d
```

### Reset Everything

```bash
# Nuclear option: remove everything and start fresh
docker-compose down -v
docker system prune -a
docker-compose up -d
```

## 🔄 Updating the Application

```bash
# Pull latest changes
git pull origin main

# Rebuild containers
docker-compose down
docker-compose build
docker-compose up -d

# Run any new migrations
docker-compose exec backend alembic upgrade head
```

## 📊 Database Migrations

```bash
# View current migration status
docker-compose exec backend alembic current

# Apply pending migrations
docker-compose exec backend alembic upgrade head

# Rollback last migration
docker-compose exec backend alembic downgrade -1

# Create new migration
docker-compose exec backend alembic revision --autogenerate -m "your message"
```

## 🧪 Running Tests

### Backend Tests
```bash
# Run all backend tests
docker-compose exec backend pytest tests/ -v

# Run with coverage
docker-compose exec backend pytest tests/ -v --cov=app
```

### Frontend Tests
```bash
# Run frontend tests
docker-compose exec frontend npm run test
```

## 🎨 Development Mode

For active development with hot-reload:

```bash
# Backend hot-reload is enabled by default
# Frontend hot-reload is enabled by default

# Make code changes and see them instantly
```

## 📚 Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check [CONTRIBUTING.md](CONTRIBUTING.md) if you want to contribute
- Review [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) to understand the codebase
- Explore the API at http://localhost:8000/docs

## 💡 Pro Tips

1. **Week Navigation**: Use "Previous Week" and "Next Week" buttons to plan ahead
2. **Auto-Save**: All changes in Meal Planning save automatically as you type
3. **Task Batching**: Tasks are automatically created for each day when you first load
4. **Expense Filtering**: Use the date filters in the Finances tab to view specific periods
5. **Categories**: Add categories to your expenses for better tracking

## 🆘 Need Help?

- Check existing [GitHub Issues](https://github.com/yourusername/productivity-tracker/issues)
- Read the [FAQ section in README](README.md#faq)
- Create a new issue with the bug/question template

## 🎯 What's Next?

Now that you're up and running, you can:
- Customize the task list (edit `frontend/src/types/index.ts`)
- Add more meal times (breakfast, lunch, dinner, snacks)
- Create expense categories that fit your needs
- Deploy to production (see [README.md](README.md#deployment))

Happy tracking! 🚀
