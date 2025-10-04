# Expense Management System

A complete full-stack expense management application with role-based access control, currency conversion, and approval workflows.

## Project Structure

```
Expense-Management/
├── backend/
│   ├── expense-management-api/     # Main API server
│   │   ├── src/
│   │   │   ├── controllers/        # Route controllers
│   │   │   ├── middleware/        # Authentication & validation
│   │   │   ├── models/           # Mongoose models
│   │   │   ├── routes/           # API routes
│   │   │   ├── utils/            # Utility functions
│   │   │   ├── server.js         # Express server setup
│   │   │   ├── package.json      # Dependencies
│   │   │   └── env.example       # Environment variables template
│   │   ├── index.js              # Entry point
│   │   └── package.json          # Main package.json
│   └── ...                       # Other backend services
├── frontend/                      # Frontend application
└── README.md                     # This file
```

## Quick Start

### 1. Setup Environment

Navigate to the API directory:
```bash
cd backend/expense-management-api
```

Copy environment template:
```bash
cp src/env.example .env
```

Update `.env` with your configuration:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/expense_management
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start MongoDB

Make sure MongoDB is running on your system.

### 4. Run the Application

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:3000`

## API Documentation

Visit `http://localhost:3000/api/v1/docs` for complete API documentation.

## Key Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (ADMIN, MANAGER, EMPLOYEE)
- Automatic company creation on first user signup
- Password hashing with bcrypt

### User Management
- Admin can create employees/managers
- Manager assignment for employees
- Company-scoped user management

### Expense Management
- Employee expense submission
- Automatic currency conversion using exchangerate-api.com
- Manager approval/rejection workflow
- Expense status tracking (PENDING, APPROVED, REJECTED)
- Pagination support

### Currency Conversion
- Real-time currency conversion
- Stores both original and converted amounts
- Uses company's default currency

## API Endpoints

### Authentication
- `POST /api/v1/auth/signup` - Create company and admin user
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/profile` - Get current user profile

### User Management
- `POST /api/v1/users` - Create new employee/manager (Admin)
- `GET /api/v1/users/company` - Get all company users (Admin)
- `POST /api/v1/users/assign-manager` - Assign manager to employee (Admin)
- `GET /api/v1/users/managed-employees` - Get employees under manager

### Expense Management
- `POST /api/v1/expenses/submit` - Submit expense (Employee)
- `GET /api/v1/expenses/my-expenses` - Get employee expenses
- `GET /api/v1/expenses/pending` - Get pending expenses (Manager)
- `PUT /api/v1/expenses/:id/approve` - Approve/reject expense (Manager)
- `GET /api/v1/expenses/stats` - Get expense statistics

## Database Models

### Company
- name, country, currency

### User
- name, email, password, role, companyId, managerId

### Expense
- employeeId, amount, currency, convertedAmount, category, description, date, status, approverId, comments

## Role Permissions

- **ADMIN**: Full access, can create users, view all expenses
- **MANAGER**: Can manage employees, approve expenses, view statistics
- **EMPLOYEE**: Can submit expenses, view own expenses

## Testing the API

### 1. Create Company and Admin
```bash
curl -X POST http://localhost:3000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Admin",
    "email": "admin@company.com",
    "password": "password123",
    "companyName": "Tech Corp",
    "country": "USA",
    "currency": "USD"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@company.com",
    "password": "password123"
  }'
```

### 3. Create Employee
```bash
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Jane Employee",
    "email": "employee@company.com",
    "password": "password123",
    "role": "EMPLOYEE"
  }'
```

### 4. Submit Expense
```bash
curl -X POST http://localhost:3000/api/v1/expenses/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer EMPLOYEE_JWT_TOKEN" \
  -d '{
    "amount": 100,
    "currency": "EUR",
    "category": "Travel",
    "description": "Business trip expenses",
    "date": "2024-01-15"
  }'
```

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Input validation and sanitization
- CORS protection
- Comprehensive error handling

## Development

- Uses nodemon for development auto-restart
- Environment-based configuration
- Request logging
- MongoDB connection management
- Graceful error handling

## License

ISC
