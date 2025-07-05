import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Paperclip, 
  Smile, 
  MoreVertical, 
  Users,
  Video,
  Phone,
  Search,
  Info,
  UserPlus,
  Pin,
  VolumeX,
  Archive,
  Settings as SettingsIcon,
  X
} from 'lucide-react';
import { Message, User, ChatRoom, TypingIndicator } from '../types';
import { MessageBubble } from './MessageBubble';
import { FileUpload } from './FileUpload';
import { RoomInfoModal } from './RoomInfoModal';

interface ChatAreaProps {
  currentUser: User | null;
  activeRoom: ChatRoom | null;
  messages: Message[];
  typingUsers: TypingIndicator[];
  onSendMessage: (content: string, type: 'text' | 'file', fileData?: any) => void;
  onStartTyping: () => void;
  onStopTyping: () => void;
  onUpdateRoom: (roomId: string, updates: Partial<ChatRoom>) => void;
  onLeaveRoom: (roomId: string) => void;
  onReactToMessage: (messageId: string, emoji: string) => void;
  isDarkMode: boolean;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  currentUser,
  activeRoom,
  messages,
  typingUsers,
  onSendMessage,
  onStartTyping,
  onStopTyping,
  onUpdateRoom,
  onLeaveRoom,
  onReactToMessage,
  isDarkMode
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [isFileUploadOpen, setIsFileUploadOpen] = useState(false);
  const [showRoomMenu, setShowRoomMenu] = useState(false);
  const [showRoomInfo, setShowRoomInfo] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [roomSettings, setRoomSettings] = useState({
    isPinned: false,
    isMuted: false,
    isArchived: false
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() && currentUser) {
      onSendMessage(newMessage.trim(), 'text');
      setNewMessage('');
      onStopTyping();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    
    if (e.target.value.trim()) {
      onStartTyping();
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      typingTimeoutRef.current = setTimeout(() => {
        onStopTyping();
      }, 1000);
    } else {
      onStopTyping();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = (fileData: any) => {
    onSendMessage(fileData.name, 'file', fileData);
    setIsFileUploadOpen(false);
  };

  const handleRoomAction = (action: string) => {
    setShowRoomMenu(false);
    
    switch (action) {
      case 'info':
        setShowRoomInfo(true);
        break;
      case 'add-members':
        console.log('Add members functionality - would open member invitation modal');
        break;
      case 'pin':
        setRoomSettings(prev => ({ ...prev, isPinned: !prev.isPinned }));
        console.log('Room pinned:', !roomSettings.isPinned);
        break;
      case 'mute':
        setRoomSettings(prev => ({ ...prev, isMuted: !prev.isMuted }));
        console.log('Room muted:', !roomSettings.isMuted);
        break;
      case 'archive':
        setRoomSettings(prev => ({ ...prev, isArchived: !prev.isArchived }));
        console.log('Room archived:', !roomSettings.isArchived);
        break;
      case 'settings':
        console.log('Room settings - would open room settings modal');
        break;
      default:
        console.log(`Room action: ${action}`);
    }
  };

  const handleHeaderClick = () => {
    setShowRoomInfo(true);
  };

  const handleUpdateRoom = (updates: Partial<ChatRoom>) => {
    if (activeRoom) {
      onUpdateRoom(activeRoom._id, updates);
    }
  };

  const handleLeaveRoom = () => {
    if (activeRoom) {
      onLeaveRoom(activeRoom._id);
      setShowRoomInfo(false);
    }
  };

  if (!activeRoom) {
    return (
      <div className={`flex-1 flex items-center justify-center p-4 ${
        isDarkMode ? 'bg-gray-50 dark:bg-gray-800' : 'bg-gray-50'
      }`}>
        <div className="text-center max-w-sm mx-auto">
          <div className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full ${
            isDarkMode ? 'bg-gray-200 dark:bg-gray-700' : 'bg-gray-200'
          } flex items-center justify-center`}>
            <Users className={`${isDarkMode ? 'text-gray-500 dark:text-gray-400' : 'text-gray-500'}`} size={32} />
          </div>
          <h3 className={`text-lg sm:text-xl font-medium mb-2 ${
            isDarkMode ? 'text-gray-700 dark:text-gray-300' : 'text-gray-700'
          }`}>
            Select a conversation
          </h3>
          <p className={`text-sm sm:text-base ${isDarkMode ? 'text-gray-500 dark:text-gray-400' : 'text-gray-500'}`}>
            Choose a chat room or start a direct message to begin
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex-1 flex flex-col ${isDarkMode ? 'bg-white dark:bg-gray-800' : 'bg-white'}`}>
      {/* Header */}
      <div className={`p-3 sm:p-4 border-b ${isDarkMode ? 'border-gray-200 dark:border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
        <button 
          onClick={handleHeaderClick}
          className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg p-2 -m-2 transition-colors"
        >
          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${
            activeRoom.type === 'group' 
              ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
              : 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
          } flex items-center justify-center font-semibold text-sm sm:text-base`}>
            {activeRoom.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <div className="flex items-center space-x-2">
              <h2 className={`font-semibold text-sm sm:text-base truncate ${isDarkMode ? 'text-gray-900 dark:text-white' : 'text-gray-900'}`}>
                {activeRoom.name}
              </h2>
              {roomSettings.isPinned && (
                <Pin size={14} className="text-blue-500 flex-shrink-0" />
              )}
              {roomSettings.isMuted && (
                <VolumeX size={14} className="text-gray-500 flex-shrink-0" />
              )}
            </div>
            <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-500 dark:text-gray-400' : 'text-gray-500'} truncate`}>
              {activeRoom.type === 'group' 
                ? `${activeRoom.participants.length} members` 
                : 'Direct message'
              }
              {activeRoom.description && ` • ${activeRoom.description}`}
            </p>
          </div>
        </button>
        
        <div className="flex items-center space-x-1 sm:space-x-2">
          <button 
            onClick={() => setShowSearch(!showSearch)}
            className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 ${
              isDarkMode 
                ? 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 hover:scale-105' 
                : 'hover:bg-gray-100 text-gray-600 hover:scale-105'
            }`}
          >
            <Search size={16} className="sm:w-5 sm:h-5" />
          </button>
          <button 
            onClick={() => console.log('Start voice call')}
            className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 ${
              isDarkMode 
                ? 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 hover:scale-105' 
                : 'hover:bg-gray-100 text-gray-600 hover:scale-105'
            }`}
          >
            <Phone size={16} className="sm:w-5 sm:h-5" />
          </button>
          <button 
            onClick={() => console.log('Start video call')}
            className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 ${
              isDarkMode 
                ? 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 hover:scale-105' 
                : 'hover:bg-gray-100 text-gray-600 hover:scale-105'
            }`}
          >
            <Video size={16} className="sm:w-5 sm:h-5" />
          </button>
          <div className="relative">
            <button 
              onClick={() => setShowRoomMenu(!showRoomMenu)}
              className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 ${
                isDarkMode 
                  ? 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 hover:scale-105' 
                  : 'hover:bg-gray-100 text-gray-600 hover:scale-105'
              }`}
            >
              <MoreVertical size={16} className="sm:w-5 sm:h-5" />
            </button>
            
            {showRoomMenu && (
              <div className={`absolute right-0 top-full mt-2 w-48 rounded-lg shadow-lg border z-50 ${
                isDarkMode ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <div className="py-1">
                  <button
                    onClick={() => handleRoomAction('info')}
                    className={`w-full px-4 py-2 text-left text-sm flex items-center space-x-3 transition-colors ${
                      isDarkMode ? 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300' : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <Info size={16} />
                    <span>Room Info</span>
                  </button>
                  <button
                    onClick={() => handleRoomAction('add-members')}
                    className={`w-full px-4 py-2 text-left text-sm flex items-center space-x-3 transition-colors ${
                      isDarkMode ? 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300' : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <UserPlus size={16} />
                    <span>Add Members</span>
                  </button>
                  <button
                    onClick={() => handleRoomAction('pin')}
                    className={`w-full px-4 py-2 text-left text-sm flex items-center space-x-3 transition-colors ${
                      isDarkMode ? 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300' : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <Pin size={16} />
                    <span>{roomSettings.isPinned ? 'Unpin' : 'Pin'} Conversation</span>
                  </button>
                  <button
                    onClick={() => handleRoomAction('mute')}
                    className={`w-full px-4 py-2 text-left text-sm flex items-center space-x-3 transition-colors ${
                      isDarkMode ? 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300' : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <VolumeX size={16} />
                    <span>{roomSettings.isMuted ? 'Unmute' : 'Mute'} Notifications</span>
                  </button>
                  <button
                    onClick={() => handleRoomAction('archive')}
                    className={`w-full px-4 py-2 text-left text-sm flex items-center space-x-3 transition-colors ${
                      isDarkMode ? 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300' : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <Archive size={16} />
                    <span>{roomSettings.isArchived ? 'Unarchive' : 'Archive'}</span>
                  </button>
                  <hr className={`my-1 ${isDarkMode ? 'border-gray-200 dark:border-gray-600' : 'border-gray-200'}`} />
                  <button
                    onClick={() => handleRoomAction('settings')}
                    className={`w-full px-4 py-2 text-left text-sm flex items-center space-x-3 transition-colors ${
                      isDarkMode ? 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300' : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <SettingsIcon size={16} />
                    <span>Settings</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className={`p-3 sm:p-4 border-b ${isDarkMode ? 'border-gray-200 dark:border-gray-700' : 'border-gray-200'}`}>
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
              isDarkMode ? 'text-gray-400 dark:text-gray-500' : 'text-gray-400'
            }`} size={16} />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-10 py-2 rounded-lg border text-sm ${
                isDarkMode 
                  ? 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400' 
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <button
              onClick={() => setShowSearch(false)}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                isDarkMode ? 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
        {messages.map((message) => (
          <MessageBubble
            key={message._id || message.id}
            message={message}
            isOwn={message.sender._id === currentUser?._id || message.senderId === currentUser?._id}
            onReact={onReactToMessage}
            isDarkMode={isDarkMode}
          />
        ))}
        
        {/* Typing Indicators */}
        {typingUsers.length > 0 && (
          <div className={`flex items-center space-x-2 px-3 sm:px-4 py-2 ${
            isDarkMode ? 'text-gray-500 dark:text-gray-400' : 'text-gray-500'
          }`}>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
            <span className="text-xs sm:text-sm">
              {typingUsers.map(t => t.userName).join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
            </span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className={`p-3 sm:p-4 border-t ${isDarkMode ? 'border-gray-200 dark:border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsFileUploadOpen(true)}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isDarkMode 
                ? 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 hover:scale-105' 
                : 'hover:bg-gray-100 text-gray-600 hover:scale-105'
            }`}
          >
            <Paperclip size={18} className="sm:w-5 sm:h-5" />
          </button>
          
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border text-sm sm:text-base ${
                isDarkMode 
                  ? 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400' 
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
          
          <button 
            onClick={() => console.log('Emoji picker')}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isDarkMode 
                ? 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 hover:scale-105' 
                : 'hover:bg-gray-100 text-gray-600 hover:scale-105'
            }`}
          >
            <Smile size={18} className="sm:w-5 sm:h-5" />
          </button>
          
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className={`p-2 rounded-lg transition-all duration-200 ${
              newMessage.trim()
                ? 'bg-blue-500 hover:bg-blue-600 text-white hover:scale-105 shadow-sm'
                : isDarkMode
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Send size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* File Upload Modal */}
      {isFileUploadOpen && (
        <FileUpload
          onClose={() => setIsFileUploadOpen(false)}
          onUpload={handleFileUpload}
          isDarkMode={isDarkMode}
        />
      )}

      {/* Room Info Modal */}
      {showRoomInfo && currentUser && (
        <RoomInfoModal
          room={activeRoom}
          currentUser={currentUser}
          isOpen={showRoomInfo}
          onClose={() => setShowRoomInfo(false)}
          onUpdateRoom={handleUpdateRoom}
          onLeaveRoom={handleLeaveRoom}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
};