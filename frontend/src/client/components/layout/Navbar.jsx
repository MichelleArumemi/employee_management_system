import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { BellIcon, MenuAlt1Icon, XIcon } from '@heroicons/react/outline';
import AuthContext from '../../context/auth/authContext';
import NotificationContext from '../../context/notification/notificationContext';

const Navbar = () => {
  const authContext = useContext(AuthContext);
  const notificationContext = useContext(NotificationContext);
  const history = useHistory();
  const { isAuthenticated, logout, user } = authContext;
  const { unreadCount } = notificationContext;
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const onLogout = () => {
    logout();
    history.push('/login');
  };

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <button
              className="md:hidden text-gray-500 hover:text-gray-900 focus:outline-none"
              onClick={() => setMobileMenuOpen(true)}
            >
              <MenuAlt1Icon className="h-6 w-6" />
            </button>
          </div>
          <div className="flex items-center">
            <Link
              to="/notifications"
              className="p-1 rounded-full text-gray-400 hover:text-gray-500 relative"
            >
              <BellIcon className="h-6 w-6" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              )}
            </Link>
            <div className="ml-3 relative">
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-700">
                  {user && `${user.firstName} ${user.lastName}`}
                </div>
                <button
                  onClick={onLogout}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden fixed inset-0 bg-gray-600 bg-opacity-75 z-20 ${mobileMenuOpen ? 'block' : 'hidden'}`}
        onClick={() => setMobileMenuOpen(false)}
      >
        <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-lg">
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <div className="text-lg font-medium text-gray-900">Menu</div>
            <button
              className="text-gray-500 hover:text-gray-900 focus:outline-none"
              onClick={() => setMobileMenuOpen(false)}
            >
              <XIcon className="h-6 w-6" />
            </button>
          </div>
          <div className="p-4 space-y-4">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/profile"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Profile
            </Link>
            {user && user.role === 'admin' && (
              <>
                <Link
                  to="/employees"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Employees
                </Link>
                <Link
                  to="/attendance"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Attendance
                </Link>
                <Link
                  to="/leaves"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Leaves
                </Link>
                <Link
                  to="/payroll"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Payroll
                </Link>
              </>
            )}
            <Link
              to="/my-attendance"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              My Attendance
            </Link>
            <Link
              to="/my-leaves"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              My Leaves
            </Link>
            <Link
              to="/my-payroll"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              My Payroll
            </Link>
            <Link
              to="/notifications"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Notifications
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;