import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Clock, 
  FileText, 
  DollarSign, 
  Bell, 
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  BarChart3,
  PieChart
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    presentToday: 0,
    absentToday: 0,
    pendingLeaves: 0,
    approvedLeaves: 0,
    totalPayroll: 0,
    unreadNotifications: 0
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  // Simulate data loading
  useEffect(() => {
    // Mock data - replace with actual API calls
    setStats({
      totalEmployees: 145,
      activeEmployees: 142,
      presentToday: 128,
      absentToday: 14,
      pendingLeaves: 8,
      approvedLeaves: 12,
      totalPayroll: 425000,
      unreadNotifications: 5
    });

    setRecentActivities([
      { id: 1, type: 'leave', message: 'John Doe submitted a leave request', time: '2 hours ago' },
      { id: 2, type: 'attendance', message: 'Sarah Wilson marked attendance', time: '3 hours ago' },
      { id: 3, type: 'payroll', message: 'Monthly payroll processed', time: '1 day ago' },
      { id: 4, type: 'employee', message: 'New employee Mike Johnson added', time: '2 days ago' }
    ]);

    setUpcomingEvents([
      { id: 1, event: 'Team Meeting', date: '2024-06-15', department: 'Engineering' },
      { id: 2, event: 'Performance Review', date: '2024-06-18', department: 'HR' },
      { id: 3, event: 'Payroll Processing', date: '2024-06-30', department: 'Finance' }
    ]);
  }, []);

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className="text-sm text-green-600 flex items-center mt-1">
              <TrendingUp className="h-4 w-4 mr-1" />
              {trend}
            </p>
          )}
        </div>
        <Icon className="h-8 w-8" style={{ color }} />
      </div>
    </div>
  );

  const QuickAction = ({ title, description, icon: Icon, color, onClick }) => (
    <div 
      className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer border-l-4"
      style={{ borderLeftColor: color }}
      onClick={onClick}
    >
      <div className="flex items-center">
        <Icon className="h-6 w-6 mr-3" style={{ color }} />
        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );

  const ActivityItem = ({ activity }) => {
    const getIcon = (type) => {
      switch (type) {
        case 'leave': return <FileText className="h-4 w-4 text-blue-500" />;
        case 'attendance': return <Clock className="h-4 w-4 text-green-500" />;
        case 'payroll': return <DollarSign className="h-4 w-4 text-purple-500" />;
        case 'employee': return <Users className="h-4 w-4 text-orange-500" />;
        default: return <Bell className="h-4 w-4 text-gray-500" />;
      }
    };

    return (
      <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
        {getIcon(activity.type)}
        <div className="flex-1">
          <p className="text-sm text-gray-900">{activity.message}</p>
          <p className="text-xs text-gray-500">{activity.time}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening in your organization today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Employees"
            value={stats.totalEmployees}
            icon={Users}
            color="#3B82F6"
            trend="+5% from last month"
          />
          <StatCard
            title="Present Today"
            value={stats.presentToday}
            icon={CheckCircle}
            color="#10B981"
            trend="90% attendance rate"
          />
          <StatCard
            title="Pending Leaves"
            value={stats.pendingLeaves}
            icon={FileText}
            color="#F59E0B"
          />
          <StatCard
            title="Monthly Payroll"
            value={`$${stats.totalPayroll.toLocaleString()}`}
            icon={DollarSign}
            color="#8B5CF6"
            trend="+2% from last month"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <QuickAction
                  title="Manage Employees"
                  description="View, add, and edit employee information"
                  icon={Users}
                  color="#3B82F6"
                  onClick={() => console.log('Navigate to Employees')}
                />
                <QuickAction
                  title="View Attendance"
                  description="Monitor daily attendance and patterns"
                  icon={Clock}
                  color="#10B981"
                  onClick={() => console.log('Navigate to Attendance')}
                />
                <QuickAction
                  title="Leave Approvals"
                  description="Review and approve pending leave requests"
                  icon={FileText}
                  color="#F59E0B"
                  onClick={() => console.log('Navigate to Leave Approval')}
                />
                <QuickAction
                  title="Payroll Management"
                  description="Process payroll and generate reports"
                  icon={DollarSign}
                  color="#8B5CF6"
                  onClick={() => console.log('Navigate to Payroll')}
                />
              </div>
            </div>

            {/* Attendance Overview */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Attendance Overview</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">{stats.presentToday}</p>
                  <p className="text-sm text-gray-600">Present</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-red-600">{stats.absentToday}</p>
                  <p className="text-sm text-gray-600">Absent</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <AlertCircle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-yellow-600">3</p>
                  <p className="text-sm text-gray-600">Late</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activities */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activities</h2>
              <div className="space-y-2">
                {recentActivities.map(activity => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
              <button className="w-full mt-4 text-center text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All Activities
              </button>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Events</h2>
              <div className="space-y-3">
                {upcomingEvents.map(event => (
                  <div key={event.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{event.event}</p>
                      <p className="text-xs text-gray-500">{event.date} • {event.department}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                  {stats.unreadNotifications} new
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Payroll due in 3 days</p>
                    <p className="text-xs text-gray-500">Monthly payroll processing</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Bell className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">New leave requests</p>
                    <p className="text-xs text-gray-500">8 pending approvals</p>
                  </div>
                </div>
              </div>
              <button className="w-full mt-4 text-center text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All Notifications
              </button>
            </div>
          </div>
        </div>

        {/* Additional Analytics Section */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Department Overview</h2>
              <BarChart3 className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {[
                { dept: 'Engineering', count: 45, color: 'bg-blue-500' },
                { dept: 'Sales', count: 32, color: 'bg-green-500' },
                { dept: 'Marketing', count: 28, color: 'bg-purple-500' },
                { dept: 'HR', count: 15, color: 'bg-orange-500' },
                { dept: 'Finance', count: 25, color: 'bg-red-500' }
              ].map(dept => (
                <div key={dept.dept} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${dept.color}`}></div>
                    <span className="text-sm font-medium text-gray-900">{dept.dept}</span>
                  </div>
                  <span className="text-sm text-gray-600">{dept.count} employees</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Leave Statistics</h2>
              <PieChart className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Approved Leaves</span>
                <span className="text-sm font-medium text-green-600">{stats.approvedLeaves}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pending Leaves</span>
                <span className="text-sm font-medium text-yellow-600">{stats.pendingLeaves}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Rejected Leaves</span>
                <span className="text-sm font-medium text-red-600">3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total This Month</span>
                <span className="text-sm font-medium text-gray-900">{stats.approvedLeaves + stats.pendingLeaves + 3}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;