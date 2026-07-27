import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';

/**
 * Placeholder dashboard — will be replaced in Fase 2+.
 */
function DashboardPlaceholder() {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-bg">
      {/* Simple top bar */}
      <header className="bg-surface border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">K</span>
          </div>
          <span className="font-semibold text-text-primary">KolaborAksi</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            {user?.photoUrl ? (
              <img
                src={user.photoUrl}
                alt={user.nama}
                className="w-8 h-8 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center">
                <span className="text-primary text-sm font-semibold">
                  {user?.nama.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-text-primary leading-tight">
                {user?.nama}
              </p>
              <p className="text-xs text-text-muted">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={() => logout()}
            className="text-sm text-text-secondary hover:text-danger bg-transparent border border-border px-3 py-1.5 rounded-md cursor-pointer transition-colors duration-150"
          >
            Keluar
          </button>
        </div>
      </header>

      {/* Dashboard content */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-semibold text-text-primary mb-2"
          style={{ fontSize: '32px' }}
        >
          Selamat datang, {user?.nama} 👋
        </h1>
        <p className="text-text-secondary mb-8">
          Dashboard ini akan diisi dengan fitur lengkap di fase berikutnya.
        </p>

        {/* Quick info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-text-secondary mb-1">Role</p>
            <p className="text-lg font-semibold text-text-primary capitalize">
              {user?.role}
            </p>
          </div>
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-text-secondary mb-1">Email</p>
            <p className="text-lg font-semibold text-text-primary truncate">
              {user?.email}
            </p>
          </div>
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-text-secondary mb-1">Login via</p>
            <p className="text-lg font-semibold text-text-primary capitalize">
              {user?.authProvider}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

/**
 * Landing page — the public homepage.
 */
function LandingPage() {
  const { user } = useAuthStore();

  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="text-center max-w-lg px-6">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
            <span className="text-white text-2xl font-bold">K</span>
          </div>
        </div>
        <h1
          className="text-3xl font-bold text-text-primary mb-4"
          style={{ fontSize: '40px' }}
        >
          KolaborAksi
        </h1>
        <p className="text-lg text-text-secondary mb-8">
          Platform Volunteering & Organisasi Kemahasiswaan — kelola event,
          tracking kontribusi, dan bangun portofolio sosialmu.
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/login"
            className="bg-primary text-white px-6 py-3 rounded-[10px] font-medium hover:bg-primary-hover transition-colors duration-150 inline-flex items-center gap-2"
          >
            Masuk / Daftar
          </a>
        </div>
      </div>
    </div>
  );
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
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPlaceholder />
            </ProtectedRoute>
          }
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
