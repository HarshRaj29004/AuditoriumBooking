const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models'); // Adjust path to your models

async function createAdminUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/Auditorium', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Generate hashed password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('admin', saltRounds);

    // Create admin user
    const adminUser = new User.RegistrationUser({
      email: 'admin',
      username: 'admin',
      password: hashedPassword
    });

    // Save to database
    await adminUser.save();
    console.log('Admin user created successfully');

    // Close connection
    mongoose.connection.close();
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

createAdminUser();