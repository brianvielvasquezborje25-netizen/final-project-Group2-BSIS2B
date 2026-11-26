
'use strict';

const express = require('express');
const cors = require('cors');
const path = require('path');
const dns = require('dns');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Configure DNS for MongoDB Atlas
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (error) {
  console.warn('Could not configure custom DNS servers:', error.message);
}

const connectDB = require('./config/db');
const app = express();

// Render reverse proxy support
app.set('trust proxy', 1);

// ==========================================
// CORS CONFIGURATION
// ==========================================

const allowedOrigins = new Set([
  // Render frontend
  'https://final-project-group2-bsis2b.onrender.com',

  // Vercel frontend
  'https://bu-hangout-group-2.vercel.app',

  // Local development
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5000',
  'http://127.0.0.1:5000',
]);

// Additional origins from Render environment variables
const configuredOrigins = (process.env.CLIENT_ORIGINS || '')
  .split(',')
  .map(origin => origin.trim().replace(/\/+$/, ''))
  .filter(Boolean);

configuredOrigins.forEach(origin => allowedOrigins.add(origin));

// Allow Vercel preview deployments
const vercelPreviewPattern =
  /^https:\/\/bu-hangout-group-2[a-z0-9-]*\.vercel\.app$/i;

const corsOptions = {
  origin(origin, callback) {
    // Allow requests without an Origin header
    if (!origin) {
      return callback(null, true);
    }

    const normalizedOrigin = origin.replace(/\/+$/, '');

    if (
      allowedOrigins.has(normalizedOrigin) ||
      vercelPreviewPattern.test(normalizedOrigin)
    ) {
      return callback(null, true);
    }

    console.warn(`CORS rejected request from origin: ${origin}`);
    return callback(
      new Error(`CORS blocked for origin: ${origin}`)
    );
  },

  methods: [
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
    'OPTIONS'
  ],

  allowedHeaders: [
    'Content-Type',
    'Authorization'
  ],

  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Development request logging
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
  });
}

// ==========================================
// HEALTH CHECK ROUTES
// ==========================================

app.get('/', (req, res) => {
  res.status(200).send('API is running successfully!');
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime()
  });
});

// ==========================================
// API ROUTES
// ==========================================

app.use('/api/auth', require('./Routes/Authroutes'));
app.use('/api/users', require('./Routes/Userroutes'));
app.use('/api/stalls', require('./Routes/Stallroutes'));
app.use('/api/menu', require('./Routes/Menuroutes'));

// ==========================================
// 404 HANDLER
// ==========================================

app.use((req, res) => {
  res.status(404).json({
    message: `Route not found - ${req.originalUrl}`
  });
});

// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use((err, req, res, next) => {
  console.error('Request error:', err.stack || err);

  const isCorsError =
    typeof err.message === 'string' &&
    err.message.startsWith('CORS blocked for origin:');

  const statusCode = isCorsError
    ? 403
    : (err.status || 500);

  res.status(statusCode).json({
    message: isCorsError
      ? 'Origin is not allowed by CORS.'
      : 'Server Error',

    error: process.env.NODE_ENV === 'production'
      ? undefined
      : err.message
  });
});

// ==========================================
// DATABASE AND SERVER STARTUP
// ==========================================

const PORT = process.env.PORT || 5000;

let server;
let isShuttingDown = false;

async function startServer() {
  try {
    await connectDB();

    server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`Backend server is listening on port ${PORT}`);
      console.log('Database connection established.');
    });

    server.on('error', error => {
      console.error('HTTP server error:', error);
      process.exit(1);
    });

  } catch (error) {
    console.error(
      'Failed to connect to the database or start the server:',
      error
    );

    process.exit(1);
  }
}

// ==========================================
// GRACEFUL SHUTDOWN
// ==========================================

function shutdown(signal) {
  if (isShuttingDown) return;

  isShuttingDown = true;

  console.log(`${signal} received. Shutting down gracefully...`);

  if (!server) {
    process.exit(0);
    return;
  }

  server.close(error => {
    if (error) {
      console.error('Error while closing the server:', error);
      process.exit(1);
      return;
    }

    console.log('HTTP server closed.');
    process.exit(0);
  });

  setTimeout(() => {
    console.error('Graceful shutdown timed out. Forcing exit.');
    process.exit(1);
  }, 10000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', reason => {
  console.error('Unhandled promise rejection:', reason);
});

process.on('uncaughtException', error => {
  console.error('Uncaught exception:', error);
  shutdown('uncaughtException');
});

// Start application
startServer();

module.exports = app;
