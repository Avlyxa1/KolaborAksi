import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LogOut, User as UserIcon } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-surface border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/events" className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <span className="font-bold text-xl text-text-primary tracking-tight">KolaborAksi</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/events" className="text-text-secondary hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Cari Event
            </Link>
            {user ? (
              <div className="flex items-center gap-2 ml-4 border-l pl-4 border-gray-200">
                <Link to="/dashboard" className="text-sm font-medium text-text-primary hover:text-primary transition-colors flex items-center gap-2 px-3 py-2 rounded-md">
                  <UserIcon size={16} />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm font-medium text-danger hover:text-red-700 transition-colors px-3 py-2 rounded-md hover:bg-red-50"
                >
                  <LogOut size={16} />
                  Keluar
                </button>
              </div>
            ) : (
              <div className="ml-4 border-l pl-4 border-gray-200">
                <Link
                  to="/login"
                  className="bg-primary text-white hover:bg-primary-hover px-5 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm inline-block"
                >
                  Masuk / Daftar
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
