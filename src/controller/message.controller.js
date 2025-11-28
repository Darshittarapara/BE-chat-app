import cloudinary from "../lib/cloundary.js";
import User from "../model/user.model.js";
import Message from "../model/message.mode.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import fs from "fs";

export const sendMessage = async (req, res, next) => {
  try {
    const { id: receiverId } = req.params;
    const senderId = req.user._id;
    const text = req.body.text || "";

    let imageUrls = [];

    // Upload images if available
    if (req.files && req.files.length > 0) {
      imageUrls = await Promise.all(
        req.files.map(async (file) => {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "message_images",
          });

          fs.unlinkSync(file.path); // delete temp file
          return result.secure_url;
        })
      );
    }

    // Create ONE message (with multiple images)
    const newMessage = await Message.create({
      senderId,
      receiverId,
      text: text || null,
      images: imageUrls, // store many URLs here
    });
    const receiverSocketId = getReceiverSocketId(receiverId)
    if(receiverSocketId) {
      io.to(receiverSocketId).emit('newMessage', newMessage);
    }


     res.status(201).json({
      status: true,
      message: "Message sent successfully",
      data: newMessage,
    });

  } catch (error) {
    console.log("Error in sendMessage:", error);
    next(error);
  }
};



export const getMessages = async (req, res, next) => {
    try {
        const { id: userOnChat } = req.params;
        const myId = req.user._id;

        /**
         * Find messages where:
         * 1. senderId is myId and receiverId is userOnChat
         * OR
         * 2. senderId is userOnChat and receiverId is myId
         */
        const message = await Message.find({
            $or: [
                { senderId: myId, receiverId: userOnChat },
                { senderId: userOnChat, receiverId: myId }
            ]
        });
        res.status(200).json({
            status: true,
            message: "Messages fetched successfully",
            data: message
        });

    } catch (error) {
        next(error);
    }
}

export const getUsers = async (req, res, next) => {
    try {
        const myId = req.user._id;
        const message = await User.find(({ _id: { $ne: myId } }));
        res.status(200).json({
            status: true,
            message: "Users fetched successfully",
            data: message
        });
    } catch (error) {
        next(error);
    }
}