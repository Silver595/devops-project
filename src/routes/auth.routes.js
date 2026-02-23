import express from 'express';

const router = express.Router();


router.post('/register',async (req,res)=>{
  res.send('POST /api/auth/register/ response');
});

router.post('/login',async (req,res)=>{
  res.send('POST /api/auth/login/ response');
});


router.post('/logout',async (req,res)=>{
  res.send('POST /api/auth/logout/ response');
});

export default router;
