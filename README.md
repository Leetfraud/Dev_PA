# DevProfile Analyzer

> Full-Stack GitHub Portfolio Intelligence Platform

Transform GitHub profiles into actionable insights with portfolio scoring, repository analytics, profile comparison, and AI-powered improvement suggestions.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- [GitHub Personal Access Token](https://github.com/settings/tokens)
- OpenAI API Key (optional, for AI suggestions)

### Installation

```bash
# 1. Install frontend dependencies
cd frontend
npm install

# 2. Install backend dependencies
cd ../backend
npm install
```

### Configuration

```bash
# Backend configuration
cd backend
cp .env.example .env
# Edit .env with your credentials
```

**Backend `.env`:**
```env
MONGODB_URI=mongodb://localhost:27017/devprofile-analyzer
GITHUB_TOKEN=ghp_your_token_here
OPENAI_API_KEY=sk_your_key_here  # Optional
PORT=5000
FRONTEND_URL=http://localhost:5173
```

**Frontend `.env`** (optional):
```env
VITE_API_URL=http://localhost:5000/api
```

### Run

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Visit **http://localhost:5173**

## � Project Structure

```
Dev_PA-main/
├── frontend/              # React + Vite + Tailwind
│   ├── src/
│   ├── package.json
│   └── README.md
├── backend/               # Node.js + Express + MongoDB
│   ├── src/
│   ├── package.json
│   └── README.md
└── README.md             # This file
```

## ✨ Features

### Frontend
- 📊 Portfolio analytics dashboard with scoring (0-100)
- 🏆 Repository ranking and analytics
- � Language distribution charts
- 🔄 Profile comparison tool
- 💡 AI-powered improvement suggestions
- 🎨 Modern, responsive UI

### Backend
- 🔌 RESTful API (6 endpoints)
- 💾 Smart caching (24-hour MongoDB cache)
- 🤖 AI suggestions (OpenAI + fallback mode)
- 📊 Multi-dimensional scoring algorithm
- 🔒 Rate limiting & security
- ⚡ Sub-200ms cached responses

## � API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/profile/:username` | GET | Get profile analytics |
| `/api/compare` | GET | Compare two profiles |
| `/api/suggestions/:username` | GET | Get AI suggestions |
| `/api/history` | GET | Search history |
| `/api/rate-limit` | GET | GitHub API status |
| `/health` | GET | Server health |

See [backend/README.md](backend/README.md) for detailed API documentation.

## � Technology Stack

**Frontend:**
- React 18, Vite, Tailwind CSS
- Chart.js, Axios, React Router

**Backend:**
- Node.js, Express, MongoDB
- Mongoose, OpenAI API, GitHub API

## 🚢 Deployment

### Backend (Railway/Render/Heroku)

1. Create MongoDB Atlas cluster
2. Deploy backend to Railway/Render
3. Set environment variables
4. Get backend URL

### Frontend (Vercel/Netlify)

1. Deploy frontend to Vercel
2. Set `VITE_API_URL` to backend URL
3. Get frontend URL

### Environment Variables

**Backend (Production):**
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
GITHUB_TOKEN=ghp_...
OPENAI_API_KEY=sk_...
FRONTEND_URL=https://your-frontend.vercel.app
```

**Frontend (Production):**
```env
VITE_API_URL=https://your-backend.railway.app/api
```

## 📚 Documentation

- **[frontend/README.md](frontend/README.md)** - Frontend documentation
- **[backend/README.md](backend/README.md)** - Backend API documentation
- **[backend/SETUP.md](backend/SETUP.md)** - Detailed backend setup
- **[backend/ARCHITECTURE.md](backend/ARCHITECTURE.md)** - System architecture
- **[backend/FEATURES.md](backend/FEATURES.md)** - Feature details

## 🧪 Testing

```bash
# Backend
cd backend
npm run check    # Verify setup
npm test         # Test API endpoints

# Frontend
cd frontend
npm run dev      # Development server
npm run build    # Production build
```

## 🔐 Security

- ✅ API keys in environment variables
- ✅ Rate limiting (100 req/15min)
- ✅ CORS protection
- ✅ Input validation
- ✅ Helmet security headers

## 📊 Performance

- Cached responses: < 200ms
- Fresh profiles: < 3.5s
- 24-hour smart caching
- GitHub API: 5,000 req/hour (authenticated)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Troubleshooting

**MongoDB connection failed:**
- Check MongoDB is running or Atlas connection string is correct

**GitHub token invalid:**
- Generate new token at https://github.com/settings/tokens
- Scopes needed: `public_repo`, `read:user`

**Port already in use:**
- Change `PORT` in backend `.env`

**CORS errors:**
- Verify `FRONTEND_URL` in backend `.env` matches frontend URL

## 🎯 What's Next?

1. ✅ Complete setup and test locally
2. 🔗 Integrate frontend with backend API
3. 🚀 Deploy to production
4. 🎨 Customize branding and features
5. 📈 Monitor and optimize

---

**Built with ❤️ using React, Node.js, MongoDB, and AI**
