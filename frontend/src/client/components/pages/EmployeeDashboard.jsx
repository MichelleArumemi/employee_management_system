
import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Calendar, 
  DollarSign, 
  Bell, 
  User, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  TrendingUp,
  MapPin,
  Phone,
  Mail,
  Award,
  Target,
  Coffee,
  LogOut,
  LogIn
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const EmployeeDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);

  // Mock employee data - replace with actual user context
  const [employeeData, setEmployeeData] = useState({
    name: 'John Doe',
    id: 'EMP001',
    department: 'Engineering',
    position: 'Senior Developer',
    email: 'john.doe@company.com',
    phone: '+1 234 567 8900',
    workingHours: '9:00 AM - 6:00 PM',
    totalLeaves: 25,
    usedLeaves: 8,
    pendingLeaves: 2,
    approvedLeaves: 6,
    currentSalary: 75000,
    attendanceRate: 94,
    performanceScore: 87
  });

  const attendanceData = [
    { date: '1', hours: 8.5 },
    { date: '2', hours: 8.0 },
    { date: '3', hours: 9.0 },
    { date: '4', hours: 8.2 },
    { date: '5', hours: 8.8 },
    { date: '6', hours: 7.5 },
    { date: '7', hours: 8.3 },
    { date: '8', hours: 8.7 },
    { date: '9', hours: 8.1 },
    { date: '10', hours: 8.9 },
    { date: '11', hours: 8.4 },
    { date: '12', hours: 8.0 },
    { date: '13', hours: 8.2 },
    { date: '14', hours: 8.6 }
  ];

  const leaveData = [
    { name: 'Used', value: employeeData.usedLeaves, color: '#EF4444' },
    { name: 'Pending', value: employeeData.pendingLeaves, color: '#F59E0B' },
    { name: 'Available', value: employeeData.totalLeaves - employeeData.usedLeaves - employeeData.pendingLeaves, color: '#10B981' }
  ];

  const recentActivities = [
    { id: 1, type: 'attendance', message: 'Checked in at 9:15 AM', time: 'Today', status: 'success' },
    { id: 2, type: 'leave', message: 'Leave request submitted', time: '2 days ago', status: 'pending' },
    { id: 3, type: 'payroll', message: 'Salary credited', time: '1 week ago', status: 'success' },
    { id: 4, type: 'attendance', message: 'Worked 8.5 hours', time: 'Yesterday', status: 'info' },
    { id: 5, type: 'leave', message: 'Vacation approved', time: '2 weeks ago', status: 'approved' }
  ];

  const upcomingEvents = [
    { id: 1, title: 'Team Meeting', date: 'Today 2:00 PM', type: 'meeting' },
    { id: 2, title: 'Project Deadline', date: 'Tomorrow', type: 'deadline' },
    { id: 3, title: 'Performance Review', date: 'Next Week', type: 'review' },
    { id: 4, title: 'Training Session', date: 'Dec 20', type: 'training' }
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCheckIn = () => {
    if (!isCheckedIn) {
      setIsCheckedIn(true);
      setCheckInTime(new Date());
    } else {
      setIsCheckedIn(false);
      setCheckInTime(null);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color, onClick }) => (
    <div 
      className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {employeeData.name}!</h1>
            <p className="text-gray-600 mt-1">{employeeData.position} • {employeeData.department}</p>
            <p className="text-sm text-gray-500 mt-1">{currentTime.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
          </div>
          
          {/* Quick Actions */}
          <div className="flex space-x-3">
            <button 
              onClick={handleCheckIn}
              className={`px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors ${
                isCheckedIn 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isCheckedIn ? <LogOut className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
              <span>{isCheckedIn ? 'Check Out' : 'Check In'}</span>
            </button>
            <button className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Request Leave</span>
            </button>
          </div>
        </div>

        {/* Time Clock Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Current Time</h2>
              <p className="text-3xl font-mono">{formatTime(currentTime)}</p>
              {isCheckedIn && checkInTime && (
                <p className="text-blue-100 mt-2">
                  Checked in at {formatTime(checkInTime)} • 
                  Working for {Math.floor((currentTime - checkInTime) / (1000 * 60 * 60))}h {Math.floor(((currentTime - checkInTime) / (1000 * 60)) % 60)}m
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-blue-100">Working Hours</p>
              <p className="text-xl font-semibold">{employeeData.workingHours}</p>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                isCheckedIn ? 'bg-green-500 bg-opacity-20 text-green-100' : 'bg-red-500 bg-opacity-20 text-red-100'
              }`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${isCheckedIn ? 'bg-green-300' : 'bg-red-300'}`}></div>
                {isCheckedIn ? 'Checked In' : 'Checked Out'}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            icon={Clock} 
            title="Attendance Rate" 
            value={`${employeeData.attendanceRate}%`}
            subtitle="This month"
            color="bg-blue-500"
            onClick={() => window.location.href = '/employee/attendance'}
          />
          <StatCard 
            icon={Calendar} 
            title="Available Leaves" 
            value={employeeData.totalLeaves - employeeData.usedLeaves - employeeData.pendingLeaves}
            subtitle={`${employeeData.usedLeaves} used, ${employeeData.pendingLeaves} pending`}
            color="bg-green-500"
            onClick={() => window.location.href = '/employee/leaves'}
          />
          <StatCard 
            icon={DollarSign} 
            title="Monthly Salary" 
            value={`${(employeeData.currentSalary / 12).toLocaleString()}`}
            subtitle="Next payout in 15 days"
            color="bg-purple-500"
            onClick={() => window.location.href = '/employee/payroll'}
          />
          <StatCard 
            icon={Award} 
            title="Performance" 
            value={`${employeeData.performanceScore}%`}
            subtitle="Above average"
            color="bg-orange-500"
            onClick={() => window.location.href = '/employee/profile'}
          />
        </div>

        {/* Charts and Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Attendance Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Working Hours (Last 14 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 10]} />
                <Tooltip formatter={(value) => [`${value} hours`, 'Working Hours']} />
                <Line 
                  type="monotone" 
                  dataKey="hours" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Leave Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Leave Balance</h3>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={leaveData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {leaveData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-6 mt-4">
              {leaveData.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <div className={`w-3 h-3 rounded-full mr-2`} style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm font-medium text-gray-700">{item.name}</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                  <div className={`p-1 rounded-full ${
                    activity.status === 'pending' ? 'bg-orange-100' :
                    activity.status === 'success' || activity.status === 'approved' ? 'bg-green-100' :
                    'bg-blue-100'
                  }`}>
                    {activity.status === 'pending' ? 
                      <AlertCircle className="w-4 h-4 text-orange-600" /> :
                      activity.status === 'success' || activity.status === 'approved' ?
                      <CheckCircle className="w-4 h-4 text-green-600" /> :
                      <Clock className="w-4 h-4 text-blue-600" />
                    }
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All Activities
            </button>
          </div>

          {/* Upcoming Events & Tasks */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      event.type === 'meeting' ? 'bg-blue-100' :
                      event.type === 'deadline' ? 'bg-red-100' :
                      event.type === 'review' ? 'bg-purple-100' :
                      'bg-green-100'
                    }`}>
                      {event.type === 'meeting' ? <Coffee className="w-4 h-4 text-blue-600" /> :
                       event.type === 'deadline' ? <Target className="w-4 h-4 text-red-600" /> :
                       event.type === 'review' ? <Award className="w-4 h-4 text-purple-600" /> :
                       <Calendar className="w-4 h-4 text-green-600" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{event.title}</p>
                      <p className="text-xs text-gray-500">{event.date}</p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Bell className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
              View Calendar
            </button>
          </div>
        </div>

        {/* Quick Profile Section */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {employeeData.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{employeeData.name}</h3>
                <p className="text-gray-600">{employeeData.position}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center"><Mail className="w-4 h-4 mr-1" />{employeeData.email}</span>
                  <span className="flex items-center"><Phone className="w-4 h-4 mr-1" />{employeeData.phone}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => window.location.href = '/employee/profile'}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center space-x-2"
            >
              <User className="w-4 h-4" />
              <span>View Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;