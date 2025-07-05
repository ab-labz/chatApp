import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { AuthModal } from './components/AuthModal';
import { useSocket } from './hooks/useSocket';
import { apiService } from './services/api';
import { User, ChatRoom, Message } from './types';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [roomMessages, setRoomMessages] = useState<{ [roomId: string]: Message[] }>({});

  const { isConnected, messages, typingUsers, joinRoom, leaveRoom, sendMessage, startTyping, stopTyping, reactToMessage } = useSocket(token);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setShowSidebar(false);
      } else {
        setShowSidebar(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Check for existing token on app load
  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        try {
          apiService.setToken(savedToken);
          const response = await apiService.getCurrentUser();
          setCurrentUser(response.user);
          setToken(savedToken);
          setIsAuthModalOpen(false);
          await loadRooms();
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('token');
          setToken(null);
          setIsAuthModalOpen(true);
        }
      }
    };

    checkAuth();
  }, []);

  // Load rooms when user is authenticated
  const loadRooms = async () => {
    try {
      const response = await apiService.getRooms();
      const rooms = response.rooms.map((room: any) => ({
        ...room,
        id: room._id // Add legacy id property
      }));
      setChatRooms(rooms);
      
      if (rooms.length > 0 && !activeRoomId) {
        setActiveRoomId(rooms[0]._id);
      }
    } catch (error) {
      console.error('Failed to load rooms:', error);
    }
  };

  // Load messages for active room
  useEffect(() => {
    const loadMessages = async () => {
      if (activeRoomId && !roomMessages[activeRoomId]) {
        try {
          const response = await apiService.getMessages(activeRoomId);
          const messages = response.messages.map((msg: any) => ({
            ...msg,
            id: msg._id,
            senderId: msg.sender._id,
            senderName: msg.sender.name,
            senderAvatar: msg.sender.avatar,
            timestamp: new Date(msg.createdAt)
          }));
          
          setRoomMessages(prev => ({
            ...prev,
            [activeRoomId]: messages
          }));
        } catch (error) {
          console.error('Failed to load messages:', error);
        }
      }
    };

    loadMessages();
  }, [activeRoomId, roomMessages]);

  // Join room when active room changes
  useEffect(() => {
    if (activeRoomId) {
      joinRoom(activeRoomId);
    }
  }, [activeRoomId, joinRoom]);

  // Handle new messages from socket
  useEffect(() => {
    if (messages.length > 0) {
      const latestMessage = messages[messages.length - 1];
      const roomId = latestMessage.room;
      
      // Convert message format for compatibility
      const formattedMessage = {
        ...latestMessage,
        id: latestMessage._id,
        senderId: latestMessage.sender._id,
        senderName: latestMessage.sender.name,
        senderAvatar: latestMessage.sender.avatar,
        timestamp: new Date(latestMessage.createdAt)
      };

      setRoomMessages(prev => ({
        ...prev,
        [roomId]: [...(prev[roomId] || []), formattedMessage]
      }));

      // Update room's last message
      setChatRooms(prev => prev.map(room => 
        room._id === roomId 
          ? { ...room, lastMessage: formattedMessage }
          : room
      ));
    }
  }, [messages]);

  const handleLogin = async (userData: { name: string; email: string }, isQuickLogin = false) => {
    try {
      const response = isQuickLogin 
        ? await apiService.quickLogin(userData)
        : await apiService.login(userData as any);

      const { token, user } = response;
      
      apiService.setToken(token);
      setToken(token);
      setCurrentUser(user);
      setIsAuthModalOpen(false);
      
      await loadRooms();
    } catch (error) {
      console.error('Login failed:', error);
      alert(error instanceof Error ? error.message : 'Login failed');
    }
  };

  const handleSendMessage = async (content: string, type: 'text' | 'file', fileData?: any) => {
    if (!currentUser || !activeRoomId) return;

    const messageData = {
      content,
      roomId: activeRoomId,
      type,
      fileUrl: fileData?.url,
      fileName: fileData?.name,
      fileSize: fileData?.size
    };

    // Send via socket for real-time delivery
    sendMessage(messageData);
  };

  const handleStartTyping = () => {
    if (activeRoomId) {
      startTyping(activeRoomId);
    }
  };

  const handleStopTyping = () => {
    if (activeRoomId) {
      stopTyping(activeRoomId);
    }
  };

  const handleCreateRoom = async () => {
    const roomName = prompt('Enter room name:');
    if (roomName && currentUser) {
      try {
        const response = await apiService.createRoom({
          name: roomName,
          type: 'group'
        });
        
        const newRoom = {
          ...response.room,
          id: response.room._id
        };
        
        setChatRooms(prev => [...prev, newRoom]);
        setActiveRoomId(newRoom._id);
      } catch (error) {
        console.error('Failed to create room:', error);
        alert('Failed to create room');
      }
    }
  };

  const handleRoomSelect = (roomId: string) => {
    if (activeRoomId) {
      leaveRoom(activeRoomId);
    }
    setActiveRoomId(roomId);
    if (isMobile) {
      setShowSidebar(false);
    }
  };

  const handleUpdateRoom = async (roomId: string, updates: Partial<ChatRoom>) => {
    try {
      const response = await apiService.updateRoom(roomId, updates);
      setChatRooms(prev => prev.map(room => 
        room._id === roomId 
          ? { ...response.room, id: response.room._id }
          : room
      ));
    } catch (error) {
      console.error('Failed to update room:', error);
      alert('Failed to update room');
    }
  };

  const handleLeaveRoom = async (roomId: string) => {
    try {
      await apiService.leaveRoom(roomId);
      setChatRooms(prev => prev.filter(room => room._id !== roomId));
      if (activeRoomId === roomId) {
        const remainingRooms = chatRooms.filter(room => room._id !== roomId);
        setActiveRoomId(remainingRooms.length > 0 ? remainingRooms[0]._id : null);
      }
    } catch (error) {
      console.error('Failed to leave room:', error);
      alert('Failed to leave room');
    }
  };

  const handleLogout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      apiService.removeToken();
      setToken(null);
      setCurrentUser(null);
      setChatRooms([]);
      setActiveRoomId(null);
      setRoomMessages({});
      setIsAuthModalOpen(true);
    }
  };

  const activeRoom = chatRooms.find(room => room._id === activeRoomId) || null;
  const currentRoomMessages = activeRoomId ? (roomMessages[activeRoomId] || []) : [];
  const currentTypingUsers = typingUsers.filter(t => t.roomId === activeRoomId);

  if (isAuthModalOpen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <AuthModal onLogin={handleLogin} isDarkMode={isDarkMode} />
      </div>
    );
  }

  return (
    <div className={`h-screen flex ${isDarkMode ? 'dark' : ''}`}>
      <div className="flex w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        {/* Mobile Menu Button */}
        {isMobile && (
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="fixed top-4 left-4 z-50 p-2 bg-blue-500 text-white rounded-lg shadow-lg md:hidden"
          >
            ☰
          </button>
        )}

        {/* Sidebar */}
        <div className={`${
          isMobile 
            ? `fixed inset-y-0 left-0 z-40 transform ${showSidebar ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`
            : 'relative'
        }`}>
          {showSidebar && (
            <Sidebar
              currentUser={currentUser}
              chatRooms={chatRooms}
              activeRoom={activeRoomId}
              onRoomSelect={handleRoomSelect}
              onCreateRoom={handleCreateRoom}
              onLogout={handleLogout}
              isDarkMode={isDarkMode}
              onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            />
          )}
        </div>

        {/* Overlay for mobile */}
        {isMobile && showSidebar && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setShowSidebar(false)}
          />
        )}
        
        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <ChatArea
            currentUser={currentUser}
            activeRoom={activeRoom}
            messages={currentRoomMessages}
            typingUsers={currentTypingUsers}
            onSendMessage={handleSendMessage}
            onStartTyping={handleStartTyping}
            onStopTyping={handleStopTyping}
            onUpdateRoom={handleUpdateRoom}
            onLeaveRoom={handleLeaveRoom}
            onReactToMessage={reactToMessage}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>

      {/* Connection Status */}
      <div className={`fixed bottom-4 right-4 px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 z-50 ${
        isConnected 
          ? 'bg-green-100 text-green-700 border border-green-300' 
          : 'bg-red-100 text-red-700 border border-red-300'
      }`}>
        {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
      </div>
    </div>
  );
}

export default App;