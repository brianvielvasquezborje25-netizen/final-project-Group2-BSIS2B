const mongoose = require('mongoose');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '../.env') });

const connectDB = async () => {
  try {
    // Added family: 4 to force IPv4 and bypass Windows/DNS routing issues
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      family: 4,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;