require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user.model');
const connectDB = require('../config/database');

const createAdmin = async () => {
  try {
    await connectDB();

    const adminUser = new User({
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123', // This will be hashed automatically by the model
      role: 'admin'
    });

    await adminUser.save();
    console.log('Admin user created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createAdmin();
