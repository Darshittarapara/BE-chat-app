
import express from 'express';
import { login, logout, signup, updateProfilePic,checkAuth } from '../controller/auth.controller.js';
import { ProtectRoute } from '../middleware/ProtectRoute.middleware.js';
import upload from '../lib/multer.js';

const route = express.Router();


route.post('/login', login);
route.post('/signup', signup);
route.post('/logout',logout);
route.post('/updateProfile',ProtectRoute,upload.single('profilePic'), updateProfilePic);
route.get('/check-auth',ProtectRoute,checkAuth);


export default route;