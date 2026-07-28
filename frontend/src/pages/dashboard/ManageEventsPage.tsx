import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, ExternalLink } from 'lucide-react';
import { getEvents, deleteEvent, updateEventStatus, type Event } from '../../services/eventService';
import Badge from '../../components/Badge';

export default function ManageEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const res = await getEvents();
      setEvents(res.data);
    } catch (error) {
      console.error('Failed to fetch events', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Yakin ingin menghapus event ini?')) return;
    try {
      await deleteEvent(id);
      fetchEvents();
    } catch (error) {
      alert('Gagal menghapus event');
    }
  };

  const handleStatusChange = async (id: string, newStatus: any) => {
    try {
      await updateEventStatus(id, newStatus);
      fetchEvents();
    } catch (error) {
      alert('Gagal merubah status event');
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary mb-1">Kelola Event</h1>
          <p className="text-sm text-text-secondary">Daftar event yang organisasi Anda selenggarakan.</p>
        </div>
        <Link
          to="/dashboard/events/create"
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md font-medium hover:bg-primary-hover transition-colors"
        >
          <Plus size={18} />
          Buat Event
        </Link>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg border-b border-border">
                <th className="py-3 px-4 text-sm font-medium text-text-secondary">Judul Event</th>
                <th className="py-3 px-4 text-sm font-medium text-text-secondary">Kategori</th>
                <th className="py-3 px-4 text-sm font-medium text-text-secondary">Status</th>
                <th className="py-3 px-4 text-sm font-medium text-text-secondary">Tanggal</th>
                <th className="py-3 px-4 text-sm font-medium text-text-secondary text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-text-muted">
                    Memuat data...
                  </td>
                </tr>
              ) : events.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-text-muted">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <CalendarDaysIcon />
                      <p>Belum ada event</p>
                    </div>
                  </td>
                </tr>
              ) : (
                events.map((event) => (
                  <tr key={event.id} className="border-b border-border hover:bg-bg/50 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-medium text-text-primary line-clamp-1">{event.judul}</p>
                      <p className="text-xs text-text-muted">{event.lokasi}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-text-secondary">{event.kategori}</span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          event.status === 'published' ? 'primary' :
                          event.status === 'selesai' ? 'success' :
                          event.status === 'dibatalkan' ? 'danger' : 'warning'
                        }
                      >
                        {event.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-text-secondary">
                        {new Date(event.tanggalMulai).toLocaleDateString('id-ID')}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <select
                          className="text-xs border border-border rounded px-2 py-1 bg-surface text-text-secondary"
                          value={event.status}
                          onChange={(e) => handleStatusChange(event.id, e.target.value)}
                        >
                          <option value="draft">Draft</option>
                          <option value="published">Publish</option>
                          <option value="selesai">Selesai</option>
                          <option value="dibatalkan">Batal</option>
                        </select>
                        <Link
                          to={`/events/${event.id}`}
                          target="_blank"
                          className="p-1.5 text-text-muted hover:text-primary transition-colors"
                          title="Lihat Halaman Publik"
                        >
                          <ExternalLink size={16} />
                        </Link>
                        <button
                          className="p-1.5 text-text-muted hover:text-primary transition-colors cursor-not-allowed opacity-50"
                          title="Edit (Belum Diimplementasi di MVP)"
                          disabled
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="p-1.5 text-text-muted hover:text-danger transition-colors cursor-pointer bg-transparent border-none"
                          title="Hapus"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
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

function CalendarDaysIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-border">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  );
}
