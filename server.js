const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Socket.io Configuration
io.on('connection', socket => {
    console.log('New client connected');
    
    socket.on('sendMessage', (message) => {
        io.emit('receiveMessage', message);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});



const { getLLMResponse } = require('./controllers/llmController');

io.on('connection', socket => {
    console.log('New client connected');
    
    socket.on('sendMessage', async (message) => {
        const recipientStatus = await User.findById(message.recipient).select('status');

        if (recipientStatus === 'BUSY') {
            const llmResponse = await getLLMResponse(message.content);
            socket.emit('receiveMessage', { sender: 'LLM', content: llmResponse });
        } else {
            io.emit('receiveMessage', message);
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});
