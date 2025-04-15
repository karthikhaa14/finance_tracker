const express = require('express');
const router = express.Router();
const {
  createPermissions,
  getPermissions,
  updatePermissions,
  deletePermissions,
} = require('../controllers/permissionController');

// Create Permissions (for chatbot access)
router.post('/', createPermissions);

// Get Permissions by User ID
router.get('/:user_id',getPermissions);

// Update Permissions (for chatbot access)
router.put('/:user_id',updatePermissions);

// Delete Permissions (for chatbot access)
router.delete('/:user_id', deletePermissions);

module.exports = router;
