const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  goal: { type: String, enum: ['fat_loss', 'muscle_gain', 'maintenance'], required: true },
  level: { type: String, required: true },
  title: { type: String, required: true },
  days: { type: Number, required: true },
  desc: { type: String },
  split: { type: String },
  schedule: [{
    day: String,
    focus: String,
    exercises: [{
      name: String,
      sets: String,
      reps: String,
      muscles: [String],
    }]
  }]
}, { timestamps: true });

module.exports = mongoose.model('Plan', planSchema);