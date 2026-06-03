import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    console.error('API Error:', message);
    throw new Error(message);
  }
);

export const backendApi = {
  /**
   * Get GitHub profile with analytics
   * @param {string} username - GitHub username
   * @param {boolean} force - Force refresh cache
   * @returns {Promise<Object>} Profile data with analytics
   */
  async getProfile(username, force = false) {
    const response = await apiClient.get(`/profile/${username}`, {
      params: { force },
    });
    return response.data;
  },

  /**
   * Compare two GitHub profiles
   * @param {string} usernameA - First username
   * @param {string} usernameB - Second username
   * @returns {Promise<Object>} Comparison data
   */
  async compareProfiles(usernameA, usernameB) {
    const response = await apiClient.get('/compare', {
      params: { usernameA, usernameB },
    });
    return response.data;
  },

  /**
   * Get AI-powered improvement suggestions
   * @param {string} username - GitHub username
   * @returns {Promise<Object>} Suggestions data
   */
  async getSuggestions(username) {
    const response = await apiClient.get(`/suggestions/${username}`);
    return response.data;
  },

  /**
   * Get recent search history
   * @param {number} limit - Number of results
   * @returns {Promise<Object>} Search history
   */
  async getSearchHistory(limit = 10) {
    const response = await apiClient.get('/history', {
      params: { limit },
    });
    return response.data;
  },

  /**
   * Get GitHub API rate limit status
   * @returns {Promise<Object>} Rate limit info
   */
  async getRateLimitStatus() {
    const response = await apiClient.get('/rate-limit');
    return response.data;
  },

  /**
   * Health check
   * @returns {Promise<Object>} Server health status
   */
  async healthCheck() {
    const response = await apiClient.get('/health');
    return response.data;
  },
};

export default backendApi;
