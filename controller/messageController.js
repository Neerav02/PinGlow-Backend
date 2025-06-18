const Message = require('../models/message');
const Chat = require('../models/Chat');

exports.sendMessage = async (req, res) => {
  const { chatId, content } = req.body;

  if (!chatId || !content) {
    return res.status(400).json({ msg: 'Chat ID and content are required' });
  }

  try {
    const newMessage = new Message({
      chat: chatId,
      sender: req.user.id,
      content,
    });

    const savedMessage = await newMessage.save();
    const populatedMessage = await Message.findById(savedMessage._id)
      .populate('sender', '-password')
      .populate('chat');

    // Update chat's last message
    await Chat.findByIdAndUpdate(chatId, { lastMessage: savedMessage._id });

    res.status(201).json(populatedMessage);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    const messages = await Message.find({ chat: chatId })
      .populate('sender', '-password')
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
