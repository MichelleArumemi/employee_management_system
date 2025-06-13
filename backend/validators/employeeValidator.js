import { check, body } from 'express-validator';
import Employee from '../models/Employee.js';

export const createEmployeeRules = [
  check('firstName')
    .notEmpty().withMessage('First name is required')
    .isLength({ max: 50 }).withMessage('First name cannot be longer than 50 characters'),
  
  check('email')
    .isEmail().withMessage('Must be a valid email')
    .custom(async email => {
      const employee = await Employee.findOne({ email });
      if (employee) throw new Error('Email already in use');
    }),
  
  check('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)
    .withMessage('Password must contain at least one uppercase, one lowercase, and one number')
];

export const updateEmployeeRules = [
  check('firstName')
    .optional()
    .notEmpty().withMessage('First name cannot be empty')
    .isLength({ max: 50 }).withMessage('First name cannot be longer than 50 characters'),
  
  check('email')
    .optional()
    .isEmail().withMessage('Must be a valid email')
    .custom(async (email, { req }) => {
      const employee = await Employee.findOne({ email });
      if (employee && employee._id.toString() !== req.params.id) {
        throw new Error('Email already in use');
      }
    })
];