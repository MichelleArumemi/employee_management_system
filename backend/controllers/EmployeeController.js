import User from "../models/employeeModel.js";

// @desc    Get all employees
// @route   GET /api/users
// @access  Private/Admin
export const getEmployees = async (req, res) => {
  try {
    const employees = await User.find().select("-password");
    res.json({
      success: true,
      count: employees.length,
      data: employees
    });
  } catch (err) {
    console.error("Get all employees error:", err);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
};

// @desc    Create new employee (Admin only)
// @route   POST /api/users
// @access  Private/Admin
export const createEmployee = async (req, res) => {
  try {
    const { email, password, firstName, lastName, role, position, department, salary, bankDetails } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists"
      });
    }

    const employee = new User({
      firstName,
      lastName,
      email,
      password,
      role,
      position,
      department,
      salary,
      bankDetails
    });

    await employee.save();

    const employeeResponse = employee.toObject();
    delete employeeResponse.password;

    res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: employeeResponse
    });
  } catch (err) {
    console.error("Create employee error:", err);
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Get employee by ID
// @route   GET /api/users/:id
// @access  Private (Admin or same user)
export const getEmployeeById = async (req, res) => {
  try {
    const employee = await User.findById(req.params.id).select("-password");
    
    if (!employee) {
      return res.status(404).json({ 
        success: false,
        message: "Employee not found" 
      });
    }

    res.json({
      success: true,
      data: employee
    });
  } catch (err) {
    console.error("Get employee by ID error:", err);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
};

// @desc    Update employee (Admin only)
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateEmployee = async (req, res) => {
  try {
    const employee = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { 
        new: true,
        runValidators: true
      }
    ).select("-password");

    if (!employee) {
      return res.status(404).json({ 
        success: false,
        message: "Employee not found" 
      });
    }

    res.json({
      success: true,
      data: employee
    });
  } catch (err) {
    console.error("Update employee error:", err);
    res.status(400).json({ 
      success: false,
      message: err.message 
    });
  }
};

// @desc    Delete employee (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteEmployee = async (req, res) => {
  try {
    const employee = await User.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({ 
        success: false,
        message: "Employee not found" 
      });
    }

    res.json({
      success: true,
      message: "Employee deleted successfully"
    });
  } catch (err) {
    console.error("Delete employee error:", err);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
};

// @desc    Update employee profile
// @route   PUT /api/users/profile/update
// @access  Private
export const updateEmployeeProfile = async (req, res) => {
  try {
    const employee = await User.findByIdAndUpdate(
      req.user.id,
      req.body,
      { 
        new: true,
        runValidators: true
      }
    ).select("-password");

    if (!employee) {
      return res.status(404).json({ 
        success: false,
        message: "Employee not found" 
      });
    }

    res.json({
      success: true,
      data: employee
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(400).json({ 
      success: false,
      message: err.message 
    });
  }
};

// @desc    Upload profile picture
// @route   POST /api/users/profile/picture
// @access  Private
export const uploadProfilePicture = async (req, res) => {
  try {
    const employee = await User.findByIdAndUpdate(
      req.user.id,
      { profilePhoto: req.file.filename },
      { new: true }
    ).select("-password");

    res.json({
      success: true,
      data: employee
    });
  } catch (err) {
    console.error("Upload profile picture error:", err);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
};