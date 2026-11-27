import express from 'express';
import {
  loginGovernment,
  getDashboardStats,
  updateReportStatus,
  getWards,
  getDepartments,
  getAuditLogs
} from '../controllers/governmentController.js';
import { protectGovernment } from '../middleware/auth.js';

const router = express.Router();

// Public auth for government officers
router.post('/login', loginGovernment);

// Protected routes for authorized officials
router.get('/dashboard/stats', protectGovernment, getDashboardStats);
router.patch('/reports/:trackingId/status', protectGovernment, updateReportStatus);
router.get('/wards', protectGovernment, getWards);
router.get('/departments', protectGovernment, getDepartments);
router.get('/audit-logs', protectGovernment, getAuditLogs);

export default router;
