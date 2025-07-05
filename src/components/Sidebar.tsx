import React, { useState } from 'react';
import { 
  MessageCircle, 
  Users, 
  Search, 
  Plus, 
  Settings, 
  Moon, 
  Sun,
  Hash,
  User,
  Bell,
  LogOut,
  X
} from 'lucide-react';
import { ChatRoom, User as UserType } from '../types';
import { ProfileModal } from './ProfileModal';
import { SettingsModal } from './SettingsModal';

interface SidebarProps {
  currentUser: UserType | null;
  chatRooms: ChatRoom[];
  activeRoom: string | null;
  onRoomSelect: (roomId: string) => void;
  onCreateRoom: () => void;
  onLogout: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentUser,
  chatRooms,
  activeRoom,
  onRoomSelect,
  onCreateRoom,
  onLogout,
  isDarkMode,
  onToggleDarkMode
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'rooms' | 'direct'>('rooms');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(true);

  const filteredRooms = chatRooms.filter(room => 
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (activeTab === 'rooms' ? room.type === 'group' : room.type === 'direct')
  );

  const handleUpdateProfile = (updates: Partial<UserType>) => {
    console.log('Profile updates:', updates);
    // Implement profile update logic
  };

  const formatLastMessage = (room: ChatRoom) => {
    if (!room.lastMessage) return 'No messages yet';
    
    const content = room.lastMessage.content;
    if (room.lastMessage.type === 'file') {
      return `📎 ${room.lastMessage.fileName || 'File'}`;
    }
    if (room.lastMessage.type === 'image') {
      return '🖼️ Image';
    }
    return content.length > 30 ? `${content.substring(0, 30)}...` : content;
  };

  return (
    <>
      <div className={`w-full sm:w-80 border-r ${isDarkMode ? 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700' : 'bg-white border-gray-200'} flex flex-col h-full`}>
        {/* Header */}
        <div className={`p-3 sm:p-4 border-b ${isDarkMode ? 'border-gray-200 dark:border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h1 className={`text-lg sm:text-xl font-bold ${isDarkMode ? 'text-gray-900 dark:text-white' : 'text-gray-900'}`}>
              ChatApp
            </h1>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <div className="relative">
                <button
                  onClick={() => setHasNotifications(false)}
                  className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 ${
                    isDarkMode 
                      ? 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 hover:scale-105' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:scale-105'
                  }`}
                >
                  <Bell size={14} />
                </button>
                {hasNotifications && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                )}
              </div>
              <button
                onClick={onToggleDarkMode}
                className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 ${
                  isDarkMode 
                    ? 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 hover:scale-105' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:scale-105'
                }`}
              >
                {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
              </button>
              <button 
                onClick={() => setIsSettingsModalOpen(true)}
                className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 ${
                  isDarkMode 
                    ? 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 hover:scale-105' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:scale-105'
                }`}
              >
                <Settings size={14} />
              </button>
              <button 
                onClick={onLogout}
                className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 ${
                  isDarkMode 
                    ? 'bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 hover:scale-105' 
                    : 'bg-red-100 hover:bg-red-200 text-red-600 hover:scale-105'
                }`}
              >
                <LogOut size={14} />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-3 sm:mb-4">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
              isDarkMode ? 'text-gray-400 dark:text-gray-500' : 'text-gray-400'
            }`} size={16} />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-9 sm:pl-10 pr-4 py-2 rounded-lg border text-sm ${
                isDarkMode 
                  ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400' 
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          {/* Tabs */}
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('rooms')}
              className={`flex-1 px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-1 ${
                activeTab === 'rooms'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : isDarkMode
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Users size={14} />
              <span className="hidden sm:inline">Rooms</span>
            </button>
            <button
              onClick={() => setActiveTab('direct')}
              className={`flex-1 px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-1 ${
                activeTab === 'direct'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : isDarkMode
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <MessageCircle size={14} />
              <span className="hidden sm:inline">Direct</span>
            </button>
          </div>
        </div>

        {/* Room List */}
        <div className="flex-1 overflow-y-auto p-2">
          <div className="flex items-center justify-between mb-2 px-2">
            <h3 className={`text-xs sm:text-sm font-medium ${isDarkMode ? 'text-gray-600 dark:text-gray-300' : 'text-gray-600'}`}>
              {activeTab === 'rooms' ? 'Chat Rooms' : 'Direct Messages'}
            </h3>
            <button
              onClick={onCreateRoom}
              className={`p-1 rounded transition-all duration-200 ${
                isDarkMode ? 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-105' : 'text-gray-500 hover:bg-gray-100 hover:scale-105'
              }`}
            >
              <Plus size={14} />
            </button>
          </div>

          <div className="space-y-1">
            {filteredRooms.map((room) => (
              <button
                key={room._id}
                onClick={() => onRoomSelect(room._id)}
                className={`w-full text-left p-2 sm:p-3 rounded-lg transition-all duration-200 ${
                  activeRoom === room._id
                    ? 'bg-blue-500 text-white shadow-sm'
                    : isDarkMode
                      ? 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                      : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs sm:text-sm font-medium ${
                    room.type === 'group' 
                      ? activeRoom === room._id 
                        ? 'bg-blue-400 text-white' 
                        : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                      : activeRoom === room._id 
                        ? 'bg-green-400 text-white' 
                        : 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                  }`}>
                    {room.type === 'group' ? <Hash size={14} /> : <User size={14} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate text-sm sm:text-base">{room.name}</div>
                    <div className={`text-xs truncate ${
                      activeRoom === room._id ? 'text-blue-100' : isDarkMode ? 'text-gray-500 dark:text-gray-400' : 'text-gray-500'
                    }`}>
                      {formatLastMessage(room)}
                    </div>
                  </div>
                  {room.participants.length > 1 && (
                    <div className={`text-xs px-1.5 py-0.5 rounded-full ${
                      activeRoom === room._id 
                        ? 'bg-blue-400 text-white' 
                        : isDarkMode 
                          ? 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300' 
                          : 'bg-gray-200 text-gray-600'
                    }`}>
                      {room.participants.length}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* User Profile */}
        {currentUser && (
          <div className={`p-3 sm:p-4 border-t ${isDarkMode ? 'border-gray-200 dark:border-gray-700' : 'border-gray-200'}`}>
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className={`w-full flex items-center space-x-2 sm:space-x-3 p-2 rounded-lg transition-all duration-200 ${
                isDarkMode ? 'hover:bg-gray-100 dark:hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm sm:text-base">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className={`font-medium truncate text-sm sm:text-base ${isDarkMode ? 'text-gray-900 dark:text-white' : 'text-gray-900'}`}>
                  {currentUser.name}
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-500 dark:text-gray-400' : 'text-gray-500'}`}>
                    Online
                  </span>
                </div>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      {currentUser && (
        <>
          <ProfileModal
            user={currentUser}
            isOpen={isProfileModalOpen}
            onClose={() => setIsProfileModalOpen(false)}
            onUpdateProfile={handleUpdateProfile}
            isDarkMode={isDarkMode}
          />
          <SettingsModal
            isOpen={isSettingsModalOpen}
            onClose={() => setIsSettingsModalOpen(false)}
            isDarkMode={isDarkMode}
            onToggleDarkMode={onToggleDarkMode}
          />
        </>
      )}
    </>
  );
};