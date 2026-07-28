import api from './api';
import type { ApiResponse } from '../types/auth';

export interface Event {
  id: string;
  judul: string;
  deskripsi: string;
  lokasi: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  kuota: number;
  kategori: string;
  gambarUrl: string | null;
  status: 'draft' | 'published' | 'selesai' | 'dibatalkan';
  organizationId: string;
  createdAt: string;
  updatedAt: string;
  organization?: {
    id: string;
    nama: string;
    logoUrl: string | null;
  };
}

export interface CreateEventData {
  judul: string;
  deskripsi: string;
  lokasi: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  kuota: number;
  kategori: string;
  organizationId: string;
  status?: string;
  gambarUrl?: string;
}

export interface EventQuery {
  kategori?: string;
  lokasi?: string;
  status?: string;
  organizationId?: string;
}

export async function createEvent(
  data: CreateEventData,
  gambarFile?: File,
): Promise<ApiResponse<Event>> {
  const formData = new FormData();
  formData.append('judul', data.judul);
  formData.append('deskripsi', data.deskripsi);
  formData.append('lokasi', data.lokasi);
  formData.append('tanggalMulai', data.tanggalMulai);
  formData.append('tanggalSelesai', data.tanggalSelesai);
  formData.append('kuota', data.kuota.toString());
  formData.append('kategori', data.kategori);
  formData.append('organizationId', data.organizationId);
  if (data.status) formData.append('status', data.status);
  if (data.gambarUrl) formData.append('gambarUrl', data.gambarUrl);
  if (gambarFile) formData.append('gambar', gambarFile);

  const response = await api.post<ApiResponse<Event>>('/events', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

export async function getEvents(query?: EventQuery): Promise<ApiResponse<Event[]>> {
  const response = await api.get<ApiResponse<Event[]>>('/events', { params: query });
  return response.data;
}

export async function getEventById(id: string): Promise<ApiResponse<Event>> {
  const response = await api.get<ApiResponse<Event>>(`/events/${id}`);
  return response.data;
}

export async function updateEvent(
  id: string,
  data: Partial<CreateEventData>,
  gambarFile?: File,
): Promise<ApiResponse<Event>> {
  const formData = new FormData();
  if (data.judul) formData.append('judul', data.judul);
  if (data.deskripsi) formData.append('deskripsi', data.deskripsi);
  if (data.lokasi) formData.append('lokasi', data.lokasi);
  if (data.tanggalMulai) formData.append('tanggalMulai', data.tanggalMulai);
  if (data.tanggalSelesai) formData.append('tanggalSelesai', data.tanggalSelesai);
  if (data.kuota !== undefined) formData.append('kuota', data.kuota.toString());
  if (data.kategori) formData.append('kategori', data.kategori);
  if (data.organizationId) formData.append('organizationId', data.organizationId);
  if (data.status) formData.append('status', data.status);
  if (data.gambarUrl) formData.append('gambarUrl', data.gambarUrl);
  if (gambarFile) formData.append('gambar', gambarFile);

  const response = await api.put<ApiResponse<Event>>(`/events/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

export async function updateEventStatus(
  id: string,
  status: 'draft' | 'published' | 'selesai' | 'dibatalkan',
): Promise<ApiResponse<Event>> {
  const response = await api.patch<ApiResponse<Event>>(`/events/${id}/status`, { status });
  return response.data;
}

export async function deleteEvent(id: string): Promise<ApiResponse<null>> {
  const response = await api.delete<ApiResponse<null>>(`/events/${id}`);
  return response.data;
}
