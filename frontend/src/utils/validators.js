export const validateGitHubUsername = (username) => {
  if (!username) return { valid: false, error: 'Username is required' };

  const trimmed = username.trim();

  if (trimmed.length < 1) {
    return { valid: false, error: 'Username cannot be empty' };
  }

  if (trimmed.length > 39) {
    return { valid: false, error: 'Username cannot exceed 39 characters' };
  }

  if (!/^[a-zA-Z0-9-]+$/.test(trimmed)) {
    return { valid: false, error: 'Username can only contain letters, numbers, and hyphens' };
  }

  if (trimmed.startsWith('-') || trimmed.endsWith('-')) {
    return { valid: false, error: 'Username cannot start or end with a hyphen' };
  }

  if (trimmed.includes('--')) {
    return { valid: false, error: 'Username cannot contain consecutive hyphens' };
  }

  return { valid: true, error: null };
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isValidUser = (user) => {
  return user && typeof user === 'object' && user.login && user.id;
};

export const isValidRepo = (repo) => {
  return repo && typeof repo === 'object' && repo.name && repo.owner;
};
