
# Sciqus LMS Frontend (Assignment)

Simple React app for a learning management system. Use this for assignment/demo purposes.

## Setup Instructions

1. **Install dependencies:**
	```bash
	npm install
	```

2. **Configure environment:**
	- Create a `.env` file in the project root:
	  ```env
	  VITE_API_BASE_URL=http://localhost:8080
	  VITE_APP_NAME=Sciqus
	  ```

3. **Start the app:**
	```bash
	npm run dev
	```

App runs at [http://localhost:5173](http://localhost:5173)

## Main Features
- Login/Register (JWT)
- Role-based access (Admin, Teacher, Student)
- Course & User management

## Prerequisites
- Node.js v16 or higher
- npm (or yarn)
- Sciqus backend API running at `http://localhost:8080`

## Project Structure
```
src/
├── components/          # Reusable UI components
├── context/             # React contexts (AuthContext)
├── pages/               # Page components (Login, Register, Dashboard, etc.)
├── services/            # API services (Axios)
├── App.jsx              # Main app component
└── main.jsx             # React entry point
```

## User Roles
- **Student**: Enroll in courses, view dashboard
- **Teacher**: Create/manage courses, view students
- **Admin**: Manage users, courses, system settings

## Environment Variables
| Variable | Description | Default |
|----------|-------------|---------|
| VITE_API_BASE_URL | Backend API URL | http://localhost:8080 |
| VITE_APP_NAME     | Application name | Sciqus |

## Contact
For assignment queries, contact your instructor or project mentor.

## Scripts
- `npm run dev` – Start dev server
- `npm run build` – Build for production

## Tech
- React 18, Vite, Tailwind CSS, Axios

---