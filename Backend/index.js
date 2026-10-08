import cookieParser from 'cookie-parser';
import express from 'express';
import dotenv from 'dotenv';  
import cors from 'cors' 
import connectDB from './utils/db.js'; 
import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import userRoute from './routes/user.router.js';
import reviewsRoute from './routes/reviews.router.js';
import bookRoute from './routes/book.router.js';
import adminRoute from './routes/admin.router.js';

dotenv.config({})
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

const corsOptions = {
    origin: ['http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(cors(corsOptions));
const PORT = process.env.PORT;

//api
app.use('/api/user', userRoute);
app.use('/api/book', bookRoute);
app.use('/api/reviews', reviewsRoute);
app.use('/api/admin', adminRoute);


app.listen(PORT, ()=>{
    console.log(`Server is running on ${PORT}.`);
    connectDB();
})




