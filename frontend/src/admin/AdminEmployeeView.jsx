import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ClockIcon, CalendarIcon, CashIcon, DocumentTextIcon } from '@heroicons/react/outline';
import UserContext from '../context/user/userContext';
import AttendanceContext from '../context/attendance/attendanceContext.jsx';
import LeaveContext from '../context/leave/leaveContext.jsx';
import PayrollContext from '../context/payroll/payrollContext.jsx';

const EmployeeView = () => {
  const { id } = useParams();
  const userContext = useContext(UserContext);
  const attendanceContext = useContext(AttendanceContext);
  const leaveContext = useContext(LeaveContext);
  const payrollContext = useContext(PayrollContext);
  
  const { getUserById, user } = userContext;
  const { attendance, getAttendance } = attendanceContext;
  const { leaves, getLeaves } = leaveContext;
  const { payroll, getPayroll } = payrollContext;

  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    getUserById(id);
    getAttendance(id);
    getLeaves(id);
    getPayroll(id);
    // eslint-disable-next-line
  }, [id]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {user?.firstName} {user?.lastName}
        </h1>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('profile')}
              className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${activeTab === 'profile' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${activeTab === 'attendance' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Attendance
            </button>
            <button
              onClick={() => setActiveTab('leaves')}
              className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${activeTab === 'leaves' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Leaves
            </button>
            <button
              onClick={() => setActiveTab('payroll')}
              className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${activeTab === 'payroll' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Payroll
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${activeTab === 'documents' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Documents
            </button>
          </nav>
        </div>

        <div className="px-4 py-5 sm:p-6">
          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">First name</label>
                <p className="mt-1 text-sm text-gray-900">{user?.firstName}</p>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Last name</label>
                <p className="mt-1 text-sm text-gray-900">{user?.lastName}</p>
              </div>

              <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-gray-700">Email address</label>
                <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Position</label>
                <p className="mt-1 text-sm text-gray-900">{user?.position || '-'}</p>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <p className="mt-1 text-sm text-gray-900">{user?.department || '-'}</p>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Hire Date</label>
                <p className="mt-1 text-sm text-gray-900">{new Date(user?.hireDate).toLocaleDateString()}</p>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Salary</label>
                <p className="mt-1 text-sm text-gray-900">${user?.salary?.toLocaleString() || '-'}</p>
              </div>
            </div>
          )}

          {activeTab === 'attendance' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Attendance Records</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Clock In
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Clock Out
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {attendance.map((record) => (
                      <tr key={record._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(record.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.clockIn ? new Date(record.clockIn).toLocaleTimeString() : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.clockOut ? new Date(record.clockOut).toLocaleTimeString() : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                          {record.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'leaves' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Leave History</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dates
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reason
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {leaves.map((leave) => (
                      <tr key={leave._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                          {leave.type}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {leave.reason}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                          {leave.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'payroll' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Payroll History</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Period
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Basic Salary
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Allowances
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Deductions
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Net Salary
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {payroll.map((record) => (
                      <tr key={record._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.month}/{record.year}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${record.basicSalary?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${record.allowances?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${record.deductions?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ${record.netSalary?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                          {record.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Employee Documents</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {user?.documents?.length > 0 ? (
                  user.documents.map((doc) => (
                    <div key={doc._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                      <div className="p-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-primary-100 p-3 rounded-md">
                            <DocumentTextIcon className="h-6 w-6 text-primary-600" />
                          </div>
                          <div className="ml-4">
                            <h4 className="text-sm font-medium text-gray-900">{doc.name}</h4>
                            <p className="text-sm text-gray-500">{doc.type}</p>
                          </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-primary-600 hover:text-primary-500"
                          >
                            Download
                          </a>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No documents uploaded</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeView;