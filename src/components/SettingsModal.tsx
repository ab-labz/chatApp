import React, { useState } from 'react';
import { 
  X, 
  Moon, 
  Sun, 
  Bell, 
  Shield, 
  Globe, 
  Smartphone, 
  Volume2, 
  Eye, 
  Download,
  Trash2,
  HelpCircle,
  Info
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  isDarkMode,
  onToggleDarkMode
}) => {
  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);
  const [onlineStatus, setOnlineStatus] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-md rounded-xl shadow-2xl ${
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
            <div className="w-16 h-16 mx-auto mb-4 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Shield size={32} className="text-white" />
            </div>
            <h2 className="text-xl font-bold">Settings</h2>
            <p className="text-blue-100 text-sm">Customize your chat experience</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Appearance */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${
              isDarkMode ? 'text-gray-900 dark:text-white' : 'text-gray-900'
            }`}>
              Appearance
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
                  <div>
                    <div className={`font-medium ${isDarkMode ? 'text-gray-900 dark:text-white' : 'text-gray-900'}`}>
                      Dark Mode
                    </div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-500 dark:text-gray-400' : 'text-gray-500'}`}>
                      Switch between light and dark themes
                    </div>
                  </div>
                </div>
                <button
                  onClick={onToggleDarkMode}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isDarkMode ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isDarkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${
              isDarkMode ? 'text-gray-900 dark:text-white' : 'text-gray-900'
            }`}>
              Notifications
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bell size={18} className={isDarkMode ? 'text-gray-600 dark:text-gray-300' : 'text-gray-600'} />
                  <div>
                    <div className={`font-medium ${isDarkMode ? 'text-gray-900 dark:text-white' : 'text-gray-900'}`}>
                      Push Notifications
                    </div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-500 dark:text-gray-400' : 'text-gray-500'}`}>
                      Receive notifications for new messages
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Volume2 size={18} className={isDarkMode ? 'text-gray-600 dark:text-gray-300' : 'text-gray-600'} />
                  <div>
                    <div className={`font-medium ${isDarkMode ? 'text-gray-900 dark:text-white' : 'text-gray-900'}`}>
                      Sound Effects
                    </div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-500 dark:text-gray-400' : 'text-gray-500'}`}>
                      Play sounds for notifications
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    soundEnabled ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      soundEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Privacy */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${
              isDarkMode ? 'text-gray-900 dark:text-white' : 'text-gray-900'
            }`}>
              Privacy
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Eye size={18} className={isDarkMode ? 'text-gray-600 dark:text-gray-300' : 'text-gray-600'} />
                  <div>
                    <div className={`font-medium ${isDarkMode ? 'text-gray-900 dark:text-white' : 'text-gray-900'}`}>
                      Read Receipts
                    </div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-500 dark:text-gray-400' : 'text-gray-500'}`}>
                      Let others know when you've read their messages
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setReadReceipts(!readReceipts)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    readReceipts ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      readReceipts ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Globe size={18} className={isDarkMode ? 'text-gray-600 dark:text-gray-300' : 'text-gray-600'} />
                  <div>
                    <div className={`font-medium ${isDarkMode ? 'text-gray-900 dark:text-white' : 'text-gray-900'}`}>
                      Online Status
                    </div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-500 dark:text-gray-400' : 'text-gray-500'}`}>
                      Show when you're online to others
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setOnlineStatus(!onlineStatus)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    onlineStatus ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      onlineStatus ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Data & Storage */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${
              isDarkMode ? 'text-gray-900 dark:text-white' : 'text-gray-900'
            }`}>
              Data & Storage
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => console.log('Download data')}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300' 
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <Download size={18} />
                <div className="text-left">
                  <div className="font-medium">Download My Data</div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-500 dark:text-gray-400' : 'text-gray-500'}`}>
                    Export your chat history and data
                  </div>
                </div>
              </button>

              <button
                onClick={() => console.log('Clear cache')}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300' 
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <Trash2 size={18} />
                <div className="text-left">
                  <div className="font-medium">Clear Cache</div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-500 dark:text-gray-400' : 'text-gray-500'}`}>
                    Free up storage space
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* About */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${
              isDarkMode ? 'text-gray-900 dark:text-white' : 'text-gray-900'
            }`}>
              About
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => console.log('Help & Support')}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300' 
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <HelpCircle size={18} />
                <div className="text-left">
                  <div className="font-medium">Help & Support</div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-500 dark:text-gray-400' : 'text-gray-500'}`}>
                    Get help and contact support
                  </div>
                </div>
              </button>

              <button
                onClick={() => console.log('App info')}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300' 
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <Info size={18} />
                <div className="text-left">
                  <div className="font-medium">App Information</div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-500 dark:text-gray-400' : 'text-gray-500'}`}>
                    Version 1.0.0 - Terms & Privacy
                  </div>
                </div>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};