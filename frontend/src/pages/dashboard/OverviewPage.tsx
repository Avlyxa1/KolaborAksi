import { useAuthStore } from '../../store/authStore';

export default function OverviewPage() {
  const { user } = useAuthStore();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-text-primary mb-2" style={{ fontSize: '32px' }}>
        Selamat datang, {user?.nama} 👋
      </h1>
      <p className="text-text-secondary mb-8">
        Berikut adalah ringkasan akun Anda. Fitur analitik lengkap akan tersedia di fase berikutnya.
      </p>

      {/* Quick info cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm text-text-secondary mb-1">Role</p>
          <p className="text-lg font-semibold text-text-primary capitalize">
            {user?.role}
          </p>
        </div>
        <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm text-text-secondary mb-1">Email</p>
          <p className="text-lg font-semibold text-text-primary truncate">
            {user?.email}
          </p>
        </div>
        <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm text-text-secondary mb-1">Provider Login</p>
          <p className="text-lg font-semibold text-text-primary capitalize">
            {user?.authProvider}
          </p>
        </div>
      </div>
    </div>
  );
}
