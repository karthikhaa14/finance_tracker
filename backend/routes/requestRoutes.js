const express= require('express')
const router=express.Router();
const authMiddleware=require('../middleware/authMiddleware')
const {createRequest,updateRequest,getRequests}=require('../controllers/requestController')

router.post('/',createRequest);
router.put('/:id',updateRequest);
router.get('/',getRequests);

module.exports=router;