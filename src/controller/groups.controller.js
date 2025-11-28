import cloudinary from "../lib/cloundary.js";
import User from "../model/user.model.js";
import Message from "../model/message.mode.js";

import fs from "fs";
import Groups from "../model/groups.model.js";
import GroupChats from '../model/groupchat.model.js'

export const sendMessage = async (req, res, next) => {
  try {
    const { groupId } = req.params

    const senderId = req.user._id;

    let imageUrls = [];

    // If images exist
    if (req.files && req.files.length > 0) {
      imageUrls = await Promise.all(
        req.files.map(async (file) => {
          const response = await cloudinary.uploader.upload(file.path, {
            folder: "groups_chat_images",
          });

          // Delete local temp file
          fs.unlinkSync(file.path);

          return response.secure_url;
        })
      );
    }

    // Create ONE message (with multiple images)
    const newMessage = await Message.create({
      ...req.body,
      groupId,
      senderId,
      images: imageUrls, // store many URLs here
    });

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

export const getGroupChats = async (req, res, next) => {
  try {
    const { groupId } = req.params

    const groups = await GroupChats.find(
      { groupId }
    );
    res.status(200).json({
      status: true,
      message: "Groups chats fetched successfully",
      data: groups
    });

  } catch (error) {
    next(error);
  }
}
export const getAllGroups = async (req, res, next) => {
  try {
    const myId = req.user._id;

    const groups = await Groups.find(
      { users: { $in: myId } }
    );
    res.status(200).json({
      status: true,
      message: "Groups fetched successfully",
      data: groups
    });

  } catch (error) {
    next(error);
  }
}

export const createGroup = async (req, res, next) => {
  try {
    const { name, users } = req.body;
    const url = await cloudinary.uploader.upload(req.file.path, {
      folder: 'group_icons',

    })

    const group = await Group.create({
      name,
      users,
      image: url.secure_url || null
    });

    res.status(201).json({
      status: true,
      group
    });
  } catch (error) {
    next(error);
  }
};
