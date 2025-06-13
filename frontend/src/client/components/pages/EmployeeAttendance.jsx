import React, { useContext, useEffect, useState } from 'react';
import AttendanceContext from '../../../context/attendance/attendanceContext';
import formatDate from '../../../utils/formatDate';
const EmployeeAttendance = () => {
  const { attendance, getAttendance, clockIn, clockOut, loading, error } = useContext(AttendanceContext);
  const [todayRecord, setTodayRecord] = useState(null);

  useEffect(() => {
    getAttendance();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    setTodayRecord(attendance.find(a => a.date === today));
  }, [attendance]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Attendance</h1>
      <div className="mb-4">
        <div>
          <span className="font-semibold">Today: </span>
          {todayRecord?.clockIn
            ? todayRecord?.clockOut
              ? <span className="text-green-600">Clocked Out</span>
              : <span className="text-yellow-600">Clocked In</span>
            : <span className="text-gray-600">Not Clocked In</span>
          }
        </div>
        <div className="mt-2 flex space-x-2">
          <button
            onClick={clockIn}
            disabled={loading || todayRecord?.clockIn}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Clock In
          </button>
          <button
            onClick={clockOut}
            disabled={loading || !todayRecord?.clockIn || todayRecord?.clockOut}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Clock Out
          </button>
        </div>
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </div>
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2">Attendance History</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Clock In</th>
              <th className="px-4 py-2">Clock Out</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((rec) => (
              <tr key={rec._id}>
                <td className="px-4 py-2">{formatDate(rec.date)}</td>
                <td className="px-4 py-2">{rec.clockIn ? new Date(rec.clockIn).toLocaleTimeString() : '-'}</td>
                <td className="px-4 py-2">{rec.clockOut ? new Date(rec.clockOut).toLocaleTimeString() : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeAttendance;