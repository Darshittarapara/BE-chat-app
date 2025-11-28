import express from 'express';
import { ProtectRoute } from '../middleware/ProtectRoute.middleware.js';
import { createGroup,getAllGroups,getGroupChats, sendMessage } from '../controller/groups.controller.js';
import upload from '../lib/multer.js';
const route = express.Router();

route.get('/get-groups', ProtectRoute, getAllGroups);
route.post('/create', ProtectRoute,upload.single('image'), createGroup)
route.post('/:groupId', ProtectRoute, upload.array('images'), sendMessage)
route.get('/:groupId', ProtectRoute, getGroupChats);

export default route;