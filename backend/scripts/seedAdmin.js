const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const connectDB = require('../config/db');
require('dotenv').config();
// Connect to database
connectDB();
const seedAdmin = async () => {
  try {
    // Check if admin already exists
    const adminExists = await Admin.findOne({ email: 'admin@example.com' });
    if (adminExists) {
      console.log('Admin already exists');
      process.exit();
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash('admin123', 10);
    // Create admin user
    const admin = new Admin({
      email: 'admin@example.com',
      password: hashedPassword,
    });
    await admin.save();
    console.log('Admin user created successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};
// Run the seed function
seedAdmin();