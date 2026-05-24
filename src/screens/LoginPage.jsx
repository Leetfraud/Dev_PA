import { useState, useEffect } from "react";
import { Github, Search, ArrowRight, Code2, Star, GitFork, AlertCircle, Loader } from "lucide-react";

export default function LoginPage({ onLogin, onUseMockData, error, loading }) {
  const [username, setUsername] = useState("");
  const [mode, setMode] = useState("search");
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    const history = localStorage.getItem("github_search_history");
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  const handleSearch = () => {
    if (!username.trim()) return;
    const history = [username, ...searchHistory.filter((u) => u !== username)].slice(0, 10);
    setSearchHistory(history);
    localStorage.setItem("github_search_history", JSON.stringify(history));
    onLogin(username);
  };

  const handleQuickSearch = (u) => {
    setUsername(u);
    onLogin(u);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "linear-gradient(248deg,#0b8868 0%,#323c4d 85%)" }}
    >
      {/* Decorative grid */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Floating accent blobs */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 rounded-full opacity-20 blur-3xl" style={{ background: "#0b8868" }} />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full opacity-15 blur-3xl" style={{ background: "#323c4d" }} />

      {/* Floating stats decorations */}
      <div className="absolute top-12 left-12 hidden lg:flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2 text-white/70 text-xs">
        <Star size={12} className="text-amber-400" />
        <span>24.3k stars analyzed</span>
      </div>
      <div className="absolute bottom-16 right-16 hidden lg:flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2 text-white/70 text-xs">
        <GitFork size={12} className="text-cyan-400" />
        <span>5.9k repos ranked</span>
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm">
        {/* Logo mark */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-2xl"
            style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", backdropFilter: "blur(12px)" }}
          >
            <Code2 size={28} color="white" />
          </div>
          <h1 className="text-white font-bold text-2xl tracking-tight">DevProfile Analyzer</h1>
          <p className="text-white/60 text-xs mt-1 tracking-wider uppercase">GitHub Portfolio Intelligence</p>
        </div>

        <div
          className="rounded-2xl p-6 shadow-2xl"
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.15)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Mode toggle */}
          <div className="flex rounded-lg overflow-hidden border border-white/20 mb-6">
            {[
              { id: "search", label: "Search Profile" },
              { id: "oauth", label: "GitHub OAuth" },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setMode(id)}
                className={`flex-1 py-2 text-xs font-semibold tracking-wide transition-all duration-150 ${
                  mode === id ? "bg-white/20 text-white" : "text-white/50 hover:text-white/80"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {mode === "search" ? (
            <div className="space-y-3">
              <label className="text-white/70 text-xs tracking-wider uppercase block">GitHub Username</label>

              {error && (
                <div className="flex items-start gap-2 bg-red-500/20 border border-red-500/40 rounded-lg p-3">
                  <AlertCircle size={14} className="text-red-400 mt-0.5 shrink-0" />
                  <span className="text-xs text-red-200">{error}</span>
                </div>
              )}

              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="e.g. torvalds"
                  disabled={loading}
                  className="w-full bg-white/10 border border-white/20 rounded-lg pl-9 pr-4 py-2.5 text-white placeholder-white/30 text-sm outline-none focus:border-emerald-400/60 focus:bg-white/15 transition-all disabled:opacity-50"
                />
              </div>

              <button
                onClick={handleSearch}
                disabled={loading || !username.trim()}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-white font-semibold text-sm tracking-wide transition-all duration-150 hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: "#0b8868" }}
              >
                {loading ? (
                  <>
                    <Loader size={15} className="animate-spin" /> Loading...
                  </>
                ) : (
                  <>
                    Analyze Profile <ArrowRight size={15} />
                  </>
                )}
              </button>

              <button
                onClick={onUseMockData}
                disabled={loading}
                className="w-full py-2 rounded-lg text-white/80 hover:text-white text-xs font-medium transition-colors hover:bg-white/10 disabled:opacity-50"
              >
                Try Demo (Linus Torvalds)
              </button>

              {searchHistory.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-white/20">
                  <p className="text-white/50 text-xs uppercase tracking-wide">Recent Searches</p>
                  <div className="flex flex-wrap gap-2">
                    {searchHistory.map((u) => (
                      <button
                        key={u}
                        onClick={() => handleQuickSearch(u)}
                        disabled={loading}
                        className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-medium transition-colors disabled:opacity-50"
                      >
                        @{u}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-white/60 text-xs text-center">Authenticate with your GitHub account to analyze your own profile.</p>
              <button
                disabled={loading}
                className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white font-semibold text-sm tracking-wide hover:bg-white/20 transition-all duration-150 disabled:opacity-50"
              >
                <Github size={17} />
                Continue with GitHub
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-white/30 text-xs mt-5">
          AI-powered analysis · No data stored · Open source
        </p>
      </div>
    </div>
  );
}
