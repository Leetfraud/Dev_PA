import axios from 'axios';
import { API_CONFIG, API_ENDPOINTS, getAuthHeaders, API_LIMITS } from './config.js';

const apiClient = axios.create({
  baseURL: API_CONFIG.GITHUB_BASE_URL,
  headers: getAuthHeaders(),
});

let rateLimitInfo = {
  remaining: API_LIMITS.UNAUTHENTICATED,
  resetTime: null,
};

apiClient.interceptors.response.use(
  (response) => {
    const remaining = response.headers['x-ratelimit-remaining'];
    const reset = response.headers['x-ratelimit-reset'];
    if (remaining !== undefined) {
      rateLimitInfo.remaining = parseInt(remaining);
      rateLimitInfo.resetTime = parseInt(reset) * 1000;
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 403 && error.response?.headers['x-ratelimit-remaining'] === '0') {
      const resetTime = parseInt(error.response.headers['x-ratelimit-reset']) * 1000;
      const waitTime = Math.ceil((resetTime - Date.now()) / 1000);
      throw new Error(`Rate limit exceeded. Please wait ${waitTime} seconds.`);
    }
    throw error;
  }
);

export const githubApi = {
  async getUser(username) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.user(username));
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error(`User "${username}" not found on GitHub`);
      }
      throw error;
    }
  },

  async getUserRepos(username, sort = 'stars', order = 'desc') {
    try {
      const response = await apiClient.get(API_ENDPOINTS.userRepos(username), {
        params: {
          sort,
          order,
          per_page: 100,
          type: 'all',
        },
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error(`Repositories for "${username}" not found`);
      }
      throw error;
    }
  },

  async getRepoDetails(owner, repo) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.repo(owner, repo));
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error(`Repository "${owner}/${repo}" not found`);
      }
      throw error;
    }
  },

  async searchUsers(query) {
    try {
      const response = await apiClient.get('/search/users', {
        params: {
          q: query,
          per_page: 10,
          sort: 'followers',
          order: 'desc',
        },
      });
      return response.data.items;
    } catch (error) {
      throw error;
    }
  },

  getRateLimitInfo() {
    return rateLimitInfo;
  },

  async getUserWithStats(username) {
    try {
      const [user, repos] = await Promise.all([
        this.getUser(username),
        this.getUserRepos(username),
      ]);

      const stats = this.calculateStats(user, repos);
      return { ...user, ...stats };
    } catch (error) {
      throw error;
    }
  },

  calculateStats(user, repos) {
    const stats = {
      total_stars: 0,
      total_forks: 0,
      most_used_language: null,
      languages: {},
      public_repos_count: repos.length,
      avg_stars_per_repo: 0,
      top_repositories: [],
    };

    if (!repos || repos.length === 0) {
      return stats;
    }

    repos.forEach((repo) => {
      stats.total_stars += repo.stargazers_count || 0;
      stats.total_forks += repo.forks_count || 0;

      if (repo.language) {
        stats.languages[repo.language] = (stats.languages[repo.language] || 0) + 1;
      }
    });

    stats.avg_stars_per_repo = Math.round(stats.total_stars / repos.length);

    const languageEntries = Object.entries(stats.languages).sort((a, b) => b[1] - a[1]);
    stats.most_used_language = languageEntries.length > 0 ? languageEntries[0][0] : null;

    stats.top_repositories = repos
      .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
      .slice(0, 10);

    return stats;
  },

  calculatePortfolioScore(user, repos) {
    let score = 50;

    if (user.followers > 100) score += 10;
    if (user.followers > 1000) score += 10;
    if (user.followers > 10000) score += 5;

    if (user.public_repos > 5) score += 5;
    if (user.public_repos > 10) score += 5;
    if (user.public_repos > 20) score += 5;

    const stats = this.calculateStats(user, repos);
    if (stats.total_stars > 100) score += 10;
    if (stats.total_stars > 500) score += 10;
    if (stats.total_stars > 1000) score += 5;

    const languages = Object.keys(stats.languages);
    if (languages.length > 3) score += 10;
    if (languages.length > 5) score += 5;

    const hasReadme = repos.some((r) => r.description && r.description.length > 10);
    if (hasReadme) score += 5;

    return Math.min(Math.max(score, 0), 100);
  },
};
