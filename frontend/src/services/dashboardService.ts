import api from './api';

export interface DashboardSummary {
  totalEvents: number;
  activeEvents: number;
  completedEvents: number;
  totalRegistrations: number;
  approvedRegistrations: number;
  pendingRegistrations: number;
  totalUniqueVolunteers: number;
  totalHours: number;
  totalCertificates: number;
}

export interface ParticipationTrendItem {
  month: string;
  year: number;
  registrations: number;
  approvedVolunteers: number;
  hours: number;
  events: number;
}

export interface CategoryDistributionItem {
  category: string;
  eventsCount: number;
  volunteersCount: number;
}

export interface RecentActivityItem {
  id: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
  user: {
    id: string;
    nama: string;
    email: string;
    photoUrl?: string;
  };
  event: {
    id: string;
    judul: string;
    kategori: string;
  };
  volunteerHour?: {
    jumlahJam: number;
    status: 'pending' | 'verified';
  } | null;
}

export const getDashboardSummary = async (organizationId?: string): Promise<DashboardSummary> => {
  const response = await api.get('/dashboard/summary', {
    params: { organizationId },
  });
  return response.data.data;
};

export const getParticipationTrend = async (organizationId?: string): Promise<ParticipationTrendItem[]> => {
  const response = await api.get('/dashboard/participation-trend', {
    params: { organizationId },
  });
  return response.data.data;
};

export const getCategoryDistribution = async (organizationId?: string): Promise<CategoryDistributionItem[]> => {
  const response = await api.get('/dashboard/category-distribution', {
    params: { organizationId },
  });
  return response.data.data;
};

export const getRecentActivities = async (organizationId?: string): Promise<RecentActivityItem[]> => {
  const response = await api.get('/dashboard/recent-activities', {
    params: { organizationId },
  });
  return response.data.data;
};
