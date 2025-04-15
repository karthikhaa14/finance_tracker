const express = require('express');
const router = express.Router();
const {
  createIncome,
  getIncome,
  updateIncome,
  deleteIncome,
  getIncomesByUser,
} = require('../controllers/incomeController');



// Create a new income
router.post('/',createIncome);

// Get a specific income by ID
router.get('/:id', getIncome);

// Get all incomes for a specific user by user_id
router.get('/user/:user_id', getIncomesByUser);

// Update an income by ID
router.put('/:id', updateIncome);

// Delete an income by ID
router.delete('/:id',  deleteIncome);

module.exports = router;
