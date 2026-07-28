import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
  LayoutDashboard,
  CalendarDays,
  Menu,
  X,
  LogOut,
  Building,
} from 'lucide-react';

export default function DashboardLayout() {
  const { user, logout } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { name: 'Overview', path: '/dashboard', end: true, icon: LayoutDashboard },
    { name: 'Event', path: '/dashboard/events', end: false, icon: CalendarDays },
  ];

  // If user is admin, they might have organization management
  if (user?.role === 'admin') {
    navItems.push({ name: 'Organisasi', path: '/dashboard/organizations', end: false, icon: Building });
  }

  return (
    <div className="min-h-screen bg-bg flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-surface border-r border-border transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">K</span>
            </div>
            <span className="font-semibold text-text-primary text-lg">
              KolaborAksi
            </span>
          </div>
          <button
            className="lg:hidden text-text-secondary hover:text-text-primary border-none bg-transparent"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium ${
                    isActive
                      ? 'bg-primary-light text-primary-hover'
                      : 'text-text-secondary hover:bg-bg hover:text-text-primary'
                  }`
                }
              >
                <Icon size={18} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
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
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">
                {user?.nama}
              </p>
              <p className="text-xs text-text-muted capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-text-secondary hover:bg-red-50 hover:text-danger transition-colors border-none cursor-pointer bg-transparent"
          >
            <LogOut size={18} />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar (Mobile Only) */}
        <header className="h-16 bg-surface border-b border-border flex items-center px-4 lg:hidden shrink-0">
          <button
            className="text-text-secondary hover:text-text-primary border-none bg-transparent mr-4"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          <span className="font-semibold text-text-primary text-lg">
            KolaborAksi
          </span>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
