import Leave from "../models/leaveModel.js";
import Employee from "../models/employeeModel.js";
import Notification from "../models/notificationModel.js";
import { validationResult } from 'express-validator';
import moment from 'moment';

// Employee: Apply for leave
export async function applyLeave(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { startDate, endDate, leaveType, reason } = req.body;

  // Check if end date is after start date
  if (moment(endDate).isBefore(moment(startDate))) {
    return res.status(400).json({ msg: 'End date must be after start date' });
  }

  try {
    const leave = new Leave({
      employee: req.user.id,
      startDate,
      endDate,
      leaveType,
      reason,
      status: "pending",
    });
    await leave.save();

    // Notify admin(s) of new leave request
    const admins = await Employee.find({ role: 'admin' });
    for (const admin of admins) {
      await Notification.create({
        userId: admin._id,
        message: `New leave request from ${req.user.firstName} ${req.user.lastName}`,
        read: false,
        createdAt: new Date(),
      });
    }

    res.status(201).json({ message: "Leave applied successfully", leave });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error applying leave" });
  }
}

// Admin: Approve/Reject leave
export async function updateLeaveStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const leave = await Leave.findById(id);
    if (!leave) return res.status(404).json({ message: 'Leave not found' });

    if (leave.status !== 'pending') {
      return res.status(400).json({ msg: 'Leave request already processed' });
    }

    leave.status = status;
    leave.reviewedBy = req.user.id;
    leave.reviewDate = Date.now();
    await leave.save();

    // Notify employee of leave status update
    await Notification.create({
      userId: leave.employee,
      message: `Your leave request from ${leave.startDate.toISOString().slice(0,10)} to ${leave.endDate.toISOString().slice(0,10)} has been ${status}.`,
      read: false,
      createdAt: new Date(),
    });

    res.json({ message: `Leave ${status.toLowerCase()}`, leave });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error processing leave" });
  }
}

// Employee: View their leave history
export async function getMyLeaves(req, res) {
  try {
    const leaves = await Leave.find({ employee: req.user.id })
      .sort({ createdAt: -1 })
      .populate('employee', ['firstName', 'lastName'])
      .populate('reviewedBy', ['firstName', 'lastName']);
    res.json(leaves);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error fetching leaves" });
  }
}

// Admin: View all leaves
export async function getAllLeaves(req, res) {
  try {
    const leaves = await Leave.find()
      .sort({ createdAt: -1 })
      .populate('employee', ['firstName', 'lastName'])
      .populate('reviewedBy', ['firstName', 'lastName']);
    res.json(leaves);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}