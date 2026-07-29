import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getEventRegistrations, updateRegistrationStatus, type Registration } from '../../services/registrationService';
import { verifyVolunteerHours } from '../../services/volunteerHourService';
import { ArrowLeft, Check, X, Search, FileText, Clock, Award } from 'lucide-react';
import Badge from '../../components/Badge';

export default function ManageRegistrationsPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  // Volunteer hours modal state
  const [hoursModal, setHoursModal] = useState<{ open: boolean; registration: Registration | null }>({
    open: false,
    registration: null,
  });
  const [hoursInput, setHoursInput] = useState('');
  const [hoursNote, setHoursNote] = useState('');
  const [isSubmittingHours, setIsSubmittingHours] = useState(false);

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

  const openHoursModal = (reg: Registration) => {
    setHoursModal({ open: true, registration: reg });
    setHoursInput(reg.volunteerHour?.jumlahJam?.toString() || '');
    setHoursNote(reg.volunteerHour?.catatan || '');
  };

  const closeHoursModal = () => {
    setHoursModal({ open: false, registration: null });
    setHoursInput('');
    setHoursNote('');
  };

  const handleSubmitHours = async () => {
    if (!hoursModal.registration) return;

    const jam = parseFloat(hoursInput);
    if (isNaN(jam) || jam <= 0) {
      alert('Masukkan jumlah jam yang valid (lebih dari 0)');
      return;
    }

    setIsSubmittingHours(true);
    try {
      const result = await verifyVolunteerHours(
        hoursModal.registration.id,
        jam,
        hoursNote || undefined,
      );

      // Update local state with the new volunteer hour data
      setRegistrations((prev) =>
        prev.map((reg) => {
          if (reg.id === hoursModal.registration!.id) {
            return {
              ...reg,
              volunteerHour: result,
              certificate: reg.certificate ?? { id: 'pending', certificateCode: '' },
            };
          }
          return reg;
        }),
      );

      closeHoursModal();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal memverifikasi jam kontribusi');
    } finally {
      setIsSubmittingHours(false);
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
          <p className="text-text-secondary">Persetujuan pendaftaran & verifikasi jam kontribusi relawan.</p>
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
                <th className="px-6 py-4 font-medium">Jam Kontribusi</th>
                <th className="px-6 py-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-text-secondary">
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
                    {/* Jam Kontribusi Column */}
                    <td className="px-6 py-4">
                      {reg.status === 'approved' ? (
                        reg.volunteerHour?.status === 'verified' ? (
                          <div className="flex items-center gap-1.5">
                            <Award size={14} className="text-green-600" />
                            <span className="font-semibold text-green-700">{reg.volunteerHour.jumlahJam} jam</span>
                          </div>
                        ) : (
                          <span className="text-text-muted text-xs italic">Belum diverifikasi</span>
                        )
                      ) : (
                        <span className="text-text-muted">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {reg.status === 'pending' && (
                          <>
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
                          </>
                        )}
                        {reg.status === 'approved' && (
                          <button
                            onClick={() => openHoursModal(reg)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-primary/30 text-primary bg-primary/5 hover:bg-primary hover:text-white transition-colors"
                            title="Input Jam Kontribusi"
                          >
                            <Clock size={14} />
                            {reg.volunteerHour ? 'Edit Jam' : 'Input Jam'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Volunteer Hours Modal ─── */}
      {hoursModal.open && hoursModal.registration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
              <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                <Clock size={20} className="text-primary" />
                Verifikasi Jam Kontribusi
              </h3>
              <p className="text-sm text-text-secondary mt-1">
                {hoursModal.registration.user?.nama}
              </p>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">
                  Jumlah Jam <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={hoursInput}
                  onChange={(e) => setHoursInput(e.target.value)}
                  placeholder="Contoh: 8"
                  className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">
                  Catatan <span className="text-text-muted">(opsional)</span>
                </label>
                <textarea
                  value={hoursNote}
                  onChange={(e) => setHoursNote(e.target.value)}
                  placeholder="Catatan tambahan tentang kontribusi relawan..."
                  rows={3}
                  className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm resize-none"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-border bg-canvas flex items-center justify-end gap-3">
              <button
                onClick={closeHoursModal}
                disabled={isSubmittingHours}
                className="px-4 py-2 text-sm font-medium text-text-secondary bg-white border border-border rounded-lg hover:bg-surface-dim transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleSubmitHours}
                disabled={isSubmittingHours || !hoursInput}
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmittingHours ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    Verifikasi & Buat Sertifikat
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
