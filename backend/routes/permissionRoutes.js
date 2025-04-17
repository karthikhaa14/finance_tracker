const express = require('express');
const router = express.Router();
const {
  createPermissions,
  getPermissions,
  updatePermissions,
 // deletePermissions,
} = require('../controllers/permissionController');
const authMiddleware=require('../middleware/authMiddleware')
// Create Permissions (for chatbot access)
router.post('/', createPermissions);


router.get('/:user_id',authMiddleware,getPermissions);


router.put('/:user_id',updatePermissions);


//router.delete('/:user_id',authMiddleware, deletePermissions);

module.exports = router;
