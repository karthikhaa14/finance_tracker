const express = require('express');
const router = express.Router();
const {
  createIncome,
  getIncome,
  updateIncome,
  deleteIncome,
  getIncomesByUser,
} = require('../controllers/incomeController');

const authMiddleware=require('../middleware/authMiddleware')

// Create a new income
router.post('/:id',createIncome);

// Get a specific income by ID
router.get('/:id',authMiddleware, getIncome);

// Get all incomes for a specific user by user_id
router.get('/user/:user_id', getIncomesByUser);

// Update an income by ID
router.put('/:id', authMiddleware,updateIncome);

// Delete an income by ID
router.delete('/:id', authMiddleware, deleteIncome);

module.exports = router;
