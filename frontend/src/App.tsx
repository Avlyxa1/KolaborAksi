import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import ProtectedRoute from './components/ProtectedRoute';
import PublicLayout from './layouts/PublicLayout';
import LoginPage from './pages/LoginPage';
import EventListPage from './pages/EventListPage';
import EventDetailPage from './pages/EventDetailPage';
import MyEventsPage from './pages/MyEventsPage';
import MyCertificatesPage from './pages/MyCertificatesPage';

// Dashboard
import DashboardLayout from './layouts/DashboardLayout';
import OverviewPage from './pages/dashboard/OverviewPage';
import ManageEventsPage from './pages/dashboard/ManageEventsPage';
import EventFormPage from './pages/dashboard/EventFormPage';
import ManageRegistrationsPage from './pages/dashboard/ManageRegistrationsPage';

// Halaman sementara untuk root
function HomePlaceholder() {
  return <Navigate to="/events" replace />;
}

function App() {
  const { initAuth, isInitialized } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  // Show global loading screen while checking auth state
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-text-secondary">Memuat KolaborAksi...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePlaceholder />} />

        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Public Routes with Navbar */}
        <Route element={<PublicLayout />}>
          <Route path="/events" element={<EventListPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path="/my-events" element={
            <ProtectedRoute>
              <MyEventsPage />
            </ProtectedRoute>
          } />
          <Route path="/my-certificates" element={
            <ProtectedRoute>
              <MyCertificatesPage />
            </ProtectedRoute>
          } />
        </Route>

        {/* Protected Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<OverviewPage />} />
          <Route path="events" element={<ManageEventsPage />} />
          <Route path="events/create" element={<EventFormPage />} />
          <Route path="events/:eventId/registrations" element={<ManageRegistrationsPage />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
