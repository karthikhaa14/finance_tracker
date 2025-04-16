const express=require('express');
const router=express.Router();
const {askGemini} =require('../controllers/botController');

router.use('/ask',askGemini);

module.exports=router;