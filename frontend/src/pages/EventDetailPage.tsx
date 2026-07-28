import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getEventById, type Event } from '../services/eventService';
import { getMyRegistrations, createRegistration, type Registration } from '../services/registrationService';
import { useAuthStore } from '../store/authStore';
import { Calendar, MapPin, Users, ArrowLeft, Building, Share2, X } from 'lucide-react';
import Badge from '../components/Badge';

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [alasan, setAlasan] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (id) {
      const fetchEventData = async () => {
        try {
          const res = await getEventById(id);
          setEvent(res.data);
          
          if (user) {
            const regRes = await getMyRegistrations(id);
            if (regRes && regRes.length > 0) {
              setRegistration(regRes[0]);
            }
          }
        } catch (err: any) {
          setError(err.response?.data?.message || 'Gagal memuat event');
        } finally {
          setIsLoading(false);
        }
      };
      fetchEventData();
    }
  }, [id, user]);

  const handleRegister = async () => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      const newReg = await createRegistration(id, alasan);
      setRegistration(newReg);
      setShowModal(false);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal mendaftar');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Memuat...</div>;
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-danger mb-4">{error || 'Event tidak ditemukan'}</p>
        <Link to="/events" className="text-primary hover:underline">Kembali ke Daftar Event</Link>
      </div>
    );
  }

  const startDate = new Date(event.tanggalMulai);
  const endDate = new Date(event.tanggalSelesai);
  
  const isSameDay = startDate.toDateString() === endDate.toDateString();

  const imageUrl =
    event.gambarUrl && event.gambarUrl.startsWith('/')
      ? `http://localhost:3000${event.gambarUrl}`
      : event.gambarUrl || 'https://via.placeholder.com/1200x500?text=Banner+Event';

  const logoUrl =
    event.organization?.logoUrl && event.organization.logoUrl.startsWith('/')
      ? `http://localhost:3000${event.organization.logoUrl}`
      : event.organization?.logoUrl;

  return (
    <div className="min-h-screen bg-bg pb-20">
      {/* Top Nav (optional, simple back button) */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-border z-40 px-4 lg:px-8 flex items-center justify-between">
        <Link to="/events" className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors font-medium text-sm">
          <ArrowLeft size={18} />
          Kembali
        </Link>
        <button className="p-2 text-text-secondary hover:text-primary transition-colors bg-transparent border-none cursor-pointer">
          <Share2 size={20} />
        </button>
      </nav>

      {/* Hero Banner */}
      <div className="w-full h-[40vh] md:h-[50vh] mt-16 bg-gray-200 relative">
        <img src={imageUrl} alt={event.judul} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 lg:px-8 -mt-20 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Content (Left) */}
          <div className="flex-1">
            <div className="bg-surface rounded-3xl p-6 md:p-10 shadow-sm border border-border mb-8">
              <div className="flex gap-2 mb-4">
                <Badge variant="primary">{event.kategori}</Badge>
                {event.status === 'selesai' && <Badge variant="success">Selesai</Badge>}
                {event.status === 'dibatalkan' && <Badge variant="danger">Dibatalkan</Badge>}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-6 leading-tight">
                {event.judul}
              </h1>

              {/* Organization Snippet */}
              <div className="flex items-center gap-4 py-4 border-y border-border mb-8">
                {logoUrl ? (
                  <img src={logoUrl} alt={event.organization?.nama} className="w-12 h-12 rounded-full object-cover border border-border" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center">
                    <Building className="text-primary" size={24} />
                  </div>
                )}
                <div>
                  <p className="text-sm text-text-muted mb-0.5">Diselenggarakan oleh</p>
                  <p className="font-semibold text-text-primary">{event.organization?.nama}</p>
                </div>
              </div>

              <div className="prose prose-blue max-w-none">
                <h3 className="text-xl font-semibold mb-4 text-text-primary">Tentang Event</h3>
                <p className="text-text-secondary whitespace-pre-wrap leading-relaxed">
                  {event.deskripsi}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar (Right) - Luma style */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="bg-surface rounded-3xl p-6 shadow-sm border border-border sticky top-24">
              
              <div className="space-y-6 mb-8">
                {/* Time */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center shrink-0">
                    <Calendar className="text-primary" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary">
                      {startDate.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    <p className="text-sm text-text-secondary">
                      {startDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      {!isSameDay && ' - selesai'}
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center shrink-0">
                    <MapPin className="text-primary" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary">Lokasi</p>
                    <p className="text-sm text-text-secondary">{event.lokasi}</p>
                  </div>
                </div>

                {/* Quota */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center shrink-0">
                    <Users className="text-primary" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary">Kuota Peserta</p>
                    <p className="text-sm text-text-secondary">
                      {event.kuota === 0 ? 'Tidak Terbatas' : `${event.kuota} Orang`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              {!user ? (
                <Link to="/login" className="w-full py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-hover transition-colors block text-center shadow-sm">
                  Login untuk Daftar
                </Link>
              ) : registration ? (
                <div className="text-center p-3 rounded-xl border border-border bg-surface-dim">
                  <p className="text-sm text-text-secondary mb-1">Status Pendaftaran:</p>
                  <p className="font-semibold text-text-primary capitalize">{registration.status}</p>
                </div>
              ) : (
                <button 
                  disabled={event.status !== 'published' || event.kuota > 0 && event.kuota <= 0 /* TODO real kuota check */}
                  onClick={() => setShowModal(true)}
                  className="w-full py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-none shadow-sm cursor-pointer"
                >
                  {event.status === 'published' ? 'Daftar Sekarang' : 'Pendaftaran Ditutup'}
                </button>
              )}
              
            </div>
          </div>

        </div>
      </div>

      {/* Registration Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-surface w-full max-w-md rounded-2xl p-6 shadow-lg border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-text-primary">Daftar Event</h3>
              <button onClick={() => setShowModal(false)} className="text-text-secondary hover:text-text-primary bg-transparent border-none cursor-pointer">
                <X size={24} />
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-secondary mb-1">Alasan Mengikuti (Opsional)</label>
              <textarea 
                value={alasan}
                onChange={(e) => setAlasan(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary min-h-[100px] resize-y"
                placeholder="Ceritakan sedikit mengapa Anda tertarik..."
              ></textarea>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button 
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg font-medium text-text-secondary hover:bg-surface-dim transition-colors border-none bg-transparent cursor-pointer"
              >
                Batal
              </button>
              <button 
                onClick={handleRegister}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-lg font-medium text-white bg-primary hover:bg-primary-hover transition-colors border-none cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Mengirim...' : 'Kirim Pendaftaran'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
