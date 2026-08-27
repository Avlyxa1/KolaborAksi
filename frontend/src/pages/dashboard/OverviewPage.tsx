import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Users,
  Clock,
  Award,
  PlusCircle,
  TrendingUp,
  PieChart as PieChartIcon,
  Activity,
  ArrowRight,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { useAuthStore } from '../../store/authStore';
import {
  getDashboardSummary,
  getParticipationTrend,
  getCategoryDistribution,
  getRecentActivities,
} from '../../services/dashboardService';
import type {
  DashboardSummary,
  ParticipationTrendItem,
  CategoryDistributionItem,
  RecentActivityItem,
} from '../../services/dashboardService';
import Badge from '../../components/Badge';

const CATEGORY_COLORS = [
  '#2563EB', // Primary blue
  '#10B981', // Secondary green
  '#F59E0B', // Accent amber
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#6B7280', // Gray
];

export default function OverviewPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [trends, setTrends] = useState<ParticipationTrendItem[]>([]);
  const [categories, setCategories] = useState<CategoryDistributionItem[]>([]);
  const [activities, setActivities] = useState<RecentActivityItem[]>([]);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [summaryData, trendData, catData, actData] = await Promise.all([
        getDashboardSummary(),
        getParticipationTrend(),
        getCategoryDistribution(),
        getRecentActivities(),
      ]);

      setSummary(summaryData);
      setTrends(trendData);
      setCategories(catData);
      setActivities(actData);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Gagal memuat data dashboard analitik');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        {/* Header skeleton */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded w-64"></div>
            <div className="h-4 bg-gray-200 rounded w-80"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded w-36"></div>
        </div>

        {/* Stat Cards skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-surface border border-border rounded-2xl p-6 h-32">
              <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>

        {/* Charts skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-surface border border-border rounded-2xl p-6 h-80">
            <div className="h-6 bg-gray-200 rounded w-40 mb-6"></div>
            <div className="h-56 bg-gray-100 rounded"></div>
          </div>
          <div className="bg-surface border border-border rounded-2xl p-6 h-80">
            <div className="h-6 bg-gray-200 rounded w-40 mb-6"></div>
            <div className="h-56 bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-surface border border-red-200 rounded-2xl p-8 text-center max-w-lg mx-auto mt-12">
        <div className="w-12 h-12 bg-red-100 text-danger rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={24} />
        </div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">Terjadi Kesalahan</h3>
        <p className="text-sm text-text-secondary mb-6">{error}</p>
        <button
          onClick={() => fetchDashboardData()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-hover transition-colors border-none cursor-pointer"
        >
          <RefreshCw size={16} /> Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">
              Halo, {user?.nama} 👋
            </h1>
            <Badge variant={user?.role === 'admin' ? 'primary' : 'success'}>
              {user?.role === 'admin' ? 'Super Admin' : 'Panitia Event'}
            </Badge>
          </div>
          <p className="text-sm text-text-secondary">
            Pantau performa kegiatan, keterlibatan relawan, dan statistik pencapaian organisasi Anda.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchDashboardData()}
            title="Refresh Data"
            className="p-2.5 text-text-secondary hover:text-text-primary bg-surface border border-border rounded-xl hover:bg-bg transition-colors"
          >
            <RefreshCw size={18} />
          </button>
          <Link
            to="/dashboard/events/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-hover transition-colors shadow-sm no-underline"
          >
            <PlusCircle size={18} />
            <span>Buat Event Baru</span>
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Events */}
        <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Total Kegiatan
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center">
              <Calendar size={20} />
            </div>
          </div>
          <div className="text-3xl font-bold text-text-primary mb-1">
            {summary?.totalEvents ?? 0}
          </div>
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <span className="text-success font-medium">{summary?.activeEvents ?? 0} Aktif</span>
            <span>•</span>
            <span>{summary?.completedEvents ?? 0} Selesai</span>
          </div>
        </div>

        {/* Card 2: Total Volunteers */}
        <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Relawan Terlibat
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-secondary flex items-center justify-center">
              <Users size={20} />
            </div>
          </div>
          <div className="text-3xl font-bold text-text-primary mb-1">
            {summary?.approvedRegistrations ?? 0}
          </div>
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <span className="font-medium text-text-primary">{summary?.totalUniqueVolunteers ?? 0}</span>
            <span>Individu Unik</span>
            {summary?.pendingRegistrations ? (
              <>
                <span>•</span>
                <span className="text-warning font-medium">{summary.pendingRegistrations} Menunggu</span>
              </>
            ) : null}
          </div>
        </div>

        {/* Card 3: Total Volunteer Hours */}
        <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Jam Kontribusi
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-accent flex items-center justify-center">
              <Clock size={20} />
            </div>
          </div>
          <div className="text-3xl font-bold text-text-primary mb-1">
            {summary?.totalHours ?? 0} <span className="text-sm font-medium text-text-secondary">Jam</span>
          </div>
          <p className="text-xs text-text-secondary">
            Terverifikasi oleh panitia kegiatan
          </p>
        </div>

        {/* Card 4: Total Certificates Issued */}
        <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Sertifikat Terbit
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Award size={20} />
            </div>
          </div>
          <div className="text-3xl font-bold text-text-primary mb-1">
            {summary?.totalCertificates ?? 0}
          </div>
          <p className="text-xs text-text-secondary">
            Otomatis ter-generate via sistem
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Participation Trend (2 cols) */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-primary-light text-primary">
                <TrendingUp size={20} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-text-primary">Tren Partisipasi Bulanan</h3>
                <p className="text-xs text-text-secondary">Jumlah pendaftar vs relawan diterima (6 bulan terakhir)</p>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full min-h-[280px]">
            {trends.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorReg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorApp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid #E5E7EB',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="registrations"
                    name="Pendaftar"
                    stroke="#2563EB"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorReg)"
                  />
                  <Area
                    type="monotone"
                    dataKey="approvedVolunteers"
                    name="Diterima"
                    stroke="#10B981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorApp)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-text-secondary text-sm">
                Belum ada data tren partisipasi
              </div>
            )}
          </div>
        </div>

        {/* Right: Category Distribution (1 col) */}
        <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="p-2 rounded-lg bg-amber-50 text-accent">
              <PieChartIcon size={20} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-text-primary">Distribusi Kategori</h3>
              <p className="text-xs text-text-secondary">Proporsi kegiatan per bidang</p>
            </div>
          </div>

          <div className="flex-1 w-full min-h-[280px] flex items-center justify-center">
            {categories.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={categories}
                    dataKey="eventsCount"
                    nameKey="category"
                    cx="50%"
                    cy="45%"
                    outerRadius={80}
                    innerRadius={45}
                    paddingAngle={4}
                  >
                    {categories.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid #E5E7EB',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      fontSize: '12px',
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    formatter={(value) => (
                      <span className="text-xs text-text-secondary">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-text-secondary text-sm">
                Belum ada kegiatan yang terdaftar
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activities Section */}
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <Activity size={20} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-text-primary">Aktivitas Partisipasi Terkini</h3>
              <p className="text-xs text-text-secondary">Daftar relawan yang mendaftar atau terverifikasi baru-baru ini</p>
            </div>
          </div>
          <Link
            to="/dashboard/events"
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-hover no-underline"
          >
            <span>Kelola Semua Event</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {activities.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-bg text-text-secondary text-xs uppercase tracking-wider border-b border-border">
                <tr>
                  <th className="px-4 py-3 rounded-l-lg">Relawan</th>
                  <th className="px-4 py-3">Kegiatan</th>
                  <th className="px-4 py-3">Kategori</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 rounded-r-lg">Waktu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {activities.map((act) => (
                  <tr key={act.id} className="hover:bg-bg/60 transition-colors">
                    <td className="px-4 py-3.5 flex items-center gap-3">
                      {act.user.photoUrl ? (
                        <img
                          src={act.user.photoUrl}
                          alt={act.user.nama}
                          className="w-8 h-8 rounded-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-primary-light text-primary font-semibold flex items-center justify-center text-xs">
                          {act.user.nama.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-text-primary leading-tight">{act.user.nama}</p>
                        <p className="text-xs text-text-secondary">{act.user.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-medium text-text-primary truncate max-w-xs">{act.event.judul}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs text-text-secondary font-medium">{act.event.kategori}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      {act.status === 'approved' ? (
                        <Badge variant="success">Diterima</Badge>
                      ) : act.status === 'pending' ? (
                        <Badge variant="warning">Menunggu</Badge>
                      ) : (
                        <Badge variant="danger">Ditolak</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-text-secondary whitespace-nowrap">
                      {new Date(act.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-text-secondary text-sm">
            <Activity size={32} className="mx-auto mb-2 text-text-muted opacity-60" />
            <p>Belum ada aktivitas pendaftaran relawan</p>
          </div>
        )}
      </div>
    </div>
  );
}
