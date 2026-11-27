import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { LiveMapPage } from './pages/LiveMapPage';
import { SafeRoutesPage } from './pages/SafeRoutesPage';
import { ReportPage } from './pages/ReportPage';
import { ExplorePage } from './pages/ExplorePage';
import { CommunityPage } from './pages/CommunityPage';
import { AboutPage } from './pages/AboutPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

// Citizen Pages
import { CitizenDashboard } from './pages/citizen/CitizenDashboard';
import { CitizenReports } from './pages/citizen/CitizenReports';
import { CitizenNotifications } from './pages/citizen/CitizenNotifications';
import { CitizenProfile } from './pages/citizen/CitizenProfile';

// Government Pages
import { GovernmentLogin } from './pages/government/GovernmentLogin';
import { GovernmentDashboard } from './pages/government/GovernmentDashboard';
import { GovernmentReports } from './pages/government/GovernmentReports';
import { GovernmentMap } from './pages/government/GovernmentMap';
import { GovernmentWards } from './pages/government/GovernmentWards';
import { GovernmentDepartments } from './pages/government/GovernmentDepartments';
import { GovernmentAnalytics } from './pages/government/GovernmentAnalytics';
import { GovernmentAuditLogs } from './pages/government/GovernmentAuditLogs';

// Protected Route Helpers
const CitizenRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('cs_token');
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const GovernmentRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('cs_gov_token');
  if (!token) return <Navigate to="/government/login" replace />;
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/live-map" element={<LiveMapPage />} />
            <Route path="/safe-routes" element={<SafeRoutesPage />} />
            <Route path="/report" element={<ReportPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Citizen Protected Routes */}
            <Route path="/citizen/dashboard" element={<CitizenRoute><CitizenDashboard /></CitizenRoute>} />
            <Route path="/citizen/reports" element={<CitizenRoute><CitizenReports /></CitizenRoute>} />
            <Route path="/citizen/notifications" element={<CitizenRoute><CitizenNotifications /></CitizenRoute>} />
            <Route path="/citizen/profile" element={<CitizenRoute><CitizenProfile /></CitizenRoute>} />
            <Route path="/citizen/saved-places" element={<CitizenRoute><CitizenProfile /></CitizenRoute>} />

            {/* Government Protected Routes */}
            <Route path="/government/login" element={<GovernmentLogin />} />
            <Route path="/government/dashboard" element={<GovernmentRoute><GovernmentDashboard /></GovernmentRoute>} />
            <Route path="/government/reports" element={<GovernmentRoute><GovernmentReports /></GovernmentRoute>} />
            <Route path="/government/map" element={<GovernmentRoute><GovernmentMap /></GovernmentRoute>} />
            <Route path="/government/wards" element={<GovernmentRoute><GovernmentWards /></GovernmentRoute>} />
            <Route path="/government/departments" element={<GovernmentRoute><GovernmentDepartments /></GovernmentRoute>} />
            <Route path="/government/analytics" element={<GovernmentRoute><GovernmentAnalytics /></GovernmentRoute>} />
            <Route path="/government/audit-logs" element={<GovernmentRoute><GovernmentAuditLogs /></GovernmentRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
