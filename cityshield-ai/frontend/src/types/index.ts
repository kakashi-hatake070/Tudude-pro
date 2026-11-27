export type HazardCategory =
  | 'waterlogging'
  | 'potholes'
  | 'garbage'
  | 'damaged_roads'
  | 'streetlights'
  | 'drainage'
  | 'public_infrastructure'
  | 'accidents'
  | 'other';

export type ReportStatus =
  | 'submitted'
  | 'under_review'
  | 'verified'
  | 'assigned'
  | 'in_progress'
  | 'resolved'
  | 'rejected'
  | 'reopened';

export type ReportPriority = 'low' | 'medium' | 'high' | 'critical';

export interface IssueReport {
  _id?: string;
  trackingId: string;
  reporterAnonymousId: string;
  category: HazardCategory;
  title: string;
  description: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  approximateLocation?: {
    type: 'Point';
    coordinates: [number, number];
  };
  address: string;
  wardNumber: number;
  media: Array<{
    url: string;
    thumbnail?: string;
    mediaType: 'image' | 'video';
    cleanHash?: string;
  }>;
  status: ReportStatus;
  priority: ReportPriority;
  riskScore: number;
  aiAnalysis?: {
    category: string;
    confidence: number;
    detectedObjects: Array<{
      label: string;
      confidence: number;
      box: number[];
    }>;
    severity?: {
      level: 'low' | 'medium' | 'high' | 'critical';
      score: number;
      depthEstimateCm: number;
    };
    duplicateOfTrackingId?: string | null;
    processedAt?: string;
  };
  upvotes: number;
  upvotedBy?: string[];
  verifications?: Array<{
    verifiedBy: string;
    status: 'confirmed' | 'disputed' | 'cleared';
    comments: string;
    timestamp: string;
  }>;
  assignedDepartment?: {
    _id: string;
    name: string;
    code: string;
    contactPhone?: string;
  };
  assignedOfficer?: {
    _id: string;
    name: string;
    officialId: string;
    role: string;
  };
  resolutionProof?: {
    mediaUrls: string[];
    remarks: string;
    resolvedAt: string;
    resolvedBy: string;
  };
  auditTrail?: Array<{
    action: string;
    changedBy: string;
    previousStatus?: string;
    newStatus?: string;
    remarks?: string;
    timestamp: string;
  }>;
  createdAt: string;
  updatedAt?: string;
}

export interface HazardZone {
  _id: string;
  name: string;
  type: 'flood_prone' | 'chronic_waterlogging' | 'severe_pothole_cluster' | 'dark_zone' | 'accident_blackspot';
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: any[];
  };
  riskLevel: 'moderate' | 'high' | 'extreme';
  dataSource: string;
  historicalIncidentsCount: number;
  lastActiveRainThresholdMm: number;
}

export interface WeatherObservation {
  city: string;
  temperature: number;
  rainfallMmPerHour: number;
  forecast24hMm: number;
  humidity: number;
  warningLevel: 'green' | 'yellow' | 'orange' | 'red';
  warningTitle: string;
  warningDescription: string;
  source: string;
  isDemoData?: boolean;
  timestamp: string;
}

export interface RouteOption {
  routeId: string;
  label: string;
  distanceKm: number;
  estimatedMinutes: number;
  riskScore: number;
  riskLevel: string;
  hazardCount: number;
  waterloggedCount: number;
  potholeCount: number;
  warnings: string[];
  dataFreshness: string;
  geometry: {
    type: 'LineString';
    coordinates: [number, number][];
  };
  nearbyHazards: Array<{
    trackingId: string;
    category: string;
    title: string;
    distanceMeters: number;
    riskScore: number;
    priority: string;
    waterDepthCm?: number;
  }>;
}

export interface SafeRouteResponse {
  success: boolean;
  origin: { lng: number; lat: number };
  destination: { lng: number; lat: number };
  travelMode: string;
  riskPreference: string;
  recommendedRouteId: string;
  routes: RouteOption[];
  disclaimer: string;
}

export interface CitizenUser {
  id: string;
  anonymousId: string;
  citizenPoints: number;
  badges: string[];
  savedPlaces?: Array<{
    name: string;
    address: string;
    location: { coordinates: [number, number] };
  }>;
  notificationPreferences?: {
    nearbyAlerts: boolean;
    weatherWarnings: boolean;
    reportUpdates: boolean;
  };
}

export interface GovernmentOfficer {
  id: string;
  officialId: string;
  name: string;
  email: string;
  role: 'super_admin' | 'municipal_officer' | 'department_officer';
  department?: { _id: string; name: string; code: string };
  ward?: { _id: string; name: string; wardNumber: number };
  jurisdictionName: string;
}

export interface WardData {
  _id: string;
  wardNumber: number;
  name: string;
  zone: string;
  city: string;
  boundary: any;
  statistics: {
    totalReports: number;
    pendingReports: number;
    resolvedReports: number;
    riskIndex: number;
  };
}

export interface DepartmentData {
  _id: string;
  name: string;
  code: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  slaHours: number;
  categoriesHandled: string[];
}

export interface CommunityComment {
  commentId: string;
  authorAnonymousId: string;
  content: string;
  upvotes: number;
  createdAt: string;
}

export interface CommunityPost {
  _id: string;
  postId: string;
  authorAnonymousId: string;
  title: string;
  content: string;
  category: 'waterlogging' | 'roads' | 'safety' | 'sanitation' | 'general' | 'civic_ideas';
  flair: 'Hazard Alert' | 'Discussion' | 'Solution Idea' | 'Cleanup Drive' | 'Official Complaint' | 'Monsoon Watch';
  locationTag: string;
  upvotes: number;
  upvotedBy?: string[];
  downvotes: number;
  downvotedBy?: string[];
  commentsCount: number;
  comments: CommunityComment[];
  createdAt: string;
}
