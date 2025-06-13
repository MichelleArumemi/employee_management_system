import { Router } from 'express';
import { authenticate, adminOnly } from '../middleware/roleMiddleware.js';
import asyncHandler from 'express-async-handler';
import Attendance from '../models/attendanceModel.js';

const router = Router();

// Employee: Clock in
router.post('/clockin', authenticate, asyncHandler(async (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  const existing = await Attendance.findOne({ employee: req.user.id, date: today });
  if (existing) return res.status(400).json({ msg: 'Already clocked in today' });

  const attendance = await Attendance.create({
    employee: req.user.id,
    date: today,
    clockIn: new Date(),
  });
  res.status(201).json(attendance);
}));

// Employee: Clock out
router.post('/clockout', authenticate, asyncHandler(async (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  const attendance = await Attendance.findOne({ employee: req.user.id, date: today });
  if (!attendance) return res.status(400).json({ msg: 'Not clocked in today' });
  if (attendance.clockOut) return res.status(400).json({ msg: 'Already clocked out today' });

  attendance.clockOut = new Date();
  await attendance.save();
  res.json(attendance);
}));

// Employee: Get my attendance records
router.get('/me', authenticate, asyncHandler(async (req, res) => {
  const records = await Attendance.find({ employee: req.user.id }).sort({ date: -1 });
  res.json(records);
}));

// Admin: Get all attendance records
router.get('/', [authenticate, adminOnly], asyncHandler(async (req, res) => {
  const records = await Attendance.find().populate('employee', ['firstName', 'lastName']).sort({ date: -1 });
  res.json(records);
}));

export default router;