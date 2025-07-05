import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Message, TypingIndicator } from '../types';
import { SOCKET_URL } from '../config/api';

export const useSocket = (token: string | null) => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingIndicator[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setIsConnected(false);
      setMessages([]);
      setTypingUsers([]);
      return;
    }

    // Initialize socket connection
    socketRef.current = io(SOCKET_URL, {
      auth: {
        token
      },
      transports: ['websocket', 'polling']
    });

    const socket = socketRef.current;

    // Connection events
    socket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setIsConnected(false);
    });

    // Message events
    socket.on('new-message', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    socket.on('message-reaction-updated', (message: Message) => {
      setMessages(prev => prev.map(msg => 
        msg.id === message.id ? message : msg
      ));
    });

    // Typing events
    socket.on('user-typing', (data: { userId: string; userName: string; roomId: string }) => {
      setTypingUsers(prev => {
        const existing = prev.find(t => t.userId === data.userId && t.roomId === data.roomId);
        if (existing) return prev;
        
        return [...prev, {
          userId: data.userId,
          userName: data.userName,
          roomId: data.roomId,
          timestamp: new Date()
        }];
      });
    });

    socket.on('user-stopped-typing', (data: { userId: string; roomId: string }) => {
      setTypingUsers(prev => prev.filter(t => 
        !(t.userId === data.userId && t.roomId === data.roomId)
      ));
    });

    // Error handling
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [token]);

  const joinRoom = (roomId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('join-room', roomId);
    }
  };

  const leaveRoom = (roomId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('leave-room', roomId);
    }
  };

  const sendMessage = (messageData: {
    content: string;
    roomId: string;
    type?: string;
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
  }) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('send-message', messageData);
    }
  };

  const startTyping = (roomId: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('typing-start', { roomId });
    }
  };

  const stopTyping = (roomId: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('typing-stop', { roomId });
    }
  };

  const reactToMessage = (messageId: string, emoji: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('react-to-message', { messageId, emoji });
    }
  };

  return {
    isConnected,
    messages,
    typingUsers,
    joinRoom,
    leaveRoom,
    sendMessage,
    startTyping,
    stopTyping,
    reactToMessage
  };
};