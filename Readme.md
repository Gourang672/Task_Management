# Task Management System

## Overview

A full-stack task management application with user authentication, built using Next.js for the frontend and Node.js/Express for the backend. This system allows users to register, login, and manage their tasks with a modern, responsive interface.

## Hosted URLs

- **Frontend**: https://task-app.gc-mishra.com
- **Backend API**: https://task-api.gc-mishra.com

## Features

- **User Authentication**: Secure registration, login, and logout with JWT tokens
- **Task Management**: Create, read, update, and delete tasks
- **Password Reset**: Email-based password recovery functionality
- **Responsive Design**: Modern UI built with Tailwind CSS and shadcn/ui components
- **State Management**: Redux Toolkit for efficient client-side state handling
- **API Security**: Rate limiting, CORS protection, and input validation
- **Database**: MongoDB with Mongoose for data persistence

## Tech Stack

### Frontend
- **Next.js 16** - React framework for production
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Redux Toolkit** - State management
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI components
- **Lucide React** - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **nodemailer** - Email sending
- **Zod** - Schema validation
- **Helmet** - Security middleware
- **express-rate-limit** - Rate limiting

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- MongoDB (local installation or cloud service like MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TaskApp
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Environment Configuration

Create a `.env` file in the `backend` directory with the following environment variables:

```env
MONGODB_URI=mongodb://localhost:27017/taskapp
JWT_SECRET=your_super_secret_jwt_key_here
ORIGIN=http://localhost:3000
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

**Security Notes:**
- Replace `your_super_secret_jwt_key_here` with a strong, random secret key
- Use app-specific passwords for email authentication (for Gmail, enable 2FA and generate an app password)
- Never commit the `.env` file to version control
- For production, set `ORIGIN=https://task-app.gc-mishra.com`
- For production, use environment-specific secrets management

### Running the Application

#### Development Mode

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```
   The backend will start on `http://localhost:3030`

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will start on `http://localhost:3000`

#### Production Mode

1. **Build and start the backend**
   ```bash
   cd backend
   npm start
   ```

2. **Build and start the frontend**
   ```bash
   cd frontend
   npm run build
   npm start
   ```

## API Documentation

The backend provides RESTful APIs for user authentication and task management. All requests should include `Content-Type: application/json` header.

### Base URL

**Development (Local):**
```
http://localhost:3030/api
```

**Production:**
```
https://task-api.gc-mishra.com/api
```

### Authentication Endpoints

#### Register User
```http
POST /users/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "securepassword123"
}
```

#### Login User
```http
POST /users/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "securepassword123"
}
```

#### Logout User
```http
POST /users/logout
```
**Note:** Requires authentication cookie

#### Get Current User
```http
GET /users/me
```
**Authorization:** Required (JWT token in cookie)

#### Update User Profile
```http
PUT /users/update
Content-Type: application/json
Authorization: Required

{
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith@example.com"
}
```

#### Delete User Account
```http
DELETE /users/delete
```
**Authorization:** Required

#### Forgot Password
```http
POST /users/forgot-password
Content-Type: application/json

{
  "email": "john.doe@example.com"
}
```

#### Reset Password
```http
POST /users/reset-password
Content-Type: application/json

{
  "token": "reset_token_from_email",
  "newPassword": "newsecurepassword123"
}
```

### Task Management Endpoints

All task endpoints require authentication via JWT token in cookies.

#### Create Task
```http
POST /tasks
Content-Type: application/json
Authorization: Required

{
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation for the task management system"
}
```

#### Get All Tasks
```http
GET /tasks?page=1&limit=10
```
**Authorization:** Required
**Query Parameters:**
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of tasks per page (default: 10)

#### Get Single Task
```http
GET /tasks/:id
```
**Authorization:** Required
**Path Parameters:**
- `id`: Task ID

#### Update Task
```http
PUT /tasks/:id
Content-Type: application/json
Authorization: Required

{
  "title": "Updated task title",
  "description": "Updated task description"
}
```

#### Delete Task
```http
DELETE /tasks/:id
```
**Authorization:** Required

### Response Format

All API responses follow a consistent format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

## Project Structure

### Backend Structure
```
backend/
├── app.js                 # Main Express application setup
├── package.json           # Dependencies and npm scripts
├── public/                # Static files (if any)
└── src/
    ├── config/
    │   └── config.js      # Database connection configuration
    ├── controllers/
    │   ├── task.controller.js    # Task-related business logic
    │   └── user.controller.js    # User authentication logic
    ├── middleware/
    │   ├── auth.middleware.js    # JWT authentication middleware
    │   └── error.middleware.js   # Error handling middleware
    ├── models/
    │   ├── Tasks.model.js        # Task MongoDB schema
    │   └── Users.model.js        # User MongoDB schema
    ├── routes/
    │   ├── Task.route.js         # Task API routes
    │   └── User.route.js         # User API routes
    ├── utils/
    │   ├── errors.js             # Custom error classes
    │   ├── jwt.js                # JWT utility functions
    │   └── response.js           # Response formatting utilities
    └── validations/
        └── user.validation.js     # Input validation schemas
```

### Frontend Structure
```
frontend/
├── app/                   # Next.js 13+ app directory
│   ├── globals.css        # Global styles and Tailwind imports
│   ├── layout.tsx         # Root layout component
│   ├── page.tsx           # Home/landing page
│   ├── dashboard/
│   │   └── page.tsx       # Main dashboard with task management
│   ├── login/
│   │   └── page.tsx       # User login page
│   ├── register/
│   │   └── page.tsx       # User registration page
│   └── reset-password/
│       └── page.tsx       # Password reset page
├── components/
│   ├── ui/                # Reusable UI components (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   └── pagination.tsx
│   └── ...                # Other components
├── lib/
│   └── utils.ts           # Utility functions
├── redux/
│   ├── Apis/
│   │   ├── BaseApi.ts     # RTK Query base API configuration
│   │   ├── TaskApi.ts     # Task-related API calls
│   │   └── UserApi.ts     # User-related API calls
│   ├── ReduxProvider/
│   │   └── ReduxProvider.tsx  # Redux provider wrapper
│   └── Store/
│       └── store.ts       # Redux store configuration
├── public/                # Static assets
├── middleware.ts          # Next.js middleware
├── next.config.ts         # Next.js configuration
├── tailwind.config.ts     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies and scripts
```

## Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow ESLint configuration for code quality
- Use meaningful variable and function names
- Add comments for complex logic

### Testing
- Test API endpoints with tools like Postman or Insomnia
- Verify authentication flows
- Test CRUD operations for tasks
- Check error handling scenarios

### Security Best Practices
- Never log sensitive information
- Validate all user inputs
- Use HTTPS in production
- Regularly update dependencies
- Implement proper CORS policies

## Deployment

### Backend Deployment
1. Set production environment variables
2. Build the application if needed
3. Use a process manager like PM2 for production
4. Set up reverse proxy with Nginx
5. Configure SSL certificates

### Frontend Deployment
1. Build the production bundle: `npm run build`
2. Deploy to platforms like Vercel, Netlify, or traditional hosting
3. Configure environment variables for API endpoints

### Database
- Use MongoDB Atlas for cloud hosting
- Set up database backups
- Configure connection pooling
- Monitor database performance

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify MongoDB is running
   - Check connection string in `.env`
   - Ensure network connectivity

2. **Authentication Issues**
   - Verify JWT secret is set
   - Check token expiration
   - Ensure cookies are enabled

3. **CORS Errors**
   - Verify ORIGIN environment variable
   - Check frontend and backend ports

4. **Email Not Sending**
   - Verify email credentials
   - Check SMTP settings
   - Use app-specific passwords for Gmail

### Logs
- Backend logs are output to console
- Check browser developer tools for frontend errors
- Monitor network requests in browser dev tools

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support or questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation

---

**Note:** This documentation is for the Task Management System. Make sure to configure all environment variables properly and never expose sensitive information in your code repository.