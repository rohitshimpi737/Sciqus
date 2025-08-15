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
- Role-based access (Admin, Student)
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

## 🛡️ Authentication & Roles

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

---

## 🗄️ Database Schema

```sql
CREATE TABLE users (
   id BIGINT PRIMARY KEY AUTO_INCREMENT,
   username VARCHAR(50) UNIQUE NOT NULL,
   email VARCHAR(100) UNIQUE NOT NULL,
   password VARCHAR(255) NOT NULL,
   role ENUM('ADMIN', 'STUDENT') DEFAULT 'STUDENT',
   is_active BOOLEAN DEFAULT TRUE,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE courses (
   course_id BIGINT PRIMARY KEY AUTO_INCREMENT,
   course_name VARCHAR(100) NOT NULL,
   course_code VARCHAR(20) UNIQUE NOT NULL,
   course_duration INTEGER NOT NULL,
   description TEXT,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE enrollments (
   enrollment_id BIGINT PRIMARY KEY AUTO_INCREMENT,
   user_id BIGINT NOT NULL,
   course_id BIGINT NOT NULL,
   enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   FOREIGN KEY (user_id) REFERENCES users(id),
   FOREIGN KEY (course_id) REFERENCES courses(course_id)
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