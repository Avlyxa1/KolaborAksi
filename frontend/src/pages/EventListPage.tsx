import { useEffect, useState } from 'react';
import { getEvents, type Event } from '../services/eventService';
import EventCard from '../components/EventCard';
import { Search } from 'lucide-react';

export default function EventListPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      // Only fetch published events
      const res = await getEvents({ status: 'published' });
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

  const categories = Array.from(new Set(events.map((e) => e.kategori)));

  const filteredEvents = events.filter((event) => {
    const matchSearch = event.judul.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory ? event.kategori === selectedCategory : true;
    return matchSearch && matchCategory;
  });

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero Section */}
      <section className="bg-primary text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Temukan Aksi Kebaikanmu</h1>
        <p className="text-lg text-primary-light max-w-2xl mx-auto mb-8">
          Jelajahi berbagai kesempatan untuk berkontribusi dan membuat perubahan positif di sekitarmu.
        </p>

        {/* Search & Filter Bar */}
        <div className="max-w-3xl mx-auto bg-white rounded-full p-2 flex flex-col md:flex-row shadow-lg">
          <div className="flex-1 flex items-center px-4 py-2 border-b md:border-b-0 md:border-r border-gray-200">
            <Search className="text-gray-400 mr-2 shrink-0" size={20} />
            <input
              type="text"
              placeholder="Cari event..."
              className="w-full bg-transparent outline-none text-text-primary placeholder:text-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex-1 flex items-center px-4 py-2">
            <select
              className="w-full bg-transparent outline-none text-text-primary text-sm font-medium cursor-pointer"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Semua Kategori</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Event Grid Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-text-primary mb-1">Event Terbaru</h2>
            <p className="text-text-secondary">Pilih dan ikuti event yang sesuai dengan minatmu.</p>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <p className="text-text-muted">Memuat event...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20 bg-surface rounded-2xl border border-border">
            <p className="text-text-secondary mb-2">Tidak ada event yang ditemukan.</p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategory(''); }}
              className="text-primary hover:underline text-sm"
            >
              Reset pencarian
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
