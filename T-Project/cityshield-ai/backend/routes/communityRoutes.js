import express from 'express';
import {
  getCommunityPosts,
  createCommunityPost,
  voteCommunityPost,
  addCommentToPost
} from '../controllers/communityController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/posts', getCommunityPosts);
router.post('/posts', optionalAuth, createCommunityPost);
router.post('/posts/:postId/vote', optionalAuth, voteCommunityPost);
router.post('/posts/:postId/comments', optionalAuth, addCommentToPost);

export default router;
