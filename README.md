# NestJS Starter Template

A production-ready NestJS starter template with authentication, user management, role-based access control (RBAC), and best practices.

## Features

- ✅ **Authentication & Authorization**
  - JWT-based authentication
  - Refresh token mechanism
  - Role-based access control (RBAC)
  - Permission system

- ✅ **Database**
  - Prisma ORM with PostgreSQL
  - Kysely query builder integration
  - Automatic type generation
  - Database migrations

- ✅ **API Features**
  - RESTful API design
  - Swagger/OpenAPI documentation
  - Request validation (class-validator)
  - Consistent response format
  - Centralized error handling

- ✅ **Code Quality**
  - TypeScript strict mode
  - ESLint + Prettier
  - Husky + lint-staged (pre-commit hooks)
  - Commitlint (commit message validation)
  - Repository pattern
  - Modular architecture

- ✅ **DevOps**
  - Health check endpoint
  - Environment configuration
  - Database seeding
  - CORS support

## Tech Stack

- **Framework**: NestJS 11
- **Language**: TypeScript 5.7
- **Database**: PostgreSQL
- **ORM**: Prisma 7
- **Query Builder**: Kysely
- **Authentication**: JWT (passport-jwt)
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI

## Prerequisites

- Node.js >= 20.x
- PostgreSQL >= 14.x
- npm or yarn

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd nestjs-starter
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000

# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/nestjs_starter_db?schema=public

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=3600

# CORS (optional)
CORS_ORIGIN=*

# Environment
NODE_ENV=development
```

### 4. Database Setup

```bash
# Run migrations and generate Prisma client
npm run db:setup

# Or separately:
npm run prisma:migrate    # Run migrations
npm run prisma:generate   # Generate Prisma client

# Seed the database
npm run db:seed
```

### 5. Start the application

```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod
```

The API will be available at:
- API: `http://localhost:3000/api`
- Swagger: `http://localhost:3000/swagger`
- Health Check: `http://localhost:3000/api/health`

## Default Credentials

After seeding, you can login with:

- **Email**: `admin@local.dev`
- **Password**: `Admin@123456`

## Project Structure

```
src/
├── common/              # Shared utilities
│   ├── constants/      # App constants
│   ├── dto/            # Base DTOs
│   ├── exceptions/     # Exception handling
│   ├── health/         # Health check
│   ├── interceptors/   # Response interceptors
│   └── repositories/   # Base repository
├── database/           # Database configuration
│   ├── kysely/        # Kysely types
│   └── prisma/        # Prisma service
├── modules/           # Feature modules
│   ├── auth-service/  # Authentication module
│   └── user-service/  # User management module
└── main.ts            # Application entry point
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - User logout (requires auth)

### Users

- `GET /api/users/profile` - Get current user profile (requires auth)
- `PATCH /api/users/profile` - Update current user profile (requires auth)
- `GET /api/users` - Get users list (requires auth)
- `GET /api/users/:id` - Get user by ID (requires auth)

### Health

- `GET /api/health` - Health check endpoint

## Git Hooks

This project uses **Husky**, **lint-staged**, and **commitlint** to maintain code quality:

- **Pre-commit**: Runs ESLint and Prettier on staged files
  - Automatically fixes linting issues when possible
  - Prevents commits with formatting errors
- **Commit-msg**: Validates commit message format using Conventional Commits

### Commit Message Format

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`, `build`, `revert`

**Examples:**
```bash
feat(auth): add user registration endpoint
fix(user): resolve email validation issue
docs: update API documentation
refactor(auth): simplify token generation logic
```

## Available Scripts

```bash
# Development
npm run start:dev      # Start in watch mode
npm run start:debug    # Start in debug mode

# Database
npm run db:setup       # Run migrations + generate
npm run db:migrate     # Run migrations
npm run db:generate    # Generate Prisma client
npm run db:seed        # Seed database
npm run prisma:studio  # Open Prisma Studio

# Code Quality
npm run format         # Format code with Prettier
npm run format:check   # Check code formatting
npm run lint           # Run ESLint
npm run lint:fix       # Fix ESLint errors

# Testing
npm run test           # Run unit tests
npm run test:watch     # Run tests in watch mode
npm run test:cov       # Run tests with coverage
npm run test:e2e       # Run e2e tests

# Production
npm run build          # Build for production
npm run start:prod     # Start production server
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `JWT_SECRET` | JWT secret key | Required |
| `JWT_EXPIRES_IN` | JWT expiration time (seconds) | `3600` |
| `CORS_ORIGIN` | CORS allowed origins | `*` |
| `NODE_ENV` | Environment | `development` |

## Database Schema

The application uses the following main entities:

- **Platform**: Multi-tenant platform support
- **User**: User accounts with email, phone, avatar
- **Role**: User roles (e.g., ADMIN, USER)
- **Permission**: Fine-grained permissions
- **RefreshToken**: JWT refresh token management

See `prisma/schema.prisma` for the complete schema.

## Error Handling

All errors are handled centrally through:

- `BaseException`: Custom exception class
- `HttpExceptionFilter`: Global exception filter
- `Errors` constant: Centralized error definitions

Error response format:

```json
{
  "statusCode": 400,
  "code": "ERR_002",
  "message": "Bad request",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Response Format

All successful responses follow this format:

```json
{
  "message": "Success",
  "statusCode": 200,
  "result": {
    // Your data here
  }
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
