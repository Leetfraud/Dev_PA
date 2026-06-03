# DevProfile Analyzer - Frontend

React + Vite + Tailwind CSS frontend for the DevProfile Analyzer platform.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/      # Reusable UI components
│   │   └── Sidebar.jsx
│   ├── screens/         # Page components
│   │   ├── Dashboard.jsx
│   │   ├── RepoAnalytics.jsx
│   │   ├── ProfileComparison.jsx
│   │   ├── ImprovementSuggestions.jsx
│   │   └── LoginPage.jsx
│   ├── pages/
│   │   └── Landing.jsx
│   ├── services/        # API services
│   │   ├── config.js
│   │   ├── githubApi.js
│   │   └── backendApi.js
│   ├── utils/           # Helper functions
│   │   ├── calculations.js
│   │   ├── formatters.js
│   │   └── validators.js
│   ├── data/            # Mock data
│   │   └── mockData.js
│   ├── hooks/           # Custom React hooks
│   │   └── index.js
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
├── postcss.config.js    # PostCSS configuration
└── package.json         # Dependencies
```

## 🔧 Configuration

### Environment Variables

Create `.env` file:

```env
# Backend API URL
VITE_API_URL=http://localhost:5000/api

# For production
# VITE_API_URL=https://your-backend.railway.app/api
```

### Backend Integration

The frontend can work in two modes:

1. **Direct GitHub API** (current default)
2. **Backend API** (recommended for production)

To use the backend API, update `src/App.jsx` to use `backendApi` instead of `githubApi`.

See [../INTEGRATION.md](../INTEGRATION.md) for complete integration guide.

## 🎨 Features

- **Landing Page**: Feature showcase and call-to-action
- **Dashboard**: Portfolio analytics with score and statistics
- **Repository Analytics**: Ranking, charts, and contribution heatmap
- **Profile Comparison**: Side-by-side developer comparison
- **AI Suggestions**: Improvement recommendations
- **Responsive Design**: Works on all devices
- **Modern UI**: Glassmorphism effects and smooth animations

## 🛠️ Technologies

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS
- **Chart.js** - Data visualization
- **Axios** - HTTP client
- **React Router** - Navigation
- **Lucide React** - Icon library

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start dev server on port 5173

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Linting (if configured)
npm run lint         # Run ESLint
```

## 🔗 API Integration

### Using Backend API (Recommended)

```javascript
import { backendApi } from './services/backendApi';

// Get profile
const response = await backendApi.getProfile('username');

// Compare profiles
const comparison = await backendApi.compareProfiles('user1', 'user2');

// Get suggestions
const suggestions = await backendApi.getSuggestions('username');
```

### Using GitHub API Directly

```javascript
import { githubApi } from './services/githubApi';

// Get user
const user = await githubApi.getUser('username');

// Get repositories
const repos = await githubApi.getUserRepos('username');
```

## 🎯 Development Tips

1. **Hot Module Replacement**: Changes reflect instantly
2. **Mock Data**: Use mock data for development without API calls
3. **Component Structure**: Keep components small and focused
4. **Tailwind**: Use utility classes for styling
5. **Charts**: Chart.js instances need cleanup in useEffect

## 🚢 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm run build
# Upload dist/ folder to Netlify
```

### Environment Variables for Production

```env
VITE_API_URL=https://your-backend-api.com/api
```

## 📚 Documentation

- [Complete Project Guide](../COMPLETE_PROJECT_GUIDE.md)
- [Integration Guide](../INTEGRATION.md)
- [Deployment Guide](../DEPLOYMENT.md)
- [Backend API Docs](../backend/README.md)

## 🐛 Troubleshooting

**Port 5173 already in use:**
```bash
# Kill process or change port in vite.config.js
```

**Build fails:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**API calls failing:**
- Check VITE_API_URL in .env
- Verify backend is running
- Check browser console for CORS errors

## 📄 License

MIT
