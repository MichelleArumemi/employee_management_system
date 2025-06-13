import { Schema, model } from 'mongoose';

const leaveSchema = new Schema({
  employee: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  type: { type: String, enum: ['sick', 'vacation', 'personal', 'other'], required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  reviewDate: { type: Date }
}, { timestamps: true });

export default model('Leave', leaveSchema);