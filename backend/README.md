

# Sciqus LMS - Full Stack Project

Sciqus is a Learning Management System (LMS) built with a Spring Boot REST API backend and a React + Tailwind CSS frontend. It supports student, teacher, and admin roles, JWT authentication, and MySQL database.

---

## 🚀 Quick Setup

### Prerequisites
- Java 17+
- Maven 3.6+
- MySQL 8.0+
- Node.js v16+
- npm (or yarn)

### Backend Setup
1. Clone & Setup
  ```bash
  git clone https://github.com/rohitshimpi737/Sciqus.git
  cd Sciqus/backend
  ```
2. Database Setup
  ```bash
  mysql -u root -p < database_schema.sql
  ```
  This creates the `sciqus_db` database, tables, sample courses, and admin user.
3. Configuration
  Edit `src/main/resources/application.properties`:
  ```properties
  spring.datasource.url=jdbc:mysql://localhost:3306/sciqus_db
  spring.datasource.username=root
  spring.datasource.password=your_mysql_password
  app.jwtSecret=sciqusSecretKeyForJWTTokenGenerationAndValidation2024
  app.jwtExpirationMs=86400000
  ```
4. Run the Application
  ```bash
  mvn spring-boot:run
  # Or build and run JAR
  mvn clean package
  java -jar target/backend-0.0.1-SNAPSHOT.jar
  ```
  App runs at: http://localhost:8080

### Frontend Setup
1. Go to frontend folder:
  ```bash
  cd ../Frontend
  ```
2. Install dependencies:
  ```bash
  npm install
  ```
3. Configure environment:
  - Create a `.env` file in the project root:
    ```env
    VITE_API_BASE_URL=http://localhost:8080
    VITE_APP_NAME=Sciqus
    ```
4. Start the app:
  ```bash
  npm run dev
  ```
  App runs at: http://localhost:5173

---

## 🗂️ Project Structure

### Backend
```
backend/
├── src/main/java/com/sciqus/backend/
│   ├── controller/
│   ├── entity/
│   ├── repository/
│   ├── service/
│   └── ...
├── src/main/resources/application.properties
├── pom.xml
└── ...
```

### Frontend
```
Frontend/
├── src/
│   ├── components/          # Reusable UI components
│   ├── context/             # React contexts (AuthContext)
│   ├── pages/               # Page components (Login, Register, Dashboard, etc.)
│   ├── services/            # API services (Axios)
│   ├── App.jsx              # Main app component
│   └── main.jsx             # React entry point
├── public/
├── package.json
└── ...
```

---

## 🌟 Main Features
- Login/Register (JWT)
- Role-based access (Admin, Teacher, Student)
- Course & User management
- Student enrollment
- Health check endpoint

---

## 🔗 API Endpoints (Essential)

### Authentication
- `POST /api/auth/register` — Register new student
- `POST /api/auth/login` — Login and get JWT token
- `GET /api/auth/me` — Get current user info
- `POST /api/auth/logout` — Logout

### Users (Admin Only)
- `GET /api/users` — Get all users
- `POST /api/users` — Create user
- `PUT /api/users/{id}` — Update user
- `DELETE /api/users/{id}` — Delete user
- `PATCH /api/users/{id}/activate` — Activate user
- `PATCH /api/users/{id}/deactivate` — Deactivate user

### Courses
- `GET /api/courses` — Browse courses
- `POST /api/courses` — Create course (Admin)
- `GET /api/courses/search?keyword=` — Search courses
- `PUT /api/courses/{id}` — Update course (Admin)
- `DELETE /api/courses/{id}` — Delete course (Admin)

### Students
- `GET /api/student/profile` — Get own profile
- `GET /api/student/course` — Get enrolled course
- `POST /api/student/enroll/{id}` — Self-enroll in course

### System
- `GET /api/health` — Health check

---

## �️ Authentication & Roles

**Login to get JWT token:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail":"admin","password":"admin123"}'
```
Use token in headers:
`Authorization: Bearer <your-jwt-token>`

**Roles:**
- ADMIN: Full access, manage users/courses
- STUDENT: Profile, enroll, browse courses
- TEACHER: Create/manage courses, view students

---

## �️ Database Schema

```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('ADMIN', 'STUDENT', 'TEACHER') DEFAULT 'STUDENT',
  course_id BIGINT,
  FOREIGN KEY (course_id) REFERENCES courses(course_id)
);

CREATE TABLE courses (
  course_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  course_name VARCHAR(100) NOT NULL,
  course_code VARCHAR(20) UNIQUE NOT NULL,
  course_duration INTEGER NOT NULL
);
```

---

## 🧪 Testing

**Health check:**
```bash
curl http://localhost:8080/api/health
```
**Browse courses:**
```bash
curl http://localhost:8080/api/courses
```
**Login as admin:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail":"admin","password":"admin123"}'
```

---

## 📝 Configuration & Deployment

**Backend Application Properties:**
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/sciqus_db
spring.datasource.username=root
spring.datasource.password=your_mysql_password
app.jwtSecret=sciqusSecretKeyForJWTTokenGenerationAndValidation2024
app.jwtExpirationMs=86400000
```

**Frontend Environment Variables:**
| Variable | Description | Default |
|----------|-------------|---------|
| VITE_API_BASE_URL | Backend API URL | http://localhost:8080 |
| VITE_APP_NAME     | Application name | Sciqus |

**Production Deployment:**
```bash
mvn clean package
java -jar -Dspring.profiles.active=prod target/backend-0.0.1-SNAPSHOT.jar
```

---

## 📦 Tech Stack
- Backend: Spring Boot, MySQL, JWT
- Frontend: React 18, Vite, Tailwind CSS, Axios

---

## 👥 User Roles
- **Student**: Enroll in courses, view dashboard
- **Teacher**: Create/manage courses, view students
- **Admin**: Manage users, courses, system settings

---

## 📞 Support
- Email: rohitshimpi737@gmail.com
- Issues: Create an issue on GitHub

---

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch
3. Commit and push your changes
4. Create a Pull Request

---

**Built with ❤️ by [Rohit Shimpi](https://github.com/rohitshimpi737)**

---

## ⚙️ **Setup Instructions**

### **Prerequisites** 📋
- ☕ **Java 17** or higher
- 📦 **Maven 3.6+**
- 🗃️ **MySQL 8.0+**
- 🔧 **IDE** (IntelliJ IDEA, Eclipse, or VS Code)

### **Step 1: Database Setup** 🗃️

#### **Option A: Automated Setup (Recommended)**
```bash
# Use the provided SQL script
mysql -u root -p < database_schema.sql
```
This creates:
- ✅ Database `sciqus_db`
- ✅ Tables with proper relationships
- ✅ Sample courses and admin user
- ✅ Indexes for performance

#### **Option B: Manual Setup**
```sql
CREATE DATABASE sciqus_db;
USE sciqus_db;
-- Tables will be auto-created by Spring Boot
```

### **Step 2: Configuration** ⚙️

Update `src/main/resources/application.properties`:
```properties
# Database Configuration (Update with your credentials)
spring.datasource.url=jdbc:mysql://localhost:3306/sciqus_db
spring.datasource.username=root
spring.datasource.password=your_mysql_password

# JWT Configuration
app.jwtSecret=sciqusSecretKeyForJWTTokenGenerationAndValidation2024
app.jwtExpirationMs=86400000
```

### **Step 3: Run the Application** 🚀

```bash
# Method 1: Using Maven
mvn spring-boot:run

# Method 2: Using JAR
mvn clean package
java -jar target/backend-0.0.1-SNAPSHOT.jar

# Method 3: Using IDE
# Run SciqusBackendApplication.java
```

### **Step 4: Verify Setup** ✅

```bash
# Health check
curl http://localhost:8080/api/health

# Expected response:
{
  "status": "UP",
  "timestamp": "2025-08-14T...",
  "service": "Sciqus Backend API",
  "version": "1.0.0"
}
```

### **Step 5: Test with Sample Data** 🧪

**Default Admin Account:**
- **Username:** `admin`
- **Password:** `admin123`

**Sample Courses Created:**
- Java Full Stack Development (JAVA-FS-001)
- Python Data Science (PY-DS-002)
- JavaScript Web Development (JS-WEB-003)
- Database Management (DB-MGMT-004)

---

## 🔗 **API Documentation**

### **📊 API Overview**

| Controller | Endpoints | Purpose |
|------------|-----------|---------|
| **Auth** | 4 endpoints | User authentication & authorization |
| **User** | 8 endpoints | User management (CRUD operations) |
| **Student** | 3 endpoints | Student-specific operations |
| **Course** | 11 endpoints | Course management & enrollment |
| **Health** | 2 endpoints | System health monitoring |

### **🔐 Authentication Endpoints**

#### **User Registration** (Public)
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com", 
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890"
}
```

#### **User Login** (Public)
```http
POST /api/auth/login
Content-Type: application/json

{
  "usernameOrEmail": "john_doe",
  "password": "password123"
}

# Response:
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "type": "Bearer",
  "user": {
    "id": 1,
    "username": "john_doe",
    "role": "STUDENT",
    "isActive": true
  }
}
```

#### **Get Current User** (Authenticated)
```http
GET /api/auth/me
Authorization: Bearer <your-jwt-token>
```

#### **Logout** (Authenticated)
```http
POST /api/auth/logout
Authorization: Bearer <your-jwt-token>
```

### **👥 User Management Endpoints**

#### **Get All Users** (Admin Only)
```http
GET /api/users
Authorization: Bearer <admin-jwt-token>
```

#### **Create User** (Admin Only)
```http
POST /api/users
Authorization: Bearer <admin-jwt-token>
Content-Type: application/json

{
  "username": "student1",
  "email": "student1@example.com",
  "role": "STUDENT",
  "courseId": 1,
  "generateTempPassword": true
}
```

#### **Update User** (Own Profile or Admin)
```http
PUT /api/users/{id}
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "firstName": "Updated",
  "lastName": "Name",
  "phoneNumber": "+9876543210"
}
```

#### **Activate/Deactivate User** (Admin Only)
```http
PATCH /api/users/{id}/activate
PATCH /api/users/{id}/deactivate
Authorization: Bearer <admin-jwt-token>
```

### **📚 Course Management Endpoints**

#### **Get All Courses** (Public)
```http
GET /api/courses

# Response:
[
  {
    "courseId": 1,
    "courseName": "Java Full Stack Development",
    "courseCode": "JAVA-FS-001", 
    "courseDuration": 6,
    "description": "Complete Java full stack development course",
    "studentCount": 5
  }
]
```

#### **Search Courses** (Public)
```http
GET /api/courses/search?keyword=java
GET /api/courses/search?name=python
```

#### **Create Course** (Admin Only)
```http
POST /api/courses
Authorization: Bearer <admin-jwt-token>
Content-Type: application/json

{
  "courseName": "React Development",
  "courseCode": "REACT-001",
  "courseDuration": 4,
  "description": "Modern React development course"
}
```

#### **Assign Student to Course** (Admin Only)
```http
POST /api/courses/{courseId}/students/{studentId}
Authorization: Bearer <admin-jwt-token>
```

### **🎓 Student Endpoints**

#### **Get Student Profile** (Student/Admin)
```http
GET /api/student/profile
Authorization: Bearer <student-jwt-token>
```

#### **Get Student's Course** (Student/Admin)
```http
GET /api/student/course
Authorization: Bearer <student-jwt-token>

# Response:
{
  "studentName": "John Doe",
  "message": "Student enrolled course information",
  "enrolledCourse": {
    "courseId": 1,
    "courseName": "Java Full Stack Development",
    "courseCode": "JAVA-FS-001",
    "courseDuration": 6
  }
}
```

#### **Self Enrollment** (Student)
```http
POST /api/student/enroll/{courseId}
Authorization: Bearer <student-jwt-token>
```

### **🏥 System Endpoints**

#### **Health Check** (Public)
```http
GET /api/health

# Response:
{
  "status": "UP",
  "timestamp": "2025-08-14T12:00:00",
  "service": "Sciqus Backend API",
  "version": "1.0.0"
}
```

---

## 🔐 **Authentication Guide**

### **How Authentication Works**

1. **🔓 User Registration/Login** → Receive JWT token
2. **🔑 Include Token in Headers** → `Authorization: Bearer <token>`
3. **✅ Access Protected Endpoints** → Server validates token
4. **⏰ Token Expiry** → 24 hours (configurable)

### **Role-Based Access Control**

| Role | Permissions |
|------|-------------|
| **👑 ADMIN** | • Full system access<br>• Create/manage users<br>• Create/manage courses<br>• Assign students to courses<br>• View all data |
| **🎓 STUDENT** | • View own profile<br>• Update own profile<br>• View enrolled courses<br>• Self-enroll in courses<br>• Browse course catalog |
| **🌐 PUBLIC** | • User registration<br>• User login<br>• Browse courses<br>• Search courses<br>• Health check |

### **Authentication Flow Example**

```bash
# 1. Register/Login to get token
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail":"admin","password":"admin123"}'

# 2. Extract token from response
TOKEN="eyJhbGciOiJIUzI1NiJ9..."

# 3. Use token for protected endpoints
curl -X GET http://localhost:8080/api/users \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📊 **Database Schema**

### **Entity Relationship Diagram**

```
👤 User (Student/Admin)     📚 Course
├── id (PK)                ├── courseId (PK) 
├── username (UNIQUE)      ├── courseName
├── email (UNIQUE)         ├── courseCode (UNIQUE)
├── password (HASHED)      ├── courseDuration
├── firstName              ├── description
├── lastName               ├── createdAt
├── phoneNumber            └── updatedAt
├── role (ADMIN/STUDENT)
├── isActive
├── courseId (FK) ────────────→ courseId
├── createdAt
└── updatedAt
```

### **Users Table** 👥
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | BIGINT | PK, AUTO_INCREMENT | Unique user identifier |
| `username` | VARCHAR(50) | UNIQUE, NOT NULL | User login name |
| `email` | VARCHAR(100) | UNIQUE, NOT NULL | User email address |
| `password` | VARCHAR(255) | NOT NULL | BCrypt encrypted password |
| `first_name` | VARCHAR(50) | | User first name |
| `last_name` | VARCHAR(50) | | User last name |
| `phone_number` | VARCHAR(20) | | Contact number |
| `role` | ENUM | NOT NULL, DEFAULT 'STUDENT' | User role (ADMIN/STUDENT) |
| `is_active` | BOOLEAN | DEFAULT TRUE | Account status |
| `course_id` | BIGINT | FK | Reference to enrolled course |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Account creation time |
| `updated_at` | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Last update time |

### **Courses Table** 📚
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `course_id` | BIGINT | PK, AUTO_INCREMENT | Unique course identifier |
| `course_name` | VARCHAR(100) | NOT NULL | Course name |
| `course_code` | VARCHAR(20) | UNIQUE, NOT NULL | Course code (e.g., CS101) |
| `course_duration` | INTEGER | NOT NULL | Duration in months |
| `description` | TEXT | | Course description |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Course creation time |
| `updated_at` | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Last update time |

### **Database Relationships** 🔗
- **One-to-Many:** Course → Students (One course can have many students)
- **Many-to-One:** Student → Course (Each student belongs to one course)
- **Foreign Key:** `users.course_id` → `courses.course_id`

---

## 🧪 **Testing**

### **Testing with Postman** 📬

**Import the complete collection:**
- File: `Sciqus_Complete_API_Collection.postman_collection.json`
- Contains all 29 endpoints with sample data
- Automatic JWT token management
- Pre-configured environment variables

### **Manual Testing Examples** 🔧

```bash
# Test 1: Health Check
curl http://localhost:8080/api/health

# Test 2: Register new student
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'

# Test 3: Login and get token
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail":"admin","password":"admin123"}'

# Test 4: Get courses (public)
curl http://localhost:8080/api/courses

# Test 5: Get users (admin only)
curl -X GET http://localhost:8080/api/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### **Running Unit Tests** 🧪

```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=UserControllerTest

# Run with coverage report
mvn test jacoco:report
```

---

## 📝 **Configuration**

### **Application Properties** ⚙️

```properties
# Server Configuration
server.port=8080

# Database Configuration 
spring.datasource.url=jdbc:mysql://localhost:3306/sciqus_db
spring.datasource.username=root
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
spring.jpa.properties.hibernate.format_sql=true

# JWT Configuration
app.jwtSecret=sciqusSecretKeyForJWTTokenGenerationAndValidation2024
app.jwtExpirationMs=86400000

# Logging Configuration
logging.level.com.sciqus.backend=DEBUG
logging.level.org.springframework.web=DEBUG
```

### **Environment Variables** 🌍

For production deployment, use environment variables:

```bash
export DB_URL=jdbc:mysql://localhost:3306/sciqus_db
export DB_USERNAME=root  
export DB_PASSWORD=your_password
export JWT_SECRET=your_jwt_secret
export JWT_EXPIRATION=86400000
```

---

## Setup Instructions

### 1. Prerequisites
- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+

### 2. Database Setup

#### Option 1: Using provided SQL script (Recommended)
1. Run the complete database setup script:
   ```bash
   mysql -u root -p < database_schema.sql
   ```
   This will create:
   - Database `sciqus_db`
   - Tables `courses` and `users` with proper relationships
   - Stored procedures for advanced operations
   - Sample data

#### Option 2: Manual setup
1. Create a MySQL database named `sciqus_db`
2. Update the database credentials in `src/main/resources/application.properties`:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=rohit
   ```
3. Spring Boot will auto-create tables on first run

### 3. Run the Application
```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

### 4. Verify Setup
- Visit `http://localhost:8080/api/health` to check if the application is running
- Use the provided API documentation in `API_DOCUMENTATION.md` for testing

### 5. Testing with Sample Data
The SQL script includes sample courses:
- Java Programming (CS101)
- Web Development (WEB201) 
- Database Management (DB301)
- Data Structures (CS102)
- Machine Learning (ML401)

Admin user: `admin@sciqus.com` (use for testing admin endpoints)

## API Endpoints

### Health Check
- **GET** `/api/health` - Health check endpoint
- **GET** `/api/` - Welcome message

### Authentication Endpoints

#### User Registration
- **POST** `/api/auth/register`
- Request Body:
  ```json
  {
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+1234567890"
  }
  ```

#### User Login
- **POST** `/api/auth/login`
- Request Body:
  ```json
  {
    "usernameOrEmail": "john_doe",
    "password": "password123"
  }
  ```
- Response:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "type": "Bearer",
    "user": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "USER",
      "isActive": true
    }
  }
  ```

#### User Logout
- **POST** `/api/auth/logout`
- Headers: `Authorization: Bearer <token>`

#### Get Current User
- **GET** `/api/auth/me`
- Headers: `Authorization: Bearer <token>`

### Course Management (Protected Endpoints)
*All endpoints require `Authorization: Bearer <token>` header*

#### Create Course
- **POST** `/api/courses`
- **Roles Required:** ADMIN
- Request Body:
  ```json
  {
    "courseName": "Java Programming",
    "courseCode": "CS101",
    "courseDuration": 6,
    "description": "Introduction to Java programming"
  }
  ```

#### Get All Courses
- **GET** `/api/courses`
- **Roles Required:** Any authenticated user

#### Get Course by ID
- **GET** `/api/courses/{courseId}`
- **Roles Required:** Any authenticated user

#### Get Course by Code
- **GET** `/api/courses/code/{courseCode}`
- **Roles Required:** Any authenticated user

#### Search Courses by Name
- **GET** `/api/courses/search?name={name}`
- **Roles Required:** Any authenticated user

#### Update Course
- **PUT** `/api/courses/{courseId}`
- **Roles Required:** ADMIN
- Request Body: Same as create course

#### Delete Course (Safe)
- **DELETE** `/api/courses/{courseId}`
- **Roles Required:** ADMIN
- Note: Prevents deletion if students are enrolled

#### Force Delete Course
- **DELETE** `/api/courses/{courseId}/force`
- **Roles Required:** ADMIN
- Note: Removes all student associations and deletes course

#### Get Students in Course
- **GET** `/api/courses/{courseId}/students`
- **Roles Required:** Any authenticated user

#### Get Student Count in Course
- **GET** `/api/courses/{courseId}/students/count`
- **Roles Required:** Any authenticated user

#### Assign Student to Course
- **POST** `/api/courses/{courseId}/students/{studentId}`
- **Roles Required:** ADMIN, MODERATOR

#### Remove Student from Course
- **DELETE** `/api/courses/students/{studentId}/course`
- **Roles Required:** ADMIN, MODERATOR
*All endpoints require `Authorization: Bearer <token>` header*

### Student Management (Protected Endpoints)
*All endpoints require `Authorization: Bearer <token>` header*

#### Create Student with Course Assignment
- **POST** `/api/users`
- **Roles Required:** ADMIN
- Request Body:
  ```json
  {
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+1234567890",
    "courseId": 1
  }
  ```

#### Get All Students with Course Information
- **GET** `/api/users`
- **Roles Required:** ADMIN, MODERATOR

#### Get Student by ID (with Course Info)
- **GET** `/api/users/{id}`
- **Roles Required:** Any authenticated user

#### Get Students Without Course
- **GET** `/api/users/without-course`
- **Roles Required:** ADMIN, MODERATOR

#### Search Students by Name
- **GET** `/api/users/search?name={name}`
- **Roles Required:** Any authenticated user

#### Update Student Details (with Course Modification)
- **PUT** `/api/users/{id}`
- **Roles Required:** Any authenticated user (own profile) or ADMIN

#### Delete Student
- **DELETE** `/api/users/{id}`
- **Roles Required:** ADMIN only

#### Student Self-Access Endpoints

#### Get Own Profile
- **GET** `/api/student/profile`
- **Roles Required:** STUDENT, ADMIN, MODERATOR
- Returns: Student's complete profile with course information

#### Get Own Course Information
- **GET** `/api/student/course`
- **Roles Required:** STUDENT, ADMIN, MODERATOR
- Returns: Course details for the authenticated student
- **POST** `/api/users`
- **Roles Required:** None (Public during registration)
- Request Body:
  ```json
  {
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+1234567890"
  }
  ```

#### Get All Users
- **GET** `/api/users`
- **Roles Required:** ADMIN, MODERATOR

#### Get User by ID
- **GET** `/api/users/{id}`
- **Roles Required:** Any authenticated user

#### Get User by Username
- **GET** `/api/users/username/{username}`
- **Roles Required:** Any authenticated user

#### Get User by Email
- **GET** `/api/users/email/{email}`
- **Roles Required:** Any authenticated user

#### Get Active Users
- **GET** `/api/users/active`
- **Roles Required:** Any authenticated user

#### Get Users by Role
- **GET** `/api/users/role/{role}`
- **Roles Required:** Any authenticated user
- Roles: `USER`, `ADMIN`, `MODERATOR`

#### Search Users by Name
- **GET** `/api/users/search?name={name}`
- **Roles Required:** Any authenticated user

#### Get Active User Count
- **GET** `/api/users/count/active`
- **Roles Required:** Any authenticated user

#### Update User
- **PUT** `/api/users/{id}`
- **Roles Required:** Any authenticated user (own profile) or ADMIN
- Request Body: Same as create user

#### Delete User
- **DELETE** `/api/users/{id}`
- **Roles Required:** ADMIN only

#### Deactivate User
- **PATCH** `/api/users/{id}/deactivate`
- **Roles Required:** ADMIN, MODERATOR

#### Activate User
- **PATCH** `/api/users/{id}/activate`
- **Roles Required:** ADMIN, MODERATOR

## Response Format

### Success Response
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890",
  "role": "USER",
  "isActive": true,
  "createdAt": "2024-01-01T10:00:00",
  "updatedAt": "2024-01-01T10:00:00"
}
```

### Error Response
```json
{
  "error": "Validation failed",
  "message": "Username already exists",
  "timestamp": "2024-01-01T10:00:00"
}
```

## Database Schema

### Users Table
| Column | Type | Constraints |
|--------|------|------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT |
| username | VARCHAR(50) | UNIQUE, NOT NULL |
| email | VARCHAR(255) | UNIQUE, NOT NULL |
| password | VARCHAR(255) | NOT NULL |
| first_name | VARCHAR(100) | |
| last_name | VARCHAR(100) | |
| phone_number | VARCHAR(20) | |
| role | ENUM | NOT NULL, DEFAULT 'USER' |
| is_active | BOOLEAN | DEFAULT TRUE |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

## Development

### Running Tests
```bash
mvn test
```

### Building JAR
```bash
mvn clean package
```

### Running JAR
```bash
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

## Authentication & Authorization

### How to Use Authentication

1. **Register a new user:**
   ```bash
   POST /api/auth/register
   ```

2. **Login to get JWT token:**
   ```bash
   POST /api/auth/login
   ```

3. **Use the token in subsequent requests:**
   ```bash
   Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
   ```

### Role-Based Access Control

- **STUDENT:** Can access own profile and course information, view courses
- **MODERATOR:** Can manage student-course assignments, view all users and courses
- **ADMIN:** Full system access including course/student creation and deletion

### Database Schema

#### Students (Users) Table
| Column | Type | Constraints |
|--------|------|------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT |
| username | VARCHAR(50) | UNIQUE, NOT NULL |
| email | VARCHAR(255) | UNIQUE, NOT NULL |
| password | VARCHAR(255) | NOT NULL (BCrypt encrypted) |
| first_name | VARCHAR(100) | |
| last_name | VARCHAR(100) | |
| phone_number | VARCHAR(20) | |
| role | ENUM | NOT NULL, DEFAULT 'STUDENT' |
| is_active | BOOLEAN | DEFAULT TRUE |
| course_id | BIGINT | FOREIGN KEY to courses table |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

#### Courses Table
| Column | Type | Constraints |
|--------|------|------------|
| course_id | BIGINT | PRIMARY KEY, AUTO_INCREMENT |
| course_name | VARCHAR(100) | NOT NULL |
| course_code | VARCHAR(20) | UNIQUE, NOT NULL |
| course_duration | INTEGER | NOT NULL (in months) |
| description | TEXT | |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### Relationship
- **One-to-Many:** Course → Students (One course can have many students)
- **Many-to-One:** Student → Course (Each student belongs to one course)

## Configuration

Key configuration properties in `application.properties`:

```properties
# Server
server.port=8080

# Database
spring.datasource.url=jdbc:mysql://localhost:3306/sciqus_db
spring.datasource.username=root
spring.datasource.password=your_password

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# JWT Configuration
app.jwtSecret=sciqusSecretKeyForJWTTokenGenerationAndValidation2024
app.jwtExpirationMs=86400000

# Logging
logging.level.com.sciqus.backend=DEBUG
```

## Next Steps

1. ✅ JWT authentication - **COMPLETED**
2. ✅ Password encryption with BCrypt - **COMPLETED** 
3. ✅ Role-based access control - **COMPLETED**
4. ✅ Login/logout endpoints - **COMPLETED**
5. Add more entities as per requirements
6. Implement refresh token functionality
7. Add email verification
8. Add password reset functionality
9. Add unit and integration tests
10. Add API documentation with Swagger/OpenAPI

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
