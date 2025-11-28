import express from 'express';
import { ProtectRoute } from '../middleware/ProtectRoute.middleware.js';
import { getMessages, getUsers, sendMessage } from '../controller/message.controller.js';
import upload from '../lib/multer.js';

const route = express.Router();

route.get('/users', ProtectRoute, getUsers);
route.post('/:id', ProtectRoute,upload.array('images'), sendMessage)
route.get('/:id', ProtectRoute, getMessages);

export default route;