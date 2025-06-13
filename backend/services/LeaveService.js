import Leave from '../models/Leave.js';
import Notification from '../models/Notification.js';
import Employee from '../models/Employee.js';
import moment from 'moment';

class LeaveService {
  async createLeave(employeeId, leaveData) {
    // Validate dates
    if (moment(leaveData.endDate).isBefore(leaveData.startDate)) {
      throw new Error('End date must be after start date');
    }

    // Check leave balance
    const employee = await Employee.findById(employeeId);
    const leaveDays = moment(leaveData.endDate).diff(leaveData.startDate, 'days') + 1;
    
    if (employee.leaveBalance < leaveDays) {
      throw new Error('Insufficient leave balance');
    }

    // Create leave
    const leave = await Leave.create({
      ...leaveData,
      employee: employeeId,
      status: 'pending'
    });

    // Create notification for admin
    const admin = await Employee.findOne({ role: 'admin' });
    if (admin) {
      await Notification.create({
        recipient: admin._id,
        sender: employeeId,
        title: 'New Leave Request',
        message: `New leave request from ${employee.firstName} ${employee.lastName}`,
        type: 'leave',
        relatedId: leave._id
      });
    }

    return leave;
  }

  async processLeave(leaveId, adminId, status) {
    const leave = await Leave.findById(leaveId);
    if (!leave) throw new Error('Leave not found');

    // Update leave status
    leave.status = status;
    leave.reviewedBy = adminId;
    leave.reviewDate = new Date();
    await leave.save();

    // Update leave balance if approved
    if (status === 'approved') {
      const employee = await Employee.findById(leave.employee);
      const leaveDays = moment(leave.endDate).diff(leave.startDate, 'days') + 1;
      employee.leaveBalance -= leaveDays;
      await employee.save();
    }

    // Send notification
    await Notification.create({
      recipient: leave.employee,
      sender: adminId,
      title: `Leave ${status}`,
      message: `Your leave request has been ${status}`,
      type: 'leave',
      relatedId: leave._id
    });

    return leave;
  }
}

export default new LeaveService();