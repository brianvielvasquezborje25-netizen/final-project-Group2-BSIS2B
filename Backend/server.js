const express = require('express');
const cors = require('cors');
const path = require('path');
const dns = require('dns');

// 1. Load environment variables from backend root (.env)
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Force Node.js to use Google DNS for resolving MongoDB Atlas cluster addresses
dns.setServers(['8.8.8.8', '8.8.4.4']);

// 2. Import database connection from config folder
const connectDB = require('./config/db');

const app = express();

// Connect to Database
connectDB();

// Core Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sanity Check / Root Route
app.get('/', (req, res) => {
  res.status(200).send('API is running successfully!');
});

// 3. API Routes
app.use('/api/auth', require('./Routes/Authroutes'));
app.use('/api/users', require('./Routes/Userroutes'));
app.use('/api/stalls', require('./Routes/Stallroutes'));
app.use('/api/menu', require('./Routes/Menuroutes'));

// 4. Global 404 Handler for Unmatched Routes
app.use((req, res) => {
  res.status(404).json({ message: `Route not found - ${req.originalUrl}` });
});

// 5. Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(500).json({ message: 'Server Error', error: err.message });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});