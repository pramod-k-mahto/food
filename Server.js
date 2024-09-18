// const express = require('express');
// const http = require('http');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const { Server } = require('socket.io');
// require('dotenv').config();

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: 'http://localhost:3000', // React frontend URL
//     methods: ['GET', 'POST'],
//   },
// });

// // Middleware
// app.use(express.json());
// app.use(cors());

// // Connect to MongoDB
// mongoose.connect("mongodb://localhost:27017/food").then(() => console.log('Connected to MongoDB'))
//   .catch((err) => console.log('MongoDB connection error: ', err));

// // Sample Routes
// app.get('/', (req, res) => {
//   res.send('Food Delivery Backend');
// });

// // Chat feature
// io.on('connection', (socket) => {
//   console.log('User connected:', socket.id);

//   socket.on('joinRoom', ({ roomId }) => {
//     socket.join(roomId);
//     console.log(`User joined room: ${roomId}`);
//   });

//   socket.on('sendMessage', ({ roomId, senderId, message }) => {
//     io.to(roomId).emit('receiveMessage', { senderId, message });
//   });

//   socket.on('disconnect', () => {
//     console.log('User disconnected:', socket.id);
//   });
// });

// // Start Server
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
