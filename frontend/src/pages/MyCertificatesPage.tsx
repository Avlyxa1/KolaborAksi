import { useEffect, useState } from 'react';
import { getMyCertificates, downloadCertificate, type Certificate } from '../services/certificateService';
import { Award, Download, Calendar, MapPin, Building } from 'lucide-react';
import Badge from '../components/Badge';

export default function MyCertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    getMyCertificates()
      .then((data) => setCertificates(data))
      .catch((err) => setError(err.response?.data?.message || 'Gagal memuat sertifikat'))
      .finally(() => setIsLoading(false));
  }, []);

  const handleDownload = async (id: string) => {
    setDownloadingId(id);
    try {
      await downloadCertificate(id);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal mengunduh sertifikat');
    } finally {
      setDownloadingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto p-6 md:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-surface-dim rounded w-48"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-surface-dim rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2 flex items-center gap-2">
          <Award className="text-primary" size={32} />
          Sertifikat Saya
        </h1>
        <p className="text-text-secondary">
          Koleksi sertifikat dari partisipasi kegiatan kerelawanan Anda.
        </p>
      </div>

      {error && (
        <div className="p-4 mb-6 bg-error-container text-on-error-container rounded-lg">
          {error}
        </div>
      )}

      {certificates.length === 0 && !error ? (
        <div className="text-center py-16 px-4 bg-surface rounded-3xl border border-border">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Award size={32} />
          </div>
          <h3 className="text-xl font-bold text-text-primary mb-2">Belum ada sertifikat</h3>
          <p className="text-text-secondary max-w-md mx-auto">
            Anda belum memiliki sertifikat. Ikuti kegiatan kerelawanan dan kumpulkan jam kontribusi untuk mendapatkan sertifikat.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map((cert) => (
            <div 
              key={cert.id} 
              className="group bg-surface rounded-2xl border border-border overflow-hidden hover:border-primary/30 hover:shadow-md transition-all duration-300 flex flex-col"
            >
              {/* Header Card */}
              <div className="p-6 pb-4 border-b border-border/50 flex-1">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <Badge variant="primary" className="mb-2">
                    {cert.event.kategori}
                  </Badge>
                  <span className="text-xs font-medium text-text-muted bg-surface-dim px-2 py-1 rounded-md">
                    {cert.certificateCode}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                  {cert.event.judul}
                </h3>
                <div className="text-sm text-text-secondary flex items-center gap-1 mb-4">
                  <Building size={14} />
                  <span>{cert.event.organization.nama}</span>
                </div>

                <div className="space-y-2 text-sm text-text-secondary">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-text-muted" />
                    <span>
                      {new Date(cert.event.tanggalMulai).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-text-muted" />
                    <span className="truncate">{cert.event.lokasi}</span>
                  </div>
                </div>
              </div>

              {/* Footer Card */}
              <div className="bg-canvas p-4 px-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-text-secondary">Kontribusi:</span>
                  <span className="font-bold text-primary">{cert.registration.volunteerHour?.jumlahJam} jam</span>
                </div>
                
                <button
                  onClick={() => handleDownload(cert.id)}
                  disabled={downloadingId === cert.id}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-xl hover:bg-primary hover:text-white transition-colors disabled:opacity-50"
                >
                  {downloadingId === cert.id ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent group-hover:border-white group-hover:border-t-transparent rounded-full animate-spin" />
                      Mengunduh...
                    </>
                  ) : (
                    <>
                      <Download size={16} />
                      Unduh PDF
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
