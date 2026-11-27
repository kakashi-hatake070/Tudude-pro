import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { DepartmentData } from '../../types';
import { Building2, Phone, Mail, Clock, CheckCircle } from 'lucide-react';

export const GovernmentDepartments: React.FC = () => {
  const [departments, setDepartments] = useState<DepartmentData[]>([]);

  useEffect(() => {
    api.getDepartments().then(res => setDepartments(res.departments || [])).catch(e => console.error(e));
  }, []);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Municipal Departments & SLA Directory</h1>
          <p className="text-xs text-text-muted mt-0.5">Contact coordinates and resolution turnaround mandates.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((d) => (
            <div key={d._id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-mono font-bold text-primary">{d.code}</span>
                <span className="px-2 py-0.5 bg-blue-50 text-primary font-bold rounded-full text-[10px]">
                  SLA {d.slaHours} Hours
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-sm text-slate-900">{d.name}</h3>
                <p className="text-slate-600 mt-1 leading-relaxed">{d.description}</p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-100 text-slate-700">
                <div className="flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-text-muted" />
                  <span>{d.contactEmail}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-text-muted" />
                  <span>{d.contactPhone}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {d.categoriesHandled?.map(c => (
                  <span key={c} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[10px] font-semibold">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
