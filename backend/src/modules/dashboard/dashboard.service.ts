import prisma from '../../config/prisma.js';
import { Prisma } from '@prisma/client';

/**
 * Helper to build event filter based on user role and optional organization ID.
 */
async function getScopedEventWhere(userId: string, userRole: string, orgId?: string): Promise<Prisma.EventWhereInput> {
  const where: Prisma.EventWhereInput = {};

  if (userRole === 'panitia') {
    // Panitia only sees events from organizations they own
    const userOrgs = await prisma.organization.findMany({
      where: { ownerId: userId },
      select: { id: true },
    });
    const orgIds = userOrgs.map((o) => o.id);

    if (orgId) {
      if (!orgIds.includes(orgId)) {
        throw new Error('Anda tidak memiliki akses ke organisasi ini');
      }
      where.organizationId = orgId;
    } else {
      where.organizationId = { in: orgIds };
    }
  } else if (userRole === 'admin') {
    // Admin can see everything or filter by specific organization
    if (orgId) {
      where.organizationId = orgId;
    }
  }

  return where;
}

/**
 * Get aggregated summary metrics for the dashboard.
 */
export async function getSummaryStats(userId: string, userRole: string, orgId?: string) {
  const eventWhere = await getScopedEventWhere(userId, userRole, orgId);

  // Total Events & by status
  const totalEvents = await prisma.event.count({ where: eventWhere });
  const activeEvents = await prisma.event.count({
    where: { ...eventWhere, status: 'published' },
  });
  const completedEvents = await prisma.event.count({
    where: { ...eventWhere, status: 'selesai' },
  });

  // Total Volunteers (Registrations)
  const registrationWhere: Prisma.RegistrationWhereInput = {
    event: eventWhere,
  };

  const totalRegistrations = await prisma.registration.count({
    where: registrationWhere,
  });

  const approvedRegistrations = await prisma.registration.count({
    where: { ...registrationWhere, status: 'approved' },
  });

  const pendingRegistrations = await prisma.registration.count({
    where: { ...registrationWhere, status: 'pending' },
  });

  // Unique volunteers
  const uniqueVolunteersGroup = await prisma.registration.groupBy({
    by: ['userId'],
    where: { ...registrationWhere, status: 'approved' },
  });
  const totalUniqueVolunteers = uniqueVolunteersGroup.length;

  // Total Volunteer Hours (verified)
  const verifiedHours = await prisma.volunteerHour.aggregate({
    _sum: {
      jumlahJam: true,
    },
    where: {
      status: 'verified',
      registration: {
        event: eventWhere,
      },
    },
  });
  const totalHours = verifiedHours._sum.jumlahJam ?? 0;

  // Total Certificates Issued
  const totalCertificates = await prisma.certificate.count({
    where: {
      event: eventWhere,
    },
  });

  return {
    totalEvents,
    activeEvents,
    completedEvents,
    totalRegistrations,
    approvedRegistrations,
    pendingRegistrations,
    totalUniqueVolunteers,
    totalHours,
    totalCertificates,
  };
}

/**
 * Get monthly participation trend for the last 6 months.
 */
export async function getParticipationTrend(userId: string, userRole: string, orgId?: string) {
  const eventWhere = await getScopedEventWhere(userId, userRole, orgId);

  const now = new Date();
  const months: { label: string; year: number; month: number; start: Date; end: Date }[] = [];

  // Generate the last 6 months list
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const start = new Date(d.getFullYear(), d.getMonth(), 1);
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
    const label = d.toLocaleDateString('id-ID', { month: 'short' });
    months.push({
      label,
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      start,
      end,
    });
  }

  const trendData = await Promise.all(
    months.map(async (m) => {
      // Registrations in this month
      const registrationsCount = await prisma.registration.count({
        where: {
          event: eventWhere,
          createdAt: {
            gte: m.start,
            lte: m.end,
          },
        },
      });

      // Approved registrations in this month
      const approvedCount = await prisma.registration.count({
        where: {
          event: eventWhere,
          status: 'approved',
          createdAt: {
            gte: m.start,
            lte: m.end,
          },
        },
      });

      // Total verified hours in this month
      const hoursAgg = await prisma.volunteerHour.aggregate({
        _sum: { jumlahJam: true },
        where: {
          status: 'verified',
          registration: {
            event: eventWhere,
          },
          updatedAt: {
            gte: m.start,
            lte: m.end,
          },
        },
      });

      // New events created in this month
      const eventsCount = await prisma.event.count({
        where: {
          ...eventWhere,
          createdAt: {
            gte: m.start,
            lte: m.end,
          },
        },
      });

      return {
        month: m.label,
        year: m.year,
        registrations: registrationsCount,
        approvedVolunteers: approvedCount,
        hours: hoursAgg._sum.jumlahJam ?? 0,
        events: eventsCount,
      };
    }),
  );

  return trendData;
}

/**
 * Get distribution of events and participants across categories.
 */
export async function getCategoryDistribution(userId: string, userRole: string, orgId?: string) {
  const eventWhere = await getScopedEventWhere(userId, userRole, orgId);

  // Group events by category
  const events = await prisma.event.findMany({
    where: eventWhere,
    select: {
      id: true,
      kategori: true,
      registrations: {
        where: { status: 'approved' },
        select: { id: true },
      },
    },
  });

  const categoryMap: Record<string, { category: string; eventsCount: number; volunteersCount: number }> = {};

  events.forEach((ev) => {
    const cat = ev.kategori || 'Lainnya';
    if (!categoryMap[cat]) {
      categoryMap[cat] = {
        category: cat,
        eventsCount: 0,
        volunteersCount: 0,
      };
    }
    categoryMap[cat].eventsCount += 1;
    categoryMap[cat].volunteersCount += ev.registrations.length;
  });

  return Object.values(categoryMap).sort((a, b) => b.eventsCount - a.eventsCount);
}

/**
 * Get recent activity feed (registrations, certificates, events).
 */
export async function getRecentActivities(userId: string, userRole: string, orgId?: string) {
  const eventWhere = await getScopedEventWhere(userId, userRole, orgId);

  const recentRegistrations = await prisma.registration.findMany({
    where: {
      event: eventWhere,
    },
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: { id: true, nama: true, email: true, photoUrl: true },
      },
      event: {
        select: { id: true, judul: true, kategori: true },
      },
      volunteerHour: {
        select: { jumlahJam: true, status: true },
      },
    },
  });

  return recentRegistrations;
}
