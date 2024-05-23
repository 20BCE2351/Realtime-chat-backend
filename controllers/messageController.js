const Message = require('../models/Message');

const getMessages = async (req, res) => {
    try {
        const messages = await Message.find({ conversationId: req.params.conversationId });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const saveMessage = async (req, res) => {
    const { sender, content } = req.body;

    try {
        const message = new Message({ sender, content });
        await message.save();
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getMessages, saveMessage };
