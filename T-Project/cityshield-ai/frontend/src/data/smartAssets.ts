export type AssetType = 'dustbin' | 'streetlight' | 'toilet';

export interface SmartAsset {
  id: string;
  type: AssetType;
  name: string;
  area: string;
  ward: string;
  coordinates: [number, number]; // [lng, lat]
  fillLevel: number; // 0-100 for dustbins; 0 = OK, 100 = Fault for others
  status: 'OK' | 'NEEDS_PICKUP' | 'MAINTENANCE_REQUIRED';
  lastUpdated: string;
  lastCleaned: string;
  assignedTo: string;
}

const STORAGE_KEY = 'navbharat_smart_assets_v1';
const CHANNEL_NAME = 'navbharat_qr_sync';

export const DEPOT_COORDS: [number, number] = [77.5946, 12.9716]; // Central Municipal Depot, Bengaluru

export const DEFAULT_SMART_ASSETS: SmartAsset[] = [
  {
    id: 'BIN_101',
    type: 'dustbin',
    name: 'Smart Compactor Bin #101',
    area: 'Indiranagar 100ft Road',
    ward: 'Ward 112',
    coordinates: [77.6408, 12.9784],
    fillLevel: 92,
    status: 'NEEDS_PICKUP',
    lastUpdated: 'Just now',
    lastCleaned: 'Yesterday, 8:00 AM',
    assignedTo: 'Garbage Truck KA-01-G-402'
  },
  {
    id: 'BIN_102',
    type: 'dustbin',
    name: 'Smart Compactor Bin #102',
    area: 'Koramangala 4th Block',
    ward: 'Ward 151',
    coordinates: [77.6245, 12.9352],
    fillLevel: 86,
    status: 'NEEDS_PICKUP',
    lastUpdated: '12 mins ago',
    lastCleaned: 'Yesterday, 9:30 AM',
    assignedTo: 'Garbage Truck KA-01-G-402'
  },
  {
    id: 'BIN_103',
    type: 'dustbin',
    name: 'Metro Gate Bin #103',
    area: 'MG Road Metro Station',
    ward: 'Ward 111',
    coordinates: [77.6067, 12.9756],
    fillLevel: 28,
    status: 'OK',
    lastUpdated: '1 hr ago',
    lastCleaned: 'Today, 7:15 AM',
    assignedTo: 'Garbage Truck KA-01-G-402'
  },
  {
    id: 'BIN_104',
    type: 'dustbin',
    name: 'Market Square Bin #104',
    area: 'HSR Layout Sector 2',
    ward: 'Ward 174',
    coordinates: [77.6446, 12.9121],
    fillLevel: 35,
    status: 'OK',
    lastUpdated: '40 mins ago',
    lastCleaned: 'Today, 6:45 AM',
    assignedTo: 'Garbage Truck KA-01-G-402'
  },
  {
    id: 'BIN_105',
    type: 'dustbin',
    name: 'Tech Park Bin #105',
    area: 'Silk Board Junction',
    ward: 'Ward 174',
    coordinates: [77.6234, 12.9175],
    fillLevel: 89,
    status: 'NEEDS_PICKUP',
    lastUpdated: '5 mins ago',
    lastCleaned: 'Yesterday, 10:00 AM',
    assignedTo: 'Garbage Truck KA-01-G-402'
  },
  {
    id: 'LIGHT_201',
    type: 'streetlight',
    name: 'LED Streetlight Pole #201',
    area: '12th Main, Indiranagar',
    ward: 'Ward 112',
    coordinates: [77.6382, 12.9712],
    fillLevel: 0,
    status: 'OK',
    lastUpdated: '2 hrs ago',
    lastCleaned: 'Inspected 3 days ago',
    assignedTo: 'Electrical Crew Zone-East'
  },
  {
    id: 'TOILET_301',
    type: 'toilet',
    name: 'Swachh Public Toilet #301',
    area: 'Brigade Road Crossing',
    ward: 'Ward 111',
    coordinates: [77.6075, 12.9719],
    fillLevel: 0,
    status: 'OK',
    lastUpdated: '1 hr ago',
    lastCleaned: 'Today, 8:30 AM',
    assignedTo: 'Sanitation Supervisor Ward-111'
  }
];

export function loadSmartAssets(): SmartAsset[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return DEFAULT_SMART_ASSETS;
}

export function saveSmartAssets(assets: SmartAsset[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assets));
    if (typeof BroadcastChannel !== 'undefined') {
      const ch = new BroadcastChannel(CHANNEL_NAME);
      ch.postMessage({ type: 'ASSETS_UPDATED', assets });
      ch.close();
    }
  } catch (e) {}
}

export function updateSmartAsset(
  id: string,
  updates: Partial<SmartAsset>
): SmartAsset[] {
  const current = loadSmartAssets();
  const next = current.map((asset) => {
    if (asset.id !== id) return asset;
    const merged = {
      ...asset,
      ...updates,
      lastUpdated: 'Just now'
    };
    if (merged.type === 'dustbin') {
      merged.status = merged.fillLevel >= 80 ? 'NEEDS_PICKUP' : 'OK';
    }
    return merged;
  });
  saveSmartAssets(next);
  return next;
}

export function subscribeSmartAssets(cb: (assets: SmartAsset[]) => void): () => void {
  const handleStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      cb(loadSmartAssets());
    }
  };
  window.addEventListener('storage', handleStorage);

  let ch: BroadcastChannel | null = null;
  if (typeof BroadcastChannel !== 'undefined') {
    ch = new BroadcastChannel(CHANNEL_NAME);
    ch.onmessage = (e) => {
      if (e.data?.type === 'ASSETS_UPDATED') {
        cb(e.data.assets);
      }
    };
  }

  return () => {
    window.removeEventListener('storage', handleStorage);
    if (ch) ch.close();
  };
}

// Haversine distance in km
export function haversineKm(a: [number, number], b: [number, number]): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b[1] - a[1]);
  const dLon = toRad(b[0] - a[0]);
  const lat1 = toRad(a[1]);
  const lat2 = toRad(b[1]);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// Nearest-Neighbor TSP order starting from Depot and returning to Depot
export function computeShortestTspOrder(
  depot: [number, number],
  stops: SmartAsset[]
): { ordered: SmartAsset[]; totalKm: number } {
  if (stops.length === 0) return { ordered: [], totalKm: 0 };
  const remaining = [...stops];
  const ordered: SmartAsset[] = [];
  let current = depot;
  let totalKm = 0;

  while (remaining.length > 0) {
    let bestIdx = 0;
    let bestDist = Infinity;
    for (let i = 0; i < remaining.length; i++) {
      const d = haversineKm(current, remaining[i].coordinates);
      if (d < bestDist) {
        bestDist = d;
        bestIdx = i;
      }
    }
    const nextStop = remaining.splice(bestIdx, 1)[0];
    ordered.push(nextStop);
    totalKm += bestDist * 1.32; // urban road factor
    current = nextStop.coordinates;
  }
  totalKm += haversineKm(current, depot) * 1.32;
  return { ordered, totalKm: Number(totalKm.toFixed(1)) };
}
