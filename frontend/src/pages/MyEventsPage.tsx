import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyRegistrations, type Registration } from '../services/registrationService';
import { useAuthStore } from '../store/authStore';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';
import Badge from '../components/Badge';

export default function MyEventsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (user) {
      getMyRegistrations()
        .then((data) => setRegistrations(data))
        .catch((err) => setError(err.response?.data?.message || 'Gagal memuat daftar event Anda'))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg">
        <p className="mb-4">Silakan login untuk melihat daftar event Anda.</p>
        <Link to="/login" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover">
          Login Sekarang
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-bg">Memuat...</div>;
  }

  return (
    <div className="min-h-screen bg-bg p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Event Saya</h1>
        <p className="text-text-secondary mb-8">Daftar event yang telah Anda daftar dan ikuti.</p>

        {error && <div className="p-4 mb-6 bg-error-container text-on-error-container rounded-lg">{error}</div>}

        {registrations.length === 0 && !error ? (
          <div className="text-center py-20 bg-surface rounded-2xl border border-border">
            <h3 className="text-xl font-semibold text-text-primary mb-2">Belum ada event</h3>
            <p className="text-text-secondary mb-6">Anda belum mendaftar ke event manapun.</p>
            <Link to="/events" className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors">
              Cari Event
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {registrations.map((reg) => (
              <div key={reg.id} className="bg-surface rounded-2xl border border-border overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
                <div className="aspect-[4/3] bg-surface-dim relative overflow-hidden">
                  <img 
                    src={reg.event?.gambarUrl || 'https://via.placeholder.com/600x450?text=Event'} 
                    alt={reg.event?.judul}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge variant={
                      reg.status === 'approved' ? 'success' :
                      reg.status === 'rejected' ? 'danger' : 'primary'
                    }>
                      {reg.status === 'pending' ? 'Menunggu' : reg.status === 'approved' ? 'Diterima' : 'Ditolak'}
                    </Badge>
                  </div>
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  <div className="text-xs text-primary font-medium tracking-wider mb-2 uppercase">
                    {reg.event?.organization?.nama}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-text-primary mb-3 line-clamp-2">
                    {reg.event?.judul}
                  </h3>
                  
                  <div className="space-y-2 mt-auto mb-4">
                    <div className="flex items-center text-sm text-text-secondary">
                      <Calendar size={16} className="mr-2 opacity-70" />
                      {reg.event ? new Date(reg.event.tanggalMulai).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      }) : '-'}
                    </div>
                    <div className="flex items-center text-sm text-text-secondary">
                      <MapPin size={16} className="mr-2 opacity-70" />
                      <span className="truncate">{reg.event?.lokasi}</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-border">
                    <Link 
                      to={`/events/${reg.eventId}`}
                      className="text-primary text-sm font-medium hover:underline flex items-center"
                    >
                      Lihat Detail <ExternalLink size={14} className="ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
