import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import authRoute from './src/routes/auth.route.js';
import messageRoute from './src/routes/message.route.js';
import groupRoute from './src/routes/group.route.js';


import { connectDB } from './src/lib/db.js';
import cookieParser from 'cookie-parser';
import { app, server } from './src/lib/socket.js';


dotenv.config();
;
const PORT = process.env.PORT || 8080;

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.static(`./src/public`))
app.use(express.json());
app.use(express.urlencoded({ extended: true,limit: "20mb" }));
app.use(cookieParser());

app.use('/api/auth', authRoute);
app.use('/api/messages',messageRoute);
app.use('/api/groups', groupRoute)
app.use((err, req, res,next) => {
  console.error(err.message,'statusMessage');
  res.status(err.statusCode || 500).json({  status: false, error: err.message });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});