import { useEffect, useRef, useMemo } from "react";
import { Star, GitFork, Eye, TrendingUp, Activity, Medal } from "lucide-react";
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend, LineController, LineElement, PointElement, Filler } from "chart.js";
import { getLanguageColor } from "../utils/formatters.js";

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend, LineController, LineElement, PointElement, Filler);

const RankBadge = ({ rank }) => {
  const colors = { 1: ["#F59E0B", "#FEF3C7"], 2: ["#94A3B8", "#F1F5F9"], 3: ["#B45309", "#FEF9EE"] };
  const [text, bg] = colors[rank] || ["#64748B", "#F8FAFC"];
  return (
    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold" style={{ color: text, background: bg }}>
      {rank <= 3 ? <Medal size={14} style={{ color: text }} /> : rank}
    </div>
  );
};

export default function RepoAnalytics({ repos = [], user = {} }) {
  const barRef = useRef(null);
  const lineRef = useRef(null);
  const barChart = useRef(null);
  const lineChart = useRef(null);

  const sortedRepos = useMemo(() => {
    if (!repos || repos.length === 0) {
      return [];
    }
    return [...repos]
      .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
      .slice(0, 10)
      .map((repo, index) => ({
        ...repo,
        rank: index + 1,
        activity: Math.min(100, Math.floor((repo.stargazers_count || 0) / Math.max(1, repo.forks_count || 1)) * 10 + 50),
      }));
  }, [repos]);

  const monthlyData = useMemo(() => {
    const data = [];
    for (let i = 0; i < 12; i++) {
      data.push(Math.floor(Math.random() * 100) + 20);
    }
    return data;
  }, []);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  useEffect(() => {
    if (barRef.current && sortedRepos.length > 0) {
      if (barChart.current) barChart.current.destroy();
      barChart.current = new Chart(barRef.current, {
        type: "bar",
        data: {
          labels: sortedRepos.map((r) => r.name),
          datasets: [
            {
              label: "Stars",
              data: sortedRepos.map((r) => r.stargazers_count || 0),
              backgroundColor: "#10B98188",
              borderColor: "#10B981",
              borderWidth: 1,
              borderRadius: 6,
            },
            {
              label: "Forks",
              data: sortedRepos.map((r) => r.forks_count || 0),
              backgroundColor: "#22D3EE55",
              borderColor: "#22D3EE",
              borderWidth: 1,
              borderRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: { legend: { position: "top", labels: { font: { size: 11 }, color: "#64748B" } } },
          scales: {
            x: { ticks: { color: "#94A3B8", font: { size: 11 } }, grid: { display: false } },
            y: { ticks: { color: "#94A3B8", font: { size: 11 } }, grid: { color: "#F1F5F9" } },
          },
        },
      });
    }

    if (lineRef.current) {
      if (lineChart.current) lineChart.current.destroy();
      lineChart.current = new Chart(lineRef.current, {
        type: "line",
        data: {
          labels: months,
          datasets: [
            {
              label: "Contributions",
              data: monthlyData,
              borderColor: "#22D3EE",
              backgroundColor: "rgba(34,211,238,0.08)",
              fill: true,
              tension: 0.4,
              pointRadius: 3,
              pointBackgroundColor: "#22D3EE",
            },
          ],
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: {
            x: { ticks: { color: "#94A3B8", font: { size: 11 } }, grid: { display: false } },
            y: { ticks: { color: "#94A3B8", font: { size: 11 } }, grid: { color: "#F8FAFC" } },
          },
        },
      });
    }

    return () => {
      barChart.current?.destroy();
      lineChart.current?.destroy();
    };
  }, [sortedRepos, monthlyData]);

  const username = user.login || "User";

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-slate-800 font-bold text-xl">Repository Analytics for @{username}</h1>
        <p className="text-slate-400 text-xs mt-0.5">Ranked by stars, forks, and activity level</p>
      </div>

      {sortedRepos.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center">
          <p className="text-slate-500">No repositories found</p>
        </div>
      ) : (
        <>
          {/* Ranking Table */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-50 flex items-center gap-2">
              <TrendingUp size={15} className="text-amber-500" />
              <h2 className="font-bold text-slate-700 text-sm">Repository Ranking System</h2>
            </div>
            <div className="divide-y divide-slate-50">
              {sortedRepos.map((repo) => (
                <div key={repo.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50/70 transition-colors group">
                  <RankBadge rank={repo.rank} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 text-sm">{repo.name}</span>
                      {repo.language && (
                        <span
                          className="text-xs px-1.5 py-0.5 rounded font-semibold"
                          style={{ color: getLanguageColor(repo.language), background: getLanguageColor(repo.language) + "18" }}
                        >
                          {repo.language}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-400 text-xs mt-0.5 truncate">{repo.description || "No description"}</p>
                  </div>
                  <div className="flex items-center gap-5 text-xs text-slate-500 shrink-0">
                    <span className="flex items-center gap-1">
                      <Star size={11} className="text-amber-400" /> {Math.floor((repo.stargazers_count || 0) / 1000)}k
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork size={11} className="text-cyan-400" /> {repo.forks_count || 0}
                    </span>
                    <div className="hidden md:flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-emerald-400" style={{ width: `${repo.activity}%` }} />
                      </div>
                      <span className="text-emerald-600 font-semibold">{repo.activity}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Activity size={14} className="text-cyan-500" />
                <h3 className="font-bold text-slate-700 text-sm">Contribution Trends</h3>
              </div>
              <canvas ref={lineRef} height={160} />
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Star size={14} className="text-emerald-500" />
                <h3 className="font-bold text-slate-700 text-sm">Stars & Forks by Repo</h3>
              </div>
              <canvas ref={barRef} height={160} />
            </div>
          </div>

          {/* Heatmap placeholder */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Activity size={14} className="text-cyan-500" />
              <h3 className="font-bold text-slate-700 text-sm">Contribution Heatmap</h3>
              <span className="ml-auto text-xs text-slate-400">Last 12 months</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {Array.from({ length: 52 * 7 }).map((_, i) => {
                const intensity = Math.random();
                const alpha = intensity < 0.4 ? 0.08 : intensity < 0.65 ? 0.3 : intensity < 0.85 ? 0.6 : 1;
                return (
                  <div
                    key={i}
                    className="w-2.5 h-2.5 rounded-sm"
                    style={{ background: `rgba(34,211,238,${alpha})` }}
                    title={`${Math.floor(intensity * 8)} contributions`}
                  />
                );
              })}
            </div>
            <div className="flex items-center gap-2 mt-3 justify-end text-xs text-slate-400">
              <span>Less</span>
              {[0.08, 0.3, 0.6, 1].map((a, i) => (
                <div key={i} className="w-2.5 h-2.5 rounded-sm" style={{ background: `rgba(34,211,238,${a})` }} />
              ))}
              <span>More</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
