import { useState } from "react";
import { Search, Star, GitFork, Users, BookOpen, Trophy, Minus } from "lucide-react";

const profileA = {
  login: "torvalds",
  name: "Linus Torvalds",
  avatar_url: "https://avatars.githubusercontent.com/u/1024025?v=4",
  bio: "Creator of Linux and Git.",
  public_repos: 8,
  followers: 218000,
  following: 0,
  total_stars: 24300,
  total_forks: 5900,
  portfolio_score: 94,
  top_lang: "C",
};

const profileB = {
  login: "gvanrossum",
  name: "Guido van Rossum",
  avatar_url: "https://avatars.githubusercontent.com/u/2894642?v=4",
  bio: "Python creator. Retired Benevolent Dictator For Life.",
  public_repos: 38,
  followers: 12800,
  following: 16,
  total_stars: 3900,
  total_forks: 720,
  portfolio_score: 81,
  top_lang: "Python",
};

const metrics = [
  { key: "portfolio_score", label: "Portfolio Score", icon: Trophy, fmt: (v) => v + "/100" },
  { key: "total_stars", label: "Total Stars", icon: Star, fmt: (v) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v },
  { key: "total_forks", label: "Total Forks", icon: GitFork, fmt: (v) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v },
  { key: "followers", label: "Followers", icon: Users, fmt: (v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v },
  { key: "public_repos", label: "Repositories", icon: BookOpen, fmt: (v) => v },
];

function ProfileHeader({ profile, side }) {
  return (
    <div className="flex flex-col items-center text-center">
      <img
        src={profile.avatar_url}
        alt={profile.name}
        className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg object-cover mb-3"
      />
      <div className="font-bold text-slate-800 text-base">{profile.name}</div>
      <div className="text-xs text-slate-500 mt-0.5">@{profile.login}</div>
      <p className="text-xs text-slate-400 mt-2 max-w-[180px] leading-relaxed">{profile.bio}</p>
      <div
        className="mt-3 text-xs font-semibold px-3 py-1 rounded-full border"
        style={{ color: "#22D3EE", borderColor: "#22D3EE40", background: "#22D3EE0A" }}
      >
        {profile.top_lang}
      </div>
    </div>
  );
}

function MetricRow({ metric, a, b }) {
  const { key, label, icon: Icon, fmt } = metric;
  const valA = a[key];
  const valB = b[key];
  const aWins = valA > valB;
  const bWins = valB > valA;
  const tie = valA === valB;

  return (
    <div className="flex items-center gap-3 py-3 border-b border-slate-50 last:border-0">
      {/* A value */}
      <div
        className={`flex-1 text-right font-bold text-sm transition-all rounded-lg px-2 py-1 ${
          aWins ? "text-cyan-600 bg-cyan-50" : "text-slate-500"
        }`}
      >
        {fmt(valA)}
        {aWins && <span className="ml-1 text-xs">▲</span>}
      </div>

      {/* Center label */}
      <div className="flex flex-col items-center gap-1 w-28 shrink-0">
        <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center">
          <Icon size={12} className="text-slate-500" />
        </div>
        <span className="text-slate-400 text-xs text-center leading-tight">{label}</span>
        {tie && <Minus size={10} className="text-slate-300" />}
      </div>

      {/* B value */}
      <div
        className={`flex-1 text-left font-bold text-sm transition-all rounded-lg px-2 py-1 ${
          bWins ? "text-cyan-600 bg-cyan-50" : "text-slate-500"
        }`}
      >
        {fmt(valB)}
        {bWins && <span className="ml-1 text-xs">▲</span>}
      </div>
    </div>
  );
}

export default function ProfileComparison({ onSearchProfile }) {
  const [searchB, setSearchB] = useState("");

  const aScore = metrics.filter((m) => profileA[m.key] > profileB[m.key]).length;
  const bScore = metrics.filter((m) => profileB[m.key] > profileA[m.key]).length;
  const winner = aScore > bScore ? profileA : bScore > aScore ? profileB : null;

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-slate-800 font-bold text-xl">Profile Comparison</h1>
        <p className="text-slate-400 text-xs mt-0.5">Side-by-side GitHub developer analysis</p>
      </div>

      {/* Winner banner */}
      {winner && (
        <div
          className="rounded-xl px-5 py-3 flex items-center gap-3 border"
          style={{ background: "#22D3EE08", borderColor: "#22D3EE40" }}
        >
          <Trophy size={16} className="text-amber-500 shrink-0" />
          <span className="text-slate-700 text-sm">
            <span className="font-bold" style={{ color: "#22D3EE" }}>@{winner.login}</span> leads in {Math.max(aScore, bScore)} of {metrics.length} categories
          </span>
        </div>
      )}

      {/* Main comparison */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Profile headers */}
        <div className="grid grid-cols-3 gap-0 bg-slate-50/60 border-b border-slate-100">
          <div className="p-6">
            <ProfileHeader profile={profileA} side="a" />
          </div>
          <div className="flex items-center justify-center p-4">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md"
              style={{ background: "linear-gradient(248deg,#0b8868 0%,#323c4d 85%)" }}
            >
              VS
            </div>
          </div>
          <div className="p-6">
            {/* B search */}
            <div className="mb-4">
              <div className="relative">
                <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchB}
                  onChange={(e) => setSearchB(e.target.value)}
                  placeholder="Search profile..."
                  className="w-full text-xs bg-white border border-slate-200 rounded-lg pl-7 pr-3 py-1.5 outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
            </div>
            <ProfileHeader profile={profileB} side="b" />
          </div>
        </div>

        {/* Metrics */}
        <div className="px-8 py-4">
          <div className="text-xs font-semibold text-slate-400 tracking-wider uppercase text-center mb-2">Head-to-Head Metrics</div>
          {metrics.map((m) => (
            <MetricRow key={m.key} metric={m} a={profileA} b={profileB} />
          ))}
        </div>

        {/* Score row */}
        <div className="bg-slate-50 px-8 py-4 flex items-center border-t border-slate-100">
          <div
            className={`flex-1 text-right text-lg font-bold ${aScore > bScore ? "text-cyan-500" : "text-slate-400"}`}
          >
            {aScore} wins
          </div>
          <div className="w-28 text-center text-xs text-slate-400 font-semibold">Final Score</div>
          <div
            className={`flex-1 text-left text-lg font-bold ${bScore > aScore ? "text-cyan-500" : "text-slate-400"}`}
          >
            {bScore} wins
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="text-xs text-slate-400 text-center">
        Highlighted in <span style={{ color: "#22D3EE" }} className="font-semibold">cyan</span> = winner in that category
      </div>
    </div>
  );
}
