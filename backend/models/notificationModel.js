import { Schema, model } from 'mongoose';

const notificationSchema = new Schema({
  recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  sender: { type: Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['leave', 'payroll', 'attendance', 'general'], required: true },
  isRead: { type: Boolean, default: false },
  relatedId: { type: Schema.Types.ObjectId } // ID of related document (leave, payroll, etc.)
}, { timestamps: true });

export default model('Notification', notificationSchema);