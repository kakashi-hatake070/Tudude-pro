import {
  IssueReport,
  HazardZone,
  WeatherObservation,
  SafeRouteResponse,
  CitizenUser,
  GovernmentOfficer,
  WardData,
  DepartmentData
} from '../types';

const API_BASE = import.meta.env?.VITE_API_URL || 'http://localhost:5001/api';

// Helper for auth headers
const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('cs_token') || localStorage.getItem('cs_gov_token');
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // Citizen Auth
  async register(password: string, email?: string): Promise<{ success: boolean; token: string; user: CitizenUser }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, email })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Registration failed');
    }
    return res.json();
  },

  async login(anonymousId: string, password: string): Promise<{ success: boolean; token: string; user: CitizenUser }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ anonymousId, password })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Login failed');
    }
    return res.json();
  },

  async getMe(): Promise<{ success: boolean; user: CitizenUser }> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch user session');
    return res.json();
  },

  // Government Auth
  async governmentLogin(credentials: { email?: string; officialId?: string; password: string }): Promise<{ success: boolean; token: string; officer: GovernmentOfficer }> {
    const res = await fetch(`${API_BASE}/government/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Government authentication failed');
    }
    return res.json();
  },

  // Civic Reports
  async getReports(params?: { category?: string; status?: string; priority?: string; wardNumber?: number; limit?: number }): Promise<{ success: boolean; reports: IssueReport[]; count: number; total: number }> {
    const query = new URLSearchParams();
    if (params?.category && params.category !== 'all') query.append('category', params.category);
    if (params?.status && params.status !== 'all') query.append('status', params.status);
    if (params?.priority && params.priority !== 'all') query.append('priority', params.priority);
    if (params?.wardNumber) query.append('wardNumber', String(params.wardNumber));
    if (params?.limit) query.append('limit', String(params.limit));

    const res = await fetch(`${API_BASE}/reports?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch civic reports');
    return res.json();
  },

  async getReportByTrackingId(trackingId: string): Promise<{ success: boolean; report: IssueReport }> {
    const res = await fetch(`${API_BASE}/reports/${trackingId}`);
    if (!res.ok) throw new Error('Failed to fetch report');
    return res.json();
  },

  async createReport(formData: FormData): Promise<{ success: boolean; message: string; report: IssueReport }> {
    const res = await fetch(`${API_BASE}/reports`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Report submission failed');
    }
    return res.json();
  },

  async upvoteReport(trackingId: string, anonymousId?: string): Promise<{ success: boolean; upvotes: number }> {
    const res = await fetch(`${API_BASE}/reports/${trackingId}/upvote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ anonymousId })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Could not upvote');
    }
    return res.json();
  },

  async verifyReport(trackingId: string, status: string, comments: string): Promise<{ success: boolean; verifications: any[] }> {
    const res = await fetch(`${API_BASE}/reports/${trackingId}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ status, comments })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Verification submission failed');
    }
    return res.json();
  },

  // Safe Route Planner
  async planSafeRoute(origin: [number, number], destination: [number, number], travelMode = 'driving', riskPreference = 'lowest_risk'): Promise<SafeRouteResponse> {
    const res = await fetch(`${API_BASE}/routing/safe-route`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ origin, destination, travelMode, riskPreference })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Route planning failed');
    }
    return res.json();
  },

  // Weather & Flood Hazards
  async getWeatherAndHazards(): Promise<{ success: boolean; weather: WeatherObservation; isDemoData?: boolean; floodZones: HazardZone[]; lastUpdated: string; dataNotice: string }> {
    const res = await fetch(`${API_BASE}/weather/current`);
    if (!res.ok) throw new Error('Failed to fetch weather & flood hazards');
    return res.json();
  },

  // Explore Location Intelligence
  async getAreaIntelligence(lng?: number, lat?: number, locality?: string, radiusKm = 3): Promise<any> {
    const query = new URLSearchParams();
    if (lng) query.append('lng', String(lng));
    if (lat) query.append('lat', String(lat));
    if (locality) query.append('locality', locality);
    query.append('radiusKm', String(radiusKm));

    const res = await fetch(`${API_BASE}/explore/area?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch location intelligence');
    return res.json();
  },

  // Government Portal
  async getGovernmentStats(): Promise<{ success: boolean; stats: any }> {
    const res = await fetch(`${API_BASE}/government/dashboard/stats`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch government dashboard stats');
    return res.json();
  },

  async updateReportStatus(trackingId: string, payload: { status?: string; priority?: string; remarks?: string; assignedDepartmentId?: string; resolutionProofUrls?: string[] }): Promise<any> {
    const res = await fetch(`${API_BASE}/government/reports/${trackingId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to update report status');
    return res.json();
  },

  async getWards(): Promise<{ success: boolean; wards: WardData[] }> {
    const res = await fetch(`${API_BASE}/government/wards`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch wards');
    return res.json();
  },

  async getDepartments(): Promise<{ success: boolean; departments: DepartmentData[] }> {
    const res = await fetch(`${API_BASE}/government/departments`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch departments');
    return res.json();
  },

  async getAuditLogs(): Promise<{ success: boolean; logs: any[] }> {
    const res = await fetch(`${API_BASE}/government/audit-logs`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch audit logs');
    return res.json();
  },

  // Community Discussions (Reddit-style)
  async getCommunityPosts(params?: { category?: string; flair?: string; sort?: string; search?: string }): Promise<{ success: boolean; posts: any[]; count: number }> {
    const query = new URLSearchParams();
    if (params?.category && params.category !== 'all') query.append('category', params.category);
    if (params?.flair && params.flair !== 'all') query.append('flair', params.flair);
    if (params?.sort) query.append('sort', params.sort);
    if (params?.search) query.append('search', params.search);

    const res = await fetch(`${API_BASE}/community/posts?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to load community discussions');
    return res.json();
  },

  async createCommunityPost(post: { title: string; content: string; category?: string; flair?: string; locationTag?: string; anonymousId?: string }): Promise<{ success: boolean; post: any }> {
    const res = await fetch(`${API_BASE}/community/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(post)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to submit discussion post');
    }
    return res.json();
  },

  async voteCommunityPost(postId: string, direction: 'up' | 'down', anonymousId?: string): Promise<{ success: boolean; upvotes: number; downvotes: number; score: number }> {
    const res = await fetch(`${API_BASE}/community/posts/${postId}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ direction, anonymousId })
    });
    if (!res.ok) throw new Error('Failed to record vote');
    return res.json();
  },

  async addCommentToPost(postId: string, content: string, anonymousId?: string): Promise<{ success: boolean; comment: any; commentsCount: number }> {
    const res = await fetch(`${API_BASE}/community/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ content, anonymousId })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to post comment');
    }
    return res.json();
  }
};
