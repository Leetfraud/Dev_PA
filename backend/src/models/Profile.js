import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  githubData: {
    login: String,
    name: String,
    avatar_url: String,
    bio: String,
    location: String,
    email: String,
    blog: String,
    twitter_username: String,
    company: String,
    public_repos: Number,
    public_gists: Number,
    followers: Number,
    following: Number,
    created_at: Date,
    updated_at: Date,
  },
  repositories: [{
    id: Number,
    name: String,
    full_name: String,
    description: String,
    url: String,
    homepage: String,
    language: String,
    stargazers_count: Number,
    forks_count: Number,
    watchers_count: Number,
    open_issues_count: Number,
    size: Number,
    created_at: Date,
    updated_at: Date,
    pushed_at: Date,
    topics: [String],
    has_readme: Boolean,
    has_license: Boolean,
  }],
  analytics: {
    total_stars: Number,
    total_forks: Number,
    portfolio_score: Number,
    activity_score: Number,
    documentation_score: Number,
    popularity_score: Number,
    stack_maturity_score: Number,
    primary_stack: String,
    languages: mongoose.Schema.Types.Mixed,
    top_repositories: [mongoose.Schema.Types.Mixed],
  },
  cachedAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  lastAccessed: {
    type: Date,
    default: Date.now,
  },
  accessCount: {
    type: Number,
    default: 1,
  },
}, {
  timestamps: true,
});

profileSchema.index({ cachedAt: 1 });
profileSchema.index({ username: 1, cachedAt: -1 });

profileSchema.methods.isCacheValid = function(hours = 24) {
  const now = new Date();
  const cacheAge = (now - this.cachedAt) / (1000 * 60 * 60);
  return cacheAge < hours;
};

profileSchema.methods.updateAccess = function() {
  this.lastAccessed = new Date();
  this.accessCount += 1;
  return this.save();
};

export default mongoose.model('Profile', profileSchema);
