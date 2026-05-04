# Productivity Tracker - Project Structure

This document provides a comprehensive overview of the project structure and organization.

## 📁 Root Directory

```
productivity-tracker/
├── .github/              # GitHub workflows and configurations
├── backend/              # FastAPI backend application
├── frontend/             # Next.js frontend application
├── infrastructure/       # Terraform infrastructure as code
├── docs/                 # Additional documentation
├── .gitignore           # Git ignore rules
├── docker-compose.yml   # Docker Compose configuration
├── Makefile            # Development commands
├── README.md           # Main project documentation
├── CONTRIBUTING.md     # Contribution guidelines
└── LICENSE             # MIT License
```

## 🔧 Backend Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                    # FastAPI application entry point
│   ├── api/
│   │   ├── __init__.py
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── router.py          # Main API router
│   │       └── endpoints/
│   │           ├── __init__.py
│   │           ├── meals.py       # Meal planning endpoints
│   │           ├── tasks.py       # Task management endpoints
│   │           └── expenses.py    # Expense tracking endpoints
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py              # Application configuration
│   │   └── database.py            # Database connection & session
│   ├── models/
│   │   ├── __init__.py
│   │   └── models.py              # SQLAlchemy ORM models
│   └── schemas/
│       ├── __init__.py
│       └── schemas.py             # Pydantic validation schemas
├── alembic/
│   ├── env.py                     # Alembic environment config
│   └── versions/
│       └── 001_initial.py         # Initial migration
├── tests/
│   └── __init__.py                # Backend tests
├── .env.example                   # Environment variables template
├── alembic.ini                    # Alembic configuration
├── Dockerfile                     # Production Docker image
├── init.sql                       # Database initialization script
└── requirements.txt               # Python dependencies
```

### Key Backend Files

- **main.py**: FastAPI application with CORS, health checks, and API routing
- **config.py**: Centralized configuration using Pydantic Settings
- **database.py**: SQLAlchemy engine, session factory, and dependency injection
- **models.py**: Database models for Meal, Task, and Expense
- **schemas.py**: Pydantic schemas for request/response validation
- **endpoints/*.py**: RESTful API endpoints with CRUD operations

## 🎨 Frontend Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout component
│   │   ├── page.tsx               # Home page with tab navigation
│   │   └── globals.css            # Global styles with Tailwind
│   ├── components/
│   │   ├── MealPlanning.tsx       # Weekly meal planner component
│   │   ├── Tasks.tsx              # Task tracking component
│   │   └── Finances.tsx           # Expense tracking component
│   ├── lib/
│   │   └── api.ts                 # Axios API client configuration
│   └── types/
│       └── index.ts               # TypeScript type definitions
├── public/                        # Static assets
├── .env.example                   # Environment variables template
├── Dockerfile.dev                 # Development Docker image
├── next.config.js                 # Next.js configuration
├── package.json                   # NPM dependencies and scripts
├── tailwind.config.js             # Tailwind CSS configuration
└── tsconfig.json                  # TypeScript configuration
```

### Key Frontend Files

- **page.tsx**: Main application with tabbed interface
- **MealPlanning.tsx**: Weekly grid for breakfast/lunch/dinner planning
- **Tasks.tsx**: Checkbox-based daily task tracker
- **Finances.tsx**: Expense entry form and list with date selection
- **api.ts**: Configured Axios client with interceptors
- **types/index.ts**: Shared TypeScript interfaces and enums

## 🏗️ Infrastructure Structure

```
infrastructure/
├── modules/
│   ├── networking/                # VPC, subnets, security groups
│   ├── database/                  # RDS PostgreSQL configuration
│   └── compute/                   # ECS Fargate for containers
└── environments/
    ├── dev/
    │   ├── main.tf                # Development environment config
    │   └── variables.tf           # Environment-specific variables
    ├── staging/
    │   └── ...                    # Staging environment
    └── prod/
        └── ...                    # Production environment
```

### Infrastructure Components

- **Networking**: VPC with public/private subnets, NAT gateways
- **Database**: RDS PostgreSQL with automated backups
- **Compute**: ECS Fargate tasks for backend and frontend
- **Load Balancer**: Application Load Balancer for traffic distribution

## 🔄 CI/CD Pipeline

```
.github/
└── workflows/
    └── ci-cd.yml                  # GitHub Actions workflow
```

### Pipeline Stages

1. **Backend Tests**: Linting, type checking, unit tests with coverage
2. **Frontend Tests**: ESLint, type checking, Jest tests
3. **Build**: Docker images for backend and frontend
4. **Deploy**: Terraform apply for infrastructure updates

## 🐳 Docker Configuration

- **docker-compose.yml**: Local development environment
  - PostgreSQL database
  - FastAPI backend
  - Next.js frontend
  - PgAdmin (optional)

## 🛠️ Development Tools

- **Makefile**: Common development commands
  - `make start`: Start all services
  - `make test`: Run all tests
  - `make lint`: Lint all code
  - `make format`: Format code
  - `make db-migrate`: Run database migrations

## 📝 Documentation

- **README.md**: Main project documentation
- **CONTRIBUTING.md**: Contribution guidelines
- **PROJECT_STRUCTURE.md**: This file
- **API Documentation**: Auto-generated at `/docs` endpoint

## 🔐 Environment Variables

### Backend (.env)
- `DATABASE_URL`: PostgreSQL connection string
- `SECRET_KEY`: Application secret key
- `CORS_ORIGINS`: Allowed CORS origins

### Frontend (.env.local)
- `NEXT_PUBLIC_API_URL`: Backend API URL

## 📦 Dependencies

### Backend
- **FastAPI**: Modern Python web framework
- **SQLAlchemy**: ORM for database operations
- **Alembic**: Database migration tool
- **Pydantic**: Data validation
- **Pytest**: Testing framework

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client
- **date-fns**: Date manipulation library

### Infrastructure
- **Terraform**: Infrastructure as Code
- **AWS**: Cloud provider (ECS, RDS, VPC)
- **Docker**: Containerization

## 🚀 Getting Started

1. Clone the repository
2. Copy `.env.example` files and configure
3. Run `docker-compose up -d`
4. Access frontend at http://localhost:3000
5. Access API docs at http://localhost:8000/docs

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Terraform Documentation](https://www.terraform.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
