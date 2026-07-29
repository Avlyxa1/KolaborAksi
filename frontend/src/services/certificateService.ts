import api from './api';

export interface CertificateEvent {
  id: string;
  judul: string;
  lokasi: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  kategori: string;
  organization: {
    nama: string;
  };
}

export interface Certificate {
  id: string;
  userId: string;
  eventId: string;
  registrationId: string;
  certificateCode: string;
  createdAt: string;
  event: CertificateEvent;
  registration: {
    volunteerHour: {
      jumlahJam: number;
    } | null;
  };
}

export const getMyCertificates = async (): Promise<Certificate[]> => {
  const response = await api.get('/certificates');
  return response.data.data;
};

export const downloadCertificate = async (certificateId: string): Promise<void> => {
  const response = await api.get(`/certificates/${certificateId}/download`, {
    responseType: 'blob',
  });

  // Create a download link from the blob
  const blob = new Blob([response.data], { type: 'application/pdf' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;

  // Try to get filename from Content-Disposition header
  const contentDisposition = response.headers['content-disposition'];
  let fileName = 'Sertifikat.pdf';
  if (contentDisposition) {
    const match = contentDisposition.match(/filename="?(.+?)"?$/);
    if (match) fileName = match[1];
  }

  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
