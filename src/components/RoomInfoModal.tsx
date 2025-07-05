import React, { useState } from 'react';
import { 
  X, 
  Users, 
  Calendar, 
  Hash, 
  Lock, 
  Globe, 
  Crown, 
  UserPlus, 
  UserMinus,
  Settings,
  Edit3,
  Trash2,
  Copy,
  Share2
} from 'lucide-react';
import { ChatRoom, User } from '../types';
import { formatDateTime } from '../utils/dateUtils';

interface RoomInfoModalProps {
  room: ChatRoom;
  currentUser: User;
  isOpen: boolean;
  onClose: () => void;
  onUpdateRoom: (updates: Partial<ChatRoom>) => void;
  onLeaveRoom: () => void;
  isDarkMode: boolean;
}

export const RoomInfoModal: React.FC<RoomInfoModalProps> = ({
  room,
  currentUser,
  isOpen,
  onClose,
  onUpdateRoom,
  onLeaveRoom,
  isDarkMode
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(room.name);
  const [editedDescription, setEditedDescription] = useState(room.description || '');
  const [showMembers, setShowMembers] = useState(true);

  if (!isOpen) return null;

  const isOwner = room.createdBy === currentUser.id;
  const memberCount = room.participants.length;

  const handleSave = () => {
    const updates: Partial<ChatRoom> = {};
    
    if (editedName !== room.name) {
      updates.name = editedName;
    }
    
    if (editedDescription !== room.description) {
      updates.description = editedDescription;
    }
    
    onUpdateRoom(updates);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedName(room.name);
    setEditedDescription(room.description || '');
    setIsEditing(false);
  };

  const copyRoomLink = () => {
    const roomLink = `${window.location.origin}/room/${room.id}`;
    navigator.clipboard.writeText(roomLink);
    // You could add a toast notification here
    console.log('Room link copied to clipboard');
  };

  const shareRoom = () => {
    if (navigator.share) {
      navigator.share({
        title: `Join ${room.name}`,
        text: `Join our chat room: ${room.name}`,
        url: `${window.location.origin}/room/${room.id}`
      });
    } else {
      copyRoomLink();
    }
  };

  // Mock members data - in a real app, you'd fetch this from your backend
  const mockMembers = [
    { id: currentUser.id, name: currentUser.name, email: currentUser.email, isOnline: true, role: isOwner ? 'owner' : 'member' },
    { id: '2', name: 'Sarah Johnson', email: 'sarah@example.com', isOnline: true, role: 'admin' },
    { id: '3', name: 'Mike Chen', email: 'mike@example.com', isOnline: false, role: 'member' },
    { id: '4', name: 'Emma Wilson', email: 'emma@example.com', isOnline: true, role: 'member' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-lg rounded-xl shadow-2xl ${
        isDarkMode ? 'bg-white dark:bg-gray-800' : 'bg-white'
      } overflow-hidden max-h-[90vh] overflow-y-auto`}>
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="text-center">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-2xl font-bold ${
              room.type === 'group' 
                ? 'bg-blue-400 text-white' 
                : 'bg-green-400 text-white'
            }`}>
              {room.type === 'group' ? <Hash size={32} /> : room.name.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-xl font-bold">{room.name}</h2>
            <div className="flex items-center justify-center space-x-2 mt-2">
              <Users size={16} />
              <span className="text-blue-100 text-sm">{memberCount} members</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Room Details */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${
              isDarkMode ? 'text-gray-900 dark:text-white' : 'text-gray-900'
            }`}>
              Room Information
            </h3>
            
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-700 dark:text-gray-300' : 'text-gray-700'
                  }`}>
                    Room Name
                  </label>
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      isDarkMode 
                        ? 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white' 
                        : 'bg-gray-50 border-gray-200 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-700 dark:text-gray-300' : 'text-gray-700'
                  }`}>
                    Description
                  </label>
                  <textarea
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    rows={3}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      isDarkMode 
                        ? 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white' 
                        : 'bg-gray-50 border-gray-200 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Add a description for this room..."
                  />
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={handleCancel}
                    className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                      isDarkMode 
                        ? 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center space-x-3">
                      <Hash size={18} className={isDarkMode ? 'text-gray-500 dark:text-gray-400' : 'text-gray-500'} />
                      <div>
                        <div className={`text-sm ${isDarkMode ? 'text-gray-500 dark:text-gray-400' : 'text-gray-500'}`}>
                          Room Name
                        </div>
                        <div className={`font-medium ${isDarkMode ? 'text-gray-900 dark:text-white' : 'text-gray-900'}`}>
                          {room.name}
                        </div>
                      </div>
                    </div>
                    
                    {room.description && (
                      <div className="flex items-start space-x-3">
                        <Settings size={18} className={`mt-0.5 ${isDarkMode ? 'text-gray-500 dark:text-gray-400' : 'text-gray-500'}`} />
                        <div>
                          <div className={`text-sm ${isDarkMode ? 'text-gray-500 dark:text-gray-400' : 'text-gray-500'}`}>
                            Description
                          </div>
                          <div className={`font-medium ${isDarkMode ? 'text-gray-900 dark:text-white' : 'text-gray-900'}`}>
                            {room.description}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-3">
                      {room.isPrivate ? <Lock size={18} /> : <Globe size={18} />}
                      <div>
                        <div className={`text-sm ${isDarkMode ? 'text-gray-500 dark:text-gray-400' : 'text-gray-500'}`}>
                          Privacy
                        </div>
                        <div className={`font-medium ${isDarkMode ? 'text-gray-900 dark:text-white' : 'text-gray-900'}`}>
                          {room.isPrivate ? 'Private Room' : 'Public Room'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Calendar size={18} className={isDarkMode ? 'text-gray-500 dark:text-gray-400' : 'text-gray-500'} />
                      <div>
                        <div className={`text-sm ${isDarkMode ? 'text-gray-500 dark:text-gray-400' : 'text-gray-500'}`}>
                          Created
                        </div>
                        <div className={`font-medium ${isDarkMode ? 'text-gray-900 dark:text-white' : 'text-gray-900'}`}>
                          {formatDateTime(room.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {isOwner && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className={`p-2 rounded-lg transition-colors ${
                        isDarkMode 
                          ? 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300' 
                          : 'hover:bg-gray-100 text-gray-600'
                      }`}
                    >
                      <Edit3 size={16} />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${
              isDarkMode ? 'text-gray-900 dark:text-white' : 'text-gray-900'
            }`}>
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={copyRoomLink}
                className={`flex items-center space-x-2 p-3 rounded-lg border transition-colors ${
                  isDarkMode 
                    ? 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300' 
                    : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <Copy size={16} />
                <span className="text-sm font-medium">Copy Link</span>
              </button>
              
              <button
                onClick={shareRoom}
                className={`flex items-center space-x-2 p-3 rounded-lg border transition-colors ${
                  isDarkMode 
                    ? 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300' 
                    : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <Share2 size={16} />
                <span className="text-sm font-medium">Share</span>
              </button>
              
              <button
                onClick={() => console.log('Add members')}
                className={`flex items-center space-x-2 p-3 rounded-lg border transition-colors ${
                  isDarkMode 
                    ? 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300' 
                    : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <UserPlus size={16} />
                <span className="text-sm font-medium">Add Members</span>
              </button>
              
              <button
                onClick={() => console.log('Room settings')}
                className={`flex items-center space-x-2 p-3 rounded-lg border transition-colors ${
                  isDarkMode 
                    ? 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300' 
                    : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <Settings size={16} />
                <span className="text-sm font-medium">Settings</span>
              </button>
            </div>
          </div>

          {/* Members */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${
                isDarkMode ? 'text-gray-900 dark:text-white' : 'text-gray-900'
              }`}>
                Members ({memberCount})
              </h3>
              <button
                onClick={() => setShowMembers(!showMembers)}
                className={`text-sm font-medium ${
                  isDarkMode ? 'text-blue-600 dark:text-blue-400' : 'text-blue-600'
                } hover:underline`}
              >
                {showMembers ? 'Hide' : 'Show'}
              </button>
            </div>
            
            {showMembers && (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {mockMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                          member.isOnline ? 'bg-green-500' : 'bg-gray-400'
                        }`}></div>
                      </div>
                      <div>
                        <div className={`font-medium flex items-center space-x-2 ${
                          isDarkMode ? 'text-gray-900 dark:text-white' : 'text-gray-900'
                        }`}>
                          <span>{member.name}</span>
                          {member.role === 'owner' && (
                            <Crown size={14} className="text-yellow-500" />
                          )}
                          {member.role === 'admin' && (
                            <div className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                              Admin
                            </div>
                          )}
                        </div>
                        <div className={`text-sm ${
                          isDarkMode ? 'text-gray-500 dark:text-gray-400' : 'text-gray-500'
                        }`}>
                          {member.email}
                        </div>
                      </div>
                    </div>
                    
                    {isOwner && member.id !== currentUser.id && (
                      <button
                        onClick={() => console.log('Remove member', member.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          isDarkMode 
                            ? 'hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400' 
                            : 'hover:bg-red-50 text-red-600'
                        }`}
                      >
                        <UserMinus size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Danger Zone */}
          {(isOwner || !isOwner) && (
            <div>
              <h3 className={`text-lg font-semibold mb-4 text-red-600 dark:text-red-400`}>
                Danger Zone
              </h3>
              <div className="space-y-3">
                {!isOwner && (
                  <button
                    onClick={onLeaveRoom}
                    className="w-full flex items-center justify-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                  >
                    <UserMinus size={16} />
                    <span>Leave Room</span>
                  </button>
                )}
                
                {isOwner && (
                  <button
                    onClick={() => console.log('Delete room')}
                    className="w-full flex items-center justify-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                  >
                    <Trash2 size={16} />
                    <span>Delete Room</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};