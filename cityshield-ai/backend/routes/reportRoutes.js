import express from 'express';
import {
  createReport,
  getReports,
  getReportByTrackingId,
  upvoteReport,
  verifyReport
} from '../controllers/reportController.js';
import { optionalAuth, protectCitizen } from '../middleware/auth.js';
import { uploadMedia, sanitizeMediaPrivacy } from '../middleware/upload.js';

const router = express.Router();

router.post('/', optionalAuth, uploadMedia.array('media', 5), sanitizeMediaPrivacy, createReport);
router.get('/', getReports);
router.get('/:trackingId', getReportByTrackingId);
router.post('/:trackingId/upvote', optionalAuth, upvoteReport);
router.post('/:trackingId/verify', optionalAuth, verifyReport);

export default router;
