import { find, findByIdAndUpdate } from "../models/Notification";

// Get all notifications for the logged-in user
export async function getNotifications(req, res) {
  try {
    const notifications = await find({
      recipient: req.user.id,
    }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

// Mark notification as read
export async function markAsRead(req, res) {
  try {
    await findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ message: "Notification marked as read" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}