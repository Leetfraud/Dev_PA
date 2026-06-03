import axios from 'axios';
import { config } from '../config/env.js';

class GitHubService {
  constructor() {
    this.client = axios.create({
      baseURL: 'https://api.github.com',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        ...(config.githubToken && { 'Authorization': `token ${config.githubToken}` }),
      },
      timeout: 10000,
    });

    this.rateLimitInfo = {
      remaining: config.githubToken ? 5000 : 60,
      resetTime: null,
    };

    this.client.interceptors.response.use(
      (response) => {
        const remaining = response.headers['x-ratelimit-remaining'];
        const reset = response.headers['x-ratelimit-reset'];
        if (remaining !== undefined) {
          this.rateLimitInfo.remaining = parseInt(remaining);
          this.rateLimitInfo.resetTime = parseInt(reset) * 1000;
        }
        return response;
      },
      (error) => {
        if (error.response?.status === 403 && error.response?.headers['x-ratelimit-remaining'] === '0') {
          const resetTime = parseInt(error.response.headers['x-ratelimit-reset']) * 1000;
          const waitTime = Math.ceil((resetTime - Date.now()) / 1000);
          throw new Error(`GitHub rate limit exceeded. Resets in ${waitTime} seconds.`);
        }
        throw error;
      }
    );
  }

  async getUser(username) {
    try {
      const response = await this.client.get(`/users/${username}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error(`User "${username}" not found on GitHub`);
      }
      throw new Error(`Failed to fetch user: ${error.message}`);
    }
  }

  async getUserRepos(username) {
    try {
      const repos = [];
      let page = 1;
      const perPage = 100;

      while (true) {
        const response = await this.client.get(`/users/${username}/repos`, {
          params: {
            sort: 'updated',
            per_page: perPage,
            page,
            type: 'all',
          },
        });

        repos.push(...response.data);

        if (response.data.length < perPage) break;
        page++;
        if (page > 10) break; // Safety limit
      }

      return repos;
    } catch (error) {
      throw new Error(`Failed to fetch repositories: ${error.message}`);
    }
  }

  async getRepoReadme(owner, repo) {
    try {
      await this.client.get(`/repos/${owner}/${repo}/readme`);
      return true;
    } catch (error) {
      return false;
    }
  }

  async getRepoLicense(owner, repo) {
    try {
      const response = await this.client.get(`/repos/${owner}/${repo}/license`);
      return response.data ? true : false;
    } catch (error) {
      return false;
    }
  }

  async enrichRepositories(repos, username) {
    const enrichedRepos = await Promise.all(
      repos.slice(0, 30).map(async (repo) => {
        try {
          const [hasReadme, hasLicense] = await Promise.all([
            this.getRepoReadme(username, repo.name),
            this.getRepoLicense(username, repo.name),
          ]);

          return {
            ...repo,
            has_readme: hasReadme,
            has_license: hasLicense,
          };
        } catch (error) {
          return {
            ...repo,
            has_readme: false,
            has_license: false,
          };
        }
      })
    );

    const remainingRepos = repos.slice(30).map(repo => ({
      ...repo,
      has_readme: false,
      has_license: false,
    }));

    return [...enrichedRepos, ...remainingRepos];
  }

  getRateLimitInfo() {
    return this.rateLimitInfo;
  }
}

export default new GitHubService();
