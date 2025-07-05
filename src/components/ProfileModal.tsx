import React, { useState } from 'react';
import { formatRelativeTime } from '../utils/dateUtils';
import { 
  X, 
  Camera, 
  Edit3, 
  Mail, 
  Calendar,
  Clock,
  User as UserIcon
} from 'lucide-react';
import { User } from '../types';

interface ProfileModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onUpdateProfile: (updates: Partial<User>) => void;
  isDarkMode: boolean;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  user,
  isOpen,
  onClose,
  onUpdateProfile,
  isDarkMode
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user.name);
  const [editedEmail, setEditedEmail] = useState(user.email);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  if (!isOpen) return null;

  const handleSave = () => {
    const updates: Partial<User> = {};
    
    if (editedName !== user.name) {
      updates.name = editedName;
    }
    
    if (editedEmail !== user.email) {
      updates.email = editedEmail;
    }
    
    if (avatarFile) {
      // In a real app, you'd upload the file and get a URL
      updates.avatar = URL.createObjectURL(avatarFile);
    }
    
    onUpdateProfile(updates);
    setIsEditing(false);
    setAvatarFile(null);
  };

  const handleCancel = () => {
    setEditedName(user.name);
    setEditedEmail(user.email);
    setAvatarFile(null);
    setIsEditing(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const getAvatarSrc = () => {
    if (avatarFile) {
      return URL.createObjectURL(avatarFile);
    }
    return user.avatar;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-md rounded-xl shadow-2xl ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      } overflow-hidden`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="text-center">
            <div className="relative inline-block mb-4">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-white bg-opacity-20 flex items-center justify-center">
                {getAvatarSrc() ? (
                  <img
                    src={getAvatarSrc()}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserIcon size={40} className="text-white" />
                )}
              </div>
              
              {isEditing && (
                <label className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
                  <Camera size={16} className="text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            
            <h2 className="text-xl font-bold">{user.name}</h2>
            <div className="flex items-center justify-center space-x-2 mt-2">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <span className="text-blue-100 text-sm">Online</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Display Name
                </label>
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-gray-50 border-gray-200 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={editedEmail}
                  onChange={(e) => setEditedEmail(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-gray-50 border-gray-200 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleCancel}
                  className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                    isDarkMode 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
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
              <div className="flex items-center justify-between">
                <h3 className={`text-lg font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Profile Information
                </h3>
                <button
                  onClick={() => setIsEditing(true)}
                  className={`p-2 rounded-lg transition-colors ${
                    isDarkMode 
                      ? 'hover:bg-gray-700 text-gray-300' 
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <Edit3 size={16} />
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <UserIcon size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
                  <div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Display Name
                    </div>
                    <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {user.name}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
                  <div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Email Address
                    </div>
                    <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {user.email}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
                  <div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Member Since
                    </div>
                    <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {new Date().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Clock size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
                  <div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Last Active
                    </div>
                    <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {formatRelativeTime(user.lastSeen)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};