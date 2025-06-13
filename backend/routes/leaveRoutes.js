import { Router } from 'express';
import { check, validationResult } from 'express-validator';
import moment from 'moment';
import Leave from '../models/leaveModel.js';
import Employee from '../models/employeeModel.js';
import Notification from '../models/notificationModel.js'; // Use your actual notification model file name
import { authenticate, adminOnly } from '../middleware/roleMiddleware.js';
import asyncHandler from 'express-async-handler';

const router = Router();

// @route   POST api/leaves
// @desc    Create a leave request
// @access  Private
router.post(
  '/',
  authenticate,
  [
    check('startDate', 'Start date is required').not().isEmpty(),
    check('endDate', 'End date is required').not().isEmpty(),
    check('leaveType', 'Leave type is required').not().isEmpty(),
    check('reason', 'Reason is required').not().isEmpty(),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { startDate, endDate, leaveType, reason } = req.body;

    if (moment(endDate).isBefore(moment(startDate))) {
      return res.status(400).json({ msg: 'End date must be after start date' });
    }

    const newLeave = new Leave({
      employee: req.user.id,
      startDate,
      endDate,
      leaveType,
      reason,
      status: 'pending',
    });

    await newLeave.save();

    // Notify all admins
    const admins = await Employee.find({ role: 'admin' });
    for (const admin of admins) {
      await Notification.create({
        userId: admin._id,
        message: `New leave request from ${req.user.firstName} ${req.user.lastName}`,
        read: false,
        createdAt: new Date(),
      });
    }

    res.status(201).json(newLeave);
  })
);

// @route   GET api/leaves/me
// @desc    Get current user's leave requests
// @access  Private
router.get(
  '/me',
  authenticate,
  asyncHandler(async (req, res) => {
    const leaves = await Leave.find({ employee: req.user.id })
      .sort({ createdAt: -1 })
      .populate('employee', ['firstName', 'lastName'])
      .populate('reviewedBy', ['firstName', 'lastName']);
    res.json(leaves);
  })
);

// @route   GET api/leaves
// @desc    Get all leave requests (admin only)
// @access  Private/Admin
router.get(
  '/',
  [authenticate, adminOnly],
  asyncHandler(async (req, res) => {
    const leaves = await Leave.find()
      .sort({ createdAt: -1 })
      .populate('employee', ['firstName', 'lastName'])
      .populate('reviewedBy', ['firstName', 'lastName']);
    res.json(leaves);
  })
);

// @route   PUT api/leaves/:id/status
// @desc    Update leave request status (admin only)
// @access  Private/Admin
router.put(
  '/:id/status',
  [authenticate, adminOnly],
  [check('status', 'Status is required').not().isEmpty()],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ msg: 'Leave request not found' });
    }

    if (leave.status !== 'pending') {
      return res.status(400).json({ msg: 'Leave request already processed' });
    }

    const { status } = req.body;
    leave.status = status;
    leave.reviewedBy = req.user.id;
    leave.reviewDate = Date.now();
    await leave.save();

    // Notify employee
    await Notification.create({
      userId: leave.employee,
      message: `Your leave request from ${leave.startDate.toISOString().slice(0,10)} to ${leave.endDate.toISOString().slice(0,10)} has been ${status}.`,
      read: false,
      createdAt: new Date(),
    });

    res.json(leave);
  })
);

export default router;