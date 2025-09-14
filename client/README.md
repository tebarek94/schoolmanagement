# School Management System - Frontend

A comprehensive React TypeScript frontend for the School Management System, designed for primary schools in Addis Ababa.

## 🚀 Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin, Teacher, Parent)
- Protected routes and components
- Session management with refresh tokens

### Dashboard
- Role-specific dashboard views
- Real-time statistics and metrics
- Quick action buttons
- Recent activity feed

### Student Management
- Complete student CRUD operations
- Student profile management
- Enrollment and transfer functionality
- Academic history tracking
- Parent-student relationships

### Teacher Management
- Teacher profile management
- Subject and class assignments
- Workload tracking
- Performance monitoring

### Parent Management
- Parent profile management
- Student-parent relationships
- Communication tools
- Payment tracking

### Academic Management
- Grade and section management
- Subject assignments
- Academic year and term management
- Curriculum planning

### Attendance Management
- Daily attendance marking
- Bulk attendance operations
- Attendance reports and analytics
- Calendar view integration

### Examination Management
- Exam creation and scheduling
- Result entry and management
- Report card generation
- Grade calculation and analytics

### Payment Management
- Fee structure management
- Payment processing
- Receipt generation
- Payment tracking and reports

### Reports & Analytics
- Comprehensive reporting system
- Data visualization
- Export functionality (PDF, Excel, CSV)
- Performance analytics

## 🛠️ Tech Stack

- **React 18** - Frontend framework
- **TypeScript** - Type safety and better development experience
- **TailwindCSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **React Hook Form** - Form handling and validation
- **Axios** - HTTP client for API communication
- **React Hot Toast** - Toast notifications
- **Lucide React** - Icon library
- **Date-fns** - Date manipulation utilities

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── layout/         # Layout components (Header, Sidebar)
│   └── ui/             # Basic UI components (Button, Input, Card, etc.)
├── contexts/           # React contexts (Auth, Theme)
├── pages/              # Page components
│   ├── auth/           # Authentication pages
│   ├── students/       # Student management pages
│   ├── teachers/       # Teacher management pages
│   ├── parents/        # Parent management pages
│   ├── academic/       # Academic management pages
│   ├── attendance/     # Attendance management pages
│   ├── exams/          # Examination management pages
│   ├── payments/       # Payment management pages
│   ├── reports/        # Reports and analytics pages
│   └── settings/       # Settings pages
├── services/           # API service layer
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── App.tsx             # Main application component
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API server running

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd school-management/client
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure environment variables:
```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_APP_NAME=School Management System
```

5. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`.

## 🔧 Configuration

### Environment Variables

- `REACT_APP_API_URL` - Backend API base URL
- `REACT_APP_APP_NAME` - Application name
- `REACT_APP_VERSION` - Application version

### TailwindCSS Configuration

The project uses a custom TailwindCSS configuration with:
- Custom color palette
- Extended spacing and animations
- Component-specific utility classes
- Dark mode support

## 🎨 UI Components

### Core Components

- **Button** - Various button styles and states
- **Input** - Form input with validation
- **Select** - Dropdown selection component
- **Card** - Content container component
- **Badge** - Status and label component
- **LoadingSpinner** - Loading indicator

### Layout Components

- **Layout** - Main application layout wrapper
- **Header** - Top navigation bar
- **Sidebar** - Side navigation menu
- **ProtectedRoute** - Route protection wrapper
- **RoleRoute** - Role-based route protection

## 🔐 Authentication

The application uses JWT-based authentication with:

- Login/logout functionality
- Token refresh mechanism
- Role-based access control
- Protected routes and components
- Session persistence

### User Roles

- **Admin** - Full system access
- **Teacher** - Limited access to students, attendance, exams
- **Parent** - Access to their children's information

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile devices

## 🌙 Theme Support

- Light and dark mode support
- System preference detection
- Theme persistence
- Smooth theme transitions

## 🔄 State Management

- React Context for global state
- Local component state with hooks
- Form state with React Hook Form
- API state management with custom hooks

## 📊 Data Visualization

- Charts and graphs for analytics
- Progress indicators
- Status badges and indicators
- Data tables with sorting and filtering

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 🚀 Building for Production

```bash
# Build the application
npm run build

# Serve the built application
npm run serve
```

## 📦 Deployment

The application can be deployed to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Any static hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Future Enhancements

- Real-time notifications
- Advanced reporting features
- Mobile app integration
- Multi-language support
- Advanced analytics dashboard
- Integration with external systems
- Automated backup and recovery
- Advanced security features

---

**Note**: This frontend is designed to work with the School Management System backend API. Make sure the backend server is running and properly configured before using this frontend.




