import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import { io, userSocketMap } from "../server.js";

// Get users for sidebar
export const getUsersForSidebar = async (req, res) => {
  try {
    const userId = req.user._id;

    const filteredUsers = await User.find({
      _id: { $ne: userId },
    }).select("-password");

    const unseenMessages = {};

    const promises = filteredUsers.map(async (user) => {
      const count = await Message.countDocuments({
        senderId: user._id,
        receiverId: userId,
        seen: false,
      });

      if (count > 0) {
        unseenMessages[user._id] = count;
      }
    });

    await Promise.all(promises);

    res.json({
      success: true,
      users: filteredUsers,
      unseenMessages,
    });
  } catch (error) {
    console.log("GET USERS ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get messages between two users
export const getMessages = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        {
          senderId: myId,
          receiverId: selectedUserId,
        },
        {
          senderId: selectedUserId,
          receiverId: myId,
        },
      ],
    }).sort({ createdAt: 1 });

    await Message.updateMany(
      {
        senderId: selectedUserId,
        receiverId: myId,
        seen: false,
      },
      { seen: true }
    );

    res.json({
      success: true,
      messages,
    });
  } catch (error) {
    console.log("GET MESSAGES ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Mark message as seen
export const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;

    await Message.findByIdAndUpdate(id, {
      seen: true,
    });

    res.json({
      success: true,
    });
  } catch (error) {
    console.log("MARK SEEN ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Send message
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;

    const receiverId = req.params.id;
    const senderId = req.user._id;

    let imageUrl = "";

    // Upload image to Cloudinary
    if (image) {
      console.log("Starting Cloudinary image upload...");

      const uploadResponse = await cloudinary.uploader.upload(image, {
        resource_type: "image",
      });

      console.log(
        "Cloudinary upload successful:",
        uploadResponse.secure_url
      );

      imageUrl = uploadResponse.secure_url;
    }

    // Create message
    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    // Send real-time message to receiver
    const receiverSocketId = userSocketMap[receiverId];

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.json({
      success: true,
      newMessage,
    });
  } catch (error) {
    console.log("SEND MESSAGE ERROR:", error);
    console.log("HTTP CODE:", error.http_code);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};