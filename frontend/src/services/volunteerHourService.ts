import api from './api';

export interface VolunteerHour {
  id: string;
  registrationId: string;
  jumlahJam: number;
  catatan?: string;
  status: 'pending' | 'verified';
  createdAt: string;
  updatedAt: string;
}

export const verifyVolunteerHours = async (
  registrationId: string,
  jumlahJam: number,
  catatan?: string,
): Promise<VolunteerHour> => {
  const response = await api.post(`/volunteer-hours/${registrationId}/verify`, {
    jumlahJam,
    catatan,
  });
  return response.data.data;
};
