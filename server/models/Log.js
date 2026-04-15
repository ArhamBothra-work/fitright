const mongoose = require('mongoose');

const weightLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  weight: { type: Number, required: true },
}, { timestamps: true });

const workoutLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  exercise: { type: String, required: true },
  sets: { type: Number, required: true },
  reps: { type: Number, required: true },
  weight: { type: Number, required: true },
}, { timestamps: true });

const nutritionLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  calories: { type: Number, required: true },
  protein: { type: Number, required: true },
}, { timestamps: true });

module.exports = {
  WeightLog: mongoose.model('WeightLog', weightLogSchema),
  WorkoutLog: mongoose.model('WorkoutLog', workoutLogSchema),
  NutritionLog: mongoose.model('NutritionLog', nutritionLogSchema),
};