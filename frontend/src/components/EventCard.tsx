import { Calendar, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import Badge from './Badge';

export interface EventCardProps {
  id: string;
  judul: string;
  lokasi: string;
  tanggalMulai: string;
  kategori: string;
  kuota: number;
  gambarUrl?: string | null;
  status?: string; // e.g., 'published', 'dibatalkan'
  organization?: {
    nama: string;
    logoUrl?: string | null;
  };
}

export default function EventCard({
  id,
  judul,
  lokasi,
  tanggalMulai,
  kategori,
  kuota,
  gambarUrl,
  status,
  organization,
}: EventCardProps) {
  // Format date
  const dateObj = new Date(tanggalMulai);
  const dateStr = dateObj.toLocaleDateString('id-ID', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const timeStr = dateObj.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Default image if none provided
  const imageUrl =
    gambarUrl && gambarUrl.startsWith('/')
      ? `http://localhost:3000${gambarUrl}`
      : gambarUrl || 'https://via.placeholder.com/400x250?text=Event+Banner';

  return (
    <Link
      to={`/events/${id}`}
      className="group flex flex-col bg-surface border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      {/* Event Image */}
      <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
        <img
          src={imageUrl}
          alt={judul}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant="primary" className="bg-white/90 backdrop-blur-sm border-none shadow-sm">
            {kategori}
          </Badge>
          {status === 'dibatalkan' && (
            <Badge variant="danger" className="bg-white/90 backdrop-blur-sm border-none shadow-sm">
              Dibatalkan
            </Badge>
          )}
          {status === 'selesai' && (
            <Badge variant="success" className="bg-white/90 backdrop-blur-sm border-none shadow-sm">
              Selesai
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Organization Info */}
        {organization && (
          <div className="flex items-center gap-2 mb-3">
            {organization.logoUrl ? (
              <img
                src={
                  organization.logoUrl.startsWith('/')
                    ? `http://localhost:3000${organization.logoUrl}`
                    : organization.logoUrl
                }
                alt={organization.nama}
                className="w-6 h-6 rounded-full object-cover border border-border"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-primary-light flex items-center justify-center">
                <span className="text-primary text-[10px] font-bold">
                  {organization.nama.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <span className="text-sm text-text-secondary truncate">
              {organization.nama}
            </span>
          </div>
        )}

        <h3 className="text-lg font-semibold text-text-primary mb-3 line-clamp-2 leading-snug">
          {judul}
        </h3>

        <div className="mt-auto space-y-2">
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Calendar size={16} className="text-text-muted shrink-0" />
            <span className="truncate">
              {dateStr} • {timeStr}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <MapPin size={16} className="text-text-muted shrink-0" />
            <span className="truncate">{lokasi}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Users size={16} className="text-text-muted shrink-0" />
            <span className="truncate">{kuota > 0 ? `${kuota} Kuota` : 'Kuota Tidak Terbatas'}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
