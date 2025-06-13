import React, { useContext, useEffect, useState } from 'react';
// import { CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

import LeaveContext from '../../../context/leave/leaveContext';
import UserContext from '../../../context/user/userContext';
import formatDate from '../../../utils/formatDate';
const Leaves = () => {
  const leaveContext = useContext(LeaveContext);
  const userContext = useContext(UserContext);
  const { leaves, getLeaves, applyLeave, loading, error } = leaveContext;
  const { users } = userContext;

  // Leave request form state
  const [form, setForm] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: ''
  });

  // Assume current user is available as userContext.currentUser
  const currentUser = userContext.currentUser;

  useEffect(() => {
    if (currentUser?._id) getLeaves(currentUser._id);
    // eslint-disable-next-line
  }, [currentUser]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser?._id) return;
    await applyLeave({ ...form, employee: currentUser._id });
    setForm({ leaveType: '', startDate: '', endDate: '', reason: '' });
    getLeaves(currentUser._id);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'pending':
      default:
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Leave Requests</h1>
      </div>

      {/* Leave Request Form */}
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-4 mb-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <select
            name="leaveType"
            value={form.leaveType}
            onChange={handleChange}
            required
            className="border rounded px-2 py-1"
          >
            <option value="">Select Leave Type</option>
            <option value="casual">Casual</option>
            <option value="sick">Sick</option>
            <option value="earned">Earned</option>
          </select>
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            required
            className="border rounded px-2 py-1"
          />
          <input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
            required
            className="border rounded px-2 py-1"
          />
          <input
            type="text"
            name="reason"
            value={form.reason}
            onChange={handleChange}
            placeholder="Reason"
            required
            className="border rounded px-2 py-1"
          />
        </div>
        <button
          type="submit"
          className="bg-primary-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Requesting...' : 'Request Leave'}
        </button>
        {error && <div className="text-red-500">{error}</div>}
      </form>

      {/* Leave Records Table */}
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            My Leave Records
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leaves.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    No leave records found.
                  </td>
                </tr>
              ) : (
                leaves.map((leave) => (
                  <tr key={leave._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {leave.leaveType || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(leave.startDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(leave.endDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {leave.reason}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        {getStatusIcon(leave.status)}
                        <span className="ml-2 capitalize">{leave.status}</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leaves;