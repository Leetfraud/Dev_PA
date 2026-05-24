import { LayoutDashboard, GitBranch, Users, Lightbulb, LogOut, Code2 } from "lucide-react";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "repos", label: "Repositories", icon: GitBranch },
  { id: "compare", label: "Compare", icon: Users },
  { id: "suggestions", label: "AI Insights", icon: Lightbulb },
];

export default function Sidebar({ active, onNavigate, screens }) {
  return (
    <aside
      className="w-16 md:w-56 flex flex-col shrink-0 h-full"
      style={{ background: "#323c4d" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-white/10">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: "linear-gradient(248deg,#0b8868 0%,#323c4d 85%)", border: "1px solid #0b8868" }}
        >
          <Code2 size={16} color="white" />
        </div>
        <span className="hidden md:block text-white font-bold text-sm tracking-wider uppercase">
          DevProfile
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-6 space-y-1 px-2">
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group ${
                isActive
                  ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={18} className="shrink-0" />
              <span className="hidden md:block text-xs font-semibold tracking-wide">{label}</span>
              {isActive && (
                <div className="hidden md:block ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-2 border-t border-white/10">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all duration-150">
          <LogOut size={18} className="shrink-0" />
          <span className="hidden md:block text-xs font-semibold tracking-wide">Logout</span>
        </button>
      </div>
    </aside>
  );
}
