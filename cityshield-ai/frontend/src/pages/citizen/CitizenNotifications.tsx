import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, Droplets, CheckCircle, Clock } from 'lucide-react';
import { socket } from '../../services/socket';

export const CitizenNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([
    {
      id: 1,
      title: 'Monsoon Alert: Yellow Warning Active',
      message: 'IMD Doppler Radar reports active convective rainfall. Silk Board and Koramangala underpass risk level elevated.',
      time: '12m ago',
      type: 'weather'
    },
    {
      id: 2,
      title: 'Report CS-2026-1001 In Progress',
      message: 'Stormwater Drainage team dispatched diesel pump to dewater Silk Board junction ramp.',
      time: '45m ago',
      type: 'status'
    },
    {
      id: 3,
      title: 'Road Rectified on Museum Road',
      message: 'Bitumen resurfacing completed on Museum Rd. Status marked Verified Resolved.',
      time: '2h ago',
      type: 'resolved'
    }
  ]);

  useEffect(() => {
    // Listen to real-time events
    socket.on('new_hazard_reported', (data) => {
      setNotifications(prev => [
        {
          id: Date.now(),
          title: `New Hazard: ${data.title}`,
          message: `Category: ${data.category} • Risk Score: ${data.riskScore}/100`,
          time: 'Just now',
          type: 'hazard'
        },
        ...prev
      ]);
    });

    socket.on('report_status_updated', (data) => {
      setNotifications(prev => [
        {
          id: Date.now(),
          title: `Report ${data.trackingId} Updated`,
          message: `Status transitioned to ${data.status}: ${data.remarks}`,
          time: 'Just now',
          type: 'status'
        },
        ...prev
      ]);
    });

    return () => {
      socket.off('new_hazard_reported');
      socket.off('report_status_updated');
    };
  }, []);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Real-Time Alerts & Updates</h1>
          <p className="text-xs text-text-muted mt-0.5">Live event stream from municipal grid and weather sensors.</p>
        </div>

        <div className="space-y-3">
          {notifications.map((n) => (
            <div key={n.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft flex items-start space-x-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bell className="w-5 h-5" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900">{n.title}</h4>
                  <span className="text-[11px] text-text-muted font-mono">{n.time}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
