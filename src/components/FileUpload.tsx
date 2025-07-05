import React, { useState, useRef } from 'react';
import { X, Upload, File, Image as ImageIcon } from 'lucide-react';

interface FileUploadProps {
  onClose: () => void;
  onUpload: (fileData: any) => void;
  isDarkMode: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onClose,
  onUpload,
  isDarkMode
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert('File size must be less than 10MB');
      return;
    }
    setSelectedFile(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    const fileData = {
      name: selectedFile.name,
      size: selectedFile.size,
      type: selectedFile.type,
      url: URL.createObjectURL(selectedFile) // In a real app, this would be uploaded to a server
    };

    onUpload(fileData);
  };

  const isImage = selectedFile?.type.startsWith('image/');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-md rounded-lg shadow-xl ${
        isDarkMode ? 'bg-white dark:bg-gray-800' : 'bg-white'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${
          isDarkMode ? 'border-gray-200 dark:border-gray-700' : 'border-gray-200'
        }`}>
          <h3 className={`text-lg font-semibold ${
            isDarkMode ? 'text-gray-900 dark:text-white' : 'text-gray-900'
          }`}>
            Upload File
          </h3>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isDarkMode 
                ? 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 hover:scale-105' 
                : 'hover:bg-gray-100 text-gray-600 hover:scale-105'
            }`}
          >
            <X size={18} />
          </button>
        </div>

        {/* Upload Area */}
        <div className="p-4">
          {!selectedFile ? (
            <div
              className={`border-2 border-dashed rounded-lg p-6 sm:p-8 text-center transition-colors ${
                dragActive
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : isDarkMode
                    ? 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'
                    : 'border-gray-300 bg-gray-50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full ${
                isDarkMode ? 'bg-gray-200 dark:bg-gray-600' : 'bg-gray-200'
              } flex items-center justify-center`}>
                <Upload className={isDarkMode ? 'text-gray-500 dark:text-gray-300' : 'text-gray-500'} size={32} />
              </div>
              <p className={`text-base sm:text-lg font-medium mb-2 ${
                isDarkMode ? 'text-gray-900 dark:text-white' : 'text-gray-900'
              }`}>
                Drop your file here
              </p>
              <p className={`text-sm mb-3 sm:mb-4 ${
                isDarkMode ? 'text-gray-500 dark:text-gray-400' : 'text-gray-500'
              }`}>
                or click to browse
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 hover:scale-105 text-sm sm:text-base"
              >
                Choose File
              </button>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileInputChange}
                className="hidden"
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
              />
            </div>
          ) : (
            <div className="space-y-4">
              {/* File Preview */}
              <div className={`p-4 rounded-lg border ${
                isDarkMode ? 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center ${
                    isDarkMode ? 'bg-gray-200 dark:bg-gray-600' : 'bg-gray-200'
                  }`}>
                    {isImage ? (
                      <ImageIcon size={20} className={`sm:w-6 sm:h-6 ${isDarkMode ? 'text-gray-600 dark:text-gray-300' : 'text-gray-600'}`} />
                    ) : (
                      <File size={20} className={`sm:w-6 sm:h-6 ${isDarkMode ? 'text-gray-600 dark:text-gray-300' : 'text-gray-600'}`} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium truncate text-sm sm:text-base ${isDarkMode ? 'text-gray-900 dark:text-white' : 'text-gray-900'}`}>
                      {selectedFile.name}
                    </div>
                    <div className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-500 dark:text-gray-400' : 'text-gray-500'}`}>
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </div>
                  </div>
                </div>
              </div>

              {/* Image Preview */}
              {isImage && (
                <div className="flex justify-center">
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Preview"
                    className="max-w-full max-h-32 sm:max-h-48 rounded-lg"
                  />
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedFile(null)}
                  className={`flex-1 px-4 py-2 rounded-lg border transition-all duration-200 text-sm sm:text-base ${
                    isDarkMode 
                      ? 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 hover:scale-105 text-sm sm:text-base"
                >
                  Upload
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};