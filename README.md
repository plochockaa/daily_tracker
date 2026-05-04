# Productivity Tracker

A full-stack productivity tracking application with meal planning, task management, and expense tracking capabilities.

## 🎯 Features

### Meal Planning
- Weekly meal planner with breakfast, lunch, and dinner slots
- Editable text fields for each meal
- Organized by day of the week (Monday-Sunday)

### Task Management
- Daily activity tracking with checkboxes
- Pre-defined tasks: shower, shampoo, workout
- Week-at-a-glance view of completed activities

### Finance Tracking
- Add expenses with descriptions and amounts
- Date selection (defaults to current date)
- Historical expense view

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14 (App Router, TypeScript, Tailwind CSS)
- **Backend**: FastAPI (Python 3.11+, Pydantic v2)
- **Database**: PostgreSQL 15
- **Infrastructure**: Terraform (AWS/GCP ready)
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions

### Project Structure
```
productivity-tracker/
├── frontend/              # Next.js application
│   ├── src/
│   │   ├── app/          # App router pages
│   │   ├── components/   # React components
│   │   ├── lib/          # Utilities and API clients
│   │   └── types/        # TypeScript type definitions
│   └── public/           # Static assets
├── backend/              # FastAPI application
│   ├── app/
│   │   ├── api/         # API routes
│   │   ├── models/      # SQLAlchemy models
│   │   ├── schemas/     # Pydantic schemas
│   │   └── core/        # Core configuration
│   ├── tests/           # Backend tests
│   └── alembic/         # Database migrations
├── infrastructure/       # Terraform configurations
│   ├── modules/         # Reusable Terraform modules
│   └── environments/    # Environment-specific configs
└── docs/                # Additional documentation
```

## 🚀 Getting Started

### Prerequisites
- Docker & Docker Compose (20.10+)
- Node.js 18+ (for local frontend development)
- Python 3.11+ (for local backend development)
- Terraform 1.5+ (for infrastructure deployment)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/productivity-tracker.git
   cd productivity-tracker
   ```

2. **Start all services with Docker Compose**
   ```bash
   docker-compose up -d
   ```

   This will start:
   - Frontend (Next.js): http://localhost:3000
   - Backend (FastAPI): http://localhost:8000
   - Database (PostgreSQL): localhost:5432
   - API Documentation: http://localhost:8000/docs

3. **Run database migrations**
   ```bash
   docker-compose exec backend alembic upgrade head
   ```

### Alternative: Local Development without Docker

#### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

#### Database Setup
```bash
# Start PostgreSQL locally or use Docker
docker run -d \
  --name productivity-db \
  -e POSTGRES_USER=productivity \
  -e POSTGRES_PASSWORD=localdev123 \
  -e POSTGRES_DB=productivity_tracker \
  -p 5432:5432 \
  postgres:15-alpine
```

## 📝 Development Workflow

### Running Tests
```bash
# Backend tests
make test-backend

# Frontend tests
make test-frontend

# All tests
make test
```

### Code Quality
```bash
# Format code
make format

# Lint code
make lint

# Type checking
make type-check
```

### Database Migrations
```bash
# Create a new migration
docker-compose exec backend alembic revision --autogenerate -m "description"

# Apply migrations
docker-compose exec backend alembic upgrade head

# Rollback migration
docker-compose exec backend alembic downgrade -1
```

## 🌍 Deployment

### Infrastructure Provisioning

1. **Configure AWS/GCP credentials**
   ```bash
   # AWS
   export AWS_ACCESS_KEY_ID=your_key
   export AWS_SECRET_ACCESS_KEY=your_secret
   
   # Or GCP
   export GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json
   ```

2. **Initialize Terraform**
   ```bash
   cd infrastructure/environments/dev
   terraform init
   ```

3. **Plan and apply infrastructure**
   ```bash
   terraform plan
   terraform apply
   ```

### Application Deployment
Deployment is automated via GitHub Actions on push to:
- `main` → Production environment
- `staging` → Staging environment
- `develop` → Development environment

## 🔐 Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/productivity_tracker
SECRET_KEY=your-secret-key-here
ENVIRONMENT=development
CORS_ORIGINS=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=Productivity Tracker
```

## 📊 API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Key Endpoints

#### Meal Planning
- `GET /api/v1/meals` - Get weekly meal plan
- `POST /api/v1/meals` - Create/update meal
- `PUT /api/v1/meals/{id}` - Update specific meal
- `DELETE /api/v1/meals/{id}` - Delete meal

#### Tasks
- `GET /api/v1/tasks` - Get weekly tasks
- `POST /api/v1/tasks` - Create task
- `PATCH /api/v1/tasks/{id}` - Toggle task completion
- `DELETE /api/v1/tasks/{id}` - Delete task

#### Finances
- `GET /api/v1/expenses` - Get expenses (with date filtering)
- `POST /api/v1/expenses` - Create expense
- `PUT /api/v1/expenses/{id}` - Update expense
- `DELETE /api/v1/expenses/{id}` - Delete expense
- `GET /api/v1/expenses/summary` - Get spending summary

## 🧪 Testing

### Backend Testing
```bash
cd backend
pytest tests/ -v --cov=app --cov-report=html
```

### Frontend Testing
```bash
cd frontend
npm run test
npm run test:e2e  # End-to-end tests with Playwright
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- **Frontend**: ESLint + Prettier (auto-formatting on save)
- **Backend**: Black + isort + Flake8 (enforced via pre-commit hooks)
- **Commits**: Conventional Commits format

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- FastAPI for the blazing-fast Python API framework
- PostgreSQL for reliable data storage

## 📞 Support

For issues and questions:
- GitHub Issues: [Create an issue](https://github.com/yourusername/productivity-tracker/issues)
- Email: support@productivity-tracker.com

---

**Built with ❤️ using Next.js, FastAPI, and PostgreSQL**
