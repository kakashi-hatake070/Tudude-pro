import React from 'react';
import { HazardCategory, ReportStatus, ReportPriority } from '../types';
import { Droplet, CircleAlert, Trash2, Construction, Lightbulb, Waves, Car, Wrench } from 'lucide-react';

interface CategoryBadgeProps {
  category: HazardCategory;
  showIcon?: boolean;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, showIcon = true }) => {
  const configs: Record<HazardCategory, { label: string; bg: string; text: string; icon: any }> = {
    waterlogging: { label: 'Waterlogging', bg: 'bg-blue-100', text: 'text-blue-800', icon: Droplet },
    potholes: { label: 'Pothole', bg: 'bg-amber-100', text: 'text-amber-800', icon: CircleAlert },
    garbage: { label: 'Garbage Dump', bg: 'bg-emerald-100', text: 'text-emerald-800', icon: Trash2 },
    damaged_roads: { label: 'Damaged Road', bg: 'bg-orange-100', text: 'text-orange-800', icon: Construction },
    streetlights: { label: 'Dark Streetlight', bg: 'bg-purple-100', text: 'text-purple-800', icon: Lightbulb },
    drainage: { label: 'Drainage Issue', bg: 'bg-cyan-100', text: 'text-cyan-800', icon: Waves },
    accidents: { label: 'Accident Prone', bg: 'bg-rose-100', text: 'text-rose-800', icon: Car },
    public_infrastructure: { label: 'Infrastructure', bg: 'bg-slate-100', text: 'text-slate-800', icon: Wrench },
    other: { label: 'Other Hazard', bg: 'bg-gray-100', text: 'text-gray-800', icon: CircleAlert }
  };

  const config = configs[category] || configs.other;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
      {showIcon && <Icon className="w-3 h-3" />}
      <span>{config.label}</span>
    </span>
  );
};

export const StatusBadge: React.FC<{ status: ReportStatus }> = ({ status }) => {
  const map: Record<ReportStatus, { label: string; className: string }> = {
    submitted: { label: 'Submitted', className: 'bg-blue-50 text-blue-700 border-blue-200' },
    under_review: { label: 'Under Review', className: 'bg-amber-50 text-amber-700 border-amber-200' },
    verified: { label: 'Verified', className: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    assigned: { label: 'Assigned', className: 'bg-purple-50 text-purple-700 border-purple-200' },
    in_progress: { label: 'In Progress', className: 'bg-secondary-light text-secondary border-secondary/30' },
    resolved: { label: 'Resolved', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    rejected: { label: 'Rejected', className: 'bg-slate-100 text-slate-600 border-slate-200' },
    reopened: { label: 'Reopened', className: 'bg-rose-50 text-rose-700 border-rose-200' }
  };

  const item = map[status] || map.submitted;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${item.className}`}>
      {item.label}
    </span>
  );
};

export const RiskBadge: React.FC<{ score: number }> = ({ score }) => {
  let color = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  let label = 'Low Risk';

  if (score >= 70) {
    color = 'bg-rose-50 text-rose-700 border-rose-200';
    label = 'Critical Risk';
  } else if (score >= 40) {
    color = 'bg-amber-50 text-amber-700 border-amber-200';
    label = 'Moderate Risk';
  }

  return (
    <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-xs font-bold border ${color}`}>
      <span>{score}/100</span>
      <span>•</span>
      <span>{label}</span>
    </span>
  );
};
