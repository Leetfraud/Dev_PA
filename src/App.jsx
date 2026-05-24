import { useState } from "react";
import LoginPage from "./screens/LoginPage";
import Dashboard from "./screens/Dashboard";
import RepoAnalytics from "./screens/RepoAnalytics";
import ProfileComparison from "./screens/ProfileComparison";
import ImprovementSuggestions from "./screens/ImprovementSuggestions";
import Sidebar from "./components/Sidebar";

const SCREENS = {
  LOGIN: "login",
  DASHBOARD: "dashboard",
  REPOS: "repos",
  COMPARE: "compare",
  SUGGESTIONS: "suggestions",
};

const mockUser = {
  login: "torvalds",
  name: "Linus Torvalds",
  avatar_url: "https://avatars.githubusercontent.com/u/1024025?v=4",
  bio: "Creator of Linux and Git. Software engineer at Linux Foundation.",
  location: "Portland, OR",
  public_repos: 8,
  followers: 218000,
  following: 0,
  total_stars: 24300,
  total_forks: 5900,
  portfolio_score: 94,
  languages: [
    { name: "C", pct: 68, color: "#555599" },
    { name: "Shell", pct: 14, color: "#22D3EE" },
    { name: "Python", pct: 8, color: "#F59E0B" },
    { name: "Makefile", pct: 6, color: "#10B981" },
    { name: "Other", pct: 4, color: "#A855F7" },
  ],
};

export default function App() {
  const [screen, setScreen] = useState(SCREENS.LOGIN);
  const [user] = useState(mockUser);

  if (screen === SCREENS.LOGIN) {
    return <LoginPage onLogin={() => setScreen(SCREENS.DASHBOARD)} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 font-mono overflow-hidden">
      <Sidebar active={screen} onNavigate={setScreen} screens={SCREENS} />
      <main className="flex-1 overflow-y-auto">
        {screen === SCREENS.DASHBOARD && <Dashboard user={user} onNavigate={setScreen} screens={SCREENS} />}
        {screen === SCREENS.REPOS && <RepoAnalytics />}
        {screen === SCREENS.COMPARE && <ProfileComparison />}
        {screen === SCREENS.SUGGESTIONS && <ImprovementSuggestions />}
      </main>
    </div>
  );
}
