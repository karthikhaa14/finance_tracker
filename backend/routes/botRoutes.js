const express=require('express');
const router=express.Router();
const {askGemini} =require('../controllers/botController');
const authMiddleware=require('../middleware/authMiddleware')

router.use('/ask',authMiddleware,askGemini);

module.exports=router;