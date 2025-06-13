import { Schema, model } from 'mongoose';

const payrollSchema = new Schema({
  employee: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  basicSalary: { type: Number, required: true },
  allowances: { type: Number, default: 0 },
  deductions: { type: Number, default: 0 },
  bonuses: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  netSalary: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'processed', 'paid'], default: 'pending' },
  paymentDate: { type: Date },
  payslipUrl: { type: String }
}, { timestamps: true });

export default model('Payroll', payrollSchema);