import { insertMany, findOne } from "../models/Payroll";
import Employee from "../models/Employee";
import Payroll from "../models/Payroll";

// Admin: Generate payroll for all employees
export async function generatePayroll(req, res) {
  try {
    const employees = await Employee.find();
    const payrolls = employees.map((emp) => ({
      employee: emp._id,
      basicSalary: emp.basicSalary,
      allowances: emp.allowances,
      deductions: 0,
      netSalary: emp.basicSalary + emp.allowances,
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    }));
    await insertMany(payrolls);
    res.json({ message: "Payroll generated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

// Employee: View their salary slip
export async function getMyPayroll(req, res) {
  try {
    const payroll = await findOne({
      employee: req.user.id,
      month: new Date().getMonth() + 1,
    });
    res.json(payroll);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}