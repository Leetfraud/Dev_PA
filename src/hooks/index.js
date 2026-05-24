import { useState, useCallback, useEffect } from 'react';
import { githubApi } from '../services/githubApi.js';

export const useFetch = (fetchFn, initialData = null) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn(...args);
      setData(result);
      return result;
    } catch (err) {
      const errorMsg = err.message || 'An error occurred';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  return { data, loading, error, execute };
};

export const useGitHub = () => {
  const userFetch = useFetch(githubApi.getUser);
  const reposFetch = useFetch(githubApi.getUserRepos);
  const statsFetch = useFetch(githubApi.getUserWithStats);

  const getUser = useCallback(async (username) => {
    return userFetch.execute(username);
  }, [userFetch]);

  const getRepos = useCallback(async (username) => {
    return reposFetch.execute(username);
  }, [reposFetch]);

  const getUserStats = useCallback(async (username) => {
    return statsFetch.execute(username);
  }, [statsFetch]);

  return {
    getUser,
    getRepos,
    getUserStats,
    user: userFetch.data,
    repos: reposFetch.data,
    stats: statsFetch.data,
    loading: userFetch.loading || reposFetch.loading || statsFetch.loading,
    error: userFetch.error || reposFetch.error || statsFetch.error,
  };
};

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error('Error writing to localStorage:', error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
};

export const useSearchHistory = (maxItems = 10) => {
  const [history, setHistory] = useLocalStorage('github_search_history', []);

  const addToHistory = useCallback((username) => {
    setHistory((prev) => {
      const filtered = prev.filter((item) => item !== username);
      const newHistory = [username, ...filtered];
      return newHistory.slice(0, maxItems);
    });
  }, [setHistory, maxItems]);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, [setHistory]);

  return { history, addToHistory, clearHistory };
};

export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};
