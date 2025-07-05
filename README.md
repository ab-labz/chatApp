# 🚀 Real-time Chat Application

A modern, full-featured real-time chat application built with React, Node.js, Socket.IO, and MongoDB.

![Chat App Preview](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=Real-time+Chat+App)

## ✨ Features

- **Real-time Messaging** - Instant message delivery with Socket.IO
- **User Authentication** - Secure login/register with JWT tokens
- **Multiple Chat Rooms** - Create and join different chat rooms
- **Message Reactions** - React to messages with emojis
- **Typing Indicators** - See when others are typing
- **File Sharing** - Upload and share files/images
- **Dark/Light Mode** - Toggle between themes
- **Responsive Design** - Works on desktop and mobile
- **Online Status** - See who's online in real-time
- **Message History** - Persistent message storage
- **Quick Demo Login** - Try the app instantly

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Socket.IO Client** for real-time communication
- **Lucide React** for icons
- **Vite** for fast development

### Backend
- **Node.js** with Express
- **Socket.IO** for real-time features
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Cloudinary** for file uploads

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB database (local or cloud)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/chat-app.git
cd chat-app
```

### 2. Install Dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd server
npm install
```

### 3. Environment Setup

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

**Backend (server/.env):**
```env
MONGODB_URI=mongodb+srv://abdullahdaniyal:superflies1234@cluster0.s5b7diq.mongodb.net/chatApp
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5000
NODE_ENV=development
```

### 4. Start the Application

**Start Backend (Terminal 1):**
```bash
cd server
npm start
```

**Start Frontend (Terminal 2):**
```bash
npm run dev
```

The app will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## 📱 Usage

1. **Quick Demo**: Use the demo login buttons for instant access
2. **Register**: Create a new account with email/password
3. **Join Rooms**: Browse and join existing chat rooms
4. **Create Rooms**: Start your own chat room
5. **Chat**: Send messages, react with emojis, share files
6. **Customize**: Toggle dark mode, update profile

## 🌐 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically

### Backend (Railway/Heroku)
1. Create account on Railway or Heroku
2. Connect GitHub repository
3. Set environment variables
4. Deploy with one click

### Local Development with ngrok
```bash
# Start backend
cd server && npm start

# In another terminal, expose backend
ngrok http 5000

# Update frontend .env with ngrok URL
VITE_API_URL=https://your-ngrok-url.ngrok.io/api
VITE_SOCKET_URL=https://your-ngrok-url.ngrok.io
```

## 📁 Project Structure

```
chat-app/
├── src/                    # Frontend source
│   ├── components/         # React components
│   ├── hooks/             # Custom hooks
│   ├── services/          # API services
│   ├── types/             # TypeScript types
│   └── utils/             # Utility functions
├── server/                # Backend source
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Express middleware
│   ├── socket/            # Socket.IO handlers
│   └── server.js          # Main server file
└── public/                # Static assets
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/quick-login` - Demo login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Rooms
- `GET /api/rooms` - Get user's rooms
- `POST /api/rooms` - Create new room
- `GET /api/rooms/:id` - Get room details
- `PUT /api/rooms/:id` - Update room
- `POST /api/rooms/:id/join` - Join room
- `POST /api/rooms/:id/leave` - Leave room

### Messages
- `GET /api/messages/room/:roomId` - Get room messages
- `POST /api/messages` - Send message
- `PUT /api/messages/:id` - Edit message
- `DELETE /api/messages/:id` - Delete message
- `POST /api/messages/:id/react` - React to message

## 🎯 Socket Events

### Client → Server
- `join-room` - Join a chat room
- `leave-room` - Leave a chat room
- `send-message` - Send a message
- `typing-start` - Start typing indicator
- `typing-stop` - Stop typing indicator
- `react-to-message` - Add/remove reaction

### Server → Client
- `new-message` - New message received
- `user-typing` - User started typing
- `user-stopped-typing` - User stopped typing
- `message-reaction-updated` - Message reaction changed
- `room-updated` - Room information updated

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcryptjs
- Rate limiting on API endpoints
- CORS protection
- Input validation and sanitization
- Helmet.js security headers

## 🎨 Customization

### Themes
The app supports dark and light themes. Customize colors in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#eff6ff',
        500: '#3b82f6',
        900: '#1e3a8a',
      }
    }
  }
}
```

### Components
All components are modular and can be easily customized. Key components:
- `AuthModal` - Login/register interface
- `Sidebar` - Room list and navigation
- `ChatArea` - Main chat interface
- `MessageBubble` - Individual message display

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Socket.IO](https://socket.io/) for real-time communication
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Lucide](https://lucide.dev/) for beautiful icons
- [MongoDB](https://www.mongodb.com/) for database
- [Vercel](https://vercel.com/) for hosting

## 📞 Support

If you have any questions or need help, please:
1. Check the [Issues](https://github.com/yourusername/chat-app/issues) page
2. Create a new issue if needed
3. Join our [Discord community](https://discord.gg/your-invite)

---

**Made with ❤️ by [Your Name](https://github.com/yourusername)**

⭐ Star this repo if you found it helpful!