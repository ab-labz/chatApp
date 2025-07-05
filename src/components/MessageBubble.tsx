import React, { useState } from 'react';
import { formatTime } from '../utils/dateUtils';
import { 
  MoreHorizontal, 
  Smile, 
  Reply, 
  Copy, 
  Trash2,
  Edit,
  Download,
  FileText,
  Image as ImageIcon,
  Check,
  CheckCheck
} from 'lucide-react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  onReact: (messageId: string, emoji: string) => void;
  isDarkMode: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwn,
  onReact,
  isDarkMode
}) => {
  const [showActions, setShowActions] = useState(false);
  const [showReactions, setShowReactions] = useState(false);

  const messageId = message._id || message.id;
  const timestamp = message.createdAt ? new Date(message.createdAt) : message.timestamp;
  const senderName = message.sender?.name || message.senderName;

  const renderFilePreview = () => {
    if (message.type === 'image' || (message.type === 'file' && message.fileUrl && message.fileName?.match(/\.(jpg|jpeg|png|gif|webp)$/i))) {
      return (
        <div className="relative group max-w-xs sm:max-w-sm">
          <img
            src={message.fileUrl}
            alt={message.fileName}
            className="w-full rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => window.open(message.fileUrl, '_blank')}
          />
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="bg-black bg-opacity-50 rounded-full p-1.5 hover:bg-opacity-70 transition-all">
              <Download size={14} className="text-white" />
            </button>
          </div>
        </div>
      );
    }

    if (message.type === 'file') {
      return (
        <div className={`flex items-center space-x-3 p-3 rounded-lg border max-w-xs sm:max-w-sm ${
          isDarkMode ? 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600' : 'bg-gray-50 border-gray-200'
        }`}>
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            isDarkMode ? 'bg-gray-200 dark:bg-gray-600' : 'bg-gray-200'
          }`}>
            <FileText size={20} className={isDarkMode ? 'text-gray-600 dark:text-gray-300' : 'text-gray-600'} />
          </div>
          <div className="flex-1 min-w-0">
            <div className={`font-medium truncate text-sm ${isDarkMode ? 'text-gray-900 dark:text-white' : 'text-gray-900'}`}>
              {message.fileName}
            </div>
            <div className={`text-xs ${isDarkMode ? 'text-gray-500 dark:text-gray-400' : 'text-gray-500'}`}>
              {message.fileSize ? `${(message.fileSize / 1024).toFixed(1)} KB` : 'Unknown size'}
            </div>
          </div>
          <button className={`p-2 rounded-lg transition-all duration-200 ${
            isDarkMode 
              ? 'hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 hover:scale-105' 
              : 'hover:bg-gray-200 text-gray-600 hover:scale-105'
          }`}>
            <Download size={16} />
          </button>
        </div>
      );
    }

    return null;
  };

  const reactions = message.reactions || [];
  const hasReactions = reactions.length > 0;

  const handleReaction = (emoji: string) => {
    onReact(messageId, emoji);
    setShowReactions(false);
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} group px-2 sm:px-0`}>
      <div className={`max-w-[85%] sm:max-w-xs lg:max-w-md ${isOwn ? 'order-2' : 'order-1'}`}>
        {/* Avatar and name for received messages */}
        {!isOwn && (
          <div className="flex items-center space-x-2 mb-1 px-1">
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
              {senderName.charAt(0).toUpperCase()}
            </div>
            <span className={`text-xs sm:text-sm font-medium ${isDarkMode ? 'text-gray-600 dark:text-gray-300' : 'text-gray-600'}`}>
              {senderName}
            </span>
          </div>
        )}

        {/* Message bubble */}
        <div
          className={`relative px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl shadow-sm ${
            isOwn
              ? 'bg-blue-500 text-white'
              : isDarkMode
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                : 'bg-gray-100 text-gray-900'
          } ${
            isOwn ? 'rounded-br-sm' : 'rounded-bl-sm'
          }`}
          onMouseEnter={() => setShowActions(true)}
          onMouseLeave={() => setShowActions(false)}
        >
          {/* File preview */}
          {(message.type === 'file' || message.type === 'image') && (
            <div className="mb-2">
              {renderFilePreview()}
            </div>
          )}

          {/* Message content */}
          {message.content && (
            <div className="whitespace-pre-wrap break-words text-sm sm:text-base">
              {message.content}
            </div>
          )}

          {/* Timestamp and status */}
          <div className={`flex items-center justify-between mt-1 space-x-2`}>
            <div className={`text-xs ${
              isOwn ? 'text-blue-100' : isDarkMode ? 'text-gray-500 dark:text-gray-400' : 'text-gray-500'
            }`}>
              {formatTime(timestamp)}
              {message.isEdited && (
                <span className="ml-1 italic">(edited)</span>
              )}
            </div>
            {isOwn && (
              <div className="flex items-center space-x-1">
                <CheckCheck size={14} className="text-blue-200" />
              </div>
            )}
          </div>

          {/* Action buttons */}
          {showActions && (
            <div className={`absolute ${isOwn ? 'left-0' : 'right-0'} top-0 transform ${
              isOwn ? '-translate-x-full' : 'translate-x-full'
            } flex items-center space-x-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10`}>
              <button
                onClick={() => setShowReactions(!showReactions)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-300 transition-all hover:scale-105"
              >
                <Smile size={14} />
              </button>
              <button 
                onClick={() => console.log('Reply to message')}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-300 transition-all hover:scale-105"
              >
                <Reply size={14} />
              </button>
              <button 
                onClick={() => navigator.clipboard.writeText(message.content)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-300 transition-all hover:scale-105"
              >
                <Copy size={14} />
              </button>
              {isOwn && (
                <>
                  <button 
                    onClick={() => console.log('Edit message')}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-300 transition-all hover:scale-105"
                  >
                    <Edit size={14} />
                  </button>
                  <button 
                    onClick={() => console.log('Delete message')}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-red-600 transition-all hover:scale-105"
                  >
                    <Trash2 size={14} />
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Reactions */}
        {hasReactions && (
          <div className="flex flex-wrap gap-1 mt-2 px-1">
            {reactions.map((reaction, index) => (
              <button
                key={index}
                onClick={() => handleReaction(reaction.emoji)}
                className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs transition-all hover:scale-105 ${
                  reaction.users.some(u => u._id === message.sender._id)
                    ? 'bg-blue-100 text-blue-700 border border-blue-300 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-600'
                    : isDarkMode
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
                      : 'bg-gray-100 text-gray-600 border border-gray-200'
                } hover:bg-opacity-80`}
              >
                <span>{reaction.emoji}</span>
                <span>{reaction.users.length}</span>
              </button>
            ))}
          </div>
        )}

        {/* Reaction picker */}
        {showReactions && (
          <div className="absolute z-20 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 flex space-x-1">
            {['👍', '❤️', '😂', '😮', '😢', '😡'].map((emoji) => (
              <button
                key={emoji}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-lg transition-all hover:scale-110"
                onClick={() => handleReaction(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};