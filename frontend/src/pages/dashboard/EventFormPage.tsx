import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrganizations } from '../../services/organizationService';
import { createEvent, type CreateEventData } from '../../services/eventService';

export default function EventFormPage() {
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<CreateEventData>({
    judul: '',
    deskripsi: '',
    lokasi: '',
    tanggalMulai: '',
    tanggalSelesai: '',
    kuota: 0,
    kategori: '',
    organizationId: '',
    status: 'draft',
  });

  const [gambarFile, setGambarFile] = useState<File | null>(null);

  useEffect(() => {
    // For MVP, we fetch all organizations. In real app, fetch orgs owned by user.
    getOrganizations().then((res) => {
      setOrganizations(res.data);
      if (res.data.length > 0) {
        setFormData((prev) => ({ ...prev, organizationId: res.data[0].id }));
      }
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'kuota' ? parseInt(value) || 0 : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setGambarFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.organizationId) {
      alert('Anda harus memiliki organisasi untuk membuat event.');
      return;
    }

    try {
      setIsLoading(true);
      // Ensure date format is iso string if needed, or backend handles it.
      // Zod datetime requires ISO string.
      const payload = {
        ...formData,
        tanggalMulai: new Date(formData.tanggalMulai).toISOString(),
        tanggalSelesai: new Date(formData.tanggalSelesai).toISOString(),
      };

      await createEvent(payload, gambarFile || undefined);
      alert('Event berhasil dibuat!');
      navigate('/dashboard/events');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Terjadi kesalahan saat membuat event');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold text-text-primary mb-1">Buat Event Baru</h1>
      <p className="text-sm text-text-secondary mb-8">Isi detail event yang akan Anda selenggarakan.</p>

      <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Judul Event *</label>
            <input
              type="text"
              name="judul"
              required
              className="w-full px-4 py-2 bg-bg border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-text-primary placeholder:text-text-muted"
              placeholder="Contoh: Aksi Tanam Pohon"
              value={formData.judul}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Penyelenggara (Organisasi) *</label>
            <select
              name="organizationId"
              required
              className="w-full px-4 py-2 bg-bg border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-text-primary"
              value={formData.organizationId}
              onChange={handleChange}
            >
              {organizations.length === 0 && <option value="">Belum ada organisasi</option>}
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>{org.nama}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Deskripsi Event *</label>
            <textarea
              name="deskripsi"
              required
              rows={4}
              className="w-full px-4 py-2 bg-bg border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-text-primary placeholder:text-text-muted resize-y"
              placeholder="Jelaskan detail event..."
              value={formData.deskripsi}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Kategori *</label>
              <input
                type="text"
                name="kategori"
                required
                className="w-full px-4 py-2 bg-bg border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-text-primary"
                placeholder="Contoh: Lingkungan"
                value={formData.kategori}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Lokasi *</label>
              <input
                type="text"
                name="lokasi"
                required
                className="w-full px-4 py-2 bg-bg border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-text-primary"
                placeholder="Contoh: GBK, Jakarta"
                value={formData.lokasi}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Waktu Mulai *</label>
              <input
                type="datetime-local"
                name="tanggalMulai"
                required
                className="w-full px-4 py-2 bg-bg border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-text-primary"
                value={formData.tanggalMulai}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Waktu Selesai *</label>
              <input
                type="datetime-local"
                name="tanggalSelesai"
                required
                className="w-full px-4 py-2 bg-bg border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-text-primary"
                value={formData.tanggalSelesai}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Kuota (0 = Bebas)</label>
              <input
                type="number"
                name="kuota"
                min="0"
                className="w-full px-4 py-2 bg-bg border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-text-primary"
                value={formData.kuota}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Status Publikasi</label>
              <select
                name="status"
                className="w-full px-4 py-2 bg-bg border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-text-primary"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="draft">Draft</option>
                <option value="published">Publish</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Gambar / Banner Event</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-2 bg-bg border border-border rounded-md text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-light file:text-primary hover:file:bg-blue-100 transition-colors"
            />
          </div>
        </div>

        <div className="pt-4 flex items-center justify-end gap-3 border-t border-border">
          <button
            type="button"
            onClick={() => navigate('/dashboard/events')}
            className="px-6 py-2 rounded-md text-sm font-medium text-text-secondary hover:bg-bg transition-colors border-none bg-transparent cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 rounded-md text-sm font-medium text-white bg-primary hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-none shadow-sm cursor-pointer"
          >
            {isLoading ? 'Menyimpan...' : 'Simpan Event'}
          </button>
        </div>
      </form>
    </div>
  );
}
