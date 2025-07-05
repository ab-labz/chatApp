import express from 'express';
import Message from '../models/Message.js';
import Room from '../models/Room.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get messages for a room
router.get('/room/:roomId', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const roomId = req.params.roomId;

    // Check if user is participant of the room
    const room = await Room.findById(roomId);
    if (!room || !room.participants.includes(req.user._id)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const messages = await Message.find({ room: roomId })
      .populate('sender', 'name email avatar')
      .populate('reactions.users', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json({ 
      messages: messages.reverse(), // Reverse to get chronological order
      hasMore: messages.length === parseInt(limit)
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Server error fetching messages' });
  }
});

// Send message
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { content, roomId, type = 'text', fileUrl, fileName, fileSize } = req.body;

    if (!content || !roomId) {
      return res.status(400).json({ error: 'Content and room ID are required' });
    }

    // Check if user is participant of the room
    const room = await Room.findById(roomId);
    if (!room || !room.participants.includes(req.user._id)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const message = new Message({
      content,
      sender: req.user._id,
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

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name email avatar');

    res.status(201).json({ 
      message: 'Message sent successfully',
      data: populatedMessage 
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Server error sending message' });
  }
});

// Edit message
router.put('/:messageId', authenticateToken, async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const message = await Message.findById(req.params.messageId);
    
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Can only edit your own messages' });
    }

    message.content = content;
    message.isEdited = true;
    message.editedAt = new Date();
    await message.save();

    const updatedMessage = await Message.findById(message._id)
      .populate('sender', 'name email avatar');

    res.json({ 
      message: 'Message updated successfully',
      data: updatedMessage 
    });
  } catch (error) {
    console.error('Edit message error:', error);
    res.status(500).json({ error: 'Server error editing message' });
  }
});

// Delete message
router.delete('/:messageId', authenticateToken, async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);
    
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Can only delete your own messages' });
    }

    await Message.findByIdAndDelete(req.params.messageId);

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ error: 'Server error deleting message' });
  }
});

// Add reaction to message
router.post('/:messageId/react', authenticateToken, async (req, res) => {
  try {
    const { emoji } = req.body;
    
    if (!emoji) {
      return res.status(400).json({ error: 'Emoji is required' });
    }

    const message = await Message.findById(req.params.messageId);
    
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Find existing reaction
    const existingReaction = message.reactions.find(r => r.emoji === emoji);
    
    if (existingReaction) {
      // Toggle user's reaction
      const userIndex = existingReaction.users.indexOf(req.user._id);
      if (userIndex > -1) {
        existingReaction.users.splice(userIndex, 1);
        if (existingReaction.users.length === 0) {
          message.reactions = message.reactions.filter(r => r.emoji !== emoji);
        }
      } else {
        existingReaction.users.push(req.user._id);
      }
    } else {
      // Add new reaction
      message.reactions.push({
        emoji,
        users: [req.user._id]
      });
    }

    await message.save();

    const updatedMessage = await Message.findById(message._id)
      .populate('sender', 'name email avatar')
      .populate('reactions.users', 'name');

    res.json({ 
      message: 'Reaction updated successfully',
      data: updatedMessage 
    });
  } catch (error) {
    console.error('React to message error:', error);
    res.status(500).json({ error: 'Server error updating reaction' });
  }
});

export default router;