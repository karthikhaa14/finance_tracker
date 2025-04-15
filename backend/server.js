const express = require('express');
const userRoutes = require('./routes/userRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const incomeRoutes = require('./routes/incomeRoutes');
const permissionRoutes = require('./routes/permissionRoutes');
const authRoutes = require('./routes/authRoutes');
const requestRoutes=require('./routes/requestRoutes');
const app = express();
const pool = require('./db');
app.use(express.json()); // For parsing application/json
require('dotenv').config();
const cors= require("cors");

app.use(cors());

// API routes
app.use('/api/users', userRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/incomes', incomeRoutes);
app.use('/api/permissions', permissionRoutes);
app.use('/api/auth',authRoutes);
app.use('api/requests',requestRoutes);

// Start the server
const PORT = process.env.PORT||5000 ;

pool.connect()
  .then(() => {
    console.log('PostgreSQL connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('DB connection error:', err);
  });
 
