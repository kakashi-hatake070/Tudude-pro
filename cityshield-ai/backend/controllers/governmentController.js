import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import GovernmentOfficer from '../models/GovernmentOfficer.js';
import IssueReport from '../models/IssueReport.js';
import Department from '../models/Department.js';
import Ward from '../models/Ward.js';
import AuditLog from '../models/AuditLog.js';

const JWT_SECRET = process.env.JWT_SECRET || 'cityshield-super-secure-jwt-secret-2026';

export const loginGovernment = async (req, res) => {
  try {
    const { email, officialId, password } = req.body;

    const query = email ? { email } : { officialId };
    const officer = await GovernmentOfficer.findOne(query).populate('department').populate('ward');

    if (!officer) {
      return res.status(401).json({ success: false, message: 'Invalid official credentials.' });
    }

    const isMatch = await bcrypt.compare(password, officer.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid official credentials.' });
    }

    const token = jwt.sign(
      {
        id: officer._id,
        officialId: officer.officialId,
        role: officer.role,
        department: officer.department?._id
      },
      JWT_SECRET,
      { expiresIn: '12h' }
    );

    res.json({
      success: true,
      token,
      officer: {
        id: officer._id,
        officialId: officer.officialId,
        name: officer.name,
        email: officer.email,
        role: officer.role,
        department: officer.department,
        ward: officer.ward,
        jurisdictionName: officer.jurisdictionName
      }
    });
  } catch (error) {
    console.error('Government login error:', error);
    res.status(500).json({ success: false, message: 'Server error during government login.' });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const totalReports = await IssueReport.countDocuments();
    const pendingReports = await IssueReport.countDocuments({ status: { $in: ['submitted', 'under_review', 'verified', 'assigned', 'in_progress'] } });
    const resolvedReports = await IssueReport.countDocuments({ status: 'resolved' });
    const highRiskReports = await IssueReport.countDocuments({ riskScore: { $gte: 65 } });

    // Category breakdown
    const categoryStats = await IssueReport.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // Ward statistics
    const wardStats = await Ward.find().select('wardNumber name zone statistics');

    // Department performance
    const departments = await Department.find();
    const departmentPerformance = await Promise.all(departments.map(async (d) => {
      const assignedCount = await IssueReport.countDocuments({ assignedDepartment: d._id });
      const resolvedCount = await IssueReport.countDocuments({ assignedDepartment: d._id, status: 'resolved' });
      return {
        id: d._id,
        name: d.name,
        code: d.code,
        slaHours: d.slaHours,
        assignedCount,
        resolvedCount,
        resolutionRate: assignedCount > 0 ? Math.round((resolvedCount / assignedCount) * 100) : 100
      };
    }));

    // Recent critical reports
    const criticalReports = await IssueReport.find({ riskScore: { $gte: 70 } })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        totalReports,
        pendingReports,
        resolvedReports,
        highRiskReports,
        resolutionPercentage: totalReports > 0 ? Math.round((resolvedReports / totalReports) * 100) : 0,
        categoryStats,
        wardStats,
        departmentPerformance,
        criticalReports
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateReportStatus = async (req, res) => {
  try {
    const { trackingId } = req.params;
    const {
      status,
      assignedDepartmentId,
      assignedOfficerId,
      priority,
      remarks,
      resolutionProofUrls
    } = req.body;

    const report = await IssueReport.findOne({ trackingId });
    if (!report) {
      return res.status(404).json({ success: false, message: 'Civic report not found.' });
    }

    const previousStatus = report.status;

    if (status) report.status = status;
    if (priority) report.priority = priority;
    if (assignedDepartmentId) report.assignedDepartment = assignedDepartmentId;
    if (assignedOfficerId) report.assignedOfficer = assignedOfficerId;

    if (status === 'resolved') {
      report.resolutionProof = {
        mediaUrls: resolutionProofUrls || [],
        remarks: remarks || 'Resolved and verified by civic municipal team.',
        resolvedAt: new Date(),
        resolvedBy: req.officer.name
      };
    }

    report.auditTrail.push({
      action: `STATUS_CHANGE_TO_${status?.toUpperCase() || 'UPDATED'}`,
      changedBy: `${req.officer.name} (${req.officer.role})`,
      previousStatus,
      newStatus: report.status,
      remarks: remarks || 'Updated through Municipal Admin Console.',
      timestamp: new Date()
    });

    await report.save();

    // Log to audit log
    await AuditLog.create({
      entityType: 'IssueReport',
      entityId: report.trackingId,
      performedBy: req.officer.officialId,
      role: req.officer.role,
      action: 'UPDATE_REPORT_STATUS',
      details: { previousStatus, newStatus: report.status, remarks }
    });

    // Emit live real-time update to citizens via socket
    if (req.app.get('io')) {
      const io = req.app.get('io');
      io.emit('report_status_updated', {
        trackingId: report.trackingId,
        status: report.status,
        remarks: remarks || 'Status updated',
        updatedAt: report.updatedAt
      });
    }

    res.json({ success: true, message: 'Report updated successfully.', report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getWards = async (req, res) => {
  try {
    const wards = await Ward.find().populate('officerInCharge', 'name officialId');
    res.json({ success: true, wards });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    res.json({ success: true, departments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(100);
    res.json({ success: true, logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
