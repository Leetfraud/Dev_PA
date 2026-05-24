import { useEffect, useRef, useMemo } from "react";
import { MapPin, Star, GitFork, Users, BookOpen, ArrowRight, TrendingUp, Award } from "lucide-react";
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from "chart.js";
import { getLanguageColor } from "../utils/formatters.js";

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

const StatCard = ({ label, value, icon: Icon, color, sub }) => (
  <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-3">
      <span className="text-slate-500 text-xs font-semibold tracking-wider uppercase">{label}</span>
      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: color + "18" }}>
        <Icon size={14} style={{ color }} />
      </div>
    </div>
    <div className="text-2xl font-bold text-slate-800">{value}</div>
    {sub && <div className="text-xs text-slate-400 mt-1">{sub}</div>}
  </div>
);

const LangBar = ({ name, pct, color }) => (
  <div className="flex items-center gap-3">
    <span className="text-xs text-slate-500 w-16 text-right shrink-0">{name}</span>
    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
    </div>
    <span className="text-xs font-semibold text-slate-600 w-8">{pct}%</span>
  </div>
);

export default function Dashboard({ user, repos = [], onNavigate, screens }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const languages = useMemo(() => {
    if (!repos || repos.length === 0) {
      return user.languages || [];
    }

    const langMap = {};
    repos.forEach((repo) => {
      if (repo.language) {
        langMap[repo.language] = (langMap[repo.language] || 0) + 1;
      }
    });

    const total = Object.values(langMap).reduce((a, b) => a + b, 0) || 1;
    return Object.entries(langMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({
        name,
        pct: Math.round((count / total) * 100),
        color: getLanguageColor(name),
      }));
  }, [repos, user.languages]);

  useEffect(() => {
    if (!chartRef.current) return;
    if (chartInstance.current) chartInstance.current.destroy();

    const chartData = languages.length > 0 ? languages : [{ name: "N/A", pct: 100, color: "#E5E7EB" }];

    chartInstance.current = new Chart(chartRef.current, {
      type: "doughnut",
      data: {
        labels: chartData.map((l) => l.name),
        datasets: [
          {
            data: chartData.map((l) => l.pct),
            backgroundColor: chartData.map((l) => l.color),
            borderWidth: 0,
            hoverOffset: 6,
          },
        ],
      },
      options: {
        cutout: "72%",
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.label}: ${ctx.parsed}%`,
            },
          },
        },
        animation: { animateRotate: true, duration: 900 },
      },
    });

    return () => chartInstance.current?.destroy();
  }, [languages]);

  const stats = [
    { label: "Repositories", value: user.public_repos || repos.length, icon: BookOpen, color: "#0b8868", sub: "public repos" },
    { label: "Followers", value: user.followers >= 1000 ? `${(user.followers / 1000).toFixed(0)}k` : user.followers, icon: Users, color: "#22D3EE", sub: "github followers" },
    { label: "Total Stars", value: user.total_stars >= 1000 ? `${(user.total_stars / 1000).toFixed(1)}k` : user.total_stars, icon: Star, color: "#10B981", sub: "across all repos" },
    { label: "Total Forks", value: user.total_forks >= 1000 ? `${(user.total_forks / 1000).toFixed(1)}k` : user.total_forks, icon: GitFork, color: "#F59E0B", sub: "community forks" },
  ];

  const scoreColor = user.portfolio_score >= 90 ? "#10B981" : user.portfolio_score >= 70 ? "#F59E0B" : "#EF4444";

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-slate-800 font-bold text-xl">Profile Dashboard</h1>
          <p className="text-slate-400 text-xs mt-0.5">Last updated: just now</p>
        </div>
        <button
          onClick={() => onNavigate(screens.SUGGESTIONS)}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-purple-600 bg-purple-50 border border-purple-200 hover:bg-purple-100 transition-colors"
        >
          <TrendingUp size={13} /> Get AI Insights
        </button>
      </div>

      {/* Profile + Score row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Profile card */}
        <div className="md:col-span-2 bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex gap-4 items-start">
          <img
            src={user.avatar_url}
            alt={user.name}
            className="w-16 h-16 rounded-xl border-2 border-slate-100 shrink-0 object-cover"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-slate-800 font-bold text-lg leading-tight">{user.name}</h2>
              <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                @{user.login}
              </span>
            </div>
            <p className="text-slate-500 text-sm mt-1 leading-relaxed">{user.bio}</p>
            {user.location && (
              <div className="flex items-center gap-1 mt-2 text-slate-400 text-xs">
                <MapPin size={11} /> {user.location}
              </div>
            )}
          </div>
        </div>

        {/* Portfolio Score Card */}
        <div
          className="rounded-2xl p-5 text-white relative overflow-hidden flex flex-col justify-between"
          style={{ background: "linear-gradient(248deg,#0b8868 0%,#323c4d 85%)" }}
        >
          <div className="absolute -top-4 -right-4 w-28 h-28 rounded-full opacity-10 bg-white" />
          <div className="absolute bottom-2 -right-6 w-20 h-20 rounded-full opacity-10 bg-amber-400" />
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Award size={14} className="text-amber-400" />
              <span className="text-white/70 text-xs font-semibold tracking-wider uppercase">Portfolio Score</span>
            </div>
            <div className="text-5xl font-bold tracking-tight mt-2" style={{ color: "#F59E0B" }}>
              {user.portfolio_score}
              <span className="text-lg text-white/50">/100</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${user.portfolio_score}%`, background: "#F59E0B" }}
              />
            </div>
            <p className="text-white/50 text-xs mt-2">Elite tier · Top 5% globally</p>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Language chart + quick nav */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Language chart */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-700 font-bold text-sm">Language Distribution</h3>
            <span className="text-xs text-cyan-500 font-semibold">Skill Analysis</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative w-32 h-32 shrink-0">
              <canvas ref={chartRef} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-slate-700 font-bold text-sm">{languages.length}<br /><span className="text-slate-400 text-xs font-normal">langs</span></span>
              </div>
            </div>
            <div className="flex-1 space-y-2.5">
              {languages.map((l) => <LangBar key={l.name} {...l} />)}
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-3">
          <h3 className="text-slate-700 font-bold text-sm mb-4">Quick Navigation</h3>
          {[
            { label: "View Repository Analytics", sub: "Stars, forks & activity trends", screen: screens.REPOS, color: "#0b8868" },
            { label: "Compare with Another Dev", sub: "Side-by-side profile comparison", screen: screens.COMPARE, color: "#22D3EE" },
            { label: "AI Improvement Suggestions", sub: "Get personalized recommendations", screen: screens.SUGGESTIONS, color: "#A855F7" },
          ].map(({ label, sub, screen, color }) => (
            <button
              key={label}
              onClick={() => onNavigate(screen)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left hover:scale-[1.01] transition-all duration-150 group"
              style={{ borderColor: color + "30", background: color + "08" }}
            >
              <div>
                <div className="text-slate-700 font-semibold text-xs">{label}</div>
                <div className="text-slate-400 text-xs mt-0.5">{sub}</div>
              </div>
              <ArrowRight size={14} style={{ color }} className="shrink-0 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
