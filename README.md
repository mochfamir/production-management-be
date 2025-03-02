# Production Management (BE)

## Project Description
A NestJS-based backend application featuring JWT authentication, role-based access control (RBAC), and database management using Prisma.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Setup with Prisma](#database-setup-with-prisma)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Live Demo](#live-demo)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites
Before getting started, ensure you have the following installed:

- **Node.js** (v16 or higher): [Download Node.js](https://nodejs.org/)
- **Yarn or npm**: [Install Yarn](https://yarnpkg.com/getting-started/install)
- **Prisma CLI**: Install globally using:
  ```bash
  npm install -g prisma
  ```
- **Database**: PostgreSQL (or any other database supported by Prisma).

## Installation

### Clone Repository:
```bash
git clone https://github.com/mochfamir/production-management-be.git
cd production-management-be
```

### Install Dependencies:
Using Yarn:
```bash
yarn install
```
Or using npm:
```bash
npm install
```

### Create `.env` File:
Copy the `.env.example` file to `.env` and fill in the required values:
```bash
cp .env.example .env
```
Example `.env` content:
```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME?schema=public"
JWT_SECRET="your-secret-key"
PORT=3000
```

## Database Setup with Prisma

### Push Schema to Database:
Run the following command to apply the schema to your database:
```bash
npx prisma db push
```

### Generate Prisma Client:
```bash
npx prisma generate
```

### Seed Data (Optional):
If you want to populate the database with initial data, run the seed script:
```bash
npx prisma db seed
```

## Running the Application

### Development Mode:
```bash
yarn start:dev
```

### Production Build:
```bash
yarn build
yarn start
```

### Linting and Formatting:
```bash
yarn lint
yarn format
```

## API Endpoints

### Authentication
#### `POST /auth/register` - Register a new user
**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "USER"
}
```

#### `POST /auth/login` - Login and get a JWT token
**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### `GET /auth/verify` - Verify the token and retrieve user data
**Header:**
```http
Authorization: Bearer <token>
```

### Work Orders
#### `GET /work-orders` - Get all work orders (with optional filters)
**Query Params:**
```http
?status=IN_PROGRESS&limit=10
```

#### `POST /work-orders` - Create a new work order
**Header:**
```http
Authorization: Bearer <token>
```
**Body:**
```json
{
  "productName": "Product A",
  "quantity": 100,
  "dueDate": "2025-01-01T00:00:00Z"
}
```

#### `GET /work-orders/:id` - Get a work order by ID
**Header:**
```http
Authorization: Bearer <token>
```

#### `PATCH /work-orders/:id` - Update a work order
**Header:**
```http
Authorization: Bearer <token>
```
**Body:**
```json
{
  "productName": "Updated Product",
  "quantity": 200
}
```

#### `DELETE /work-orders/:id` - Delete a work order
**Header:**
```http
Authorization: Bearer <token>
```

#### `PATCH /work-orders/:id/status` - Update work order status
**Header:**
```http
Authorization: Bearer <token>
```
**Body:**
```json
{
  "status": "COMPLETED"
}
```

### Operators
#### `GET /operators` - Get all operators
**Header:**
```http
Authorization: Bearer <token>
```



## Deployment

### Deploy to Koyeb
1. Sign up for [Koyeb](https://www.koyeb.com/)
2. Connect your GitHub repository to Koyeb.
3. Set environment variables in the Koyeb dashboard (e.g., `DATABASE_URL`, `JWT_SECRET`).
4. Deploy the application.

### Environment Variables
Add your `.env` variables to the deployment platform (e.g., Koyeb Dashboard).

### Database Migration
Ensure migrations are applied during deployment:
```bash
npx prisma migrate deploy
```

## Live Demo
A live demo of this application is deployed on Koyeb. You can access it here:

[Live Endpoint Link](phttps://promising-shelagh-sandbox-faishal-9b7080d8.koyeb.app)

## Contributing
We welcome contributions! To contribute:

1. Fork this repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/YourFeatureName
   ```
3. Commit your changes:
   ```bash
   git commit -m 'Add some feature'
   ```
4. Push to the branch:
   ```bash
   git push origin feature/YourFeatureName
   ```
5. Open a pull request.

