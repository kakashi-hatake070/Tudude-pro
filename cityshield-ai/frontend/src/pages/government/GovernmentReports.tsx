import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { IssueReport, DepartmentData } from '../../types';
import { StatusBadge, CategoryBadge, RiskBadge } from '../../components/HazardBadge';
import { CheckCircle, AlertTriangle, Filter, Search, ArrowRight, RefreshCw } from 'lucide-react';

export const GovernmentReports: React.FC = () => {
  const [reports, setReports] = useState<IssueReport[]>([]);
  const [departments, setDepartments] = useState<DepartmentData[]>([]);
  const [selectedReport, setSelectedReport] = useState<IssueReport | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Status update form state
  const [newStatus, setNewStatus] = useState('in_progress');
  const [newPriority, setNewPriority] = useState('high');
  const [assignedDept, setAssignedDept] = useState('');
  const [remarks, setRemarks] = useState('');
  const [proofUrl, setProofUrl] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await api.getReports({
        status: statusFilter,
        category: categoryFilter,
        limit: 100
      });
      setReports(res.reports || []);

      const deptRes = await api.getDepartments();
      setDepartments(deptRes.departments || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [statusFilter, categoryFilter]);

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport) return;

    setUpdating(true);
    try {
      await api.updateReportStatus(selectedReport.trackingId, {
        status: newStatus,
        priority: newPriority,
        assignedDepartmentId: assignedDept || undefined,
        remarks: remarks || `Status transitioned to ${newStatus} by officer.`,
        resolutionProofUrls: proofUrl ? [proofUrl] : undefined
      });

      alert(`Report ${selectedReport.trackingId} successfully updated!`);
      setSelectedReport(null);
      fetchReports();
    } catch (e: any) {
      alert(e.message || 'Failed to update report status');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header & Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Municipal Complaint Resolution Queue</h1>
            <p className="text-xs text-text-muted mt-0.5">Assign divisions, update progress, and upload resolution proof.</p>
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-800"
            >
              <option value="all">All Categories</option>
              <option value="waterlogging">Waterlogging</option>
              <option value="potholes">Potholes</option>
              <option value="garbage">Garbage</option>
              <option value="damaged_roads">Damaged Roads</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-800"
            >
              <option value="all">All Statuses</option>
              <option value="submitted">Submitted</option>
              <option value="verified">Verified</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>

            <button
              onClick={fetchReports}
              className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-primary' : ''}`} />
            </button>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Table / List */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center text-xs font-bold text-slate-700">
              <span>Civic Reports ({reports.length})</span>
              <span className="text-text-muted">Click any to manage</span>
            </div>

            <div className="divide-y divide-slate-100 max-h-[650px] overflow-y-auto">
              {reports.map((report) => (
                <div
                  key={report.trackingId}
                  onClick={() => {
                    setSelectedReport(report);
                    setNewStatus(report.status);
                    setNewPriority(report.priority);
                    setAssignedDept(report.assignedDepartment?._id || '');
                  }}
                  className={`p-4 cursor-pointer transition-colors text-xs space-y-1.5 ${
                    selectedReport?.trackingId === report.trackingId ? 'bg-primary-light/40 border-l-4 border-primary' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-slate-700">{report.trackingId}</span>
                      <CategoryBadge category={report.category} />
                      <StatusBadge status={report.status} />
                    </div>
                    <RiskBadge score={report.riskScore} />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{report.title}</h4>
                  <div className="text-[11px] text-text-muted">{report.address} • Ward {report.wardNumber}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Action / Management Panel */}
          <div className="lg:col-span-5">
            {selectedReport ? (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-5 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="font-mono font-bold text-primary">{selectedReport.trackingId}</span>
                    <h3 className="font-extrabold text-sm text-slate-900 mt-0.5">{selectedReport.title}</h3>
                  </div>
                  <StatusBadge status={selectedReport.status} />
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="font-bold text-slate-800">Citizen Description:</span>
                  <p className="text-slate-600 leading-relaxed">{selectedReport.description}</p>
                </div>

                {/* Status Update Form */}
                <form onSubmit={handleUpdateStatus} className="space-y-4">
                  <div>
                    <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
                      Transition Status
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900"
                    >
                      <option value="submitted">Submitted</option>
                      <option value="under_review">Under Review</option>
                      <option value="verified">Verified</option>
                      <option value="assigned">Assigned</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved (Requires Proof)</option>
                      <option value="rejected">Rejected</option>
                      <option value="reopened">Reopened</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
                      Priority Level
                    </label>
                    <select
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
                      Assigned Municipal Department
                    </label>
                    <select
                      value={assignedDept}
                      onChange={(e) => setAssignedDept(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-900"
                    >
                      <option value="">Select Department...</option>
                      {departments.map((d) => (
                        <option key={d._id} value={d._id}>{d.name} ({d.code})</option>
                      ))}
                    </select>
                  </div>

                  {newStatus === 'resolved' && (
                    <div>
                      <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
                        Resolution Photo Proof URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://... photo proof of repaired road"
                        value={proofUrl}
                        onChange={(e) => setProofUrl(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
                      Official Remarks & Log
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Dewatering pump team dispatched; road patch scheduled."
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={updating}
                    className="w-full py-3 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-md transition-all"
                  >
                    {updating ? 'Updating Action Log...' : 'Confirm Action & Log Audit Trail'}
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-soft text-center text-xs text-text-muted space-y-2">
                <CheckCircle className="w-8 h-8 text-slate-300 mx-auto" />
                <p>Select any complaint from the queue to view details and assign work orders.</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
