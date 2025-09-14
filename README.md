# School Management System Backend

A comprehensive backend API for managing primary schools in Addis Ababa, built with Node.js, Express, TypeScript, and MySQL.

## 🚀 Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin, Teacher, Parent, Student)
- Password hashing with bcrypt
- Token refresh mechanism

### User Management
- **Students**: Complete CRUD operations, enrollment management, parent linking
- **Teachers**: Employee management, subject assignments, class teacher assignments
- **Parents**: Parent profiles, student linking, relationship management
- **Admins**: Full system access and management

### Academic Management
- **Grades**: Grade levels (1-8) with capacity management
- **Sections**: Class sections within grades
- **Subjects**: Subject management with grade assignments
- **Academic Years**: Multi-year academic planning
- **Terms**: Semester/term management

### Attendance System
- Daily attendance marking
- Bulk attendance for sections
- Attendance reports and statistics
- Student attendance summaries
- Monthly and daily reports

### Examination System
- Exam creation and management
- Multiple exam types (Quiz, Assignment, Mid-term, Final)
- Result entry and management
- Grade calculation and reporting
- Student performance tracking

### Payment Management
- Fee structure management
- Payment tracking and receipts
- Payment history and reports
- Late fee management

### Reports & Analytics
- Attendance reports
- Exam performance reports
- Payment reports
- Student statistics
- Teacher statistics

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MySQL
- **Authentication**: JWT
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Express Validator
- **Logging**: Winston + Morgan
- **File Upload**: Multer

## 📋 Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd schoolmanagement
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=school_management
   DB_USER=root
   DB_PASSWORD=your_password
   
   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=7d
   JWT_REFRESH_SECRET=your_refresh_secret_key_here
   JWT_REFRESH_EXPIRE=30d
   
   # Email Configuration
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   
   # File Upload Configuration
   MAX_FILE_SIZE=10485760
   UPLOAD_PATH=uploads/
   
   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   
   # CORS Configuration
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Database Setup**
   ```bash
   # Create MySQL database
   mysql -u root -p
   CREATE DATABASE school_management;
   ```
   
   ```bash
   # Run database schema
   mysql -u root -p school_management < database/schema.sql
   
   # Run seed data (optional)
   mysql -u root -p school_management < database/seed.sql
   ```

5. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm run build
   npm start
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/refresh-token` - Refresh JWT token
- `GET /auth/profile` - Get user profile
- `PUT /auth/change-password` - Change password
- `POST /auth/logout` - User logout
- `GET /auth/verify` - Verify token

### Student Endpoints
- `GET /students` - Get all students (with pagination)
- `POST /students` - Create new student
- `GET /students/:id` - Get student by ID
- `PUT /students/:id` - Update student
- `DELETE /students/:id` - Delete student
- `GET /students/section/:sectionId` - Get students by section
- `GET /students/grade/:gradeId` - Get students by grade
- `POST /students/:studentId/enroll` - Enroll student in section
- `POST /students/:studentId/transfer` - Transfer student
- `GET /students/stats` - Get student statistics

### Teacher Endpoints
- `GET /teachers` - Get all teachers (with pagination)
- `POST /teachers` - Create new teacher
- `GET /teachers/:id` - Get teacher by ID
- `PUT /teachers/:id` - Update teacher
- `DELETE /teachers/:id` - Delete teacher
- `POST /teachers/:teacherId/assign-subject` - Assign teacher to subject
- `POST /teachers/:teacherId/assign-class` - Assign class teacher
- `GET /teachers/:teacherId/subjects` - Get teacher's subjects
- `GET /teachers/:teacherId/sections` - Get teacher's sections
- `GET /teachers/stats` - Get teacher statistics

### Parent Endpoints
- `GET /parents` - Get all parents (with pagination)
- `POST /parents` - Create new parent
- `GET /parents/:id` - Get parent by ID
- `PUT /parents/:id` - Update parent
- `DELETE /parents/:id` - Delete parent
- `POST /parents/:parentId/link-student` - Link parent to student
- `DELETE /parents/:parentId/unlink-student/:studentId` - Unlink parent from student
- `GET /parents/:parentId/students` - Get parent's students
- `GET /parents/student/:studentId` - Get student's parents
- `GET /parents/stats` - Get parent statistics

### Academic Endpoints
- `GET /academic/grades` - Get all grades
- `POST /academic/grades` - Create new grade
- `GET /academic/grades/:id` - Get grade by ID
- `PUT /academic/grades/:id` - Update grade
- `DELETE /academic/grades/:id` - Delete grade

- `GET /academic/sections` - Get all sections
- `POST /academic/sections` - Create new section
- `GET /academic/sections/:id` - Get section by ID
- `PUT /academic/sections/:id` - Update section
- `DELETE /academic/sections/:id` - Delete section

- `GET /academic/subjects` - Get all subjects
- `POST /academic/subjects` - Create new subject
- `GET /academic/subjects/:id` - Get subject by ID
- `PUT /academic/subjects/:id` - Update subject
- `DELETE /academic/subjects/:id` - Delete subject
- `POST /academic/subjects/assign-grade` - Assign subject to grade
- `GET /academic/grades/:gradeId/subjects` - Get subjects by grade

- `GET /academic/academic-years` - Get all academic years
- `POST /academic/academic-years` - Create new academic year
- `GET /academic/academic-years/current` - Get current academic year
- `PUT /academic/academic-years/:yearId/set-current` - Set current academic year

- `GET /academic/academic-years/:academicYearId/terms` - Get terms by academic year
- `POST /academic/terms` - Create new term
- `GET /academic/terms/current` - Get current term
- `PUT /academic/terms/:termId/set-current` - Set current term

### Attendance Endpoints
- `POST /attendance/mark` - Mark attendance for a student
- `POST /attendance/mark-bulk` - Mark attendance for multiple students
- `GET /attendance` - Get attendance records (with pagination)
- `GET /attendance/:id` - Get attendance by ID
- `PUT /attendance/:id` - Update attendance
- `DELETE /attendance/:id` - Delete attendance
- `GET /attendance/student/:studentId/summary` - Get student attendance summary
- `GET /attendance/section/:sectionId/summary` - Get section attendance summary
- `GET /attendance/daily/:date` - Get daily attendance report
- `GET /attendance/monthly/:year/:month` - Get monthly attendance report
- `GET /attendance/stats` - Get attendance statistics

### Exam Endpoints
- `GET /exams/examinations` - Get all examinations (with pagination)
- `POST /exams/examinations` - Create new examination
- `GET /exams/examinations/:id` - Get examination by ID
- `PUT /exams/examinations/:id` - Update examination
- `DELETE /exams/examinations/:id` - Delete examination
- `GET /exams/examinations/upcoming` - Get upcoming examinations

- `GET /exams/results` - Get exam results (with pagination)
- `POST /exams/results` - Add exam result
- `PUT /exams/results/:id` - Update exam result
- `GET /exams/examinations/:examinationId/results` - Get exam results by examination
- `GET /exams/students/:studentId/results` - Get student exam results
- `GET /exams/stats` - Get exam statistics

## 🔐 Authentication

All protected endpoints require a Bearer token in the Authorization header:

```bash
Authorization: Bearer <your-jwt-token>
```

### Role Permissions

- **Admin**: Full access to all endpoints
- **Teacher**: Access to students, attendance, exams, and academic data
- **Parent**: Access to their children's data only
- **Student**: Access to their own data only

## 📊 Database Schema

The database includes the following main tables:

- `users` - Base user table
- `roles` - User roles and permissions
- `students` - Student profiles
- `teachers` - Teacher profiles
- `parents` - Parent profiles
- `grades` - Grade levels
- `sections` - Class sections
- `subjects` - Subjects
- `academic_years` - Academic years
- `terms` - Terms/semesters
- `attendance` - Attendance records
- `examinations` - Exam information
- `exam_results` - Exam results
- `fee_structures` - Fee structures
- `payments` - Payment records
- `system_settings` - System configuration

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix
```

## 📝 Scripts

```bash
# Development
npm run dev          # Start development server with nodemon

# Production
npm run build        # Build TypeScript to JavaScript
npm start           # Start production server

# Database
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with sample data

# Utilities
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
```

## 🚀 Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set environment variables**
   ```bash
   export NODE_ENV=production
   export DB_HOST=your-production-db-host
   export DB_PASSWORD=your-production-db-password
   # ... other production variables
   ```

3. **Start the server**
   ```bash
   npm start
   ```

## 📁 Project Structure

```
src/
├── config/           # Configuration files
│   ├── database.ts   # Database connection
│   └── index.ts      # App configuration
├── controllers/      # Route controllers
│   ├── authController.ts
│   ├── studentController.ts
│   ├── teacherController.ts
│   ├── parentController.ts
│   ├── academicController.ts
│   ├── attendanceController.ts
│   └── examController.ts
├── middlewares/      # Express middlewares
│   ├── auth.ts       # Authentication middleware
│   ├── validation.ts # Request validation
│   └── errorHandler.ts # Error handling
├── models/           # Database models (if using ORM)
├── routes/           # API routes
│   ├── auth.ts
│   ├── students.ts
│   ├── teachers.ts
│   ├── parents.ts
│   ├── academic.ts
│   ├── attendance.ts
│   └── exams.ts
├── services/         # Business logic
│   ├── authService.ts
│   ├── studentService.ts
│   ├── teacherService.ts
│   ├── parentService.ts
│   ├── academicService.ts
│   ├── attendanceService.ts
│   └── examService.ts
├── types/            # TypeScript type definitions
│   └── index.ts
├── utils/            # Utility functions
│   ├── logger.ts     # Logging utility
│   └── helpers.ts    # Helper functions
└── index.ts          # Application entry point

database/
├── schema.sql        # Database schema
└── seed.sql          # Sample data
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@schoolmanagement.com or create an issue in the repository.

## 🔄 Version History

- **v1.0.0** - Initial release with core functionality
  - Authentication system
  - User management (Students, Teachers, Parents)
  - Academic management (Grades, Sections, Subjects)
  - Attendance system
  - Examination system
  - Basic reporting

---

**Built with ❤️ for Ethiopian Primary Schools**
