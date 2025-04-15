const express = require('express');
const router = express.Router();
const {
  createExpense,
  getExpense,
  updateExpense,
  deleteExpense,
  getExpensesByUser,
} = require('../controllers/expenseController');



// Create a new expense
router.post('/', createExpense);

// Get a specific expense by ID
router.get('/:id', getExpense);

// Get all expenses for a specific user by user_id
router.get('/user/:user_id',getExpensesByUser);

// Update an expense by ID
router.put('/:id', updateExpense);

// Delete an expense by ID
router.delete('/:id', deleteExpense);

module.exports = router;
