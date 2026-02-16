import React, { useState } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Plus, 
  User, 
  Menu,
  X,
  LogOut,
  ChevronDown
} from 'lucide-react';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // Get user data from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const displayName = user.businessName || user.fullName || 'User';
  const email = user.email || 'user@example.com';

  // Get initials for avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: FileText, label: 'Invoices', path: '/invoices' },
  { icon: User, label: 'Profile', path: '/profile' },
];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-64 bg-white border-r border-gray-200 transition-transform duration-300 lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-sm">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">AI Invoice</span>
            </Link>
            
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    active
                      ? 'bg-blue-50 text-blue-600 font-medium shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${active ? 'text-blue-600' : 'text-gray-500'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            {/* Left Side - Mobile Menu + Page Title */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
              
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {location.pathname === '/dashboard' && 'Dashboard'}
                  {location.pathname === '/invoices' && 'All Invoices'}
                  {location.pathname === '/invoices/new' && 'Create Invoice'}
                  {location.pathname === '/profile' && 'Profile'}
                  {location.pathname.startsWith('/invoices/') && !location.pathname.includes('/new') && 'Invoice Details'}
                </h1>
                {location.pathname === '/dashboard' && (
                  <p className="text-sm text-gray-600 hidden sm:block">
                    Welcome back, {displayName}! 👋
                  </p>
                )}
              </div>
            </div>

            {/* Right Side - Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-semibold shadow-sm">
                  {getInitials(displayName)}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold text-gray-900">{displayName}</p>
                  <p className="text-xs text-gray-600">{email}</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isProfileDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsProfileDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{displayName}</p>
                      <p className="text-xs text-gray-600 truncate">{email}</p>
                    </div>
                    
                    <Link
                      to="/profile"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                    >
                      <User className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-700">Profile Settings</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2 hover:bg-red-50 transition-colors text-left border-t border-gray-100 mt-2"
                    >
                      <LogOut className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-red-600 font-medium">Logout</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-gray-900 bg-opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
