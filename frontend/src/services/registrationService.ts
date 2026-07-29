import api from './api';
import { Event } from './eventService';

export type RegistrationStatus = 'pending' | 'approved' | 'rejected';

export interface Registration {
  id: string;
  eventId: string;
  userId: string;
  status: RegistrationStatus;
  alasan?: string;
  createdAt: string;
  updatedAt: string;
  event?: Event;
  user?: {
    id: string;
    nama: string;
    email: string;
    photoUrl?: string;
  };
  volunteerHour?: {
    id: string;
    jumlahJam: number;
    catatan?: string;
    status: 'pending' | 'verified';
  } | null;
  certificate?: {
    id: string;
    certificateCode: string;
  } | null;
}

export const createRegistration = async (eventId: string, alasan?: string): Promise<Registration> => {
  const response = await api.post(`/events/${eventId}/registrations`, { alasan });
  return response.data.data;
};

export const updateRegistrationStatus = async (
  registrationId: string,
  status: 'approved' | 'rejected'
): Promise<Registration> => {
  const response = await api.patch(`/registrations/${registrationId}`, { status });
  return response.data.data;
};

export const getEventRegistrations = async (eventId: string): Promise<Registration[]> => {
  const response = await api.get(`/registrations`, { params: { eventId } });
  return response.data.data;
};

export const getMyRegistrations = async (eventId?: string): Promise<Registration[]> => {
  const response = await api.get('/registrations/me', { params: { eventId } });
  return response.data.data;
};
