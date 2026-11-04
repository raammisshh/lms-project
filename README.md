# LMS – Spring Boot + React

## Prerequisites
- JDK 17+, Maven 3.9+ (or use your IDE's Maven)
- Node.js 18+
- MySQL 8 running on localhost:3306

## 1. Backend
1. Open `lms-backend/src/main/resources/application.properties` and set your MySQL username/password.
2. Run:
   ```
   cd lms-backend
   mvn spring-boot:run
   ```
   The database `lms_db` and all tables are created automatically. API runs on http://localhost:8080

Default admin (auto-created): admin@lms.com / admin123

## 2. Frontend
```
cd lms-frontend
npm install
npm run dev
```
Open http://localhost:5173

## 3. Try it
1. Register as INSTRUCTOR -> create a course -> Manage lessons -> add 2-3 lessons.
2. Logout, register as STUDENT -> open the course -> Enroll -> complete lessons -> watch progress.

## API summary
| Method | URL | Who |
|---|---|---|
| POST | /api/auth/register, /api/auth/login | public |
| GET | /api/courses?q=, /api/courses/{id} | public |
| POST/PUT/DELETE | /api/courses, /api/courses/{id} | instructor/admin |
| POST | /api/courses/{id}/lessons | instructor/admin |
| GET | /api/courses/{id}/lessons | enrolled student / owner |
| POST | /api/courses/{id}/enroll | student |
| GET | /api/student/courses | student |
| POST | /api/lessons/{id}/complete | student |
