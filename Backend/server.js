const express = require('express');
const cors = require('cors');
const path = require('path');
const dns = require('dns');

// 1. Load environment variables (.env locally; Render uses its own env vars)
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Use Google DNS for resolving MongoDB Atlas SRV records (fixes some ISP DNS issues)
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (err) {
  console.warn('Could not set custom DNS servers:', err.message);
}

// 2. Database connection
const connectDB = require('./config/db');

const app = express();

// Render sits behind a proxy; this keeps req.ip / protocol accurate
app.set('trust proxy', 1);

// ---------------------------------------------------------------------------
// CORS
// Allowed origins: your Vercel site + local dev + anything in CLIENT_ORIGINS
// (comma-separated) set in Render's environment variables.
// ---------------------------------------------------------------------------
const defaultOrigins = [
  'https://bu-hangout-group-2.vercel.app',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://localhost:3000',
  'http://localhost:5000',
];

const extraOrigins = (process.env.CLIENT_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const allowedOrigins = [...new Set([...defaultOrigins, ...extraOrigins])];

// Also allow every Vercel production/preview URL of this project,
// e.g. bu-hangout-group-2-ejpa2t3pp-group-2-388f.vercel.app
const vercelPattern = /^https:\/\/bu-hangout-group-2[a-z0-9-]*\.vercel\.app$/;

app.use(
  cors({
    origin(origin, callback) {
      // Allow tools like Postman/curl (no Origin header) and whitelisted sites
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        vercelPattern.test(origin)
      ) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Simple request logger (skipped in production to keep logs clean)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
  });
}

// ---------------------------------------------------------------------------
// Health / sanity routes
// ---------------------------------------------------------------------------
app.get('/', (req, res) => {
  res.status(200).send('API is running successfully!');
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

// ---------------------------------------------------------------------------
// API routes (names match your folder/file capitalization exactly,
// which matters on Linux hosts like Render)
// ---------------------------------------------------------------------------
app.use('/api/auth', require('./Routes/Authroutes'));
app.use('/api/users', require('./Routes/Userroutes'));
app.use('/api/stalls', require('./Routes/Stallroutes'));
app.use('/api/menu', require('./Routes/Menuroutes'));

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({ message: `Route not found - ${req.originalUrl}` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack || err);
  const status = err.status || (err.message && err.message.startsWith('CORS') ? 403 : 500);
  res.status(status).json({
    message: status === 403 ? 'Forbidden' : 'Server Error',
    error: err.message,
  });
});

// ---------------------------------------------------------------------------
// Start server only after the database connection is ready
// ---------------------------------------------------------------------------
const PORT = process.env.PORT || 5000;
let server;

async function start() {
  try {
    await connectDB();
    server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message || err);
    process.exit(1);
  }
}

start();

// ---------------------------------------------------------------------------
// Safety nets and graceful shutdown
// ---------------------------------------------------------------------------
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Promise Rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

function shutdown(signal) {
  console.log(`${signal} received. Shutting down...`);
  if (server) {
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 10000).unref();
  } else {
    process.exit(0);
  }
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
