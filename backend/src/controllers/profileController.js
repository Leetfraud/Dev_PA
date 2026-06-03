import Profile from '../models/Profile.js';
import SearchHistory from '../models/SearchHistory.js';
import githubService from '../services/githubService.js';
import analyticsService from '../services/analyticsService.js';
import aiService from '../services/aiService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { config } from '../config/env.js';

export const getProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const { force } = req.query;

  if (!username || username.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: 'Username is required',
    });
  }

  const normalizedUsername = username.toLowerCase().trim();

  let profile = await Profile.findOne({ username: normalizedUsername });

  if (profile && !force && profile.isCacheValid(config.profileCacheHours)) {
    await profile.updateAccess();
    
    return res.json({
      success: true,
      data: profile,
      cached: true,
      cacheAge: Math.round((Date.now() - profile.cachedAt) / (1000 * 60)),
    });
  }

  const startTime = Date.now();

  const [githubUser, repositories] = await Promise.all([
    githubService.getUser(normalizedUsername),
    githubService.getUserRepos(normalizedUsername),
  ]);

  const enrichedRepos = await githubService.enrichRepositories(repositories, normalizedUsername);

  const analytics = analyticsService.generateAnalytics(githubUser, enrichedRepos);

  const profileData = {
    username: normalizedUsername,
    githubData: {
      login: githubUser.login,
      name: githubUser.name,
      avatar_url: githubUser.avatar_url,
      bio: githubUser.bio,
      location: githubUser.location,
      email: githubUser.email,
      blog: githubUser.blog,
      twitter_username: githubUser.twitter_username,
      company: githubUser.company,
      public_repos: githubUser.public_repos,
      public_gists: githubUser.public_gists,
      followers: githubUser.followers,
      following: githubUser.following,
      created_at: githubUser.created_at,
      updated_at: githubUser.updated_at,
    },
    repositories: enrichedRepos.map(repo => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
      url: repo.html_url,
      homepage: repo.homepage,
      language: repo.language,
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
      watchers_count: repo.watchers_count,
      open_issues_count: repo.open_issues_count,
      size: repo.size,
      created_at: repo.created_at,
      updated_at: repo.updated_at,
      pushed_at: repo.pushed_at,
      topics: repo.topics || [],
      has_readme: repo.has_readme,
      has_license: repo.has_license,
    })),
    analytics,
    cachedAt: new Date(),
  };

  if (profile) {
    Object.assign(profile, profileData);
    await profile.save();
  } else {
    profile = await Profile.create(profileData);
  }

  await SearchHistory.create({
    username: normalizedUsername,
    ipAddress: req.ip,
    userAgent: req.get('user-agent'),
  });

  const responseTime = Date.now() - startTime;

  res.json({
    success: true,
    data: profile,
    cached: false,
    responseTime: `${responseTime}ms`,
  });
});

export const compareProfiles = asyncHandler(async (req, res) => {
  const { usernameA, usernameB } = req.query;

  if (!usernameA || !usernameB) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: 'Both usernameA and usernameB are required',
    });
  }

  const [profileA, profileB] = await Promise.all([
    Profile.findOne({ username: usernameA.toLowerCase() }),
    Profile.findOne({ username: usernameB.toLowerCase() }),
  ]);

  if (!profileA || !profileB) {
    return res.status(404).json({
      success: false,
      error: 'Not Found',
      message: 'One or both profiles not found. Please fetch them first.',
    });
  }

  const comparison = analyticsService.compareProfiles(profileA, profileB);

  res.json({
    success: true,
    data: {
      profileA: {
        username: profileA.username,
        name: profileA.githubData.name,
        avatar: profileA.githubData.avatar_url,
        score: profileA.analytics.portfolio_score,
        stars: profileA.analytics.total_stars,
        forks: profileA.analytics.total_forks,
        followers: profileA.githubData.followers,
        repos: profileA.githubData.public_repos,
      },
      profileB: {
        username: profileB.username,
        name: profileB.githubData.name,
        avatar: profileB.githubData.avatar_url,
        score: profileB.analytics.portfolio_score,
        stars: profileB.analytics.total_stars,
        forks: profileB.analytics.total_forks,
        followers: profileB.githubData.followers,
        repos: profileB.githubData.public_repos,
      },
      comparison,
    },
  });
});

export const getSuggestions = asyncHandler(async (req, res) => {
  const { username } = req.params;

  const profile = await Profile.findOne({ username: username.toLowerCase() });

  if (!profile) {
    return res.status(404).json({
      success: false,
      error: 'Not Found',
      message: 'Profile not found. Please fetch the profile first.',
    });
  }

  const suggestions = await aiService.generateSuggestions(profile);

  res.json({
    success: true,
    data: {
      username: profile.username,
      current_score: profile.analytics.portfolio_score,
      potential_score: Math.min(
        100,
        profile.analytics.portfolio_score + 
        suggestions.reduce((sum, s) => sum + parseInt(s.impact.match(/\d+/)?.[0] || 0), 0)
      ),
      suggestions,
    },
  });
});

export const getSearchHistory = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;

  const history = await SearchHistory.find()
    .sort({ searchedAt: -1 })
    .limit(parseInt(limit))
    .select('username searchedAt');

  const uniqueUsernames = [...new Set(history.map(h => h.username))];

  res.json({
    success: true,
    data: {
      recent: history,
      unique: uniqueUsernames,
    },
  });
});

export const getRateLimitStatus = asyncHandler(async (req, res) => {
  const rateLimitInfo = githubService.getRateLimitInfo();

  res.json({
    success: true,
    data: {
      remaining: rateLimitInfo.remaining,
      resetTime: rateLimitInfo.resetTime,
      resetIn: rateLimitInfo.resetTime 
        ? Math.ceil((rateLimitInfo.resetTime - Date.now()) / 1000) 
        : null,
    },
  });
});
