# Sciqus Frontend Development Instructions

This project is a React-based Learning Management System frontend built with modern web technologies.

## Project Overview
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS for modern UI
- **Routing**: React Router DOM for SPA navigation
- **API**: Axios for HTTP requests to Spring Boot backend
- **Authentication**: JWT-based with role management
- **State Management**: React Context API

## Architecture
The application follows a component-based architecture with:
- Protected routes for authenticated users
- Role-based access control (Admin, Teacher, Student)
- Centralized API service layer
- Custom hooks for reusable logic
- Utility functions for common operations

## Key Features Implemented
✅ Authentication system (login/register)
✅ Role-based navigation and access control
✅ Protected routes with loading states
✅ API integration with error handling
✅ Responsive design with Tailwind CSS
✅ User management context
✅ Modern UI components

## Development Guidelines
- Use functional components with hooks
- Follow React best practices
- Implement proper error handling
- Use TypeScript for better type safety (future enhancement)
- Keep components focused and reusable
- Use custom hooks for complex logic

## Backend Integration
The frontend integrates with Sciqus backend APIs:
- Authentication endpoints
- Course management
- User management
- Student enrollment
- Role-based operations

## Future Enhancements
- Course creation and management pages
- User management dashboard
- Student enrollment system
- Progress tracking
- Real-time notifications
- File upload functionality
- Advanced search and filtering

## Environment Configuration
Environment variables are configured in .env file:
- VITE_API_BASE_URL: Backend API endpoint
- VITE_APP_NAME: Application name
