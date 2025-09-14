import React from 'react';
import { 
  Bell, 
  Search, 
  Moon, 
  Sun,
  School,
  Calendar,
  Clock
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { getInitials, getFullName } from '../../utils/helpers';

export const Header: React.FC = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const getCurrentDateTime = () => {
    const now = new Date();
    const date = now.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    const time = now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
    return { date, time };
  };

  const { date, time } = getCurrentDateTime();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section - Logo and Brand */}


        {/* Center Section - Search */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search students, teachers, classes..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Right Section - Actions and User */}
        <div className="flex items-center space-x-6">
          {/* Quick Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              className="px-3 py-2 text-sm"
            >
              Quick Add
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="px-3 py-2 text-sm"
            >
              Reports
            </Button>
          </div>

          {/* Theme Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className="p-2"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>

          {/* Notifications */}
          <Button
            variant="outline"
            size="sm"
            className="p-2 relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              3
            </span>
          </Button>

          {/* User Profile Section */}
          <div className="flex items-center space-x-4 pl-4 border-l border-gray-200">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {user?.profile ? 
                  getFullName(
                    user.profile.first_name || '', 
                    user.profile.last_name || '',
                    user.profile.middle_name
                  ) : 
                  user?.email
                }
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {user?.role}
              </p>
            </div>
            
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center border-2 border-primary-200">
              {(user?.profile && 'profile_image' in user.profile && user.profile.profile_image) ? (
                <img
                  src={user.profile.profile_image}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <span className="text-sm font-medium text-primary-700">
                  {user?.profile ? 
                    getInitials(
                      user.profile.first_name || '', 
                      user.profile.last_name || ''
                    ) : 
                    user?.email?.charAt(0).toUpperCase()
                  }
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
