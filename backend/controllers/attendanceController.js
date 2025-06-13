import Attendance from "../models/attendanceModel.js";
import moment from 'moment';

export const clockIn = async (req, res) => {
  try {
    const today = moment().startOf('day');
    
    const existingAttendance = await Attendance.findOne({
      employee: req.user.id,
      date: {
        $gte: today.toDate(),
        $lte: moment(today).endOf('day').toDate()
      }
    });

    if (existingAttendance) {
      return res.status(400).json({ msg: 'Already clocked in today' });
    }

    const newAttendance = new Attendance({
      employee: req.user.id,
      clockIn: Date.now(),
      status: 'present',
      date: new Date()
    });

    await newAttendance.save();
    res.json(newAttendance);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

export const clockOut = async (req, res) => {
  try {
    const today = moment().startOf('day');
    
    const attendance = await Attendance.findOne({
      employee: req.user.id,
      date: {
        $gte: today.toDate(),
        $lte: moment(today).endOf('day').toDate()
      }
    });

    if (!attendance) {
      return res.status(400).json({ msg: 'Clock in first' });
    }

    if (attendance.clockOut) {
      return res.status(400).json({ msg: 'Already clocked out today' });
    }

    attendance.clockOut = Date.now();
    attendance.workingHours = (attendance.clockOut - attendance.clockIn) / (1000 * 60 * 60);
    await attendance.save();
    res.json(attendance);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

