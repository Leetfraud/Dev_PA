import { useState } from 'react';
import { ArrowRight, BarChart3, GitBranch, Users, Sparkles, TrendingUp, Code2, Star, Github, Zap } from 'lucide-react';

const FEATURES = [
  {
    icon: BarChart3,
    title: 'Portfolio Analytics',
    description: 'Get instant insights into your GitHub profile with AI-powered scoring',
  },
  {
    icon: GitBranch,
    title: 'Repository Insights',
    description: 'Analyze stars, forks, languages, and contribution trends',
  },
  {
    icon: Users,
    title: 'Developer Comparison',
    description: 'Compare your profile with other developers side-by-side',
  },
  {
    icon: Sparkles,
    title: 'Smart Suggestions',
    description: 'Get personalized recommendations to improve your profile',
  },
  {
    icon: TrendingUp,
    title: 'Activity Tracking',
    description: 'Monitor your contribution trends and growth over time',
  },
  {
    icon: Code2,
    title: 'Skill Analysis',
    description: 'Discover your strongest programming languages and tech stack',
  },
];

const BENEFITS = [
  { title: 'For Developers', items: ['Build a stronger portfolio', 'Get actionable insights', 'Stand out to recruiters', 'Track your growth'] },
  { title: 'For Recruiters', items: ['Evaluate developers quickly', 'Compare candidates', 'Identify skill fit', 'Make data-driven decisions'] },
];

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white rounded-xl p-6 border border-slate-100 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 group">
    <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center mb-4 group-hover:bg-emerald-100 transition-colors">
      <Icon size={20} className="text-emerald-600" />
    </div>
    <h3 className="font-bold text-slate-800 text-sm mb-2">{title}</h3>
    <p className="text-slate-500 text-xs leading-relaxed">{description}</p>
  </div>
);

export default function Landing({ onGetStarted }) {
  const [email, setEmail] = useState('');

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-100 backdrop-blur-sm bg-white/80">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center text-white">
              <Code2 size={16} />
            </div>
            <span className="hidden sm:block">DevProfile</span>
          </div>
          <button
            onClick={onGetStarted}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-white font-semibold bg-emerald-600 hover:bg-emerald-700 transition-colors text-sm"
          >
            Get Started <ArrowRight size={14} />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-blue-50 -z-10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200 rounded-full blur-3xl opacity-10 -z-10" />
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-10 -z-10" />

        <div className="max-w-6xl mx-auto px-4 md:px-6 py-20 md:py-32">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-1.5">
              <Zap size={14} className="text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-700">Powered by GitHub API</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 leading-tight">
              Analyze Your GitHub
              <span className="block text-emerald-600">Portfolio Intelligence</span>
            </h1>

            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Transform your GitHub profile into meaningful analytics. Get portfolio scores, skill analysis, repository insights, and AI-powered recommendations to showcase your development journey.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <button
                onClick={onGetStarted}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Analyze Your Profile <ArrowRight size={16} />
              </button>
              <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors">
                <Github size={16} /> View on GitHub
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto pt-8 text-center">
              <div>
                <div className="text-2xl font-bold text-emerald-600">50k+</div>
                <div className="text-xs text-slate-500">Profiles Analyzed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-600">100%</div>
                <div className="text-xs text-slate-500">Accurate Data</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-600">Free</div>
                <div className="text-xs text-slate-500">Forever</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Powerful Features</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Everything you need to analyze and improve your GitHub portfolio</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 text-center mb-12">Designed for Everyone</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {BENEFITS.map((benefit) => (
              <div key={benefit.title} className="bg-white rounded-xl p-8 border border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 mb-6">{benefit.title}</h3>
                <ul className="space-y-3">
                  {benefit.items.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-slate-700">
                      <div className="w-2 h-2 rounded-full bg-emerald-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-emerald-700">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Analyze Your Portfolio?</h2>
          <p className="text-emerald-50 text-lg mb-8">Start getting insights into your GitHub profile in seconds. No sign-up required.</p>
          <button
            onClick={onGetStarted}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-emerald-600 font-bold rounded-lg hover:bg-slate-50 transition-colors text-lg"
          >
            Get Started Now <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="font-bold text-white mb-4">DevProfile</div>
              <p className="text-sm">GitHub Portfolio Intelligence Platform</p>
            </div>
            <div>
              <div className="font-bold text-white mb-3 text-sm">Product</div>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <div className="font-bold text-white mb-3 text-sm">Company</div>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <div className="font-bold text-white mb-3 text-sm">Legal</div>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between text-sm">
            <div>&copy; 2024 DevProfile Analyzer. All rights reserved.</div>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">GitHub</a>
              <a href="#" className="hover:text-white transition-colors">Twitter</a>
              <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
