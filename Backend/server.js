const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'Routes/.env') }); // Loads .env from config/Routes/.env

const connectDB = require('./db');

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test Route
app.get('/', (req, res) => {
    res.send('API is running successfully!');
});

// API Routes
app.use('/api/users', require('./Routes/Userroutes'));
app.use('/api/stalls', require('./Routes/Stallroutes'));
app.use('/api/menu', require('./Routes/Menuroutes'));

// Global 404 Handler for Unmatched Routes
app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Server Error', error: err.message });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});