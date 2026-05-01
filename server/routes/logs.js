const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  getWeightLogs, addWeightLog,
  getWorkoutLogs, addWorkoutLog
} = require('../controllers/logController');

router.get('/weight', protect, getWeightLogs);
router.post('/weight', protect, addWeightLog);
router.get('/workout', protect, getWorkoutLogs);
router.post('/workout', protect, addWorkoutLog);

module.exports = router;