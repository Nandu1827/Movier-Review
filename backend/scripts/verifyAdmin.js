const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

const verifyAndCreateAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/movie_db', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Check if admin exists
    const admin = await User.findOne({ email: 'admin@example.com' });
    
    if (admin) {
      console.log('Admin user already exists:');
      console.log('Email:', admin.email);
      console.log('Role:', admin.role);
    } else {
      // Create admin user
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const newAdmin = new User({
        fullName: 'Admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin'
      });

      await newAdmin.save();
      console.log('Admin user created successfully:');
      console.log('Email: admin@example.com');
      console.log('Password: admin123');
    }

    // List all users in the database
    const allUsers = await User.find({});
    console.log('\nAll users in database:');
    allUsers.forEach(user => {
      console.log(`- ${user.email} (${user.role})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

verifyAndCreateAdmin(); 