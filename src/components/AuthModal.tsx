import React, { useState } from 'react';
import { MessageCircle, User, Mail, ArrowRight, Lock } from 'lucide-react';

interface AuthModalProps {
  onLogin: (userData: { name: string; email: string; password?: string }, isQuickLogin?: boolean) => void;
  isDarkMode: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onLogin, isDarkMode }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim() || (!isLoginMode && !name.trim())) return;

    setIsLoading(true);
    
    try {
      await onLogin({ 
        name: name.trim(), 
        email: email.trim(), 
        password: password.trim() 
      }, false);
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (userData: { name: string; email: string }) => {
    setIsLoading(true);
    try {
      await onLogin(userData, true);
    } catch (error) {
      console.error('Quick login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 sm:p-6">
      <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      } overflow-hidden`}>
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 sm:p-8 text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <MessageCircle size={24} className="sm:w-8 sm:h-8 text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">
            {isLoginMode ? 'Welcome Back' : 'Join ChatApp'}
          </h1>
          <p className="text-blue-100 text-sm">
            {isLoginMode ? 'Sign in to continue chatting' : 'Create your account to get started'}
          </p>
        </div>

        <div className="p-6 sm:p-8">
          {/* Toggle Login/Register */}
          <div className="flex mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setIsLoginMode(true)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                isLoginMode
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLoginMode(false)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                !isLoginMode
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {!isLoginMode && (
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Display Name
                </label>
                <div className="relative">
                  <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`} size={16} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className={`w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 rounded-lg border transition-colors text-sm sm:text-base ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
                    required={!isLoginMode}
                  />
                </div>
              </div>
            )}

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Email Address
              </label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`} size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className={`w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 rounded-lg border transition-colors text-sm sm:text-base ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
                  required
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Password
              </label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`} size={16} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 rounded-lg border transition-colors text-sm sm:text-base ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email.trim() || !password.trim() || (!isLoginMode && !name.trim())}
              className={`w-full py-2.5 sm:py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base ${
                isLoading || !email.trim() || !password.trim() || (!isLoginMode && !name.trim())
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 shadow-lg hover:shadow-xl'
              }`}
            >
              {isLoading ? (
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>{isLoginMode ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Quick Login Options */}
          <div className="mt-6 sm:mt-8">
            <div className={`text-center text-sm font-medium mb-3 sm:mb-4 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Or try a demo account
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <button
                onClick={() => handleQuickLogin({ name: 'Alex Thompson', email: 'alex@example.com' })}
                disabled={isLoading}
                className={`p-2.5 sm:p-3 rounded-lg border text-xs sm:text-sm font-medium transition-all hover:scale-105 ${
                  isDarkMode 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Demo User 1
              </button>
              <button
                onClick={() => handleQuickLogin({ name: 'Sarah Johnson', email: 'sarah@example.com' })}
                disabled={isLoading}
                className={`p-2.5 sm:p-3 rounded-lg border text-xs sm:text-sm font-medium transition-all hover:scale-105 ${
                  isDarkMode 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Demo User 2
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};