# Student-Result-Management-System
 A Student Result Management System (SRMS) is a software application designed to manage and automate the recording, processing, and reporting of student academic results. It helps educational institutions efficiently handle grades, generate reports, and maintain student performance records.

## Overview
The **Student Result Management System** is a role-based web application for managing student grades.  
It allows:
- **Students** to view and download their grades.
- **Teachers** to upload and edit grades.
- **Admins** to manage users and subjects.

## Features
- Role-based authentication (Student, Teacher, Admin).
- View, add, update, and delete grades.
- Manage users and subjects.
- Download grade reports.
- Responsive UI with Tailwind CSS.
- Data visualization using Chart.js.
- Pagination for grade retrieval.

## Tech Stack
**Frontend**:
- React.js
- Tailwind CSS
- Chart.js

**Backend**:
- Spring Boot
- Spring Security (JWT authentication)
- MySQL

## API Endpoints
### Authentication
- `POST /api/auth/login` — User login.

### Grades
- `GET /api/grades/student/{studentId}?page={page}&size={size}` — View grades.
- `POST /api/grades` — Upload grades (Teacher).
- `PUT /api/grades/{gradeId}` — Update grades (Teacher).

### Admin Management
- `POST /api/users` — Add user.
- `PUT /api/users/{id}` — Update user.
- `DELETE /api/users/{id}` — Delete user.
- `POST /api/subjects` — Add subject.
- `PUT /api/subjects/{id}` — Update subject.
- `DELETE /api/subjects/{id}` — Delete subject.

## Database Schema
**User**:
- id
- username
- password
- email
- role (Student/Teacher/Admin)

**Grade**:
- id
- student_id (FK)
- subject_id (FK)
- score
- date

**Subject**:
- id
- name

## Setup Instructions
1. **Clone Repository**
   ```bash
   git clone https://github.com/sanjai-web/Student-Result-Management-System.git
   cd Student-Result-Management-System
