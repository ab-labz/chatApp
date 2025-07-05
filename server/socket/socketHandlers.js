import User from '../models/User.js';
import Room from '../models/Room.js';
import Message from '../models/Message.js';

export const handleConnection = (io, socket) => {
  console.log(`User connected: ${socket.user.name} (${socket.id})`);

  // Update user's socket ID and online status
  updateUserStatus(socket.user._id, socket.id, true);

  // Join user to their rooms
  joinUserRooms(socket);

  // Handle joining a room
  socket.on('join-room', async (roomId) => {
    try {
      const room = await Room.findById(roomId);
      if (room && room.participants.includes(socket.user._id)) {
        socket.join(roomId);
        console.log(`${socket.user.name} joined room: ${room.name}`);
      }
    } catch (error) {
      console.error('Join room error:', error);
    }
  });

  // Handle leaving a room
  socket.on('leave-room', (roomId) => {
    socket.leave(roomId);
    console.log(`${socket.user.name} left room: ${roomId}`);
  });

  // Handle sending messages
  socket.on('send-message', async (data) => {
    try {
      const { content, roomId, type = 'text', fileUrl, fileName, fileSize } = data;

      // Verify user is participant
      const room = await Room.findById(roomId);
      if (!room || !room.participants.includes(socket.user._id)) {
        socket.emit('error', { message: 'Access denied' });
        return;
      }

      // Create message
      const message = new Message({
        content,
        sender: socket.user._id,
        room: roomId,
        type,
        fileUrl,
        fileName,
        fileSize
      });

      await message.save();

      // Update room's last message and activity
      room.lastMessage = message._id;
      room.lastActivity = new Date();
      await room.save();

      // Populate message
      const populatedMessage = await Message.findById(message._id)
        .populate('sender', 'name email avatar');

      // Emit to all users in the room
      io.to(roomId).emit('new-message', populatedMessage);

      // Emit room update to all participants
      const updatedRoom = await Room.findById(roomId)
        .populate('participants', 'name email avatar isOnline lastSeen')
        .populate('lastMessage');

      room.participants.forEach(participantId => {
        io.to(participantId.toString()).emit('room-updated', updatedRoom);
      });

    } catch (error) {
      console.error('Send message error:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Handle typing indicators
  socket.on('typing-start', (data) => {
    const { roomId } = data;
    socket.to(roomId).emit('user-typing', {
      userId: socket.user._id,
      userName: socket.user.name,
      roomId
    });
  });

  socket.on('typing-stop', (data) => {
    const { roomId } = data;
    socket.to(roomId).emit('user-stopped-typing', {
      userId: socket.user._id,
      roomId
    });
  });

  // Handle message reactions
  socket.on('react-to-message', async (data) => {
    try {
      const { messageId, emoji } = data;

      const message = await Message.findById(messageId);
      if (!message) {
        socket.emit('error', { message: 'Message not found' });
        return;
      }

      // Find existing reaction
      const existingReaction = message.reactions.find(r => r.emoji === emoji);
      
      if (existingReaction) {
        const userIndex = existingReaction.users.indexOf(socket.user._id);
        if (userIndex > -1) {
          existingReaction.users.splice(userIndex, 1);
          if (existingReaction.users.length === 0) {
            message.reactions = message.reactions.filter(r => r.emoji !== emoji);
          }
        } else {
          existingReaction.users.push(socket.user._id);
        }
      } else {
        message.reactions.push({
          emoji,
          users: [socket.user._id]
        });
      }

      await message.save();

      const updatedMessage = await Message.findById(message._id)
        .populate('sender', 'name email avatar')
        .populate('reactions.users', 'name');

      // Emit to all users in the room
      io.to(message.room.toString()).emit('message-reaction-updated', updatedMessage);

    } catch (error) {
      console.error('React to message error:', error);
      socket.emit('error', { message: 'Failed to update reaction' });
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.user.name}`);
    updateUserStatus(socket.user._id, null, false);
  });
};

const updateUserStatus = async (userId, socketId, isOnline) => {
  try {
    await User.findByIdAndUpdate(userId, {
      socketId,
      isOnline,
      lastSeen: new Date()
    });
  } catch (error) {
    console.error('Update user status error:', error);
  }
};

const joinUserRooms = async (socket) => {
  try {
    const rooms = await Room.find({
      participants: socket.user._id
    });

    rooms.forEach(room => {
      socket.join(room._id.toString());
    });
  } catch (error) {
    console.error('Join user rooms error:', error);
  }
};