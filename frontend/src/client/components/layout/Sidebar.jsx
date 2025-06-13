import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  UsersIcon,
  ClockIcon,
  CalendarIcon,
  CashIcon,
  DocumentTextIcon,
  UserIcon,
  BellIcon,
  LogoutIcon,
} from '@heroicons/react/outline';
import AuthContext from '../../context/auth/authContext';

const Sidebar = () => {
  const authContext = useContext(AuthContext);
  const location = useLocation();
  const { user } = authContext;

  const navItems = [
    {
      name: 'Dashboard',
      path: '/',
      icon: HomeIcon,
      allowedRoles: ['admin', 'employee'],
    },
    {
      name: 'Profile',
      path: '/profile',
      icon: UserIcon,
      allowedRoles: ['admin', 'employee'],
    },
    {
      name: 'Employees',
      path: '/employees',
      icon: UsersIcon,
      allowedRoles: ['admin'],
    },
    {
      name: 'Attendance',
      path: '/attendance',
      icon: ClockIcon,
      allowedRoles: ['admin'],
    },
    {
      name: 'My Attendance',
      path: '/my-attendance',
      icon: ClockIcon,
      allowedRoles: ['employee'],
    },
    {
      name: 'Leaves',
      path: '/leaves',
      icon: CalendarIcon,
      allowedRoles: ['admin'],
    },
    {
      name: 'My Leaves',
      path: '/my-leaves',
      icon: CalendarIcon,
      allowedRoles: ['employee'],
    },
    {
      name: 'Payroll',
      path: '/payroll',
      icon: CashIcon,
      allowedRoles: ['admin'],
    },
    {
      name: 'My Payroll',
      path: '/my-payroll',
      icon: CashIcon,
      allowedRoles: ['employee'],
    },
    {
      name: 'Notifications',
      path: '/notifications',
      icon: BellIcon,
      allowedRoles: ['admin', 'employee'],
    },
  ];

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
        <div className="h-0 flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              HR Portal
            </h1>
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navItems.map((item) => {
              if (!item.allowedRoles.includes(user?.role)) return null;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon
                    className={`mr-3 flex-shrink-0 h-5 w-5 ${
                      isActive
                        ? 'text-primary-500'
                        : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <div className="flex items-center">
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">
                {user && `${user.firstName} ${user.lastName}`}
              </p>
              <p className="text-xs font-medium text-gray-500">
                {user && user.role === 'admin' ? 'Administrator' : 'Employee'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;