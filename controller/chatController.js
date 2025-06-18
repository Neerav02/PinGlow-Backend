const Chat = require('../models/Chat');
const User = require('../models/User');

exports.createOrGetChat = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ msg: 'User ID is required' });
  }

  try {
    // Check if chat already exists
    let chat = await Chat.findOne({
      users: { $all: [req.user.id, userId] },
    }).populate('users', '-password');

    if (chat) {
      return res.json(chat);
    }

    // Create new chat
    const newChat = new Chat({
      users: [req.user.id, userId],
    });

    const savedChat = await newChat.save();
    const populatedChat = await Chat.findById(savedChat._id).populate('users', '-password');
    res.status(201).json(populatedChat);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getUserChats = async (req, res) => {
  try {
    const chats = await Chat.find({ users: req.user.id })
      .populate('users', '-password')
      .populate('latestMessage')
      .sort({ updatedAt: -1 });
    res.json(chats);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
