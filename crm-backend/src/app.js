const express = require('express');
const cors = require('cors');
const leadRoutes = require('./routes/leadRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/leads', leadRoutes);

// Root Endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Real Estate Lead Management CRM API' });
});

// Error Handler
app.use(errorHandler);

module.exports = app;
