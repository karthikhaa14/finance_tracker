const express = require('express');
const router = express.Router();
const {
  createExpense,
  getExpense,
  updateExpense,
  deleteExpense,
  getExpensesByUser,
} = require('../controllers/expenseController');
const authMiddleware=require('../middleware/authMiddleware')



// Create a new expense
router.post('/:user_id', authMiddleware,createExpense);

// Get a specific expense by ID
router.get('/:id',authMiddleware, getExpense);

// Get all expenses for a specific user by user_id
router.get('/user/:user_id',authMiddleware,getExpensesByUser);

// Update an expense by ID
router.put('/:id',authMiddleware, updateExpense);

// Delete an expense by ID
router.delete('/:id',authMiddleware, deleteExpense);

module.exports = router;
