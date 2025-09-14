import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  UserCheck, 
  Calendar, 
  FileText, 
  CreditCard, 
  BarChart3, 
  Settings, 
  User,
  School,
  BookMarked,
  Award,
  BookOpen,
  TrendingUp,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../utils/helpers';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: string[];
}

const navigation: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['Admin', 'Teacher', 'Student', 'Parent'],
  },
  
  // === ADMIN ONLY SECTIONS ===
  {
    name: 'Students',
    href: '/students',
    icon: Users,
    roles: ['Admin'],
  },
  {
    name: 'Teachers',
    href: '/teachers',
    icon: GraduationCap,
    roles: ['Admin'],
  },
  {
    name: 'Parents',
    href: '/parents',
    icon: UserCheck,
    roles: ['Admin'],
  },
  {
    name: 'Classes & Sections',
    href: '/academic/classes',
    icon: School,
    roles: ['Admin'],
  },
  {
    name: 'Subjects',
    href: '/academic/subjects',
    icon: BookMarked,
    roles: ['Admin'],
  },
  {
    name: 'Attendance',
    href: '/attendance',
    icon: Calendar,
    roles: ['Admin'],
  },
  {
    name: 'Exams',
    href: '/exams',
    icon: FileText,
    roles: ['Admin'],
  },
  {
    name: 'Payments',
    href: '/payments',
    icon: CreditCard,
    roles: ['Admin'],
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: BarChart3,
    roles: ['Admin'],
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    roles: ['Admin'],
  },

  // === TEACHER ONLY SECTIONS ===
  {
    name: 'My Classes',
    href: '/teacher/classes',
    icon: School,
    roles: ['Teacher'],
  },
  {
    name: 'Grade Students',
    href: '/teacher/grading',
    icon: Award,
    roles: ['Teacher'],
  },

  // === STUDENT & PARENT SECTIONS ===
  {
    name: 'My Grades',
    href: '/grades',
    icon: Award,
    roles: ['Student', 'Parent'],
  },
  {
    name: 'My Courses',
    href: '/courses',
    icon: BookOpen,
    roles: ['Student', 'Parent'],
  },
  {
    name: 'My Exams',
    href: '/student/exams',
    icon: FileText,
    roles: ['Student', 'Parent'],
  },
  {
    name: 'My Payments',
    href: '/student/payments',
    icon: CreditCard,
    roles: ['Student', 'Parent'],
  },
  {
    name: 'My Progress',
    href: '/student/progress',
    icon: TrendingUp,
    roles: ['Student', 'Parent'],
  },
];

export const Sidebar: React.FC = () => {
  const { hasAnyRole, logout } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
  };

  const filteredNavigation = navigation.filter(item => 
    hasAnyRole(item.roles)
  );

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <School className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">SchoolMS</h1>
            <p className="text-xs text-gray-500">Management System</p>
          </div>
        </div>
      </div>

      <div className="sidebar-content">
        <nav className="sidebar-nav">
          {filteredNavigation.map((item) => {
            const isActive = location.pathname === item.href || 
              (item.href !== '/dashboard' && location.pathname.startsWith(item.href));
            
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={cn(
                  'sidebar-nav-item',
                  isActive ? 'sidebar-nav-item-active' : 'sidebar-nav-item-inactive'
                )}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="sidebar-footer">
        <NavLink
          to="/profile"
          className={cn(
            'sidebar-nav-item',
            location.pathname === '/profile' 
              ? 'sidebar-nav-item-active' 
              : 'sidebar-nav-item-inactive'
          )}
        >
          <User className="w-5 h-5 mr-3" />
          Profile
        </NavLink>
        
        <button
          onClick={handleLogout}
          className={cn(
            'sidebar-nav-item sidebar-nav-item-inactive w-full text-left',
            'hover:bg-gray-100 hover:text-gray-900'
          )}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};
