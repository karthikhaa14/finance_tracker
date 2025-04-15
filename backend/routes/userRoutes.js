const express = require('express');
const { createUser, getUser, updateUser, deleteUser, getAllUsers } = require('../controllers/userController');

const router = express.Router();
const authMiddleware=require('../middleware/authMiddleware')

router.post('/',createUser); // Create user
router.get('/:id', authMiddleware,getUser);   // Get user by ID
router.put('/:id', updateUser); // Update user by ID
router.delete('/:id',authMiddleware, deleteUser);
router.get('/',getAllUsers) // Delete user by ID

module.exports = router;
