.PHONY: help install dev build start test test-watch test-cov lint lint-fix format format-check docker-up docker-down docker-logs docker-dev docker-build docker-clean db-setup db-migrate db-seed db-studio db-reset setup clean clean-all

# Default target
help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-20s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# Installation
install: ## Install dependencies
	nvm use && npm install --legacy-peer-deps

# Development
dev: ## Start development server
	npm run start:dev

build: ## Build for production
	npm run build

start: ## Start production server
	npm run start:prod

# Testing
test: ## Run tests
	npm run test

test-watch: ## Run tests in watch mode
	npm run test:watch

test-cov: ## Run tests with coverage
	npm run test:cov

# Code Quality
lint: ## Run ESLint
	npm run lint

lint-fix: ## Fix ESLint errors
	npm run lint:fix

format: ## Format code with Prettier
	npm run format

format-check: ## Check code formatting
	npm run format:check

# Docker
docker-up: ## Start all Docker services
	docker-compose up -d

docker-down: ## Stop all Docker services
	docker-compose down

docker-logs: ## View Docker logs
	docker-compose logs -f

docker-dev: ## Start only PostgreSQL for development
	docker-compose -f docker-compose.dev.yml up -d

docker-build: ## Build Docker images
	docker-compose build

docker-clean: ## Stop and remove all containers, volumes
	docker-compose down -v

# Database
db-setup: ## Run migrations and generate Prisma client
	npm run db:setup

db-migrate: ## Run database migrations
	npm run prisma:migrate

db-seed: ## Seed the database
	npm run db:seed

db-studio: ## Open Prisma Studio
	npm run prisma:studio

db-reset: ## Reset database (WARNING: deletes all data)
	npm run prisma:migrate reset

# Setup
setup: install db-setup db-seed ## Complete project setup (install + db + seed)

# Cleanup
clean: ## Remove build artifacts and node_modules
	rm -rf dist node_modules coverage

clean-all: clean docker-clean ## Clean everything including Docker volumes

