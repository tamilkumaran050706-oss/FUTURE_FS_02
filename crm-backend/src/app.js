const express = require('express');
const cors = require('cors');
const leadRoutes = require('./routes/leadRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/leads', leadRoutes);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Real Estate Lead Management CRM API',
    data: {},
  });
});

app.use((req, res, next) => {
  res.status(404);
  next(new Error('Route not found'));
});

app.use(errorHandler);

module.exports = app;
