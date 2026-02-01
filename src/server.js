import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const port = process.env.PORT || 5000;

app.listen(port,()=>{
    console.log(`🚀 Server running on port ${port}`);
})