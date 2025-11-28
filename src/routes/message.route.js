import express from 'express';
import { ProtectRoute } from '../middleware/ProtectRoute.middleware.js';
import { getMessages, getUsers, sendMessage,markRead } from '../controller/message.controller.js';
import upload from '../lib/multer.js';

const route = express.Router();

route.get('/users', ProtectRoute, getUsers);
route.post('/:id', ProtectRoute,upload.array('images'), sendMessage)
route.put('/mark-read/:id',ProtectRoute,markRead)
route.get('/:id', ProtectRoute, getMessages);

export default route;