import React, { useState } from 'react';
import { 
  Save, 
  RefreshCw, 
  Database, 
  Mail, 
  Shield, 
  Bell, 
  Globe, 
  Users,
  School,
  Calendar,
  DollarSign,
  FileText,
  Settings as SettingsIcon,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

interface SettingSection {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface SystemSettings {
  schoolName: string;
  schoolAddress: string;
  schoolPhone: string;
  schoolEmail: string;
  schoolWebsite: string;
  academicYear: string;
  term: string;
  currency: string;
  timezone: string;
  dateFormat: string;
  language: string;
  maxStudentsPerClass: number;
  attendanceThreshold: number;
  gradingScale: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  autoBackup: boolean;
  backupFrequency: string;
  sessionTimeout: number;
  passwordPolicy: string;
  twoFactorAuth: boolean;
  maintenanceMode: boolean;
}

export const SettingsPage: React.FC = () => {
  const { hasRole } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('general');
  const [settings, setSettings] = useState<SystemSettings>({
    schoolName: 'Greenwood High School',
    schoolAddress: '123 Education Street, Learning City, LC 12345',
    schoolPhone: '+1 (555) 123-4567',
    schoolEmail: 'info@greenwoodhigh.edu',
    schoolWebsite: 'https://www.greenwoodhigh.edu',
    academicYear: '2024-2025',
    term: 'Term 1',
    currency: 'USD',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    language: 'English',
    maxStudentsPerClass: 30,
    attendanceThreshold: 75,
    gradingScale: 'A-F',
    emailNotifications: true,
    smsNotifications: false,
    autoBackup: true,
    backupFrequency: 'daily',
    sessionTimeout: 30,
    passwordPolicy: 'strong',
    twoFactorAuth: false,
    maintenanceMode: false
  });

  const sections: SettingSection[] = [
    {
      id: 'general',
      title: 'General Settings',
      description: 'Basic school information and preferences',
      icon: School,
      color: 'bg-blue-500'
    },
    {
      id: 'academic',
      title: 'Academic Settings',
      description: 'Academic year, terms, and grading configuration',
      icon: Calendar,
      color: 'bg-green-500'
    },
    {
      id: 'financial',
      title: 'Financial Settings',
      description: 'Currency, fees, and payment configurations',
      icon: DollarSign,
      color: 'bg-yellow-500'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Email, SMS, and system notification preferences',
      icon: Bell,
      color: 'bg-purple-500'
    },
    {
      id: 'security',
      title: 'Security Settings',
      description: 'Authentication, passwords, and access control',
      icon: Shield,
      color: 'bg-red-500'
    },
    {
      id: 'system',
      title: 'System Settings',
      description: 'Backup, maintenance, and technical configurations',
      icon: SettingsIcon,
      color: 'bg-gray-500'
    }
  ];

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Settings saved:', settings);
      // In a real implementation, this would call the API to save settings
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to default values?')) {
      // Reset to default values
      setSettings({
        schoolName: 'Greenwood High School',
        schoolAddress: '123 Education Street, Learning City, LC 12345',
        schoolPhone: '+1 (555) 123-4567',
        schoolEmail: 'info@greenwoodhigh.edu',
        schoolWebsite: 'https://www.greenwoodhigh.edu',
        academicYear: '2024-2025',
        term: 'Term 1',
        currency: 'USD',
        timezone: 'America/New_York',
        dateFormat: 'MM/DD/YYYY',
        language: 'English',
        maxStudentsPerClass: 30,
        attendanceThreshold: 75,
        gradingScale: 'A-F',
        emailNotifications: true,
        smsNotifications: false,
        autoBackup: true,
        backupFrequency: 'daily',
        sessionTimeout: 30,
        passwordPolicy: 'strong',
        twoFactorAuth: false,
        maintenanceMode: false
      });
    }
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            School Name
          </label>
          <Input
            value={settings.schoolName}
            onChange={(e) => setSettings({...settings, schoolName: e.target.value})}
            placeholder="Enter school name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            School Phone
          </label>
          <Input
            value={settings.schoolPhone}
            onChange={(e) => setSettings({...settings, schoolPhone: e.target.value})}
            placeholder="Enter phone number"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          School Address
        </label>
        <Input
          value={settings.schoolAddress}
          onChange={(e) => setSettings({...settings, schoolAddress: e.target.value})}
          placeholder="Enter school address"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            School Email
          </label>
          <Input
            type="email"
            value={settings.schoolEmail}
            onChange={(e) => setSettings({...settings, schoolEmail: e.target.value})}
            placeholder="Enter email address"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            School Website
          </label>
          <Input
            value={settings.schoolWebsite}
            onChange={(e) => setSettings({...settings, schoolWebsite: e.target.value})}
            placeholder="Enter website URL"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Language
          </label>
          <Select
            value={settings.language}
            onChange={(e) => setSettings({...settings, language: e.target.value})}
            options={[
              { value: 'English', label: 'English' },
              { value: 'Spanish', label: 'Spanish' },
              { value: 'French', label: 'French' },
              { value: 'German', label: 'German' }
            ]}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Timezone
          </label>
          <Select
            value={settings.timezone}
            onChange={(e) => setSettings({...settings, timezone: e.target.value})}
            options={[
              { value: 'America/New_York', label: 'Eastern Time' },
              { value: 'America/Chicago', label: 'Central Time' },
              { value: 'America/Denver', label: 'Mountain Time' },
              { value: 'America/Los_Angeles', label: 'Pacific Time' }
            ]}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date Format
          </label>
          <Select
            value={settings.dateFormat}
            onChange={(e) => setSettings({...settings, dateFormat: e.target.value})}
            options={[
              { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
              { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
              { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }
            ]}
          />
        </div>
      </div>
    </div>
  );

  const renderAcademicSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Academic Year
          </label>
          <Input
            value={settings.academicYear}
            onChange={(e) => setSettings({...settings, academicYear: e.target.value})}
            placeholder="e.g., 2024-2025"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Term
          </label>
          <Select
            value={settings.term}
            onChange={(e) => setSettings({...settings, term: e.target.value})}
            options={[
              { value: 'Term 1', label: 'Term 1' },
              { value: 'Term 2', label: 'Term 2' },
              { value: 'Term 3', label: 'Term 3' },
              { value: 'Semester 1', label: 'Semester 1' },
              { value: 'Semester 2', label: 'Semester 2' }
            ]}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Students Per Class
          </label>
          <Input
            type="number"
            value={settings.maxStudentsPerClass}
            onChange={(e) => setSettings({...settings, maxStudentsPerClass: parseInt(e.target.value)})}
            min="1"
            max="50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Attendance Threshold (%)
          </label>
          <Input
            type="number"
            value={settings.attendanceThreshold}
            onChange={(e) => setSettings({...settings, attendanceThreshold: parseInt(e.target.value)})}
            min="0"
            max="100"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Grading Scale
        </label>
        <Select
          value={settings.gradingScale}
          onChange={(e) => setSettings({...settings, gradingScale: e.target.value})}
          options={[
            { value: 'A-F', label: 'A-F Scale' },
            { value: '1-100', label: 'Percentage (1-100)' },
            { value: '1-10', label: '1-10 Scale' },
            { value: 'Pass/Fail', label: 'Pass/Fail' }
          ]}
        />
      </div>
    </div>
  );

  const renderFinancialSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Currency
          </label>
          <Select
            value={settings.currency}
            onChange={(e) => setSettings({...settings, currency: e.target.value})}
            options={[
              { value: 'USD', label: 'US Dollar ($)' },
              { value: 'EUR', label: 'Euro (€)' },
              { value: 'GBP', label: 'British Pound (£)' },
              { value: 'CAD', label: 'Canadian Dollar (C$)' }
            ]}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Due Days
          </label>
          <Input
            type="number"
            value="30"
            placeholder="Days"
            min="1"
            max="365"
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-gray-900">Fee Structure</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tuition Fee
            </label>
            <Input
              type="number"
              placeholder="Amount"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transport Fee
            </label>
            <Input
              type="number"
              placeholder="Amount"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Library Fee
            </label>
            <Input
              type="number"
              placeholder="Amount"
              min="0"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-gray-900">Notification Preferences</h4>
        
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center space-x-3">
            <Mail className="w-5 h-5 text-blue-500" />
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-gray-500">Receive notifications via email</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center space-x-3">
            <Bell className="w-5 h-5 text-green-500" />
            <div>
              <p className="font-medium">SMS Notifications</p>
              <p className="text-sm text-gray-500">Receive notifications via SMS</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.smsNotifications}
              onChange={(e) => setSettings({...settings, smsNotifications: e.target.checked})}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
      
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-gray-900">Notification Types</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <input type="checkbox" defaultChecked className="rounded" />
            <span className="text-sm">Attendance Alerts</span>
          </div>
          <div className="flex items-center space-x-3">
            <input type="checkbox" defaultChecked className="rounded" />
            <span className="text-sm">Payment Reminders</span>
          </div>
          <div className="flex items-center space-x-3">
            <input type="checkbox" defaultChecked className="rounded" />
            <span className="text-sm">Exam Notifications</span>
          </div>
          <div className="flex items-center space-x-3">
            <input type="checkbox" className="rounded" />
            <span className="text-sm">System Updates</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-gray-900">Authentication</h4>
        
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center space-x-3">
            <Shield className="w-5 h-5 text-green-500" />
            <div>
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-gray-500">Add an extra layer of security</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.twoFactorAuth}
              onChange={(e) => setSettings({...settings, twoFactorAuth: e.target.checked})}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password Policy
            </label>
            <Select
              value={settings.passwordPolicy}
              onChange={(e) => setSettings({...settings, passwordPolicy: e.target.value})}
              options={[
                { value: 'weak', label: 'Weak (6+ characters)' },
                { value: 'medium', label: 'Medium (8+ characters, mixed case)' },
                { value: 'strong', label: 'Strong (8+ characters, numbers, symbols)' }
              ]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Session Timeout (minutes)
            </label>
            <Input
              type="number"
              value={settings.sessionTimeout}
              onChange={(e) => setSettings({...settings, sessionTimeout: parseInt(e.target.value)})}
              min="5"
              max="480"
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-gray-900">Access Control</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <input type="checkbox" defaultChecked className="rounded" />
            <span className="text-sm">IP Whitelist</span>
          </div>
          <div className="flex items-center space-x-3">
            <input type="checkbox" className="rounded" />
            <span className="text-sm">Login Attempts Limit</span>
          </div>
          <div className="flex items-center space-x-3">
            <input type="checkbox" defaultChecked className="rounded" />
            <span className="text-sm">Account Lockout</span>
          </div>
          <div className="flex items-center space-x-3">
            <input type="checkbox" className="rounded" />
            <span className="text-sm">Audit Logging</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-gray-900">Backup & Maintenance</h4>
        
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center space-x-3">
            <Database className="w-5 h-5 text-blue-500" />
            <div>
              <p className="font-medium">Automatic Backup</p>
              <p className="text-sm text-gray-500">Automatically backup system data</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.autoBackup}
              onChange={(e) => setSettings({...settings, autoBackup: e.target.checked})}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Backup Frequency
            </label>
            <Select
              value={settings.backupFrequency}
              onChange={(e) => setSettings({...settings, backupFrequency: e.target.value})}
              options={[
                { value: 'daily', label: 'Daily' },
                { value: 'weekly', label: 'Weekly' },
                { value: 'monthly', label: 'Monthly' }
              ]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Backup Retention (days)
            </label>
            <Input
              type="number"
              defaultValue="30"
              min="1"
              max="365"
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center space-x-3">
            <SettingsIcon className="w-5 h-5 text-orange-500" />
            <div>
              <p className="font-medium">Maintenance Mode</p>
              <p className="text-sm text-gray-500">Enable maintenance mode for system updates</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.maintenanceMode}
              onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
      
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-gray-900">System Actions</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button variant="outline" className="justify-start">
            <Database className="w-4 h-4 mr-2" />
            Create Manual Backup
          </Button>
          <Button variant="outline" className="justify-start">
            <RefreshCw className="w-4 h-4 mr-2" />
            Clear Cache
          </Button>
          <Button variant="outline" className="justify-start">
            <FileText className="w-4 h-4 mr-2" />
            Export System Logs
          </Button>
          <Button variant="outline" className="justify-start">
            <AlertCircle className="w-4 h-4 mr-2" />
            System Health Check
          </Button>
        </div>
      </div>
    </div>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'general':
        return renderGeneralSettings();
      case 'academic':
        return renderAcademicSettings();
      case 'financial':
        return renderFinancialSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'security':
        return renderSecuritySettings();
      case 'system':
        return renderSystemSettings();
      default:
        return renderGeneralSettings();
    }
  };

  if (!hasRole('admin')) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access system settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600 mt-2">Configure system preferences and settings</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={handleResetSettings}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSaveSettings} disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                      activeSection === section.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                    }`}
                  >
                    <div className={`p-1 rounded ${section.color}`}>
                      <section.icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className={`font-medium ${activeSection === section.id ? 'text-blue-600' : 'text-gray-900'}`}>
                        {section.title}
                      </p>
                      <p className="text-xs text-gray-500">{section.description}</p>
                    </div>
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <div className={`p-1 rounded mr-3 ${sections.find(s => s.id === activeSection)?.color}`}>
                  {React.createElement(sections.find(s => s.id === activeSection)?.icon || SettingsIcon, { className: "w-5 h-5 text-white" })}
                </div>
                {sections.find(s => s.id === activeSection)?.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderActiveSection()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};





