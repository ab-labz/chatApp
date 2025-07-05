export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  _id: string;
  content: string;
  sender: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  room: string;
  type: 'text' | 'file' | 'image';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  reactions: {
    emoji: string;
    users: {
      _id: string;
      name: string;
    }[];
  }[];
  isEdited: boolean;
  editedAt?: Date;
  readBy: {
    user: string;
    readAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
  
  // Legacy properties for compatibility
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  timestamp: Date;
}

export interface ChatRoom {
  _id: string;
  name: string;
  description?: string;
  type: 'group' | 'direct';
  participants: User[];
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  isPrivate: boolean;
  lastMessage?: Message;
  lastActivity: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // Legacy properties for compatibility
  id: string;
}

export interface TypingIndicator {
  userId: string;
  userName: string;
  roomId: string;
  timestamp: Date;
}