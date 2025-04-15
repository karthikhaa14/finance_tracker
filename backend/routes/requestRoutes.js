const express= require('express')
const router=express.Router();

const {createRequest,updateRequest,getRequests}=require('../controllers/requestController')

router.post('/:userid',createRequest);
router.put('/:id',updateRequest);
router.get('/',getRequests);

module.exports=router;