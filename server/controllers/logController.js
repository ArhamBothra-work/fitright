const { WeightLog, WorkoutLog } = require('../models/Log');

// WEIGHT LOGS
exports.getWeightLogs = async (req, res) => {
  try {
    const logs = await WeightLog.find({ user: req.user.id }).sort({ date: 1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addWeightLog = async (req, res) => {
  try {
    const { date, weight } = req.body;
    const log = await WeightLog.create({
      user: req.user.id,
      date,
      weight: parseFloat(weight)
    });
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// WORKOUT LOGS
exports.getWorkoutLogs = async (req, res) => {
  try {
    const logs = await WorkoutLog.find({ user: req.user.id }).sort({ date: 1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addWorkoutLog = async (req, res) => {
  try {
    const { date, exercise, sets, reps, weight } = req.body;
    const log = await WorkoutLog.create({
      user: req.user.id,
      date,
      exercise,
      sets: parseInt(sets),
      reps: parseInt(reps),
      weight: parseFloat(weight)
    });
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};