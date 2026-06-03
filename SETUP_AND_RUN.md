# 🚀 Setup and Run Guide

## ✅ Project Status: COMPLETE

Your full-stack DevProfile Analyzer is ready to run!

## 📋 Pre-Run Checklist

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 2: Configure Backend

```bash
# Copy environment template
cp .env.example .env
```

Edit `backend/.env` with your credentials:

```env
# Required
MONGODB_URI=mongodb://localhost:27017/devprofile-analyzer
GITHUB_TOKEN=ghp_your_github_token_here

# Optional (for AI suggestions)
OPENAI_API_KEY=sk_your_openai_key_here

# Default settings
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
PROFILE_CACHE_HOURS=24
```

**Get Credentials:**
- **MongoDB**: 
  - Local: Install and run `mongod`
  - Cloud: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier)
- **GitHub Token**: [github.com/settings/tokens](https://github.com/settings/tokens)
  - Scopes: `public_repo`, `read:user`
- **OpenAI Key** (optional): [platform.openai.com/api-keys](https://platform.openai.com/api-keys)

### Step 3: Verify Backend Setup

```bash
cd backend
npm run check
```

Should see all green checkmarks ✓

### Step 4: Frontend Already Has Dependencies

The frontend already has `node_modules` installed, so you're good to go!

## 🎯 Run the Project

### Option 1: Two Terminals (Recommended)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

You should see:
```
✅ MongoDB Connected
🚀 Server running on port 5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

You should see:
```
Local: http://localhost:5173
```

### Option 2: One Terminal (Windows)

```bash
# Start backend in background
cd backend
start npm run dev

# Start frontend
cd ../frontend
npm run dev
```

## 🌐 Access the Application

1. Open browser: **http://localhost:5173**
2. Click "Get Started"
3. Search for a GitHub username (try "torvalds" or "octocat")
4. Explore the dashboard!

## ✅ Verification Steps

1. **Backend Health Check:**
   ```bash
   curl http://localhost:5000/health
   ```
   Should return: `{"success":true,"message":"DevProfile Analyzer API is running"}`

2. **Test Profile Endpoint:**
   ```bash
   curl http://localhost:5000/api/profile/octocat
   ```
   Should return profile data

3. **Frontend:**
   - Visit http://localhost:5173
   - Should see landing page
   - Search should work

## 🐛 Troubleshooting

### Backend won't start

**"MongoDB connection failed":**
```bash
# Check if MongoDB is running
mongod

# Or use MongoDB Atlas connection string
```

**"GitHub token validation failed":**
- Check token in `.env` is correct
- Generate new token at https://github.com/settings/tokens

**"Port 5000 already in use":**
- Change `PORT=5001` in `.env`
- Update frontend to use new port

### Frontend won't start

**"Port 5173 already in use":**
```bash
# Kill the process or it will use next available port
```

**"Cannot connect to backend":**
- Make sure backend is running on port 5000
- Check browser console for errors

### No data showing

**First search is slow (3-5 seconds):**
- This is normal - fetching from GitHub API
- Second search will be instant (cached)

**"Rate limit exceeded":**
- Make sure `GITHUB_TOKEN` is set in backend `.env`
- Without token: 60 requests/hour
- With token: 5,000 requests/hour

## 📊 What to Test

1. **Search Profile**: Try "torvalds", "gvanrossum", "octocat"
2. **Dashboard**: Check portfolio score, stats, charts
3. **Repository Analytics**: View ranking and charts
4. **Profile Comparison**: Compare two developers
5. **Suggestions**: Get improvement recommendations
6. **Caching**: Search same profile twice (should be instant)

## 🎉 Success Indicators

- ✅ Backend running on port 5000
- ✅ Frontend running on port 5173
- ✅ Can search GitHub profiles
- ✅ Dashboard displays data
- ✅ Charts render correctly
- ✅ Second search is instant (cached)
- ✅ No errors in browser console

## 📝 Quick Commands Reference

```bash
# Backend
cd backend
npm install          # Install dependencies
npm run check        # Verify setup
npm run dev          # Start development server
npm test             # Test API endpoints

# Frontend
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## 🚀 Next Steps After Testing

1. ✅ Verify everything works locally
2. 🔗 Integrate frontend with backend API (optional)
3. 🎨 Customize branding and features
4. 🚢 Deploy to production
5. 📈 Monitor and optimize

---

**Ready to run? Start with Step 1 above!** 🎯
