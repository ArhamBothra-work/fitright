const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  goal: {
    type: String,
    enum: ['fat_loss', 'muscle_gain', 'maintenance'],
    default: 'fat_loss',
  },
  age: Number,
  weight: Number,
  height: Number,
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);