class AnalyticsService {
  calculatePortfolioScore(user, repos) {
    const activityScore = this.calculateActivityScore(repos);
    const documentationScore = this.calculateDocumentationScore(repos);
    const popularityScore = this.calculatePopularityScore(user, repos);
    const stackMaturityScore = this.calculateStackMaturityScore(repos);

    const weights = {
      activity: 0.25,
      documentation: 0.25,
      popularity: 0.30,
      stack: 0.20,
    };

    const totalScore = 
      activityScore * weights.activity +
      documentationScore * weights.documentation +
      popularityScore * weights.popularity +
      stackMaturityScore * weights.stack;

    return {
      portfolio_score: Math.round(totalScore),
      activity_score: activityScore,
      documentation_score: documentationScore,
      popularity_score: popularityScore,
      stack_maturity_score: stackMaturityScore,
    };
  }

  calculateActivityScore(repos) {
    if (!repos || repos.length === 0) return 0;

    const now = new Date();
    let score = 0;

    repos.forEach((repo) => {
      const pushed = new Date(repo.pushed_at);
      const daysAgo = (now - pushed) / (1000 * 60 * 60 * 24);

      if (daysAgo < 30) score += 10;
      else if (daysAgo < 90) score += 7;
      else if (daysAgo < 180) score += 4;
      else if (daysAgo < 365) score += 2;
    });

    const avgScore = score / repos.length;
    return Math.min(Math.round(avgScore * 10), 100);
  }

  calculateDocumentationScore(repos) {
    if (!repos || repos.length === 0) return 0;

    let score = 0;
    const totalRepos = repos.length;

    repos.forEach((repo) => {
      let repoScore = 0;
      
      if (repo.has_readme) repoScore += 60;
      if (repo.description && repo.description.length > 20) repoScore += 20;
      if (repo.has_license) repoScore += 20;

      score += repoScore;
    });

    return Math.round(score / totalRepos);
  }

  calculatePopularityScore(user, repos) {
    const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
    const totalForks = repos.reduce((sum, r) => sum + (r.forks_count || 0), 0);
    const followers = user.followers || 0;

    let score = 0;

    if (totalStars > 1000) score += 30;
    else if (totalStars > 500) score += 25;
    else if (totalStars > 100) score += 20;
    else if (totalStars > 50) score += 15;
    else if (totalStars > 10) score += 10;

    if (totalForks > 500) score += 20;
    else if (totalForks > 100) score += 15;
    else if (totalForks > 50) score += 10;
    else if (totalForks > 10) score += 5;

    if (followers > 1000) score += 30;
    else if (followers > 500) score += 25;
    else if (followers > 100) score += 20;
    else if (followers > 50) score += 15;
    else if (followers > 10) score += 10;

    const avgStarsPerRepo = repos.length > 0 ? totalStars / repos.length : 0;
    if (avgStarsPerRepo > 50) score += 20;
    else if (avgStarsPerRepo > 10) score += 10;

    return Math.min(score, 100);
  }

  calculateStackMaturityScore(repos) {
    const languages = {};
    
    repos.forEach((repo) => {
      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1;
      }
    });

    const languageCount = Object.keys(languages).length;
    const modernLanguages = ['TypeScript', 'Go', 'Rust', 'Kotlin', 'Swift', 'Python'];
    const hasModernLang = Object.keys(languages).some(lang => modernLanguages.includes(lang));

    let score = 0;

    if (languageCount >= 5) score += 40;
    else if (languageCount >= 3) score += 30;
    else if (languageCount >= 2) score += 20;
    else score += 10;

    if (hasModernLang) score += 30;

    const totalRepos = repos.length;
    if (totalRepos >= 20) score += 30;
    else if (totalRepos >= 10) score += 20;
    else if (totalRepos >= 5) score += 10;

    return Math.min(score, 100);
  }

  analyzeLanguages(repos) {
    const languages = {};

    repos.forEach((repo) => {
      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1;
      }
    });

    const total = Object.values(languages).reduce((a, b) => a + b, 0) || 1;

    return Object.entries(languages)
      .sort((a, b) => b[1] - a[1])
      .reduce((acc, [name, count]) => {
        acc[name] = {
          count,
          percentage: Math.round((count / total) * 100),
        };
        return acc;
      }, {});
  }

  determinePrimaryStack(languages) {
    const stacks = {
      frontend: ['JavaScript', 'TypeScript', 'Vue', 'HTML', 'CSS', 'React', 'Svelte'],
      backend: ['Python', 'Java', 'PHP', 'Ruby', 'Go', 'C#', 'Elixir'],
      mobile: ['Swift', 'Kotlin', 'Dart', 'Objective-C', 'Java'],
      systems: ['C', 'C++', 'Rust', 'Assembly'],
      devops: ['Shell', 'Dockerfile', 'HCL', 'Makefile'],
    };

    const stackScores = {};

    Object.entries(languages).forEach(([lang, data]) => {
      for (const [stack, langs] of Object.entries(stacks)) {
        if (langs.includes(lang)) {
          stackScores[stack] = (stackScores[stack] || 0) + data.count;
        }
      }
    });

    const topStack = Object.entries(stackScores).sort((a, b) => b[1] - a[1])[0];
    return topStack ? topStack[0] : 'fullstack';
  }

  rankRepositories(repos) {
    const weights = {
      stars: 0.4,
      forks: 0.3,
      recency: 0.2,
      documentation: 0.1,
    };

    const now = new Date();

    const scored = repos.map((repo) => {
      const stars = repo.stargazers_count || 0;
      const forks = repo.forks_count || 0;
      const pushed = new Date(repo.pushed_at);
      const daysAgo = (now - pushed) / (1000 * 60 * 60 * 24);
      
      const recencyScore = Math.max(0, 100 - (daysAgo / 365) * 100);
      const docScore = repo.has_readme ? 100 : 0;

      const normalizedStars = Math.min(stars / 100, 1) * 100;
      const normalizedForks = Math.min(forks / 50, 1) * 100;

      const totalScore = 
        normalizedStars * weights.stars +
        normalizedForks * weights.forks +
        recencyScore * weights.recency +
        docScore * weights.documentation;

      return {
        ...repo,
        rank_score: totalScore,
      };
    });

    return scored
      .sort((a, b) => b.rank_score - a.rank_score)
      .slice(0, 3)
      .map((repo, index) => ({
        rank: index + 1,
        name: repo.name,
        description: repo.description,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language,
        url: repo.html_url || repo.url,
        score: Math.round(repo.rank_score),
      }));
  }

  generateAnalytics(user, repos) {
    const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
    const totalForks = repos.reduce((sum, r) => sum + (r.forks_count || 0), 0);
    const languages = this.analyzeLanguages(repos);
    const primaryStack = this.determinePrimaryStack(languages);
    const topRepositories = this.rankRepositories(repos);
    const scores = this.calculatePortfolioScore(user, repos);

    return {
      total_stars: totalStars,
      total_forks: totalForks,
      ...scores,
      primary_stack: primaryStack,
      languages,
      top_repositories: topRepositories,
    };
  }

  compareProfiles(profileA, profileB) {
    const metrics = [
      'portfolio_score',
      'total_stars',
      'total_forks',
      'followers',
      'public_repos',
    ];

    const comparison = {
      userA: profileA.username,
      userB: profileB.username,
      deltas: {},
      winner: {},
    };

    metrics.forEach((metric) => {
      const valueA = profileA.analytics?.[metric] || profileA.githubData?.[metric] || 0;
      const valueB = profileB.analytics?.[metric] || profileB.githubData?.[metric] || 0;
      
      comparison.deltas[metric] = valueA - valueB;
      comparison.winner[metric] = valueA > valueB ? 'A' : valueB > valueA ? 'B' : 'tie';
    });

    const winsA = Object.values(comparison.winner).filter(w => w === 'A').length;
    const winsB = Object.values(comparison.winner).filter(w => w === 'B').length;

    comparison.overall_winner = winsA > winsB ? 'A' : winsB > winsA ? 'B' : 'tie';

    return comparison;
  }
}

export default new AnalyticsService();
