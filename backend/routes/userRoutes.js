import { Router } from 'express';
import { check, validationResult } from 'express-validator';
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  updateEmployeeProfile,
  uploadProfilePicture
} from '../controllers/EmployeeController.js'; // Changed from EmployeeController.js
import { protect } from '../middleware/authMiddleware.js';
import { roleCheck } from '../middleware/roleMiddleware.js';
import upload from '../utils/fileUpload.js';

const router = Router();

// Employee validation rules
const employeeValidationRules = [
  check('firstName', 'First name is required').notEmpty(),
  check('lastName', 'Last name is required').notEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('role', 'Role is required').notEmpty(),
  check('department', 'Department is required').notEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Password validation
const passwordValidation = [
  check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Admin routes
router.route('/')
  .get(protect, roleCheck('admin'), getEmployees)
  .post(protect, roleCheck('admin'), [...employeeValidationRules, ...passwordValidation], createEmployee);

router.route('/:id')
  .get(protect, getEmployeeById)
  .put(protect, roleCheck('admin'), employeeValidationRules, updateEmployee)
  .delete(protect, roleCheck('admin'), deleteEmployee);

// Employee profile routes
router.route('/profile/update')
  .put(protect, employeeValidationRules, updateEmployeeProfile);

router.route('/profile/picture')
  .post(protect, upload.single('image'), uploadProfilePicture);

export default router;