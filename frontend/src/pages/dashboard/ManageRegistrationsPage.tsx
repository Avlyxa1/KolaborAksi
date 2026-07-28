import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getEventRegistrations, updateRegistrationStatus, type Registration } from '../../services/registrationService';
import { ArrowLeft, Check, X, Search, FileText } from 'lucide-react';
import Badge from '../../components/Badge';

export default function ManageRegistrationsPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (eventId) {
      getEventRegistrations(eventId)
        .then((data) => setRegistrations(data))
        .catch((err) => setError(err.response?.data?.message || 'Gagal memuat peserta'))
        .finally(() => setIsLoading(false));
    }
  }, [eventId]);

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
    setIsUpdating(id);
    try {
      const updated = await updateRegistrationStatus(id, status);
      setRegistrations((prev) => 
        prev.map((reg) => reg.id === id ? { ...reg, status: updated.status } : reg)
      );
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal memperbarui status');
    } finally {
      setIsUpdating(null);
    }
  };

  const filteredRegistrations = registrations.filter(reg => 
    reg.user?.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
    reg.user?.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div className="p-8 text-text-secondary">Memuat data peserta...</div>;
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/dashboard/events" className="p-2 bg-surface rounded-full border border-border hover:bg-surface-dim transition-colors">
          <ArrowLeft size={20} className="text-text-secondary" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary">Kelola Peserta</h1>
          <p className="text-text-secondary">Persetujuan pendaftaran relawan untuk event ini.</p>
        </div>
      </div>

      {error && <div className="p-4 mb-6 bg-error-container text-on-error-container rounded-lg">{error}</div>}

      <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-sm flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-border flex flex-col md:flex-row gap-4 justify-between items-center bg-canvas">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input 
              type="text" 
              placeholder="Cari nama atau email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm bg-white"
            />
          </div>
          <div className="text-sm text-text-secondary font-medium">
            Total {registrations.length} Pendaftar
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface-dim text-text-secondary border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Peserta</th>
                <th className="px-6 py-4 font-medium">Waktu Daftar</th>
                <th className="px-6 py-4 font-medium">Alasan</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-text-secondary">
                    Tidak ada peserta yang ditemukan.
                  </td>
                </tr>
              ) : (
                filteredRegistrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-canvas transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center shrink-0 text-primary font-bold">
                          {reg.user?.photoUrl ? (
                            <img src={reg.user.photoUrl} alt="" className="w-full h-full rounded-full object-cover" />
                          ) : (
                            reg.user?.nama.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-text-primary">{reg.user?.nama}</div>
                          <div className="text-text-muted text-xs">{reg.user?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text-secondary">
                      {new Date(reg.createdAt).toLocaleDateString('id-ID', {
                        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4 max-w-[200px] truncate text-text-secondary">
                      {reg.alasan ? (
                        <span title={reg.alasan} className="flex items-center gap-1 cursor-help">
                          <FileText size={14} /> Lihat alasan
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={
                        reg.status === 'approved' ? 'success' :
                        reg.status === 'rejected' ? 'danger' : 'primary'
                      }>
                        {reg.status === 'pending' ? 'Menunggu' : reg.status === 'approved' ? 'Diterima' : 'Ditolak'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {reg.status === 'pending' && (
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            disabled={isUpdating === reg.id}
                            onClick={() => handleUpdateStatus(reg.id, 'approved')}
                            className="p-1.5 bg-success/10 text-success rounded-md hover:bg-success hover:text-white transition-colors disabled:opacity-50"
                            title="Terima"
                          >
                            <Check size={18} />
                          </button>
                          <button 
                            disabled={isUpdating === reg.id}
                            onClick={() => handleUpdateStatus(reg.id, 'rejected')}
                            className="p-1.5 bg-danger/10 text-danger rounded-md hover:bg-danger hover:text-white transition-colors disabled:opacity-50"
                            title="Tolak"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
