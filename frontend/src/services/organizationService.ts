import api from './api';
import type { ApiResponse } from '../types/auth';

export interface Organization {
  id: string;
  nama: string;
  deskripsi: string;
  logoUrl: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrganizationData {
  nama: string;
  deskripsi: string;
  logoUrl?: string;
}

export async function createOrganization(
  data: CreateOrganizationData,
  logoFile?: File,
): Promise<ApiResponse<Organization>> {
  const formData = new FormData();
  formData.append('nama', data.nama);
  formData.append('deskripsi', data.deskripsi);
  if (data.logoUrl) formData.append('logoUrl', data.logoUrl);
  if (logoFile) formData.append('logo', logoFile);

  const response = await api.post<ApiResponse<Organization>>('/organizations', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

export async function getOrganizations(): Promise<ApiResponse<Organization[]>> {
  const response = await api.get<ApiResponse<Organization[]>>('/organizations');
  return response.data;
}

export async function getOrganizationById(id: string): Promise<ApiResponse<Organization>> {
  const response = await api.get<ApiResponse<Organization>>(`/organizations/${id}`);
  return response.data;
}

export async function updateOrganization(
  id: string,
  data: Partial<CreateOrganizationData>,
  logoFile?: File,
): Promise<ApiResponse<Organization>> {
  const formData = new FormData();
  if (data.nama) formData.append('nama', data.nama);
  if (data.deskripsi) formData.append('deskripsi', data.deskripsi);
  if (data.logoUrl) formData.append('logoUrl', data.logoUrl);
  if (logoFile) formData.append('logo', logoFile);

  const response = await api.put<ApiResponse<Organization>>(`/organizations/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

export async function deleteOrganization(id: string): Promise<ApiResponse<null>> {
  const response = await api.delete<ApiResponse<null>>(`/organizations/${id}`);
  return response.data;
}
