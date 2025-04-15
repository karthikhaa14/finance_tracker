const express = require('express');
const { createUser, getUser, updateUser, deleteUser, getAllUsers } = require('../controllers/userController');

const router = express.Router();

router.post('/', createUser); // Create user
router.get('/:id', getUser);   // Get user by ID
router.put('/:id', updateUser); // Update user by ID
router.delete('/:id', deleteUser);
router.get('/',getAllUsers) // Delete user by ID

module.exports = router;
