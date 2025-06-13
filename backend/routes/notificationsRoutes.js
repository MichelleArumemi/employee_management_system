import { Router } from 'express';
import { authenticate } from '../middleware/roleMiddleware.js'; // Use the authenticate from your role middleware
import Notification from '../models/notificationModel.js';
import asyncHandler from 'express-async-handler';

const router = Router();

// @route   GET api/notifications
// @desc    Get all notifications for current user
// @access  Private
router.get('/', authenticate, asyncHandler(async (req, res) => {
  const userNotifications = await Notification.find({ recipient: req.user.id })
    .sort({ createdAt: -1 })
    .populate('sender', ['firstName', 'lastName'])
    .populate('recipient', ['firstName', 'lastName']);
  
  res.json({
    success: true,
    count: userNotifications.length,
    data: userNotifications
  });
}));

// @route   GET api/notifications/unread
// @desc    Get unread notifications count
// @access  Private
router.get('/unread', authenticate, asyncHandler(async (req, res) => {
  const unreadCount = await Notification.countDocuments({ 
    recipient: req.user.id, 
    isRead: false 
  });
  
  res.json({
    success: true,
    unreadCount
  });
}));

// @route   PUT api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put('/:id/read', authenticate, asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  
  if (!notification) {
    return res.status(404).json({ 
      success: false,
      message: 'Notification not found' 
    });
  }
  
  // Check if notification belongs to user
  if (notification.recipient.toString() !== req.user.id.toString()) {
    return res.status(403).json({ 
      success: false,
      message: 'Not authorized to access this notification' 
    });
  }
  
  notification.isRead = true;
  await notification.save();
  
  res.json({
    success: true,
    message: 'Notification marked as read',
    data: notification
  });
}));

// @route   PUT api/notifications/mark-all-read
// @desc    Mark all notifications as read for current user
// @access  Private
router.put('/mark-all-read', authenticate, asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { recipient: req.user.id, isRead: false },
    { isRead: true }
  );
  
  res.json({
    success: true,
    message: 'All notifications marked as read'
  });
}));

// @route   DELETE api/notifications/:id
// @desc    Delete a notification
// @access  Private
router.delete('/:id', authenticate, asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  
  if (!notification) {
    return res.status(404).json({ 
      success: false,
      message: 'Notification not found' 
    });
  }
  
  // Check if notification belongs to user
  if (notification.recipient.toString() !== req.user.id.toString()) {
    return res.status(403).json({ 
      success: false,
      message: 'Not authorized to delete this notification' 
    });
  }
  
  await Notification.findByIdAndDelete(req.params.id);
  
  res.json({
    success: true,
    message: 'Notification deleted successfully'
  });
}));

// @route   POST api/notifications
// @desc    Create a new notification (Admin/HR only)
// @access  Private (Admin/HR)
router.post('/', authenticate, asyncHandler(async (req, res) => {
  const { recipient, title, message, type } = req.body;
  
  // Validate required fields
  if (!recipient || !title || !message) {
    return res.status(400).json({
      success: false,
      message: 'Please provide recipient, title, and message'
    });
  }
  
  const notification = new Notification({
    sender: req.user.id,
    recipient,
    title,
    message,
    type: type || 'info'
  });
  
  await notification.save();
  
  // Populate sender and recipient info
  await notification.populate('sender', ['firstName', 'lastName']);
  await notification.populate('recipient', ['firstName', 'lastName']);
  
  res.status(201).json({
    success: true,
    message: 'Notification created successfully',
    data: notification
  });
}));

export default router;