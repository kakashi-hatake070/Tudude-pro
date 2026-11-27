import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import GovernmentOfficer from '../models/GovernmentOfficer.js';
import Department from '../models/Department.js';
import Ward from '../models/Ward.js';
import IssueReport from '../models/IssueReport.js';
import HazardZone from '../models/HazardZone.js';
import WeatherObservation from '../models/WeatherObservation.js';

export const seedDatabaseIfEmpty = async () => {
  const existingReports = await IssueReport.countDocuments();
  if (existingReports > 0) {
    console.log(`[Seed] Database already has ${existingReports} civic reports. Skipping fresh seed.`);
    return;
  }

  console.log('[Seed] Database is clean. Seeding realistic Smart City municipal dataset for Bengaluru...');

  // 1. Create Departments
  const departments = await Department.create([
    {
      name: 'Roads & Major Infrastructure',
      code: 'RMI-01',
      description: 'Responsible for arterial roads, pothole rectification, and asphalt maintenance.',
      contactEmail: 'roads@cityshield.gov.in',
      contactPhone: '080-22975510',
      slaHours: 48,
      categoriesHandled: ['potholes', 'damaged_roads', 'public_infrastructure']
    },
    {
      name: 'Stormwater Drainage & Flood Mitigation',
      code: 'SWD-02',
      description: 'Stormwater drains (raja kaluve), culvert desilting, and waterlogging management.',
      contactEmail: 'drainage@cityshield.gov.in',
      contactPhone: '080-22975520',
      slaHours: 24,
      categoriesHandled: ['waterlogging', 'drainage']
    },
    {
      name: 'Solid Waste Management',
      code: 'SWM-03',
      description: 'Civic garbage cleanup, blackspot elimination, and sanitation enforcement.',
      contactEmail: 'waste@cityshield.gov.in',
      contactPhone: '080-22975530',
      slaHours: 24,
      categoriesHandled: ['garbage']
    },
    {
      name: 'Street Lighting & Electrical',
      code: 'SLE-04',
      description: 'Municipal streetlight maintenance, dark spot illumination, and electrical safety.',
      contactEmail: 'lighting@cityshield.gov.in',
      contactPhone: '080-22975540',
      slaHours: 36,
      categoriesHandled: ['streetlights']
    },
    {
      name: 'Traffic & Urban Safety',
      code: 'TUS-05',
      description: 'Road markings, pedestrian crossings, speed humps, and accident blackspot rectification.',
      contactEmail: 'traffic@cityshield.gov.in',
      contactPhone: '080-22975550',
      slaHours: 48,
      categoriesHandled: ['accidents', 'other']
    }
  ]);

  // 2. Create Wards
  const wards = await Ward.create([
    {
      wardNumber: 112,
      name: 'Koramangala Ward',
      zone: 'South Zone',
      city: 'Bengaluru',
      boundary: {
        type: 'Polygon',
        coordinates: [[
          [77.608, 12.925],
          [77.635, 12.925],
          [77.635, 12.945],
          [77.608, 12.945],
          [77.608, 12.925]
        ]]
      },
      statistics: { totalReports: 28, pendingReports: 8, resolvedReports: 20, riskIndex: 65 }
    },
    {
      wardNumber: 114,
      name: 'Indiranagar & Domlur Ward',
      zone: 'East Zone',
      city: 'Bengaluru',
      boundary: {
        type: 'Polygon',
        coordinates: [[
          [77.630, 12.960],
          [77.655, 12.960],
          [77.655, 12.985],
          [77.630, 12.985],
          [77.630, 12.960]
        ]]
      },
      statistics: { totalReports: 19, pendingReports: 5, resolvedReports: 14, riskIndex: 40 }
    },
    {
      wardNumber: 104,
      name: 'MG Road & Shanthinagar Ward',
      zone: 'Central Zone',
      city: 'Bengaluru',
      boundary: {
        type: 'Polygon',
        coordinates: [[
          [77.585, 12.965],
          [77.610, 12.965],
          [77.610, 12.985],
          [77.585, 12.985],
          [77.585, 12.965]
        ]]
      },
      statistics: { totalReports: 34, pendingReports: 9, resolvedReports: 25, riskIndex: 35 }
    },
    {
      wardNumber: 151,
      name: 'Silk Board & BTM Layout Ward',
      zone: 'South-East Zone',
      city: 'Bengaluru',
      boundary: {
        type: 'Polygon',
        coordinates: [[
          [77.610, 12.905],
          [77.635, 12.905],
          [77.635, 12.925],
          [77.610, 12.925],
          [77.610, 12.905]
        ]]
      },
      statistics: { totalReports: 42, pendingReports: 14, resolvedReports: 28, riskIndex: 82 }
    }
  ]);

  // 3. Create Government Officers
  const officerPassword = await bcrypt.hash('Admin@1234', 10);
  await GovernmentOfficer.create([
    {
      officialId: 'GOV-SUPER-01',
      name: 'Dr. Ramesh Narayan, IAS',
      email: 'admin@cityshield.gov.in',
      password: officerPassword,
      role: 'super_admin',
      department: departments[0]._id,
      jurisdictionName: 'Greater Bengaluru Municipal Corporation'
    },
    {
      officialId: 'GOV-MUNI-104',
      name: 'Ananya Rao, KAS',
      email: 'officer@cityshield.gov.in',
      password: officerPassword,
      role: 'municipal_officer',
      ward: wards[2]._id,
      department: departments[1]._id,
      jurisdictionName: 'Central Zone Wards 100-115'
    },
    {
      officialId: 'GOV-DEPT-RMI',
      name: 'Er. Sandeep Patil',
      email: 'roads.officer@cityshield.gov.in',
      password: officerPassword,
      role: 'department_officer',
      department: departments[0]._id,
      jurisdictionName: 'Roads & Infrastructure Engineering'
    }
  ]);

  // 4. Create Demo Citizen Users
  const citizenPassword = await bcrypt.hash('Citizen@123', 10);
  const citizens = await User.create([
    {
      anonymousId: 'CityGuardian_4821',
      password: citizenPassword,
      citizenPoints: 85,
      badges: ['Flood Watcher', 'Top Verifier'],
      savedPlaces: [
        { name: 'Home', address: '12th Main, Koramangala 4th Block', location: { coordinates: [77.625, 12.934] } },
        { name: 'Office', address: 'MG Road Metro Station', location: { coordinates: [77.608, 12.975] } }
      ]
    },
    {
      anonymousId: 'UrbanWatcher_2048',
      password: citizenPassword,
      citizenPoints: 120,
      badges: ['Road Sentinel', 'Community Hero']
    },
    {
      anonymousId: 'RoadObserver_9021',
      password: citizenPassword,
      citizenPoints: 40,
      badges: ['Civic Explorer']
    }
  ]);

  // 5. Create Hazard Zones
  await HazardZone.create([
    {
      name: 'Silk Board Junction Monsoon Flood Basin',
      type: 'flood_prone',
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [77.620, 12.915],
          [77.630, 12.915],
          [77.630, 12.922],
          [77.620, 12.922],
          [77.620, 12.915]
        ]]
      },
      riskLevel: 'extreme',
      dataSource: 'IMD / Bhuvan Historical Flood Inundation Survey',
      historicalIncidentsCount: 18,
      lastActiveRainThresholdMm: 25
    },
    {
      name: 'Koramangala 80 Feet Road Chronic Waterlogging Zone',
      type: 'chronic_waterlogging',
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [77.618, 12.932],
          [77.628, 12.932],
          [77.628, 12.939],
          [77.618, 12.939],
          [77.618, 12.932]
        ]]
      },
      riskLevel: 'high',
      dataSource: 'Municipal Monsoonal Drainage Audit',
      historicalIncidentsCount: 12,
      lastActiveRainThresholdMm: 20
    },
    {
      name: 'Domlur Inner Ring Road Pothole Cluster',
      type: 'severe_pothole_cluster',
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [77.635, 12.955],
          [77.645, 12.955],
          [77.645, 12.965],
          [77.635, 12.965],
          [77.635, 12.955]
        ]]
      },
      riskLevel: 'moderate',
      dataSource: 'CityShield Road Surface Survey',
      historicalIncidentsCount: 9,
      lastActiveRainThresholdMm: 45
    }
  ]);

  // 6. Create Realistic Seed Reports across Categories & Marker Statuses
  await IssueReport.create([
    {
      trackingId: 'CS-2026-1001',
      reporterAnonymousId: 'CityGuardian_4821',
      category: 'waterlogging',
      title: 'Severe 40cm Waterlogging Under Silk Board Flyover Ramp',
      description: 'Water has accumulated up to car axle height following 45 minutes of heavy rain. Multiple two-wheelers have stalled in the middle lane.',
      location: { type: 'Point', coordinates: [77.6234, 12.9175] },
      approximateLocation: { type: 'Point', coordinates: [77.6238, 12.9179] },
      address: 'Near Hosur Main Rd Exit, Silk Board Junction, Bengaluru',
      wardNumber: 151,
      media: [{
        url: '/assets/dataset/flood-1.png',
        thumbnail: '/assets/dataset/flood-1.png',
        mediaType: 'image'
      }],
      status: 'in_progress',
      priority: 'critical',
      riskScore: 92,
      aiAnalysis: {
        category: 'waterlogging',
        confidence: 0.94,
        detectedObjects: [{ label: 'waterlogging', confidence: 0.95, box: [0.1, 0.1, 0.85, 0.9] }],
        severity: { level: 'critical', score: 92, depthEstimateCm: 38 },
        duplicateOfTrackingId: null,
        processedAt: new Date()
      },
      upvotes: 24,
      upvotedBy: ['UrbanWatcher_2048', 'RoadObserver_9021'],
      assignedDepartment: departments[1]._id,
      auditTrail: [
        { action: 'REPORT_SUBMITTED', changedBy: 'CityGuardian_4821', newStatus: 'submitted', remarks: 'Initial citizen report' },
        { action: 'STATUS_CHANGE_TO_IN_PROGRESS', changedBy: 'Ananya Rao (municipal_officer)', previousStatus: 'assigned', newStatus: 'in_progress', remarks: 'Dewatering diesel pump team dispatched to site.' }
      ]
    },
    {
      trackingId: 'CS-2026-1002',
      reporterAnonymousId: 'UrbanWatcher_2048',
      category: 'potholes',
      title: 'Deep Hazardous Pothole on 100 Feet Road Right Lane',
      description: 'Pothole approximately 12 inches deep hidden under water puddles. Poses severe skid hazard for two-wheelers at night.',
      location: { type: 'Point', coordinates: [77.6402, 12.9698] },
      approximateLocation: { type: 'Point', coordinates: [77.6405, 12.9701] },
      address: 'Opposite 12th Main Junction, 100 Feet Rd, Indiranagar',
      wardNumber: 114,
      media: [{
        url: '/assets/dataset/road-tuktuk.png',
        thumbnail: '/assets/dataset/road-tuktuk.png',
        mediaType: 'image'
      }],
      status: 'verified',
      priority: 'high',
      riskScore: 78,
      aiAnalysis: {
        category: 'potholes',
        confidence: 0.91,
        detectedObjects: [{ label: 'pothole', confidence: 0.92, box: [0.3, 0.2, 0.7, 0.8] }],
        severity: { level: 'high', score: 78, depthEstimateCm: 14 },
        duplicateOfTrackingId: null,
        processedAt: new Date()
      },
      upvotes: 18,
      assignedDepartment: departments[0]._id
    },
    {
      trackingId: 'CS-2026-1003',
      reporterAnonymousId: 'RoadObserver_9021',
      category: 'garbage',
      title: 'Overflowing Waste Dump Blocking Pedestrian Walkway',
      description: 'Secondary waste accumulation spanning 15 meters along the footpath. Foul odor and stray dogs causing pedestrian obstruction.',
      location: { type: 'Point', coordinates: [77.6212, 12.9351] },
      approximateLocation: { type: 'Point', coordinates: [77.6215, 12.9354] },
      address: '4th Cross, 5th Block, Koramangala',
      wardNumber: 112,
      media: [{
        url: '/assets/dataset/garbage-1.png',
        thumbnail: '/assets/dataset/garbage-1.png',
        mediaType: 'image'
      }],
      status: 'assigned',
      priority: 'medium',
      riskScore: 48,
      aiAnalysis: {
        category: 'garbage',
        confidence: 0.89,
        detectedObjects: [{ label: 'garbage', confidence: 0.90, box: [0.15, 0.2, 0.8, 0.85] }],
        severity: { level: 'medium', score: 48, depthEstimateCm: 0 },
        duplicateOfTrackingId: null,
        processedAt: new Date()
      },
      upvotes: 9,
      assignedDepartment: departments[2]._id
    },
    {
      trackingId: 'CS-2026-1004',
      reporterAnonymousId: 'CityGuardian_4821',
      category: 'streetlights',
      title: 'Series of 6 Non-functional Streetlights on Rest House Rd',
      description: 'Entire 200m stretch completely dark between 7 PM and 6 AM. Poses pedestrian safety risk for women and commuters.',
      location: { type: 'Point', coordinates: [77.6045, 12.9732] },
      approximateLocation: { type: 'Point', coordinates: [77.6048, 12.9735] },
      address: 'Rest House Road, off Brigade Road, Central Zone',
      wardNumber: 104,
      media: [],
      status: 'submitted',
      priority: 'medium',
      riskScore: 52,
      aiAnalysis: {
        category: 'streetlights',
        confidence: 0.85,
        detectedObjects: [],
        severity: { level: 'medium', score: 52, depthEstimateCm: 0 },
        duplicateOfTrackingId: null,
        processedAt: new Date()
      },
      upvotes: 11,
      assignedDepartment: departments[3]._id
    },
    {
      trackingId: 'CS-2026-1005',
      reporterAnonymousId: 'UrbanWatcher_2048',
      category: 'damaged_roads',
      title: 'Repaired and Fully Asphalted Road Surface',
      description: 'Major asphalt resurfacing completed on Resthouse crescent. Road now clean and free from previous craters.',
      location: { type: 'Point', coordinates: [77.6012, 12.9711] },
      approximateLocation: { type: 'Point', coordinates: [77.6015, 12.9714] },
      address: 'Museum Road Intersection, Shanthinagar Ward',
      wardNumber: 104,
      media: [],
      status: 'resolved',
      priority: 'low',
      riskScore: 10,
      aiAnalysis: {
        category: 'damaged_roads',
        confidence: 0.93,
        detectedObjects: [],
        severity: { level: 'low', score: 10, depthEstimateCm: 0 },
        duplicateOfTrackingId: null,
        processedAt: new Date()
      },
      upvotes: 32,
      assignedDepartment: departments[0]._id,
      resolutionProof: {
        mediaUrls: ['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80'],
        remarks: 'Bitumen resurfacing 20mm layer completed by Ward Engineering division.',
        resolvedAt: new Date(Date.now() - 36 * 3600 * 1000),
        resolvedBy: 'Er. Sandeep Patil'
      }
    },
    {
      trackingId: 'CS-2026-1006',
      reporterAnonymousId: 'CityGuardian_4821',
      category: 'potholes',
      title: 'Cluster of 4 Deep Potholes Near Koramangala Sony World Signal',
      description: 'Multiple broken asphalt craters right after the left-turn signal causing sudden braking and two-wheeler skids during peak office hours.',
      location: { type: 'Point', coordinates: [77.6269, 12.9367] },
      approximateLocation: { type: 'Point', coordinates: [77.6272, 12.9370] },
      address: '80 Feet Road, Sony World Junction, Koramangala',
      wardNumber: 112,
      media: [{
        url: '/assets/dataset/road-bike.png',
        thumbnail: '/assets/dataset/road-bike.png',
        mediaType: 'image'
      }],
      status: 'verified',
      priority: 'critical',
      riskScore: 86,
      aiAnalysis: {
        category: 'potholes',
        confidence: 0.93,
        detectedObjects: [{ label: 'pothole', confidence: 0.94, box: [0.22, 0.25, 0.78, 0.82] }],
        severity: { level: 'critical', score: 86, depthEstimateCm: 18 },
        duplicateOfTrackingId: null,
        processedAt: new Date()
      },
      upvotes: 41,
      assignedDepartment: departments[0]._id
    },
    {
      trackingId: 'CS-2026-1007',
      reporterAnonymousId: 'UrbanWatcher_2048',
      category: 'potholes',
      title: 'Water-Filled Crater Outside Domlur Flyover Bus Stop',
      description: 'Deep pothole completely hidden under rainwater near the bus bay. Auto-rickshaws and bikes are swerving into fast traffic to dodge it.',
      location: { type: 'Point', coordinates: [77.6387, 12.9609] },
      approximateLocation: { type: 'Point', coordinates: [77.6390, 12.9612] },
      address: 'Old Airport Road, Domlur Flyover Service Lane',
      wardNumber: 114,
      media: [{
        url: '/assets/dataset/road-night.png',
        thumbnail: '/assets/dataset/road-night.png',
        mediaType: 'image'
      }],
      status: 'in_progress',
      priority: 'high',
      riskScore: 81,
      aiAnalysis: {
        category: 'potholes',
        confidence: 0.90,
        detectedObjects: [{ label: 'pothole', confidence: 0.91, box: [0.25, 0.3, 0.72, 0.78] }],
        severity: { level: 'high', score: 81, depthEstimateCm: 15 },
        duplicateOfTrackingId: null,
        processedAt: new Date()
      },
      upvotes: 29,
      assignedDepartment: departments[0]._id
    },
    {
      trackingId: 'CS-2026-1008',
      reporterAnonymousId: 'RoadObserver_9021',
      category: 'potholes',
      title: 'Sunken Manhole & Pothole Ring on BTM 2nd Stage Main Rd',
      description: 'Road asphalt around a storm manhole has caved in by 10cm, creating a sharp rim that punctures tyres.',
      location: { type: 'Point', coordinates: [77.6101, 12.9165] },
      approximateLocation: { type: 'Point', coordinates: [77.6104, 12.9168] },
      address: '16th Main Road, BTM Layout 2nd Stage',
      wardNumber: 151,
      media: [],
      status: 'assigned',
      priority: 'high',
      riskScore: 74,
      aiAnalysis: {
        category: 'potholes',
        confidence: 0.88,
        detectedObjects: [{ label: 'pothole', confidence: 0.88, box: [0.2, 0.2, 0.65, 0.75] }],
        severity: { level: 'high', score: 74, depthEstimateCm: 11 },
        duplicateOfTrackingId: null,
        processedAt: new Date()
      },
      upvotes: 17,
      assignedDepartment: departments[0]._id
    },
    {
      trackingId: 'CS-2026-1009',
      reporterAnonymousId: 'CityGuardian_4821',
      category: 'drainage',
      title: 'Blocked Stormwater Culvert Overflowing on HSR 27th Main',
      description: 'Plastic silt has choked the roadside grating causing muddy water to spill across two lanes.',
      location: { type: 'Point', coordinates: [77.6512, 12.9141] },
      approximateLocation: { type: 'Point', coordinates: [77.6515, 12.9144] },
      address: '27th Main Road, Sector 1, HSR Layout',
      wardNumber: 151,
      media: [{
        url: '/assets/dataset/flood-2.png',
        thumbnail: '/assets/dataset/flood-2.png',
        mediaType: 'image'
      }],
      status: 'verified',
      priority: 'high',
      riskScore: 76,
      aiAnalysis: {
        category: 'drainage',
        confidence: 0.89,
        detectedObjects: [{ label: 'waterlogging', confidence: 0.89, box: [0.15, 0.25, 0.85, 0.8] }],
        severity: { level: 'high', score: 76, depthEstimateCm: 22 },
        duplicateOfTrackingId: null,
        processedAt: new Date()
      },
      upvotes: 22,
      assignedDepartment: departments[1]._id
    },
    {
      trackingId: 'CS-2026-1010',
      reporterAnonymousId: 'UrbanWatcher_2048',
      category: 'potholes',
      title: 'Patched & Levelled Pothole Stretch Near Trinity Metro',
      description: 'Cold-mix tarmac repair completed overnight after 34 citizen upvotes. Traffic moving smoothly.',
      location: { type: 'Point', coordinates: [77.6170, 12.9729] },
      approximateLocation: { type: 'Point', coordinates: [77.6173, 12.9732] },
      address: 'MG Road Near Trinity Circle Metro Exit',
      wardNumber: 104,
      media: [],
      status: 'resolved',
      priority: 'low',
      riskScore: 12,
      aiAnalysis: {
        category: 'potholes',
        confidence: 0.92,
        detectedObjects: [],
        severity: { level: 'low', score: 12, depthEstimateCm: 0 },
        duplicateOfTrackingId: null,
        processedAt: new Date()
      },
      upvotes: 34,
      assignedDepartment: departments[0]._id,
      resolutionProof: {
        mediaUrls: ['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80'],
        remarks: 'Pothole crater filled and compacted with hot-mix bitumen.',
        resolvedAt: new Date(Date.now() - 18 * 3600 * 1000),
        resolvedBy: 'Er. Sandeep Patil'
      }
    },
    {
      trackingId: 'CS-2026-1011',
      reporterAnonymousId: 'RoadObserver_9021',
      category: 'garbage',
      title: 'Overflowing Corner Bin & Construction Debris on CMH Road',
      description: 'Uncollected garbage bags and rubble narrowing the footpath near the metro pillar.',
      location: { type: 'Point', coordinates: [77.6378, 12.9786] },
      approximateLocation: { type: 'Point', coordinates: [77.6381, 12.9789] },
      address: 'CMH Road, Near Indiranagar Metro Station',
      wardNumber: 114,
      media: [{
        url: '/assets/dataset/garbage-2.png',
        thumbnail: '/assets/dataset/garbage-2.png',
        mediaType: 'image'
      }],
      status: 'submitted',
      priority: 'medium',
      riskScore: 58,
      aiAnalysis: {
        category: 'garbage',
        confidence: 0.87,
        detectedObjects: [{ label: 'garbage', confidence: 0.87, box: [0.18, 0.22, 0.8, 0.82] }],
        severity: { level: 'medium', score: 58, depthEstimateCm: 0 },
        duplicateOfTrackingId: null,
        processedAt: new Date()
      },
      upvotes: 14,
      assignedDepartment: departments[2]._id
    },
    {
      trackingId: 'CS-2026-1012',
      reporterAnonymousId: 'CityGuardian_4821',
      category: 'accidents',
      title: 'Missing Speed Breaker & Blind Curve Warning Near School Gate',
      description: 'Faded zebra crossing and no speed hump on a fast curve near St. John signal; high pedestrian risk.',
      location: { type: 'Point', coordinates: [77.6203, 12.9298] },
      approximateLocation: { type: 'Point', coordinates: [77.6206, 12.9301] },
      address: 'Sarjapur Rd Approach, Near St. John Hospital Signal',
      wardNumber: 112,
      media: [],
      status: 'verified',
      priority: 'high',
      riskScore: 71,
      aiAnalysis: {
        category: 'accidents',
        confidence: 0.84,
        detectedObjects: [],
        severity: { level: 'high', score: 71, depthEstimateCm: 0 },
        duplicateOfTrackingId: null,
        processedAt: new Date()
      },
      upvotes: 26,
      assignedDepartment: departments[4]._id
    }
  ]);

  // 7. Create Weather Observation
  await WeatherObservation.create({
    city: 'Bengaluru',
    temperature: 24.2,
    rainfallMmPerHour: 9.6,
    forecast24hMm: 38.0,
    humidity: 79,
    warningLevel: 'yellow',
    warningTitle: 'Yellow Alert: Active Monsoon Showers Across Eastern & Southern Corridor',
    warningDescription: 'Moderate rainfall with localized waterlogging expected in underpasses. Commuters advised to check real-time hazard markers.',
    source: 'India Meteorological Department (IMD) Bengaluru Doppler Radar Feed',
    timestamp: new Date()
  });

  console.log('[Seed] Database initialization and seed completed successfully!');
};
