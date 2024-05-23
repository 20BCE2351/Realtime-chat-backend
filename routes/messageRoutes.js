const express = require('express');
const { getMessages, saveMessage } = require('../controllers/messageController');
const router = express.Router();

router.get('/:conversationId', getMessages);
router.post('/', saveMessage);

module.exports = router;
