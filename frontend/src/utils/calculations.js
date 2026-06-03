export const calculatePortfolioScore = (user, repos = []) => {
  let score = 50;

  if (!user || !repos) return score;

  const followers = user.followers || 0;
  const publicRepos = user.public_repos || repos.length;

  if (followers > 100) score += 5;
  if (followers > 500) score += 5;
  if (followers > 1000) score += 5;
  if (followers > 5000) score += 5;

  if (publicRepos > 5) score += 3;
  if (publicRepos > 10) score += 3;
  if (publicRepos > 20) score += 3;

  const totalStars = repos.reduce((acc, r) => acc + (r.stargazers_count || 0), 0);
  if (totalStars > 50) score += 5;
  if (totalStars > 200) score += 5;
  if (totalStars > 500) score += 5;
  if (totalStars > 1000) score += 5;

  const languages = new Set();
  repos.forEach((r) => {
    if (r.language) languages.add(r.language);
  });
  const langCount = languages.size;

  if (langCount > 1) score += 2;
  if (langCount > 3) score += 3;
  if (langCount > 5) score += 3;

  const reposWithDescription = repos.filter((r) => r.description && r.description.length > 0).length;
  const descriptionRate = repos.length > 0 ? reposWithDescription / repos.length : 0;
  score += Math.round(descriptionRate * 10);

  const now = new Date();
  const recentRepos = repos.filter((r) => {
    const updated = new Date(r.updated_at);
    const daysAgo = (now - updated) / (1000 * 60 * 60 * 24);
    return daysAgo < 180;
  }).length;
  const activityRate = repos.length > 0 ? recentRepos / repos.length : 0;
  if (activityRate > 0.5) score += 5;
  if (activityRate > 0.8) score += 3;

  return Math.min(Math.max(Math.round(score), 0), 100);
};

export const getScoreTier = (score) => {
  if (score >= 90) return { tier: 'Elite', color: '#10B981', bg: '#F0FDF4' };
  if (score >= 75) return { tier: 'Professional', color: '#3B82F6', bg: '#EFF6FF' };
  if (score >= 60) return { tier: 'Intermediate', color: '#F59E0B', bg: '#FFFBEB' };
  return { tier: 'Beginner', color: '#6B7280', bg: '#F9FAFB' };
};

export const analyzeLanguages = (repos) => {
  const languages = {};

  repos.forEach((repo) => {
    if (repo.language) {
      languages[repo.language] = (languages[repo.language] || 0) + 1;
    }
  });

  const sorted = Object.entries(languages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const total = Object.values(languages).reduce((a, b) => a + b, 0) || 1;

  return sorted.map(([name, count]) => ({
    name,
    count,
    percentage: Math.round((count / total) * 100),
  }));
};

export const categorizeLanguage = (language) => {
  const categories = {
    frontend: ['JavaScript', 'TypeScript', 'Vue', 'React', 'CSS', 'HTML', 'Svelte'],
    backend: ['Python', 'Java', 'PHP', 'Ruby', 'Go', 'Node.js', 'Express'],
    systems: ['C', 'C++', 'Rust', 'Assembly'],
    mobile: ['Swift', 'Kotlin', 'Dart', 'Objective-C'],
    data: ['Python', 'R', 'Scala', 'SQL'],
    scripting: ['Python', 'Ruby', 'Shell', 'Bash', 'PowerShell'],
  };

  for (const [category, langs] of Object.entries(categories)) {
    if (langs.includes(language)) {
      return category;
    }
  }

  return 'other';
};

export const calculateActivityScore = (repos) => {
  if (repos.length === 0) return 0;

  const now = new Date();
  let score = 0;

  repos.forEach((repo) => {
    const updated = new Date(repo.updated_at);
    const daysAgo = (now - updated) / (1000 * 60 * 60 * 24);

    if (daysAgo < 30) score += 10;
    else if (daysAgo < 90) score += 7;
    else if (daysAgo < 180) score += 4;
    else if (daysAgo < 365) score += 2;
  });

  return Math.min(Math.round(score / repos.length), 100);
};

export const getRepositoryRank = (repo, allRepos) => {
  if (!allRepos || allRepos.length === 0) return 1;

  const sorted = [...allRepos].sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0));
  const index = sorted.findIndex((r) => r.id === repo.id);

  return index >= 0 ? index + 1 : allRepos.length;
};

export const compareProfiles = (userA, userB) => {
  return {
    followers: userA.followers - userB.followers,
    repos: userA.public_repos - userB.public_repos,
    stars: (userA.total_stars || 0) - (userB.total_stars || 0),
    forks: (userA.total_forks || 0) - (userB.total_forks || 0),
    score: (userA.portfolio_score || 0) - (userB.portfolio_score || 0),
  };
};
