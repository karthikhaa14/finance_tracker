const express = require('express');
const router = express.Router();
const {
  createPermissions,
  getPermissions,
  updatePermissions,
  deletePermissions,
} = require('../controllers/permissionController');
const authMiddleware=require('../middleware/authMiddleware')
// Create Permissions (for chatbot access)
router.post('/',authMiddleware, createPermissions);

// Get Permissions by User ID
router.get('/:user_id',authMiddleware,getPermissions);

// Update Permissions (for chatbot access)
router.put('/:user_id',authMiddleware,updatePermissions);

// Delete Permissions (for chatbot access)
router.delete('/:user_id',authMiddleware, deletePermissions);

module.exports = router;
