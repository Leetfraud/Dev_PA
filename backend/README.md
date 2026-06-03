# DevProfile Analyzer - Backend API

Backend API for the DevProfile Analyzer platform - GitHub Portfolio Intelligence System.

## 🎯 Features

- **Profile Analysis**: Fetch and analyze GitHub profiles with comprehensive metrics
- **Smart Caching**: 24-hour MongoDB cache to reduce GitHub API calls (NFR-2.2)
- **Portfolio Scoring**: Multi-dimensional scoring algorithm (Activity, Documentation, Popularity, Stack Maturity)
- **Repository Ranking**: Weighted algorithm considering stars, forks, recency, and documentation (FR-1.7, FR-1.8)
- **Profile Comparison**: Side-by-side developer comparison with delta calculations (FR-1.11, FR-1.12)
- **AI Suggestions**: OpenAI-powered improvement recommendations (FR-1.14, FR-1.15, FR-1.16)
- **Rate Limiting**: Protection against abuse with configurable limits
- **Search History**: Track and retrieve recent profile searches

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- MongoDB (local or Atlas)
- GitHub Personal Access Token
- OpenAI API Key (optional, for AI suggestions)

### Installation

```bash
cd backend
npm install
```

### Configuration

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/devprofile-analyzer
GITHUB_TOKEN=your_github_token_here
OPENAI_API_KEY=your_openai_key_here
PROFILE_CACHE_HOURS=24
FRONTEND_URL=http://localhost:5173
```

### Run

```bash
# Development
npm run dev

# Production
npm start
```

## 📡 API Endpoints

### Profile Analysis

**GET** `/api/profile/:username`
- Fetches and analyzes a GitHub profile
- Returns cached data if available (< 24 hours old)
- Query params: `?force=true` to bypass cache

**Response:**
```json
{
  "success": true,
  "data": {
    "username": "torvalds",
    "githubData": { ... },
    "repositories": [ ... ],
    "analytics": {
      "portfolio_score": 94,
      "activity_score": 85,
      "documentation_score": 78,
      "popularity_score": 92,
      "stack_maturity_score": 88,
      "total_stars": 24300,
      "total_forks": 5900,
      "primary_stack": "systems",
      "languages": { ... },
      "top_repositories": [ ... ]
    }
  },
  "cached": false,
  "responseTime": "2847ms"
}
```

### Profile Comparison

**GET** `/api/compare?usernameA=user1&usernameB=user2`
- Compares two GitHub profiles
- Both profiles must be fetched first

**Response:**
```json
{
  "success": true,
  "data": {
    "profileA": { ... },
    "profileB": { ... },
    "comparison": {
      "deltas": {
        "portfolio_score": 13,
        "total_stars": 20400,
        "followers": 205200
      },
      "winner": {
        "portfolio_score": "A",
        "total_stars": "A"
      },
      "overall_winner": "A"
    }
  }
}
```

### AI Suggestions

**GET** `/api/suggestions/:username`
- Generates 3-5 AI-powered improvement suggestions
- Rate limited to 10 requests per 15 minutes

**Response:**
```json
{
  "success": true,
  "data": {
    "username": "torvalds",
    "current_score": 94,
    "potential_score": 100,
    "suggestions": [
      {
        "category": "Documentation",
        "priority": "high",
        "title": "Add README files to 5 repositories",
        "defect": "5 repositories lack README.md files",
        "solution": "Create comprehensive README files...",
        "impact": "+12 score points"
      }
    ]
  }
}
```

### Search History

**GET** `/api/history?limit=10`
- Returns recent profile searches

### Rate Limit Status

**GET** `/api/rate-limit`
- Check GitHub API rate limit status

### Health Check

**GET** `/health`
- Server health status

## 🏗️ Architecture

```
backend/
├── src/
│   ├── config/
│   │   ├── env.js              # Environment configuration
│   │   └── database.js         # MongoDB connection
│   ├── models/
│   │   ├── Profile.js          # Profile schema with 24h cache
│   │   └── SearchHistory.js    # Search tracking
│   ├── services/
│   │   ├── githubService.js    # GitHub API integration
│   │   ├── analyticsService.js # Scoring algorithms
│   │   └── aiService.js        # OpenAI integration
│   ├── controllers/
│   │   └── profileController.js # Request handlers
│   ├── routes/
│   │   └── profileRoutes.js    # API routes
│   ├── middleware/
│   │   ├── errorHandler.js     # Error handling
│   │   ├── rateLimiter.js      # Rate limiting
│   │   └── cache.js            # In-memory caching
│   └── server.js               # Entry point
├── .env.example
├── package.json
└── README.md
```

## 📊 Scoring Algorithm

### Portfolio Score (0-100)

Weighted combination of four domains:

1. **Activity Score (25%)**: Commit frequency and recency
2. **Documentation Score (25%)**: README, descriptions, licenses
3. **Popularity Score (30%)**: Stars, forks, followers
4. **Stack Maturity Score (20%)**: Language diversity and modernity

### Repository Ranking

Weighted formula (FR-1.8):
- Stars: 40%
- Forks: 30%
- Recency: 20%
- Documentation: 10%

## 🔒 Security

- API keys stored in environment variables (NFR-2.4)
- Helmet.js for HTTP headers
- CORS configured for frontend origin
- Rate limiting on all endpoints
- Input validation and sanitization

## ⚡ Performance

- **Cached responses**: < 200ms (NFR-2.1)
- **Fresh profiles**: < 3.5s (NFR-2.1)
- **24-hour cache**: Reduces GitHub API calls (NFR-2.2)
- **Authenticated GitHub API**: 5,000 req/hour (NFR-2.3)
- **In-memory caching**: Fast repeated requests
- **Compression**: Reduced payload sizes

## 🛠️ Technologies

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **APIs**: GitHub REST API, OpenAI API
- **Caching**: node-cache + MongoDB
- **Security**: Helmet, CORS, Rate Limiting

## 📝 Requirements Mapping

| Requirement | Implementation |
|-------------|----------------|
| FR-1.1 | Username validation in `getProfile` |
| FR-1.2 | GitHub API validation via `githubService` |
| FR-1.4 | Analytics aggregation in `analyticsService` |
| FR-1.7-1.8 | Repository ranking algorithm |
| FR-1.9-1.10 | Portfolio scoring system |
| FR-1.11-1.13 | Profile comparison endpoint |
| FR-1.14-1.16 | AI suggestions via OpenAI |
| NFR-2.1 | Response time optimization |
| NFR-2.2 | 24-hour MongoDB caching |
| NFR-2.3 | Authenticated GitHub API |
| NFR-2.4 | Secure environment variables |

## 🐛 Error Handling

All errors return consistent format:

```json
{
  "success": false,
  "error": "Error Type",
  "message": "Human-readable message"
}
```

## 📄 License

MIT
