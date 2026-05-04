# Contributing to Productivity Tracker

Thank you for your interest in contributing to Productivity Tracker! This document provides guidelines and instructions for contributing.

## Code of Conduct

This project adheres to a Code of Conduct that all contributors are expected to follow. Please be respectful and professional in all interactions.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/yourusername/productivity-tracker.git
   cd productivity-tracker
   ```
3. **Add the upstream remote**:
   ```bash
   git remote add upstream https://github.com/original-owner/productivity-tracker.git
   ```

## Development Workflow

### Setting Up Your Environment

Follow the setup instructions in the README.md to get your local development environment running.

### Creating a Branch

Always create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Adding or updating tests

### Making Changes

1. **Write clean, readable code** following the project's style guide
2. **Add tests** for new functionality
3. **Update documentation** as needed
4. **Commit regularly** with clear, descriptive messages

### Commit Message Format

We follow the Conventional Commits specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(meals): add weekly meal export functionality

fix(tasks): resolve checkbox state persistence issue

docs(readme): update installation instructions
```

### Code Style

#### Backend (Python)
- Follow PEP 8 style guide
- Use Black for code formatting
- Use isort for import sorting
- Maximum line length: 100 characters
- Add type hints to all functions
- Write docstrings for all public functions and classes

Run formatting:
```bash
cd backend
black app/ tests/
isort app/ tests/
```

Run linting:
```bash
flake8 app/ tests/
mypy app/
```

#### Frontend (TypeScript/React)
- Follow the project's ESLint configuration
- Use Prettier for formatting
- Use meaningful variable and function names
- Add TypeScript types for all props and functions
- Keep components small and focused

Run formatting:
```bash
cd frontend
npm run format
```

Run linting:
```bash
npm run lint
```

### Testing

#### Backend Tests
```bash
cd backend
pytest tests/ -v --cov=app
```

#### Frontend Tests
```bash
cd frontend
npm run test
```

All tests must pass before submitting a pull request.

### Submitting a Pull Request

1. **Update your branch** with the latest upstream changes:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Push your branch** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create a Pull Request** on GitHub with:
   - Clear title describing the change
   - Detailed description of what changed and why
   - Reference to any related issues
   - Screenshots for UI changes
   - Test results if applicable

4. **Respond to feedback** from reviewers promptly

### Pull Request Checklist

- [ ] Code follows the project's style guidelines
- [ ] All tests pass locally
- [ ] New tests added for new functionality
- [ ] Documentation updated
- [ ] Commit messages follow the conventional format
- [ ] No merge conflicts with main branch
- [ ] PR description clearly explains the changes

## Reporting Issues

When reporting bugs, please include:

1. **Clear title** describing the issue
2. **Steps to reproduce** the problem
3. **Expected behavior** vs actual behavior
4. **Environment details** (OS, browser, versions)
5. **Screenshots or logs** if applicable
6. **Possible solution** if you have one

## Feature Requests

We welcome feature requests! Please:

1. Check if the feature already exists or has been requested
2. Clearly describe the feature and its benefits
3. Provide use cases and examples
4. Be open to discussion and feedback

## Development Tips

### Running Specific Services

```bash
# Run only the backend
docker-compose up backend db

# Run only the frontend
docker-compose up frontend

# Run with logs
docker-compose up -d && docker-compose logs -f
```

### Database Migrations

```bash
# Create a new migration
docker-compose exec backend alembic revision --autogenerate -m "description"

# Apply migrations
docker-compose exec backend alembic upgrade head

# Rollback
docker-compose exec backend alembic downgrade -1
```

### Debugging

- Backend: Add breakpoints using `pdb` or your IDE
- Frontend: Use browser DevTools and React DevTools
- Check logs: `docker-compose logs -f [service-name]`

## Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Terraform Documentation](https://www.terraform.io/docs)

## Questions?

If you have questions about contributing, feel free to:
- Open a GitHub Discussion
- Reach out to the maintainers
- Check existing issues and PRs for similar questions

Thank you for contributing! 🎉
