import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  AlertTriangle,
  Droplets,
  CheckCircle2,
  Clock,
  ArrowRight,
  Shield,
  ThumbsUp,
  Eye
} from 'lucide-react';
import { IssueReport } from '../../types';

interface HorizontalIncidentScrollProps {
  reports: IssueReport[];
  onSelectReport?: (report: IssueReport) => void;
}

export const HorizontalIncidentScroll: React.FC<HorizontalIncidentScrollProps> = ({
  reports,
  onSelectReport
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 360;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Fallback realistic incidents if backend reports array is loading
  const displayReports = reports.length > 0 ? reports : [
    {
      _id: '1',
      trackingId: 'CS-BLR-001',
      title: 'Silk Board Junction Underpass Submerged',
      category: 'waterlogging',
      description: '25cm deep standing water blocking left lane towards Outer Ring Road.',
      location: { city: 'Bengaluru', landmark: 'Silk Board Flyover Ramp', ward: 'Ward 174' },
      riskScore: 88,
      status: 'in_progress',
      upvotes: 46,
      createdAt: new Date().toISOString()
    },
    {
      _id: '2',
      trackingId: 'CS-DEL-002',
      title: 'Outer Ring Road Deep Asphalt Crater',
      category: 'pothole',
      description: '40cm crater following heavy rain; two-wheelers losing balance.',
      location: { city: 'Delhi NCR', landmark: 'Nehru Place Flyover Descent', ward: 'Ward 42' },
      riskScore: 82,
      status: 'submitted',
      upvotes: 38,
      createdAt: new Date().toISOString()
    },
    {
      _id: '3',
      trackingId: 'CS-MUM-003',
      title: 'Milan Subway Drainage Pump Overhaul',
      category: 'waterlogging',
      description: 'Stormwater culvert cleared and high-flow diesel pumps deployed.',
      location: { city: 'Mumbai', landmark: 'Milan Subway Santacruz', ward: 'K-West' },
      riskScore: 35,
      status: 'resolved',
      upvotes: 89,
      createdAt: new Date().toISOString()
    },
    {
      _id: '4',
      trackingId: 'CS-MRT-004',
      title: 'Delhi Road Underground Culvert Desilted',
      category: 'waterlogging',
      description: 'Municipal sanitation squad cleared 2 tons of silt; water flowing free.',
      location: { city: 'Meerut', landmark: 'Industrial Bypass Crossroad', ward: 'Ward 18' },
      riskScore: 22,
      status: 'resolved',
      upvotes: 54,
      createdAt: new Date().toISOString()
    },
    {
      _id: '5',
      trackingId: 'CS-BLR-005',
      title: '100ft Road Streetlight Circuit Breakdown',
      category: 'streetlight',
      description: '8 non-functional streetlight poles creating complete darkness for 200m.',
      location: { city: 'Bengaluru', landmark: '12th Main Crossing Indiranagar', ward: 'Ward 112' },
      riskScore: 71,
      status: 'assigned',
      upvotes: 29,
      createdAt: new Date().toISOString()
    },
    {
      _id: '6',
      trackingId: 'CS-HYD-006',
      title: 'Begumpet Nala Trash Barrier Blocked',
      category: 'garbage',
      description: 'Solid waste accumulation causing backflow onto pedestrian pavement.',
      location: { city: 'Hyderabad', landmark: 'Begumpet Airport Road Culvert', ward: 'GHMC Ward 9' },
      riskScore: 68,
      status: 'in_progress',
      upvotes: 42,
      createdAt: new Date().toISOString()
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'resolved':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700 flex items-center space-x-1"><CheckCircle2 className="w-3 h-3" /><span>Verified Resolved</span></span>;
      case 'in_progress':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-400 border border-blue-300 dark:border-blue-700 flex items-center space-x-1"><Clock className="w-3 h-3" /><span>Work In Progress</span></span>;
      case 'assigned':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-400 border border-purple-300 dark:border-purple-700">Assigned To Ward</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-700">Under AI Review</span>;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'waterlogging':
        return <Droplets className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'pothole':
        return <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      default:
        return <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
    }
  };

  return (
    <section className="py-12 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 relative overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Navigation Arrows */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-saffron mb-1">
              <span className="w-2 h-2 rounded-full bg-saffron animate-pulse" />
              <span>Horizontal Telemetry Stream</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Live Verified Incident Reel <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-2">(Swipe / Scroll horizontally &rarr;)</span>
            </h3>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => scroll('left')}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors shadow-xs"
              title="Scroll Left"
              aria-label="Scroll Left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors shadow-xs"
              title="Scroll Right"
              aria-label="Scroll Right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Smooth Horizontal Scrolling Shelf */}
        <div
          ref={scrollRef}
          className="flex items-stretch space-x-5 overflow-x-auto pb-4 pt-1 no-scrollbar scroll-smooth snap-x snap-mandatory cursor-grab active:cursor-grabbing"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {displayReports.map((report: any) => (
            <div
              key={report._id || report.trackingId}
              onClick={() => onSelectReport && onSelectReport(report)}
              className="w-[330px] sm:w-[360px] p-5 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-soft hover:shadow-soft-lg transition-all duration-300 tilt-card snap-start shrink-0 flex flex-col justify-between group cursor-pointer"
            >
              <div>
                {/* Card Top: Category Icon + Status */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-xs">
                      {getCategoryIcon(report.category)}
                    </div>
                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 font-semibold">
                      {report.trackingId}
                    </span>
                  </div>
                  {getStatusBadge(report.status)}
                </div>

                {/* Title */}
                <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors line-clamp-1 mb-1.5">
                  {report.title}
                </h4>

                {/* Description */}
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-4">
                  {report.description}
                </p>

                {/* Location Pill */}
                <div className="flex items-center space-x-1.5 text-[11px] text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-950/70 p-2 rounded-xl border border-slate-200/60 dark:border-slate-800">
                  <MapPin className="w-3.5 h-3.5 text-primary dark:text-blue-400 shrink-0" />
                  <span className="truncate">
                    {report.address || (report.location?.landmark ? `${report.location.landmark}, ${report.location?.city || ''}` : report.location?.city || 'Bengaluru')}
                  </span>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="pt-4 mt-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  <span className="font-mono font-bold text-xs text-slate-700 dark:text-slate-300">
                    Risk: <span className={report.riskScore > 70 ? 'text-red-500 font-black' : report.riskScore > 40 ? 'text-amber-500' : 'text-emerald-500'}>{report.riskScore}/100</span>
                  </span>
                  <div className="flex items-center space-x-1 text-slate-500 dark:text-slate-400">
                    <ThumbsUp className="w-3 h-3 text-saffron" />
                    <span className="text-[11px] font-semibold">{report.upvotes || 0}</span>
                  </div>
                </div>

                <Link
                  to="/live-map"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center space-x-1 text-xs font-bold text-primary dark:text-blue-400 hover:underline group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Inspect</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
