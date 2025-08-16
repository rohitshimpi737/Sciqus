# Sciqus - Learning Management System

A full-stack Learning Management System built with **Spring Boot** (Backend) and **React** (Frontend), featuring role-based access control, course management, and student enrollment capabilities.

## 🛠️ Tech Stack

**Backend:**
- Spring Boot 3.x with Spring Security
- MySQL Database with JPA/Hibernate
- JWT Authentication & Authorization
- RESTful API Architecture
- Maven Build Tool

**Frontend:**
- React 18 with Vite
- Tailwind CSS for Styling
- Axios for API Integration
- React Router for Navigation
- Context API for State Management

## 🚀 Features

### Authentication & Authorization
- JWT-based secure authentication
- Role-based access control (Admin, Student)
- User registration and profile management
- Session management with auto-refresh

### Admin Features
- **Dashboard:** System statistics and overview
- **User Management:** Create, update, delete users
- **Course Management:** Full CRUD operations for courses
- **Enrollment Management:** Manage student enrollments
- **System Monitoring:** View system health and activity

### Student Features
- **Dashboard:** Personalized learning overview
- **Course Catalog:** Browse and search available courses
- **My Learning:** Track enrolled courses and progress
- **Self-Enrollment:** Enroll in available courses
- **Profile Management:** Update personal information

## 📱 UI Screenshots

### Login & Authentication
![Login Page](screenshots/Screenshot%202025-08-17%20022035.png)
*Login page with demo credentials and flexible authentication*

![Registration Page](screenshots/Screenshot%202025-08-17%20022047.png)
*User registration interface with form validation*

### Student Interface
![Student Home Page](screenshots/Screenshot%202025-08-17%20022133.png)
*Student home dashboard with overview and navigation*

![Student Courses Page](screenshots/Screenshot%202025-08-17%20022147.png)
*Student courses page showing enrolled and available courses*

![Course Catalog Page](screenshots/Screenshot%202025-08-17%20022201.png)
*Course catalog page for browsing available courses*

![My Learning Page](screenshots/Screenshot%202025-08-17%20022215.png)
*My Learning page showing student's enrolled courses*

![Student Profile Page](screenshots/Screenshot%202025-08-17%20022227.png)
*Student profile page for managing personal information*

![Course Detail Page](screenshots/Screenshot%202025-08-17%20022242.png)
*Course detail page with comprehensive course information*

### Admin Interface
![Admin Dashboard Overview](screenshots/Screenshot%202025-08-17%20022333.png)
*Admin dashboard with system statistics and overview*

![User Management Page](screenshots/Screenshot%202025-08-17%20022350.png)
*User management page for admin operations*

![Course Management](screenshots/Screenshot%202025-08-17%20022406.png)
*Admin course management interface*

![Enrollment Management](screenshots/Screenshot%202025-08-17%20022423.png)
*Admin enrollment management system*

![Enrollment Management Details](screenshots/Screenshot%202025-08-17%20022455.png)
*Detailed enrollment management interface*

![Add Course Form](screenshots/Screenshot%202025-08-17%20022507.png)
*Add new course form for administrators*

![Enroll Student to Course](screenshots/Screenshot%202025-08-17%20022525.png)
*Interface for enrolling students to courses*

![Add New User Form](screenshots/Screenshot%202025-08-17%20022538.png)
*Add new user form with role selection*

### Additional Views
![Student Enrollment Page](screenshots/Screenshot%202025-08-17%20023339.png)
*Student's personal enrollment page*

![Student Courses View](screenshots/Screenshot%202025-08-17%20023352.png)
*Student's courses page with enrollment status*

![Final Interface View](screenshots/Screenshot%202025-08-17%20023403.png)
*Complete application interface demonstration*


## ⚡ Quick Start

### Prerequisites
```bash
Java 17+, Maven 3.6+, MySQL 8.0+, Node.js 16+, npm/yarn
```

### 1. Clone Repository
```bash
git clone https://github.com/rohitshimpi737/Sciqus.git
cd Sciqus
```

### 2. Database Setup
```sql
-- Create database
CREATE DATABASE sciqus_db;

-- Import schema (if provided)
mysql -u root -p sciqus_db < database_schema.sql
```

### 3. Backend Setup
```bash
cd backend

# Configure database in application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/sciqus_db
spring.datasource.username=root
spring.datasource.password=your_password

# Run application
mvn spring-boot:run
```
Backend runs at: `http://localhost:8080`

### 4. Frontend Setup
```bash
cd Frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_BASE_URL=http://localhost:8080" > .env

# Start development server
npm run dev
```
Frontend runs at: `http://localhost:5173`

## 👤 Demo Accounts

**Admin Account:**
- Username: `admin` or Email: `admin@sciqus.com`
- Password: `admin123`

**Student Account:**
- Username: `student` or Email: `student@sciqus.com`  
- Password: `student123`

## � Project Architecture

```
Sciqus/
├── backend/                    # Spring Boot REST API
│   ├── src/main/java/com/sciqus/backend/
│   │   ├── controller/         # REST Controllers
│   │   ├── entity/            # JPA Entities
│   │   ├── repository/        # Data Access Layer
│   │   ├── service/           # Business Logic
│   │   ├── dto/               # Data Transfer Objects
│   │   ├── config/            # Security & Configuration
│   │   └── exception/         # Exception Handling
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── static/
│   └── pom.xml               # Maven Dependencies
│
├── Frontend/                  # React Application
│   ├── src/
│   │   ├── components/        # Reusable UI Components
│   │   ├── pages/            # Route Components
│   │   │   ├── admin/        # Admin Management Pages
│   │   │   ├── student/      # Student Learning Pages
│   │   │   └── common/       # Shared Pages (Login, Register)
│   │   ├── context/          # React Context (AuthContext)
│   │   ├── services/         # API Services (Axios)
│   │   ├── hooks/            # Custom React Hooks
│   │   └── utils/            # Utility Functions
│   ├── public/               # Static Assets
│   └── package.json          # npm Dependencies
│
└── README.md                 # Project Documentation
```

## � API Overview

### Authentication Endpoints
```bash
POST /api/auth/register     # User registration
POST /api/auth/login        # User authentication
GET  /api/auth/me          # Get current user
POST /api/auth/logout      # User logout
```

### Admin Endpoints
```bash
GET  /api/admin/stats      # System statistics
GET  /api/admin/users      # User management
GET  /api/admin/courses    # Course management
```

### Student Endpoints  
```bash
GET  /api/student/dashboard           # Student dashboard
GET  /api/student/enrollments        # My enrolled courses
GET  /api/student/available-courses  # Browse courses
POST /api/student/enroll/{courseId}  # Enroll in course
```

### Public Endpoints
```bash
GET /api/courses           # Browse all courses
GET /api/health           # System health check
```

## 🗄️ Database Schema

```sql
-- Users table
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    phone_number VARCHAR(15),
    role ENUM('ADMIN', 'STUDENT') DEFAULT 'STUDENT',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Courses table
CREATE TABLE courses (
    course_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    course_name VARCHAR(100) NOT NULL,
    course_code VARCHAR(20) UNIQUE NOT NULL,
    course_duration INTEGER NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Enrollments table
CREATE TABLE enrollments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    student_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
    UNIQUE KEY unique_enrollment (student_id, course_id)
);
```

## 🧪 Testing the Application

### Health Check
```bash
curl http://localhost:8080/api/health
```

### Authentication Test
```bash
# Login as admin
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail":"admin","password":"admin123"}'
```

### Browse Courses
```bash
curl http://localhost:8080/api/courses
```

## 🚀 Deployment

### Backend Production Build
```bash
cd backend
mvn clean package
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

### Frontend Production Build
```bash
cd Frontend
npm run build
# Deploy the 'dist' folder to your web server
```

## 🎯 Key Implementation Highlights

- **Security:** JWT-based authentication with role-based authorization
- **Architecture:** Clean separation of concerns with proper layered architecture
- **Database:** Normalized schema with proper foreign key relationships
- **Frontend:** Modern React with hooks, context API, and responsive design
- **API Design:** RESTful endpoints with proper HTTP status codes
- **Error Handling:** Comprehensive error handling on both client and server
- **Validation:** Input validation on both frontend and backend
- **Responsive UI:** Mobile-first design with Tailwind CSS

## 📧 Contact

**Developer:** Rohit Shimpi  
**GitHub:** [rohitshimpi737](https://github.com/rohitshimpi737)  
**Repository:** [Sciqus](https://github.com/rohitshimpi737/Sciqus)

---

*This project demonstrates full-stack development skills with modern technologies, secure authentication, and clean architecture principles.*