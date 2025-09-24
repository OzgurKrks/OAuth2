# Todo API with JWT and Google OAuth

This is a RESTful API built with Node.js, Express, TypeScript, and MongoDB. It includes user authentication with JWT and Google OAuth, and a todo management system.

## Features

- User registration and login with email/password
- Google OAuth authentication
- JWT-based authentication
- CRUD operations for todos
- User-specific todo management
- TypeScript support
- MongoDB database integration

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Google OAuth credentials (for Google login)

## Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd todo-auth-api
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/todo-auth
JWT_SECRET=your_jwt_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
FRONTEND_URL=http://localhost:3000
```

4. Build the TypeScript code:

```bash
npm run build
```

5. Start the server:

```bash
npm start
```

For development with hot-reload:

```bash
npm run dev
```

## API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login with email/password
- `GET /auth/google` - Initiate Google OAuth login
- `GET /auth/google/callback` - Google OAuth callback
- `GET /auth/me` - Get current user info

### Todos

- `GET /todos` - Get all todos for the authenticated user
- `POST /todos` - Create a new todo
- `PUT /todos/:id` - Update a todo
- `DELETE /todos/:id` - Delete a todo

## Request/Response Examples

### Register User

```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

### Create Todo

```http
POST /todos
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the todo API implementation"
}
```

## Error Handling

The API uses standard HTTP status codes and returns error messages in the following format:

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information (in development mode)"
}
```

## Security

- Passwords are hashed using bcrypt
- JWT tokens are used for authentication
- Google OAuth for secure third-party authentication
- CORS enabled for frontend integration
- Environment variables for sensitive data

## Development

To run the development server with hot-reload:

```bash
npm run dev
```

To run tests:

```bash
npm test
```

## License

MIT

