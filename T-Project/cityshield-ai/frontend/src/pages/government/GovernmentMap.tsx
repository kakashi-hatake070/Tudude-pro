import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { MapComponent } from '../../components/MapComponent';
import { IssueReport, HazardZone } from '../../types';
import { RefreshCw, Filter, Layers } from 'lucide-react';

export const GovernmentMap: React.FC = () => {
  const [reports, setReports] = useState<IssueReport[]>([]);
  const [hazardZones, setHazardZones] = useState<HazardZone[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMapData = async () => {
    setLoading(true);
    try {
      const rep = await api.getReports({ limit: 100 });
      setReports(rep.reports || []);

      const weath = await api.getWeatherAndHazards();
      setHazardZones(weath.floodZones || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMapData();
  }, []);

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-background">
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between text-xs font-bold text-slate-800">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-primary" />
          <span>Municipal GIS Command Center • Bengaluru Central</span>
        </div>
        <button
          onClick={fetchMapData}
          className="flex items-center space-x-1 text-primary hover:underline"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Sync Geospatial Feed</span>
        </button>
      </div>

      <div className="flex-1 w-full h-full relative">
        <MapComponent
          reports={reports}
          hazardZones={hazardZones}
          className="w-full h-full"
        />
      </div>
    </div>
  );
};
