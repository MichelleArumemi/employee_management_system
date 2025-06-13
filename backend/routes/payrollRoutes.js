import { Router } from 'express';
const router = Router();
import auth from '../middleware/authMiddleware.js';
import { check, validationResult } from 'express-validator';
import Payroll from '../models/payrollModel.js';
import User from '../models/employeeModel.js';
import Notification from '../models/notificationModel.js';
import moment from 'moment';
import roleMiddleware from '../middleware/roleMiddleware.js'


// @route   POST api/payroll
// @desc    Create or update payroll record (admin only)
// @access  Private/Admin
router.post('/', auth, [
  check('employee', 'Employee ID is required').not().isEmpty(),
  check('month', 'Month is required').isNumeric(),
  check('year', 'Year is required').isNumeric(),
  check('basicSalary', 'Basic salary is required').isNumeric(),
  check('netSalary', 'Net salary is required').isNumeric()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    const { employee, month, year, basicSalary, allowances, deductions, bonuses, tax, netSalary } = req.body;

    // Check if payroll record already exists for this employee and month/year
    let payroll = await findOne({
      employee,
      month,
      year
    });

    if (payroll) {
      // Update existing record
      payroll.basicSalary = basicSalary;
      payroll.allowances = allowances || 0;
      payroll.deductions = deductions || 0;
      payroll.bonuses = bonuses || 0;
      payroll.tax = tax || 0;
      payroll.netSalary = netSalary;
    } else {
      // Create new record
      payroll = new Payroll({
        employee,
        month,
        year,
        basicSalary,
        allowances: allowances || 0,
        deductions: deductions || 0,
        bonuses: bonuses || 0,
        tax: tax || 0,
        netSalary
      });
    }

    await payroll.save();

    router.post('/', [
  check('basicSalary', 'Basic salary is required').isNumeric()
  // Missing .isFloat({ min: 0 })
]);
    // Create notification for employee
    const notification = new Notification({
      recipient: employee,
      sender: req.user.id,
      title: 'Payroll Update',
      message: `Your payroll for ${month}/${year} has been processed`,
      type: 'payroll',
      relatedId: payroll._id
    });
    await notification.save();

    res.json(payroll);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/payroll/me
// @desc    Get current user's payroll records
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const payrolls = await find({ employee: req.user.id })
      .sort({ year: -1, month: -1 })
      .populate('employee', ['firstName', 'lastName']);
    res.json(payrolls);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/payroll/:id
// @desc    Get payroll record by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const payroll = await findById(req.params.id)
      .populate('employee', ['firstName', 'lastName']);

    if (!payroll) {
      return res.status(404).json({ msg: 'Payroll record not found' });
    }

    // Check if user is the employee or admin
    if (payroll.employee._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    res.json(payroll);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Payroll record not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   GET api/payroll
// @desc    Get all payroll records (admin only)
// @access  Private/Admin
router.get('/', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    const payrolls = await find()
      .sort({ year: -1, month: -1 })
      .populate('employee', ['firstName', 'lastName']);
    res.json(payrolls);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;