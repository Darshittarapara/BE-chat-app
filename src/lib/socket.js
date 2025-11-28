import {Server} from "socket.io";
import express from 'express';
import http from 'http';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173']
    }
});
const userOnlineSocketIds = {}
const getReceiverSocketId = (userId) => {
console.log(userOnlineSocketIds,'userOnlineSocketIds')

    return userOnlineSocketIds[userId]
};
io.on('connection', (socket) => {
    console.log('user connected', socket.id)
    const userId = socket.handshake.query.userId;
    userOnlineSocketIds[userId] = socket.id;
    io.emit('getOnlineUser', Object.keys(userOnlineSocketIds))
    socket.on('disconnect', () => {
        delete userOnlineSocketIds[userId]
        console.log('user disconnected', socket.id)
        io.emit("getOnlineUser", Object.keys(userOnlineSocketIds));
    })
})

export {io, server, app,getReceiverSocketId}