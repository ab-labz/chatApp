# 🚀 Deployment Guide

This guide will help you deploy your chat application to production.

## 📋 Prerequisites

- GitHub account
- Vercel account (for frontend)
- Railway/Heroku account (for backend)
- MongoDB Atlas account (for database)

## 🗄️ Database Setup (MongoDB Atlas)

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for a free account

2. **Create a Cluster**
   - Choose the free tier (M0)
   - Select your preferred region
   - Create cluster

3. **Setup Database Access**
   - Go to Database Access
   - Add a new database user
   - Choose password authentication
   - Save username and password

4. **Setup Network Access**
   - Go to Network Access
   - Add IP Address: `0.0.0.0/0` (allow from anywhere)
   - Or add specific IPs for better security

5. **Get Connection String**
   - Go to Clusters → Connect
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

## 🖥️ Backend Deployment (Railway)

1. **Create Railway Account**
   - Go to [Railway](https://railway.app)
   - Sign up with GitHub

2. **Deploy from GitHub**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Select the `server` folder as root

3. **Set Environment Variables**
   ```env
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET=your-super-secret-jwt-key
   PORT=5000
   NODE_ENV=production
   ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
   ```

4. **Deploy**
   - Railway will automatically deploy
   - Note your backend URL (e.g., `https://your-app.railway.app`)

## 🌐 Frontend Deployment (Vercel)

1. **Create Vercel Account**
   - Go to [Vercel](https://vercel.com)
   - Sign up with GitHub

2. **Import Project**
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will detect it's a Vite project

3. **Set Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add:
     ```env
     VITE_API_URL=https://your-railway-app.railway.app/api
     VITE_SOCKET_URL=https://your-railway-app.railway.app
     ```

4. **Deploy**
   - Click "Deploy"
   - Your app will be live at `https://your-app.vercel.app`

## 🔧 Alternative: Local Development with ngrok

For testing with a public URL:

1. **Install ngrok**
   ```bash
   npm install -g ngrok
   ```

2. **Start your backend**
   ```bash
   cd server
   npm start
   ```

3. **Expose backend with ngrok**
   ```bash
   ngrok http 5000
   ```

4. **Update frontend environment**
   ```env
   VITE_API_URL=https://your-ngrok-url.ngrok.io/api
   VITE_SOCKET_URL=https://your-ngrok-url.ngrok.io
   ```

5. **Start frontend**
   ```bash
   npm run dev
   ```

## 🔒 Security Checklist

- [ ] Use strong JWT secret (32+ characters)
- [ ] Set proper CORS origins
- [ ] Use HTTPS in production
- [ ] Secure MongoDB with proper user access
- [ ] Enable rate limiting
- [ ] Validate all inputs
- [ ] Use environment variables for secrets

## 🐛 Troubleshooting

### Common Issues:

1. **CORS Errors**
   - Check ALLOWED_ORIGINS in backend
   - Ensure frontend URL is included

2. **Database Connection Failed**
   - Verify MongoDB connection string
   - Check network access settings
   - Ensure database user has proper permissions

3. **Socket.IO Connection Issues**
   - Verify VITE_SOCKET_URL is correct
   - Check if backend is running
   - Ensure WebSocket support is enabled

4. **Build Failures**
   - Check all environment variables are set
   - Verify all dependencies are installed
   - Check for TypeScript errors

### Debug Commands:

```bash
# Check backend health
curl https://your-backend-url.com/api/health

# Check frontend build
npm run build

# Test socket connection
# Use browser dev tools → Network → WS tab
```

## 📊 Monitoring

### Backend Monitoring:
- Railway provides built-in metrics
- Monitor CPU, memory, and response times
- Set up alerts for downtime

### Frontend Monitoring:
- Vercel provides analytics
- Monitor page load times
- Track user interactions

## 🔄 CI/CD Setup

### Automatic Deployments:

1. **Backend (Railway)**
   - Automatically deploys on push to main branch
   - Configure branch in Railway settings

2. **Frontend (Vercel)**
   - Automatically deploys on push to main branch
   - Preview deployments for pull requests

### GitHub Actions (Optional):

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run lint
      - run: npm run build
```

## 📈 Scaling

### Performance Optimization:
- Enable gzip compression
- Use CDN for static assets
- Implement message pagination
- Add database indexing
- Use Redis for session storage

### Horizontal Scaling:
- Use multiple Railway instances
- Implement sticky sessions for Socket.IO
- Use Redis adapter for Socket.IO clustering

---

🎉 **Congratulations!** Your chat app is now live and ready for users!

Need help? Check the main README or create an issue on GitHub.