import express from 'express';
import Room from '../models/Room.js';
import Message from '../models/Message.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all rooms for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const rooms = await Room.find({
      participants: req.user._id
    })
    .populate('participants', 'name email avatar isOnline lastSeen')
    .populate('createdBy', 'name email')
    .populate({
      path: 'lastMessage',
      populate: {
        path: 'sender',
        select: 'name'
      }
    })
    .sort({ lastActivity: -1 });

    res.json({ rooms });
  } catch (error) {
    console.error('Get rooms error:', error);
    res.status(500).json({ error: 'Server error fetching rooms' });
  }
});

// Create new room
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, description, type = 'group', isPrivate = false } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Room name is required' });
    }

    const room = new Room({
      name,
      description,
      type,
      participants: [req.user._id],
      createdBy: req.user._id,
      isPrivate
    });

    await room.save();
    
    const populatedRoom = await Room.findById(room._id)
      .populate('participants', 'name email avatar isOnline lastSeen')
      .populate('createdBy', 'name email');

    res.status(201).json({ 
      message: 'Room created successfully',
      room: populatedRoom 
    });
  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({ error: 'Server error creating room' });
  }
});

// Get room details
router.get('/:roomId', authenticateToken, async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId)
      .populate('participants', 'name email avatar isOnline lastSeen')
      .populate('createdBy', 'name email');

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Check if user is participant
    if (!room.participants.some(p => p._id.toString() === req.user._id.toString())) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ room });
  } catch (error) {
    console.error('Get room error:', error);
    res.status(500).json({ error: 'Server error fetching room' });
  }
});

// Update room
router.put('/:roomId', authenticateToken, async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const room = await Room.findById(req.params.roomId);
    
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Check if user is creator or admin
    if (room.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Only room creator can update room' });
    }

    if (name) room.name = name;
    if (description !== undefined) room.description = description;
    
    await room.save();

    const updatedRoom = await Room.findById(room._id)
      .populate('participants', 'name email avatar isOnline lastSeen')
      .populate('createdBy', 'name email');

    res.json({ 
      message: 'Room updated successfully',
      room: updatedRoom 
    });
  } catch (error) {
    console.error('Update room error:', error);
    res.status(500).json({ error: 'Server error updating room' });
  }
});

// Join room
router.post('/:roomId/join', authenticateToken, async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId);
    
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    if (room.participants.includes(req.user._id)) {
      return res.status(400).json({ error: 'Already a member of this room' });
    }

    room.participants.push(req.user._id);
    await room.save();

    const updatedRoom = await Room.findById(room._id)
      .populate('participants', 'name email avatar isOnline lastSeen')
      .populate('createdBy', 'name email');

    res.json({ 
      message: 'Joined room successfully',
      room: updatedRoom 
    });
  } catch (error) {
    console.error('Join room error:', error);
    res.status(500).json({ error: 'Server error joining room' });
  }
});

// Leave room
router.post('/:roomId/leave', authenticateToken, async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId);
    
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    if (!room.participants.includes(req.user._id)) {
      return res.status(400).json({ error: 'Not a member of this room' });
    }

    room.participants = room.participants.filter(
      p => p.toString() !== req.user._id.toString()
    );
    
    await room.save();

    res.json({ message: 'Left room successfully' });
  } catch (error) {
    console.error('Leave room error:', error);
    res.status(500).json({ error: 'Server error leaving room' });
  }
});

export default router;