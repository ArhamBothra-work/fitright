const { WeightLog, WorkoutLog, NutritionLog } = require('../models/Log');

exports.getWeightLogs = async (req, res) => {
  try {
    const logs = await WeightLog.find({ user: req.user.id }).sort({ date: 1 });
    res.json(logs);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.addWeightLog = async (req, res) => {
  try {
    const log = await WeightLog.create({ user: req.user.id, ...req.body });
    res.status(201).json(log);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getWorkoutLogs = async (req, res) => {
  try {
    const logs = await WorkoutLog.find({ user: req.user.id }).sort({ date: -1 });
    res.json(logs);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.addWorkoutLog = async (req, res) => {
  try {
    const log = await WorkoutLog.create({ user: req.user.id, ...req.body });
    res.status(201).json(log);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getNutritionLogs = async (req, res) => {
  try {
    const logs = await NutritionLog.find({ user: req.user.id }).sort({ date: -1 });
    res.json(logs);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.addNutritionLog = async (req, res) => {
  try {
    const log = await NutritionLog.create({ user: req.user.id, ...req.body });
    res.status(201).json(log);
  } catch (err) { res.status(500).json({ message: err.message }); }
};