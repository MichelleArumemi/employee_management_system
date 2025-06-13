import { sign } from "jsonwebtoken";
import Employee, { findOne } from "../models/Employee";

// Employee/Admin Login
export async function login(req, res) {
  const { email, password } = req.body;
  try {
    const employee = await findOne({ email });
    if (!employee || !(await employee.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = sign(
      { id: employee._id, role: employee.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.json({ token, role: employee.role });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

// Admin-only: Register new employee
export async function register(req, res) {
  const { email, password, name, role, department } = req.body;
  try {
    const employee = new Employee({ email, password, name, role, department });
    await employee.save();
    res.status(201).json({ message: "Employee registered successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}