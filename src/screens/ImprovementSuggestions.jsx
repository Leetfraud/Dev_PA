import { useState } from "react";
import { Sparkles, FileText, BookOpen, Code2, Globe, Star, CheckCircle, ChevronDown, ChevronUp, Zap, AlertTriangle, Info } from "lucide-react";

const suggestions = [
  {
    id: 1,
    category: "Documentation",
    priority: "high",
    icon: FileText,
    title: "Add README files to 5 repositories",
    desc: "5 of your 8 repositories are missing README.md files. A clear README is the first thing visitors see and dramatically increases project engagement and stars.",
    impact: "+12 score pts",
    effort: "Low",
    steps: [
      "Create a README.md with project description",
      "Add installation and usage instructions",
      "Include screenshots or demos",
      "Add badges for build status, coverage, etc.",
    ],
  },
  {
    id: 2,
    category: "Code Quality",
    priority: "medium",
    icon: Code2,
    title: "Improve inline code documentation",
    desc: "Your repositories lack inline comments and function-level documentation. This makes collaboration harder and reduces your profile's professional credibility.",
    impact: "+8 score pts",
    effort: "Medium",
    steps: [
      "Add docstrings to all public functions",
      "Document complex algorithms with inline comments",
      "Use consistent comment style across repos",
    ],
  },
  {
    id: 3,
    category: "Tech Stack",
    priority: "medium",
    icon: Globe,
    title: "Diversify your language portfolio",
    desc: "68% of your code is C. Adding a modern language like Go or Rust alongside your systems work would broaden your appeal to more employers and collaborators.",
    impact: "+6 score pts",
    effort: "High",
    steps: [
      "Build a small project in Go or Rust",
      "Contribute to open-source projects in target languages",
      "Document language learning journey in a public repo",
    ],
  },
  {
    id: 4,
    category: "Engagement",
    priority: "low",
    icon: Star,
    title: "Pin your best repositories",
    desc: "You have no pinned repositories. Pinning your top 6 repos helps visitors immediately find your best work and increases follower conversion rate.",
    impact: "+4 score pts",
    effort: "Low",
    steps: [
      "Identify your 6 most impactful repositories",
      "Pin them from your GitHub profile settings",
      "Ensure each pinned repo has a description",
    ],
  },
  {
    id: 5,
    category: "Visibility",
    priority: "low",
    icon: BookOpen,
    title: "Write a GitHub profile README",
    desc: "A profile-level README.md in a special repo (username/username) appears on your profile page and is a powerful way to showcase your story and skills.",
    impact: "+5 score pts",
    effort: "Low",
    steps: [
      "Create a repo named exactly as your GitHub username",
      "Add a README.md with your story and focus areas",
      "Include dynamic stats widgets",
    ],
  },
];

const priorityConfig = {
  high: { label: "High Impact", color: "#EF4444", bg: "#FEF2F2", border: "#FECACA" },
  medium: { label: "Medium Impact", color: "#F59E0B", bg: "#FFFBEB", border: "#FDE68A" },
  low: { label: "Quick Win", color: "#10B981", bg: "#F0FDF4", border: "#BBF7D0" },
};

function SuggestionCard({ item, isOpen, onToggle }) {
  const { icon: Icon, title, desc, impact, effort, steps, priority, category } = item;
  const pc = priorityConfig[priority];

  return (
    <div
      className="bg-white rounded-2xl border overflow-hidden transition-all duration-200"
      style={{ borderColor: isOpen ? "#A855F730" : "#F1F5F9", boxShadow: isOpen ? "0 0 0 2px #A855F715" : "none" }}
    >
      <button
        className="w-full flex items-center gap-4 p-4 text-left hover:bg-slate-50/50 transition-colors"
        onClick={onToggle}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "#A855F715", border: "1px solid #A855F730" }}
        >
          <Icon size={16} style={{ color: "#A855F7" }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-800 font-semibold text-sm">{title}</span>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-semibold border"
              style={{ color: pc.color, background: pc.bg, borderColor: pc.border }}
            >
              {pc.label}
            </span>
          </div>
          <div className="text-slate-400 text-xs mt-0.5">{category}</div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-xs font-bold text-purple-600">{impact}</span>
            <span className="text-xs text-slate-400">Effort: {effort}</span>
          </div>
          {isOpen ? <ChevronUp size={15} className="text-slate-400" /> : <ChevronDown size={15} className="text-slate-400" />}
        </div>
      </button>

      {isOpen && (
        <div className="px-4 pb-4 space-y-3 border-t border-slate-50 pt-4">
          <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Action Steps</div>
            <ul className="space-y-1.5">
              {steps.map((step, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <CheckCircle size={13} className="text-purple-400 mt-0.5 shrink-0" />
                  {step}
                </li>
              ))}
            </ul>
          </div>
          <button
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-white transition-all hover:opacity-90"
            style={{ background: "#A855F7" }}
          >
            <Zap size={12} /> Start This Improvement
          </button>
        </div>
      )}
    </div>
  );
}

export default function ImprovementSuggestions() {
  const [openId, setOpenId] = useState(1);
  const totalImpact = suggestions.reduce((acc, s) => acc + parseInt(s.impact.replace(/\D/g, "")), 0);

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "linear-gradient(135deg,#A855F7,#7C3AED)", boxShadow: "0 4px 12px #A855F740" }}
        >
          <Sparkles size={18} color="white" />
        </div>
        <div>
          <h1 className="text-slate-800 font-bold text-xl">AI Improvement Suggestions</h1>
          <p className="text-slate-400 text-xs mt-0.5">Personalized recommendations based on your portfolio analysis</p>
        </div>
      </div>

      {/* Score potential banner */}
      <div
        className="rounded-2xl p-5 text-white relative overflow-hidden"
        style={{ background: "linear-gradient(248deg,#A855F7 0%,#7C3AED 50%,#323c4d 100%)" }}
      >
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10 bg-white -translate-y-10 translate-x-10" />
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="text-purple-200 text-xs font-semibold tracking-wider uppercase mb-1">Score Potential</div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">94</span>
              <span className="text-purple-300 text-sm">→</span>
              <span className="text-4xl font-bold text-amber-400">{94 + totalImpact > 100 ? 100 : 94 + totalImpact}</span>
              <span className="text-purple-300 text-sm">/100</span>
            </div>
            <div className="text-purple-200 text-xs mt-1">+{totalImpact} points possible from {suggestions.length} improvements</div>
          </div>
          <div className="flex gap-3">
            {["high", "medium", "low"].map((p) => (
              <div key={p} className="text-center">
                <div className="text-xl font-bold text-white">{suggestions.filter((s) => s.priority === p).length}</div>
                <div className="text-purple-300 text-xs capitalize">{p}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Info callout */}
      <div
        className="flex items-start gap-2.5 px-4 py-3 rounded-xl border text-sm"
        style={{ background: "#A855F708", borderColor: "#A855F730" }}
      >
        <Info size={14} style={{ color: "#A855F7" }} className="mt-0.5 shrink-0" />
        <p className="text-slate-600 text-xs leading-relaxed">
          These suggestions are generated by analyzing your repository structure, documentation quality, language diversity, and engagement metrics. Implement them in order of priority for best results.
        </p>
      </div>

      {/* Suggestions list */}
      <div className="space-y-3">
        {suggestions.map((item) => (
          <SuggestionCard
            key={item.id}
            item={item}
            isOpen={openId === item.id}
            onToggle={() => setOpenId(openId === item.id ? null : item.id)}
          />
        ))}
      </div>

      <div className="text-center text-xs text-slate-400 pb-4">
        <AlertTriangle size={11} className="inline mr-1" />
        Suggestions refresh every 24 hours as your portfolio evolves
      </div>
    </div>
  );
}
