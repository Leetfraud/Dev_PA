import mongoose from 'mongoose';

const searchHistorySchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  searchedAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  ipAddress: String,
  userAgent: String,
}, {
  timestamps: true,
});

searchHistorySchema.index({ username: 1, searchedAt: -1 });
searchHistorySchema.index({ searchedAt: -1 });

export default mongoose.model('SearchHistory', searchHistorySchema);
