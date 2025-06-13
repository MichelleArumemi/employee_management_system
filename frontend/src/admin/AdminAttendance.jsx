import React, { useContext, useEffect, useState } from 'react';
import AttendanceContext from '../context/attendance/attendanceContext.jsx';
import UserContext from '../context/user/userContext.jsx';
import formatDate from '../../../utils/formatDate';
const AdminAttendance = () => {
  const { attendance, getAttendance, loading, error } = useContext(AttendanceContext);
  const { users, getUsers } = useContext(UserContext);

  useEffect(() => {
    getAttendance();
    getUsers && getUsers();
    // eslint-disable-next-line
  }, []);

  // Helper to get user name
  const getUserName = (userId) => {
    const user = users?.find(u => u._id === userId);
    return user ? `${user.firstName} ${user.lastName}` : 'Unknown';
  };

  // Who is currently clocked in today
  const today = new Date().toISOString().slice(0, 10);
  const currentlyClockedIn = attendance.filter(
    (record) => record.date === today && record.clockIn && !record.clockOut
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Attendance (Admin)</h1>
      <div className="bg-white shadow rounded-lg p-4 mb-4">
        <h2 className="text-lg font-semibold mb-2">Currently Clocked In</h2>
        {currentlyClockedIn.length === 0 ? (
          <div className="text-gray-500">No one is currently clocked in.</div>
        ) : (
          <ul>
            {currentlyClockedIn.map((rec) => (
              <li key={rec._id} className="text-green-700 font-medium">
                {getUserName(rec.employee)}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2">All Attendance Records</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2">Employee</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Clock In</th>
              <th className="px-4 py-2">Clock Out</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((rec) => (
              <tr key={rec._id}>
                <td className="px-4 py-2">{getUserName(rec.employee)}</td>
                <td className="px-4 py-2">{formatDate(rec.date)}</td>
                <td className="px-4 py-2">{rec.clockIn ? new Date(rec.clockIn).toLocaleTimeString() : '-'}</td>
                <td className="px-4 py-2">{rec.clockOut ? new Date(rec.clockOut).toLocaleTimeString() : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </div>
    </div>
  );
};

export default AdminAttendance;