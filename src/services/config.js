export const API_CONFIG = {
  GITHUB_BASE_URL: 'https://api.github.com',
  GITHUB_TOKEN: import.meta.env.VITE_GITHUB_TOKEN || null,
};

export const API_ENDPOINTS = {
  user: (username) => `/users/${username}`,
  userRepos: (username) => `/users/${username}/repos`,
  repo: (owner, repo) => `/repos/${owner}/${repo}`,
  userEvents: (username) => `/users/${username}/events/public`,
};

export const getAuthHeaders = () => {
  const headers = {
    Accept: 'application/vnd.github.v3+json',
  };
  if (API_CONFIG.GITHUB_TOKEN) {
    headers.Authorization = `token ${API_CONFIG.GITHUB_TOKEN}`;
  }
  return headers;
};

export const API_LIMITS = {
  UNAUTHENTICATED: 60,
  AUTHENTICATED: 5000,
  RESET_INTERVAL: 3600,
};
