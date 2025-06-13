import React, { useContext, useEffect } from 'react';
import LeaveContext from '../context/leave/leaveContext';
import UserContext from '../context/user/userContext';
import formatDate from '../../../utils/formatDate';
const AdminLeaveApproval = () => {
  const leaveContext = useContext(LeaveContext);
  const userContext = useContext(UserContext);
  const { leaves, getLeaves, approveLeave, loading, error } = leaveContext;
  const { users, getUsers } = userContext;

  useEffect(() => {
    getLeaves(); // Fetch all leave requests
    getUsers();  // Fetch all users for name lookup
    // eslint-disable-next-line
  }, []);

  const handleApprove = async (leaveId) => {
    await approveLeave(leaveId, 'approved');
    getLeaves();
  };

  const handleReject = async (leaveId) => {
    await approveLeave(leaveId, 'rejected');
    getLeaves();
  };

  const getUserName = (userId) => {
    const user = users.find(u => u._id === userId);
    return user ? `${user.firstName} ${user.lastName}` : 'Unknown';
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Leave Approval</h1>
      {error && <div className="text-red-500">{error}</div>}
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            All Leave Requests
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leaves.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                    No leave requests found.
                  </td>
                </tr>
              ) : (
                leaves.map((leave) => (
                  <tr key={leave._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getUserName(leave.employee)}
                    </td>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {leave.status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {leave.status === 'pending' ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApprove(leave._id)}
                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                            disabled={loading}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(leave._id)}
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                            disabled={loading}
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-400">No Action</span>
                      )}
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

export default AdminLeaveApproval;