export const SAMPLE_USER = {
  login: 'torvalds',
  name: 'Linus Torvalds',
  avatar_url: 'https://avatars.githubusercontent.com/u/1024025?v=4',
  bio: 'Creator of Linux and Git. Software engineer at Linux Foundation.',
  location: 'Portland, OR',
  email: null,
  blog: 'kernel.org',
  twitter_username: null,
  company: 'Linux Foundation',
  public_repos: 8,
  public_gists: 0,
  followers: 218000,
  following: 0,
  created_at: '2011-09-03T18:55:24Z',
  updated_at: '2024-05-20T10:00:00Z',
  type: 'User',
  total_stars: 24300,
  total_forks: 5900,
  most_used_language: 'C',
  portfolio_score: 94,
};

export const SAMPLE_REPOS = [
  {
    id: 1,
    name: 'linux',
    full_name: 'torvalds/linux',
    description: 'Linux kernel source tree',
    url: 'https://github.com/torvalds/linux',
    homepage: null,
    size: 900000,
    stargazers_count: 18200,
    watchers_count: 832,
    language: 'C',
    forks_count: 5600,
    open_issues_count: 847,
    created_at: '2011-09-03T18:55:24Z',
    updated_at: '2024-05-20T08:30:00Z',
    pushed_at: '2024-05-20T08:30:00Z',
    topics: ['kernel', 'linux', 'os'],
  },
  {
    id: 2,
    name: 'git',
    full_name: 'torvalds/git',
    description: 'Fast, scalable, distributed revision control system',
    url: 'https://github.com/torvalds/git',
    homepage: 'https://www.kernel.org/pub/software/scm/git/',
    size: 250000,
    stargazers_count: 4800,
    watchers_count: 304,
    language: 'C',
    forks_count: 1200,
    open_issues_count: 67,
    created_at: '2015-01-01T00:00:00Z',
    updated_at: '2024-05-20T07:00:00Z',
    pushed_at: '2024-05-20T07:00:00Z',
    topics: ['git', 'vcs', 'version-control'],
  },
  {
    id: 3,
    name: 'subsurface',
    full_name: 'torvalds/subsurface',
    description: 'Dive log program for Linux, Mac and Windows',
    url: 'https://github.com/torvalds/subsurface',
    homepage: 'https://subsurface-divelog.org',
    size: 180000,
    stargazers_count: 710,
    watchers_count: 48,
    language: 'C++',
    forks_count: 230,
    open_issues_count: 12,
    created_at: '2011-12-01T00:00:00Z',
    updated_at: '2024-05-18T09:00:00Z',
    pushed_at: '2024-05-18T09:00:00Z',
    topics: ['diving', 'dive-log', 'scuba'],
  },
];

export const SAMPLE_LANGUAGES = [
  { name: 'C', pct: 68, color: '#555599' },
  { name: 'Shell', pct: 14, color: '#22D3EE' },
  { name: 'Python', pct: 8, color: '#F59E0B' },
  { name: 'Makefile', pct: 6, color: '#10B981' },
  { name: 'Other', pct: 4, color: '#A855F7' },
];

export const SAMPLE_CHART_DATA = {
  weekly: [28, 42, 35, 60, 55, 80, 74, 90, 65, 78, 88, 95],
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
};

export const FEATURE_HIGHLIGHTS = [
  {
    icon: 'BarChart3',
    title: 'Portfolio Analytics',
    description: 'Get instant insights into your GitHub profile with AI-powered scoring',
  },
  {
    icon: 'GitBranch',
    title: 'Repository Insights',
    description: 'Analyze stars, forks, languages, and contribution trends',
  },
  {
    icon: 'Users',
    title: 'Developer Comparison',
    description: 'Compare your profile with other developers side-by-side',
  },
  {
    icon: 'Sparkles',
    title: 'Smart Suggestions',
    description: 'Get personalized recommendations to improve your profile',
  },
  {
    icon: 'TrendingUp',
    title: 'Activity Tracking',
    description: 'Monitor your contribution trends and growth over time',
  },
  {
    icon: 'Code2',
    title: 'Skill Analysis',
    description: 'Discover your strongest programming languages and tech stack',
  },
];

export const ERROR_MESSAGES = {
  USER_NOT_FOUND: 'User not found. Please check the username and try again.',
  RATE_LIMIT: 'GitHub API rate limit exceeded. Please wait a few minutes and try again.',
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  INVALID_INPUT: 'Please enter a valid GitHub username.',
};

export const SUCCESS_MESSAGES = {
  PROFILE_LOADED: 'Profile loaded successfully!',
  DATA_UPDATED: 'Data updated successfully!',
  COMPARISON_READY: 'Comparison data ready!',
};
