import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();


app.get('/',(req,res)=>{
    res.status(200).send('server is running. Hello from silver595');
})

export default app;
