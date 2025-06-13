import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context Providers
import { AuthProvider } from './context/auth/AuthProvider.jsx';
import { AttendanceProvider } from './context/attendance/attendanceContext.jsx';
import { LeaveProvider } from './context/leave/leaveContext.jsx';
import { PayrollProvider } from './context/payroll/payrollContext.jsx';
import { NotificationProvider } from './context/notification/notificationContext.jsx';

// Employee Pages
import EmployeeLogin from './client/components/pages/EmployeeLogin';
import EmployeeSignup from './client/components/pages/EmployeeSignup';
import EmployeeDashboard from './client/components/pages/EmployeeDashboard';
import EmployeeProfile from './client/components/pages/EmployeeProfile';
import EmployeeAttendance from './client/components/pages/EmployeeAttendance';
import EmployeeLeaves from './client/components/pages/EmployeeLeaves';
import EmployeePayroll from './client/components/pages/EmployeePayroll';
import EmployeeNotifications from './client/components/pages/EmployeeNotifications';

// Admin Pages
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import AdminEmployees from './admin/AdminEmployees';
import AdminEmployeeView from './admin/AdminEmployeeView';
import AdminAttendance from './admin/AdminAttendance';
import AdminLeaveApproval from './admin/AdminLeaveApproval';
import AdminPayroll from './admin/AdminPayroll';
import AdminNotifications from './admin/AdminNotifications';
import AdminSignup from './admin/AdminSignup';

// Unauthorized Page
const Unauthorized = () => (
  <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
    <h2 className="text-3xl font-extrabold text-gray-900">Access Denied</h2>
    <p className="mt-2 text-center text-sm text-gray-600">You do not have permission to view this page.</p>
    <div className="mt-6">
      <Link to="/" className="font-medium text-blue-600 hover:text-blue-500">Go to Home</Link>
    </div>
  </div>
);

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/login" element={<EmployeeLogin />} />
        <Route path="/signup" element={<EmployeeSignup />} />
        <Route path="/adminlogin" element={<AdminLogin />} />

        {/* Redirect root path to employee login by default */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Private Employee Routes */}
        <Route path="/employeedashboard" element={<EmployeeDashboard />} />
        <Route path="/employeeprofile" element={<EmployeeProfile />} />
        <Route path="/employeenotifications" element={<EmployeeNotifications />} />
        <Route path="/employeeattendance" element={<EmployeeAttendance />} />
        <Route path="/employeeleaves" element={<EmployeeLeaves />} />
        <Route path="/employeepayroll" element={<EmployeePayroll />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/employees" element={<AdminEmployees />} />
        <Route path="/admin/employees/:id" element={<AdminEmployeeView />} />
        <Route path="/admin/attendance" element={<AdminAttendance />} />
        <Route path="/admin/leaveapproval" element={<AdminLeaveApproval />} />
        <Route path="/admin/payroll" element={<AdminPayroll />} />
        <Route path="/admin/notifications" element={<AdminNotifications />} />
        <Route path="/admin/signup" element={<AdminSignup />} />

        {/* Catch-all for undefined routes */}
        <Route path="*" element={<Navigate to="/unauthorized" />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={5000} />
    </Router>
  );
};

// Export App wrapped with all providers for better readability and maintainability
const AppWithProviders = () => (
  <AuthProvider>
    <AttendanceProvider>
      <LeaveProvider>
        <PayrollProvider>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </PayrollProvider>
      </LeaveProvider>
    </AttendanceProvider>
  </AuthProvider>
);

export default AppWithProviders;