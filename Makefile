.PHONY: help setup start stop clean test lint format build deploy

# Default target
help:
	@echo "Available commands:"
	@echo "  make setup         - Initial project setup"
	@echo "  make start         - Start all services"
	@echo "  make stop          - Stop all services"
	@echo "  make clean         - Clean up containers and volumes"
	@echo "  make test          - Run all tests"
	@echo "  make test-backend  - Run backend tests"
	@echo "  make test-frontend - Run frontend tests"
	@echo "  make lint          - Lint all code"
	@echo "  make format        - Format all code"
	@echo "  make build         - Build all containers"
	@echo "  make logs          - Show service logs"
	@echo "  make db-migrate    - Run database migrations"
	@echo "  make db-shell      - Open database shell"

# Initial setup
setup:
	@echo "Setting up project..."
	cp .env.example .env 2>/dev/null || echo "No .env.example found"
	cd frontend && npm install
	cd backend && python -m venv venv && . venv/bin/activate && pip install -r requirements.txt
	@echo "Setup complete! Run 'make start' to start services."

# Start all services
start:
	docker-compose up -d
	@echo "Services started!"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend API: http://localhost:8000"
	@echo "API Docs: http://localhost:8000/docs"

# Start with logs
start-logs:
	docker-compose up

# Stop all services
stop:
	docker-compose down

# Clean up everything
clean:
	docker-compose down -v --remove-orphans
	rm -rf frontend/.next
	rm -rf frontend/node_modules
	rm -rf backend/__pycache__
	rm -rf backend/.pytest_cache
	@echo "Cleanup complete!"

# Build containers
build:
	docker-compose build

# Show logs
logs:
	docker-compose logs -f

# Backend logs only
logs-backend:
	docker-compose logs -f backend

# Frontend logs only
logs-frontend:
	docker-compose logs -f frontend

# Run all tests
test: test-backend test-frontend

# Run backend tests
test-backend:
	cd backend && python -m pytest tests/ -v --cov=app --cov-report=term-missing

# Run frontend tests
test-frontend:
	cd frontend && npm run test

# Lint all code
lint: lint-backend lint-frontend

# Lint backend
lint-backend:
	cd backend && flake8 app/ tests/
	cd backend && mypy app/

# Lint frontend
lint-frontend:
	cd frontend && npm run lint

# Format all code
format: format-backend format-frontend

# Format backend
format-backend:
	cd backend && black app/ tests/
	cd backend && isort app/ tests/

# Format frontend
format-frontend:
	cd frontend && npm run format

# Type checking
type-check:
	cd backend && mypy app/
	cd frontend && npm run type-check

# Database migrations
db-migrate:
	docker-compose exec backend alembic upgrade head

# Create new migration
db-migration-create:
	@read -p "Enter migration message: " msg; \
	docker-compose exec backend alembic revision --autogenerate -m "$$msg"

# Rollback migration
db-rollback:
	docker-compose exec backend alembic downgrade -1

# Database shell
db-shell:
	docker-compose exec db psql -U productivity -d productivity_tracker

# Backend shell
backend-shell:
	docker-compose exec backend /bin/bash

# Frontend shell
frontend-shell:
	docker-compose exec frontend /bin/sh

# Restart services
restart:
	docker-compose restart

# Restart backend only
restart-backend:
	docker-compose restart backend

# Restart frontend only
restart-frontend:
	docker-compose restart frontend

# Install pre-commit hooks
install-hooks:
	cd backend && pre-commit install

# Run security checks
security-check:
	cd backend && safety check
	cd frontend && npm audit

# Infrastructure commands
tf-init:
	cd infrastructure/environments/dev && terraform init

tf-plan:
	cd infrastructure/environments/dev && terraform plan

tf-apply:
	cd infrastructure/environments/dev && terraform apply

tf-destroy:
	cd infrastructure/environments/dev && terraform destroy

# Production build
build-prod:
	cd frontend && npm run build
	cd backend && pip install -r requirements.txt --no-dev
