import { useState, useEffect } from "react";
import Landing from "./pages/Landing";
import LoginPage from "./screens/LoginPage";
import Dashboard from "./screens/Dashboard";
import RepoAnalytics from "./screens/RepoAnalytics";
import ProfileComparison from "./screens/ProfileComparison";
import ImprovementSuggestions from "./screens/ImprovementSuggestions";
import Sidebar from "./components/Sidebar";
import { githubApi } from "./services/githubApi";
import { calculatePortfolioScore } from "./utils/calculations";
import { SAMPLE_USER, SAMPLE_REPOS } from "./data/mockData";

const SCREENS = {
  LANDING: "landing",
  LOGIN: "login",
  DASHBOARD: "dashboard",
  REPOS: "repos",
  COMPARE: "compare",
  SUGGESTIONS: "suggestions",
};

export default function App() {
  const [screen, setScreen] = useState(SCREENS.LANDING);
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGetStarted = () => {
    setScreen(SCREENS.LOGIN);
  };

  const handleSearch = async (username) => {
    setLoading(true);
    setError(null);
    try {
      const userData = await githubApi.getUser(username);
      const reposData = await githubApi.getUserRepos(username);

      const stats = githubApi.calculateStats(userData, reposData);
      const score = githubApi.calculatePortfolioScore(userData, reposData);

      setUser({
        ...userData,
        ...stats,
        portfolio_score: score,
      });
      setRepos(reposData);
      setScreen(SCREENS.DASHBOARD);
    } catch (err) {
      setError(err.message || "Failed to fetch user data. Please try again.");
      setScreen(SCREENS.LOGIN);
    } finally {
      setLoading(false);
    }
  };

  const handleUseMockData = () => {
    const score = calculatePortfolioScore(SAMPLE_USER, SAMPLE_REPOS);
    setUser({
      ...SAMPLE_USER,
      portfolio_score: score,
      total_stars: SAMPLE_REPOS.reduce((acc, r) => acc + r.stargazers_count, 0),
      total_forks: SAMPLE_REPOS.reduce((acc, r) => acc + r.forks_count, 0),
    });
    setRepos(SAMPLE_REPOS);
    setScreen(SCREENS.DASHBOARD);
  };

  const handleLogout = () => {
    setUser(null);
    setRepos([]);
    setScreen(SCREENS.LANDING);
  };

  if (screen === SCREENS.LANDING) {
    return <Landing onGetStarted={handleGetStarted} />;
  }

  if (screen === SCREENS.LOGIN) {
    return (
      <LoginPage
        onLogin={handleSearch}
        onUseMockData={handleUseMockData}
        error={error}
        loading={loading}
      />
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 font-mono overflow-hidden">
      <Sidebar
        active={screen}
        onNavigate={setScreen}
        screens={SCREENS}
        onLogout={handleLogout}
      />
      <main className="flex-1 overflow-y-auto">
        {screen === SCREENS.DASHBOARD && user && (
          <Dashboard
            user={user}
            repos={repos}
            onNavigate={setScreen}
            screens={SCREENS}
          />
        )}
        {screen === SCREENS.REPOS && <RepoAnalytics repos={repos} user={user} />}
        {screen === SCREENS.COMPARE && (
          <ProfileComparison onSearchProfile={handleSearch} />
        )}
        {screen === SCREENS.SUGGESTIONS && (
          <ImprovementSuggestions user={user} repos={repos} />
        )}
      </main>
    </div>
  );
}
