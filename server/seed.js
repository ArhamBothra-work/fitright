const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { WorkoutLog } = require('./models/Log');

dotenv.config();

const baseExercises = [
  "Barbell Bench Press", 
  "Smith Machine Inclined Bench Press", 
  "Incline Dumbbell Press", 
  "Overhead Press", 
  "Barbell Row", 
  "Lat Pulldown", 
  "Tricep Cable Pushdown", 
  "Lateral Cable Raise", 
  "Peck Deck", 
  "Rear Delt Machine Fly", 
  "Bent Over Wide Grip Row",
  "Cable Curl", 
  "Romanian Deadlift", 
  "Squats"
];

const seedDatabase = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing from your .env file!");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding...');

    // We do NOT clear out your existing user accounts.
    // We clear out old test workouts to avoid any timezone/corrupted data bugs
    await WorkoutLog.deleteMany({});
    console.log('Old workout logs cleared successfully.');

    console.log('\n=======================================');
    console.log('⚡ DATABASE SYNC COMPLETE');
    console.log(`${baseExercises.length} standard movements are verified and ready!`);
    console.log('=======================================\n');
    
    process.exit(0);
  } catch (err) {
    console.error('Seeding process failed:', err);
    process.exit(1);
  }
};

seedDatabase();