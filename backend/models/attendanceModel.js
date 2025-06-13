import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  clockIn: { type: Date },
  clockOut: { type: Date }
});

export default mongoose.model('Attendance', attendanceSchema);