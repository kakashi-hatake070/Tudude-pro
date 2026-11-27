import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  commentId: {
    type: String,
    required: true
  },
  authorAnonymousId: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  upvotes: {
    type: Number,
    default: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const communityPostSchema = new mongoose.Schema({
  postId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  authorAnonymousId: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['waterlogging', 'roads', 'safety', 'sanitation', 'general', 'civic_ideas'],
    default: 'general',
    index: true
  },
  flair: {
    type: String,
    enum: ['Hazard Alert', 'Discussion', 'Solution Idea', 'Cleanup Drive', 'Official Complaint', 'Monsoon Watch'],
    default: 'Discussion'
  },
  locationTag: {
    type: String,
    default: 'City-wide'
  },
  upvotes: {
    type: Number,
    default: 1
  },
  upvotedBy: [{
    type: String
  }],
  downvotes: {
    type: Number,
    default: 0
  },
  downvotedBy: [{
    type: String
  }],
  commentsCount: {
    type: Number,
    default: 0
  },
  comments: [commentSchema]
}, {
  timestamps: true
});

communityPostSchema.index({ createdAt: -1 });
communityPostSchema.index({ upvotes: -1 });

export default mongoose.model('CommunityPost', communityPostSchema);
